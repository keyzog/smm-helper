import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import View from "@vkontakte/vkui/dist/components/View/View";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home.jsx";
import WatchStats from "./panels/WatchStats.jsx";
import Persik from "./panels/Persik";
import {
	Div,
	ModalRoot,
	ModalPage,
	ModalPageHeader,
	Root,
} from "@vkontakte/vkui";
import GetId from "./panels/GetId.jsx";
import SelectGroup from "./panels/SelectGroup.jsx";

const App = () => {
	const [activeView, setActiveView] = useState("home");
	const [activePanel, setActivePanel] = useState("default");
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
	const [activeModal, setActiveModal] = useState(null);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === "VKWebAppUpdateConfig") {
				const schemeAttribute = document.createAttribute("scheme");
				schemeAttribute.value = data.scheme ? data.scheme : "client_light";
				document.body.attributes.setNamedItem(schemeAttribute);
			} else if (type === "VKWebAppAccessTokenReceived") {
				console.log("TOKEN >>", data);
			}
		});
		async function fetchData() {
			const user = await bridge.send("VKWebAppGetUserInfo");
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = (e) => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const setView = (val = "home", activePanel = "default") => {
		setActiveView(val);
		setActivePanel(activePanel);
	};

	const showModal = (e) => {
		setActiveModal(e.currentTarget.dataset.modal);
	};
	const modalBack = (e) => {
		setActiveModal(null);
	};

	const modal = (
		<ModalRoot activeModal={activeModal} onClose={modalBack}>
			<ModalPage
				id="modal-test"
				header={<ModalPageHeader>HI!</ModalPageHeader>}
			>
				<Div>
					<p>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et
						voluptates adipisci nemo consequatur, vero mollitia cumque suscipit,
						commodi sed deserunt asperiores atque officia tempore repellat
						perferendis? Aperiam ex illum voluptatibus.
					</p>
				</Div>
			</ModalPage>
		</ModalRoot>
	);

	return (
		<Root activeView={activeView}>
			<View id="home" activePanel={activePanel} popout={popout} modal={modal}>
				<Home
					id="default"
					fetchedUser={fetchedUser}
					go={go}
					setView={setView}
					showModal={showModal}
				/>
				<GetId id="get-id" {...{ go }} />
				<WatchStats id="watch-stats" go={go} />
				<Persik id="persik" go={go} />
				<Persik id="tools" go={go} />
			</View>

			<View id="get-id" activePanel={activePanel}>
				<GetId id="default" {...{ go, setView }} />
				<WatchStats id="watch-stats" go={go} />
			</View>

			<View id="watch-stats" activePanel={activePanel}>
				<WatchStats id="default" {...{ go, setView }} />
				<SelectGroup id="select-group" {...{ go, setView }} />
			</View>
		</Root>
	);
};

export default App;
