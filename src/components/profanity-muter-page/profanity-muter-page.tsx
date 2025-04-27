"use client";
import Home from "@/components/profanity-muter-tool";
import BackButtonOverride from "@/app/behaviour/BackButtonOverride";
import {Caption} from "@/components/typings/caption";
import React, {useState} from "react";
import LoginDialog from "@/components/login-dialog";
import {useRouter} from "next/navigation";
import {useFileContext} from "@/components/landing-page/file-context";

const ProfanityMuterPage = ({isLoggedIn}) => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter();
  return (
    <div className="bg-black2">
      <div className="lg:flex gap-2 justify-center w-full bg-black2 pt-[10px]">
        <div>
          <h2 className="text-white text-[32px]">Profanity Muter</h2>
          <p className="text-gray pb-2">Automatically mute curse words in your videos. </p>
          <Home setIsUploading={setIsUploading} isLoggedIn={isLoggedIn} promptLogin={() => {setOpen(true)}}/>
        </div>
      </div>

      <BackButtonOverride/>

      <LoginDialog open={open} setOpen={setOpen} isLogin={isLogin} setIsLogin={setIsLogin} onLoginSuccess={() => {
        router.refresh();
      }}/>
    </div>
  );
};

export default ProfanityMuterPage;
