import * as React from 'react';
import Waveform from './waveform/Waveform';
import { getTagsComponentWidth, renderTimelineIcons, renderTimeStamps } from './renderModel';
import ProfaneTag from './ProfaneTag';
import TimeTracker from './timeTracker/TimeTracker';
import { useEffect } from 'react';
import {Caption} from "@/components/typings/caption";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {SECONDS_TO_REM_CONSTANT} from "@/components/profanity-muter-tool/timelineSection/parameters";


async function getBlobDuration(blob): Promise<number> {
	const tempVideoEl = document.createElement('video');
	tempVideoEl.crossOrigin = "anonymous"; // Set crossOrigin to anonymous

	const durationP = new Promise<number>((resolve, reject) => {
		tempVideoEl.addEventListener('loadedmetadata', () => {
			// Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
			if (tempVideoEl.duration === Infinity) {
				tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER;
				tempVideoEl.ontimeupdate = () => {
					tempVideoEl.ontimeupdate = null;
					resolve(Number(tempVideoEl.duration));
					tempVideoEl.currentTime = 0;
				};
			} else {
				// Normal behavior
				resolve(Number(tempVideoEl.duration));
			}
		});

		tempVideoEl.onerror = (event) => {
			console.error('Error while loading the video', event);
			reject(0);
		}
	});

	// Set the source of the video element
	tempVideoEl.src = typeof blob === 'string' || blob instanceof String
		? String(blob)
		: window.URL.createObjectURL(blob);

	return durationP;
}

type TimelineSectionType = {
	captionsArray: Caption[];
	updateOrDeleteWord: (captionIndex: number, wordIndex: number) => (value: string) => void;
	updateProfaneBool: (captionIndex: number, wordIndex: number) => (value: boolean) => void;
	videoRef: HTMLVideoElement | null;
	updateArray: (indexToChange: number, newObj: Caption) => void;
	splitCaptionBlocks: (handleType: 'left' | 'right', wordIndex: number, captionIndex: number) => void;
	onTagInputFocus: (captionIndex: number, wordIndex: number) => void;
	onTagInputBlur: () => void;
	src: string;
};


async function getVideoDuration(blobUrl: string) {
	return await getBlobDuration(blobUrl);
}

const TimelineSection = ({
	captionsArray,
	videoRef,
	updateArray,
	updateOrDeleteWord,
	splitCaptionBlocks,
	updateProfaneBool,
	onTagInputFocus,
	onTagInputBlur,
	src,
}: TimelineSectionType) => {

	const [videoDuration, setVideoDuration] = React.useState<number>(0);
	const {isMobile, isTablet, isDesktop} = useScreenDetector()

	useEffect(() => {
		const getVideoDurationAsync = async function () {
			const duration  = await getVideoDuration(src);
			console.log('Video Duration', duration)
			setVideoDuration(duration)
		}
		console.log('src', src)
		if (src) {
			getVideoDurationAsync()
		}
	}, [src]);



	const scrollRef = React.useRef<HTMLDivElement>(null);
	const width = getTagsComponentWidth(videoDuration);

	console.log('VideoRef', videoRef)
	console.log('src', src)

	if (!captionsArray || captionsArray.length === 0) {
		console.log('TimelineSection: No captionsArray')
		return null;
	}

	// const [selectedPercentage, setSelectedPercentage] = React.useState<number>(0);

	const updateTimeTrackerPosition = (e: any) => {
		let result =  e.nativeEvent.offsetX / (videoDuration * SECONDS_TO_REM_CONSTANT * 16);
		const percentage = Math.min(Math.max(result, 0), 100);
		videoRef!.currentTime = percentage * videoDuration
	};

	if (!videoDuration || !src) return null;
//calc(100vw - 390px)
	return (
		<main
			className={`CTool_Timeline-Component h-24 mt-3 block overflow-x-auto ${isDesktop ? 'max-w-[calc(1400px-340px)]' : ''}`}>

			<style jsx>{`
				.TTags_Component {
					transform: rotateX(180deg);
				}
				
				.Content {
					transform: rotateX(180deg);
				}

			`}</style>
			{renderTimelineIcons()}
			<aside className="TimelineSection h-full">

				<main
					className="TTags_Component h-full overflow-x-auto relative"
					ref={scrollRef}
				>
					<div className="Content">
						<header
							className="h-1/4 flex items-center cursor-pointer justify-between px-4 text-gray border-b-red pb-14"
							style={{width}} // Dynamically apply calculated width
							onMouseDown={updateTimeTrackerPosition}
						>
							{renderTimeStamps(videoDuration, videoRef)}
						</header>
						<TimeTracker
							currentTime={videoRef.currentTime}
							videoDuration={videoDuration}
							scrollRef={scrollRef}
						/>
						<ProfanityDetectedContainer
							width={width} // Ensure this width matches dynamic content width
							onMouseDown={updateTimeTrackerPosition}
							captionsArray={captionsArray}
							splitCaptionBlocks={splitCaptionBlocks}
							updateFunctions={{
								updateArray,
								updateOrDeleteWord,
								updateProfaneBool,
							}}
							onTagInputBlur={onTagInputBlur}
							onTagInputFocus={onTagInputFocus}
						/>
					</div>
				</main>
			</aside>
		</main>
	);
};

export default TimelineSection;

type CaptionContainerType = {
	width: string;
	captionsArray: Caption[];
	onMouseDown: (e: any) => void;
	updateFunctions: {
		updateArray: (indexToChange: number, newObj: Caption) => void;
		updateOrDeleteWord: (captionIndex: number, wordIndex: number) => (value: string) => void;
		updateProfaneBool: (captionIndex: number, wordIndex: number) => (value: boolean) => void
	};
	splitCaptionBlocks: (handleType: 'left' | 'right', wordIndex: number, captionIndex: number) => void;
	onTagInputFocus: (captionIndex: number, wordIndex: number) => void;
	onTagInputBlur: () => void;
};

const ProfanityDetectedContainer = ({
														width,
														captionsArray,
														updateFunctions,
														splitCaptionBlocks,
														onTagInputBlur,
														onTagInputFocus,
														onMouseDown
													}: CaptionContainerType) => {
	const {updateArray, updateOrDeleteWord, updateProfaneBool} = updateFunctions;

	return (
		<footer className='TTags_CaptionsContainer h-1/4 flex items-center cursor-pointer' style={{width}}
						onMouseDown={onMouseDown}>
			{captionsArray.map((x,i) => ({...x, originalIndex: i})).filter(x => x.profanity).map((caption) => {
				const captionBlockInterval = caption.end - caption.start;
				const tagArray = caption.text.split(' ');
				const captionIndex = caption.originalIndex;
				const isProfane = caption.profanity;

				return (
					<main
						className='TTags_CaptionBlock absolute left-0 top-8 flex justify-around whitespace-nowrap'
						key={`${caption.start}${caption.end}${caption.text}`}
						style={{
							width: getTagsComponentWidth(captionBlockInterval),
							left: `${caption.start * SECONDS_TO_REM_CONSTANT}rem`,
						}}>
						{tagArray.map((tag: string, wordIndex: number) => {
							return (
								<ProfaneTag
									key={`${tag}${captionIndex}${wordIndex}`}
									data={{
										tag: tag,
										tagArray,
										tagIndex: wordIndex,
										isOnlyTagInBlock: tagArray.length === 1,
										captionIndex,
									}}
									isProfane={isProfane || false}
									splitCaptionBlocks={splitCaptionBlocks}
									updateOrDeleteWord={updateOrDeleteWord(captionIndex, wordIndex)}
									updateProfaneBool={updateProfaneBool(captionIndex, wordIndex)}
									parentCaptionData={caption}
									updateCaptionBlockParameters={updateArray}
									onBlur={() => onTagInputBlur()}
									onFocus={() => {onTagInputFocus(captionIndex, wordIndex)}}
								/>
							);
						})}
					</main>
				);
			})}
		</footer>
	);
};
