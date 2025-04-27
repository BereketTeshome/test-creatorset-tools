import * as React from 'react';
import {CigaretteIcon, CigaretteOffIcon} from "lucide-react";

type CensoredButtonType = {
	onClick: () => void;
	isUsingCensored: boolean;
};

export const toggleCensored =
	(videoContainerRef: HTMLElement | null) => () => {
		if (document.fullscreenElement == null) {
			videoContainerRef?.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	};

const CensoredButton = ({ onClick, isUsingCensored }: CensoredButtonType) => {
	return (
		// <Tooltip title={isUsingCensored ? 'NFSW Mode' : 'Censored Mode'}>
			<button onClick={onClick}>
				{isUsingCensored ? <CigaretteOffIcon /> : <CigaretteIcon />}
			</button>
		// </Tooltip>
	);
};

export default CensoredButton;
