//@ts-nocheck
"use client";

import Image from "next/image";
import React, {useState, useRef, useEffect} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "./loading";
import { File } from "buffer";
import { useRouter } from "next/navigation";
import {uploadFilesAndGetTranscriptions, numberGenerator} from "@/api/transcriptions.api";
import {setExternalId} from "@/redux/app-slice";
import {useAppDispatch} from "@/redux/store";
import {useFileContext} from "@/components/landing-page/file-context";

interface VideoThumbnailButtonProps {
  videoUrl: string;
  onClick: () => void;
}

const VideoThumbnailButton: React.FC<VideoThumbnailButtonProps> = ({
                                                                     videoUrl,
                                                                     onClick,
                                                                   }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const getVideoThumbnail = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; // Prevent CORS issues for external videos
      video.src = videoUrl;
      video.currentTime = 1; // Set a time close to the start to capture a frame

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Failed to create canvas context');
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png')); // Convert canvas to a data URL
      };

      video.onerror = (e) => reject(`Error loading video: ${e.message}`);
    });
  };

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const thumbnailUrl = await getVideoThumbnail(videoUrl);
        setThumbnail(thumbnailUrl);
      } catch (error) {
        console.error("Failed to generate thumbnail:", error);
      }
    };

    generateThumbnail();
  }, [videoUrl]);

  return (
    <button
      onClick={onClick}
      className="flex-1 basis-[calc(25%-1rem)] max-w-[calc(25%-1rem)] aspect-square rounded-lg overflow-hidden"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300">
          Loading...
        </div>
      )}
    </button>
  );
};

const Home = ({setIsUploading, isLoggedIn, promptLogin}) => {

  const {file, setFile} = useFileContext();

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const dragCounter = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [statusDescription, setStatusDescription] = useState<string>("");
  const allowedFileTypes: string[] = [
    "video/mp4",
    "video/x-matroska",
    "video/avi",
    "video/x-msvideo",
  ];

  useEffect(() => {
    console.log('file from another page', file)
    if (file) {
      processFiles([file]);
    }
  }, [isLoggedIn]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const fetchVideoAsFile = async (videoUrl: string, fileName: string): Promise<File | Blob> => {
    const response = await fetch(videoUrl);
    const blob = await response.blob();

    // Check if File is available in the current environment
    if (typeof File !== 'undefined') {
      return new File([blob], fileName, { type: blob.type });
    }

    // Fallback for environments without File (e.g., Node.js)
    return new Blob([blob], { type: blob.type });
  };

  const handleThumbnailClick = async (videoUrl: string) => {
    try {
      const file = await fetchVideoAsFile(videoUrl, "video.mp4");
      await processFiles([file]);
    } catch (error) {
      console.error("Failed to process video:", error);
      alert("Failed to process video. Please try again.");
    }
  };

  const processFiles = async (files: File[]): void => {
    console.log('handleClick', isLoggedIn)
    if (!isLoggedIn) {
      setFile(files[0]);
      promptLogin();
      return;
    }
    const validFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (validFiles.length === 0) {
      alert("Please select only MP4, MKV, or AVI files.");
      return;
    }

    if (validFiles.length !== files.length) {
      alert("Some files were ignored because they are not MP4, MKV, or AVI.");
    }

    setIsUploading(true);
    setLoading(true);
    setStatusDescription("Starting upload...");
    try {
      for await (const status of uploadFilesAndGetTranscriptions(validFiles[0], "profanity_muter")) {
        console.log("status", status);
        console.log("status type",typeof status);
        if (typeof status === 'string') {
          setStatusDescription(status);
        } else if(typeof status === 'object' && status.upload) {
          console.log('xhr', status);
          status.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              // Yield the percentage of completion
              console.log('push')
              setStatusDescription(`Uploading file... ${percentComplete.toFixed(0)}% complete`);
            }
          };
        } else if(status && status.success) {
          dispatch(setExternalId(status.externalId));
          router.push(`profanity-muter/captioned/${status.externalId}`);
        }
      }

      setStatusDescription("Upload complete, processing subtitles...");     // setStatusDescription("Upload complete, processing subtitles...");
    } catch (error) {
      console.log("error", error);
      setStatusDescription("An error occurred during the upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={"bg-black2 lg:h-[calc(100svh-73px)] font-neue"}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="pointer-events-none fixed top-0 left-0 w-full h-full bg-red/80 flex items-center justify-center text-[48px] text-white z-50"
          >
            Drop video here...
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center w-full h-full">
        {loading ? (
              <Loading statusDescription={statusDescription}/>
            ) : (
          <div
            onClick={handleClick}
            className={`w-[442px] box-dashed text-center flex-col gap-4 h-[77%] flex items-center justify-center transition-colors duration-300 cursor-pointer  px-10`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".mp4,.mkv,.avi"
              style={{display: "none"}}
              multiple
            />
            <Image
              src={"/video.svg"}
              height={1000}
              width={1000}
              alt=""
              className="h-10 w-10"
            />
            <h1 className="text-base text-white/50">
              Click to browse or <br/>
              drag and drop your video
            </h1>
            <button className="px-6 py-2 text-base font-bold bg-red text-white rounded hover:bg-red-600">Upload Video
            </button>
            <p className="text-sm text-white">or drop a file</p>
            <p className="text-sm text-white/50">Format: MP4, MKV or AVI</p>
            <p className="text-xs text-white/20"> By uploading a video or URL you agree to our Terms of Service. To
              learn about how Caption Generator handles your personal data, check our Privacy Policy.</p>
            <p className="text-bg text-white"> Dont have a video? Try with our sample video here. </p>
            <div className="flex flex-wrap justify-center gap-2">
                <VideoThumbnailButton
                  videoUrl="/sample_videos/brother_ew.mp4"
                  onClick={() => handleThumbnailClick('/sample_videos/brother_ew.mp4')}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
