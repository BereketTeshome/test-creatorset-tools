"use client";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import ProfanityMuterOptions from "./profanity-muter-options";
import VideoSelector from "./video-selector";
import SelectedVideo from "../video-block-basic/selected-video";
import React, {SetStateAction, useEffect, useRef, useState} from "react";
import {retrieveTranscription, updateProfanityWhitelist} from "@/api/transcriptions.api";
import {setCaptions, setProfanityWhitelist} from "@/redux/app-slice";
import {TextStylingSettings} from "@/components/typings/text-styling-settings";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {FunctionTabs} from "@/components/video-editor/tabs";
import DragDropMini from "@/components/transcibed-video/drag-drop-mini";
import TimelineSection from "@/components/profanity-muter-tool/timelineSection/TimelineSection";
import {updateOrDeleteWord, updateProfaneValue} from "@/components/profanity-muter-tool/timelineSection/model";
import {Caption} from "@/components/typings/caption";
import {formatCaptionTimeInput} from "@/components/profanity-muter-tool/timelineSection/ProfaneTag";
import {AVERAGE_TIME_BETWEEN_CAPTIONS} from "@/components/profanity-muter-tool/timelineSection/parameters";
import {insertElementIntoArray, replaceArrayElement} from "@/utils/generalFunctions";
import MediaController from "@/components/media-controller/MediaController";
import Home from "@/components/caption-tool";
import { verifyStripePayment } from "@/api/payment.api";
import SuccessDialog from "@/components/successD-dalog";

const compareArrayEquals = (a: any[], b: any[]) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const VideoEditor = ({slug}) => {

  const {isMobile, isTablet, isDesktop} = useScreenDetector()

  const [selectedVideo, setSelectedVideo] = useState("captioned");
  const dispatch = useAppDispatch();
  // const originalVideoUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${videoName}`;
  const [originalVideoUrl, setOriginalVideoUrl] = useState("");
  const [downloadingDescription, setDownloadingDescription] = useState(false);
  const selectedVideoRef = useRef(null);
  const textAndTranscriptRef = useRef(null);

  const [wordRetention, setWordRetention] = useState(0)
  const [bleepMethod, setBleepMethod] = useState('muted')

  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  const [selectedTab, setSelectedTab] = useState<"EDITOR"|"TEXT"|"TRANSCRIPT"|"UPLOAD"|"DOWNLOAD">("EDITOR");

  const {captionedVideo, captions, originalVideo, externalId, profanityWhitelist} = useAppSelector(
    (state) => {
      let {externalId} = state.app
      if (!externalId && typeof window !== 'undefined') {
        externalId = slug
      }
      return {...state.app, externalId}
    }
  );

  useEffect(() => {
    console.log('PROFANITY_WHITELIST', profanityWhitelist)
    const interval = setTimeout(async () => {

      const result = await retrieveTranscription(externalId);
      console.log("UPDATE PROFANITY_WHITELIST CALLED", result.data.data.profanityWhitelist)
      console.log("UPDATE PROFANITY_WHITELIST", profanityWhitelist)
      console.log("UPDATE PROFANITY_WHITELIST IS EQUAL", compareArrayEquals(result.data.data.profanityWhitelist, profanityWhitelist))
      if (!compareArrayEquals(result.data.data.profanityWhitelist, profanityWhitelist)) {
        await updateProfanityWhitelist(externalId, profanityWhitelist);
      }
    }, 2000)
    return () => {
      clearTimeout(interval)
    }
  }, [profanityWhitelist]);


  useEffect(() => {
    console.log('SLUG', slug)
  }, [slug]);

  localStorage.setItem('mutedExternalId', externalId);

  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
      // Access the query string in the URL
      const queryParams = new URLSearchParams(window.location.search);
      // Get the 'session_id' and 'payment_status' from the query string
      const sessionIdFromQuery = queryParams.get('session_id');

    if(sessionIdFromQuery) {
      const formData = {
        sessionId: sessionIdFromQuery
      }

      verifyStripePayment(formData).then((response) => {
        setDialogOpen(response.data.payment_status.toLowerCase() === 'paid');
      })
    }
  }, []);

  useEffect(() => {
    if (selectedVideoRef.current && selectedVideoRef.current.getVideoRef()) {
      const videoRef = selectedVideoRef.current.getVideoRef()
      videoRef.ontimeupdate = () => {
        setCurrentTime(videoRef!.currentTime);
      };
    }
  }, [selectedVideoRef.current]);


  useEffect(() => {
    if (externalId) {
      getTranscription();
    }
  }, [externalId]);

  const getTranscription = () => {

    retrieveTranscription(externalId).then((res) => {
      const status = res?.data?.status;
      setOriginalVideoUrl(res.data.data.videoURL)
      const transcription = res?.data?.data.subtitles;
      const whitelist = res?.data?.data.profanityWhitelist;
      console.log("transcription", transcription);

      dispatch(setProfanityWhitelist(whitelist));
      dispatch(setCaptions(transcription));
    });
  };

  const handleCloseDialog = () => {

    // Ensure that window.location.href is being used as a string to construct a URL
    const currentUrl = window.location.href; // Get the full URL (including query params)
    
    // Log to see what the URL looks like
    console.log("Current URL:", currentUrl);

    // Convert the current URL to a URL object
    const url = new URL(currentUrl);

    // Remove query parameters
    url.searchParams.delete("session_id");

    // Log the updated URL to check
    console.log("Updated URL:", url.toString());

    // Update the URL without reloading the page (using replaceState)
    window.history.replaceState({}, "", url.toString());
    setDialogOpen(false);
  };

  const updateTags = (captionIndex: number, wordIndex: number) => (value: string) => {
    updateOrDeleteWord(captionIndex, wordIndex, captions, (transcription) => dispatch(setCaptions(transcription)) )(value)();
  };
  const updateProfane = (captionIndex: number, wordIndex: number) => (value: boolean) => {
    updateProfaneValue(captionIndex, wordIndex, captions, (transcription) => dispatch(setCaptions(transcription)) )(value)();
  };

  const updateObjectInArray = (indexToChange: number, newObj: Caption) => {
    const result = (captionArr: Caption[]) =>
      captionArr.map((caption: Caption, index: number) => {
        if (index === indexToChange) {
          return { ...newObj };
        }
        return caption;
      });
    // setCaptionsArray(result(captionsArray));
  };

  const splitCaptionBlocks = (handleType: 'left' | 'right', wordIndex: number, captionIndex: number) => {
    let result = [...captions];
    const captionToBeSplitted = result[captionIndex];
    const captionDuration = captionToBeSplitted.end - captionToBeSplitted.start;
    const tagArr = captionToBeSplitted.text.split(' ');
    const wordLimit = handleType === 'right' ? wordIndex + 1 : wordIndex;
    const text1 = tagArr.filter((word, index) => index < wordLimit).join(' ');
    const text2 = tagArr.filter((word, index) => index >= wordLimit).join(' ');

    const getNewCaptionParameters = () => {
      const letterqty = captionToBeSplitted.text.length;
      const proportion = text1.length / letterqty;
      const newEnd = captions[captionIndex].start + captionDuration * proportion;
      return { newStart: newEnd + AVERAGE_TIME_BETWEEN_CAPTIONS, newEnd };
    };

    const { newStart, newEnd } = getNewCaptionParameters();

    const caption1 = {
      start: captions[captionIndex].start,
      end: formatCaptionTimeInput(newEnd),
      text: text1,
      profanity: captions[captionIndex].profanity,
    };
    const caption2 = {
      start: formatCaptionTimeInput(newStart),
      end: captions[captionIndex].end,
      text: text2,
      profanity: captions[captionIndex].profanity,
    };

    result = replaceArrayElement(result, captionIndex, caption1);
    result = insertElementIntoArray(result, caption2, captionIndex + 1);
    dispatch(setCaptions([...result]))
  };

  const doDownload = async () => {
    for await (const status of selectedVideoRef.current.doTranscode({bleepMethod, wordRetention})) {
      setDownloadingDescription(status);
    }
  }

  if (!externalId) {
    return <Home setIsUploading={() => {}} />
  }

  return (

     isDesktop ? (

       <div className={`bg-black2 flex justify-center pt-5 `}>
         <div className="flex justify-center max-w-[1400px] pb-7 h-[calc(100vh-73px)]">

           <div className="h-full flex flex-col justify-between">

             <h2 className="text-white text-[32px] mb-1">Profanity Muter</h2>
             <p className="text-gray mb-2">Automatically mute curse words in your videos. </p>

             <div className="h-full flex flex-col justify-between border border-gray3 rounded-lg">
               <div className="flex justify-center w-full  ">
                 <SelectedVideo
                   ref={selectedVideoRef}
                   selectedVideo={selectedVideo}
                   video={originalVideoUrl}
                   containerClassName="h-[50%] pt-0 " // max-w-[359px] max-h-[628px]
                   externalId={externalId}
                   bleepMethod={bleepMethod}
                 />
               </div>

               <div>
                 {
                   selectedVideoRef.current && (

                     <div className='bg-black rounded-lg w-full'>
                       <TimelineSection captionsArray={captions} updateOrDeleteWord={updateTags}
                                        updateProfaneBool={updateProfane}
                                        videoRef={selectedVideoRef.current.getVideoRef()}
                                        updateArray={updateObjectInArray}
                                        splitCaptionBlocks={splitCaptionBlocks}
                                        onTagInputBlur={() => {
                                          // setTimeout(() => {
                                          //   setIsTagInputUnfocused(true);
                                          //   setSelectedCaptionIndex(null);
                                          // }, 100)
                                        }}
                                        onTagInputFocus={(captionIndex, wordIndex) => {
                                          //   setSelectedCaption(captionsArray[captionIndex]);
                                          //   setSelectedCaptionIndex(captionIndex);
                                          //   setIsTagInputUnfocused(false);
                                          // }

                                          console.info("focused !!", captionIndex);
                                          textAndTranscriptRef.current.focusOnTranscriptIndex(captionIndex)
                                        }}
                                        src={originalVideoUrl}
                       />
                       <MediaController videoRef={selectedVideoRef.current.getVideoRef()}/>
                     </div>
                   )
                 }
               </div>
             </div>
           </div>


           <div className="pt-[9px] px-6 flex flex-col">

             <div className="pb-8">
             <VideoSelector
                 selectedVideo={selectedVideo}
                 setSelectedVideo={setSelectedVideo}
                 videoSrc={originalVideoUrl}
                 doDownload={doDownload}
                 downloadingDescription={downloadingDescription}
               />
             </div>

             <div className="rounded-lg h-full flex flex-col flex-grow ">
               <ProfanityMuterOptions
                 ref={textAndTranscriptRef}
                 currentTime={currentTime}
                 bleepMethod={bleepMethod}
                 wordRetention={wordRetention}
                 setBleepMethod={setBleepMethod}
                 setWordRetention={setWordRetention}
               />
             </div>
           </div>

         </div>
         <SuccessDialog open={isDialogOpen} onClose={handleCloseDialog} />
       </div>
     ) : (<div className={'bg-black2 flex flex-col h-screen'}>

       <div className='flex-grow  overflow-y-scroll'>

         <SelectedVideo
           ref={selectedVideoRef}
           selectedVideo={selectedVideo}
           video={originalVideoUrl}
           containerClassName="h-[65%] pt-1 " // max-w-[359px] max-h-[628px]
           externalId={externalId}
           bleepMethod={bleepMethod}
         />

         {
           selectedTab !== 'TEXT' && !!selectedVideoRef.current &&

             <>
                 <MediaController videoRef={selectedVideoRef.current.getVideoRef()}/>
                 <TimelineSection captionsArray={captions} updateOrDeleteWord={updateTags}
                                  updateProfaneBool={updateProfane}
                                  videoRef={selectedVideoRef.current.getVideoRef()} updateArray={updateObjectInArray}
                                  splitCaptionBlocks={splitCaptionBlocks}
                                  onTagInputBlur={() => {
                                    // setTimeout(() => {
                                    //   setIsTagInputUnfocused(true);
                                    //   setSelectedCaptionIndex(null);
                                    // }, 100)
                                  }}
                                  onTagInputFocus={(captionIndex, wordIndex) => {
                                    //   setSelectedCaption(captionsArray[captionIndex]);
                                    //   setSelectedCaptionIndex(captionIndex);
                                    //   setIsTagInputUnfocused(false);
                                    // }
                                    setSelectedTab("TRANSCRIPT")
                                    setActiveCaptionIndex(captionIndex)
                                  }}
                                  src={originalVideoUrl}
                 />

             </>
         }


         {selectedTab === 'UPLOAD' &&
             <>
                 <div className="h-40">
                 </div>
                 <div className="mt-2 pt-1 px-2 fixed bottom-20 left-0 w-full bg-black">
                     <DragDropMini />
                 </div>
             </>
         }


         {
           selectedTab === "DOWNLOAD" &&

             <>
                 <div className="h-28">
                 </div>
                 <div
                     className={`mt-2 pt-1 px-2 fixed bottom-20 left-0 w-full bg-black ${selectedTab === 'DOWNLOAD' ? '' : 'hidden'}`}>
                     <VideoSelector
                         selectedVideo={selectedVideo}
                         setSelectedVideo={setSelectedVideo}
                         videoSrc={originalVideoUrl}
                         doDownload={doDownload}
                         downloadingDescription={downloadingDescription}
                         displayDragAndDrop={false}
                     />
                 </div>
             </>
         }

       </div>
       <div className='h-24'>
       <FunctionTabs activeTab={selectedTab} onTabChange={(tab) => {
           setSelectedTab(tab)
         }}/>
       </div>
       <SuccessDialog open={isDialogOpen} onClose={handleCloseDialog} />
     </div>)

  );
};
export default VideoEditor;
