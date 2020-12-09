import React from "react";
import { PanelHeader, PanelHeaderButton } from "@vkontakte/vkui";

import Icon28HomeOutline from "@vkontakte/icons/dist/28/home_outline";

const AppHeader = ({ go, setView }) => {
	return (
		<PanelHeader
			left={
				// <PanelHeaderBack onClick={go} data-to="home" />
				<PanelHeaderButton onClick={() => setView()}>
					<Icon28HomeOutline />
				</PanelHeaderButton>
			}
		>
			smm-helper
		</PanelHeader>
	);
};

export default AppHeader;
