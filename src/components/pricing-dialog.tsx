'use client';

import React, { useEffect, useState } from "react";
import { CheckIcon, FlameIcon, SquarePlayIcon, XIcon } from "lucide-react";
import { TryNowButton } from "@/components/landing-page/try-now-btn";
import { TryForFreeButton } from "@/components/landing-page/try-for-free-btn";
import localFont from "@next/font/local";
import * as Switch from "@radix-ui/react-switch";
import { getMySubscription, getPublicSubscriptionPlans } from "@/api/payment.api";
import { getUserInfo, setSelectedSubscriptionPlan, setSelectedSubscriptionPlanDuration } from "@/utils/utils";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";


// Handlee font import
const handlee = localFont({
  src: [
    {
      path: "../../public/fonts/Handlee-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-handlee",
});

// Types for plan data
interface PaymentType {
  planId: string;
  type: string;
  amount: number;
  duration: 'monthly' | 'yearly';
}

interface Note {
  description: string;
}

interface Plan {
  id: string;
  name: string;
  amount: number;
  creditValue: number;
  amountMonthly: number;
  amountYearly: number;
  description: string;
  paymentType: PaymentType[];
  notes: Note[];
}

const PricingDialog = ({ open, setOpen, returnUrl = null}) => {
  const [isYearlySubscriptionChecked, setIsYearlySubscriptionChecked] = useState(true);
  const [subscriptionPlanList, setSubscriptionPlanList] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>({}); // Default to Plan 2
  const [subscriptions, setSubscriptions] = useState([])
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false); // Track if user has active subscription
  const [isCurrentSubs, setIsCurrentSubs] = useState(false);
  // Fetch plans when the component mounts
  useEffect(() => {
     const user = getUserInfo();
      if (user) {
        const currentDate = new Date(); // Get the current date and time
  
        getMySubscription(user.id).then((response) => {
          if (response.data.length > 0 && response.data.some(sub => new Date(sub.nextBillingDate) > currentDate)) {
            setSubscriptions(response.data.filter(sub => new Date(sub.nextBillingDate) > currentDate))
            setHasActiveSubscription(true); // User has an active subscription
          }
        })
      }
        
    getPublicSubscriptionPlans().then((response) => {
      const plans = response.data as Plan[]; // Type cast the response data
      setSubscriptionPlanList(plans);
      setSelectedPlan(response.data[1]);
    });
  }, []);

  // Update the selected plan based on the subscription type (monthly/yearly)
  useEffect(() => {
    const handlePlanChange = () => {
      const duration = isYearlySubscriptionChecked ? 'yearly' : 'monthly';
      const index = isYearlySubscriptionChecked ? 1 : 0;
      const selected = subscriptionPlanList[index];
      if (selected) {
        setSelectedPlan(selected);
        setSelectedSubscriptionPlan(selected);
        setSelectedSubscriptionPlanDuration(duration)
      }
    };

    handlePlanChange();
  }, [isYearlySubscriptionChecked, subscriptionPlanList]);

  // Sort plans (ensure "CreatorSet Pro" is at the top)
  const sortedPlans = subscriptionPlanList.sort((a, b) => {
    if (a.name === 'CreatorSet Pro') return -1;
    if (b.name === 'CreatorSet Pro') return 1;
    if (a.name === 'CreatorSet Plus') return -1;
    if (b.name === 'CreatorSet Plus') return 1;
    return 0;
  });

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  const comparePlans = (payment: PaymentType) => {
    // Comparing monthly plans
    const currentPayment =  subscriptions.filter((sub) => sub.planId === payment.planId) 

    let allPaymentTypes = [];

    // Loop through each plan and extract paymentType
    sortedPlans.forEach(plan => {
      plan.paymentType.forEach(payment => {
        allPaymentTypes.push(payment); // Collect each paymentType
      });
    });

    if (subscriptions.length === 0) {
      return 'Upgrade'
    } else {
      if(currentPayment.length > 0) {
        return 'Current'
      }
      const currentSubId = subscriptions[0].planId
      const currentSubAmount = subscriptions[0].amount
     
      if(isYearlySubscriptionChecked ) {
        const hasMoreValue = allPaymentTypes.find(p => p.duration === 'yearly' && p.planId !== currentSubId && p.amount > currentSubAmount);
        if(hasMoreValue) {
          return 'Upgrade'
        } else {
          return 'Downgrade'
        }
      } else {
        const hasMoreValue = allPaymentTypes.find(p => p.duration === 'monthly' && p.planId !== currentSubId && p.amount > currentSubAmount);
        if(hasMoreValue) {
          return 'Upgrade'
        } else {
          return 'Downgrade'
        }
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="bg-black2 p-0 outline-none !rounded-2xl border-none w-full h-full max-w-full max-h-full duration-200 overflow-y-auto"
      >
        {/* Close Button
        <DialogClose
          className="absolute top-6 right-6 text-white text-2xl cursor-pointer hover:text-red"
          onClick={handleClose}
        >
          &times;
        </DialogClose> */}

        {/* Dialog Title */}
        <DialogTitle className="text-4xl lg:text-5xl font-bold text-white mb-6">
        </DialogTitle>

        {/* Pricing Section */}
        <section id="pricing" className="text-white py-16 px-8 relative">
          <div className="absolute overflow-hidden h-full -ml-32">
            <div className="bg-radial-custom from-10% from-red_mist to-transparent to-60% lg:h-screen w-screen h-[200vh]"></div>
          </div>
          <div className="max-w-7xl mx-auto text-center relative">
            {/* Toggle for monthly/yearly subscription */}
            <div className="w-full text-center mb-20">
              <div className="flex items-center justify-center">
                <label
                  className="pr-[15px] text-[15px] leading-none text-white"
                  htmlFor="airplane-mode"
                >
                  Pay Monthly
                </label>
                <Switch.Root
                  className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray2 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-red"
                  id="airplane-mode"
                  checked={isYearlySubscriptionChecked}
                  onCheckedChange={() => setIsYearlySubscriptionChecked(!isYearlySubscriptionChecked)}
                >
                  <Switch.Thumb
                    className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
                  />
                </Switch.Root>
                <label
                  className="pl-[15px] text-[15px] leading-none text-white relative"
                  htmlFor="airplane-mode"
                >
                  Pay Yearly
                  <div className="absolute">
                    <img
                      src="/pricing/scribble-underline.svg"
                      alt="scribble underline"
                      draggable="false"
                      className="w-[70px] h-[20px]"
                    />
                  </div>
                  <div className="absolute top-[12px] lg:top-[-13px] left-[80px] lg:w-[300px]">
                    <div className="flex lg:items-baseline">
                      <div className="w-[30px] h-[20px] lg:h-[65px] lg:w-[100px]">
                        <img
                          src="/pricing/funky-arrow-left.svg"
                          alt="funky arrow left"
                          draggable="false"
                        />
                      </div>
                      <div className="text-red lg:w-20 w-2 lg:text-lg">
                        Save 25%
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="flex justify-center gap-8 flex-wrap">
              {/* Starter Plan */}
              <div className="bg-white text-black p-8 rounded-lg shadow-lg space-y-6 lg:max-w-[26vw]">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray3 rounded-md">
                    <SquarePlayIcon color="white" />
                  </div>
                  <h3 className="text-xl font-semibold">Starter</h3>
                </div>
                <p className="text-gray2 font-light">Add professional quality subtitles to your shorts, very quickly.</p>
                <div className="text-4xl font-bold">$0
                  <span className="text-lg font-medium">
                    /{isYearlySubscriptionChecked ? 'year' : 'month'}
                  </span>
                </div>
                {/* <TryForFreeButton className="w-full py-4" bgColor="black" /> */}

                <TryNowButton 
                    className="w-full py-4" 
                    bgColor="black" 
                    selectedPlan= {null} 
                    text={hasActiveSubscription ? 'Downgrade' : 'Current'}
                    isSubscribe={false}
                    isCancelSub={true}
                    />
                <ul className="text-gray3 space-y-2">
                  <li>
                    <div className="flex gap-2 items-center">
                      <CheckIcon size={16} /> Subtitled Shorts
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-2 items-center">
                      <CheckIcon size={16} /> 1 min 30 max
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-2 items-center">
                      <XIcon size={16} color="#cd0029" /> Remove Watermark
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-2 items-center">
                      <XIcon size={16} color="#cd0029" /> Editable Transcript
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-2 items-center">
                      <XIcon size={16} color="#cd0029" /> 12+ Text Styles
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-2 items-center">
                      <XIcon size={16} color="#cd0029" /> Early Access to New Features
                    </div>
                  </li>
                </ul>
              </div>

              {/* Loop through subscription plans */}
              {sortedPlans.map((plan) => (
                <div key={plan.id} className="bg-black p-8 rounded-lg shadow-lg space-y-6 lg:max-w-[26vw]">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red rounded-md">
                      <FlameIcon color="white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                  <div className="text-4xl font-bold text-white">
                    {/* Render amount based on paymentType */}
                    {
                      plan.paymentType.map((payment) => (
                        payment.duration === (isYearlySubscriptionChecked ? 'yearly' : 'monthly') && (
                          <div key={payment.planId}>
                            ${payment.amount}
                            <span className="text-lg font-medium">/{isYearlySubscriptionChecked ? "year" : "month"}</span>
                          </div>
                        )
                      ))
                    }
                  </div>
                  {
                      plan.paymentType.map((payment) => (
                        payment.duration === (isYearlySubscriptionChecked ? 'yearly' : 'monthly') && (
                          <TryNowButton 
                            key={plan.id}
                            className="w-full py-4 " 
                            isSubscribe={true} 
                            selectedPlan={plan}
                            text={comparePlans(payment)}
                            disabled={subscriptions.some((sub) => sub.planId === payment.planId)} 
                            isCancelSub={false}
                            returnUrl={returnUrl}
                          />
                        )
                      ))
                    }
                  
                  <ul className="text-gray-400 space-y-2">
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> All Advanced Features
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> {isYearlySubscriptionChecked ? (plan.creditValue * 12) : plan.creditValue} Credits
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> 3 min max
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> Remove Watermark
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> Editable Transcript
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> 12+ Text Styles
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center">
                        <CheckIcon size={16} /> Early Access to New Features
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default PricingDialog;
