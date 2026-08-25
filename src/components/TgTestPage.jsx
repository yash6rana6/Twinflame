"use client";

import { useTelegram } from "@/hooks/useTelegram";

export default function TgTestPage() {
  const { ready, isTelegram, user, themeParams, initData } = useTelegram();

  if (!ready) {
    return <div style={{ padding: 20, color: "#fff" }}>Checking Telegram SDK…</div>;
  }

  return (
    <div style={{ padding: 20, fontFamily: "monospace", color: "#fff", background: "#000", minHeight: "100vh" }}>
      <h2 style={{ color: isTelegram ? "#4ade80" : "#f87171" }}>
        {isTelegram ? "✅ Telegram SDK connected" : "❌ Not inside Telegram (normal browser)"}
      </h2>

      {isTelegram && (
        <>
          <p>User: {user ? `${user.first_name} (@${user.username || "no-username"})` : "no user data"}</p>
          <p>Theme bg color: {themeParams?.bg_color || "n/a"}</p>
          <p>initData length: {initData ? initData.length : 0} chars</p>
        </>
      )}
    </div>
  );
}