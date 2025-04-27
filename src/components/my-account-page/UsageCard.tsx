import React, {useEffect, useState} from "react";
import Image from "next/image";
import { getUserTokenCredit } from "@/api/user-credit.api";
import { calculateDeductedPercentage } from "@/utils/generalFunctions";

const UsageCard = () => {

  const [usagePercentage, setUsagePercentage] = useState(0)
  const [userToken, setUserToken] = useState(0)

  useEffect(() => {
    setTimeout(async () => {
      const userCredit = await getUserTokenCredit()
      if(userCredit.status === 200 && userCredit.data.length > 0) {
        const totalCredit = calculateDeductedPercentage(userCredit.data[0].totalCredit, userCredit.data[0].totalDeductedCredit)
        setUsagePercentage(totalCredit)
        setUserToken(userCredit.data[0].totalDeductedCredit)
        localStorage.setItem('userUsagePercentage', totalCredit.toLocaleString());
        localStorage.setItem('userUsageToken', userCredit.data[0].totalDeductedCredit);
      } else {
        setUsagePercentage(0)
        setUserToken(0)
      }
    }, 200)



  }, []);

  return (
    <div className="bg-neutral-800 p-6 rounded-lg lg:min-w-80 flex flex-col justify-between">
      <div>
        <Image
          src="/pricing/usage.svg"
          width={73}
          height={73}
          alt=""
          className="h-6 w-6 z-100"
          draggable={false}
        />
      </div>
      <div>
        <h3 className="text-gray-400 mb-2">Tokens Used</h3>
        <div className="text-3xl font-bold mb-4">{userToken}</div>
        <div className="w-full bg-gray h-2 rounded-full">
          <div className="bg-red h-2 rounded-full transition-all ease-in-out duration-500" style={{width: `${usagePercentage}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default UsageCard;
