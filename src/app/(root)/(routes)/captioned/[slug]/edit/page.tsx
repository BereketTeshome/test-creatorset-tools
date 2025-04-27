// @ts-nocheck
import Navbar from "@/components/navbar";
import VideoEditor from "@/components/video-editor";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { cookies } from "next/headers";
import BackButtonHandler from "@/app/behaviour/BackButtonOverride";
import React from "react";
import {redirect} from "next/navigation";

const page = async ({ params }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const user = await getDataFromToken(cookieStore);
  console.log("user", user);
  if (!user) {
    redirect("/")
  }
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <VideoEditor slug={params.slug}/>
      <BackButtonHandler />
    </div>
  );
};

export default page;
