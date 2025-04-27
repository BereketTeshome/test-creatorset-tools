import { cn } from "@/lib/utils";
import React, {forwardRef, useImperativeHandle, useState} from "react";
import { motion } from "framer-motion";
import TextEditor from "./text-editor";
import TranscriptEditor from "./transcript-editor";

const tabs = [
  { id: "text", label: "Text & Style" },
  { id: "transcript", label: "Transcript" },
];

const TextAndTranscript = forwardRef(({textStylingSettings, onTextStylingSettingsChange, currentTime}: any, ref) => {
  const [selectedTab, setSelectedTab] = useState("text");
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    focusOnTranscriptIndex: (index) => {
      setSelectedTab("transcript");
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
    <div className="h-full w-[380px]">
      <div className="bg-[#111111] overflow-hidden rounded-lg h-full w-full">
        <div className="p-4 border-b border-[#262525] flex items-center gap-4">
          {tabs?.map((item) => {
            return renderTabs(item);
          })}
        </div>
        <div className='overflow-scroll h-full'>
          {selectedTab === "text" && <TextEditor textStylingSettings={textStylingSettings} onTextStylingSettingsChange={onTextStylingSettingsChange}/>}
          {selectedTab === "transcript" && <TranscriptEditor selectedIndex={activeCaptionIndex}
                                                             currentTime={currentTime}
          />}
        </div>
      </div>
    </div>
  );
});

export default TextAndTranscript;
