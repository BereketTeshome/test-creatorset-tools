"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Check, Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import {
  AWS_CLIENT_ID,
  AWS_HOSTED_UI,
  AWS_REDIRECT_URL,
  REACT_APP_BACKEND_URL,
  setTokenInCookies,
  setTokenInLocalstorage,
  setUserInLocalstorage,
  getSelectedPlan,
} from "@/utils/utils";
import axiosCsBackend from "@/api/axiosCsBackend";
import CodeInput from "@/components/verify-email/code-input";

const LoginDialog = ({
  open,
  setOpen,
  video,
  isLogin,
  setIsLogin,
  onLoginSuccess,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  video?: string;
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  onLoginSuccess?: (res: any) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordCode, setResetPasswordCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setIsResetPassword(false);
    setIsForgotPassword(false);
    setIsEmailSent(false);
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (isForgotPassword) {
      console.log("Forgot password for:", email);
      // Simulate sending reset link
      doSendForgotPasswordLink();
    } else if (isResetPassword) {
      console.log("Reset password:", { newPassword, resetPasswordCode });
      doResetPassword();
    } else {
      if (!isLogin) {
        axios
          .post(`${REACT_APP_BACKEND_URL}/auth/register`, {
            data: {
              user: {
                email,
                password,
                name: name.trim(),
              },
            },
          })
          .then((res) => {
            console.log(res);
            setIsEmailSent(true);
          })
          .catch((err) => {
            console.log("Error signing up:", err);
            toast({
              description: err.response.data.error.message,
              variant: "destructive",
              title: "Error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }

      doLogin();
    }
  };

  const doLogin = () => {
    axiosCsBackend
      .post(`${REACT_APP_BACKEND_URL}/auth/login`, {
        data: { email, password },
      })
      .then((res) => {
        console.log("loginRes", res);
        setTokenInCookies(res.data.data.tokens);
        setTokenInLocalstorage(res.data.data.tokens);
        setUserInLocalstorage(res.data.data.user);
        setOpen(false);
        toast({
          description: "Login successful",
          variant: "destructive",
          title: "Success",
        });

        setIsLogin(true);
        if (onLoginSuccess) {
          onLoginSuccess(res);
          return;
        } else {
          // router.push("/my-projects");
          window.location.href = `${window.location.origin}/my-projects`;
        }
      })
      .catch((err) => {
        console.log("error login: ", err);

        toast({
          description: err.response.data.error.message,
          variant: "destructive",
          title: "Error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doResetPassword = () => {
    axiosCsBackend
      .post(`${REACT_APP_BACKEND_URL}/auth/forgotPasswordConfirmPassword`, {
        data: { email, code: resetPasswordCode, newPassword },
      })
      .then((res) => {
        toast({
          description:
            "Password reset successfully. Please login again with new password",
          variant: "destructive",
          title: "Success",
        });
        setIsResetPassword(false);
        setIsLogin(true);
      })
      .catch((err) => {
        toast({
          description: err.response.data.error.message,
          variant: "destructive",
          title: "Error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doSendForgotPasswordLink = () => {
    axiosCsBackend
      .post(`${REACT_APP_BACKEND_URL}/auth/forgotPasswordRequestCode`, {
        data: { email },
      })
      .then((res) => {
        setIsForgotPassword(false);
        setIsResetPassword(true);
      })
      .catch((err) => {
        toast({
          description: err.response.data.error.message,
          variant: "destructive",
          title: "Error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setIsResetPassword(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-gray">
          Email
        </Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          className="bg-gray3 border-none text-gray placeholder:text-gray"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-full !mt-6 bg-red hover:bg-red/80 text-white"
      >
        Send Reset Link
      </Button>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="resetCode" className="text-gray">
          Reset Code
        </Label>
        <div className="relative">
          <Input
            id="resetCode"
            placeholder="Enter 6 Digit Code"
            type={showPassword ? "text" : "password"}
            className="bg-gray3 border-none text-gray placeholder:text-gray pr-10"
            value={resetPasswordCode}
            onChange={(e) => setResetPasswordCode(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="newPassword" className="text-gray">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            className="bg-gray3 border-none text-gray placeholder:text-gray pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full !mt-6 bg-red hover:bg-red/80 text-white"
      >
        Save
      </Button>
    </form>
  );

  const renderLoginRegisterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!isLogin && (
        <div className="space-y-1">
          <Label htmlFor="name" className="text-gray">
            Name
          </Label>
          <Input
            id="Name"
            placeholder="Name"
            className="bg-gray3 border-none text-gray placeholder:text-gray"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="email" className="text-gray">
          Email
        </Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          className="bg-gray3 border-none text-gray placeholder:text-gray"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="text-gray">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="bg-gray3 border-none text-gray placeholder:text-gray pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {isLogin && (
        <a
          href="#"
          className="text-red block text-sm"
          onClick={() => setIsForgotPassword(true)}
        >
          Forgot Password?
        </a>
      )}

      <Button
        type="submit"
        className="w-full !mt-6 disabled:bg-red/50 disabled:cursor-not-allowed bg-red hover:bg-red/80 text-white"
        disabled={loading}
      >
        {isLogin ? "Login" : "Create Account"}
      </Button>
    </form>
  );
  const renderEmailVerification = () => (
    <div className="flex flex-col justify-center h-full items-center text-center">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Great, now verify your email
      </h2>
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-black2 rounded-full flex items-center justify-center">
          <Check className="text-green-500 w-12 h-12" />
        </div>
      </div>
      <p className="text-left text-gray mb-4">
        Check your inbox at <span className="text-white">{email}</span> and
        enter the code inside to complete your registration. The code link will
        expire shortly, so verify soon!
      </p>

      <p>
        <CodeInput onComplete={(code) => submitVerification(code)} />
      </p>
    </div>
  );

  const triggerGoogleLogin = () => {
    const awsUrl = `${AWS_HOSTED_UI}/oauth2/authorize?client_id=${AWS_CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${AWS_REDIRECT_URL}`;
    window.location.href = awsUrl;
  };

  const submitVerification = (code) => {
    axiosCsBackend
      .post(`${REACT_APP_BACKEND_URL}/auth/confirmEmail`, {
        data: { email, code },
      })
      .then((res) => {
        toast({
          description: "Email verified successfully",
          variant: "destructive",
          title: "Success",
        });
        doLogin();
      })
      .catch((err) => {
        console.log("err", err);
        toast({
          description: err.response.data.error.message,
          variant: "destructive",
          title: "Error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`p-0 outline-none !rounded-2xl border-none ${
          video ? "max-w-[790px]" : "max-w-395px"
        } duration-200`}
      >
        <div
          className={`w-full flex rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
            isLogin ? "h-[514px]" : "h-[654px]"
          }`}
        >
          <div
            className={`${
              video ? "w-1/2" : "w-full"
            } bg-black2 h-full p-8 flex flex-col`}
          >
            <div className="flex items-center gap-2.5 text-2xl text-white mb-6">
              <Image
                src="/logo.png"
                alt=""
                width={200}
                height={200}
                className="h-8 w-8"
              />
              <p>
                {isForgotPassword
                  ? "Reset Password"
                  : isResetPassword
                  ? "Reset Password"
                  : isLogin
                  ? "Login"
                  : "Create An Account"}
              </p>
            </div>
            {isEmailSent ? (
              renderEmailVerification()
            ) : (
              <>
                {" "}
                {!isForgotPassword && !isResetPassword && (
                  <>
                    <Button
                      onClick={triggerGoogleLogin}
                      className="bg-white w-full flex items-center text-base border-gray4 border mb-6 gap-2 hover:bg-white/80"
                    >
                      <Image
                        src="/google.svg"
                        alt=""
                        width={200}
                        height={200}
                        className="h-[18px] w-[18px]"
                      />
                      <p className="text-black">Google</p>
                    </Button>

                    <div className="flex w-full text-gray items-center gap-4 mb-6">
                      <Separator className="flex-1 bg-gray" />
                      <span className="text-gray">
                        or {isLogin ? "login" : "sign up"} with
                      </span>
                      <Separator className="flex-1 bg-gray" />
                    </div>
                  </>
                )}
                {isForgotPassword && renderForgotPasswordForm()}
                {isResetPassword && renderResetPasswordForm()}
                {!isForgotPassword &&
                  !isResetPassword &&
                  renderLoginRegisterForm()}
                {isResetPassword && (
                  <p className="text-center text-gray mt-4">
                    We emailed you a link to reset your password!
                  </p>
                )}
                {!isForgotPassword && !isResetPassword && (
                  <p className="text-center text-gray mt-4">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                    <button onClick={toggleForm} className="text-red">
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                )}
                {!isLogin && !isForgotPassword && !isResetPassword && (
                  <p className="text-center text-gray mt-auto text-xs">
                    By continuing, you agree to our
                    <br />
                    <a href="#" className="text-red">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red">
                      Terms of Service
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
          {video && (
            <video
              crossOrigin={"anonymous"}
              className="h-full bg-red object-cover w-1/2 "
              src={video}
              controls={false}
              autoPlay
              muted
            ></video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
