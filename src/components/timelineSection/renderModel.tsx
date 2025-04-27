import * as React from 'react';
import {secondsToMinutes} from "@/utils/timeFunctions";
import {SECONDS_TO_REM_CONSTANT} from "@/components/timelineSection/timeTracker/TimeTracker";
// import {BsClockHistory, BsSoundwave} from 'react-icons/bs';
// import {MdTextFields} from 'react-icons/md';

export const renderTimelineIcons = () => {
	return (
		<div className='CTool_TimelineSection-Icons'>
			{/*<i>*/}
			{/*	<BsClockHistory />*/}
			{/*</i>*/}
			{/*<i>*/}
			{/*	<MdTextFields />*/}
			{/*</i>*/}
			{/*<i>*/}
			{/*	<BsSoundwave />*/}
			{/*</i>*/}
		</div>
	);
};

export const renderTimeStamps = (
	end: number,
	videoRef: HTMLVideoElement | null,
	MIN_INTERVAL_BEFORE_STAMPS = 1, //seconds
	TIME_BETWEEN_STAMPS = 1 //seconds
) => {
	if (!(end >= MIN_INTERVAL_BEFORE_STAMPS)) return null;
	const timestampsQty = Math.floor(end / TIME_BETWEEN_STAMPS);
	return Array(timestampsQty + 1)
		.fill('filler')
		.map((item, index) => {
			const position = index;
			const stampContent = secondsToMinutes(TIME_BETWEEN_STAMPS * position);
			return [<aside className='text-sm cursor-default' key={index} onMouseDown={(e) => {
				e.stopPropagation();
				videoRef!.currentTime = position;
			}}>{stampContent}
			</aside>, rulerLine, rulerLine, rulerLine, rulerLine];
		});
};

const rulerLine = <div className='bg-gray2 py-1.5' style={{width: '1px'}}/>

export const getTagsComponentWidth = (interval: number) => {
	const result = interval * SECONDS_TO_REM_CONSTANT;
	return `${result}rem`;
};
