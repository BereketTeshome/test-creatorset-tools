import React from "react";
import NewProjectCard from "./NewProjectCard";
import localFont from "@next/font/local";

const handlee = localFont({
  src: [
    {
      // path: "../../../public/fonts/Handlee-Regular.ttf",

      path: "../../../public/fonts/Handlee-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-handlee",
});
const NewProjectSection = () => {
  const newProjects = [
    {
      title: "Caption Generator",
      description: (
        <p>
          Create{" "}
          <span className={`font-handlee ${handlee.className}`}>
            Viral Short
          </span>{" "}
          in <span className="text-red">less than 30 sec</span>
        </p>
      ),
      buttonText: "+ Start a new project",
      image: "https://via.placeholder.com/100x150",
      link: "/captions",
    },
    {
      title: "Profanity Muter",
      description: (
        <p>
          Automatically{" "}
          <span className={`font-handlee ${handlee.className}`}>
            mute curse
          </span>{" "}
          in <span className="text-red">your videos</span>
        </p>
      ),
      buttonText: "+ Start a new project",
      image: "https://via.placeholder.com/100x150",
      link: "/profanity-muter",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">New Project</h2>
      <div className="flex gap-4 lg:flex-row flex-col">
        {newProjects.map((project, index) => (
          <NewProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default NewProjectSection;
