import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import React from "react";

export const FunctionTabs = ({activeTab, onTabChange}: {activeTab: "EDITOR"|"TEXT"|"TRANSCRIPT"|"UPLOAD"|"DOWNLOAD", onTabChange: (tab) => void}) => {

  const tabTriggerClass = "flex-1 py-3 px-1 text-[12px] text-center text-gray hover:text-white focus:outline-none" +
    " data-[state=active]:text-white data-[state=active]:outline-2 data-[state=active]:outline-red w-[20%] rounded"
  const tabTriggerInnerDivClass = 'flex flex-col justify-center items-center gap-2 '

  return (
    <Tabs.Root value={activeTab} onValueChange={(val) =>onTabChange(val)} className="flex flex-col w-full bg-black text-white fixed bottom-0 left-0 ">
      <Tabs.List className="flex border-b border-gray-700 gap-2 pb-1 px-1">
        <Tabs.Trigger
          value="EDITOR"
          className={tabTriggerClass}
        >
          <div className={tabTriggerInnerDivClass}>
            <Image
              src="/tabs/editor.svg"
              alt=""
              draggable={false}
              width={20}
              height={20}
              className=""
            />
            Editor
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="TEXT"
          className={`${tabTriggerClass}`}
        >
          <div className={tabTriggerInnerDivClass}>
            <Image
              src="/tabs/text.svg"
              alt=""
              draggable={false}
              width={20}
              height={20}
              className=""
            />
            Text & Style
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="TRANSCRIPT"
          className={tabTriggerClass}
        >
          <div className={tabTriggerInnerDivClass}>
            <Image
              src="/tabs/transcript.svg"
              alt=""
              draggable={false}
              width={20}
              height={20}
              className=""
            />
            Transcript
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="UPLOAD"
          className={tabTriggerClass}
        >
          <div className={tabTriggerInnerDivClass}>
            <Image
              src="/tabs/upload.svg"
              alt=""
              draggable={false}
              width={20}
              height={20}
              className=""
            />
            Upload
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="DOWNLOAD"
          className={tabTriggerClass}
        >
          <div className={tabTriggerInnerDivClass}>
            <Image
              src="/tabs/download.svg"
              alt=""
              draggable={false}
              width={20}
              height={20}
              className=""
            />
            Download
          </div>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}
