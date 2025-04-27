import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import {CircleCheck, CircleX} from "lucide-react";
import {updatePassword} from "@/api/auth.api";
import {useToast} from "../ui/use-toast";

const validateBulletIconSize = 16

const RequestPasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const { toast } = useToast();


  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8 && password.length <= 20,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValid(validation);

    const errorList = [];
    if (!validation.length) errorList.push("Between 8 and 20 characters.");
    if (!validation.uppercase) errorList.push("1 upper case letter.");
    if (!validation.number) errorList.push("1 or more numbers.");
    if (!validation.specialChar)
      errorList.push("1 or more special characters.");
    setErrors(errorList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrors(["Passwords don't match."]);
      return;
    }

    updatePassword({ oldPassword, newPassword }).then(
      (response) => {
        console.log("password changed", response);
        toast({
          description: "Password updated successfully.",
          variant: "destructive",
          title: "Success",
        })
      },
      (error) => {
        console.log("failed to change password", error);
        toast({
          description: error.response.data.error.message,
          variant: "destructive",
          title: "Error",
        })
      }
    )

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black2 text-white py-8 min-h-screen lg:max-w-[50vw]"
    >
      <h1 className="text-3xl font-bold mb-8">Request a new password</h1>

      {/* Old Password */}
      <div className="mb-6">
        <label className="block text-gray mb-2">Old Password</label>
        <PasswordInput
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      {/* New Password */}
      <div className="mb-6">
        <label className="block text-gray mb-2">Password</label>
        <PasswordInput
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        <ul className="text-sm mt-2 space-y-1">
          <li
            className={`flex gap-1 items-start ${
              passwordValid.length ? "text-green-400" : "text-red"
            }`}
          >
            {passwordValid.length ? <CircleCheck size={validateBulletIconSize} /> : <CircleX size={validateBulletIconSize} />}
             Between 8 and 20 characters.
          </li>
          <li
            className={`flex gap-1 items-start ${
              passwordValid.uppercase ? "text-green-400" : "text-red"
            }`}
          >
            {passwordValid.length ? <CircleCheck size={validateBulletIconSize} /> : <CircleX size={validateBulletIconSize} />}
            1 upper case letter.
          </li>
          <li
            className={`flex gap-1 items-start ${
              passwordValid.number ? "text-green-400" : "text-red"
            }`}
          >
            {passwordValid.length ? <CircleCheck size={validateBulletIconSize} /> : <CircleX size={validateBulletIconSize} />}
            1 or more numbers.
          </li>
          <li
            className={`flex gap-1 items-start ${
              passwordValid.specialChar ? "text-green-400" : "text-red"
            }`}
          >
            {passwordValid.length ? <CircleCheck size={validateBulletIconSize} /> : <CircleX size={validateBulletIconSize} />}
            1 or more special characters.
          </li>
        </ul>
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label className="block text-gray mb-2">Confirm Password</label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {newPassword && newPassword !== confirmPassword && (
          <p className="text-red text-sm mt-1">Passwords don't match.</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          errors.length > 0 ||
          !passwordValid.length ||
          !passwordValid.uppercase ||
          !passwordValid.number ||
          !passwordValid.specialChar ||
          newPassword !== confirmPassword
        }
        className={`w-full py-3 rounded ${
          errors.length > 0 || newPassword !== confirmPassword
            ? "bg-gray text"
            : "bg-red hover:bg-red text-white"
        }`}
      >
        Request Password
      </button>
    </form>
  );
};

export default RequestPasswordForm;
