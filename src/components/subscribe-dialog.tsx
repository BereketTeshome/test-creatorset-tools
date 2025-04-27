"use client";
import React, {Dispatch, SetStateAction} from "react";
import {Dialog as DialogComponent, DialogContent, DialogTitle} from "./ui/dialog";
import {DialogClose, DialogDescription} from "@radix-ui/react-dialog";
import PaymentMethod from "@/components/payment/PaymentMethod";
import {getSelectedSubscriptionPlanDuration} from "@/utils/utils";

const SubscriptionOptionsDetails = ({onSubscribePaidPlanClick, subscriptionAmount, subscriptionDuration}) => (
  <>
    <DialogTitle className="text-2xl font-semibold mb-4">
      You discovered a new Premium Feature!
    </DialogTitle>
    <DialogDescription className="text-lg mb-6">
      Unlock full capabilities by choosing a plan below.
    </DialogDescription>

    {/* Free Plan Box */}
    <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gray-800">
      <h3 className="text-lg font-bold mb-2">Free</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>720p download</li>
        <li>No ability to correct typos</li>
        <li>Bouncy animation included</li>
        <li>Watermark bottom right subtle Captions by CreatorSet.com</li>
      </ul>
    </div>

    {/* Paid Plan Box */}
    <div className="border border-red-500 rounded-lg p-4 mb-6 bg-gray-800">
      <h3 className="text-lg font-bold mb-2 text-rose-500">Paid (Only ${subscriptionAmount} {subscriptionDuration})</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Full resolution</li>
        <li>Customizable stroke color</li>
        <li>Editable transcriptions</li>
      </ul>
      <button className="mt-4 w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-red-600 transition duration-200"
              onClick={onSubscribePaidPlanClick}
      >
        Subscribe
      </button>
    </div>

  </>
);

const SubscribeDialog = ({
                           open,
                           setOpen,
                           subscriptionAmount,
                           subscriptionPlan,
                         }: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  subscriptionAmount: string,
  subscriptionPlan: any
}) => {

  const [paidPlanSelected, setPaidPlanSelected] = React.useState(false);
  
  const selectedPlan = getSelectedSubscriptionPlanDuration();
  const subscriptionDuration = selectedPlan === 'monthly' ? 'Monthly' : 'Yearly';

  return (
    <DialogComponent open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`p-0 outline-none bg-black2 !rounded-2xl border-none duration-200
        text-white rounded-lg p-6 max-w-md w-full shadow-lg
        `}
      >
        {
          paidPlanSelected ? (
            <PaymentMethod subscriptionPlan={subscriptionPlan}/>
            ) :
            <SubscriptionOptionsDetails onSubscribePaidPlanClick = {() => setPaidPlanSelected(true)} subscriptionAmount={subscriptionAmount} subscriptionDuration={subscriptionDuration}/>

        }

        <DialogClose asChild>
          <button className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </DialogComponent>)
};

export default SubscribeDialog;
