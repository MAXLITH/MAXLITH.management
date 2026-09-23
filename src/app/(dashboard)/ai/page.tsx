"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  Code2,
  FileText,
  CalendarClock,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const promptSuggestions = [
  {
    icon: FileText,
    label: "Summarize today's Daily Reports",
    prompt: "Give me an executive summary of all employee daily work reports submitted today.",
  },
  {
    icon: Code2,
    label: "Check open GitHub PRs for Rust Engine",
    prompt: "What are the active Pull Requests in maxlith/hfa-v4-core and their review statuses?",
  },
  {
    icon: CalendarClock,
    label: "Team Leave Schedule",
    prompt: "Who is scheduled for leave or out-of-office this coming week?",
  },
  {
    icon: Zap,
    label: "Quant Strategy Status",
    prompt: "What is the current progress and milestone completion on the Quant Risk Analytics Engine?",
  },
];

export default function AIPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am MAXLITH AI, your internal company intelligence assistant. How can I assist you with projects, reports, GitHub repos, or leave schedules today?",
      time: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim()) return;

    const newMsgs = [
      ...messages,
      { sender: "user", text: textToSend, time: "Just now" },
    ];
    setMessages(newMsgs);
    if (!userPrompt) setInput("");
    setLoading(true);

    setTimeout(() => {
      let botReply = "I have queried the MAXLITH internal database. All 4 active projects are progressing according to plan with 78% average sprint completion.";
      if (textToSend.toLowerCase().includes("daily report")) {
        botReply = "Today 4 daily reports were submitted: Varun Sharma logged 8.5h on NextAuth v5 & platform scaffolding; Elena Rostova logged 8h on PyTorch VaR simulations; David Chen logged 7.5h on FPGA DMA debugging.";
      } else if (textToSend.toLowerCase().includes("pr") || textToSend.toLowerCase().includes("github")) {
        botReply = "There are 6 open PRs across 4 repos. Top priority PR #42 'feat(simd): AVX-512 orderbook matching' by Varun Sharma is APPROVED and ready for merge.";
      } else if (textToSend.toLowerCase().includes("leave")) {
        botReply = "Sarah Jenkins has a pending Sick Leave request for Sep 24-25. Varun Sharma is approved for PTO from Oct 10-14 (Handover: David Chen).";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: botReply, time: "Just now" },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Bot className="text-[var(--accent)]" size={26} />
            <span>MAXLITH AI Assistant</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            AI workspace intelligence connected to company tasks, reports, leave, and GitHub repos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--accent)]/30 flex items-center gap-1.5">
            <Sparkles size={12} />
            <span>Gemini 1.5 Pro Enabled</span>
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-inner">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 max-w-3xl",
              m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-md",
                m.sender === "user"
                  ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] text-white"
                  : "bg-[var(--accent-muted)] text-[var(--accent)]"
              )}
            >
              {m.sender === "user" ? "ME" : <Bot size={18} />}
            </div>

            <div
              className={cn(
                "p-4 rounded-2xl text-xs leading-relaxed space-y-1 shadow-sm",
                m.sender === "user"
                  ? "bg-[var(--accent)] text-white rounded-tr-none"
                  : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-none"
              )}
            >
              <p>{m.text}</p>
              <span className="text-[9px] text-[var(--text-muted)] block text-right pt-1 opacity-70">
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-2">
            <RefreshCw size={14} className="animate-spin text-[var(--accent)]" />
            <span>MAXLITH AI is analyzing company data...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
        {promptSuggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-all text-left space-y-1 group"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-hover)]">
                <Icon size={14} className="text-[var(--accent)] shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask MAXLITH AI anything about projects, tasks, daily reports, or GitHub..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] shadow-sm"
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors shadow-md shadow-[var(--accent)]/20"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
