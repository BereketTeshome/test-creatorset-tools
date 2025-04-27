import * as React from 'react';
import {useEffect} from 'react';
import {motion as m} from 'framer-motion';

export const ifSingleDigitPrependZero = (number) => {
	if (number >= 0 && number <= 9) {
		return (number = `0${number}`);
	}
	return number;
};

export const SECONDS_TO_REM_CONSTANT = 15; //rem;

export const secondsToMilliseconds = (timeInput: number) => {
	const milliseconds = timeInput.toFixed(3).slice(-3);
	let minutes = ifSingleDigitPrependZero(Math.floor(timeInput / 60));
	let seconds = ifSingleDigitPrependZero(Math.floor(timeInput - minutes * 60));
	return {
		number: timeInput,
		string: `${minutes}:${seconds}:${milliseconds}`,
	};
};

type TimeTrackerType = { videoDuration: number, currentTime: number, scrollRef: React.RefObject<HTMLDivElement> } ;

const TimeTracker = ({ videoDuration, currentTime, scrollRef }: TimeTrackerType) => {
	const trackerRef = React.useRef<HTMLDivElement>(null);
	const durationString = secondsToMilliseconds(videoDuration).string.slice(0, 5);
	const currentTimeString = secondsToMilliseconds(currentTime).string.slice(0, 5);
	//Derivated state
	let position = currentTime * SECONDS_TO_REM_CONSTANT;


	const IGNORE_SCROLL_DIFF_RANGE = window.innerWidth/1.5;
	useEffect(() => {
		if (trackerRef !== null) {
			const newPosition = (currentTime*15*16) - (window.innerWidth / 2) + IGNORE_SCROLL_DIFF_RANGE / 2;
			if (Math.abs(scrollRef.current!.scrollLeft - newPosition ) > IGNORE_SCROLL_DIFF_RANGE) {
				scrollRef.current!.scrollTo({
					left: newPosition,
				});
			}
		}
	}, [currentTime]);

	return (
		<m.div
			initial={{ left: `0rem` }}
			animate={{ left: `${position}rem` }}
			transition={{ duration: 0.3, type: 'ease' }}
			ref={trackerRef}
			onClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
			}}
			className='TTracker_Component absolute left-0 bottom-0 w-24 h-full cursor-pointer pointer-events-none'>
			<aside className='Line flex flex-col justify-between h-full w-px bg-red relative mr-1 items-center'>
				<header>
					<section className='ValuesContainer cursor-default text-white font-semibold w-full h-[10px] rounded-full text-s'>
						{currentTimeString} <mark className="bg-transparent text-inherit ml-1 opacity-60">{durationString}</mark>
					</section>
					<div className='Triangle bg-red cursor-default w-[0.7rem] h-[0.8rem] mt-[-2px] absolute left-[-5px] top-0' style={{
						clipPath: 'polygon(51% 95%, 0 0, 100% 0)'
					}}></div>
				</header>
				<div className='Circle w-[7px] h-[7px] rounded-full bg-red'></div>
			</aside>
		</m.div>
	);
};

export default TimeTracker;
