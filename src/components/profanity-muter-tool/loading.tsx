"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import {useScreenDetector} from "@/components/ui/use-screen-detector";

interface LoadingProps {
    statusDescription: string;
}

const Loading:React.FC<LoadingProps> = ({ statusDescription }) => {

  const { isMobile, isTablet, isDesktop } = useScreenDetector();

  return (
    <div className="h-full flex bg-[#1c1c1c] gap-8 justify-center">
      {/*<div className="flex flex-col h-[77%] gap-6">*/}
      {/*  <div className="h-[162px] w-[109px] animate rounded-lg" />*/}
      {/*  <div className="h-[162px] w-[109px] animate rounded-lg" />*/}
      {/*</div>*/}
        <div
            className={`w-[442px] bg-red flex-col gap-4 rounded-2xl h-[77%] flex items-center justify-center transition-colors duration-300 cursor-pointer`}
        >
            <p className="text-white mt-4">{statusDescription}</p>
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
                    width={200}
                    height={200}
                    className="h-16 w-16"
                />
            </motion.div>
        </div>
    </div>
  );
};

export default Loading;
