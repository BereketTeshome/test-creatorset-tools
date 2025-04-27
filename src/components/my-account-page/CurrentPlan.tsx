import React, { useState } from "react";
import {CircleIcon, FlameIcon} from "lucide-react";
import {getSelectedSubscriptionPlanDuration} from "@/utils/utils";
import PricingDialog from "@/components/pricing-dialog";

const CurrentPlan = ({isSubscriptionActive, subscriptions, subscriptionAmount}) => {
  const [open, setOpen] = useState(false)
  function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // Short month name (e.g., "Oct")
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th) to the day
    const suffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th'; // 4th-20th always 'th'
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${suffix(day)} ${month}, ${year}`;
  }

  const selectedPlan = getSelectedSubscriptionPlanDuration();
  const subscriptionDuration = selectedPlan === 'monthly' ? 'Month' : 'Year';

  const findDaysUntilNextBillingDate = (billingDate: Date) => {
    const currentDate = new Date(); // Get the current date and time
    const nextBillingDate = new Date(billingDate); // Get the next billing date
    const difference = nextBillingDate.getTime() - currentDate.getTime(); // Find the difference between the two dates
    const days = Math.ceil(difference / (1000 * 3600 * 24)); // Convert the difference to days
    return days;
  }

  return (
    <div className="flex gap-6 mb-8 lg:flex-row flex-col">
      <div className="bg-neutral-800 p-6 rounded-lg relative lg:max-w-[500px] flex-1">
        <h3 className="text-gray-400 mb-2">{isSubscriptionActive ? 'Monthly Plan':'Free Plan'}</h3>
        <div className="flex items-center mb-4 ">
          <span className="text-2xl font-bold">${isSubscriptionActive ? subscriptions[0].amount : '0'}/month</span>
          <span className="absolute right-4 top-4 ml-4 bg-green-400 text-base text-green-700 py-1 px-3 rounded-full border-[1px] border-green-700 flex gap-2 items-center">
            <CircleIcon fill="green" size={16} />{isSubscriptionActive ? subscriptions[0].status :'Active'}
          </span>
        </div>
      </div>

      {isSubscriptionActive ?

        <div className="bg-neutral-800 p-6 rounded-lg lg:max-w-[500px] flex-1">
          <h3 className="text-gray-400 mb-2">Renews on</h3>
          <div className="text-2xl font-bold mb-4">{formatDate(new Date(subscriptions[0].nextBillingDate))}</div>
          <div className="text-sm text-red-500 flex items-center justify-between">
            <span>You plan expires in <strong>{findDaysUntilNextBillingDate(subscriptions[0].nextBillingDate)} days</strong></span>
            <a href="#" className="text-red-400 hover:underline">
              Manage your plan
            </a>
          </div>
          <div className="w-full bg-gray h-2 rounded-full mt-2">
            <div className="bg-red h-2 rounded-full" style={{width: `${(30 - findDaysUntilNextBillingDate(subscriptions[0].nextBillingDate)) / 30 * 100}%`}}></div>
          </div>
        </div>
        :

        <div className="bg-red text-white py-3 px-4 rounded-lg shadow-md flex justify-between items-center lg:max-w-[500px] flex-1">
          <div>
            <div className="flex items-center mb-1 gap-2">
              <div className="p-1 bg-white rounded-md">
                <FlameIcon color='red' size={16}/>
              </div>

                <h1 className="text-xl font-bold">
                  Choose your <span className="text-black">Plan</span>!
                </h1>
            </div>

            <a href="/pricing" className="underline text-white hover:text-gray-200 mb-1 block">
              View all plans
            </a>

            <button className="bg-white text-red font-semibold px-3 py-2 rounded-lg" onClick={() => setOpen(true)}>
              Upgrade to Premium ${subscriptionAmount}/{subscriptionDuration}
            </button>
          </div>

          <div className="text-left text-xs">
            <p className="">Advanced Customization</p>
            <p className="">More video length upto 5 minutes</p>
            <p className="">1080p Resolution</p>
            <p className="">12+ Text Styles</p>
            <p>No Watermark</p>
          </div>
        </div>}
        <PricingDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default CurrentPlan;
