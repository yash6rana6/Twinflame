"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import Ably from "ably";
import { Send, Hash, Circle, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);

// ── Message Bubble (text only, no bg box) ──────────────────────────────────
const MessageBubble = memo(({ msg, isMe }) => (
  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-0.5`}>
    {msg.senderName && (
      <span
        className={`text-[10px] font-bold px-1 leading-none ${
          isMe ? "text-pink-400/70 text-right" : "text-pink-400 text-left"
        }`}
      >
        {isMe ? "You" : msg.senderName}
      </span>
    )}

    <div
      className={`max-w-[85%] text-sm ${
        isMe ? "text-right text-white" : "text-left text-white/90"
      }`}
      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
    >
      {msg.text}
    </div>

    <span className="text-[8px] font-bold text-white/40 px-1 uppercase tracking-tighter">
      {new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
));
MessageBubble.displayName = "MessageBubble";

// ── ChatPanel ────────────────────────────────────────────────────────────
export default function ChatPanel({ roomId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const [myId] = useState(generateId);

  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const myName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Anonymous";

  const scrollToBottom = useCallback((instant = false) => {
    bottomRef.current?.scrollIntoView({
      behavior: instant ? "instant" : "smooth",
      block: "nearest",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleFocus = useCallback(() => {
    const t = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(t);
  }, [scrollToBottom]);

  useEffect(() => {
    if (!ablyRef.current) {
      ablyRef.current = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
        clientId: myId,
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

    channel
      .history({ limit: 50 })
      .then((page) => {
        setMessages(page.items.map((m) => m.data).reverse());
      })
      .catch(console.error);

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
  }, [roomId, myId]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !channelRef.current) return;
    setInput("");
    try {
      await channelRef.current.publish("chat", {
        text,
        senderId: myId,
        senderName: myName,
        timestamp: Date.now(),
      });
    } catch (e) {
      console.error("Send error", e);
    }
  }, [input, myName, myId]);

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
    <div className="flex flex-col h-full w-full overflow-hidden bg-transparent">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-5 py-3 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-2">
          <Hash size={13} className="text-pink-500" />
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
          >
            Live Chat
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-bold text-pink-400/80 uppercase tracking-wider"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
          >
            {myName}
          </span>
          <div className="flex items-center gap-1.5">
            <Circle
              size={5}
              className={`${
                connected
                  ? "fill-emerald-500 text-emerald-500"
                  : "fill-rose-500 text-rose-500"
              } animate-pulse`}
            />
            <span
              className="text-[9px] font-bold uppercase tracking-widest text-white/50"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
            >
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-transparent"
        style={{ scrollbarWidth: "thin", overscrollBehavior: "contain" }}
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-20 select-none">
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
              isMe={m.senderId === myId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Invisible input — no box, no border, no bg, just text ── */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center gap-2 bg-transparent">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          placeholder="Say something..."
          maxLength={500}
          style={{ fontSize: "16px", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
          className="flex-1 bg-transparent outline-none border-none text-white placeholder:text-white/40"
        />
        {input.trim() && (
          <button
            onClick={sendMessage}
            className="p-2 text-pink-500 active:scale-90 transition-transform flex-shrink-0"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}