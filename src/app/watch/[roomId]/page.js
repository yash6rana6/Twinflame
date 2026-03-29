
"use client";

import { useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWatchSocket } from "@/hooks/useWebSocket";
import { detectSource } from "@/helpers/detectSource";
import RoomControls from "./actions/RoomControls";
import UploadPanel from "./actions/UploadPanel";
import ChatPanel from "./actions/chatPanel";

// Components
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
    updateRemoteState,
  } = useWatchSocket(roomId, role, playerRef);

  if (!session) return <SignInToWatch />;

  const handleSetVideo = (url) => {
    if (!isHost) return;
    const detected = detectSource(url);
    if (detected.type === "unknown") return alert("Invalid URL");

    const newState = { videoUrl: url, currentTime: 0, isPlaying: false };
    setState(newState);
    setPlayerType(detected.type);
    setVideoSrc(detected.type === "youtube" ? detected.id : detected.url);
    updateRemoteState(newState);
  };

  const syncState = () => {
    if (!isHost || !playerRef.current) return;
    const p = playerRef.current;
    const currentTime = p.getCurrentTime ? p.getCurrentTime() : p.currentTime;
    const isPlaying = p.getPlayerState ? p.getPlayerState() === 1 : !p.paused;

    updateRemoteState({ ...state, currentTime, isPlaying });
  };

  const playerEl = videoSrc ? (
    <Player
      playerType={playerType}
      videoSrc={videoSrc}
      isHost={isHost}
      playerRef={playerRef}
      onYouTubeState={syncState}
      onVideoState={syncState}
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
