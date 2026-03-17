"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ socketRef, isHost, myConnectionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
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
        if (data.type === "chat") setMessages((prev) => [...prev, data]);
        if (data.type === "chat-history") setMessages(data.messages || []);
      } catch {}
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
      })
    );
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--panel)] rounded-xl overflow-hidden border border-[var(--border)]">

      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/60 flex items-center justify-between">
        <h3 className="text-[var(--gold-light)] text-xs font-medium uppercase tracking-widest font-mono">
          Live Chat
        </h3>
        <span className="text-base">🍿</span>
      </div>

      {/* Messages — only this scrolls */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3"
      >
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-1">
            <p className="text-[var(--text)] text-sm opacity-50">No messages yet</p>
            <span className="text-[var(--muted)] text-xs">Be the first to say something!</span>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.senderId === myConnectionId;
          return (
            <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[75%] break-words
                  ${isMine
                    ? "bg-[var(--gold)] text-[var(--ink)] rounded-br-sm"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-bl-sm"
                  }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-mono uppercase tracking-wide opacity-50 mb-1">
                    {msg.username || "Anon"}
                  </div>
                )}
                <div className="leading-relaxed">{msg.text}</div>
                {msg.timestamp && (
                  <div className="text-[9px] opacity-40 mt-1 text-right font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input — always visible, never pushed out */}
      <div className="flex-shrink-0 p-3 border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... 😂"
            className="flex-1 min-w-0 bg-[var(--ink)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex-shrink-0 bg-[var(--gold)]/80 hover:bg-[var(--gold)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--ink)] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}