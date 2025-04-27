'use client'; // Ensure this is a Client Component
import { useEffect, useState } from "react";

export const useScreenDetector = () => {
  const [width, setWidth] = useState(20);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleWindowSizeChange()
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024;

  // const isMobile = true;
  // const isTablet = true;
  // const isDesktop = true;

  return { isMobile, isTablet, isDesktop };
};
