// components/BackButtonHandler.tsx
'use client'; // Ensure this is a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonHandlerProps {
  destinationPath?: string;
}

const BackButtonHandler: React.FC<BackButtonHandlerProps> = ({ destinationPath = '/' }) => {
  const router = useRouter();

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      console.log('Back Button Pressed');
      event.preventDefault(); // Prevent default back navigation
      router.push(destinationPath); // Redirect to the provided destination path
    };

    // Ensure the router is ready before adding event listeners

    window.addEventListener('popstate', handleBackButton);
    console.log('Back Button Handler Added');
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', handleBackButton);
      }, 5000)
    };
  }, []);

  return null;
};

export default BackButtonHandler;
