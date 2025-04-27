"use client";
import React, { useRef, useState, useEffect } from "react";
import { drawSubtitleFrame } from "@/lib/core/subtitle-drawing-util";
import { TextStylingSettings } from "@/components/typings/text-styling-settings";
import { Caption } from "@/components/typings/caption";

const BeforeAfterWidget = ({
  imageSrc,
  subtitles,
  textStylingSettings,
}: {
  imageSrc: string;
  subtitles: Caption[];
  textStylingSettings: TextStylingSettings;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dividerPosition, setDividerPosition] = useState(50); // Default divider at 50%

  // Draw the caption on the canvas
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const container = containerRef.current!;

    // Set canvas size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Clear the canvas and draw subtitles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSubtitleFrame({
      subtitles,
      isPreview: true,
      currentTime: 0,
      ctx,
      canvas,
      textStylingSettings,
      scaleFactor: 1,
      isPaidUser: true,
    });
  }, [dividerPosition, subtitles, textStylingSettings]);

  // Helper to handle dragging
  const handleDrag = (clientX: number) => {
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const position = Math.max(4, Math.min((offsetX / rect.width) * 100, 95)); // Clamp between 0% and 100%
    setDividerPosition(position);
  };

  // Start dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const isTouch = e.type === "touchstart";
    const clientX = isTouch
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;

    handleDrag(clientX);

    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      const moveClientX =
        event instanceof TouchEvent
          ? event.touches[0].clientX
          : (event as MouseEvent).clientX;
      handleDrag(moveClientX);
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("touchend", handleDragEnd);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[375px] h-[533px] bg-black touch-none overflow-visible rounded-2xl"
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover scale-105 rounded-[4px]"
      />

      {/* Canvas for captions */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - dividerPosition}% 0 0)` }}
      />

      {/* Divider Line */}
      <div
        className="absolute top-0 h-full w-[2px] bg-white"
        style={{ left: `${dividerPosition}%` }}
      >
        {/* Draggable Logo Button */}
        <div
          className="absolute top-1/2 left-1/2 w-[50px] h-[50px] bg-red-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <img
            src="/creatorset-logo.svg"
            alt="Draggable Logo"
            draggable="false"
            className="w-[40px] h-[40px]"
          />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterWidget;
