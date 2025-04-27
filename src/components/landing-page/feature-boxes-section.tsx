"use client";
import BeforeAfterWidget from "@/components/landing-page/before-after-widget";
import { Caption } from "@/components/typings/caption";
import { useRouter } from "next/navigation";
import { BeforeAfterCard } from "@/components/landing-page/before-after-card";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const subtitles: Caption[] = [
  {
    text: "Welcome",
    start: 0,
    end: 1,
    profanity: false,
  },
  {
    text: "to",
    start: 1,
    end: 2,
    profanity: false,
  },
  {
    text: "my",
    start: 2,
    end: 3,
    profanity: false,
  },
  {
    text: "channel.",
    start: 3,
    end: 4,
    profanity: false,
  },
];

const FeatureBoxesSection = () => {
  const router = useRouter();

  return (
    <section className="text-white  px-8 relative top-[38px]">
      <div className="max-w-7xl mx-auto text-center space-y-8 relative">
        {/* <div className="absolute bg-[url('/bg/grid-square-red.svg')] w-screen h-screen -ml-32"></div> */}

        {/* Carousel */}
        <div className="flex gap-8 text-center justify-center flex-wrap">
          <div className="relative group flex justify-center">
            <BeforeAfterCard
              imageSrc="/temp/random-phone-img.png"
              subtitles={subtitles}
              title={"Caption Generator"}
              description={"Add captions to your video with 1-click."}
              textStylingSettings={{
                fontSize: "medium",
                fontFamily: "Arial",
                textDisplayFormat: "single-word",
                textDisplayStyle: "normal",
                textDisplayPosition: "bottom",
                animations: "bounce",
              }}
            />
          </div>
          <div className="relative group flex justify-center">
            <BeforeAfterCard
              imageSrc="/temp/random-phone-img.png"
              subtitles={subtitles}
              title={"Profanity Muter"}
              description={"Mute profanity from your videos with 1-click."}
              tryNowLink="/profanity-muter"
              textStylingSettings={{
                fontSize: "large",
                fontFamily: "Arial",
                textDisplayFormat: "one-line",
                textDisplayStyle: "one-word-background",
                textDisplayPosition: "bottom",
                animations: "bounce",
              }}
            />
          </div>

          {/*<div className="relative group flex justify-center">*/}
          {/*  <BeforeAfterCard*/}
          {/*    imageSrc="/temp/random-phone-img.png"*/}
          {/*    subtitles={subtitles}*/}
          {/*    title={"Logo Maker"}*/}
          {/*    description={"Create amazing logos for your channel with AI"}*/}
          {/*    textStylingSettings={*/}
          {/*      {*/}
          {/*        fontSize: 'large',*/}
          {/*        fontFamily: "Arial",*/}
          {/*        textDisplayFormat: "one-line",*/}
          {/*        textDisplayStyle: "one-word-background",*/}
          {/*        textDisplayPosition: "bottom",*/}
          {/*        animations: "bounce",*/}
          {/*      }*/}
          {/*    }*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </div>

      <div className=" relative top-16 sm:top-36  flex flex-col items-center text-center p-4 ">
        <h1
          className={`text-[24px] sm:text-[32px] font-[700] text-[#111] mb-9 ${inter.className}`}
        >
          Designed For :
        </h1>

        <img
          src="./designedFor.png"
          alt="Designed For"
          className="max-w-[337px] w-full md:max-w-[492px] h-auto"
        />
      </div>

      {/* <div className="max-w-7xl mx-auto text-center space-y-8 relative">
        <div className="absolute bg-[url('/bg/grid-square-red.svg')] w-screen h-screen -ml-8">

        </div>
      </div> */}
    </section>
  );
};

export default FeatureBoxesSection;
