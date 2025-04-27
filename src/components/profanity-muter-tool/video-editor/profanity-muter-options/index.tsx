import { cn } from "@/lib/utils";
import React, {forwardRef, useImperativeHandle, useState} from "react";
import { motion } from "framer-motion";
import WhitelistWords from "./whitelist-words";
import ProfanityList from "./profanity-list";
import MuteSettings from "@/components/profanity-muter-tool/video-editor/profanity-muter-options/mute-settings";

const tabs = [
  { id: "profanity-list", label: "Profanity List" },
  { id: "whitelisted-words", label: "Whitelisted Words" },
  { id: "mute-settings", label: "Mute Settings" },
];

const ProfanityMuterOptions = forwardRef(({currentTime, bleepMethod, setBleepMethod, wordRetention, setWordRetention}: any, ref) => {
  const [selectedTab, setSelectedTab] = useState("profanity-list");
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    focusOnTranscriptIndex: (index) => {
      setSelectedTab("profanity-list");
      setActiveCaptionIndex(index);
    }
  }));

  const renderTabs = ({ id, label }: { id: string; label: string }) => {
    return (
      <button
        onClick={() => setSelectedTab(id)}
        className={cn(
          "relative duration-200",
          selectedTab === id ? "text-white" : "text-[#797676]"
        )}
      >
        {label}
        {selectedTab === id && (
          <motion.div
            layoutId="selected"
            className="absolute -bottom-1 w-full h-0.5 bg-[#E13943]"
          />
        )}
      </button>
    );
  };

  return (
    <div className="h-full w-[380px] grid grid-rows-[auto_1fr]">
      <div className="p-4 flex items-center gap-4">
        {tabs?.map((item) => {
          return renderTabs(item);
        })}
      </div>
      <div className="bg-[#111111] overflow-hidden rounded-lg w-full border border-gray3 flex-grow flex flex-col">
        <div className='overflow-y-auto h-[calc(100vh-300px)] flex-grow'>
          {selectedTab === "profanity-list" &&
              <ProfanityList selectedIndex={activeCaptionIndex} currentTime={currentTime}/>}
          {selectedTab === "whitelisted-words" && <WhitelistWords />}
          {selectedTab === "mute-settings" && <MuteSettings
            bleepMethod={bleepMethod}
            setBleepMethod={setBleepMethod}
            wordRetention={wordRetention}
            setWordRetention={setWordRetention}
          />}
        </div>
      </div>
    </div>
  );
});

export default ProfanityMuterOptions;
