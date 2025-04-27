import React from "react";
import BeforeAfterWidget from "@/components/landing-page/before-after-widget";
import { Caption } from "@/components/typings/caption";
import { TextStylingSettings } from "@/components/typings/text-styling-settings";
import { TryForFreeButton } from "@/components/landing-page/try-for-free-btn";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

type Props = {
  imageSrc: string;
  subtitles: Caption[];
  textStylingSettings: TextStylingSettings;
  title: string;
  description: string;
  tryNowLink?: string;
};

export const BeforeAfterCard = ({
  subtitles,
  imageSrc,
  textStylingSettings,
  title,
  description,
  tryNowLink = "captions",
}: Props) => {
  return (
    <div className="bg-white shadow-lg w-[372px] sm:w-[384px] h-[541px] rounded-[20px] p-[21px] text-left pb-7">
      <div className="relative h-80  overflow-hidden rounded-lg">
        <div className="absolute bottom-0 ">
          <BeforeAfterWidget
            imageSrc={imageSrc}
            subtitles={subtitles}
            textStylingSettings={textStylingSettings}
          />
        </div>
      </div>
      <div
        className={`${inter.className} mt-6 mb-3 text-left  text-[#111]  font-[700] text-[20px] sm:text-[24px]`}
      >
        {title}
      </div>
      <p
        className={`text-left text-[#2A2A2A] text-sm font-[400] sm:text-[16px] text-[14px] ${inter.className}`}
      >
        {description}
      </p>
      <div className="mt-8  flex justify-start">
        <TryForFreeButton link={tryNowLink} className="w-[146px] h-[38px]" />
      </div>
    </div>
  );
};
