"use client"
import React, {useEffect, useState} from "react";
import PlansAndBillings from "@/components/my-account-page/PlansAndBillings";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import RequestPasswordForm from "@/components/my-account-page/RequestPasswordForm";
import {getUserInfo} from "@/utils/utils";
import {useRouter} from "next/navigation";

const tabs = [
  { id: "subscription", label: "My Subscription" },
  { id: "change-password", label: "Change my Password" },
];



const MyAccountPage = () => {
  const router = useRouter();

  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      // route to homepage
      router.push("/")
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState("subscription");

  const renderTabs = ({ id, label }: { id: string; label: string }) => {
    return (
      <button
        onClick={() => setSelectedTab(id)}
        className={cn(
          "relative duration-200",
          selectedTab === id ? "text-white" : "text-[#797676]"
        )}
      >
        {label}
        {selectedTab === id && (
          <motion.div
            layoutId="selected"
            className="absolute -bottom-1 w-full h-0.5 bg-[#E13943]"
          />
        )}
      </button>
    );
  };

  return (
    <div className="bg-black2 text-white lg:p-8 p-4 min-h-screen">
      <h1 className="text-2xl font-bold">My Account</h1>

      <div className="py-4 border-b border-[#262525] flex items-center gap-4">
        {tabs?.map((item) => {
          return renderTabs(item);
        })}
      </div>
      {selectedTab === 'subscription' &&
          <PlansAndBillings/>
      }

      {selectedTab === 'change-password' &&
          <RequestPasswordForm/>
      }
    </div>
  );
};

export default MyAccountPage;
