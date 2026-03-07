"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddEventForm from "@/components/AddEventForm";

export default function TimelinePage() {
  const { shareId } = useParams();
  const [timeline, setTimeline] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    const res = await fetch(`/api/timeline/${shareId}`);
    const data = await res.json();

    if (data.success) {
      setTimeline(data.timeline);
      setEvents(data.events);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!timeline) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {timeline.title}
        </h1>

        <p className="text-gray-600 mb-6">
          Theme: {timeline.theme}
        </p>

        <AddEventForm timelineId={timeline._id} refresh={fetchData} />

        <div className="mt-10 space-y-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h2 className="text-xl font-semibold">
                {event.title}
              </h2>
              <p className="text-gray-500 text-sm">
                {event.dateString}
              </p>
              <p className="mt-2">{event.description}</p>

              <div className="flex gap-3 mt-4 flex-wrap">
                {event.media?.map((m, i) =>
                  m.type === "image" ? (
                    <img
                      key={i}
                      src={m.url}
                      className="w-32 rounded"
                    />
                  ) : (
                    <video
                      key={i}
                      src={m.url}
                      controls
                      className="w-32 rounded"
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}