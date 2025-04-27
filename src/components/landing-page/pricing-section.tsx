'use client';
import React, {useEffect, useState} from "react";
import {CheckIcon, FlameIcon, SquarePlayIcon, XIcon} from "lucide-react";
import {TryForFreeButton} from "@/components/landing-page/try-for-free-btn";
import {TryNowButton} from "@/components/landing-page/try-now-btn";
import localFont from "@next/font/local";
import * as Switch from "@radix-ui/react-switch";
import {getPublicSubscriptionPlans} from "@/api/payment.api";
import {setSelectedSubscriptionPlan, setSelectedSubscriptionPlanDuration, getSelectedSubscriptionPlanDuration} from "@/utils/utils";

const handlee = localFont({
  src: [
    {
      path: "../../../public/fonts/Handlee-Regular.ttf",
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

const PricingSection = () => {
  const [isYearlySubscriptionChecked, setIsYearlySubscriptionChecked] = useState(true)
  const [subscriptionPlanList, setSubscriptionPlanList] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null); // Default to Plan 2
  
  useEffect(() => {
    getPublicSubscriptionPlans().then((response) => {
      const plans = response.data as Plan[]; // Type cast the response data
      setSubscriptionPlanList(plans);
      setSelectedPlan(response.data[1])
    });
  }, []);

  useEffect(() => {
    const duration = isYearlySubscriptionChecked ? 'yearly' : 'monthly';
    setSelectedSubscriptionPlanDuration(duration)

  }, [isYearlySubscriptionChecked]); 

  const sortedPlans = subscriptionPlanList.sort((a, b) => {
    if (a.name === 'CreatorSet Pro') return -1; // Put "CreatorSet Pro" before other plans
    if (b.name === 'CreatorSet Pro') return 1;
    if (a.name === 'CreatorSet Plus') return -1; // Put "CreatorSet Plus" before other plans
    if (b.name === 'CreatorSet Plus') return 1;
    return 0; // Keep other plans in their original order
  });

  return (
    <section id="pricing" className=" text-white py-16 px-8 relative">
      <div className="absolute overflow-hidden h-full -ml-32">
        <div className="bg-radial-custom from-10% from-red_mist to-transparent to-60% lg:h-screen w-screen h-[200vh]"></div>
      </div>
      <div className="max-w-7xl mx-auto text-center relative">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
           Pricing
        </h2>

        {/* Toggle Year/Month plans */}
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
              // style={{"-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)"}}
            >
              <Switch.Thumb
                className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"/>
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
              <div className="absolute top:[12px] lg:top-[-13px] left-[80px] lg:w-[300px]">
                <div className="flex lg:items-baseline">
                  <div
                    className="w-[30px] h-[20px] lg:h-[65px] lg:w-[100px]"
                  >
                    <img
                      src="/pricing/funky-arrow-left.svg"
                      alt="funky arrow left"
                      draggable="false"
                      // className="w-[100px] h-[80px] lg:w-[200px]"
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
                <SquarePlayIcon color='white'/>
              </div>
              <h3 className="text-xl font-semibold">Starter</h3>
            </div>
            <p className="text-gray2 font-light">Add professional quality subtitles to your shorts, very quickly.</p>
            <div className="text-4xl font-bold">$0<span className="text-lg font-medium">/{isYearlySubscriptionChecked ? 'year' : 'month'}</span></div>
            <TryForFreeButton className="w-full py-4" bgColor="black"/>
            <ul className="text-gray3 space-y-2">
              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> Subtitled Shorts
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> 1 min 30 max
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <XIcon size={16} color="#cd0029"/>Remove Watermark
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <XIcon size={16} color="#cd0029"/> Editable Transcript
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <XIcon size={16} color="#cd0029"/>12+ Text Styles
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <XIcon size={16} color="#cd0029"/> Early Access to New Features
                </div>
              </li>
            </ul>
          </div>
          
          {subscriptionPlanList.map((plan) => (
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
              <TryNowButton className="w-full py-4" selectedPlan={plan}/>
              <ul className="text-gray-400 space-y-2">
                <li>
                  <div className="flex gap-2 items-center">
                    <CheckIcon size={16} /> All Advance Features
                  </div>
                </li>
                <li>
                  <div className="flex gap-2 items-center">
                    <CheckIcon size={16} /> {plan.creditValue} Credits
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

          {/* Trend Maker Plan */}
          {/* <div className="bg-black p-8 rounded-lg shadow-lg space-y-6 lg:max-w-[26vw]">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red rounded-md">
                <FlameIcon color='white'/>
              </div>
              <h3 className="text-xl font-semibold text-white">Trend maker</h3>
            </div>
            <p className="text-gray-400">
              Create, plan, publish and save incredible amounts of time.
            </p>
            <div className="text-4xl font-bold text-white">${isYearlySubscriptionChecked ? '36' : '4'}<span className="text-lg font-medium">/{isYearlySubscriptionChecked ? 'year' : 'month'}</span></div>
            <TryForFreeButton className="w-full py-4" />
            <ul className="text-gray-400 space-y-2">

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/>All Advance Features
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/>{selectedPlan?.creditValue} Credits
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> 3 min max
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> Remove Watermark
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/>Editable Transcript
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> 12+ Text Styles
                </div>
              </li>

              <li>
                <div className="flex gap-2 items-center">
                  <CheckIcon size={16}/> Early Access to New Features
                </div>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
