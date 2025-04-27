//@ts-nocheck
"use client";

import Image from "next/image";
import React, {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {File} from "buffer";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/redux/store";
import Loading from "@/components/caption-tool/loading";
import {useFileContext} from "@/components/landing-page/file-context";

const MimicDropzone: React.FC = () => {
  const { setFile } = useFileContext();

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

  const processFiles = async (files: File[]): void => {
    console.log('files', files)
    if (files.length > 0) {
      setFile(files[0]); // Save the file in context
      router.push('/captions'); // Navigate to the target route
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full"
    >
      <div className="bg-black2 justify-center w-full h-full rounded-2xl"
           onDragEnter={handleDragEnter}
           onDragOver={handleDragOver}
           onDragLeave={handleDragLeave}
           onDrop={handleDrop}
        // className={"h-[calc(100svh-73px)] font-neue"}
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
              className="pointer-events-none fixed top-0 left-0 w-full h-full bg-red/80 flex items-center justify-center text-[48px] text-white rounded-lg"
            >
              Drop video here...
            </motion.div>
          )}
        </AnimatePresence>
        {loading ? (
          <Loading statusDescription={statusDescription}/>
        ) : (
          <div
            onClick={handleClick}
            className={`box-dashed text-center flex-col gap-4 h-full flex items-center justify-center transition-colors duration-300 cursor-pointer  px-10`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".mp4,.mkv,.avi"
              style={{display: "none"}}
              multiple
            />
            <button className="px-6 py-2 text-base font-bold bg-red text-white rounded-lg hover:bg-red-600">Upload Video
            </button>
            <p className="text-sm text-white">or drop a file</p>
            <p className="text-sm text-white/50">Format: MP4, MKV or AVI</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MimicDropzone;
