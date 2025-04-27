import React from "react";
import { TryForFreeButton } from "./try-for-free-btn";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
const CTA = () => {
  return (
    <div className=" w-full  flex  justify-center">
      <div className="max-w-[1272px] scale-90 mx-4 sm:h-[236px] md:h-[380px]  w-full sm:mx-16 relative bg-[#f4f4f4] top-28 shadow-xl z-50  rounded-[36px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden px-4 md:px-6">
        {/* Text Content */}
        <div className=" z-10 max-w-xl md:text-left flex">
          <div className="pl-2 md:pl-10 w-[70%] lg:w-[100%]">
            <h2
              className={`text-[21px] md:text-[42px] leading-tight font-[700] pt-0 md:pt-0 text-[#111] ${inter.className}`}
            >
              Ready To Start Creating Today?
            </h2>
            <p className="text-[#111] opacity-50 font-[400] my-8 sm:text-[16px] text-[12px] ">
              Lorem ipsum dolor sit amet consectetur. Diam tortor felis
              elementum nibh nunc mattis varius ultrices.
            </p>
            <div>
              <TryForFreeButton className="w-[173px] font[-700] md:font-[800] " />
            </div>
          </div>

          <div className=" ml-10">
            <div className="absolute  inset-y-0 right-[-20px]  scale-x-75 scale-y-105   lg:hidden">
              <img
                src="./bannerArrowMobile.png"
                alt="Arrow"
                className="h-full "
              />
            </div>
          </div>
        </div>

        {/* w-full 1000:w-[60%] 1100:w-[70%] 1200:w-[80%] */}
        {/* Image (Hidden on Small Screens) */}
        <div className="hidden lg:block relative z-10">
          {/* Shadow Image (Lower Z-Index) */}
          <img
            src="./bannerArrow.png"
            alt="Shadow"
            className="max-w-xs scale-x-125 xl:scale-x-150 absolute right-[20px] xl:right-[125px] bottom-[-196px] z-0"
          />
          {/* lg:scale-x-150 */}
          {/* Main Image (Higher Z-Index) */}
          <img
            src="./banner.png"
            alt="Preview"
            className="xl:max-w-2xl absolute max-w-md right-[-47px] top-[-93px] xl:top-[-182px] z-50"
          />
        </div>
      </div>
    </div>
  );
};

export default CTA;
