import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Caption} from "@/components/typings/caption";
import {
	PIXELS_TO_SECONDS_CONSTANT,
	REMS_TO_PIXELS,
	SECONDS_TO_REM_CONSTANT
} from "@/components/profanity-muter-tool/timelineSection/parameters";
import {event} from "@/components/typings/generalInterfaces";
import {onEnterLooseFocus, replaceElementByKey} from "@/utils/helperFunctions";
import {millisecondStringToSeconds, secondsToMilliseconds, timeStringRegEx} from "@/utils/timeConvertionsFunctions";
import {CircleAlertIcon} from "lucide-react";

type TagInputType = {
	data: { tag: string; tagArray: string[]; tagIndex: number; isOnlyTagInBlock: boolean; captionIndex: number };
	updateOrDeleteWord: (value: string) => void;
	updateProfaneBool: (value: boolean)=> void
	updateCaptionBlockParameters: (indexToChange: number, newObj: Caption) => void;
	parentCaptionData: Caption;
	splitCaptionBlocks: (handleType: 'left' | 'right', wordIndex: number, captionIndex: number) => void;
	isProfane: boolean;
	onFocus: () => void;
	onBlur: () => void;
};

type DragingDataType = { isDraggingLeft: boolean; isDraggingRight: boolean };

export const formatCaptionTimeInput = (time: number) => {
	return millisecondStringToSeconds(secondsToMilliseconds(time).string);
};


const ProfaneTag = ({
	data,
	updateOrDeleteWord,
	updateCaptionBlockParameters,
	parentCaptionData,
	updateProfaneBool,
	splitCaptionBlocks,
	isProfane,
	onFocus,
	onBlur,
}: TagInputType) => {
	const { tag, tagArray, tagIndex, isOnlyTagInBlock, captionIndex } = data;
	//Context
	// const setError = React.useContext(SetErrorContext);
	// const videoInfo = React.useContext(SelectedVideoDataContext);
	//Component dragging state
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isDraggingData, setIsDragginData] = useState<DragingDataType>({
		isDraggingLeft: false,
		isDraggingRight: false,
	});
	const [indicatorTime, setIndicatorTime] = useState<number>(0);
	//Component info state
	//Derived State
	const isDragging = isDraggingData.isDraggingLeft === true || isDraggingData.isDraggingRight === true;

	useEffect(() => {
		setIsActive(() => (isDragging ? true : isActive));
	}, [isDragging]);

	const onUserInput = (setText: (value: string) => void) => (e: event) => {
		const input = e.target.value;
		if (!input.includes(' ')) {
			setText(input);
		} else {
			// setError('No backspaces!');
		}
	};


	const inputRef = useRef<any>(null);


	return (
		<main
			className={`TagContainer h-full max-h-10 mt-3 relative ${isProfane ? 'profane' : ''}`}
			onBlur={() => setIsActive(() => (isDragging))}>
			<button
				className='text-white text-sm rounded-xxl px-2 py-1'
				ref={inputRef}
				onClick={(e) => {setIsActive(true); onFocus();}}
				onBlur={() => {
					onBlur();
				}}
				onMouseDown={(e) => e.stopPropagation()}
				onKeyDown={onEnterLooseFocus}
			>
				<CircleAlertIcon className="text-red"/>
			</button>
		</main>
	);
};

export default ProfaneTag;
