import Header from "@/components/landing-page/header-section";
import FooterSection from "@/components/landing-page/footer-section";
import * as React from "react";
import PricingSection from "@/components/landing-page/pricing-section";

export default function PricingPage() {
  return (
    <div style={{overflow: "hidden"}} className="bg-black relative">
      <div
        className="inset-0 fixed"
        aria-hidden="true"
      >
        <div
          className="bg-radial-custom-multiple from-red_mist_strong via-red_mist to-transparent from-0% via-20% to-90% h-screen w-screen"></div>
      </div>
      <Header/>
      <PricingSection/>
      <FooterSection/>
    </div>
  );
};
