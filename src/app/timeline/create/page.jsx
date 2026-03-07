"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTimelinePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("romantic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: "",
        theme,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    router.push(`/timeline/${data.timeline.shareId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">
      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Your Timeline 💕
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Timeline Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="romantic">Romantic</option>
          <option value="minimal">Minimal</option>
          <option value="classic">Classic</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-pink-500 text-white p-3 rounded hover:bg-pink-600 transition"
        >
          {loading ? "Creating..." : "Create Timeline"}
        </button>
      </form>
    </div>
  );
}