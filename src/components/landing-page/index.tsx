// @flow
import * as React from "react";
import Header from "@/components/landing-page/header-section";
import HeroSection from "@/components/landing-page/hero-section";
import FeatureBoxesSection from "@/components/landing-page/feature-boxes-section";
import FooterSection from "@/components/landing-page/footer-section";

export const LandingPage = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f5f5f5, #fff)",
        overflow: "hidden",
      }}
      className="relative"
    >
      {/* <div className="inset-0 fixed" aria-hidden="true">
        <div className="bg-radial-custom-multiple from-red_mist_strong via-red_mist to-transparent from-0% via-20% to-90% h-screen w-screen"></div>
      </div> */}
      <Header />
      <div className="scale-[100%] sm:scale-[80%] relative bottom-16">
        <HeroSection />

        <FeatureBoxesSection />
      </div>
      <FooterSection />
    </div>
  );
};
