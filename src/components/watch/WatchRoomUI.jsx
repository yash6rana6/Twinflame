"use client";

import { useState, useEffect } from "react";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";

export default function WatchRoomUI(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px se neeche mobile/tablet layout
    };
    
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Props ko spread karke dono views mein bhej rahe hain
  return isMobile ? <MobileView {...props} /> : <DesktopView {...props} />;
}