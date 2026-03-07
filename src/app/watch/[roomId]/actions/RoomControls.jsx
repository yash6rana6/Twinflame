"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoomControls({ roomId, isHost }) {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");

  const handleCreateRoom = () => {
    const id = crypto.randomUUID().slice(0, 8);
    router.push(`/watch/${id}?role=host`);
  };

  const handleJoinRoom = () => {
    if (!joinId.trim()) return alert("Room ID daal bhai 😅");
    if (joinId.trim() === roomId) return alert("Isi room me already ho 😄");
    router.push(`/watch/${joinId.trim()}?role=guest`);
  };

  const handleCopyInvite = async () => {
    const link = `${window.location.origin}/watch/${roomId}?role=guest`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Invite link copied! 📋\n" + link);
    } catch {
      alert("Copy failed, manually copy:\n" + link);
    }
  };

  const handleLeaveRoom = () => router.push("/");

  return (
    <div className="mb-6 p-4 border rounded space-y-4">
      <div className="flex gap-4 flex-wrap">
        {/* Create Room only for host or when no roomId */}
        {(isHost || !roomId) && (
          <button
            onClick={handleCreateRoom}
            className="bg-pink-600 text-white px-4 py-2 rounded"
          >
            🎬 Create Room
          </button>
        )}

        <div className="flex gap-2 flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            🔑 Join Room
          </button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {roomId && (
          <button
            onClick={handleCopyInvite}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            🔗 Copy Invite Link
          </button>
        )}
        <button
          onClick={handleLeaveRoom}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          🚪 Leave Room
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Current role: <b>{isHost ? "👑 Host" : "👀 Guest (view only)"}</b>
      </p>
    </div>
  );
}