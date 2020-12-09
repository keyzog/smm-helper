import React, { useState, useEffect } from "react";
import { SimpleCell, Avatar, Link, FormLayout, Button } from "@vkontakte/vkui";
import { Header, Group, Panel } from "@vkontakte/vkui";

import bridge from "@vkontakte/vk-bridge";
import AppHeader from "../components/AppHeader";

import Icon20LikeOutline from "@vkontakte/icons/dist/20/like_outline";
import Icon20CommentOutline from "@vkontakte/icons/dist/20/comment_outline";
import Icon20ShareOutline from "@vkontakte/icons/dist/20/share_outline";
import Icon20UsersOutline from "@vkontakte/icons/dist/20/users_outline";

const WatchStats = ({ id, go, setView }) => {
	const [token, setToken] = useState(null);
	const [groupsId] = useState([
		22751485,
		26964905,
		199511732,
		123770875,
		93401495,
		120056856,
		57846937,
	]);
	const [groups, setGroups] = useState([]);
	const [stats, setStats] = useState([]);

	useEffect(() => {
		async function getToken() {
			const { access_token } = await bridge.send("VKWebAppGetAuthToken", {
				app_id: 7686860,
				scope: "stats",
			});
			setToken(access_token);
		}
		getToken();
	}, []);

	/**
	 * Получаем инфу о группах
	 */
	useEffect(() => {
		if (token === null) return;

		async function fetchStats(i = 0) {
			try {
				const stats = await bridge.send("VKWebAppCallAPIMethod", {
					method: "stats.get",
					params: {
						group_id: groupsId[i],
						intervals_count: 30, // 1 day
						stats_groups: "activity",
						extended: 0,
						v: "5.92",
						access_token: token,
					},
				});

				let day = 0;
				let week = 0;
				let month = 0;

				stats.response.forEach((stat, i) => {
					let data =
						(stat.activity?.subscribed || 0) -
						(stat.activity?.unsubscribed || 0);
					month += data;
					if (i <= 6) week += data;
					if (i === 0) day = data;
				});

				let data = {
					...stats.response[0].activity,
					day,
					week,
					month,
				};

				setStats((os) => [...os, data]);

				if (groupsId.length >= i + 1) {
					setTimeout(() => {
						fetchStats(i + 1);
					}, 100);
				}
			} catch (error) {
				setStats((os) => [...os, false]);
				if (groupsId.length >= i + 1) {
					setTimeout(() => {
						fetchStats(i + 1);
					}, 100);
					return;
				}
			}
		}

		async function fetchData() {
			const data = await bridge.send("VKWebAppCallAPIMethod", {
				method: "groups.getById",
				params: {
					group_ids: groupsId.join(","),
					fields: "members_count",
					v: "5.92",
					access_token: token,
				},
			});
			setGroups(data.response);
			fetchStats();
		}
		fetchData();
	}, [token, groupsId]);

	return (
		<Panel id={id}>
			<AppHeader {...{ setView, go }} />

			{/* <Group>
				<Div>
					<p>Вы не добавили еще не одной группы для отслеживания статистики</p>
					<p>Зачем нужен этот интсрумент?</p>
				</Div>
			</Group> */}

			<Group>
				<Header mode="secondary">Отслеживаемые группы</Header>

				<FormLayout>
					<Button size="xl" onClick={go} data-to="select-group">
						Добавить группу
					</Button>
				</FormLayout>

				{groups.map((group, i) => (
					<SimpleCell
						expandable
						style={{ borderBottom: "1px solid #ddd" }}
						before={<Avatar mode="app" size={62} src={group.photo_100} />}
					>
						<Link href={`https://vk.com/stats?gid=` + group.id} target="_blank">
							<b style={{ marginLeft: "4px" }}>{group.name}</b>

							{stats[i] === false && (
								<div
									style={{
										fontSize: "0.85rem",
										color: "red",
										paddingLeft: "3px",
									}}
								>
									Статистика недоступна
								</div>
							)}

							{stats[i] && (
								<>
									<div
										style={{
											fontSize: "0.85rem",
											color: "#999",
											display: "flex",
										}}
									>
										<Icon20UsersOutline style={{ marginRight: "2px" }} />
										<span style={{ color: "green" }}>
											+{stats[i]?.subscribed || 0}
										</span>{" "}
										<span style={{ color: "red", margin: "0 4px" }}>
											-{stats[i]?.unsubscribed || 0}
										</span>{" "}
										<span
											style={{
												color: "cornflowerblue",
												padding: "0 3px",
											}}
										>
											<b>д:{stats[i]?.day}</b> н:{stats[i]?.week} м:
											{stats[i]?.month}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											fontSize: "0.85rem",
											color: "#999",
										}}
									>
										<Icon20LikeOutline style={{ marginRight: "2px" }} />{" "}
										{stats[i]?.likes || 0}
										<Icon20CommentOutline
											style={{ marginLeft: "10px", marginRight: "2px" }}
										/>{" "}
										{stats[i]?.comments || 0}
										<Icon20ShareOutline
											style={{ marginLeft: "10px", marginRight: "2px" }}
										/>{" "}
										{stats[i]?.copies || 0}
									</div>
								</>
							)}
						</Link>
					</SimpleCell>
				))}
			</Group>
		</Panel>
	);
};

export default WatchStats;
