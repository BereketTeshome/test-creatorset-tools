import React from "react";

import { neueSemiBold } from "@/fonts/neue";
import Link from "next/link";

const NewProjectCard = ({ title, description, buttonText, image, link }) => {
  return (
    <div className=" bg-black rounded-lg p-6 flex items-center space-x-4 w-full lg:w-[500px]">
      <div>
        <h3 className={`text-xl font-bold mb-2 ${neueSemiBold.className}`}>
          {title}
        </h3>

        <div className="text-sm text-gray-400 mb-4">{description}</div>

        <Link href={link}>
          <button className="bg-red text-sm font-medium py-2 px-4 rounded-lg hover:bg-red-600">
            {buttonText}
          </button>
        </Link>
      </div>
      {/*<img src={image} alt={title} className="rounded-lg" />*/}
    </div>
  );
};

export default NewProjectCard;
