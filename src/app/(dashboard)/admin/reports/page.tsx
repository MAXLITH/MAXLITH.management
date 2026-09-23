"use client";

import React from "react";
import { BarChart3, TrendingUp, Download, CheckCircle2, Clock, Users, Building2 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <BarChart3 className="text-[var(--accent)]" size={26} />
            <span>Executive Operations & Performance Reports</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Company-wide task velocity, employee attendance metrics, and project health analytics.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0">
          <Download size={18} />
          <span>Export Audit PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">Sprint Velocity</p>
          <p className="text-2xl font-bold text-[var(--success)] mt-1">+24% MoM</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">168 Story points completed</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">EOD Report Compliance</p>
          <p className="text-2xl font-bold text-[var(--accent-hover)] mt-1">98.5%</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">On-time daily submissions</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">Build Pipeline Health</p>
          <p className="text-2xl font-bold text-[var(--accent-purple)] mt-1">99.2%</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">CI/CD passing builds</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">Active Headcount</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">38 Staff</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Across 4 departments</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
          Departmental Velocity Breakdown
        </h2>
        <div className="space-y-4">
          {[
            { name: "AI & Quantitative Research", progress: 85, color: "bg-[var(--accent)]" },
            { name: "Hardware Acceleration (FPGA)", progress: 68, color: "bg-[var(--warning)]" },
            { name: "DevOps & Infrastructure", progress: 92, color: "bg-[var(--success)]" },
            { name: "Compliance & Legal", progress: 100, color: "bg-[var(--accent-purple)]" },
          ].map((d) => (
            <div key={d.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--text-primary)]">{d.name}</span>
                <span className="text-[var(--text-secondary)]">{d.progress}% Milestone Target</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-card)] overflow-hidden">
                <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
