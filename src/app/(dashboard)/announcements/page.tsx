"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Pin,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockAnnouncements = [
  {
    id: "ann-1",
    title: "MAXLITH Q4 Engineering & Alpha Trading Targets Released",
    category: "EXECUTIVE",
    priority: "URGENT",
    isPinned: true,
    author: "Varun Sharma",
    date: "2026-09-22",
    content: "We are excited to unveil our Q4 Roadmap focusing on ultra-low latency execution on Rust core engine, hardware FPGA orderbook integration, and unified team management portal launch.",
  },
  {
    id: "ann-2",
    title: "Scheduled Maintenance: Core Risk Server Upgrades",
    category: "INFRASTRUCTURE",
    priority: "HIGH",
    isPinned: fontBoolean(true),
    author: "Sarah Jenkins",
    date: "2026-09-20",
    content: "System maintenance is scheduled for Sunday at 02:00 UTC. Secondary backup clusters will handle live trading feeds without interruption.",
  },
  {
    id: "ann-3",
    title: "Annual Health Insurance & Benefits Enrollment Open",
    category: "HR",
    priority: "MEDIUM",
    isPinned: false,
    author: "Elena Rostova",
    date: "2026-09-15",
    content: "Please review and submit your updated health benefit preferences before October 15th via the portal.",
  },
];

function fontBoolean(val: boolean) {
  return val;
}

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showPublishModal, setShowPublishModal] = useState(false);

  const filteredAnnouncements = mockAnnouncements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Megaphone className="text-[var(--accent)]" size={26} />
            <span>Company Announcements</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Official company news, executive updates, release notes, and policy notices.
          </p>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] w-full sm:w-auto"
          >
            <option value="ALL">All Categories</option>
            <option value="EXECUTIVE">Executive</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="HR">HR & Culture</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={cn(
              "rounded-xl border p-6 space-y-3 bg-[var(--bg-secondary)] transition-all shadow-sm relative overflow-hidden",
              ann.isPinned ? "border-[var(--accent)]/60 bg-gradient-to-r from-[var(--accent-muted)]/10 to-[var(--bg-secondary)]" : "border-[var(--border)]"
            )}
          >
            {ann.isPinned && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--accent-hover)] uppercase tracking-wider mb-1">
                <Pin size={12} className="rotate-45" />
                <span>Pinned Announcement</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{ann.title}</h2>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 w-fit",
                  ann.priority === "URGENT" && "bg-[var(--danger-muted)] text-[var(--danger)]",
                  ann.priority === "HIGH" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                  ann.priority === "MEDIUM" && "bg-[var(--accent-muted)] text-[var(--accent-hover)]"
                )}
              >
                {ann.category}
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ann.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <User size={14} className="text-[var(--accent)]" />
                <span>Published by {ann.author}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Calendar size={14} />
                <span>{ann.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Publish Company Announcement
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Title</label>
                <input type="text" placeholder="Notice title..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Category</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                    <option>EXECUTIVE</option>
                    <option>INFRASTRUCTURE</option>
                    <option>HR</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                    <option>URGENT</option>
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Announcement Body</label>
                <textarea rows={4} placeholder="Full content..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
