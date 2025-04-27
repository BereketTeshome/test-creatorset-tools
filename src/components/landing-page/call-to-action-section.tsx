import MimicDropzone from "@/components/landing-page/mimic-dropzone";
import React from "react";
import {TryForFreeButton} from "@/components/landing-page/try-for-free-btn";

const CallToActionSection = () => {
  return (
    <div className="relative lg:px-0 ">
      <div
        className="absolute inset-0.5 bg-cover opacity-20 bg-gradient-to-t from-red via-red_mist to-transparent from-0% via-80% to-90% bottom-10"
      ></div>

      <div
        className="absolute bottom-0 bg-black w-full h-20"
      >
      </div>

      <div className="px-5">

        <section className="relative bg-red text-white py-16 px-8 md:mx-48 sm:mx-2 rounded-3xl ">

          {/* PNG Grid Overlay */}
          <div
            className="absolute inset-0 bg-[url('/bg/grid.svg')] bg-cover opacity-20 z-10 overflow-hidden rounded-3xl"
            aria-hidden="true"
          ></div>

          <div className="max-w-7xl mx-auto flex items-center gap-8 flex-col">
            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-center lg:px-10 z-20">
              Get Started Here
            </h2>

            <div className="z-50">
              <TryForFreeButton text="Try Tools" bgColor="black"/>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default CallToActionSection;
