// @ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import arial from "../../../fonts/ARIALBD 1.TTF";
import TranscribedVideoOptions from "../transcibed-muter-video/transcribed-video-options";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useScreenDetector } from "@/components/ui/use-screen-detector";
import { TextStylingSettings } from "@/components/typings/text-styling-settings";

const VideosBlockBasic = ({
  video,
  captionedVideoSrc,
  setCaptionedVideoSrc,
}: {
  video: string;
  captionedVideoSrc: string;
  setCaptionedVideoSrc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedVideo, setSelectedVideo] = useState("captioned");
  const dispatch = useAppDispatch();
  const { captions } = useAppSelector((state) => state.app);
  const [downloadingDescription, setDownloadingDescription] = useState("");

  const [textStylingSettings, setTextStylingSettings] =
    useState<TextStylingSettings>({
      fontSize: "small",
      fontFamily: "Helvetica Neue",
      textDisplayFormat: "single-word",
      textDisplayStyle: "bold",
      textDisplayPosition: "center",
      animations: "none",
    });

  const ffmpegRef = useRef(
    createFFmpeg({
      corePath: "/ffmpeg-core.js",
      log: true,
    })
  );
  // const videoRef = useRef(null);
  const transcribedVideoContainerRef = useRef(null);

  const doDownloadPreview = async () => {
    for await (const status of transcribedVideoContainerRef.current.doTranscode()) {
      setDownloadingDescription(status);
    }
  };

  const { isMobile, isTablet, isDesktop } = useScreenDetector();

  useEffect(() => {
    if (!video) return;
    // videoRef.current.src = video;
    load();
  }, [video]);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    if (ffmpeg.isLoaded()) return;
    await ffmpeg.load();
    await ffmpeg.FS("writeFile", "/tmp/arial.ttf", await fetchFile(arial));
  };
  return (
    <div
      className={`${isDesktop ? "flex" : "content-center"} text-white gap-8`}
    >
      {/*<SelectedVideo src={video} selectedVideo={selectedVideo} ref={transcribedVideoContainerRef} video={video}*/}
      {/*               textStylingSettings={textStylingSettings}*/}

      {/*/>*/}
      <TranscribedVideoOptions
        captionedVideoSrc={captionedVideoSrc}
        downloadPreview={doDownloadPreview}
        downloadingDescription={downloadingDescription}
      />
    </div>
  );
};

export default VideosBlockBasic;
