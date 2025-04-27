import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Caption} from "@/components/typings/caption";
import {
	PIXELS_TO_SECONDS_CONSTANT,
	REMS_TO_PIXELS,
	SECONDS_TO_REM_CONSTANT
} from "@/components/timelineSection/parameters";
import {event} from "@/components/typings/generalInterfaces";
import {onEnterLooseFocus, replaceElementByKey} from "@/utils/helperFunctions";
import {millisecondStringToSeconds, secondsToMilliseconds, timeStringRegEx} from "@/utils/timeConvertionsFunctions";
import TagInputResizer from "@/components/timelineSection/TagInputResizer";

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


export const validateTimeInput = (
	input: string,
	inputType: 'start' | 'end',
	setError: (value: string) => void,
	captionValue: Caption
) => {
	const { start, end } = captionValue;
	const isFormatValid = timeStringRegEx.test(input);

	const isOrderValid =
		inputType === 'start'
			? millisecondStringToSeconds(input) < millisecondStringToSeconds(end.toString())
			: millisecondStringToSeconds(start.toString()) < millisecondStringToSeconds(input);

	!isFormatValid && setError('Invalid format');
	!isOrderValid && setError('Invalid order');
	isFormatValid && isOrderValid && setError('');
	return isFormatValid && isOrderValid;
};

const TagInput = ({
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
	const [text, setText] = useState(tag);
	const currentCaptionWidth =
		(parentCaptionData.end - parentCaptionData.start) * SECONDS_TO_REM_CONSTANT * REMS_TO_PIXELS; //Pixels
	let prevCaptionBlock: Caption = { ...parentCaptionData };
	const defaultTagWidth = `${text.length * 0.55 + 2}rem`;
	const [width, setWidth] = useState(defaultTagWidth);
	//Derived State
	const isDragging = isDraggingData.isDraggingLeft === true || isDraggingData.isDraggingRight === true;

	useEffect(() => {
		setIsActive(() => (isDragging ? true : isActive));
	}, [isDragging]);

	useEffect(() => {
		//updates tag width
		setWidth(defaultTagWidth);
	}, [text]);

	const onUserInput = (setText: (value: string) => void) => (e: event) => {
		const input = e.target.value;
		if (!input.includes(' ')) {
			setText(input);
		} else {
			// setError('No backspaces!');
		}
	};

	const modifyCaptionBlockParameters = (handleType: 'left' | 'right', updatedTagWidth: number) => {
		const runModifyStartValidations = (updatedCaptionBlock: Caption) => {
			if (updatedCaptionBlock.start < 0) return null;
			if (updatedCaptionBlock.start >= updatedCaptionBlock.end) return null;
		};
		const runModifyEndValidations = (updatedCaptionBlock: Caption) => {
			// if (updatedCaptionBlock.end < videoInfo.length) return null;
			if (updatedCaptionBlock.start >= updatedCaptionBlock.end) return null;
		};
		const tagWidth = isOnlyTagInBlock ? currentCaptionWidth : parseFloat(defaultTagWidth) * REMS_TO_PIXELS;
		const tagWidthDif = tagWidth - updatedTagWidth;
		const updatedCaptionBlockWidth = currentCaptionWidth - tagWidthDif;
		const updatedCaptionDuration = updatedCaptionBlockWidth * PIXELS_TO_SECONDS_CONSTANT;
		let updatedCaptionBlock = { ...parentCaptionData };
		if (handleType === 'left') {
			const updatedCaptionStart = formatCaptionTimeInput(parentCaptionData.end - updatedCaptionDuration);
			updatedCaptionBlock = replaceElementByKey(updatedCaptionBlock, 'start', updatedCaptionStart);
			runModifyStartValidations(updatedCaptionBlock);
		} else {
			const updatedCaptionEnd = formatCaptionTimeInput(parentCaptionData.start + updatedCaptionDuration);
			updatedCaptionBlock = replaceElementByKey(updatedCaptionBlock, 'end', updatedCaptionEnd);
			runModifyEndValidations(updatedCaptionBlock);
		}
		setIndicatorTime(handleType === 'left' ? updatedCaptionBlock.start : updatedCaptionBlock.end);
		return (prevCaptionBlock = { ...updatedCaptionBlock });
	};

	const formatCaptionValueForValidation = (caption: Caption) => {
		const result: any = { ...caption };
		result.end = secondsToMilliseconds(result.end).string;
		result.start = secondsToMilliseconds(result.start).string;
		return { ...result };
	};

	const ref = useRef<any>(null);
	const inputRef = useRef<any>(null);
	const refLeft = useRef<any>(null);
	const refRight = useRef<any>(null);

	useEffect(() => {

		let componentIsMounted = true;

		// const onMouseMoveResizeLeft = (event: { clientX: number }) => {
		// 	const dx = event.clientX - x;
		// 	x = event.clientX;
		// 	width = width - dx;
		// 	resizeableEle.style.width = `${width}px`;
		// 	modifyCaptionBlockParameters('left', width);
		// };
		// const onMouseMoveResizeRight = (event: { clientX: number }) => {
		// 	const dx = event.clientX - x;
		// 	x = event.clientX;
		// 	width = width + dx;
		// 	resizeableEle.style.width = `${width}px`;
		// 	modifyCaptionBlockParameters('right', width);
		// };

		// const onMouseUpLeftResize = () => {
		// 	document.removeEventListener('mousemove', onMouseMoveResizeLeft);
		// 	document.removeEventListener('mouseup', onMouseUpLeftResize);
		// 	const formattedCaptionBlock = formatCaptionValueForValidation(prevCaptionBlock);
		// 	const newStartString = secondsToMilliseconds(prevCaptionBlock.start).string;
		// 	// if (validateTimeInput(newStartString, 'start', setError, formattedCaptionBlock))
		// 	// 	updateCaptionBlockParameters(captionIndex, prevCaptionBlock);
		// 	if (componentIsMounted) setIsDragginData(replaceElementByKey(isDraggingData, 'isDraggingLeft', false));
		// 	if (inputRef.current) inputRef.current.blur();
		// };
		// const onMouseUpRightResize = () => {
		// 	document.removeEventListener('mousemove', onMouseMoveResizeRight);
		// 	document.removeEventListener('mouseup', onMouseUpRightResize);
		// 	const formattedCaptionBlock = formatCaptionValueForValidation(prevCaptionBlock);
		// 	const newEndString = secondsToMilliseconds(prevCaptionBlock.end).string;
		// 	// if (validateTimeInput(newEndString, 'end', setError, formattedCaptionBlock))
		// 	// 	updateCaptionBlockParameters(captionIndex, prev  aptionBlock);
		// 	if (componentIsMounted) setIsDragginData(replaceElementByKey(isDraggingData, 'isDraggingRight', false));
		// 	if (inputRef.current) inputRef.current.blur();
		// };
		//
		// const onMouseDownLeftResize = (event: { clientX: number }) => {
		// 	const shouldModifyParameters = tagIndex === 0 || isOnlyTagInBlock;
		// 	if (!shouldModifyParameters) return splitCaptionBlocks('left', tagIndex, captionIndex);
		// 	if (componentIsMounted) setIsDragginData(replaceElementByKey(isDraggingData, 'isDraggingLeft', true));
		// 	x = event.clientX;
		// 	resizeableEle.style.right = styles.right;
		// 	resizeableEle.style.left = null;
		// 	document.addEventListener('mousemove', onMouseMoveResizeLeft);
		// 	document.addEventListener('mouseup', onMouseUpLeftResize);
		// };
		// const onMouseDownRightResize = (event: { clientX: number }) => {
		// 	const shouldModifyParameters = tagIndex === tagArray.length - 1 || isOnlyTagInBlock;
		// 	if (!shouldModifyParameters) return splitCaptionBlocks('right', tagIndex, captionIndex);
		// 	if (componentIsMounted) setIsDragginData(replaceElementByKey(isDraggingData, 'isDraggingRight', true));
		//
		// 	x = event.clientX;
		// 	resizeableEle.style.left = styles.left;
		// 	resizeableEle.style.right = null;
		// 	document.addEventListener('mousemove', onMouseMoveResizeRight);
		// 	document.addEventListener('mouseup', onMouseUpRightResize);
		// };

		// const resizerRight = refRight.current;
		// resizerRight.addEventListener('mousedown', onMouseDownRightResize);
		// const resizerLeft = refLeft.current;
		// resizerLeft.addEventListener('mousedown', onMouseDownLeftResize);
		//
		// return () => {
		// 	resizerRight.removeEventListener('mousedown', onMouseDownRightResize);
		// 	resizerLeft.removeEventListener('mousedown', onMouseDownLeftResize);
		// 	componentIsMounted = false;
		// };
	}, [tagArray]);

	const buttonStyle = {
		border: ' none',
		backgroundColor: ' transparent',
		cursor: ' pointer',
		fontSize: ' 1.5rem',
		width: ' 2.5rem',
		display: ' flex',
		justifyContent: ' center',
		alignItems: ' center',
		color: ' white',
	} as const;

	return (
		<main
			className={`TagContainer h-full max-h-10 mt-3 relative ${isProfane ? 'profane' : ''} flex`}
			style={{ width: isOnlyTagInBlock ? '100%' : width}}
			onBlur={() => setIsActive(() => (isDragging ? true : false))}>
			{/*<div ref={ref} className={`absolute w-full h-full rounded-sm flex justify-center items-center transition-transform duration-200 transform ${isActive ? 'scale-100' : 'scale-0'}`} data-isactive={isActive} style={{ pointerEvents: 'none' }}>*/}
			{/*	<div ref={refLeft} className="absolute bg-gray2 resizer-l rounded-sm" ></div>*/}
			{/*	<div ref={refRight} className='absolute bg-gray2 resizer resizer-r rounded-sm'></div>*/}
			{/*	{isDragging && (*/}
			{/*		<aside className='dragTimeIndicator' data-isleft={isDraggingData.isDraggingLeft}>*/}
			{/*			{secondsToMilliseconds(indicatorTime).string}*/}
			{/*		</aside>*/}
			{/*	)}*/}
			{/*</div>*/}

			<TagInputResizer parentCaptionData={parentCaptionData} captionIndex={captionIndex} mode={"start"} />
			<button
				className='text-white text-sm bg-gray2 rounded-sm px-2 py-1'
				// type='text'
				// value={text}
				ref={inputRef}
				onClick={(e) => {setIsActive(true); onFocus();}}
				style={{ width: isOnlyTagInBlock ? '100%' : width, backgroundColor: isActive ? 'red' : ''  }}
				onBlur={() => {
					if (text !== tag) updateOrDeleteWord(text);
					onBlur();
				}}
				onMouseDown={(e) => e.stopPropagation()}
				onKeyDown={onEnterLooseFocus}
				// onChange={onUserInput(setText)}
			>
				{text}
			</button>
			<TagInputResizer parentCaptionData={parentCaptionData} captionIndex={captionIndex} mode={"end"}/>

		</main>
	);
};

export default TagInput;
