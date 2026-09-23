"use client";

import React, { useState } from "react";
import {
  Video,
  Plus,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockMeetings = [
  {
    id: "m-1",
    title: "Daily Engineering & Algorithmic Standup",
    time: "10:00 AM - 10:30 AM",
    date: "2026-09-23 (Today)",
    host: "Varun Sharma",
    participantsCount: 8,
    link: "https://meet.google.com/maxlith-standup",
    status: "UPCOMING",
    agenda: "Sub-microsecond Rust engine benchmark review & FPGA DMA pipeline updates.",
  },
  {
    id: "m-2",
    title: "Quant Risk & VaR Strategy Sync",
    time: "02:00 PM - 03:00 PM",
    date: "2026-09-23 (Today)",
    host: "Elena Rostova",
    participantsCount: 5,
    link: "https://meet.google.com/maxlith-quant",
    status: "UPCOMING",
    agenda: "Monte Carlo VaR simulation calibration and GPU memory scaling.",
  },
  {
    id: "m-3",
    title: "MAXLITH Management Platform Demo & Feedback",
    time: "04:30 PM - 05:00 PM",
    date: "2026-09-24 (Tomorrow)",
    host: "Varun Sharma",
    participantsCount: 12,
    link: "https://meet.google.com/maxlith-demo",
    status: "SCHEDULED",
    agenda: "Walkthrough of new RBAC, task board, daily reports, and AI assistant.",
  },
];

export default function MeetingsPage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Video className="text-[var(--accent)]" size={26} />
            <span>Meetings & Technical Syncs</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Schedule, join, and archive engineering standups, design reviews, and company syncs.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Meetings Schedule Cards */}
      <div className="space-y-4">
        {mockMeetings.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 space-y-4 hover:border-[var(--accent)]/50 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--accent-muted)] text-[var(--accent-hover)]">
                    {m.status}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    <span>{m.date} &bull; {m.time}</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{m.title}</h2>
                <p className="text-xs text-[var(--text-secondary)]">{m.agenda}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <Video size={16} />
                  <span>Join Video Call</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
              <span>Hosted by <strong className="text-[var(--text-primary)]">{m.host}</strong></span>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-[var(--accent)]" />
                <span>{m.participantsCount} Invited Team Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Schedule New Meeting
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Meeting Title</label>
                <input type="text" placeholder="Title..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Time</label>
                  <input type="time" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Video Meeting Link (Google Meet / Zoom)</label>
                <input type="url" placeholder="https://meet.google.com/..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
