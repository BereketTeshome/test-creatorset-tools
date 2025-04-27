// @ts-nocheck
import React from "react";
import TranscribedVideo from "@/components/transcibed-video";
import BackButtonOverride from "@/app/behaviour/BackButtonOverride";
import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import {getDataFromToken} from "@/utils/getDataFromToken";

const page = ({ params }: { params: { slug: string } }) => {

  const cookieStore = cookies();
  const user = getDataFromToken(cookieStore);
  console.log("user", user);
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <TranscribedVideo externalId={params.slug} />
      <BackButtonOverride />
    </div>
  );
};

export default page;
