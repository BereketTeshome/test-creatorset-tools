"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoginDialog from "./login-dialog";
import { logout } from "@/utils/utils";
import { useScreenDetector } from "@/components/ui/use-screen-detector";
import { Button } from "@/components/ui/button";
import BurgerMenu from "@/components/burger-menu";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import * as HoverCard from "@radix-ui/react-popover";
import { JwtPayload } from "jsonwebtoken";
import { getMySubscription } from "@/api/payment.api";
import { getUserTokenCredit } from "@/api/user-credit.api";
import { calculateCreditUsagePercentage, calculateDeductedPercentage } from "@/utils/generalFunctions";

const Navbar = ({
  userId,
  video,
  user,
}: {
  userId?: string | (() => string);
  video?: string;
  user?: string | JwtPayload;
}) => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const isLoggedIn = !!userId;
  const router = useRouter();
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [userAvailablePercentage, setUserAvailablePercentage] = useState(0);
  const [userAvailableToken, setUserAvailableToken] = useState(0);
  const [ userUsagePercentage, setUserUsagePercentage] = useState(0)
  const [userUsageToken, setUserUsageToken] = useState(0)


  const { isMobile, isTablet, isDesktop } = useScreenDetector();
  const sessionHandler = () => {
    if (isLoggedIn) {
      logout();
      router.push("/");
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    const currentDate = new Date(); // Get the current date and time

    if (!userId) {
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
        getMySubscription(userId).then((response) => {
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
  }, []);

  const mobileLoginButtons = [
    <div key="login-signup" className="bg-black flex-col p-4">
      <Button onClick={() => {
        sessionHandler();
        setIsLogin(true)
      }}
              className="text-base bg-black2 font-bold flex w-full items-center px-8 border-none gap-2 hover:bg-white/80 mb-2">
        Log in
      </Button>
      <Button
        onClick={() => {
          sessionHandler();
          setIsLogin(false);
        }}
        className="text-base w-full bg-red font-bold flex items-center px-8 border-none gap-2 hover:bg-white/80"
      >
        Sign up
      </Button>
    </div>,
  ];

  const logoutButton = [
    <button key="logout-button" onClick={sessionHandler} className="lg:text-lg text-lg text-white px-5 py-3">
      Logout
    </button>,
  ];

  return (
    <div
      className={`${
        isDesktop ? "flex" : "flex"
      } justify-between bg-black text-white font-neue h-[73px] items-center px-6`}
    >
      {isDesktop && <BurgerMenu />}
      <div className={`${isDesktop ? "w-1/3 " : ""} flex items-center`}>
        <Link href="/" className="flex items-center gap-[11px] ml-1.5">
          <Image
            src="/logo.png"
            width={73}
            height={73}
            alt=""
            className="h-8 w-8"
            draggable={false}
          />
          <div>
            {!isDesktop && (
              <div
                className={`${
                  isDesktop ? "w-1/3 justify-center" : "text-[10px]"
                }  flex items-center gap-3`}
              >
                Optimized for{" "}
                <div className="flex gap-1 items-center">
                  <Image
                    src="/yt-shorts.svg"
                    width={73}
                    height={73}
                    alt=""
                    className={isDesktop ? `h-6 w-6` : `h-3 w-3`}
                    draggable={false}
                  />
                  <Image
                    src="/yt-shorts-text.svg"
                    width={73}
                    height={73}
                    alt=""
                    className={`h-[${isDesktop ? "22" : "11"}px] w-[${
                      isDesktop ? 115 : 58
                    }px]`}
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
      {isDesktop && (
        <div
          className={`${
            isDesktop ? "w-1/3 justify-center" : "text-xs ml-12"
          }  flex items-center gap-3`}
        >
          Optimized for{" "}
          <div className="flex gap-1 items-center">
            <Image
              src="/yt-shorts.svg"
              width={73}
              height={73}
              alt=""
              className={isDesktop ? `h-6 w-6` : `h-3 w-3`}
              draggable={false}
            />
            <Image
              src="/yt-shorts-text.svg"
              width={73}
              height={73}
              alt=""
              className={`h-[${isDesktop ? "22" : "11"}px] w-[${
                isDesktop ? 115 : 58
              }px]`}
              draggable={false}
            />
          </div>
        </div>
      )}
      <div
        className={`${
          isDesktop ? "w-1/3" : ""
        } text-left lg:text-right flex items-center lg:justify-end`}
      >
        <LoginDialog
          open={open}
          setOpen={setOpen}
          video={video}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
        {isLoggedIn ? (
          <div>
            <div className="flex items-center justify-end space-x-2">
              <HoverCard.Root>
                <HoverCard.Trigger asChild>
                  <div className="flex cursor-pointer">
                    <div className="w-8 h-8 flex items-center z-10 justify-center rounded-md bg-red text-white text-lg font-medium">
                      {(user as JwtPayload).name[0]}
                    </div>

                    <button className="w-15 h-8 flex -ml-5 pl-5 items-center justify-center rounded-lg bg-gray3 text-white">
                      <ChevronDown />
                    </button>
                  </div>
                </HoverCard.Trigger>
                <HoverCard.Portal>
                  <HoverCard.Content
                    className="w-[300px] rounded-md bg-black2 border-black border-2 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                    sideOffset={5}
                  >
                    <div className="relative inline-block text-left">
                      <div className="flex items-center p-4 border-b border-gray-700">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red text-white font-medium">
                          {(user as JwtPayload).name[0]}
                        </div>
                        <div className="ml-3">
                          <div className="flex justify-between">
                            <p className="text-white font-medium">
                              {(user as JwtPayload).name}{" "}
                            </p>
                            {isSubscriptionActive ? (
                              <a
                                href="/my-account"
                                className="text-gray2 italic"
                              >
                                Pro Plan
                              </a>
                            ) : (
                              <span className="text-gray2 italic">
                                Free Plan
                              </span>
                            )}
                          </div>
                          <p className="text-gray4 text-sm">
                            {(user as JwtPayload).email}
                          </p>
                        </div>
                      </div>

                      <div className="py-2">
                        <a
                          href="/my-projects"
                          className="cursor-pointer block px-4 py-2 mr-4 text-gray hover:bg-gray3"
                        >
                          My Projects
                        </a>
                        <a
                          href="/my-account"
                          className="cursor-pointer block px-4 py-2 mr-4 text-gray hover:bg-gray3"
                        >
                          My Account
                        </a>
                      </div>
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
                      <div className="border-t border-gray-700">
                        {logoutButton}
                      </div>
                    </div>
                    <HoverCard.Arrow className="fill-black" />
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 float-right">
            <Button
              onClick={() => {
                sessionHandler();
                setIsLogin(true);
              }}
              className="text-base bg-black2 font-bold flex items-center px-8 border-none gap-2 hover:bg-white/80"
            >
              Log in
            </Button>
            <Button
              onClick={() => {
                sessionHandler();
                setIsLogin(false);
              }}
              className="text-base bg-red font-bold flex items-center px-8 border-none gap-2 hover:bg-white/80"
            >
              Sign up
            </Button>
          </div>
        )}

        {!isDesktop &&
          (isLoggedIn ? (
            <BurgerMenu additionalItemsEnd={logoutButton} />
          ) : (
            <BurgerMenu additionalItemsStart={mobileLoginButtons} />
          ))}
      </div>
    </div>
  );
};

export default Navbar;