"use client";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import TextAndTranscript from "./text-transcript";
import VideoSelector from "./video-selector";
import SelectedVideo from "../video-block-basic/selected-video";
import React, {SetStateAction, useEffect, useRef, useState} from "react";
import {retrieveTranscription, uploadTranscription} from "@/api/transcriptions.api";
import {setCaptions} from "@/redux/app-slice";
import {TextStylingSettings} from "@/components/typings/text-styling-settings";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {FunctionTabs} from "@/components/video-editor/tabs";
import DragDropMini from "@/components/transcibed-video/drag-drop-mini";
import TimelineSection from "@/components/timelineSection/TimelineSection";
import {updateOrDeleteWord, updateProfaneValue} from "@/components/timelineSection/model";
import {Caption} from "@/components/typings/caption";
import {formatCaptionTimeInput} from "@/components/timelineSection/TagInput";
import {AVERAGE_TIME_BETWEEN_CAPTIONS} from "@/components/timelineSection/parameters";
import {insertElementIntoArray, replaceArrayElement} from "@/utils/generalFunctions";
import MediaController from "@/components/media-controller/MediaController";
import TranscriptEditor from "@/components/video-editor/text-transcript/transcript-editor";
import TextEditor from "@/components/video-editor/text-transcript/text-editor";
import Home from "@/components/caption-tool";
import {getMySubscription, verifyStripePayment} from "@/api/payment.api";
import SuccessDialog from "../successD-dalog";
import {getUserInfo} from "@/utils/utils";
import {Undo2} from "lucide-react";

type ViewType = "editor" | "videosBlock";

const compareCaptionArrayEquals = (before: Caption[], after: Caption[]) => {
  if (before.length !== after.length) {
    return false;
  }

  for (let i = 0; i < before.length; i++) {
    const beforeCaption = before[i];
    const afterCaption = after[i];

    if (
      beforeCaption.text !== afterCaption.text ||
      beforeCaption.start !== afterCaption.start ||
      beforeCaption.end !== afterCaption.end
    ) {
      return false;
    }
  }

  return true;

}

const convertToWhisperFormat = (captions: Caption[]) => {
  return {
    segments: [{ words: captions.map((caption) => ({
        text: caption.text,
        profanity: caption.profanity,
        end: caption.end,
        start: caption.start,
      }))
    }]
  }
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
  
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  const [textStylingSettings, setTextStylingSettings] = useState<TextStylingSettings>({
    fontSize: 'medium',
    fontFamily: "Courier New",
    textDisplayFormat: "single-word",
    textDisplayStyle: "normal",
    textDisplayPosition: "center",
    animations: "bounce",
  });

  const [selectedTab, setSelectedTab] = useState<"EDITOR"|"TEXT"|"TRANSCRIPT"|"UPLOAD"|"DOWNLOAD">("EDITOR");
  const [subscribed, setSubscribed] = useState(false);
  
  const {captionedVideo, captions, originalVideo, externalId} = useAppSelector(
    (state) => {
      let {externalId} = state.app
      if (!externalId && typeof window !== 'undefined') {
        externalId = slug
      }
      return {...state.app, externalId}
    }
  );



  useEffect(() => {
    const interval = setTimeout(async () => {

      const result = await retrieveTranscription(externalId);
      console.log("UPDATE CAPTIONS CALLED", result.data.data.subtitles)
      console.log("UPDATE CAPTIONS", captions)
      console.log("UPDATE CAPTIONS IS EQUAL", compareCaptionArrayEquals(result.data.data.subtitles, captions))
      if (!compareCaptionArrayEquals(result.data.data.subtitles, captions)) {
        await uploadTranscription(externalId, convertToWhisperFormat(captions));
      }
    }, 3000)
    return () => {
      clearTimeout(interval)
    }
  }, [captions]);

   useEffect(() => {
    const currentDate = new Date();
      getMySubscription(getUserInfo().id).then((response) => {
        console.log('getMySubscription', response)
        if (response.data.length > 0 &&
          response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
        ) {
          setSubscribed(true);
        }
      })
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

  const getTranscription = () => {

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
    for await (const status of selectedVideoRef.current.doTranscode()) {
      setDownloadingDescription(status);
    }
  }

  if (!externalId) {
    return <Home setIsUploading={() => {}} />
  }

  const toggleView = () => {
    window.location.href = `/captioned/${externalId}`;
  };

  return (

     isDesktop ? (

       <div className={`bg-black2 flex justify-center pt-5 `}>
         <div className="flex justify-center max-w-[1400px] pb-7 h-[calc(100vh-73px)]">

           <div className="h-full flex flex-col justify-between">


             <div className="flex justify-between items-center">
               <div>
                 <h2 className="text-white text-[32px] mb-1">Caption Generator</h2>
                 <p className="text-gray mb-2">Upload your video and let ai add captions to it. </p>
               </div>
               {/* View Switcher Button */}
               {subscribed && (
                   <button onClick={toggleView} className="text-white bg-gray-700 p-2 rounded mb-4">
                     <div className="flex items-center gap-2">
                       <Undo2 size={18}/> Switch to basic view
                     </div>
                   </button>
               )}
             </div>


             <div className="h-full flex flex-col justify-between border border-gray3 rounded-lg">
               <div className="flex justify-center w-full  ">
                 <SelectedVideo
                   ref={selectedVideoRef}
                   selectedVideo={selectedVideo}
                   video={originalVideoUrl}
                   textStylingSettings={textStylingSettings}
                   containerClassName="h-[50%] pt-0 " // max-w-[359px] max-h-[628px]
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
                                          textAndTranscriptRef.current.focusOnTranscriptIndex(captionIndex)
                                        }}
                                        src={originalVideoUrl}
                       />
                       {/*<div className="w-full overflow-x-auto">*/}
                       {/*  <div className="w-[150%]">*/}
                       {/*    /!* Child content goes here *!/*/}
                       {/*    <p className="whitespace-nowrap">This content exceeds the width of the parent and is scrollable*/}
                       {/*      horizontally.</p>*/}
                       {/*  </div>*/}
                       {/*</div>*/}
                       <MediaController videoRef={selectedVideoRef.current.getVideoRef()}/>
                     </div>
                   )
                 }
               </div>
             </div>
           </div>


           <div className="pt-[9px] px-6">
             <div className="pb-8">
             <VideoSelector
                 selectedVideo={selectedVideo}
                 setSelectedVideo={setSelectedVideo}
                 videoSrc={originalVideoUrl}
                 doDownload={doDownload}
                 downloadingDescription={downloadingDescription}
               />
             </div>

             <div className="border border-gray3 rounded-lg h-[calc(100%-70px)] ">
               <TextAndTranscript
                 ref={textAndTranscriptRef}
                 currentTime={currentTime}
                 textStylingSettings={textStylingSettings}
                 onTextStylingSettingsChange={(settings: SetStateAction<TextStylingSettings>) => {
                   setTextStylingSettings(settings)
                 }}/>
             </div>
           </div>

         </div>

         {/*</div>*/}

         {/*</div>*/}

         {/*</div>*/}
         <SuccessDialog open={isDialogOpen} onClose={handleCloseDialog} />
       </div>
     ) : (<div className={'bg-black2 flex flex-col h-screen'}>

       <div className='flex-grow  overflow-y-scroll'>

         <SelectedVideo
           ref={selectedVideoRef}
           selectedVideo={selectedVideo}
           video={originalVideoUrl}
           textStylingSettings={textStylingSettings}
           containerClassName="h-[65%] pt-1 " // max-w-[359px] max-h-[628px]
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

         {selectedTab === 'TEXT' &&
           // <TextAndTranscript textStylingSettings={textStylingSettings} onTextStylingSettingsChange={(settings: SetStateAction<TextStylingSettings>) => {setTextStylingSettings(settings)}}/>
             <div className={`h-[50vh] pt-[9px] px-6 pb-6 w-[380px] overflow-scroll`}>
                 <TextEditor textStylingSettings={textStylingSettings}
                             onTextStylingSettingsChange={(settings: SetStateAction<TextStylingSettings>) => {
                               setTextStylingSettings(settings)
                             }}/>
             </div>
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
           selectedTab === 'TRANSCRIPT' &&
             <div className={`pt-[9px] px-6 pb-6 overflow-scroll`}>
                 <TranscriptEditor selectedIndex={activeCaptionIndex}
                                   currentTime={currentTime}
                 />
             </div>
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
