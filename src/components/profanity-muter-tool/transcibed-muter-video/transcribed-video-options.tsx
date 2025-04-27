//@ts-nocheck
"use client";
import Image from "next/image";
import React, { useState } from "react";
import DragDropMini from "./drag-drop-mini";
import LoginDialog from "../../login-dialog";
import { motion } from "framer-motion";

const TranscribedVideoOptions = ({
  captionedVideoSrc,
  downloadPreview,
  downloadingDescription,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const redirectToLogin = () => {
    setOpen(true);
  };

  return (
    <div className="flex flex-col w-[336px] font-neue">
      <DragDropMini />
      <LoginDialog
        open={open}
        setOpen={setOpen}
        video={captionedVideoSrc}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      <button
        onClick={async () => {
          setIsDownloading(true);
          try {
            await downloadPreview();
          } catch (_) {}
          setIsDownloading(false);
        }}
        className=" bg-[#313030] hover:bg-[#272727] duration-150 w-full mt-8 rounded-md py-3 justify-center gap-1 flex items-center text-[#FDF8F8]"
      >
        {isDownloading ? (
          <>
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
                width={20}
                height={20}
                className="h-6 w-6"
              />
            </motion.div>
            {downloadingDescription}
          </>
        ) : (
          <>
            <Image
              src={"/arrow-down.svg"}
              width={73}
              height={73}
              alt={""}
              className="h-4 w-4 mb-1"
            />
            Download Video
          </>
        )}
      </button>
      <div className="mt-6 bg-[#222121] rounded-b-md">
        <button
          onClick={redirectToLogin}
          className=" bg-[#E13943] hover:bg-red/70 duration-150 w-full rounded-md py-3 justify-center gap-1 flex items-center text-[#FDF8F8]"
        >
          Edit Video ($9.99/month)
        </button>
        <div className="p-3 ">
          <p className="text-[#C9C6C5]">Includes features like:</p>
          <ul className="text-[#939090] pl-2 text-sm">
            <li>
              <span className="mr-2">•</span>Editable Transcript
            </li>
            <li>
              <span className="mr-2">•</span>Animated Captions{" "}
            </li>
            <li>
              <span className="mr-2">•</span>12+ Text Styles{" "}
            </li>
            <li>
              <span className="mr-2">•</span>Remove Watermark{" "}
            </li>
            <li>
              <span className="mr-2">•</span>Early Access To New Features
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TranscribedVideoOptions;
