"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Pin,
  Plus,
  Search,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/loading-skeleton";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: string;
  isPinned: boolean;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState("NORMAL");
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setPublishing(true);
      setPublishError("");
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          priority: newPriority,
          isPinned: newIsPinned,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to publish announcement");
      }

      setNewTitle("");
      setNewContent("");
      setNewIsPinned(false);
      setShowPublishModal(false);
      fetchAnnouncements();
    } catch (err: any) {
      setPublishError(err.message || "Failed to publish announcement");
    } finally {
      setPublishing(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] w-full sm:w-auto"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No Announcements Found"
          description={
            searchTerm || priorityFilter !== "ALL"
              ? "No announcements match your search term or priority filter."
              : "No company announcements have been published yet."
          }
          actionLabel="Publish Notice"
          onAction={() => setShowPublishModal(true)}
        />
      ) : (
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
                    ann.priority === "NORMAL" && "bg-[var(--accent-muted)] text-[var(--accent-hover)]",
                    ann.priority === "LOW" && "bg-[var(--bg-card)] text-[var(--text-muted)]"
                  )}
                >
                  {ann.priority}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-[var(--accent)]" />
                  <span>Published by {ann.authorName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar size={14} />
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePublish}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Publish Company Announcement
            </h2>

            {publishError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{publishError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Notice title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="rounded bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)]"
                    />
                    <span>Pin to top</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Announcement Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full announcement content..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={publishing}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold disabled:opacity-50"
              >
                {publishing ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
