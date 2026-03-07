"use client";
import YouTube from "react-youtube";

export default function Player({
  playerType,
  videoSrc,
  isHost,
  playerRef,
  onYouTubeState,
  onVideoState,
}) {
  if (!videoSrc) return null;

  if (playerType === "youtube") {
    return (
      <div className="aspect-video relative">
        {!isHost && (
          // 🛑 Overlay to block clicks for guest
          <div className="absolute inset-0 z-10 cursor-not-allowed" />
        )}

        <YouTube
          videoId={videoSrc}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
              controls: isHost ? 1 : 0,
              disablekb: isHost ? 0 : 1,
              fs: isHost ? 1 : 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={(e) => (playerRef.current = e.target)}
          onStateChange={() => {
            if (isHost) onYouTubeState();
          }}
        />
      </div>
    );
  }

  return (
    <div className="aspect-video">
      <video
        ref={playerRef}
        src={videoSrc}
        controls={isHost}
        className={`w-full h-full bg-black ${
          !isHost ? "pointer-events-none select-none" : ""
        }`}
        onPlay={() => {
          if (isHost) onVideoState();
        }}
        onPause={() => {
          if (isHost) onVideoState();
        }}
        onSeeked={() => {
          if (isHost) onVideoState();
        }}
      />
    </div>
  );
}