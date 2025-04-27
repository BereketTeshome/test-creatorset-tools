import React from "react";
import { TryForFreeButton } from "@/components/landing-page/try-for-free-btn";
import { Inter, Roboto } from "next/font/google";
import CTA from "./CTA";
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300"],
});

const Footer = () => {
  return (
    <>
      <CTA />

      <footer className="bg-[#F4F4F4] text-gray-400 justify-center  px-4 sm:px-8 h-[505px] sm:h-[512px] flex  z-10 ">
        <div className="max-w-[1200px] h-full flex w-full items-center relative top-14">
          {/* Desktop Footer */}
          <div className="hidden md:block w-full ">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <img
                  src="/darkLogo.png"
                  alt="Creatorset Logo"
                  className="w-[200px] sm:w-[286px]"
                />
              </div>

              <ul className={`flex space-x-10 ${inter.className} font-[700]`}>
                <li>
                  <a href="#features" className="hover:text-[#E13943]">
                    Tools
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#E13943]">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#E13943]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#E13943]">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-[#E13943]">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <hr className="my-6 border-[#111] opacity-20" />

            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-col md:items-start text-left">
                <p
                  className={`text-[#838383] ${inter.className} max-w-[500px] text-[13px] sm:text-[14px]`}
                >
                  CreatorSet is the best AI tool to create captivating
                  short-form videos in seconds for content creators and
                  businesses.
                </p>
              </div>

              <ul className="flex space-x-4 sm:text-[14px] text-[13px] font-[400] text-[#111] mt-6 md:mt-0">
                <li>
                  <a
                    href="#login"
                    className="text-red-500 font-medium hover:text-[#E13943]"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a href="#help" className="hover:text-[#E13943]">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#privacy-policy" className="hover:text-[#E13943]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-[#E13943]">
                    Terms of Services
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex justify-between mt-8">
              <div className="mt-4">
                <TryForFreeButton className="w-[152px] sm:w-[190px] text-[16px] h-[52px] font-[700]" />
              </div>
              <div
                className={`text-right text-[12.5px] text-[#878787] font-[300] mt-6 ${roboto.className}`}
              >
                <p>Copyright © CreatorSet 2025</p>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="block md:hidden w-full">
            <div className="mb-4">
              <img src="/darkLogo.png" alt="Creatorset Logo" className="h-8" />
            </div>

            <p className="text-[#838383] text-sm mb-4">
              CreatorSet is the best AI tool to create captivating short-form
              videos in seconds for content creators and businesses.
            </p>

            <div className="mb-6 w-fit text-left">
              <TryForFreeButton className="text-sm px-3 py-2" />
            </div>

            <ul
              className={`flex flex-wrap space-x-4 hover:text-[#E13943] ${inter.className} font-[600]`}
            >
              <li>
                <a href="#tools">Tools</a>
              </li>
              <li>
                <a href="#shop">Shop</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
            </ul>

            <hr className="my-6 border-[#111] opacity-20" />

            <ul className="flex justify-center space-x-4 text-sm text-gray-600 mt-4">
              <li>
                <a
                  href="#login"
                  className="text-red-500 font-medium hover:text-[#E13943]"
                >
                  Login
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-[#E13943]">
                  Help
                </a>
              </li>
              <li>
                <a href="#privacy-policy" className="hover:text-[#E13943]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#E13943]">
                  Terms of Services
                </a>
              </li>
            </ul>

            <div
              className={`text-center text-[12px] text-[#878787] font-[300] relative top-7  ${roboto.className}`}
            >
              <p>Copyright © CreatorSet 2025</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
