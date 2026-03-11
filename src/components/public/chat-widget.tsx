"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATIC_GREETING =
  "Hi! I'm JV's AI. Ask me anything about his work, projects, or experience.";

export function ChatWidget({
  initialRemaining = 20,
}: {
  initialRemaining?: number;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);
  const remainingRef = useRef(initialRemaining);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Custom fetch captures X-Remaining-Messages header before stream is consumed
  const customFetch: typeof fetch = useCallback(async (url, options) => {
    const response = await fetch(url, options as RequestInit);
    const r = response.headers.get("X-Remaining-Messages");
    if (r !== null) remainingRef.current = Number(r);
    return response;
  }, []);

  // Stable transport instance — recreating it on every render would reset the chat
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", fetch: customFetch }),
    [customFetch],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onFinish: () => {
      // Sync captured header value into React state after stream completes
      setRemaining(remainingRef.current);
    },
    onError: (err) => {
      // On 429, set remaining to 0
      if (
        err.message.includes("429") ||
        err.message.toLowerCase().includes("rate limit")
      ) {
        remainingRef.current = 0;
        setRemaining(0);
      }
    },
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const isAtLimit = remaining === 0;
  const isInputDisabled = isStreaming || isAtLimit;
  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isInputDisabled) return;
    setInput("");
    void sendMessage({ text });
  }, [input, isInputDisabled, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 bottom-28 right-4 sm:bottom-20 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] flex flex-col rounded-xl border shadow-2xl overflow-hidden"
          style={{
            background: "var(--card)",
            color: "var(--card-foreground)",
            borderColor: "var(--border)",
            maxHeight: "520px",
          }}
          role="dialog"
          aria-label="Ask JV chat"
          aria-modal="false"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                JV
              </div>
              <span className="font-semibold text-sm">Ask JV</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-7 h-7 rounded-md transition-opacity hover:opacity-70"
              style={{ color: "var(--muted-foreground)" }}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message list */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {/* Static greeting — never calls the API */}
            <div className="flex items-start gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                }}
                aria-hidden="true"
              >
                <Bot size={12} />
              </div>
              <div
                className="rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[85%]"
                style={{
                  background: "var(--muted)",
                  color: "var(--foreground)",
                }}
              >
                {STATIC_GREETING}
              </div>
            </div>

            {/* Conversation messages */}
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isUser && (
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                      }}
                      aria-hidden="true"
                    >
                      <Bot size={12} />
                    </div>
                  )}
                  <div
                    className="rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[85%]"
                    style={
                      isUser
                        ? {
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }
                        : {
                            background: "var(--muted)",
                            color: "var(--foreground)",
                          }
                    }
                  >
                    {msg.parts.map((part, i) =>
                      part.type === "text" ? (
                        <span key={i}>{part.text}</span>
                      ) : null,
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Remaining count footer */}
          <div
            className="px-4 py-2 text-xs shrink-0"
            style={{
              borderTop: "1px solid var(--border)",
              color: isAtLimit
                ? "var(--destructive)"
                : "var(--muted-foreground)",
            }}
          >
            {isAtLimit
              ? "You've used all your questions for today. Come back tomorrow."
              : `${remaining} question${remaining === 1 ? "" : "s"} remaining today`}
          </div>

          {/* Error message */}
          {error && !isAtLimit && (
            <div
              className="flex items-center gap-2 px-4 py-2 text-xs shrink-0"
              style={{
                color: "var(--destructive)",
                borderTop: "1px solid var(--border)",
              }}
            >
              <AlertCircle size={12} aria-hidden="true" />
              {error.message.includes("503") ||
              error.message.includes("unavailable")
                ? "Sorry, the AI is temporarily unavailable. Try again later."
                : "Message failed. Please try again."}
            </div>
          )}

          {/* Input row */}
          <div
            className="flex items-end gap-2 px-3 py-3 shrink-0"
            style={{
              borderTop:
                error && !isAtLimit ? undefined : "1px solid var(--border)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isInputDisabled}
              rows={1}
              placeholder={isAtLimit ? "Limit reached" : "Ask me anything…"}
              aria-label="Chat message input"
              className="flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none transition-colors disabled:cursor-not-allowed"
              style={{
                background: "var(--input)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                minHeight: "38px",
                maxHeight: "96px",
                lineHeight: "1.5",
              }}
            />
            <Button
              type="button"
              size="sm"
              disabled={isInputDisabled || !input.trim()}
              onClick={handleSend}
              aria-label="Send message"
              className="shrink-0 h-[38px] w-[38px] p-0"
            >
              <Send size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Ask JV chat" : "Open Ask JV chat"}
        aria-expanded={open}
        className="fixed z-50 bottom-20 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        {!open && hasMessages && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
            style={{
              background: "var(--destructive)",
              borderColor: "var(--background)",
            }}
            aria-hidden="true"
          />
        )}
        <MessageCircle size={18} aria-hidden="true" />
        Ask JV
      </button>
    </>
  );
}
