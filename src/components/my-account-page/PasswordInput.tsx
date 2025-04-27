import React, { useState } from "react";
import {Eye, EyeOff} from "lucide-react";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full bg-neutral-800 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-3 text-gray-400 hover:text-white"
      >
        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
      </button>
    </div>
  );
};

export default PasswordInput;
