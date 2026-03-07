"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const acceptInvite = async () => {
    setLoading(true);

    const res = await fetch(`/api/invite/accept/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "dummyUserId",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/timeline/${data.timeline.shareId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">
          You’ve Been Invited 💌
        </h1>

        <button
          onClick={acceptInvite}
          className="bg-purple-500 text-white px-6 py-2 rounded"
        >
          {loading ? "Joining..." : "Accept Invite"}
        </button>
      </div>
    </div>
  );
}