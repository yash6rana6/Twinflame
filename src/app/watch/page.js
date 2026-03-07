"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WatchHome() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");

  const handleCreateRoom = () => {
    const id = crypto.randomUUID().slice(0, 8);
    router.push(`/watch/${id}?role=host`);
  };

  const handleJoinRoom = () => {
    if (!joinId.trim()) return alert("Room ID daal bhai 😅");
    router.push(`/watch/${joinId.trim()}?role=guest`);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">🎬 Movie Night</h1>
      <p className="text-gray-600 mb-10 text-center">
        Apne partner ke saath synced movie dekho ❤️
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={handleCreateRoom}
          className="bg-pink-600 text-white px-6 py-3 rounded text-lg"
        >
          🎬 Create Room
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            className="border p-3 flex-1 rounded"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            🔑 Join
          </button>
        </div>
      </div>
    </div>
  );
}