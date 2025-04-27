import Navbar from "@/components/navbar";
import React from "react";
import CaptionsPage from "@/components/caption-page/caption-page";
import {cookies} from "next/headers";
import {getDataFromToken} from "@/utils/getDataFromToken";


const page = async () => {
  const cookieStore = cookies();
  const user = await getDataFromToken(cookieStore);
  console.log("user", user);
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <CaptionsPage />
    </div>
  );
};

export default page;
