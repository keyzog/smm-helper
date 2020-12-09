import React from "react";
import config from "../helpers/config.js";
import { Panel, PanelHeader, Group, Cell, Div, CardGrid, Header, Card } from "@vkontakte/vkui";

const Home = ({ id, showModal, setView }) => {
	const popular = config.tools;

	return (
		<Panel id={id}>
			<PanelHeader>smm-helper</PanelHeader>

			<Group separator="hide">
				<Header mode="secondary">Популярные инструменты</Header>
				<CardGrid>
					{popular.map((tools, i) => (
						<Card size="l" style={{ height: 96 }} key={tools.title} onClick={() => setView(tools.id)}>
							<Cell expandable before={tools.icon}>
								<b>{tools.title}</b>
							</Cell>
							<Div style={{ paddingTop: 0, fontSize: ".9rem", color: "gray" }}>{tools.desc}</Div>
						</Card>
					))}
				</CardGrid>
			</Group>
		</Panel>
	);
};

export default Home;
