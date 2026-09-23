"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  UserCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockLeaveBalances = [
  { type: "Paid Vacation (PTO)", total: 18, used: 4, remaining: 14, color: "text-[var(--accent)]" },
  { type: "Sick Leave", total: 10, used: 2, remaining: 8, color: "text-[var(--warning)]" },
  { type: "Casual / Personal", total: 6, used: 1, remaining: 5, color: "text-[var(--accent-purple)]" },
  { type: "Emergency Leave", total: 5, used: 0, remaining: 5, color: "text-[var(--success)]" },
];

const mockRequests = [
  {
    id: "leave-101",
    employee: "Varun Sharma",
    type: "Paid Vacation",
    startDate: "2026-10-10",
    endDate: "2026-10-14",
    daysCount: 5,
    reason: "Attending International Algorithmic Trading Summit in Tokyo.",
    handover: "David Chen",
    status: "APPROVED",
    approvedBy: "Board of Directors",
  },
  {
    id: "leave-102",
    employee: "Sarah Jenkins",
    type: "Sick Leave",
    startDate: "2026-09-24",
    endDate: "2026-09-25",
    daysCount: 2,
    reason: "Medical procedure and recovery.",
    handover: "Elena Rostova",
    status: "PENDING",
    approvedBy: "Pending Manager Review",
  },
  {
    id: "leave-103",
    employee: "David Chen",
    type: "Casual Leave",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    daysCount: 1,
    reason: "Personal family commitment.",
    handover: "Varun Sharma",
    status: "APPROVED",
    approvedBy: "Varun Sharma",
  },
];

export default function LeavePage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <CalendarClock className="text-[var(--accent)]" size={26} />
            <span>Leave Application & PTO Portal</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Apply for leave, track annual PTO balance, and manage team out-of-office schedules.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockLeaveBalances.map((b) => (
          <div key={b.type} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-2 shadow-sm">
            <p className="text-xs text-[var(--text-muted)] font-medium">{b.type}</p>
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold ${b.color}`}>{b.remaining} Days</p>
              <span className="text-[11px] text-[var(--text-muted)]">Remaining</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
              <div className="h-full bg-[var(--accent)]" style={{ width: `${(b.remaining / b.total) * 100}%` }} />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] pt-1">{b.used} days used of {b.total} annual allowance</p>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
          Leave Applications & History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Handover Person</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {mockRequests.map((req) => (
                <tr key={req.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-[var(--text-primary)]">{req.employee}</td>
                  <td className="px-4 py-3.5 font-medium text-[var(--accent-hover)]">{req.type}</td>
                  <td className="px-4 py-3.5 font-mono text-[var(--text-muted)]">{req.startDate} to {req.endDate}</td>
                  <td className="px-4 py-3.5 font-bold text-[var(--text-primary)]">{req.daysCount} Day(s)</td>
                  <td className="px-4 py-3.5">{req.handover}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        req.status === "APPROVED" && "bg-[var(--success-muted)] text-[var(--success)]",
                        req.status === "PENDING" && "bg-[var(--warning-muted)] text-[var(--warning)]"
                      )}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Submit Leave Application
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Leave Category</label>
                <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                  <option>Paid Vacation (PTO)</option>
                  <option>Sick Leave</option>
                  <option>Casual / Personal</option>
                  <option>Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Handover Colleague</label>
                <input type="text" placeholder="e.g. David Chen" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Reason for Leave</label>
                <textarea rows={3} placeholder="Please provide brief details..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
