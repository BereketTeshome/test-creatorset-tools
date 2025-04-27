import React, {useEffect, useRef, useState} from "react";
import {ProjectType} from "@/components/typings/projects";
import Image from "next/image";
import {ClockIcon, EllipsisIcon, Video} from "lucide-react";

import {neueSemiBold} from "@/fonts/neue";
import {deleteMyProject} from "@/api/my-projects.api";
import {toast} from "@/components/ui/use-toast";
import {motion} from "framer-motion";


const getMinutesAndSecondsString = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}`: seconds}`;
}

const parseTimestampToDateString = (timestamp) => {
  const date = new Date(timestamp);
  // DD MMM YYYY
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}


type Props = {
  projectTitle: string;
  createdAt: string;
  projectType: ProjectType;
  image: string;
  videoURL?: string;
  isSubscriptionActive: boolean;
  externalId? : string;
  onDeleteSuccess: () => void;
}


const ProjectCard = ({ externalId, projectTitle, createdAt, projectType, image, videoURL, isSubscriptionActive, onDeleteSuccess }: Props) => {

  const videoRef = useRef(null);
  const [duration, setDuration] = useState("")
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const optionsRef = useRef(null);


  const getExpiresIn = (timestamp) => {
    // if subscription is active, it expires in 30 days, else it expires in 24 hours. Output is either in `${days} days` or `${hours} hours`
    // if expires in less than a day, return hours instead
    const date = new Date(timestamp);
    const currentDate = new Date();
    const diff = date.getTime() - currentDate.getTime();
    const diffInHours = diff / (1000 * 3600);
    // compute expiry by offsetting either 30 days or 24 hours based on 'isSubscriptionActive'
    const expiry = isSubscriptionActive ? 30 * 24 : 24;
    const expiresIn = expiry + diffInHours;
    return expiresIn < 24 ? `${Math.floor(expiresIn)} hours` : `${Math.floor(expiresIn / 24)} days`;
  }


  const isExpired = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const diff = date.getTime() - currentDate.getTime();
    const diffInHours = diff / (1000 * 3600);
    const expiry = isSubscriptionActive ? 30 * 24 : 24;
    return expiry + diffInHours < 0;
  }



  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(getMinutesAndSecondsString(videoRef.current.duration));
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
  })

  const routeToProject = () => {
    if (projectType === 'caption_generator') {
      window.location.href = `/captioned/${externalId}`;
    } else if (projectType === 'profanity_muter') {
      window.location.href = `/profanity-muter/captioned/${externalId}`;
    }
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowOptions = (e) => {
    e.stopPropagation();
    // show options
    setShowOptions(prev => !prev);
  }


  return (
    <div className="rounded-lg lg:p-4 relative transition	hover:bg-neutral-800 bg-none cursor-pointer " onClick={() => routeToProject()}>
      <div className="relative">
        {
          !!image ?
            <img src={image} alt={projectTitle} className="rounded-lg mb-4 h-48"/>
            :
            <div className="w-full flex justify-center bg-black rounded-lg mb-4 h-48">
              <video ref={videoRef} src={videoURL} crossOrigin="anonymous" className="rounded-lg  h-48"></video>
            </div>
        }
        <div className="absolute bottom-2 left-2 bg-black/40 text-xs px-2 py-1 rounded-2xl">
          {duration}
        </div>
        <div className="absolute right-2 top-2 bg-black/40 text-xs px-2 py-2 rounded-[200px]">
          <EllipsisIcon onClick={handleShowOptions}/>
          {showOptions && (
            <div
              ref={optionsRef}
              className="absolute right-0 mt-2 w-40 bg-neutral-900 rounded-md shadow-lg z-50"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(false);
                  // Replace this with your delete logic
                  console.log("Delete project", externalId);
                  setShowConfirmDelete(true); // Show confirm dialog
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-800 text-red-500"
              >

                {
                  isDeleting &&
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
                }
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-between items-start">
        <h3 className={`text-base max-w-32 overflow-ellipsis overflow-hidden`}>{projectTitle}</h3>
        <div className={`bg-red-500 text-lg px-2 pl-1 rounded text-white ml-2 capitalize flex gap-2 items-start  ${neueSemiBold.className} min-h-15`}>
          <Image src="/logo.png" alt="logo" width={20} height={3} className="pb-1 pt-3"/>
          <div className="max-w-20">
            {projectType.replace(/_/g, " ")}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
          <p className="text-sm text-gray">{parseTimestampToDateString(createdAt)}</p>
          <span className="bg-red text-xs px-2 py-1 rounded text-white flex items-center">
            {isExpired(createdAt) ?
              <span>Expired</span>
              :
              [<span className="text-[10px]">Expires in</span>,
                <span><ClockIcon height={13}/></span> ,<span className="font-bold">{getExpiresIn(createdAt)}</span>]
        }
      </span>
    </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => {e.stopPropagation();setShowConfirmDelete(false)}}>
          <div className="bg-neutral-900 p-6 rounded-lg shadow-xl w-[90%] max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-lg font-semibold mb-2">Delete Project? ({projectTitle})</h2>
            <p className="text-gray-300 mb-4 text-sm">This action cannot be undone. Are you sure you want to delete this project?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm text-gray hover:text-white"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-red hover:bg-red hover:text-white rounded-3xl"
                onClick={async() => {
                  console.log("Deleting project with ID:", externalId);
                  try {
                    setIsDeleting(true);
                    await deleteMyProject(externalId);
                    setShowConfirmDelete(false);
                    toast({
                      description: "Project deleted successfully.",
                      variant: "destructive",
                      title: "Success",
                    });
                    onDeleteSuccess()
                  } catch (error) {
                    toast({
                      description: "Failed to delete project. Please try again.",
                      variant: "destructive",
                      title: "Error",
                    });
                  } finally {
                    setIsDeleting(false)
                  }
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
</div>
)
  ;
};

export default ProjectCard;
