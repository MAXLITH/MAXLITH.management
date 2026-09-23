"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FolderKanban,
  CheckSquare,
  GitBranch,
  FileText,
  Users,
  Clock,
  Plus,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id || "proj-1";

  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "github" | "members" | "docs">("overview");

  const project = {
    id: projectId,
    name: "MAXLITH High-Frequency Alpha v4",
    code: "HFA-V4",
    description: "Sub-microsecond algorithmic execution model designed for high-throughput market making across DEX & CEX orderbooks.",
    status: "ACTIVE",
    priority: "HIGH",
    progress: 78,
    owner: { name: "Varun Sharma", role: "Head of AI & Quantitative Research", email: "varun@maxlith.com" },
    startDate: "2026-06-01",
    dueDate: "2026-10-15",
    repo: "maxlith/hfa-v4-core",
    tasks: [
      { id: "t-101", title: "Implement Rust L2 Orderbook Aggregator", assignee: "David Chen", priority: "HIGH", status: "COMPLETED", dueDate: "2026-09-15" },
      { id: "t-102", title: "Optimize Memory Alignment in SIMD Vector Processing", assignee: "Varun Sharma", priority: "URGENT", status: "IN_PROGRESS", dueDate: "2026-09-25" },
      { id: "t-103", title: "Backtest Alpha Model against NASDAQ Historical Data", assignee: "Elena Rostova", priority: "MEDIUM", status: "IN_PROGRESS", dueDate: "2026-09-28" },
      { id: "t-104", title: "Integrate WebSocket Reconnection Circuit Breaker", assignee: "Sarah Jenkins", priority: "LOW", status: "TODO", dueDate: "2026-10-05" },
    ],
    members: [
      { name: "Varun Sharma", role: "Lead Architect", avatar: null, initials: "VS" },
      { name: "David Chen", role: "C++/Rust Engineer", avatar: null, initials: "DC" },
      { name: "Elena Rostova", role: "Quant Researcher", avatar: null, initials: "ER" },
      { name: "Sarah Jenkins", role: "DevOps / Infra", avatar: null, initials: "SJ" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to All Projects</span>
      </Link>

      {/* Project Workspace Header */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] p-6 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--accent)]/30">
                {project.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-muted)] text-[var(--success)] uppercase">
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] pt-1">{project.name}</h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-3xl leading-relaxed">{project.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://github.com/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors"
            >
              <GitBranch size={16} className="text-[var(--accent)]" />
              <span>{project.repo}</span>
              <ExternalLink size={12} className="text-[var(--text-muted)]" />
            </a>
          </div>
        </div>

        {/* Workspace Nav Tabs */}
        <div className="flex border-b border-[var(--border)] pt-4 gap-6 text-sm font-medium">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "tasks", label: `Tasks (${project.tasks.length})`, icon: CheckSquare },
            { id: "github", label: "GitHub & Commits", icon: GitBranch },
            { id: "members", label: `Team (${project.members.length})`, icon: Users },
            { id: "docs", label: "Documentation", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 pb-3 border-b-2 transition-colors",
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent-hover)] font-semibold"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Project Milestone Progress
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text-secondary)]">Overall Completion Rate</span>
                  <span className="text-[var(--accent-hover)]">{project.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border)] text-center">
                <div className="p-3 rounded-lg bg-[var(--bg-card)]">
                  <p className="text-xs text-[var(--text-muted)]">Completed Tasks</p>
                  <p className="text-lg font-bold text-[var(--success)] mt-1">1/4</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)]">
                  <p className="text-xs text-[var(--text-muted)]">In Progress</p>
                  <p className="text-lg font-bold text-[var(--warning)] mt-1">2/4</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)]">
                  <p className="text-xs text-[var(--text-muted)]">Pending Review</p>
                  <p className="text-lg font-bold text-[var(--accent)] mt-1">1/4</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Workspace Stream
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center text-[var(--accent-purple)] font-bold shrink-0">
                    DC
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">David Chen marked <span className="font-mono text-[var(--accent-hover)]">Implement Rust L2 Orderbook Aggregator</span> as Completed.</p>
                    <span className="text-[var(--text-muted)]">2 hours ago</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold shrink-0">
                    VS
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">Varun Sharma committed <code>feat(simd): add AVX-512 intrinsic vector alignment</code> to <code>main</code> branch.</p>
                    <span className="text-[var(--text-muted)]">Yesterday at 18:20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-3 shadow-sm text-xs">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
                Project Key Details
              </h3>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Project Lead:</span>
                <span className="font-semibold text-[var(--text-primary)]">{project.owner.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Target Release:</span>
                <span className="font-semibold text-[var(--text-primary)]">{project.dueDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Priority Level:</span>
                <span className="font-bold text-[var(--danger)] uppercase">{project.priority}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Repository:</span>
                <span className="font-mono text-[var(--accent)]">{project.repo}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Tasks in Workspace</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold">
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-2">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs">
                <div className="flex items-center gap-3">
                  <CheckSquare size={16} className={task.status === "COMPLETED" ? "text-[var(--success)]" : "text-[var(--text-muted)]"} />
                  <div>
                    <p className={cn("font-medium text-[var(--text-primary)]", task.status === "COMPLETED" && "line-through text-[var(--text-muted)]")}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">Assigned to: {task.assignee} &bull; Due: {task.dueDate}</p>
                  </div>
                </div>

                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", task.status === "COMPLETED" ? "bg-[var(--success-muted)] text-[var(--success)]" : "bg-[var(--warning-muted)] text-[var(--warning)]")}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "github" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Connected Repository Stats ({project.repo})
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Open Pull Requests</p>
              <p className="text-xl font-bold text-[var(--accent)] mt-1">3</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Commits (This Week)</p>
              <p className="text-xl font-bold text-[var(--success)] mt-1">28</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Build Health</p>
              <p className="text-xl font-bold text-[var(--success)] mt-1">Passing (100%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
