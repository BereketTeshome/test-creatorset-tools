"use client";
import Image from "next/image";
import React, {forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState} from "react";
import {motion, useSpring, useTransform} from "framer-motion";
import {cn} from "@/lib/utils";
import {useAppSelector} from "@/redux/store";
import {getMySubscription} from "@/api/payment.api";
import {createWebSocketStream, getUserInfo, PYTHON_WS_URL} from "@/utils/utils";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {useRouter} from "next/navigation";
import CensoredButton from "@/components/profanity-muter-tool/video-block-basic/censored-button";
import NoTokenDialog from "@/components/no-user-token-dalog";
import {checkUserCreditTokens} from "@/api/user-credit.api";
import {generateProfanityMuted, retrieveTranscription, uploadTranscription} from "@/api/transcriptions.api";
import {useToast} from "@/components/ui/use-toast";


// const TIME_INCREMENT_SECS = 0.025
const SelectedVideo = forwardRef(({
                                    video,
                                    containerClassName,
                                    selectedVideo,
                                    externalId,
                                    bleepMethod,
                                  }: {
  video: string;
  containerClassName?: string;
  selectedVideo?: string;
  externalId?: string;
  bleepMethod:string;
}, ref) => {

  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState("00:00");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const videoDurationBarRef = useRef<HTMLDivElement | null>(null);
  const progress = useSpring(0, { damping: 200, stiffness: 1000 });
  const videoProgressBarWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  const {isMobile, isTablet, isDesktop} = useScreenDetector()

  const [originalVideoWidth, setOriginalVideoWidth] = useState(0);
  const [originalVideoHeight, setOriginalVideoHeight] = useState(0);

  const [videoWidth, setVideoWidth] = useState(window.innerWidth < window.innerHeight ? window.innerWidth * 0.95 : Math.min(window.innerWidth, 1400) - 340);
  const [videoHeight, setVideoHeight] = useState(window.innerWidth < window.innerHeight ? window.innerHeight * 0.8 : window.innerHeight * 0.6);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { captions = [] } = useAppSelector((state) => state?.app);
  const intervalIdRef: React.MutableRefObject<any> = useRef(null);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const stopLoop = () => {
    clearInterval(intervalIdRef.current);
  };

  const [videoDuration, setVideoDuration] = React.useState<number>(0);

  const [isUsingCensored, setIsUsingCensored] = useState(true)
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  // When component unmounts, clean up the interval:
  useEffect(() => stopLoop, []);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Event listeners for play and pause

      const handleLoadedMetadata = () => {
        console.log('video duration', video.duration)
        setVideoDuration(video.duration);
      }

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      // Cleanup event listeners on component unmount
      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  useEffect(() => {
    if (!getUserInfo()) {
      // router.push('/')
      return;
    }

    const currentDate = new Date();
    getMySubscription(getUserInfo().id).then((response) => {
      console.log('getMySubscription', response)
      if (response.data.length > 0 &&
        response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
      ) {
        setIsPaidUser(true);
      }
    })
  }, []);


  useImperativeHandle(ref, () => ({
    doTranscode({bleepMethod, wordRetention }) {
      async function* myGenerator() {
        yield 'Starting transcoding';
        // getting video metadata
        setIsTranscoding(true);

        const stream = createWebSocketStream(`${PYTHON_WS_URL}/transcribe/${externalId}/`);
        const reader = stream.getReader();

        try {

          await generateProfanityMuted(externalId, bleepMethod, wordRetention)
          let transcriptionResult = "{}";
          try {
            while (true) {
              const { value, done } = await reader.read();
              console.log('value', value)

              if (done) {
                break;
              }
              transcriptionResult = value
              if (value.length < 300 && !value.includes("avg_logprob")) {
                yield value; // Yield WebSocket messages as they arrive
              }
            }
          } catch (error) {
            console.error("Stream error:", error);

            toast({
              description: "Please try again later.",
              variant: "destructive",
              title: "An error occurred while transcoding",
            })
            setIsTranscoding(false);
          }

          await uploadTranscription(externalId, JSON.parse(transcriptionResult));
          const result = await retrieveTranscription(externalId);
          console.log('transcription result',result)

          let allowDownload = true
          const videoService = {
            videoService: {
              type: "caption",
              url: result.data.data.censoredVideoURL
            }
          }

          const allowDownloadData = await checkUserCreditTokens(videoService)
          console.log(`allowDownload ===> `, allowDownloadData.data.allowDownload)
          if (allowDownloadData.status === 200) {
            allowDownload = allowDownloadData.data.allowDownload
          }

          if(allowDownload) {
            const link = document.createElement('a');
            link.href = result.data.data.censoredVideoURL;
            link.download = 'transcribed.mp4'; // The name for the downloaded file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            setDialogOpen(true)
          }

          setIsTranscoding(false);
        } catch (error) {
          console.error("Error in transcoding", error);
          setIsTranscoding(false);
          toast({
            description: "Please try again later.",
            variant: "destructive",
            title: "An error occurred while transcoding",
          })
        }
      }
      return myGenerator();
    },
    getVideoRef() {
      return videoRef.current;
    },
  }));

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      muteIfProfanity(currentTime, isUsingCensored);
      if (duration > 0) {
        progress.set(currentTime / duration);
        const remaining = duration - currentTime;
        setRemainingTime(formatTime(remaining));
      }
    }
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }

  }, [isUsingCensored, isHovered, videoDuration, captions, bleepMethod]);


  useEffect(() => {
    stopLoop()

    console.log('selectedVideo',selectedVideo)
    if (!(window.document.getElementById('alvin') as HTMLVideoElement).src) {
      return
    }

    if (videoRef.current) {
      console.log('videoRef dimensions', videoRef.current.videoHeight, videoRef.current.videoWidth)
      videoRef.current.currentTime = 0;
      videoRef.current.pause();

      let interval = setInterval(() => {
        if (videoRef.current && videoRef.current.videoHeight === 0) {
          // do nothing
        } else {
          if (videoRef.current) {
            console.log('ORIGINAL HEIGHT', videoRef.current.videoHeight)
            setOriginalVideoHeight(videoRef.current.videoHeight);
            setOriginalVideoWidth(videoRef.current.videoWidth);
            if (window.innerWidth < window.innerHeight) {
              setVideoWidth(window.innerWidth * 0.95 );
              setVideoHeight(window.innerWidth * 0.95 * videoRef.current.videoHeight / videoRef.current.videoWidth);
              console.log('REMAPPED TO MOBILE WIDTH' )
            } else if (videoRef.current.videoHeight > videoRef.current.videoWidth) {
              let height = screen.height - 470
              while ((height + 20) > (window.innerHeight * 0.6) ) {
                height = height - 10
              }
              setVideoHeight(height);
              setVideoWidth(height / videoRef.current.videoHeight * videoRef.current.videoWidth);
              console.log('REMAPPED HEIGHT 1', screen.height * 0.5 )
            } else {
              let width = Math.min(window.innerWidth, 1400) - 340
              let height = width * videoRef.current.videoHeight / videoRef.current.videoWidth
              while (height > (window.innerHeight * 0.6) ) {
                width = width - 10
                height = width * videoRef.current.videoHeight / videoRef.current.videoWidth
              }
              setVideoWidth( width);
              setVideoHeight( height);
              console.log('REMAPPED HEIGHT 2', window.innerWidth * 0.4 * videoRef.current.videoHeight / videoRef.current.videoWidth)
            }
            console.log('videoRef dimensions', videoRef.current.videoHeight, videoRef.current.videoWidth)
            clearInterval(interval)
            setIsInitialLoading(false)
          }
        }

      }, 1500)
    } else {
      return
    }

  }, [selectedVideo, video, isDesktop]);


  const muteIfProfanity = (currentTime: number, censored: boolean) => {
    if (!captions || captions.length === 0) {
      return;
    }
    const result = captions.find((c) => c.start <= currentTime && c.end >= currentTime);
    //If result is undefined we are on an empty space, therefore we return an empty string
    if (censored) {
      if (result?.profanity && (!!result?.muted || typeof result?.muted === 'undefined') && !result.whitelisted) {
        if (videoRef.current)	{
          videoRef.current!.muted = true;
        }
        if (bleepMethod === 'beep') {
          const beep = new Audio("/sounds/censor-beep.mp3");
          beep.volume = 0.5;
          beep.play();
        }
      } else {
        if (videoRef.current)	{
          videoRef.current!.muted = false;
        }
      }
    }
  }

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsPlaying(true)
        videoRef.current.play();
      } else {
        setIsPlaying(false)
        videoRef.current.pause();
      }
    }
  };

  // const handleMouseEnter = () => {
  //   setIsHovered(true);
  //   if (videoRef.current) {
  //     videoRef.current.play();
  //   }
  // };
  //
  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  //   if (videoRef.current) {
  //     videoRef.current.pause();
  //     stopLoop()
  //   }
  // };


  const updateTimeTrackerPosition = (e: any) => {
    console.log('updateTimeTrackerPosition offsetX', e.nativeEvent.offsetX)
    let result =  e.nativeEvent.offsetX / videoDurationBarRef.current.scrollWidth;
    const percentage = Math.min(Math.max(result, 0), 100);
    videoRef!.current.currentTime = percentage * videoDuration
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  return (
    <div
      className={cn("relative h-[77%]", containerClassName)}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      style={{
        width: videoWidth, height: videoHeight
      }}
    >

      <div style={{
        position: "relative",
        width: videoWidth, height: videoHeight
      }}
        // className="h-full object-cover w-[442px] rounded-2xl"
           className={`object-cover rounded-2xl ${isInitialLoading ? 'bg-red flex-col gap-4 rounded-2xl h-[77%] flex items-center justify-center transition-colors duration-300 cursor-pointer': ''}`}
      >

        {isInitialLoading ?
          <motion.div
            initial={{rotate: 0}}
            animate={{
              rotate: 360,
              transition: {duration: 1, repeat: Infinity, ease: "linear"},
            }}
          >
            <Image
              src="/loading.png"
              alt=""
              draggable={false}
              width={200}
              height={200}
              className="h-16 w-16"
            />
          </motion.div>
          :
          <Fragment>
          </Fragment>
        }

        <video
          id='alvin'
          crossOrigin={"anonymous"}
          ref={videoRef}
          className="h-full object-cover rounded-2xl"
          src={video}
          controls={false}
          onClick={togglePlayPause}
          playsInline
          style={{position: "absolute", left: 0, cursor: isPlaying ? "default":"pointer"}}
        ></video>

        <div className="absolute right-4 top-2 z-50">
          <CensoredButton isUsingCensored={isUsingCensored} onClick={() => {setIsUsingCensored(!isUsingCensored)}}/>
        </div>

      </div>

      {!isPlaying && !isInitialLoading && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={togglePlayPause}
        >
          <Image src="/play.svg" width={73} height={73} alt=""/>
        </button>
      )}
      <div className="absolute bottom-8 gap-5 left-4 right-4 flex items-center z-50">
        <div className="bg-[#313030] h-3 rounded-full w-full overflow-hidden"
             onMouseDown={updateTimeTrackerPosition} ref={videoDurationBarRef}>
          <motion.div className="h-3 bg-white" style={{width: videoProgressBarWidth}}/>
        </div>
        <div className="text-white text-sm mt-1">{remainingTime}</div>
      </div>
      <NoTokenDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
});

export default SelectedVideo;
