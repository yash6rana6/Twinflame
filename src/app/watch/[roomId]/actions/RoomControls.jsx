"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, LogOut, Shield, Users, Check, Share2 } from "lucide-react";
import { useTelegram } from "@/hooks/useTelegram";

const BOT_USERNAME = "MytwinflameBot";
const MINI_APP_SHORT_NAME = "watch";

export default function RoomControls({ roomId, isHost }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { tg, isTelegram } = useTelegram();

  // --- LOGIC ---
  const handleCopyInvite = async () => {
    // Telegram ke andar: deep link jo seedha Mini App khole (website nahi)
    if (isTelegram) {
      const deepLink = `https://t.me/${BOT_USERNAME}/${MINI_APP_SHORT_NAME}?startapp=${roomId}`;

      if (tg?.openTelegramLink) {
        // Telegram ka native "share to chat" sheet kholta hai
        const shareText = encodeURIComponent(
          "Bhai, saath mein movie dekhte hain! Join kar:"
        );
        tg.openTelegramLink(
          `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${shareText}`
        );
        return;
      }

      // Fallback: clipboard
      try {
        await navigator.clipboard.writeText(deepLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      return;
    }

    // ── Normal website (browser) — purana behavior unchanged ──
    const link = `${window.location.origin}/watch/${roomId}?role=guest`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my TwinFlame Theater",
          text: `Bhai, saath mein movie dekhte hain! Join kar:`,
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveRoom = () => router.push("/");
  // --- END LOGIC ---

  if (!roomId) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-4 w-full justify-end">
      
      {/* ── STATUS BADGE (Pills style) ── */}
      <div className="hidden xs:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-2xl shadow-inner">
        {isHost ? (
          <Shield size={12} className="text-emerald-400" />
        ) : (
          <Users size={12} className="text-blue-400" />
        )}
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
          {isHost ? "Theater Owner" : "Spectator"}
        </span>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="flex items-center gap-2">
        
        {/* Invite Button: Blue/Glass Style */}
        <button
          onClick={handleCopyInvite}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
            copied 
            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10" 
            : "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40 shadow-blue-500/5"
          }`}
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          <span className="hidden sm:inline">{copied ? "Link Copied" : "Invite Partner"}</span>
          <span className="sm:hidden">{copied ? "Copied" : "Invite"}</span>
        </button>

        {/* Exit Button: Subtle Rose Style */}
        <button
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-500/5"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">End Session</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>

    </div>
  );
}