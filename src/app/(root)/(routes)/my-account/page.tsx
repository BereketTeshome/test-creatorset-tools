import Navbar from "@/components/navbar";
import React from "react";
import {cookies} from "next/headers";
import {getDataFromToken} from "@/utils/getDataFromToken";
import MyAccountPage from "@/components/my-account-page";


const page = async () => {
  const cookieStore = cookies();
  const user = await getDataFromToken(cookieStore);
  console.log("user", user);
  return (
    <div>
      <Navbar userId={user?.sub} user={user} />
      <MyAccountPage />
    </div>
  );
};

export default page;
