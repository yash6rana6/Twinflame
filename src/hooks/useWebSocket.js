import { useCallback, useEffect, useRef, useState } from "react";
import { detectSource } from "../helpers/detectSource";

export function useWatchSocket(roomId, role, playerRef) {
  const socketRef = useRef(null);
  const isCleaningUp = useRef(false); // ← tracks intentional close

  const [state, setState] = useState({
    videoUrl: "",
    currentTime: 0,
    isPlaying: false,
  });
  const [playerType, setPlayerType] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (!roomId || !role) return;

    isCleaningUp.current = false;
    let reconnectTimer = null;

    const connect = () => {
      const wsUrl =
        process.env.NODE_ENV === "development"
          ? `ws://localhost:1999/party/${roomId}?role=${role}`
          : `wss://twinflame.yash6rana6.partykit.dev/party/${roomId}?role=${role}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type !== "state-update") return;

        const newState = data.state ?? {};
        setState(newState);

        if (!newState.videoUrl) return;

        // Single detectSource call per message
        const detected = detectSource(newState.videoUrl);
        const targetTime = newState.currentTime ?? 0;

        setPlayerType(detected.type !== "unknown" ? detected.type : null);
        setVideoSrc(
          detected.type === "youtube"
            ? detected.id
            : detected.type === "video"
            ? detected.url
            : null
        );

        // Sync player
        const p = playerRef.current;
        if (!p) return;

        if (detected.type === "youtube" && p.getCurrentTime) {
          if (Math.abs(p.getCurrentTime() - targetTime) > 1.5) {
            p.seekTo(targetTime, true);
          }
          newState.isPlaying ? p.playVideo() : p.pauseVideo();
        } else if (detected.type === "video") {
          if (Math.abs(p.currentTime - targetTime) > 1.5) {
            p.currentTime = targetTime;
          }
          newState.isPlaying ? p.play().catch(() => {}) : p.pause();
        }
      };

      ws.onerror = (err) => {
        console.warn("[useWatchSocket] WebSocket error", err);
      };

      ws.onclose = () => {
        // Don't reconnect if we're intentionally cleaning up
        if (!isCleaningUp.current) {
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      isCleaningUp.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, [roomId, role]); // playerRef intentionally omitted — it's a stable ref

  const updateRemoteState = useCallback((newState) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "update-state", state: newState })
      );
    }
  }, []); // stable — only reads the ref at call time

  return {
    state,
    setState,
    playerType,
    setPlayerType,
    videoSrc,
    setVideoSrc,
    updateRemoteState,
  };
}