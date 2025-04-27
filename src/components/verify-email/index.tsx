"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
const VerifyEmail = ({ searchParams }: { searchParams: { token: string } }) => {
  const router = useRouter();
  const verifyUser = () => {
    axios
      .post("/api/users/verifyemail", {
        token: searchParams?.token,
      })
      .then((res) => {
        if (res.status === 200) {
          router.push(`/my-projects`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (searchParams?.token) verifyUser();
  }, []);
  return (
    <div className="flex flex-col text-red gap-4 font-neue">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{
          rotate: 360,
          transition: { duration: 1, repeat: Infinity, ease: "linear" },
        }}
        className="w-max mx-auto"
      >
        <Image
          src="/loading.png"
          alt=""
          draggable={false}
          width={200}
          height={200}
          className="h-16 w-16"
        />
      </motion.div>
      <p>Verifying your email</p>
    </div>
  );
};

export default VerifyEmail;
