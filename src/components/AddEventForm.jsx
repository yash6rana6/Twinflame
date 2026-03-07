"use client";

import { useState } from "react";

export default function AddEventForm({ timelineId, refresh }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("date", new Date().toISOString());
    formData.append("title", title);
    formData.append("eventType", "daily");

    if (file) {
      formData.append("media", file);
    }

    await fetch(`/api/events/${timelineId}`, {
      method: "POST",
      body: formData,
    });

    setTitle("");
    setFile(null);
    setLoading(false);
    refresh();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Add New Memory ✨</h3>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Add Event"}
      </button>
    </div>
  );
}