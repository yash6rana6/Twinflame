import { timeStamp } from "console";

export default {
  async onStart(room) {
    const stored = await room.storage.get("appState");
    const chatHistory = await room.storage.get("chatHistory");
    if (stored) {
      room.state = stored;
      console.log(
        "[onStart] Loaded from storage:",
        room.state.hostId || "no host yet",
      );
    } else {
      room.state = {
        hostId: null,
        videoUrl: "",
        currentTime: 0,
        isPlaying: false,
        playbackRate: 1.0,
        source: null,
        lastUpdate: 0,
      };
      console.log("[onStart] Fresh state created");
      await room.storage.put("appState", room.state);
    }
    room.chatHistory = chatHistory || [];
  },

  async onConnect(conn, room) {
    if (!room.state) {
      await this.onStart(room);
    }

    let role = "guest";
    try {
      if (conn.request?.url) {
        const url = new URL(conn.request.url);
        role = url.searchParams.get("role") || "guest";
      }
    } catch (e) {
      console.warn("⚠️ URL parse failed, defaulting to guest");
    }

    let hostChanged = false;

    // 🧹 Agar stored hostId hai but wo banda connected hi nahi hai → reset
    const connectedIds = [...room.getConnections()].map((c) => c.id);
    if (room.state.hostId && !connectedIds.includes(room.state.hostId)) {
      console.log("🧹 Stale host found, resetting host");
      room.state.hostId = null;
      hostChanged = true;
    }

    // 👑 Agar koi host nahi hai aur ye banda host role ke saath aaya hai → make host
    if (!room.state.hostId && role === "host") {
      room.state.hostId = conn.id;
      hostChanged = true;
      console.log("👑 Assigned new host:", conn.id);
      await room.storage.put("appState", room.state);
    }

    // 🔔 Host change broadcast
    if (hostChanged) {
      room.broadcast(
        JSON.stringify({
          type: "host-changed",
          newHostId: room.state.hostId,
        }),
      );
    }

    // 🔥 New client ko current state bhejo
    // 🔥 New client ko current state bhejo
    conn.send(
      JSON.stringify({
        type: "state-update",
        state: room.state,
        yourRole: conn.id === room.state.hostId ? "host" : "viewer",
      }),
    );

    // 💬 Send chat history
    conn.send(
      JSON.stringify({
        type: "chat-history",
        messages: room.chatHistory || [],
      }),
    );

    console.log(
      "🔌 Connected:",
      conn.id,
      "role:",
      conn.id === room.state.hostId ? "host" : "viewer",
    );
  },

  async onClose(conn, room) {
    if (!room?.state) return;

    if (conn.id === room.state.hostId) {
      console.log("⚠️ Host disconnected:", conn.id);
      room.state.hostId = null;

      room.broadcast(
        JSON.stringify({
          type: "host-changed",
          newHostId: null,
        }),
      );

      await room.storage.put("appState", room.state);
    }
  },

  async onMessage(message, sender, room) {
    if (!room?.state) return;

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Bad JSON message:", err);
      return;
    }

    console.log("📩 Message from", sender.id, "type:", data.type);

    let stateChanged = false;

    // 🎬 SET VIDEO
    if (data.type === "set-video") {
      room.state = {
        ...room.state,
        videoUrl: data.url?.trim() || "",
        source: data.source || null,
        currentTime: data.startTime ?? 0,
        isPlaying: false,
        playbackRate: 1.0,
        lastUpdate: Date.now(),
      };
      stateChanged = true;
    }

    // 🔄 SYNC STATE
    if (data.type === "update-state") {
      room.state = {
        ...room.state,
        ...data.state,
        lastUpdate: Date.now(),
      };
      stateChanged = true;
    }

    // 🧹 CLEAR VIDEO
    if (data.type === "clear-video") {
      room.state = {
        ...room.state,
        videoUrl: "",
        currentTime: 0,
        isPlaying: false,
        lastUpdate: Date.now(),
      };
      stateChanged = true;
    }

    if (data.type == "chat") {
      if (!data.text?.trim()) return;

      const chatMessage = {
        type: "chat",
        text: data.text.trim(),
        senderId: sender.id || "unknown",
        timestamp: Date.now(),
        username: data.username || "Anon",
      };

      room.broadcast(JSON.stringify(chatMessage));
      room.chatHistory = [...(room.chatHistory || []), chatMessage].slice(-50);
      await room.storage.put("chatHistory", room.chatHistory);
      return;
    }

    // 📢 Broadcast to everyone
    if (stateChanged) {
      room.broadcast(
        JSON.stringify({
          type: "state-update",
          state: room.state,
        }),
      );
      await room.storage.put("appState", room.state);
    }

    if (data.type === "typing") {
      room.broadcast(
        JSON.stringify({
          type: "typing",
          username: data.username,
        }),
      );
      return;
    }
  },
};
