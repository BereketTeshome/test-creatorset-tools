import React, {useEffect, useState} from 'react';
import * as Label from '@radix-ui/react-label';

const CodeInput = ({onComplete}) => {
  const [code, setCode] = useState(Array(6).fill(''));

  useEffect(() => {
    if (code.every((digit) => digit)) {
      onComplete(code.join(''));
    }
  }, [code]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to the next input field
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-900">
      <div className="flex space-x-2">
        <Label.Root className="sr-only" htmlFor="code-0">2FA Code Input</Label.Root>
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-2xl text-center bg-gray-800 border border-gray-700 rounded-md text-gray3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            autoComplete="off"
          />
        ))}
      </div>
    </div>
  );
};

export default CodeInput;
