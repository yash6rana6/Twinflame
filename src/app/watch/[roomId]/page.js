"use client";

import { useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWatchSocket } from "@/hooks/useWebSocket";
import { detectSource } from "@/helpers/detectSource";
import RoomControls from "./actions/RoomControls";
import UploadPanel from "./actions/UploadPanel";
import ChatPanel from "./actions/chatPanel";
import Player from "./actions/Player";
import SignInToWatch from "@/components/watch/SignInToWatch";
import WatchRoomUI from "@/components/watch/WatchRoomUI";

export default function WatchRoom() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const playerRef = useRef(null);

  const role = searchParams.get("role");
  const isHost = role === "host";

  const {
    state,
    setState,
    playerType,
    setPlayerType,
    videoSrc,
    setVideoSrc,
    onPlayerReady,    // ← from hook
    updateRemoteState,
    syncState,
    setVideo,
    clearVideo,
  } = useWatchSocket(roomId, role, playerRef);

  if (!session) return <SignInToWatch />;

  // Host sets a new video
  const handleSetVideo = (url) => {
    if (!isHost) return;
    const detected = detectSource(url);
    if (detected.type === "unknown") return alert("Invalid URL");
    setVideo(url);
  };

  // Host player events → broadcast to guests
  const handleSyncState = () => {
    if (!isHost || !playerRef.current) return;
    syncState();
  };

  const playerEl = videoSrc ? (
    <Player
      playerType={playerType}
      videoSrc={videoSrc}
      isHost={isHost}
      playerRef={playerRef}
      onYouTubeState={handleSyncState}
      onVideoState={handleSyncState}
      onPlayerReady={onPlayerReady}   // ← wire it in
    />
  ) : null;

  return (
    <WatchRoomUI
      roomId={roomId}
      isHost={isHost}
      videoSrc={videoSrc}
      playerEl={playerEl}
      playerType={playerType}
      handleSetVideo={handleSetVideo}
      RoomControls={RoomControls}
      UploadPanel={UploadPanel}
      ChatPanel={ChatPanel}
    />
  );
}