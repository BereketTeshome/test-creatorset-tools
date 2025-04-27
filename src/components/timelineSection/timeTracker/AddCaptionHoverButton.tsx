// generate the AddCaptionHoverButton component
import React from 'react';
import {useHover} from "@/components/ui/use-hook";
import {setCaptions} from "@/redux/app-slice";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import {Caption} from "@/components/typings/caption";
import {PlusIcon} from "lucide-react";

export const AddCaptionHoverButton = ({hovered, timeTrackerCurrentTime}: {hovered: any, timeTrackerCurrentTime: number}) => {


	const { captions = [] } = useAppSelector((state) => state?.app);
	const dispatch = useAppDispatch();
	const [buttonRef, hoveredInside] = useHover({delay: 0})
	const [buttonLongerRef, hoveredInsideForLonger] = useHover({delay: 300})

	return (
		<div
			style={{
				opacity: hovered || hoveredInside ? 1 : 0,
				transform: hovered || hoveredInside ? 'scale(1)' : 'scale(0)',
				cursor: 'cell',
			}}
			ref={buttonRef}

			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();

				console.log("Added Caption Hover", timeTrackerCurrentTime)
				timeTrackerCurrentTime = Math.round(timeTrackerCurrentTime * 100) / 100
				const newCaption: Caption = {
					start: timeTrackerCurrentTime,
					end: timeTrackerCurrentTime + 0.5,
					text: '[NEW]',
					profanity: false,
				};

				const clonedCaptions = [...captions]; // shallow clone

				let captionInserted = false;
				for (let i = 0; i < captions.length; i++) {
					console.log('captions[i].start', captions[i].start)
					if (captions[i].start > timeTrackerCurrentTime) {
						clonedCaptions.splice(i, 0, newCaption);
						captionInserted = true
						break;
					}
				}

				if (!captionInserted) {
					clonedCaptions.splice(clonedCaptions.length, 0, newCaption);
				}


				dispatch(setCaptions(clonedCaptions));
			}}
		>
			<button
				ref={buttonLongerRef}
        className="bg-red text-white font-semibold text-sm rounded-full px-2 py-2 transition-all duration-300 ease-in-out "
				style={{
					width: hoveredInside ? '120px' : '35px'
				}}
			>
				<div className="flex">
					<PlusIcon size={20}/> {hoveredInsideForLonger && hoveredInside ? 'Add Caption' : ''}
				</div>
			</button>
		</div>
	);
};
