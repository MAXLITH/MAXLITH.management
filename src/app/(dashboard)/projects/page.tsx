"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  GitBranch,
  Calendar,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockProjects = [
  {
    id: "proj-1",
    name: "MAXLITH High-Frequency Alpha v4",
    code: "HFA-V4",
    description: "Ultra-low latency algorithmic trading engine with Sub-microsecond execution pipeline and multi-exchange routing.",
    status: "ACTIVE",
    priority: "HIGH",
    progress: 78,
    owner: { name: "Varun Sharma", avatar: null, initials: "VS" },
    membersCount: 8,
    tasksCompleted: 42,
    tasksTotal: 54,
    dueDate: "2026-10-15",
    category: "AI & Algorithmic Trading",
    githubRepo: "maxlith/hfa-v4-core",
  },
  {
    id: "proj-2",
    name: "Internal Management Portal",
    code: "MGMT-MAX",
    description: "Unified company management workspace integrating tasks, leave, announcements, GitHub, docs, and AI operations.",
    status: "ACTIVE",
    priority: "HIGH",
    progress: 65,
    owner: { name: "Varun Sharma", avatar: null, initials: "VS" },
    membersCount: 5,
    tasksCompleted: 26,
    tasksTotal: 40,
    dueDate: "2026-10-01",
    category: "Internal Infrastructure",
    githubRepo: "maxlith/management.maxlith",
  },
  {
    id: "proj-3",
    name: "Quant Risk Analytics Engine",
    code: "QRA-ENGINE",
    description: "Real-time portfolio exposure calculation, Value-at-Risk (VaR) simulation, and dynamic margin optimization.",
    status: "ACTIVE",
    priority: "MEDIUM",
    progress: 45,
    owner: { name: "Elena Rostova", avatar: null, initials: "ER" },
    membersCount: 6,
    tasksCompleted: 18,
    tasksTotal: 40,
    dueDate: "2026-11-20",
    category: "Risk & Quantitative Science",
    githubRepo: "maxlith/risk-analytics",
  },
  {
    id: "proj-4",
    name: "Market Data Feed Handler (FPGA)",
    code: "FPGA-FEED",
    description: "Hardware accelerated orderbook parser for NASDAQ ITCH and CME MDP 3.0 protocol streams.",
    status: "ON_HOLD",
    priority: "URGENT",
    progress: 30,
    owner: { name: "David Chen", avatar: null, initials: "DC" },
    membersCount: 4,
    tasksCompleted: 12,
    tasksTotal: 40,
    dueDate: "2026-12-05",
    category: "Hardware Acceleration",
    githubRepo: "maxlith/fpga-feed-handler",
  },
  {
    id: "proj-5",
    name: "Automated Compliance & Audit System",
    code: "COMP-AUDIT",
    description: "Automated regulatory reporting and trade reconstruction for SEC & FINRA compliance audits.",
    status: "COMPLETED",
    priority: "LOW",
    progress: 100,
    owner: { name: "Sarah Jenkins", avatar: null, initials: "SJ" },
    membersCount: 3,
    tasksCompleted: 35,
    tasksTotal: 35,
    dueDate: "2026-08-30",
    category: "Compliance & Ops",
    githubRepo: "maxlith/compliance-suite",
  },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockProjects.filter((p) => p.status === "ACTIVE").length;
  const completedCount = mockProjects.filter((p) => p.status === "COMPLETED").length;
  const avgProgress = Math.round(
    mockProjects.reduce((acc, p) => acc + p.progress, 0) / mockProjects.length
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <FolderKanban className="text-[var(--accent)]" size={26} />
            <span>Company Projects</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all MAXLITH engineering, trading AI, and infrastructure initiatives.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Total Projects</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mockProjects.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)]">
            <FolderKanban size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Initiatives</p>
            <p className="text-2xl font-bold text-[var(--success)] mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center text-[var(--success)]">
            <Clock size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Completed</p>
            <p className="text-2xl font-bold text-[var(--accent-purple)] mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center text-[var(--accent-purple)]">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Average Completion</p>
            <p className="text-2xl font-bold text-[var(--warning)] mt-1">{avgProgress}%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--warning-muted)] flex items-center justify-center text-[var(--warning)]">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects by name, code, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--text-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center border border-[var(--border)] rounded-lg bg-[var(--bg-card)] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all duration-200 p-5 flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent-hover)]">
                      {project.code}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition-colors mt-2">
                      <Link href={`/projects/${project.id}`}>{project.name}</Link>
                    </h3>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                      project.status === "ACTIVE" && "bg-[var(--success-muted)] text-[var(--success)]",
                      project.status === "ON_HOLD" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                      project.status === "COMPLETED" && "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                    )}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Category & Repo */}
                <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                  <span className="bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)]">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <GitBranch size={12} className="text-[var(--accent)]" />
                    <span className="truncate max-w-[120px]">{project.githubRepo}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[var(--text-muted)]">Tasks: {project.tasksCompleted}/{project.tasksTotal}</span>
                    <span className="text-[var(--text-primary)] font-bold">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center text-[var(--accent-purple)] text-[10px] font-bold">
                    {project.owner.initials}
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)]">{project.owner.name}</span>
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium text-xs group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Open Workspace</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                    <div>
                      <Link href={`/projects/${p.id}`} className="hover:text-[var(--accent)] font-semibold text-sm">
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono">{p.code} &bull; {p.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                        p.status === "ACTIVE" && "bg-[var(--success-muted)] text-[var(--success)]",
                        p.status === "ON_HOLD" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                        p.status === "COMPLETED" && "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                        <div className="h-full bg-[var(--accent)]" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-[var(--text-primary)]">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{p.owner.name}</td>
                  <td className="px-4 py-3.5">{p.tasksCompleted} / {p.tasksTotal}</td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{p.dueDate}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link href={`/projects/${p.id}`} className="text-[var(--accent)] hover:underline font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Creating New Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Create New Project
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Project Name</label>
                <input type="text" placeholder="e.g. Ultra-Low Latency Gateway" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Project Code</label>
                  <input type="text" placeholder="ULL-GW" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] uppercase font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Category</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                    <option>AI Trading</option>
                    <option>Risk Engine</option>
                    <option>Infrastructure</option>
                    <option>Compliance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Description</label>
                <textarea rows={3} placeholder="Brief objective of this project..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold">
                Create Initiative
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
