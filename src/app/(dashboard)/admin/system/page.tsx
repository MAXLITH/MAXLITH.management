"use client";

import React, { useState } from "react";
import { Settings, Database, Server, Activity, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockAuditLogs = [
  { id: "log-1", event: "USER_ROLE_UPDATED", user: "Varun Sharma", target: "David Chen", details: "Granted ENGINEERING_LEAD permissions", time: "15 mins ago", ip: "192.168.1.105" },
  { id: "log-2", event: "DATABASE_MIGRATION", user: "SYSTEM", target: "PostgreSQL", details: "Applied migration 20260922_init_maxlith_schema", time: "1 hour ago", ip: "localhost" },
  { id: "log-3", event: "LEAVE_APPROVED", user: "Board of Directors", target: "Varun Sharma", details: "Approved PTO for Oct 10-14", time: "3 hours ago", ip: "192.168.1.102" },
  { id: "log-4", event: "API_KEY_ROTATED", user: "Sarah Jenkins", target: "GitHub Webhook", details: "Rotated secret token for repository synchronization", time: "Yesterday", ip: "192.168.1.110" },
];

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Settings className="text-[var(--accent)]" size={26} />
            <span>System Health & Audit Logs</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Database connection status, server uptime, security event logs, and infrastructure telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Database Status</p>
            <p className="text-lg font-bold text-[var(--success)] mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>PostgreSQL Connected</span>
            </p>
          </div>
          <Database size={24} className="text-[var(--success)]" />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">System Uptime</p>
            <p className="text-lg font-bold text-[var(--text-primary)] mt-1">99.99% (99 days)</p>
          </div>
          <Server size={24} className="text-[var(--accent)]" />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">API Response Time</p>
            <p className="text-lg font-bold text-[var(--accent-hover)] mt-1">12 ms avg</p>
          </div>
          <Activity size={24} className="text-[var(--accent-hover)]" />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Memory Usage</p>
            <p className="text-lg font-bold text-[var(--warning)] mt-1">2.4 GB / 16 GB</p>
          </div>
          <Cpu size={24} className="text-[var(--warning)]" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
          Security & Administrative Audit Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Target / Scope</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-[var(--accent-hover)]">{log.event}</td>
                  <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">{log.user}</td>
                  <td className="px-4 py-3.5">{log.target}</td>
                  <td className="px-4 py-3.5 max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3.5 font-mono text-[var(--text-muted)]">{log.ip}</td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
