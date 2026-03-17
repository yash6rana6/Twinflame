// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import RoomControls from "./actions/RoomControls";
// import UploadPanel from "./actions/UploadPanel";
// import Player from "./actions/Player";
// import ChatPanel from "./actions/chatPanel";

// // ─── Inline Styles (same as before) ──────────────────────────────────────────
// const injectStyles = () => {
//   if (typeof document === "undefined") return;
//   if (document.getElementById("watchroom-styles")) return;
//   const style = document.createElement("style");
//   style.id = "watchroom-styles";
//   style.textContent = `
//     @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500;600&display=swap');

//     :root {
//       --gold: #c9a84c;
//       --gold-light: #e8c97e;
//       --gold-dim: rgba(201,168,76,0.15);
//       --ink: #0a090d;
//       --surface: #111018;
//       --panel: #16141f;
//       --border: rgba(201,168,76,0.18);
//       --text: #e8e4dc;
//       --muted: #7a7585;
//       --radius: 14px;
//     }

//     .wr-root {
//       font-family: 'Outfit', sans-serif;
//       background: var(--ink);
//       min-height: 100vh;
//       color: var(--text);
//       position: relative;
//       overflow-x: hidden;
//     }

//     .wr-root::before {
//       content: '';
//       position: fixed;
//       inset: 0;
//       background:
//         radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.07) 0%, transparent 60%),
//         radial-gradient(ellipse 40% 40% at 80% 90%, rgba(120,80,200,0.04) 0%, transparent 50%);
//       pointer-events: none;
//       z-index: 0;
//     }
//     .wr-root::after {
//       content: '';
//       position: fixed;
//       inset: 0;
//       background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
//       pointer-events: none;
//       z-index: 0;
//       opacity: 0.6;
//     }

//     .wr-inner {
//       position: relative;
//       z-index: 1;
//       max-width: 1200px;
//       margin: 0 auto;
//       padding: 28px 24px 60px;
//     }

//     .wr-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 16px;
//       margin-bottom: 32px;
//       padding-bottom: 24px;
//       border-bottom: 1px solid var(--border);
//     }
//     .wr-header-left { flex: 1; }

//     .wr-eyebrow {
//       font-family: 'DM Mono', monospace;
//       font-size: 10px;
//       letter-spacing: 0.2em;
//       text-transform: uppercase;
//       color: var(--gold);
//       margin-bottom: 8px;
//       opacity: 0.85;
//     }

//     .wr-title {
//       font-family: 'Cormorant Garamond', serif;
//       font-size: clamp(28px, 5vw, 44px);
//       font-weight: 300;
//       line-height: 1.1;
//       letter-spacing: -0.01em;
//       color: var(--text);
//       margin: 0;
//     }
//     .wr-title em {
//       font-style: italic;
//       color: var(--gold-light);
//     }

//     .wr-badge {
//       display: inline-flex;
//       align-items: center;
//       gap: 6px;
//       margin-top: 10px;
//       padding: 4px 12px 4px 8px;
//       background: var(--gold-dim);
//       border: 1px solid var(--border);
//       border-radius: 100px;
//       font-size: 11px;
//       font-weight: 500;
//       letter-spacing: 0.04em;
//       color: var(--gold-light);
//     }
//     .wr-badge-dot {
//       width: 6px; height: 6px;
//       border-radius: 50%;
//       background: var(--gold);
//       animation: wr-pulse 2s ease-in-out infinite;
//     }
//     @keyframes wr-pulse {
//       0%,100% { opacity:1; transform:scale(1); }
//       50%      { opacity:0.4; transform:scale(0.75); }
//     }

//     .wr-controls-slot {
//       flex-shrink: 0;
//       padding-top: 4px;
//     }

//     .wr-upload-wrap {
//       margin-bottom: 0;
//       background: var(--panel);
//       border: 1px solid var(--border);
//       border-radius: var(--radius);
//       padding: 20px 22px;
//       backdrop-filter: blur(12px);
//       transition: border-color 0.2s;
//     }
//     .wr-upload-wrap:hover { border-color: rgba(201,168,76,0.35); }

//     .wr-upload-label {
//       font-family: 'DM Mono', monospace;
//       font-size: 9.5px;
//       letter-spacing: 0.18em;
//       text-transform: uppercase;
//       color: var(--muted);
//       margin-bottom: 14px;
//     }

//     .wr-player-shell {
//       border-radius: 16px;
//       overflow: hidden;
//       border: 1px solid var(--border);
//       box-shadow:
//         0 0 0 1px rgba(201,168,76,0.05),
//         0 40px 80px -20px rgba(0,0,0,0.8),
//         0 0 60px -10px rgba(201,168,76,0.06);
//       background: #000;
//       animation: wr-fadein 0.5s ease both;
//     }
//     @keyframes wr-fadein {
//       from { opacity:0; transform:translateY(12px); }
//       to   { opacity:1; transform:translateY(0); }
//     }

//     .wr-aspect {
//       position: relative;
//       width: 100%;
//       padding-top: 56.25%;
//     }
//     .wr-aspect-inner {
//       position: absolute;
//       inset: 0;
//     }

//     .wr-player-shell::before {
//       content: '';
//       display: block;
//       height: 2px;
//       background: linear-gradient(90deg, transparent, var(--gold), transparent);
//       opacity: 0.6;
//     }

//     .wr-empty {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       padding: 80px 24px;
//       border-radius: 16px;
//       border: 1px dashed rgba(201,168,76,0.2);
//       background: var(--panel);
//       text-align: center;
//       animation: wr-fadein 0.4s ease both;
//       position: relative;
//       overflow: hidden;
//     }
//     .wr-empty::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04), transparent);
//       pointer-events: none;
//     }

//     .wr-empty-icon {
//       width: 64px; height: 64px;
//       border-radius: 50%;
//       background: var(--gold-dim);
//       border: 1px solid var(--border);
//       display: flex; align-items: center; justify-content: center;
//       font-size: 28px;
//       margin-bottom: 20px;
//     }

//     .wr-empty-title {
//       font-family: 'Cormorant Garamond', serif;
//       font-size: 22px;
//       font-weight: 300;
//       color: var(--text);
//       margin-bottom: 8px;
//     }

//     .wr-empty-sub {
//       font-size: 13px;
//       color: var(--muted);
//       max-width: 320px;
//       line-height: 1.6;
//     }

//     .wr-gate {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       min-height: 100vh;
//       background: var(--ink);
//     }
//     .wr-gate-card {
//       background: var(--panel);
//       border: 1px solid var(--border);
//       border-radius: 20px;
//       padding: 48px 40px;
//       text-align: center;
//       max-width: 360px;
//     }

//     .wr-meta {
//       margin-top: 20px;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       font-family: 'DM Mono', monospace;
//       font-size: 10px;
//       color: var(--muted);
//       letter-spacing: 0.12em;
//     }
//     .wr-meta-sep {
//       width: 3px; height: 3px;
//       border-radius: 50%;
//       background: var(--muted);
//       opacity: 0.4;
//     }

//     @media (max-width: 640px) {
//       .wr-inner { padding: 20px 16px 60px; }
//       .wr-header { flex-direction: column; gap: 12px; }
//       .wr-upload-wrap { padding: 16px; }
//     }
//   `;
//   document.head.appendChild(style);
// };

// // ─── Source detection ────────────────────────────────────────────────────────
// const detectSource = (url) => {
//   if (!url) return { type: "unknown" };
//   const ytMatch = url.match(/[?&]v=([^#&?]+)/) || url.match(/youtu\.be\/([^#&?]+)/);
//   if (ytMatch) return { type: "youtube", id: ytMatch[1] };
//   const cleanUrl = url.split("?")[0];
//   if (/\.(mp4|webm|ogg)$/i.test(cleanUrl)) return { type: "video", url };
//   if (/cloudinary\.com.*\/video\/upload\//i.test(url)) return { type: "video", url };
//   return { type: "unknown" };
// };

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function WatchRoom() {
//   const { roomId } = useParams();
//   const searchParams = useSearchParams();
//   const { data: session } = useSession();

//   const role = searchParams.get("role");
//   const isHost = role === "host";

//   const playerRef = useRef(null);
//   const socketRef = useRef(null);

//   const [state, setState] = useState({ videoUrl: "", currentTime: 0, isPlaying: false });
//   const [playerType, setPlayerType] = useState(null);
//   const [videoSrc, setVideoSrc] = useState(null);

//   useEffect(() => { injectStyles(); }, []);

//   // WebSocket connection
//   useEffect(() => {
//     if (!roomId || !role) return;

//     let ws = null;
//     let reconnectTimer = null;

//     const connect = () => {
//       const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//       const wsUrl =
//         process.env.NODE_ENV === "development"
//           ? `ws://localhost:1999/party/${roomId}?role=${role}`
//           : `wss://twinflame.yash6rana6.partykit.dev/party/${roomId}?role=${role}`;

//       ws = new WebSocket(wsUrl);
//       socketRef.current = ws;

//       ws.onopen = () => {
//         console.log("✅ WS connected");
//       };

//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);

//           if (data.type === "state-update") {
//             const newState = data.state || {};
//             setState(newState);

//             if (newState?.videoUrl) {
//               const detected = detectSource(newState.videoUrl);
//               if (detected.type !== "unknown") {
//                 setPlayerType(detected.type);
//                 setVideoSrc(detected.type === "youtube" ? detected.id : detected.url);
//               } else {
//                 setPlayerType(null);
//                 setVideoSrc(null);
//               }
//             } else {
//               setPlayerType(null);
//               setVideoSrc(null);
//             }

//             if (playerRef.current && newState?.videoUrl) {
//               const p = playerRef.current;
//               const detected = detectSource(newState.videoUrl);

//               if (detected.type === "youtube" && typeof p.getCurrentTime === "function") {
//                 if (Math.abs(p.getCurrentTime() - (newState.currentTime || 0)) > 1.5) {
//                   p.seekTo(newState.currentTime || 0, true);
//                 }
//                 const ps = p.getPlayerState();
//                 if (newState.isPlaying && ps !== 1) p.playVideo();
//                 else if (!newState.isPlaying && ps === 1) p.pauseVideo();
//               }

//               if (detected.type === "video" && p.currentTime !== undefined) {
//                 if (Math.abs(p.currentTime - (newState.currentTime || 0)) > 1.5) {
//                   p.currentTime = newState.currentTime || 0;
//                 }
//                 if (newState.isPlaying && p.paused) p.play().catch(() => {});
//                 else if (!newState.isPlaying && !p.paused) p.pause();
//               }
//             }
//           }
//         } catch (err) {
//           console.error("WS parse error:", err);
//         }
//       };

//       ws.onerror = (e) => console.error("❌ WS error:", e);

//       ws.onclose = () => {
//         console.log("⚠️ WS disconnected — reconnecting...");
//         reconnectTimer = setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       if (reconnectTimer) clearTimeout(reconnectTimer);
//       if (ws) ws.close();
//       socketRef.current = null;
//     };
//   }, [roomId, role]);

//   const sendYouTubeState = () => {
//     if (!isHost || !playerRef.current || !socketRef.current) return;
//     const p = playerRef.current;
//     socketRef.current.send(JSON.stringify({
//       type: "update-state",
//       state: {
//         videoUrl: state.videoUrl,
//         currentTime: p.getCurrentTime(),
//         isPlaying: p.getPlayerState() === 1,
//       },
//     }));
//   };

//   const sendVideoState = () => {
//     if (!isHost || !playerRef.current || !socketRef.current) return;
//     const v = playerRef.current;
//     socketRef.current.send(JSON.stringify({
//       type: "update-state",
//       state: {
//         videoUrl: state.videoUrl,
//         currentTime: v.currentTime || 0,
//         isPlaying: !v.paused,
//       },
//     }));
//   };

//   const handleSetVideo = (url) => {
//     if (!isHost || !socketRef.current) return;
//     const detected = detectSource(url);
//     if (detected.type === "unknown") {
//       alert("Please enter a valid YouTube or direct video URL.");
//       return;
//     }
//     const newState = { videoUrl: url, currentTime: 0, isPlaying: false };
//     setState((prev) => ({ ...prev, ...newState }));
//     setPlayerType(detected.type);
//     setVideoSrc(detected.type === "youtube" ? detected.id : detected.url);
//     socketRef.current.send(JSON.stringify({ type: "update-state", state: newState }));
//   };

//   if (!session) {
//     return (
//       <div className="wr-gate">
//         <div className="wr-gate-card">
//           <div className="wr-gate-icon">🎭</div>
//           <h2 className="wr-gate-title">Sign in to watch</h2>
//           <p className="wr-gate-sub">You'll need an account to join or host a movie night room.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="wr-root">
//       <div className="wr-inner">

//         {/* Header */}
//         <header className="wr-header">
//           <div className="wr-header-left">
//             <p className="wr-eyebrow">Movie Night</p>
//             <h1 className="wr-title">
//               Room <em>{roomId}</em>
//             </h1>
//             <div className="wr-badge">
//               <span className="wr-badge-dot" />
//               {isHost ? "Hosting" : "Watching as guest"}
//             </div>
//           </div>
//           <div className="wr-controls-slot">
//             <RoomControls roomId={roomId} isHost={isHost} />
//           </div>
//         </header>

//         {/* Main content: left = video, right = controls + chat */}
//         <div className="flex flex-col lg:flex-row lg:gap-8">
//           {/* Left Column - Video Player */}
//           <div className="flex-1 lg:flex-[3] order-1">
//             {videoSrc ? (
//               <div className="wr-player-shell">
//                 <div className="wr-aspect">
//                   <div className="wr-aspect-inner">
//                     <Player
//                       playerType={`${playerType}-${videoSrc}`}
//                       videoSrc={videoSrc}
//                       isHost={isHost}
//                       playerRef={playerRef}
//                       onYouTubeState={sendYouTubeState}
//                       onVideoState={sendVideoState}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="wr-empty">
//                 <div className="wr-empty-icon">🎬</div>
//                 <p className="wr-empty-title">Nothing playing yet</p>
//                 <p className="wr-empty-sub">
//                   {isHost
//                     ? "Paste a YouTube link or upload a video above to begin."
//                     : "The host hasn't started anything yet — sit tight."}
//                 </p>
//               </div>
//             )}

//             {/* Meta info below video */}
//             <div className="wr-meta mt-4 lg:mt-6">
//               <span>ROOM {roomId?.toUpperCase()}</span>
//               <span className="wr-meta-sep" />
//               <span>{isHost ? "HOST" : "GUEST"}</span>
//               {videoSrc && (
//                 <>
//                   <span className="wr-meta-sep" />
//                   <span>{playerType?.toUpperCase()}</span>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Controls + Chat */}
//           <div className="lg:w-80 xl:w-96 flex flex-col gap-6 order-2 mt-8 lg:mt-0">
//             {isHost && (
//               <div className="wr-upload-wrap">
//                 <p className="wr-upload-label">Source</p>
//                 <UploadPanel
//                   isHost={isHost}
//                   onSetVideo={handleSetVideo}
//                   roomId={roomId}
//                 />
//               </div>
//             )}

//             {/* Chat Panel */}
//             <ChatPanel socketRef={socketRef} isHost={isHost} />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


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
  const ytMatch = url.match(/[?&]v=([^#&?]+)/) || url.match(/youtu\.be\/([^#&?]+)/);
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };
  const cleanUrl = url.split("?")[0];
  if (/\.(mp4|webm|ogg)$/i.test(cleanUrl)) return { type: "video", url };
  if (/cloudinary\.com.*\/video\/upload\//i.test(url)) return { type: "video", url };
  return { type: "unknown" };
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WatchRoom() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const role = searchParams.get("role");
  const isHost = role === "host";

  const playerRef = useRef(null);
  const socketRef = useRef(null);

  const [state, setState] = useState({ videoUrl: "", currentTime: 0, isPlaying: false });
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
                setVideoSrc(detected.type === "youtube" ? detected.id : detected.url);
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

              if (detected.type === "youtube" && typeof p.getCurrentTime === "function") {
                if (Math.abs(p.getCurrentTime() - (newState.currentTime || 0)) > 1.5)
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
    socketRef.current.send(JSON.stringify({
      type: "update-state",
      state: {
        videoUrl: state.videoUrl,
        currentTime: p.getCurrentTime(),
        isPlaying: p.getPlayerState() === 1,
      },
    }));
  };

  const sendVideoState = () => {
    if (!isHost || !playerRef.current || !socketRef.current) return;
    const v = playerRef.current;
    socketRef.current.send(JSON.stringify({
      type: "update-state",
      state: {
        videoUrl: state.videoUrl,
        currentTime: v.currentTime || 0,
        isPlaying: !v.paused,
      },
    }));
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
    socketRef.current.send(JSON.stringify({ type: "update-state", state: newState }));
    setMobileTab("chat"); // auto-switch to chat after setting video
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
              <h1 className="wr-title">Room <em>{roomId}</em></h1>
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
                  <UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} />
                </div>
              )}
              <div className="wr-desktop-chat">
                <ChatPanel socketRef={socketRef} isHost={isHost} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
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
              <UploadPanel isHost={isHost} onSetVideo={handleSetVideo} roomId={roomId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
