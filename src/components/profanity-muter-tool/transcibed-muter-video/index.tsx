"use client";
import React, {useEffect, useState} from "react";
import Loading from "../../caption-tool/loading";
import VideosBlockBasic from "../video-block-basic";
import {useAppDispatch} from "@/redux/store";
import {setCaptions} from "@/redux/app-slice";
import {retrieveTranscription} from "@/api/transcriptions.api";

let FIRST_LOAD = true;
const TranscribedVideo = ({ videoName, externalId }: { videoName: string, externalId: string }) => {
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [captionedVideoSrc, setCaptionedVideoSrc] = useState("");
  const dispatch = useAppDispatch();
  // const originalVideoUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${videoName}`;
  const [originalVideoUrl, setOriginalVideoUrl] = useState("");



  useEffect(() => {
    getTranscription();
  }, [externalId]);

  const getTranscription = () => {
    // axios.get("/api/transcribe?filename=" + videoName).then((res) => {
    //   const status = res?.data?.status;
    //   const transcription = res?.data?.transcription;
    //   if (status === "IN_PROGRESS") {
    //     setIsTranscribing(true);
    //     setTimeout(getTranscription, 3000);
    //   } else {
    //     const processedCaptions = processTranscriptionItems(
    //       transcription.results.items
    //     );
    //     console.log("processedCaptions", processedCaptions);
    //     dispatch(setCaptions(processedCaptions));
    //     setIsTranscribing(false);
    //   }
    // });

    retrieveTranscription(externalId).then((res) => {
      const status = res?.data?.status;
      setOriginalVideoUrl(res.data.data.videoURL)
      const transcription = res?.data?.data.subtitles;
      console.log("transcription", transcription);
      // const processedCaptions = processTranscriptionItems(
      //     transcription.results.items
      // );
      // console.log("processedCaptions", processedCaptions);
      dispatch(setCaptions(transcription));
      setIsTranscribing(false);
    });
  };
  return (
    <>
      <div className="bg-black2 overflow-auto flex pt-[57px] justify-center h-[calc(100vh-73px)]">
        {isTranscribing ? (
          <Loading statusDescription={""}/>
        ) : (
          <div className="flex gap-8">
            <VideosBlockBasic
              video={originalVideoUrl}
              captionedVideoSrc={captionedVideoSrc}
              setCaptionedVideoSrc={setCaptionedVideoSrc}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TranscribedVideo;
