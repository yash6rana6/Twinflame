

"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ socketRef, isHost, myConnectionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = socketRef.current;
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setMessages((prev) => [...prev, data]);
        }
        if (data.type === "chat-history") {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Chat error:", err);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [socketRef]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        text: input.trim(),
        username: isHost ? "Host" : "Viewer",
        senderId: myConnectionId,
        timestamp: Date.now(),
      })
    );
    setInput("");
    setTimeout(scrollToBottom, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    /*
      FIX: Parent ko `h-full` ke saath `min-h-0` aur `overflow-hidden` dena zaroori hai.
      Agar parent khud flex child hai toh usse bhi `min-h-0` chahiye —
      warna flex children apni natural height se neeche overflow karte hain.
    */
    <div className="flex flex-col min-h-0 h-full w-full bg-[var(--panel)] overflow-hidden border border-[var(--border)] rounded-xl">

      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/60 flex items-center justify-between">
        <h3 className="text-[var(--gold-light)] text-xs font-medium uppercase tracking-widest font-mono">
          Live Chat
        </h3>
        <span className="text-base">🍿</span>
      </div>

      {/*
        Messages Area:
        - `flex-1 min-h-0` — baki space lo, aur shrink bhi ho sako
        - `overflow-y-auto` — sirf ye scroll kare
        Yahi combo fix karta hai "neeche jaane" ka issue.
      */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 opacity-50">
            <p className="text-[var(--text)] text-sm">No messages yet</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.senderId === myConnectionId;
          return (
            <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words shadow-sm
                  ${isMine
                    ? "bg-[var(--gold)] text-[var(--ink)] rounded-br-none"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-bl-none"
                  }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-mono uppercase tracking-wide opacity-60 mb-1">
                    {msg.username || "Anon"}
                  </div>
                )}
                <div className="leading-relaxed">{msg.text}</div>
                <div className="text-[9px] opacity-40 mt-1 text-right font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area: flex-none — hamesha niche fixed, kabhi gayab nahi hoga */}
      <div className="flex-none p-3 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 min-w-0 bg-[var(--ink)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex-shrink-0 bg-[var(--gold)] hover:brightness-110 disabled:opacity-30 text-[var(--ink)] px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}