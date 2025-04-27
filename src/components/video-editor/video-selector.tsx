import React, {useRef, useState} from "react";
import DragDropMini from "../transcibed-video/drag-drop-mini";
import Image from "next/image";
import {motion} from "framer-motion";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {RefreshCcwIcon} from "lucide-react";
import {useFileContext} from "@/components/landing-page/file-context";
import {useRouter} from "next/navigation";
import SubscribeDialog from "@/components/subscribe-dialog";
import PricingDialog from "@/components/pricing-dialog";

const VideoSelector = ({ selectedVideo, setSelectedVideo, videoSrc, doDownload, downloadingDescription, displayDragAndDrop = true }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { setFile } = useFileContext();
  const { isMobile, isTablet, isDesktop } = useScreenDetector();

  const [open, setOpen] = useState(false)


  const handleDownload = async () => {
    console.log("localStorage['isSubscriptionActive']", localStorage['isSubscriptionActive'])
    if (localStorage['isSubscriptionActive']==='true') {
      setIsDownloading(true);
      console.log("DOWNLOAD START !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      await doDownload()
      console.log("DOWNLOAD COMPLETE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      setTimeout(() => {
          setIsDownloading(false);
      },5000)
    } else {
      setOpen(true)
    }
  };

  const router = useRouter();
  const renderDownloadButton = () => {
    return <button
      onClick={handleDownload}
      className={`bg-[#E13943] ${
        isDownloading ? "bg-[#7e2529] cursor-not-allowed" : "hover:bg-[#E13943]/80"
      } duration-150 w-full rounded-md py-2.5 justify-center gap-1 flex items-center text-[#FDF8F8] flex-1`}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          {downloadingDescription && typeof downloadingDescription !== 'string' ?
            <div className="w-full">
              <div>
                {downloadingDescription.text}
              </div>
              <div className="w-full bg-gray rounded-xl h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-red rounded-xl"
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadingDescription.percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div>
                Progress: {downloadingDescription.percentage}%
              </div>
            </div>
            :
            <>

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
                  width={20}
                  height={20}
                  className="h-6 w-6"
                />
              </motion.div>
              {downloadingDescription}
            </>}
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
          Export Video
        </>
      )}
    </button>
  }

  const createUploadLinkAndClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.mp4,.mkv,.avi';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.item(0);
      if (file) {
        setFile(file);
        router.push('/captions');
      }
    }
    fileInput.click();
  }

  if (isDesktop) {
    return (
      <div >
        <div className="flex w-full justify-between gap-8">
          <button className="bg-gray3 text-white font-semibold text-center rounded-md flex-1" onClick={createUploadLinkAndClick}>
            <p className="flex gap-2 w-full justify-center"><RefreshCcwIcon/>Upload Video</p>
          </button>
          {renderDownloadButton()}
          {/* <SubscribeDialog open={open} setOpen={setOpen}/> */}
          <PricingDialog open={open} setOpen={setOpen} returnUrl="caption"/>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-[368px] rounded-xl h-fit mt-[9px] mr-6 bg-[#111111] p-4 `}>
      {
        displayDragAndDrop &&
          <DragDropMini />
      }
      <div className="mt-8 ">

      </div>
      {renderDownloadButton()}
      {/* <SubscribeDialog open={open} setOpen={setOpen}/>*/}
      <PricingDialog open={open} setOpen={setOpen} returnUrl="caption"/>
    </div>
  );
};

export default VideoSelector;
