import Navbar from "@/components/navbar";
import React from "react";
import CaptionsPage from "@/components/caption-page/caption-page";
import {cookies} from "next/headers";
import {getDataFromToken} from "@/utils/getDataFromToken";
import ProfanityMuterPage from "@/components/profanity-muter-page/profanity-muter-page";


const page = async () => {
  const cookieStore = cookies();
  const user = await getDataFromToken(cookieStore);
  console.log("user", user);

  const isLoggedIn = !!user?.sub ;
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <ProfanityMuterPage isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default page;
