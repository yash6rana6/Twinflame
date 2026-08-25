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
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        webApp.expand();
        setTg(webApp);
        setReady(true);
        clearInterval(check);
      } else if (tries > 20) {
        // Not inside Telegram — normal browser tab. That's fine, just
        // means Telegram-specific features stay off.
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