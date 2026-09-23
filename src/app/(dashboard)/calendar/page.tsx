"use client";

import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Video, CheckSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCalendarEvents = [
  { day: 23, title: "Daily Engineering Standup", time: "10:00 AM", type: "meeting" },
  { day: 23, title: "Quant Risk & VaR Sync", time: "02:00 PM", type: "meeting" },
  { day: 24, title: "Sarah Sick Leave Starts", time: "All Day", type: "leave" },
  { day: 25, title: "SIMD SIMD Vector Sprint Due", time: "05:00 PM", type: "milestone" },
  { day: 28, title: "Quant VaR Monte Carlo Model Review", time: "03:00 PM", type: "milestone" },
  { day: 30, title: "Q3 EOD Reports Summary Deadline", time: "06:00 PM", type: "task" },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("September 2026");

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Calendar className="text-[var(--accent)]" size={26} />
            <span>Company Schedule & Calendar</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Unified view of project milestones, scheduled syncs, sprint deadlines, and team leaves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] p-1">
            <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 text-xs font-bold text-[var(--text-primary)]">{currentMonth}</span>
            <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-[var(--bg-card)] border-b border-[var(--border)] text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-[var(--border)]">
          {days.map((day) => {
            const dayEvents = mockCalendarEvents.filter((e) => e.day === day);
            const isToday = day === 23;
            return (
              <div
                key={day}
                className={cn(
                  "min-h-[110px] p-2 space-y-1 hover:bg-[var(--bg-card-hover)] transition-colors",
                  isToday && "bg-[var(--accent-muted)]/20"
                )}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                      isToday ? "bg-[var(--accent)] text-white shadow-sm" : "text-[var(--text-muted)]"
                    )}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-1 rounded text-[9px] font-semibold truncate leading-tight",
                        evt.type === "meeting" && "bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--accent)]/30",
                        evt.type === "leave" && "bg-[var(--warning-muted)] text-[var(--warning)] border border-[var(--warning)]/30",
                        evt.type === "milestone" && "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30",
                        evt.type === "task" && "bg-[var(--success-muted)] text-[var(--success)] border border-[var(--success)]/30"
                      )}
                      title={`${evt.title} (${evt.time})`}
                    >
                      {evt.time} - {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
