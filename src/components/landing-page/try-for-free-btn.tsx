"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import clsx from "clsx";

type Props = {
  className?: string;
  bgColor?: string;
  text?: string;
  link?: string;
};

export function TryForFreeButton({
  className,
  text = "Try for free ($0)",
  link = "/captions",
}: Props) {
  const router = useRouter();
  return (
    <button
      className={clsx(
        "py-2 bg-[#E13943] hover:bg-red text-white rounded-[6px] hover:bg-red-600  font-[700]",
        inter.className,
        className?.includes("px-") ? className : `px-2 ${className}`
      )}
      onClick={() => router.push(link)}
    >
      {text}
    </button>
  );
}
