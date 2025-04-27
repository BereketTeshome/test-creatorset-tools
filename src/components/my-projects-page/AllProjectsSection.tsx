"use client"

import React, {useEffect, useState} from "react";
import ProjectCard from "./ProjectCard";
import {ProjectType} from "@/components/typings/projects";
import {retrieveMyProjects} from "@/api/my-projects.api";
import {getUserInfo} from "@/utils/utils";
import {getMySubscription} from "@/api/payment.api";
import {SearchIcon} from "lucide-react";

// const projectsHardcoded = [
//   {
//     projectTitle: "Project 1",
//     date: "12 March 2021",
//     duration: "01:24",
//     expires: "2 Days",
//     projectType: "caption_generator" as ProjectType,
//     image: "/placeholder/project-img.png",
//   },
//   {
//     projectTitle: "Project 2",
//     date: "12 March 2021",
//     duration: "01:24",
//     projectType: "profanity_muter" as ProjectType,
//     expires: "2 Days",
//     image: "/placeholder/project-img.png",
//   },
//   // Add more projects as needed
// ];

const AllProjectsSection = () => {

  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false)
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)

  useEffect(() => {

    const user = getUserInfo();
    if (!user) {
      return
    }

    const currentDate = new Date(); // Get the current date and time

    getMySubscription(user.id).then((response) => {
      console.log('getMySubscription', response)
      if (response.data.length > 0 && response.data.some(sub => new Date(sub.nextBillingDate) > currentDate)) {
        setIsSubscriptionActive(true);
      }
    })
  }, []);

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])

  const refreshMyProjects = async () => {
      const response = await retrieveMyProjects();
      setProjects(response.data.data);
      setFilteredProjects(response.data.data);
      setIsProjectsLoading(false);
  }

  useEffect(() => {
    refreshMyProjects();
  }, []);

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredProjects = projects.filter(project => project.projectTitle.toLowerCase().includes(searchValue));
    setFilteredProjects(filteredProjects);
  }


  return (
    <div className="mt-12">
      <div className="flex w-full justify-between">
        <h2 className="text-xl font-semibold mb-4">{isProjectsLoading ? 'Loading Projects...':`All Projects (${projects.length})`}</h2>
        <div className="relative w-full max-w-xs ">
          <div className="absolute inset-y-0 left-0 bottom-3 flex items-center pl-3 pointer-events-none">
            <SearchIcon size={16} className="text-gray2"/>
          </div>

          <input
            type="text"
            placeholder="search..."
            className="w-full pl-10 pr-4 py-2 text-sm placeholder-gray2 text-gray bg-black2 border-b border-gray2 focus:outline-none focus:border-gray"
            onChange={(e) => handleSearchInputChange(e)}
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 grid-cols-1">
        {filteredProjects.length > 0 ? filteredProjects.map((project, index) => (
          <ProjectCard key={index+project.externalId} {...project} date={project.createdAt} isSubscriptionActive={isSubscriptionActive} onDeleteSuccess={() => {
            setFilteredProjects(filteredProjects.filter((_, i) => i !== index));
            refreshMyProjects()
          }}/>
        )) : <p className="text-gray2">{isProjectsLoading ? 'Fetching your projects...' : `No projects found`}</p>}
      </div>
    </div>
  );
};

export default AllProjectsSection;
