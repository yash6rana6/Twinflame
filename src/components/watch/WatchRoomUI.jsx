"use client";

import { useState, useEffect, useCallback } from "react";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import { MonitorPlay } from "lucide-react"; 

export default function WatchRoomUI(props) {
  const { roomId, isHost, mobileSheet, setMobileSheet, handleSetVideo } = props;
  
  const [isMobile, setIsMobile] = useState(false);
  const [desktopTab, setDesktopTab] = useState("chat");
  const [unread, setUnread] = useState(0);

  // 1. Responsive Check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Sync Logic (Unread Messages)
  useEffect(() => {
    const inc = () => { 
      if (isMobile ? props.mobileSheet !== "chat" : desktopTab !== "chat") {
        setUnread((n) => n + 1); 
      }
    };
    window.addEventListener("twinflame:newmsg", inc);
    return () => window.removeEventListener("twinflame:newmsg", inc);
  }, [isMobile, props.mobileSheet, desktopTab]);

  // Reset unread when opening chat
  useEffect(() => {
    if ((isMobile && props.mobileSheet === "chat") || (!isMobile && desktopTab === "chat")) {
      setUnread(0);
    }
  }, [isMobile, props.mobileSheet, desktopTab]);

  const toggleMobileSheet = useCallback((tab) => {
    props.setMobileSheet((s) => (s === tab ? null : tab));
  }, [props]);

  // Player Placeholder Component
  const PlayerPlaceholder = (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-[#050506]">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-4">
       <MonitorPlay size={28} className="text-pink-500" />
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter">Cinema <span className="text-pink-500">Ready</span></h3>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Waiting for media…</p>
    </div>
  );

  const viewProps = {
    ...props,
    unread,
    desktopTab,
    setDesktopTab,
    toggleMobileSheet,
    PlayerPlaceholder
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] text-white font-sans overflow-hidden">
      {/* Ambient Glow (Always present) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-rose-500/10 blur-[120px] rounded-full" />
      </div>

      {isMobile ? <MobileView {...viewProps} /> : <DesktopView {...viewProps} />}
    </div>
  );
}