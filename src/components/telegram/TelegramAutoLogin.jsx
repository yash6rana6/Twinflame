"use client";

import { useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTelegram } from "@/hooks/useTelegram";

// Drop this once near the top of the app (e.g. inside RootLayout, or on
// the specific pages users land on when opening from Telegram). It's a
// no-op outside Telegram — isTelegram stays false in a normal browser tab.
export default function TelegramAutoLogin() {
  const { ready, isTelegram, initData } = useTelegram();
  const { status } = useSession();

  // Plain ref, not state — this is just a "don't fire twice" guard, not
  // something the UI needs to react to, so it shouldn't trigger a render.
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!ready || !isTelegram || !initData) return;
    if (status === "authenticated") return; // already signed in
    if (attemptedRef.current) return;

    attemptedRef.current = true;

    signIn("telegram", { initData, redirect: false }).then((res) => {
      if (res?.error) {
        console.error("Telegram sign-in failed:", res.error);
      }
    });
  }, [ready, isTelegram, initData, status]);

  return null; // renders nothing — purely a side-effect component
}