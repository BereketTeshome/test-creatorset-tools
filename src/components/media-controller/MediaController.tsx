import React, {useEffect, useState} from "react";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {
  PauseIcon,
  PlayIcon,
  Redo2Icon,
  Undo2Icon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon
} from "lucide-react";

const MediaController = ({ videoRef }: {videoRef: HTMLVideoElement | null}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const {isMobile, isTablet, isDesktop} = useScreenDetector()

  useEffect(() => {
    if (videoRef) {
      videoRef.addEventListener("timeupdate", handleTimeUpdate);
      videoRef.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.addEventListener("play", handlePlay);
      videoRef.addEventListener("pause", handlePause);

      return () => {
        videoRef.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoRef.removeEventListener("play", handlePlay);
        videoRef.removeEventListener("pause", handlePause);
      };
    }

  }, [videoRef]);

  useEffect(() => {
    if (videoRef) {
      if (isMuted) {
        videoRef.volume = 0;
      } else {
        videoRef.volume = volume;
      }
    }

  }, [isMuted]);

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  }

  const handlePause = () => {
    setIsPlaying(false);
  }

  const handleTimeUpdate = () => {
    if (videoRef) {
      setCurrentTime(videoRef.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef) {
      setDuration(videoRef.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef) {
      const seekTime = (e.target.value / 100) * duration;
      videoRef.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    if (videoRef) {
      videoRef.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const toggleFullScreen = () => {
    if (videoRef) {
      if (!document.fullscreenElement) {
        videoRef.requestFullscreen();
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  function renderVolumeIcon() {
    if (isMuted) {
      return <VolumeXIcon size={isDesktop ? 20:16} />;
    } else if (volume === 0) {
      return <VolumeIcon size={isDesktop ? 20:16} />;
    } else if (volume < 0.5) {
      return <Volume1Icon size={isDesktop ? 20:16} />;
    } else {
      return <Volume2Icon size={isDesktop ? 20:16} />;
    }

  }

  return (
    <div className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-md shadow-md">
      {/* Time */}
      <div className="text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Rewind Button */}
        <button
          onClick={() => {
            if (videoRef) {
              videoRef.currentTime -= 10;
              setCurrentTime(videoRef.currentTime);
            }
          }}
          className="text-lg"
        >
          <Undo2Icon size={isDesktop ? 20:16} />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`bg-white text-black text-center content-center ${isDesktop ? 'pl-1.5 w-8 h-8 text-base ': 'pl-1 w-6 h-6 text-sm '} rounded-full hover:bg-gray`}
        >
          {isPlaying ? <PauseIcon fill='#333' size={isDesktop ? 20:16}/>:<PlayIcon fill='#333' size={isDesktop ? 20:16}/>}
        </button>

        {/* Forward Button */}
        <button
          onClick={() => {
            if (videoRef) {
              videoRef.currentTime += 10;
              setCurrentTime(videoRef.currentTime);
            }
          }}
          className="text-lg"
        >
          <Redo2Icon size={isDesktop ? 20:16} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <span onClick={() => setIsMuted(!isMuted)}>{renderVolumeIcon()}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={handleVolumeChange}
          className="w-20"
        />
      </div>

      {/* Fullscreen Toggle */}
      <button onClick={toggleFullScreen} className="text-lg">
        {isFullScreen ? "⛶" : "⛶"}
      </button>
    </div>
  );
};

export default MediaController;
