import React from "react";
import UsageCard from "./UsageCard";
import AvailableCard from "./AvailableCard"
import AddCreditsCard from "./AddCreditsCard";

const UsageSection = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Usage</h2>
      <p className="text-gray-400 mb-6">Your usage renews every month.</p>
      <div className="flex gap-6 lg:flex-row flex-col">
        <UsageCard />
        <AvailableCard />
        <AddCreditsCard />
      </div>
    </div>
  );
};

export default UsageSection;
