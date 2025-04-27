//@ts-nocheck
"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import DragDropMini from "./drag-drop-mini";
import LoginDialog from "../login-dialog";
import { motion } from "framer-motion";
import { getUserInfo } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { getMySubscription } from "@/api/payment.api";

const TranscribedVideoOptions = ({
  captionedVideoSrc,
  downloadPreview,
  downloadingDescription,
  slug,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    getMySubscription(getUserInfo().id).then((response) => {
      console.log("getMySubscription", response);
      if (
        response.data.length > 0 &&
        response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
      ) {
        setSubscribed(true);
      }
    });
  }, []);

  const router = useRouter();
  const goToEditPage = () => {
    router.push(`/captioned/${slug}/edit`);
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
          setTimeout(() => {
            setIsDownloading(false);
          }, 5000);
        }}
        className=" bg-[#313030] hover:bg-[#272727] duration-150 w-full mt-8 rounded-md py-3 justify-center gap-1 flex items-center text-[#FDF8F8]"
      >
        {isDownloading ? (
          <>
            {downloadingDescription &&
            typeof downloadingDescription !== "string" ? (
              <div className="w-full">
                <div>{downloadingDescription.text}</div>
                <div className="w-full bg-gray rounded-xl h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-red rounded-xl"
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadingDescription.percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div>Progress: {downloadingDescription.percentage}%</div>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: 360,
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    },
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
            )}
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
        {subscribed ? (
          <button
            onClick={goToEditPage}
            className=" bg-[#E13943] hover:bg-red/70 duration-150 w-full rounded-md py-3 justify-center gap-1 flex items-center text-[#FDF8F8]"
          >
            Edit Video
          </button>
        ) : (
          <button
            onClick={goToEditPage}
            className=" bg-[#E13943] hover:bg-red/70 duration-150 w-full rounded-md py-3 justify-center gap-1 flex items-center text-[#FDF8F8]"
          >
            Edit Video ($9.99/month)
          </button>
        )}

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
