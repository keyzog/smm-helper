import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
	Panel,
	Group,
	Input,
	FormLayout,
	Button,
	Div,
	PromoBanner,
	FixedLayout,
} from "@vkontakte/vkui";
import AppHeader from "../components/AppHeader";

function GetId({ id, go, setView }) {
	const [value, setValue] = useState("https://vk.com/smm_helper_ru");
	const [ads, setAds] = useState(null);

	useEffect(() => {
		async function fetchAds() {
			try {
				bridge.send("VKWebAppGetAds").then((promoBannerProps) => {
					setAds(promoBannerProps);
				});
			} catch (error) {}
		}
		fetchAds();
	}, []);

	const sendData = async () => {
		const { access_token } = await bridge.send("VKWebAppGetAuthToken", {
			app_id: 7686860,
			scope: "",
		});
		const data = await bridge.send("VKWebAppCallAPIMethod", {
			method: "utils.resolveScreenName",
			params: {
				screen_name: value.split("/").pop(),
				v: "5.92",
				access_token: access_token,
			},
		});
		alert(JSON.stringify(data.response));
	};

	return (
		<Panel id={id}>
			<AppHeader {...{ setView, go }} />

			<FormLayout>
				<Input
					top="Адресс страницы"
					placeholder="vk.com/smm_helper_ru"
					value={value}
					onChange={({ target }) => setValue(target.value)}
				/>
			</FormLayout>

			<Group style={{ textAlign: "center", marginBottom: "10px" }}>
				{/* Или выберите списка: */}
				<Div style={{ display: "flex", marginTop: 0 }}>
					<Button
						size="xl"
						stretched
						mode="secondary"
						style={{ marginRight: 8 }}
					>
						Друзья
					</Button>
					<Button size="xl" stretched mode="secondary">
						Группы
					</Button>
				</Div>
			</Group>

			<FormLayout>
				<Button size="xl" onClick={sendData}>
					Узнать ID
				</Button>
			</FormLayout>

			<FixedLayout vertical="bottom">
				{ads && <PromoBanner bannerData={ads} />}
				{!ads && "Нет рекламы"}
			</FixedLayout>
		</Panel>
	);
}

export default GetId;
