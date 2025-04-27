// @ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import arial from "../../fonts/ARIALBD 1.TTF";
import TranscribedVideoOptions from "../transcibed-video/transcribed-video-options";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import TranscribedVideoContainer from "../transcibed-video/transcribed-video-animated-captions";
import { useScreenDetector } from "@/components/ui/use-screen-detector";
import SelectedVideo from "@/components/video-block-basic/selected-video";
import { TextStylingSettings } from "@/components/typings/text-styling-settings";
import { Scale } from "lucide-react";

const VideosBlockBasic = ({
  video,
  captionedVideoSrc,
  setCaptionedVideoSrc,
  slug,
}: {
  video: string;
  captionedVideoSrc: string;
  setCaptionedVideoSrc: React.Dispatch<React.SetStateAction<string>>;
  slug: string;
}) => {
  const [selectedVideo, setSelectedVideo] = useState("captioned");
  const dispatch = useAppDispatch();
  const { captions } = useAppSelector((state) => state.app);
  const [downloadingDescription, setDownloadingDescription] = useState("");

  const [textStylingSettings, setTextStylingSettings] =
    useState<TextStylingSettings>({
      fontSize: "large",
      fontFamily: "Segoe UI, Roboto, sans-serif",
      textDisplayFormat: "single-word",
      textDisplayStyle: "normal",
      textDisplayPosition: "center",
      animations: "zoom",
      textRenderingQuality: "hd",
      textScale: 0.2,
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
      {/*<div className="flex flex-col gap-6">*/}
      {/*  <div className="flex flex-col gap-1">*/}
      {/*    <h1 className="text-[#AEAAAA] text-sm">Captioned (Preview)</h1>*/}
      {/*    <button onClick={() => setSelectedVideo("captioned")}>*/}
      {/*      <video*/}
      {/*        crossOrigin={"anonymous"}*/}
      {/*        className={`h-[162px] duration-200 object-cover w-[109px] rounded-xl overflow-hidden ${*/}
      {/*          selectedVideo === "captioned"*/}
      {/*            ? " border-[4px] border-[#E13943]"*/}
      {/*            : " border-[4px] border-transparent"*/}
      {/*        }`}*/}
      {/*        ref={videoRef}*/}
      {/*      ></video>*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*  <button onClick={() => setSelectedVideo("original")}>*/}
      {/*    <VideoComp*/}
      {/*      video={video}*/}
      {/*      title="Original"*/}
      {/*      selected={selectedVideo === "original"}*/}
      {/*    />*/}
      {/*  </button>*/}
      {/*</div>*/}

      <SelectedVideo
        src={video}
        selectedVideo={selectedVideo}
        ref={transcribedVideoContainerRef}
        video={video}
        textStylingSettings={textStylingSettings}
      />
      <TranscribedVideoOptions
        captionedVideoSrc={captionedVideoSrc}
        downloadPreview={doDownloadPreview}
        downloadingDescription={downloadingDescription}
        slug={slug}
      />
    </div>
  );
};

export default VideosBlockBasic;
