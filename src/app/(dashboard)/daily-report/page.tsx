"use client";

import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  User,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockPastReports = [
  {
    id: "rep-101",
    date: "2026-09-22",
    author: "Varun Sharma",
    hoursLogged: 8.5,
    summary: "Scaffolded MAXLITH Management platform, created 30+ Prisma schema models, implemented NextAuth v5 authentication & full dark theme layout.",
    status: "SUBMITTED",
  },
  {
    id: "rep-102",
    date: "2026-09-21",
    author: "Varun Sharma",
    hoursLogged: 9.0,
    summary: "Optimized SIMD intrinsics in rust orderbook parser, reduced memory allocations by 45%.",
    status: "APPROVED",
  },
  {
    id: "rep-103",
    date: "2026-09-22",
    author: "Elena Rostova",
    hoursLogged: 8.0,
    summary: "Ran Monte Carlo simulations for portfolio VaR, integrated GPU tensor acceleration.",
    status: "APPROVED",
  },
  {
    id: "rep-104",
    date: "2026-09-22",
    author: "David Chen",
    hoursLogged: 7.5,
    summary: "Debugged FPGA PCIe Gen4 DMA burst overflow issue on Xilinx test bench.",
    status: "SUBMITTED",
  },
];

export default function DailyReportPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    hoursWorked: "8.0",
    accomplishments: "",
    plansTomorrow: "",
    blockers: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <FileText className="text-[var(--accent)]" size={26} />
            <span>Daily Work Report</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Submit your End-Of-Day (EOD) accomplishments, planned tasks, and blockers.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] p-1">
          <button
            onClick={() => setActiveTab("submit")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-colors",
              activeTab === "submit" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Submit EOD Report
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-colors",
              activeTab === "history" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Report History
          </button>
        </div>
      </div>

      {activeTab === "submit" ? (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">End-of-Day Submission</h2>
              <p className="text-xs text-[var(--text-muted)]">Keep the MAXLITH team synchronized with your progress.</p>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Report Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Hours Logged</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.hoursWorked}
                  onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
                  className="w-24 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                1. What did you accomplish today? <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Bullet points of tasks completed, PRs submitted, bugs resolved..."
                value={form.accomplishments}
                onChange={(e) => setForm({ ...form, accomplishments: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                2. What are your key targets for tomorrow?
              </label>
              <textarea
                rows={3}
                placeholder="Next steps, planned code commits, scheduled meetings..."
                value={form.plansTomorrow}
                onChange={(e) => setForm({ ...form, plansTomorrow: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                3. Are there any blockers or impediments? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention hardware dependencies, code reviews waiting, access requirements..."
                value={form.blockers}
                onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            {submitted ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--success)]">
                <CheckCircle2 size={16} />
                <span>EOD Report submitted successfully to Team Stream!</span>
              </div>
            ) : <div />}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20"
            >
              <Send size={16} />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      ) : (
        /* Report History */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {mockPastReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-mono font-medium text-[var(--text-primary)]">{rep.date}</td>
                  <td className="px-4 py-3.5 font-medium">{rep.author}</td>
                  <td className="px-4 py-3.5 font-bold text-[var(--accent-hover)]">{rep.hoursLogged}h</td>
                  <td className="px-4 py-3.5 max-w-md truncate">{rep.summary}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        rep.status === "APPROVED" && "bg-[var(--success-muted)] text-[var(--success)]",
                        rep.status === "SUBMITTED" && "bg-[var(--accent-muted)] text-[var(--accent-hover)]"
                      )}
                    >
                      {rep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
