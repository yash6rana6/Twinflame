import { useCallback, useEffect, useRef, useState } from "react";
import { detectSource } from "../helpers/detectSource";

export function useWatchSocket(roomId, role, playerRef) {
  const socketRef = useRef(null);
  const isCleaningUp = useRef(false);
  const currentUrlRef = useRef("");
  const syncDebounceRef = useRef(null);
  const reconnectTimer = useRef(null);

  // Store latest server state so we can apply it AFTER player mounts
  const pendingStateRef = useRef(null);

  const [state, setState] = useState({
    videoUrl: "",
    currentTime: 0,
    isPlaying: false,
  });
  const [playerType, setPlayerType] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ── Apply state to player ──────────────────────────────────────────────────
  // Called both from onmessage AND after player mounts (via onPlayerReady)
  const applyStateToPlayer = useCallback((newState) => {
    const p = playerRef.current;
    if (!p || !newState?.videoUrl) return;

    const detected = detectSource(newState.videoUrl);
    const targetTime = newState.currentTime ?? 0;

    if (detected.type === "youtube" && p.getCurrentTime) {
      if (Math.abs(p.getCurrentTime() - targetTime) > 1.5) {
        p.seekTo(targetTime, true);
      }
      newState.isPlaying ? p.playVideo() : p.pauseVideo();
    } else if (detected.type === "video") {
      if (Math.abs(p.currentTime - targetTime) > 1.5) {
        p.currentTime = targetTime;
      }
      if (newState.isPlaying) {
        p.play().catch(() => {});
      } else {
        p.pause();
      }
    }
  }, [playerRef]);

  // ── Called by Player component when it's fully mounted ────────────────────
  // Guest: signals server + applies pending state
  // Host: nothing to sync from server
  const onPlayerReady = useCallback(() => {
    setIsPlayerReady(true);

    if (role === "guest") {
      // Tell server we're ready — server will re-send current state
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "i-am-ready" }));
      }

      // Also apply whatever state we already have (in case message arrived before player mounted)
      if (pendingStateRef.current) {
        applyStateToPlayer(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }
  }, [role, applyStateToPlayer]);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !role) return;

    isCleaningUp.current = false;

    const connect = () => {
      const wsUrl =
        process.env.NODE_ENV === "development"
          ? `ws://localhost:1999/party/${roomId}?role=${role}`
          : `wss://twinflame.yash6rana6.partykit.dev/party/${roomId}?role=${role}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("[ws] Connected as", role);
      };

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        // ── host-changed: pause immediately ──
        if (data.type === "host-changed") {
          const incoming = data.state;
          if (!incoming) return;
          setState(incoming);
          stateRef.current = incoming;
          const p = playerRef.current;
          if (!p) return;
          if (p.pauseVideo) p.pauseVideo();
          else if (typeof p.pause === "function") p.pause();
          return;
        }

        // ── promoted-to-host ──
        if (data.type === "promoted-to-host") {
          const incoming = data.state;
          if (!incoming) return;
          setState(incoming);
          stateRef.current = incoming;
          const p = playerRef.current;
          if (!p) return;
          if (p.pauseVideo) p.pauseVideo();
          else if (typeof p.pause === "function") p.pause();
          return;
        }

        // ── state-update (main sync) ──
        if (data.type !== "state-update") return;

        const newState = data.state ?? {};
        setState(newState);
        stateRef.current = newState;

        // Always store as pending — used if player isn't ready yet
        pendingStateRef.current = newState;

        if (!newState.videoUrl) {
          currentUrlRef.current = "";
          setPlayerType(null);
          setVideoSrc(null);
          return;
        }

        // Only re-detect source if URL changed (prevents reload loop)
        if (newState.videoUrl !== currentUrlRef.current) {
          currentUrlRef.current = newState.videoUrl;

          const detected = detectSource(newState.videoUrl);
          const type = detected.type !== "unknown" ? detected.type : null;
          const src =
            detected.type === "youtube"
              ? detected.id
              : detected.type === "video" || detected.type === "mega"
              ? detected.url
              : null;

          setPlayerType(type);
          setVideoSrc(src);
          // Player will mount fresh — onPlayerReady will handle sync
          // So DON'T try to sync player here when URL changed
          return;
        }

        // Same URL, just a play/pause/seek update
        // Only apply immediately if player is already ready
        if (role === "guest" && playerRef.current) {
          applyStateToPlayer(newState);
        }
      };

      ws.onerror = (err) => {
        console.warn("[ws] Error", err);
      };

      ws.onclose = () => {
        if (!isCleaningUp.current) {
          console.log("[ws] Disconnected — reconnecting in 2s");
          reconnectTimer.current = setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      isCleaningUp.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
      socketRef.current?.close();
    };
  }, [roomId, role, applyStateToPlayer]);

  // ── Host: debounced sync ───────────────────────────────────────────────────
  const syncState = useCallback(() => {
    if (role !== "host" || !playerRef.current) return;

    clearTimeout(syncDebounceRef.current);
    syncDebounceRef.current = setTimeout(() => {
      const p = playerRef.current;
      if (!p) return;

      const currentTime = p.getCurrentTime ? p.getCurrentTime() : p.currentTime;
      const isPlaying = p.getPlayerState
        ? p.getPlayerState() === 1
        : !p.paused;

      updateRemoteState({
        ...stateRef.current,
        currentTime,
        isPlaying,
      });
    }, 200);
  }, [role]);

  const updateRemoteState = useCallback((newState) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "update-state", state: newState })
      );
    }
  }, []);

  const setVideo = useCallback(
    (url, source = null) => {
      if (role !== "host") return;
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "set-video", url, source, startTime: 0 })
        );
      }
    },
    [role]
  );

  const clearVideo = useCallback(() => {
    if (role !== "host") return;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "clear-video" }));
    }
  }, [role]);

  return {
    state,
    setState,
    playerType,
    setPlayerType,
    videoSrc,
    setVideoSrc,
    isPlayerReady,
    onPlayerReady,  // ← pass this to Player component
    updateRemoteState,
    syncState,
    setVideo,
    clearVideo,
  };
}