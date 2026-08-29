"use client";

import { useEffect, useState } from "react";

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Poll briefly because the SDK script loads async (beforeInteractive
    // still races with React hydration on first paint in some cases).
    let tries = 0;
    const check = setInterval(() => {
      tries++;
      const webApp = window.Telegram?.WebApp;

      // IMPORTANT: telegram-web-app.js defines window.Telegram.WebApp on
      // EVERY page load, even in a normal browser tab that isn't inside
      // Telegram at all — it's just an empty/default object there. The
      // reliable signal for "we're actually running inside Telegram" is
      // a non-empty initData string, which Telegram only ever populates
      // when it launches the Mini App itself.
      if (webApp?.initData) {
        webApp.ready();
        webApp.expand();
        setTg(webApp);
        setReady(true);
        clearInterval(check);
      } else if (tries > 20) {
        // Either not inside Telegram, or the SDK object exists but has
        // no real initData (plain browser tab) — treat as normal web.
        setReady(true);
        clearInterval(check);
      }
    }, 100);

    return () => clearInterval(check);
  }, []);

  return {
    tg,
    ready,
    isTelegram: !!tg,
    initData: tg?.initData || null,
    user: tg?.initDataUnsafe?.user || null,
    themeParams: tg?.themeParams || null,
  };
}