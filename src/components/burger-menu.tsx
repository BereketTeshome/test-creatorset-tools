"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordian-common";
import * as Accordion from "@radix-ui/react-accordion";
import {getUserInfo} from "@/utils/utils";
import { getMySubscription } from "@/api/payment.api";
import { getUserTokenCredit } from "@/api/user-credit.api";
import { calculateCreditUsagePercentage, calculateDeductedPercentage } from "@/utils/generalFunctions";

const BurgerMenu = ({
  additionalItemsStart = [],
  additionalItemsEnd = [],
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const [isToolsOpen, setIsToolsOpen] = useState(false); // Collapsible "Tools" menu state
  const user = getUserInfo();
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [userAvailablePercentage, setUserAvailablePercentage] = useState(0);
  const [userAvailableToken, setUserAvailableToken] = useState(0);
  const [ userUsagePercentage, setUserUsagePercentage] = useState(0)
  const [userUsageToken, setUserUsageToken] = useState(0)

  useEffect(() => {
      if (typeof window !== "undefined") {
        const currentDate = new Date();
        if (!user.id) {
          return;
        }
  
        const isSubscriptionActiveLocalStorage = localStorage.getItem('isSubscriptionActive');
        if (isSubscriptionActiveLocalStorage === 'true') {
          setIsSubscriptionActive(true);
          setUserAvailablePercentage(localStorage['userAvailablePercentage']);
          setUserAvailableToken(localStorage['userAvailableToken']);
          setUserUsagePercentage(localStorage['userUsagePercentage']);
          setUserUsageToken(localStorage['userUsageToken']);
        } else {
          getMySubscription(user.id).then((response) => {
            if (
              response.data.length > 0 &&
              response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
            ) {
              setIsSubscriptionActive(true);
              localStorage.setItem('isSubscriptionActive', 'true');
              setTimeout(async () => {
                if (localStorage['userAvailableToken']) {
                  setUserAvailablePercentage(localStorage['userAvailablePercentage']);
                  setUserAvailableToken(localStorage['userAvailableToken']);
                } else {
                  const userCredit = await getUserTokenCredit();
                  if (userCredit.status === 200 && userCredit.data.length > 0) {
                    const totalCredit = calculateCreditUsagePercentage(
                      userCredit.data[0].totalCredit,
                      userCredit.data[0].totalDeductedCredit
                    );
                    const totalUsageCredit = calculateDeductedPercentage(
                      userCredit.data[0].totalCredit,
                      userCredit.data[0].totalDeductedCredit
                    );
                  
                    setUserAvailablePercentage(totalCredit);
                    setUserAvailableToken(userCredit.data[0].totalCredit);
                    localStorage.setItem('userAvailableToken', userCredit.data[0].totalCredit);
                    localStorage.setItem('userAvailablePercentage', totalCredit.toLocaleString());
  
                    setUserUsagePercentage(totalUsageCredit)
                    setUserUsageToken(userCredit.data[0].totalDeductedCredit)
                    localStorage.setItem('userUsagePercentage', totalUsageCredit.toLocaleString());
                    localStorage.setItem('userUsageToken', userCredit.data[0].totalDeductedCredit);
                  } else {
                    setUserAvailablePercentage(0);
                    setUserAvailableToken(0);
                  }
                }
              }, 200);
            } else {
              setIsSubscriptionActive(false);
              localStorage.setItem('isSubscriptionActive', 'false');
            }
          });
        }
      }
    }, [user]);

  return (
    <div className="relative w-10">
      {/* Burger Icon */}
      <button
        className={`${className} sticky top-3 right-5 lg:left-5 z-10 flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full text-white focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/menu.svg"
          width={73}
          height={73}
          alt=""
          className="h-6 w-6 z-100"
          draggable={false}
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Sidebar Content */}
        <div className="mt-16">
          {additionalItemsStart}

          <Accordion.Root
            className="w-full rounded-md bg-black2 shadow-[0_2px_10px] shadow-black/5"
            type="single"
            defaultValue="item-1"
            collapsible
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Tools</AccordionTrigger>
              <AccordionContent>
                <div>
                  <a
                    href="/captions"
                    className="block px-3 py-2 rounded hover:bg-gray-600"
                  >
                    Caption Tool
                  </a>
                  <a
                    href="/profanity-muter"
                    className="block px-3 py-2 rounded hover:bg-gray-600"
                  >
                    Profanity Muter
                  </a>
                  {/*<a*/}
                  {/*  href="#tool3"*/}
                  {/*  className="block px-3 py-2 rounded hover:bg-gray-600"*/}
                  {/*>*/}
                  {/*  Logo Maker*/}
                  {/*</a>*/}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion.Root>

          {/* Other Sidebar Items */}
          {user &&
            [
              <a
                key="my-projects"
                href="/my-projects"
                className="block px-5 py-3 bg-gray-800 hover:bg-gray-700"
              >
                My Projects
              </a>,
              <a
                 key="my-account"
                href="/my-account"
                className="block px-5 py-3 bg-gray-800 hover:bg-gray-700"
              >
                My Account
              </a>
            ]
          }
          {isSubscriptionActive && (
              <div className="py-2">
                <div className="py-2">
                  <div className="block px-4 py-2 mr-4 text-gray">
                    Available Tokens
                  </div>
                  <div className="ml-3">
                    <div className="block px-4 py-2 mr-4 text-gray">
                      <p className="text-white font-medium">{userAvailableToken}</p>
                    </div>
                    <div className="w-full bg-red h-2 rounded-full">
                      <div className="bg-gray h-2 rounded-full transition-all ease-in-out duration-500" style={{ width: `${userAvailablePercentage}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <div className="block px-4 py-2 mr-4 text-gray">
                    Tokens Used
                  </div>
                  <div className="ml-3">
                    <div className="block px-4 py-2 mr-4 text-gray">
                      <p className="text-white font-medium">{userUsageToken}</p>
                    </div>
                    <div className="w-full bg-gray h-2 rounded-full">
                      <div className="bg-red h-2 rounded-full transition-all ease-in-out duration-500" style={{ width: `${userUsagePercentage}%` }}></div>
                    </div>
                  </div>
              </div>
          </div>
          )}
        </div>

        {additionalItemsEnd}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default BurgerMenu;
