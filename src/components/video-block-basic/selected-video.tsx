"use client";
import Image from "next/image";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn, getMp4Info } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { drawSubtitleFrame } from "@/lib/core/subtitle-drawing-util";
import { TextStylingSettings } from "@/components/typings/text-styling-settings";
import { getMySubscription } from "@/api/payment.api";
import { getUserInfo } from "@/utils/utils";
import { useScreenDetector } from "@/components/ui/use-screen-detector";
import { useRouter } from "next/navigation";
import Loading from "@/components/caption-tool/loading";
import { checkUserCreditTokens } from "@/api/user-credit.api";
import NoTokenDialog from "../no-user-token-dalog";

// const TIME_INCREMENT_SECS = 0.025
const SelectedVideo = forwardRef(
  (
    {
      video,
      containerClassName,
      selectedVideo,
      textStylingSettings,
    }: {
      video: string;
      containerClassName?: string;
      selectedVideo?: string;
      textStylingSettings?: TextStylingSettings;
    },
    ref
  ) => {
    const router = useRouter();
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [remainingTime, setRemainingTime] = useState("00:00");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const videoDurationBarRef = useRef<HTMLDivElement | null>(null);
    const progress = useSpring(0, { damping: 200, stiffness: 1000 });
    const videoProgressBarWidth = useTransform(
      progress,
      [0, 1],
      ["0%", "100%"]
    );

    const { isMobile, isTablet, isDesktop } = useScreenDetector();

    const [originalVideoWidth, setOriginalVideoWidth] = useState(0);
    const [originalVideoHeight, setOriginalVideoHeight] = useState(0);

    const [videoWidth, setVideoWidth] = useState(
      window.innerWidth < window.innerHeight
        ? window.innerWidth * 0.95
        : Math.min(window.innerWidth, 1400) - 340
    );
    const [videoHeight, setVideoHeight] = useState(
      window.innerWidth < window.innerHeight
        ? window.innerHeight * 0.8
        : window.innerHeight * 0.6
    );
    const [scaleFactor, setScaleFactor] = useState(1);
    const [isPaidUser, setIsPaidUser] = useState(false);

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
      useRef(null);
    const canvasForDownloadRef: React.MutableRefObject<HTMLCanvasElement | null> =
      useRef(null);
    const { captions = [] } = useAppSelector((state) => state?.app);
    const intervalIdRef: React.MutableRefObject<any> = useRef(null);
    const [isTranscoding, setIsTranscoding] = useState(false);
    const stopLoop = () => {
      clearInterval(intervalIdRef.current);
    };
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    const [videoDuration, setVideoDuration] = React.useState<number>(0);
    const [isDialogOpen, setDialogOpen] = useState(false);

    // When component unmounts, clean up the interval:
    useEffect(() => stopLoop, []);

    useEffect(() => {
      const video = videoRef.current;

      if (video) {
        // Event listeners for play and pause
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        const handleSeeking = () => {
          setIsSeeking(true);
          console.log("Seeking started...");
        };

        const handleSeeked = () => {
          setIsSeeking(false);
          console.log("Seek completed.");
        };

        const handleLoadedMetadata = () => {
          console.log("video duration", video.duration);
          setVideoDuration(video.duration);
        };

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("seeking", handleSeeking);
        video.addEventListener("seeked", handleSeeked);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        // Cleanup event listeners on component unmount
        return () => {
          video.removeEventListener("play", handlePlay);
          video.removeEventListener("pause", handlePause);
          video.removeEventListener("seeking", handleSeeking);
          video.removeEventListener("seeked", handleSeeked);
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
      }
    }, []);

    useEffect(() => {
      if (isPlaying) {
        doPreview();
      } else {
        stopLoop();
      }
    }, [isPlaying]);

    useEffect(() => {
      if (isSeeking) {
        stopLoop();
      } else {
        doPreview();
      }
    }, [isSeeking]);

    useEffect(() => {
      if (!getUserInfo()) {
        // router.push('/')
        return;
      }
      getMySubscription(getUserInfo().id).then((response) => {
        console.log("getMySubscription", response);
        if (response.data.length > 0) {
          setIsPaidUser(true);
        }
      });
    }, []);

    // Calculate the scale factor of the video displayed
    useEffect(() => {
      setScaleFactor(videoHeight / originalVideoHeight);
    }, [videoHeight]);

    useImperativeHandle(ref, () => ({
      doTranscode() {
        async function* myGenerator() {
          yield "Starting transcoding";
          // getting video metadata
          const response = await fetch(videoRef.current.src);
          const mp4Info = await getMp4Info(response);

          let fps = 30;
          mp4Info.tracks.forEach((track) => {
            console.log(
              `Track ID: ${track.id}, Type: ${track.type}, FPS: ${Math.round(
                track.nb_samples / (track.duration / track.timescale)
              )}`
            );
            if (track.type === "video") {
              fps = Math.round(
                track.nb_samples / (track.duration / track.timescale)
              );
            }
          });

          setIsTranscoding(true);
          console.info("Loading ffmpeg-core.js");
          if (!ffmpeg.isLoaded()) await ffmpeg.load();
          yield {
            text: "Generating Subtitle frames",
            percentage: 0,
          };
          const downloadGenerator = startAnimation(
            async function* () {
              console.info("Start transcoding");
              ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

              if (isPaidUser) {
                yield {
                  text: "Combining subtitle frames to video",
                  percentage: 90,
                };
                await ffmpeg.run(
                  "-i",
                  "test.mp4",
                  "-framerate",
                  "" + fps,
                  "-i",
                  "%07d.png",
                  "-c:v",
                  "libx264",
                  "-c:a",
                  "copy",
                  // '-b:v', '2M',
                  "-crf",
                  "11",
                  // '-crf', '40',
                  "-filter_complex",
                  "overlay",
                  "-threads",
                  "8",
                  "output.mp4"
                );
              } else {
                yield {
                  text: "Generating 720p video",
                  percentage: 60,
                };
                await ffmpeg.run(
                  "-i",
                  "test.mp4",
                  "-vf",
                  "scale=720:-1,pad=ceil(iw/2)*2:ceil(ih/2)*2",
                  "-c:v",
                  "libx264",
                  "-c:a",
                  "copy",
                  "scaled_test.mp4"
                );

                yield {
                  text: "Combining subtitle frames to video",
                  percentage: 90,
                };
                await ffmpeg.run(
                  "-i",
                  "scaled_test.mp4",
                  "-framerate",
                  "" + fps,
                  "-i",
                  "%07d.png",
                  "-c:v",
                  "libx264",
                  "-c:a",
                  "copy",
                  "-crf",
                  "11",
                  "-filter_complex",
                  "[0:v]scale=720:-1[video];[1:v]scale=720:-1[overlay];[video][overlay]overlay",
                  "-threads",
                  "8",
                  "output.mp4"
                );
              }
              let allowDownload = true;
              if (isPaidUser) {
                const videoService = {
                  videoService: {
                    type: "caption",
                    url: videoRef.current.src,
                  },
                };

                const allowDownloadData = await checkUserCreditTokens(
                  videoService
                );
                console.log(
                  `allowDownload ===> `,
                  allowDownloadData.data.allowDownload
                );
                if (allowDownloadData.status === 200) {
                  allowDownload = allowDownloadData.data.allowDownload;
                }
              }
              if (allowDownload) {
                console.info("Complete transcoding");
                yield {
                  text: "Done!",
                  percentage: 100,
                };
                const data = ffmpeg.FS("readFile", "output.mp4");
                const link = document.createElement("a");
                link.href = URL.createObjectURL(
                  new Blob([data.buffer], { type: "video/mp4" })
                ); // URL of the file to download
                link.download = "transcribed.mp4"; // The name for the downloaded file
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                setDialogOpen(true);
              }
            },
            false,
            fps
          );

          for await (const status of downloadGenerator) {
            yield status;
          }

          setIsTranscoding(false);
        }
        return myGenerator();
      },
      getVideoRef() {
        return videoRef.current;
      },
      startAnimation,
    }));

    useEffect(() => {
      stopLoop();

      console.log("selectedVideo", selectedVideo);
      if (!(window.document.getElementById("alvin") as HTMLVideoElement).src) {
        return;
      }

      if (videoRef.current) {
        console.log(
          "videoRef dimensions",
          videoRef.current.videoHeight,
          videoRef.current.videoWidth
        );
        videoRef.current.currentTime = 0;
        videoRef.current.pause();

        let interval = setInterval(() => {
          if (videoRef.current && videoRef.current.videoHeight === 0) {
            // do nothing
          } else {
            if (videoRef.current) {
              console.log("ORIGINAL HEIGHT", videoRef.current.videoHeight);
              setOriginalVideoHeight(videoRef.current.videoHeight);
              setOriginalVideoWidth(videoRef.current.videoWidth);
              if (window.innerWidth < window.innerHeight) {
                // mobile
                setVideoWidth(window.innerWidth * 0.95);
                setVideoHeight(
                  (window.innerWidth * 0.95 * videoRef.current.videoHeight) /
                    videoRef.current.videoWidth
                );
                console.log("REMAPPED TO MOBILE WIDTH");
              } else if (
                videoRef.current.videoHeight > videoRef.current.videoWidth
              ) {
                // desktop, mobile video
                let height = screen.height - 470;
                while (height + 20 > window.innerHeight * 0.6) {
                  height = height - 10;
                }
                setVideoHeight(height);
                setVideoWidth(
                  (height / videoRef.current.videoHeight) *
                    videoRef.current.videoWidth
                );
                console.log("REMAPPED HEIGHT 1", screen.height * 0.5);
              } else {
                let width = Math.min(window.innerWidth, 1400) - 340;
                let height =
                  (width * videoRef.current.videoHeight) /
                  videoRef.current.videoWidth;
                while (height > window.innerHeight * 0.6) {
                  width = width - 10;
                  height =
                    (width * videoRef.current.videoHeight) /
                    videoRef.current.videoWidth;
                }
                setVideoWidth(width);
                setVideoHeight(height);
                console.log(
                  "REMAPPED HEIGHT 2",
                  (window.innerWidth * 0.4 * videoRef.current.videoHeight) /
                    videoRef.current.videoWidth
                );
              }
              console.log(
                "videoRef dimensions",
                videoRef.current.videoHeight,
                videoRef.current.videoWidth
              );
              clearInterval(interval);
              setIsInitialLoading(false);
            }
          }
        }, 1500);
      } else {
        return;
      }
    }, [selectedVideo, video, isDesktop]);

    const startAnimation = async function* (
      callback: () => AsyncGenerator<
        { text: string; percentage: number },
        void,
        unknown
      >,
      isPreview = false,
      fps = 30,
      startTime = 0
    ) {
      let frameCount = 0;
      let currentTime = 0;

      let canvas: HTMLCanvasElement;
      if (isPreview) {
        // videoRef.current.currentTime = startTime;
        currentTime = videoRef.current.currentTime;
        canvas = canvasRef.current;
      } else {
        canvas = canvasForDownloadRef.current;
      }

      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const captureFrame = async (frameCount: number, isPreview: boolean) => {
        return new Promise((resolve, reject) => {
          canvas.toBlob(async (blob) => {
            if (blob) {
              let pngFile = frameCount.toString().padStart(7, "0");
              const url = (await blobToDataURL(blob)) as string;
              ffmpeg.FS("writeFile", `${pngFile}.png`, await fetchFile(url));
              resolve(null);
            }
          }, "image/png");
        });
      };

      let TIME_INCREMENT_SECS = 1 / fps;
      const animate = async function* () {
        console.log("animate called");
        currentTime += TIME_INCREMENT_SECS; // Increment time by 50ms

        if (!captions || captions.length === 0) {
          stopLoop();
          return;
        }

        drawSubtitleFrame({
          subtitles: captions,
          isPreview,
          currentTime,
          ctx,
          canvas,
          textStylingSettings,
          scaleFactor,
          isPaidUser,
        });

        if (!isPreview) {
          await captureFrame(frameCount, isPreview);
          const percentage =
            (frameCount /
              Math.floor(videoRef.current.duration / TIME_INCREMENT_SECS)) *
            100;
          yield {
            text: "Rendering frames",
            percentage: Math.round(percentage / 2), // limit to 20%
          };
        }

        frameCount++;
        if (frameCount < videoRef.current.duration / TIME_INCREMENT_SECS) {
          if (isPreview) {
            console.log("currentTime", currentTime, selectedVideo);
          } else {
            for await (const status of animate()) {
              yield status;
            }
          }
        } else {
          for await (const status of callback()) {
            yield status;
          }
          stopLoop();
          return;
        }
      };

      if (selectedVideo === "captioned" && isPreview) {
        stopLoop();
        intervalIdRef.current = setInterval(async () => {
          for await (const _ of animate()) {
          }
        }, TIME_INCREMENT_SECS * 1000);
      }

      for await (const status of animate()) {
        yield status;
      }

      // Cleanup on component unmount
      console.log("DONE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    };
    const blobToDataURL = (blob: Blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const ffmpeg = createFFmpeg({
      corePath: "/ffmpeg-core.js",
      log: true,
    });
    const doPreview = async () => {
      console.log("videoRef", videoRef.current);

      const video = videoRef.current;
      console.info("Previewing output video");
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      if (!video) {
        return;
      }
      // video.currentTime = 0;
      if (isPlaying) {
        await video.play();
      } else {
        return;
      }
      const startAnimationGenerator = startAnimation(async function* () {
        // video.pause();
        // video.currentTime = 0;
        console.info("Preview complete");
      }, true);

      for await (const _ of startAnimationGenerator) {
      }
    };

    useEffect(() => {
      const updateProgress = () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          if (duration > 0) {
            progress.set(currentTime / duration);
            const remaining = duration - currentTime;
            setRemainingTime(formatTime(remaining));
          }
        }
        animationRef.current = requestAnimationFrame(updateProgress);
      };

      updateProgress();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [progress]);

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
          setIsPlaying(true);
          videoRef.current.play();
        } else {
          setIsPlaying(false);
          videoRef.current.pause();
        }
      }
    };

    const updateTimeTrackerPosition = (e: any) => {
      console.log("updateTimeTrackerPosition offsetX", e.nativeEvent.offsetX);
      let result =
        e.nativeEvent.offsetX / videoDurationBarRef.current.scrollWidth;
      const percentage = Math.min(Math.max(result, 0), 100);
      videoRef!.current.currentTime = percentage * videoDuration;
      console.log("JASLKFDJALKFJS");
      setTimeout(() => {
        videoRef!.current.pause();
      }, 0);

      videoRef!.current.pause();
      videoRef!.current.pause();
      setIsPlaying(false);
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
          width: videoWidth,
          height: videoHeight,
        }}
        onClick={togglePlayPause}
      >
        <div
          style={{
            position: "relative",
            width: videoWidth,
            height: videoHeight,
          }}
          // className="h-full object-cover w-[442px] rounded-2xl"
          className={`object-cover rounded-2xl ${
            isInitialLoading
              ? "bg-red flex-col gap-4 rounded-2xl h-[77%] flex items-center justify-center transition-colors duration-300 cursor-pointer"
              : ""
          }`}
        >
          {isInitialLoading ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: 360,
                transition: { duration: 1, repeat: Infinity, ease: "linear" },
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
          ) : (
            <Fragment>
              <canvas
                ref={canvasRef}
                width={videoWidth * 2}
                height={videoHeight * 2}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: videoWidth,
                  height: videoHeight,
                }}
              ></canvas>

              <canvas
                ref={canvasRef}
                width={videoWidth * 2}
                height={videoHeight * 2}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: "50%",
                  left: "35%",
                  transform: "translate(-50%, -50%)",
                  width: videoWidth,
                  height: videoHeight,
                  scale: "70%",
                }}
              ></canvas>
            </Fragment>
          )}

          <video
            id="alvin"
            crossOrigin={"anonymous"}
            ref={videoRef}
            className="h-full object-cover rounded-2xl"
            src={video}
            controls={false}
            playsInline
            style={{
              position: "absolute",
              left: 0,
              cursor: isPlaying ? "default" : "pointer",
            }}
          ></video>
        </div>

        {!isPlaying && !isInitialLoading && (
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={togglePlayPause}
          >
            <Image src="/play.svg" width={73} height={73} alt="" />
          </button>
        )}
        <div className="absolute bottom-8 gap-5 left-4 right-4 flex items-center z-50">
          <div
            className="bg-[#313030] h-3 rounded-full w-full overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={updateTimeTrackerPosition}
            ref={videoDurationBarRef}
          >
            <motion.div
              className="h-3 bg-white"
              style={{ width: videoProgressBarWidth }}
            />
          </div>
          <div className="text-white text-sm mt-1">{remainingTime}</div>
        </div>
        <NoTokenDialog open={isDialogOpen} onClose={handleCloseDialog} />
      </div>
    );
  }
);

export default SelectedVideo;
