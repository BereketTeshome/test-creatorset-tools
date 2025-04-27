import * as React from "react";
import { Caption } from "@/components/typings/caption";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRef } from "react";
import { setCaptions } from "@/redux/app-slice";

const TagInputResizer = ({
                           parentCaptionData,
                           captionIndex,
                           mode = 'end'
                         }: {
  parentCaptionData: Caption;
  captionIndex: number;
  mode?: 'start' | 'end';
}) => {
  const { captions = [] } = useAppSelector((state) => state?.app);
  const dispatch = useAppDispatch();

  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startX.current = e.clientX;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const offsetX = moveEvent.clientX - startX.current;
      const newCaptions = [...captions];
      if (mode === "end") {
        const newEnd = Math.round((parentCaptionData.end + offsetX / 16 /15) * 100) / 100;

        newCaptions[captionIndex] = {
          ...newCaptions[captionIndex],
          end: newEnd,
        };
      } else {
        const newStart = Math.round((parentCaptionData.start + offsetX / 16 /15) * 100) / 100;

        newCaptions[captionIndex] = {
          ...newCaptions[captionIndex],
          start: newStart,
        };
      }

      // some validations
      if (captionIndex > 0 && newCaptions[captionIndex].start < newCaptions[captionIndex - 1].end) {
        newCaptions[captionIndex].start = newCaptions[captionIndex - 1].end
      }
      if (captionIndex < newCaptions.length - 1 && newCaptions[captionIndex].end > newCaptions[captionIndex + 1].start) {
        newCaptions[captionIndex].end = newCaptions[captionIndex + 1].start
      }

      // Check if the new start or end time is valid
      if (newCaptions[captionIndex].start < 0) {
        newCaptions[captionIndex].start = 0;
      }
      if (newCaptions[captionIndex].end < 0) {
        newCaptions[captionIndex].end = 0;
      }
      if (newCaptions[captionIndex].start > (newCaptions[captionIndex].end - 0.05) ) {
        return
      }

      dispatch(setCaptions(newCaptions));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      className="w-0.5"
      style={{ cursor: "ew-resize" }}
      onPointerDown={handlePointerDown}
    />
  );
};

export default TagInputResizer;
