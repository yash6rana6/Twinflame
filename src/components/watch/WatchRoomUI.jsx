"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import TelegramView from "./TelegramView";
import { useTelegram } from "@/hooks/useTelegram";
import { MonitorPlay } from "lucide-react";

export default function WatchRoomUI(props) {
  const { roomId, isHost, mobileSheet, setMobileSheet, handleSetVideo } = props;
  const { isTelegram } = useTelegram();

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

  // 2. Derive "is chat open" during render (no effect needed for this)
  const isChatOpen = isMobile ? mobileSheet === "chat" : desktopTab === "chat";

  // Reset unread as a render-time adjustment when chat transitions closed -> open.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevChatOpen, setPrevChatOpen] = useState(isChatOpen);
  if (isChatOpen !== prevChatOpen) {
    setPrevChatOpen(isChatOpen);
    if (isChatOpen && !prevChatOpen) {
      setUnread(0);
    }
  }

  // Keep a ref in sync (in an effect, not during render) so the event
  // listener can read the latest open/closed value without resubscribing.
  const isChatOpenRef = useRef(isChatOpen);
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  // 3. Subscribe to the external event system — legitimate effect,
  // setState happens inside a callback, not the effect body itself.
  useEffect(() => {
    const handleNewMessage = () => {
      if (!isChatOpenRef.current) {
        setUnread((prev) => prev + 1);
      }
    };

    window.addEventListener("twinflame:newmsg", handleNewMessage);
    return () => window.removeEventListener("twinflame:newmsg", handleNewMessage);
  }, []); // stable subscription

  const toggleMobileSheet = useCallback((tab) => {
    props.setMobileSheet((s) => (s === tab ? null : tab));
  }, [props]);

  // Player Placeholder Component
  const PlayerPlaceholder = (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-[#050506]">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <MonitorPlay size={28} className="text-pink-500" />
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter">
        Cinema <span className="text-pink-500">Ready</span>
      </h3>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
        Waiting for media…
      </p>
    </div>
  );

  const viewProps = {
    ...props,
    unread,
    desktopTab,
    setDesktopTab,
    toggleMobileSheet,
    PlayerPlaceholder,
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] text-white font-sans overflow-hidden">
      {/* Ambient Glow (Always present) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-rose-500/10 blur-[120px] rounded-full" />
      </div>

      {isTelegram ? (
        <TelegramView {...viewProps} />
      ) : isMobile ? (
        <MobileView {...viewProps} />
      ) : (
        <DesktopView {...viewProps} />
      )}
    </div>
  );
}