"use client";
import { TryForFreeButton } from "@/components/landing-page/try-for-free-btn";
import LoginDialog from "@/components/login-dialog";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="max-w-[1440px] mx-auto w-full ">
      <div className="top-4 z-50 w-full pt-4 ">
        <header className="flex items-center justify-between mx-2 sm:mx-12 px-1 sm:px-4 py-4 bg-transparent text-white bg-opacity-50 backdrop-blur rounded-lg">
          {/* Logo and Navigation Container */}
          <div className="flex items-center space-x-6">
            <a href="/">
              <h2 className="text-lg font-bold text-white flex items-center gap-1 mr-10 ">
                <img
                  src="/darkLogo.png"
                  alt="Creatorset Logo"
                  className="w-[189px] sm:w-[195px]"
                />
              </h2>
            </a>

            {/* Navigation Links (Hidden on Mobile) */}
            <nav className="hidden md:flex space-x-6">
              <a
                href="/"
                className={`text-[#111] hover:text-red flex ${inter.className} font-[500] text-[16px]`}
              >
                Tools{" "}
                <ChevronDown
                  className="scale-75 relative top-[2px]"
                  color="#E13943"
                />
              </a>
              <a
                href="/pricing"
                className={`text-[#111] hover:text-red ${inter.className} font-[500] text-[16px]`}
              >
                Pricing
              </a>
              <a
                href="/FAQ"
                className={`text-[#111] hover:text-red ${inter.className} font-[500] text-[16px]`}
              >
                FAQ
              </a>
              <a
                href="https://creatorset.com"
                className={`text-[#111] hover:text-red ${inter.className} font-[500] text-[16px]`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop Assets
              </a>
            </nav>
          </div>

          {/* Action Buttons & Mobile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LoginDialog
              open={open}
              setOpen={setOpen}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
            />
            <button
              className={`${inter.className} font-[700] text-[16px] hover:text-red text-black`}
              onClick={() => setOpen(true)}
            >
              Sign in
            </button>

            {/* Light Gray Divider */}
            <div className="border-l border-[#111] opacity-20 h-6"></div>

            <TryForFreeButton className="hidden lg:block px-5 h-[48px]" />
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)}>
              <img
                src="/menu.png"
                alt="Menu Toggle"
                className={`w-[24px] h-[16px] ${menuOpen ? "hidden" : "block"}`}
              />
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden fixed top-0 left-0 h-screen w-4/5 bg-white z-[1000] shadow-2xl rounded-r-3xl overflow-auto transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Logo and Close Button */}
            <div className="flex justify-between items-center">
              <a href="/" className="flex items-center gap-2">
                <img src="/darkLogo.png" alt="Logo" className="h-8" />
              </a>
              <button onClick={() => setMenuOpen(false)} className="p-2">
                <img src="/close.png" alt="Close Menu" className="w-10 h-10" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-6 mt-8 text-lg font-semibold">
              <a href="/" className="text-black hover:text-red-500">
                Home
              </a>
              <a href="/" className="text-black hover:text-red-500">
                Tools
              </a>
              <a href="/pricing" className="text-black hover:text-red-500">
                Pricing
              </a>
              <a href="/FAQ" className="text-black hover:text-red-500">
                FAQ
              </a>
              <a
                href="https://creatorset.com"
                className="text-black hover:text-red-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop Assets
              </a>
            </nav>

            {/* Sign-in & CTA */}
            <div className="mt-auto border-t border-gray-300 pt-6 ">
              <button
                className="w-full text-lg font-bold hover:text-red-500 text-black"
                onClick={() => setOpen(true)}
              >
                Sign in
              </button>
              <TryForFreeButton className="w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
