

export default {
  async onStart(room) {
    const stored = await room.storage.get("appState");

    if (stored) {
      room.state = stored;
      console.log("[onStart] Loaded state, hostId:", room.state.hostId || "none");
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
      await room.storage.put("appState", room.state);
    }
  },

  async onConnect(conn, room) {
    if (!room.state) await this.onStart(room);

    // Role URL param se lo
    let role = "guest";
    try {
      if (conn.request?.url) {
        const url = new URL(conn.request.url);
        role = url.searchParams.get("role") || "guest";
      }
    } catch (e) {
      console.warn("URL parse failed, defaulting to guest");
    }

    let hostChanged = false;

    // Agar stored hostId hai but wo disconnect ho chuka hai → reset
    const connectedIds = [...room.getConnections()].map((c) => c.id);
    if (room.state.hostId && !connectedIds.includes(room.state.hostId)) {
      room.state.hostId = null;
      hostChanged = true;
    }

    // Koi host nahi + ye banda host role ke saath aaya → make host
    if (!room.state.hostId && role === "host") {
      room.state.hostId = conn.id;
      hostChanged = true;
      await room.storage.put("appState", room.state);
    }

    if (hostChanged) {
      room.broadcast(
        JSON.stringify({ type: "host-changed", newHostId: room.state.hostId })
      );
    }

    // Current state bhejo — yourId include kiya taaki client apna role jaane
    conn.send(
      JSON.stringify({
        type: "state-update",
        state: room.state,
        yourId: conn.id,
        yourRole: conn.id === room.state.hostId ? "host" : "viewer",
      })
    );

    console.log(
      "Connected:", conn.id,
      "| role:", conn.id === room.state.hostId ? "host" : "viewer",
      "| video:", room.state.videoUrl || "none"
    );
  },

  async onClose(conn, room) {
    if (!room?.state) return;
    if (conn.id !== room.state.hostId) return; // Guest disconnect — ignore

    console.log("Host disconnected:", conn.id);

    // Video pause karo taaki loop na chale
    room.state = {
      ...room.state,
      isPlaying: false,
      hostId: null,
      lastUpdate: Date.now(),
    };

    const remaining = [...room.getConnections()].filter((c) => c.id !== conn.id);

    if (remaining.length > 0) {
      // Pehle viewer ko promote karo host ke roop mein
      const newHost = remaining[0];
      room.state.hostId = newHost.id;

      console.log("Promoting new host:", newHost.id);

      // Naye host ko promote event bhejo
      newHost.send(
        JSON.stringify({
          type: "promoted-to-host",
          state: room.state,
          yourId: newHost.id,
          yourRole: "host",
        })
      );

      // Sabko updated hostId + paused state batao
      room.broadcast(
        JSON.stringify({
          type: "host-changed",
          newHostId: newHost.id,
          state: room.state,
        })
      );
    } else {
      // Room empty — state reset karo
      console.log("Room empty, resetting");
      room.state = {
        ...room.state,
        videoUrl: "",
        currentTime: 0,
        isPlaying: false,
        hostId: null,
        lastUpdate: Date.now(),
      };

      room.broadcast(
        JSON.stringify({ type: "host-changed", newHostId: null, state: room.state })
      );
    }

    await room.storage.put("appState", room.state);
  },

  async onMessage(message, sender, room) {
    if (!room?.state) return;

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Bad JSON:", err);
      return;
    }

    let stateChanged = false;

    // SET VIDEO
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

    // SYNC (play/pause/seek)
    if (data.type === "update-state") {
      room.state = {
        ...room.state,
        ...data.state,
        lastUpdate: Date.now(),
      };
      stateChanged = true;
    }

    // CLEAR VIDEO
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

    // Client ready signal — player mount hone ke baad fresh state bhejo sirf usi ko
    // Client side pe: useEffect mein socket.send({ type: "i-am-ready" }) jab player mount ho
    if (data.type === "i-am-ready") {
      sender.send(
        JSON.stringify({
          type: "state-update",
          state: room.state,
          yourId: sender.id,
          yourRole: sender.id === room.state.hostId ? "host" : "viewer",
        })
      );
      return;
    }

    // Broadcast to all
    if (stateChanged) {
      room.broadcast(
        JSON.stringify({ type: "state-update", state: room.state })
      );
      await room.storage.put("appState", room.state);
    }
  },
};