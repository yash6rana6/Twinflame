"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import RoomControls from "./actions/RoomControls";
import UploadPanel from "./actions/UploadPanel";
import Player from "./actions/Player";
import ChatPanel from "./actions/chatPanel";
import "./WatchRoom.css";

// ─── Source detection ─────────────────────────────────────────────────────────
const detectSource = (url) => {
  if (!url) return { type: "unknown" };
  const ytMatch =
    url.match(/[?&]v=([^#&?]+)/) || url.match(/youtu\.be\/([^#&?]+)/);
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };
  const cleanUrl = url.split("?")[0];
  if (/\.(mp4|webm|ogg)$/i.test(cleanUrl)) return { type: "video", url };
  if (/cloudinary\.com.*\/video\/upload\//i.test(url))
    return { type: "video", url };
  return { type: "unknown" };
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WatchRoom() {
  const myIdRef = useRef(crypto.randomUUID());
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const role = searchParams.get("role");
  const isHost = role === "host";

  const playerRef = useRef(null);
  const socketRef = useRef(null);

  const [state, setState] = useState({
    videoUrl: "",
    currentTime: 0,
    isPlaying: false,
  });
  const [playerType, setPlayerType] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [mobileTab, setMobileTab] = useState("chat"); // "chat" | "source"

  // WebSocket connection
  useEffect(() => {
    if (!roomId || !role) return;
    let ws = null;
    let reconnectTimer = null;

    const connect = () => {
      const wsUrl =
        process.env.NODE_ENV === "development"
          ? `ws://localhost:1999/party/${roomId}?role=${role}`
          : `wss://twinflame.yash6rana6.partykit.dev/party/${roomId}?role=${role}`;

      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => console.log("✅ WS connected");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "state-update") {
            const newState = data.state || {};
            setState(newState);

            if (newState?.videoUrl) {
              const detected = detectSource(newState.videoUrl);
              if (detected.type !== "unknown") {
                setPlayerType(detected.type);
                setVideoSrc(
                  detected.type === "youtube" ? detected.id : detected.url,
                );
              } else {
                setPlayerType(null);
                setVideoSrc(null);
              }
            } else {
              setPlayerType(null);
              setVideoSrc(null);
            }

            if (playerRef.current && newState?.videoUrl) {
              const p = playerRef.current;
              const detected = detectSource(newState.videoUrl);

              if (
                detected.type === "youtube" &&
                typeof p.getCurrentTime === "function"
              ) {
                if (
                  Math.abs(p.getCurrentTime() - (newState.currentTime || 0)) >
                  1.5
                )
                  p.seekTo(newState.currentTime || 0, true);
                const ps = p.getPlayerState();
                if (newState.isPlaying && ps !== 1) p.playVideo();
                else if (!newState.isPlaying && ps === 1) p.pauseVideo();
              }

              if (detected.type === "video" && p.currentTime !== undefined) {
                if (Math.abs(p.currentTime - (newState.currentTime || 0)) > 1.5)
                  p.currentTime = newState.currentTime || 0;
                if (newState.isPlaying && p.paused) p.play().catch(() => {});
                else if (!newState.isPlaying && !p.paused) p.pause();
              }
            }
          }
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onerror = (e) => console.error("❌ WS error:", e);
      ws.onclose = () => {
        console.log("⚠️ WS disconnected — reconnecting...");
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
      socketRef.current = null;
    };
  }, [roomId, role]);

  const sendYouTubeState = () => {
    if (!isHost || !playerRef.current || !socketRef.current) return;
    const p = playerRef.current;
    socketRef.current.send(
      JSON.stringify({
        type: "update-state",
        state: {
          videoUrl: state.videoUrl,
          currentTime: p.getCurrentTime(),
          isPlaying: p.getPlayerState() === 1,
        },
      }),
    );
  };

  const sendVideoState = () => {
    if (!isHost || !playerRef.current || !socketRef.current) return;
    const v = playerRef.current;
    socketRef.current.send(
      JSON.stringify({
        type: "update-state",
        state: {
          videoUrl: state.videoUrl,
          currentTime: v.currentTime || 0,
          isPlaying: !v.paused,
        },
      }),
    );
  };

  const handleSetVideo = (url) => {
    if (!isHost || !socketRef.current) return;
    const detected = detectSource(url);
    if (detected.type === "unknown") {
      alert("Please enter a valid YouTube or direct video URL.");
      return;
    }
    const newState = { videoUrl: url, currentTime: 0, isPlaying: false };
    setState((prev) => ({ ...prev, ...newState }));
    setPlayerType(detected.type);
    setVideoSrc(detected.type === "youtube" ? detected.id : detected.url);
    socketRef.current.send(
      JSON.stringify({ type: "update-state", state: newState }),
    );
    setMobileTab("chat");
  };

  if (!session) {
    return (
      <div className="wr-gate">
        <div className="wr-gate-card">
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎭</div>
          <h2 className="wr-gate-title">Sign in to watch</h2>
          <p className="wr-gate-sub">
            You'll need an account to join or host a movie night room.
          </p>
        </div>
      </div>
    );
  }

  const playerEl = videoSrc ? (
    <Player
      playerType={`${playerType}-${videoSrc}`}
      videoSrc={videoSrc}
      isHost={isHost}
      playerRef={playerRef}
      onYouTubeState={sendYouTubeState}
      onVideoState={sendVideoState}
    />
  ) : null;

  return (
    <div className="wr-root">
      <div className="wr-noise" aria-hidden="true" />

      {/* ── DESKTOP LAYOUT (≥ 1024px) ──────────────────── */}
      <div className="wr-desktop-layout">
        <div className="wr-desktop-inner">
          <header className="wr-desktop-header">
            <div>
              <p className="wr-eyebrow">Movie Night</p>
              <h1 className="wr-title">
                Room <em>{roomId}</em>
              </h1>
              <div className="wr-badge">
                <span className="wr-badge-dot" />
                {isHost ? "Hosting" : "Watching as guest"}
              </div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 4 }}>
              <RoomControls roomId={roomId} isHost={isHost} />
            </div>
          </header>

          <div className="wr-desktop-body">
            {/* Left: video */}
            <div>
              {videoSrc ? (
                <div className="wr-player-shell">
                  <div className="wr-aspect">
                    <div className="wr-aspect-inner">{playerEl}</div>
                  </div>
                </div>
              ) : (
                <div className="wr-empty">
                  <div className="wr-empty-icon">🎬</div>
                  <p className="wr-empty-title">Nothing playing yet</p>
                  <p className="wr-empty-sub">
                    {isHost
                      ? "Paste a YouTube link or upload a video to begin."
                      : "The host hasn't started anything yet — sit tight."}
                  </p>
                </div>
              )}
              <div className="wr-meta">
                <span>ROOM {roomId?.toUpperCase()}</span>
                <span className="wr-meta-sep" />
                <span>{isHost ? "HOST" : "GUEST"}</span>
                {videoSrc && (
                  <>
                    <span className="wr-meta-sep" />
                    <span>{playerType?.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: upload + chat */}
            <div className="wr-desktop-right">
              {isHost && (
                <div className="wr-upload-wrap">
                  <p className="wr-upload-label">Source</p>
                  <UploadPanel
                    isHost={isHost}
                    onSetVideo={handleSetVideo}
                    roomId={roomId}
                  />
                </div>
              )}
              <div className="wr-desktop-chat">
                <ChatPanel
                  socketRef={socketRef}
                  isHost={isHost}
                  myConnectionId={myIdRef.current}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (< 1024px) ───────────────────── */}
      <div className="wr-mobile-layout">
        {/* Top bar */}
        <div className="wr-mobile-topbar">
          <div className="wr-mobile-topbar-left">
            <span className="wr-mobile-room-label">Room</span>
            <span className="wr-mobile-room-id">{roomId}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div className="wr-mobile-badge">
              <span className="wr-badge-dot" />
              {isHost ? "Host" : "Guest"}
            </div>
            <RoomControls roomId={roomId} isHost={isHost} />
          </div>
        </div>

        {/* Video: always visible */}
        <div className="wr-mobile-video-section">
          {videoSrc ? (
            <div className="wr-mobile-video-aspect">
              <div className="wr-mobile-video-inner">{playerEl}</div>
            </div>
          ) : (
            <div className="wr-mobile-empty">
              <div className="wr-mobile-empty-icon">🎬</div>
              <p className="wr-mobile-empty-title">Nothing playing yet</p>
              <p className="wr-mobile-empty-sub">
                {isHost
                  ? "Use the Source tab below to add a video."
                  : "The host hasn't started anything yet."}
              </p>
            </div>
          )}
        </div>

        {/* Tab bar (host only) */}
        {isHost && (
          <div className="wr-mobile-tabs">
            <button
              className={`wr-mobile-tab ${mobileTab === "chat" ? "active" : ""}`}
              onClick={() => setMobileTab("chat")}
            >
              💬 Chat
            </button>
            <button
              className={`wr-mobile-tab ${mobileTab === "source" ? "active" : ""}`}
              onClick={() => setMobileTab("source")}
            >
              🎞 Source
            </button>
          </div>
        )}

        {/* Tab content */}
        <div className="wr-mobile-tab-content">
          {(!isHost || mobileTab === "chat") && (
            <div className="wr-mobile-chat-full">
              <ChatPanel socketRef={socketRef} isHost={isHost} fullHeight />
            </div>
          )}
          {isHost && mobileTab === "source" && (
            <div className="wr-mobile-upload-panel">
              <p className="wr-mobile-upload-label">Video Source</p>
              <UploadPanel
                isHost={isHost}
                onSetVideo={handleSetVideo}
                roomId={roomId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
