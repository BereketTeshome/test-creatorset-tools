"use client";
import Home from "@/components/caption-tool";
import BackButtonOverride from "@/app/behaviour/BackButtonOverride";
import {Caption} from "@/components/typings/caption";
import BeforeAfterWidget from "@/components/landing-page/before-after-widget";
import React, {useState} from "react";
import LoginDialog from "@/components/login-dialog";
import {useRouter} from "next/navigation";
import { getUserInfo } from "@/utils/utils";
import PricingDialog from "../pricing-dialog";


const subtitles: Caption[] = [
  {
    text: "Welcome",
    start: 0,
    end: 1,
    profanity: false
  },
  {
    text: "to",
    start: 1,
    end: 2,
    profanity: false
  },
  {
    text: "my",
    start: 2,
    end: 3,
    profanity: false
  },
  {
    text: "channel.",
    start: 3,
    end: 4,
    profanity: false
  }
];

const CaptionsPage = () => {
  const [open, setOpen] = useState(false);
  const  [openCheckoutDialog, setCheckoutDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter();
  
  function handleSubscription(): void {
    const user = getUserInfo();
    if (user) {
      setOpen(false)
      setCheckoutDialogOpen(true); 
      // window.location.replace('/my-account');
    } else {
      setCheckoutDialogOpen(false); 
      setOpen(true)
    }
  }
  return (
    <div className="bg-black2">
      <div className="lg:flex gap-2 justify-center w-full bg-black2 pt-[10px]">
        <div>
          <h2 className="text-white text-[32px]">Caption Generator</h2>
          <p className="text-gray pb-2">Upload your video and let ai add captions to it. </p>
          <Home setIsUploading={setIsUploading}/>
        </div>

        {!isUploading
          &&

            <div className="pt-[80px]">
                <div className="relative h-[400px] w-[300px] overflow-hidden rounded mx-auto ">
                    <div className="absolute -top-10">
                        <BeforeAfterWidget
                            imageSrc="/temp/random-phone-img.png"
                            subtitles={subtitles}
                            textStylingSettings={
                              {
                                fontSize: 'large',
                                fontFamily: "Arial",
                                textDisplayFormat: "one-line",
                                textDisplayStyle: "one-word-background",
                                textDisplayPosition: "center",
                                animations: "bounce",
                              }
                            }
                        />
                    </div>
                </div>


                <div className="bg-neutral-900 text-white p-4 rounded-lg max-w-4xl mx-auto w-[300px]">
                    <h2 className="flex items-center text-sm font-semibold mb-1">
              <span className="mr-2 text-red-500">

                <img
                    src="/creatorset-logo.svg"
                    alt="Draggable Logo"
                    draggable="false"
                    className="w-[20px] h-[20px]"
                />
              </span>
                        Our Plans and Pricing
                    </h2>
                    <h3 className="text-lg font-bold mb-8">
                        Compare our <span className="text-red">Plans</span>
                    </h3>

                    <table className="min-w-full table-auto text-sm">
                        <thead>
                        <tr className="text-white">
                            <th className="text-left"></th>
                            <th className="text-left">Free Plan</th>
                            <th className="text-left">Premium Plan</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="text-xs">
                            <td className=" text-gray4">Customization</td>
                            <td className="">No</td>
                            <td className=" text-red">Advanced</td>
                        </tr>
                        <tr className="text-xs">
                            <td className=" text-gray4">Max Video Length</td>
                            <td className="">30 seconds</td>
                            <td className="text-red">5 minutes</td>
                        </tr>
                        <tr className="text-xs">
                            <td className=" text-gray4">Resolution</td>
                            <td className="">720p</td>
                            <td className="text-red">1080p</td>
                        </tr>
                        <tr className="text-xs">
                            <td className=" text-gray4">Watermark</td>
                            <td className="">Yes</td>
                            <td className="text-red">No</td>
                        </tr>
                        <tr className="text-xs">
                            <td className=" text-gray4">Text Styles</td>
                            <td className="">Basic</td>
                            <td className="text-red">12+</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="mt-8 text-center">
                        <button className="bg-red hover:bg-red text-white py-2 px-6 rounded-lg font-medium"
                                onClick={handleSubscription}>
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
            </div>
        }

      </div>

      <BackButtonOverride/>
      <PricingDialog open={openCheckoutDialog} setOpen={setCheckoutDialogOpen}/>
      <LoginDialog open={open} setOpen={setOpen} isLogin={isLogin} setIsLogin={setIsLogin} onLoginSuccess={(res) => {
        router.push("/my-projects");
      }}/>
    </div>
  );
};

export default CaptionsPage;
