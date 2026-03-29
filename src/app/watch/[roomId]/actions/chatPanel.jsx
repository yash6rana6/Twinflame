"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import Ably from "ably";
import { Send, Hash, Circle, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);

// Message bubble — Telegram style: name floats ABOVE the bubble, outside it
const MessageBubble = memo(({ msg, isMe }) => (
  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-0.5`}>

    {/* ── Name tag — sits above bubble, outside it, like Telegram ── */}
    {msg.senderName && (
      <span
        className={`text-[10px] font-bold px-1 leading-none ${
          isMe
            ? "text-pink-400/50 text-right"         // muted for self
            : "text-pink-400 text-left"              // vivid for others
        }`}
      >
        {isMe ? "You" : msg.senderName}
      </span>
    )}

    {/* ── Bubble ── */}
    <div
      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-md ${
        isMe
          ? "bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-tr-none border border-pink-500/20"
          : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"
      }`}
    >
      {msg.text}
    </div>

    {/* ── Timestamp ── */}
    <span className="text-[8px] font-bold text-white/20 px-1 uppercase tracking-tighter">
      {new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>

  </div>
));
MessageBubble.displayName = "MessageBubble";

export default function ChatPanel({ roomId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const myId = useRef(generateId());
  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const bottomRef = useRef(null);

  // Derive display name from session
  const myName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Anonymous";

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!ablyRef.current) {
      ablyRef.current = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
        clientId: myId.current,
      });
    }

    const client = ablyRef.current;
    const channel = client.channels.get(`room-${roomId}`);
    channelRef.current = channel;

    const onConnected = () => setConnected(true);
    const onDisconnected = () => setConnected(false);

    client.connection.on("connected", onConnected);
    client.connection.on("failed", onDisconnected);
    client.connection.on("disconnected", onDisconnected);

    // Load history
    channel
      .history({ limit: 50 })
      .then((page) => {
        setMessages(page.items.map((m) => m.data).reverse());
      })
      .catch(console.error);

    // Live messages
    const onMsg = (msg) => {
      if (!msg.data?.text) return;
      setMessages((prev) => [...prev, msg.data]);
      window.dispatchEvent(new CustomEvent("twinflame:newmsg"));
    };
    channel.subscribe("chat", onMsg);

    return () => {
      channel.unsubscribe("chat", onMsg);
      client.connection.off("connected", onConnected);
      client.connection.off("failed", onDisconnected);
      client.connection.off("disconnected", onDisconnected);
    };
  }, [roomId]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !channelRef.current) return;
    setInput("");
    try {
      await channelRef.current.publish("chat", {
        text,
        senderId: myId.current,
        senderName: myName, // ← NextAuth name injected here
        timestamp: Date.now(),
      });
    } catch (e) {
      console.error("Send error", e);
    }
  }, [input, myName]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Hash size={13} className="text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            Live Chat
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Logged-in user badge */}
          <span className="text-[9px] font-bold text-pink-400/60 uppercase tracking-wider">
            {myName}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/20 rounded-full border border-white/5">
            <Circle
              size={5}
              className={`${
                connected
                  ? "fill-emerald-500 text-emerald-500"
                  : "fill-rose-500 text-rose-500"
              } animate-pulse`}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-10 select-none">
            <MessageSquare size={36} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              No messages yet
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <MessageBubble
              key={`${m.timestamp}-${i}`}
              msg={m}
              isMe={m.senderId === myId.current}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 border-t border-white/5 bg-black/30">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/8 p-1.5 rounded-2xl focus-within:border-pink-500/40 transition-colors duration-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Say something..."
            maxLength={500}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/10"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-pink-500/20"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}