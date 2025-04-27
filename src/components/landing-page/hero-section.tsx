import localFont from "@next/font/local";
import MimicDropzone from "@/components/landing-page/mimic-dropzone";
import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Star } from "lucide-react";
import Image from "next/image";
import { useScreenDetector } from "@/components/ui/use-screen-detector";
import { TryForFreeButton } from "@/components/landing-page/try-for-free-btn";
import { Inter } from "next/font/google";

const handlee = localFont({
  src: [
    {
      path: "../../../public/fonts/Handlee-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-handlee",
});

const getAvatar = (imgSrc: string, alt: string, fallback: string) => {
  return (
    <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden block">
      <Avatar.Image
        className="w-full h-full object-cover"
        src={imgSrc}
        alt={alt}
      />
      <Avatar.Fallback className="" delayMs={600}>
        {fallback}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

const inter = Inter({ subsets: ["latin"] });
const HeroSection = () => {
  return (
    <section className={` text-black  lg:px-8 px-2 relative z-20 text-center`}>
      {/*bg-[url('/bg/grid-square.svg')] bg-cover opacity-20 */}

      <div className="max-w-7xl mx-auto mt-8 z-30 text-center">
        {/* Left Content */}
        <div className="lg:space-y-6 space-y-3 col-span-3 text-center">
          {/* <div className="flex justify-center px-10">
            <div className="bg-[#111] font-[700] text-white w-[234px] h-[36px] sm:w-[395px] sm:h-[64px] rounded-[14px] text-[12px] sm:text-[20px] flex items-center justify-center">
              <p className={`${inter.className} `}>
                SIMPLIFY YOUR CREATIVE PROCESS
              </p>
            </div>
          </div> */}
          <h1
            className={`text-[42px] leading-[1.1] pt-20 sm:pt-0 md:text-[72px] font-[800] ${inter.className} tracking-tight text-black`}
          >
            AI Tools For <br className="block sm:hidden" />
            <span className="inline text-[#E13943]">Your Videos</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
