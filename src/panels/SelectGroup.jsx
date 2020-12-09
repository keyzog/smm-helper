import React, { useState, useEffect } from "react";
import {
	SimpleCell,
	Avatar,
	PanelHeaderBack,
	FormLayout,
	Input,
} from "@vkontakte/vkui";
import { Group, PanelHeader, Panel } from "@vkontakte/vkui";

import bridge from "@vkontakte/vk-bridge";

const SelectGroup = ({ id, go }) => {
	const [value, setValue] = useState("https://vk.com/smm_helper_ru");
	const [userGroups, setUserGroups] = useState([]);

	const [token, setToken] = useState(null);
	useEffect(() => {
		async function getToken() {
			const { access_token } = await bridge.send("VKWebAppGetAuthToken", {
				app_id: 7686860,
				scope: "groups",
			});
			setToken(access_token);
		}
		getToken();
	}, []);

	useEffect(() => {
		if (!token) return;

		async function fetchGroups() {
			const { response } = await bridge.send("VKWebAppCallAPIMethod", {
				method: "groups.get",
				params: {
					extended: 1,
					v: "5.92",
					access_token: token,
				},
			});
			setUserGroups(response.items);
		}

		fetchGroups();
	}, [token]);

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="default" />}>
				smm-helper
			</PanelHeader>

			<FormLayout>
				<Input
					top="Ссылка на группу"
					placeholder="vk.com/smm_helper_ru"
					value={value}
					onChange={({ target }) => setValue(target.value)}
				/>
			</FormLayout>

			<Group>
				{userGroups.map((group) => (
					<SimpleCell
						expandable
						before={<Avatar mode="app" src={group.photo_100} />}
						description={`@${group.screen_name}`}
					>
						{group.name}
					</SimpleCell>
				))}
			</Group>
		</Panel>
	);
};

export default SelectGroup;
