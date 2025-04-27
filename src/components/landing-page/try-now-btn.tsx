"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelSubscription, createStripeSubscription, createStripeSubscriptionCheckout, getMySubscription } from "@/api/payment.api";
import { getSelectedSubscriptionPlanDuration, getUserInfo } from "@/utils/utils";
import {useAppDispatch, useAppSelector} from "@/redux/store";

interface PaymentType {
  planId: string;
  type: string;
  amount: number;
  duration: "monthly" | "yearly";
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

type Props = {
  className?: string;
  bgColor?: string;
  text?: string;
  isSubscribe?: boolean;
  selectedPlan: Plan;
  disabled?: boolean;
  isCancelSub? :boolean;
  returnUrl? :string;
};

export function TryNowButton({
  className,
  bgColor = "red",
  text = "Try Now",
  isSubscribe = false,
  selectedPlan,
  disabled = false,
  isCancelSub = false,
  returnUrl = null,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to track loading
  const handleClick = async () => {
    if (isSubscribe) {
      setLoading(true); // Start loading

      const subDuration = getSelectedSubscriptionPlanDuration();
      let subsPlan = selectedPlan.paymentType.filter((sub) => sub.duration === subDuration);
      let mutedExternalId = null
      if(returnUrl && returnUrl === 'profanity') {
        mutedExternalId = localStorage['mutedExternalId']
        returnUrl = returnUrl
      }
      
      try {
        const formData = {
          subscriptionPlan: {
            subsPlan,
            returnUrl: returnUrl ? returnUrl : null, // Check if returnUrl has a value
            mutedExternalId: mutedExternalId ? mutedExternalId : null
          },
        };

        await createStripeSubscription(formData); // Make sure this function is correctly handling the subscription creation

        const checkoutSession = await createStripeSubscriptionCheckout(formData);

        // Redirect the user to the Stripe checkout URL
        window.location.replace(checkoutSession?.data.url);
      } catch (error) {
        console.error("Error creating subscription or checkout session:", error);
        // Handle any errors that might occur (e.g., show an alert)
      } finally {
        setLoading(false); // Stop loading after the request is complete
      }
    } else if(isCancelSub) {
      const user = getUserInfo();
      if (user) {
        const unsubscribe =  await getMySubscription(user.id);

        if(unsubscribe.status === 200) {
          await cancelSubscription(unsubscribe.data[0])
        } 
        
        router.push("/my-account");
      }
    }else {
      // If not subscribing, proceed to the captions page
      router.push("/captions");
    }
  };

  // Inline styles for the button
  const buttonStyles = {
    padding: "10px 24px", // 10px 24px
    fontSize: "16px", // 16px
    fontWeight: "600", // Semi-bold
    backgroundColor: bgColor, // Dynamic background color
    color: "white",
    borderRadius: "6px", // 6px
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.3s",
    width: "auto",
    border: "none",
  };

  // Inline styles for loading state
  const loadingStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Inline styles for the spinner
  const spinnerStyles = {
    border: "4px solid transparent",
    borderTop: "4px solid white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
  };

  // Keyframes for spinner animation
  const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{spinnerKeyframes}</style> {/* Inline Keyframes */}
      
      <button
        style={buttonStyles} // Apply inline styles to the button
        className={className}
        onClick={handleClick}
        disabled={loading || disabled} // Disable button while loading
      >
        {loading ? (
          <span style={loadingStyles}>
            <div style={spinnerStyles}></div> {/* Custom Spinner */}
            <span>Loading...</span>
          </span>
        ) : (
          text
        )}
      </button>
    </>
  );
}
