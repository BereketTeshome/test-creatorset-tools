// @ts-nocheck
import React from "react";
import VideoEditor from "@/components/profanity-muter-tool/video-editor";
import BackButtonOverride from "@/app/behaviour/BackButtonOverride";
import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import {getDataFromToken} from "@/utils/getDataFromToken";
import {redirect} from "next/navigation";

const page = ({ params }: { params: { slug: string } }) => {

  const cookieStore = cookies();
  const user = getDataFromToken(cookieStore);
  console.log("user", user);
  if (!user) {
    redirect("/")
  }
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <VideoEditor slug={params.slug} />
      <BackButtonOverride />
    </div>
  );
};

export default page;
