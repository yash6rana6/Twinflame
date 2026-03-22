"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ socketRef, isHost, myConnectionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ FIXED WebSocket listener (stable)
  useEffect(() => {
    const ws = socketRef.current;
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 💬 chat message
        if (data.type === "chat") {
          setMessages((prev) => {
            const exists = prev.some(
              (m) =>
                m.timestamp === data.timestamp &&
                m.senderId === data.senderId
            );
            if (exists) return prev;
            return [...prev, data];
          });
        }

        // 📜 chat history
        if (data.type === "chat-history") {
          setMessages(data.messages || []);
        }

        // 💬 typing indicator
        if (data.type === "typing") {
          setTypingUser(data.username);

          setTimeout(() => {
            setTypingUser(null);
          }, 1500);
        }
      } catch (err) {
        console.error("Chat error:", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [socketRef]); // ✅ empty dependency (IMPORTANT)

  // 🚀 SEND MESSAGE (Optimistic UI)
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    
    const msg = {
      type: "chat",
      text: input.trim(),
      username: isHost ? "Host" : "Viewer",
      senderId: myConnectionId,
      timestamp: Date.now(),
    };
    console.log(msg)
    socketRef.current.send(JSON.stringify(msg)); 
    setInput("");
  };

  // 💬 typing event
  const handleTyping = (value) => {
    setInput(value);

    socketRef.current?.send(
      JSON.stringify({
        type: "typing",
        username: isHost ? "Host" : "Viewer",
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-0 h-full w-full bg-[var(--panel)] overflow-hidden border border-[var(--border)] rounded-xl">
      
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/60 flex items-center justify-between">
        <h3 className="text-[var(--gold-light)] text-xs font-medium uppercase tracking-widest font-mono">
          Live Chat
        </h3>
        <span className="text-base">🍿</span>
      </div>

      {/* Messages */}
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
            <div
              key={i}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words shadow-sm
                ${
                  isMine
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

        {/* 💬 Typing indicator */}
        {typingUser && (
          <div className="text-xs opacity-50 px-2">
            {typingUser} is typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none p-3 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
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