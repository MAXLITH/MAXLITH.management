"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  MoreVertical,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const initialTasks = [
  {
    id: "task-1",
    title: "Optimize SIMD vector intrinsics for orderbook matching",
    project: "MAXLITH High-Frequency Alpha v4",
    assignee: "Varun Sharma",
    priority: "URGENT",
    status: "IN_PROGRESS",
    dueDate: "2026-09-25",
    tags: ["Rust", "AVX-512", "Trading Engine"],
  },
  {
    id: "task-2",
    title: "Implement unified NextAuth v5 session middleware",
    project: "Internal Management Portal",
    assignee: "Varun Sharma",
    priority: "HIGH",
    status: "COMPLETED",
    dueDate: "2026-09-22",
    tags: ["Next.js", "Auth", "Security"],
  },
  {
    id: "task-3",
    title: "Calibrate Portfolio VaR (Value-at-Risk) Monte Carlo simulations",
    project: "Quant Risk Analytics Engine",
    assignee: "Elena Rostova",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "2026-09-29",
    tags: ["Python", "Quant", "Monte Carlo"],
  },
  {
    id: "task-4",
    title: "Configure NASDAQ ITCH binary parser FPGA bitstream",
    project: "Market Data Feed Handler (FPGA)",
    assignee: "David Chen",
    priority: "URGENT",
    status: "IN_PROGRESS",
    dueDate: "2026-10-02",
    tags: ["Verilog", "FPGA", "Hardware"],
  },
  {
    id: "task-5",
    title: "Draft Q3 Financial & Engineering Operations Report",
    project: "Internal Management Portal",
    assignee: "Sarah Jenkins",
    priority: "MEDIUM",
    status: "IN_REVIEW",
    dueDate: "2026-09-30",
    tags: ["Operations", "Reporting"],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED" }
          : t
      )
    );
  };

  const columns = [
    { id: "TODO", title: "To Do", color: "border-t-[var(--text-muted)]" },
    { id: "IN_PROGRESS", title: "In Progress", color: "border-t-[var(--accent)]" },
    { id: "IN_REVIEW", title: "In Review", color: "border-t-[var(--warning)]" },
    { id: "COMPLETED", title: "Completed", color: "border-t-[var(--success)]" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <CheckSquare className="text-[var(--accent)]" size={26} />
            <span>Task Management</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track, assign, and manage daily engineering and operational tasks across all projects.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search tasks, projects, or assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--text-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Flag size={16} className="text-[var(--text-muted)]" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center border border-[var(--border)] rounded-lg bg-[var(--bg-card)] p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "kanban" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <Kanban size={16} />
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

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={cn(
                  "rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-3 flex flex-col border-t-4",
                  col.color
                )}
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3.5 space-y-3 shadow-sm hover:border-[var(--accent)]/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-semibold text-[var(--accent-hover)] bg-[var(--accent-muted)] px-2 py-0.5 rounded truncate">
                          {task.project}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0",
                            task.priority === "URGENT" && "bg-[var(--danger-muted)] text-[var(--danger)]",
                            task.priority === "HIGH" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                            task.priority === "MEDIUM" && "bg-[var(--accent-muted)] text-[var(--accent-hover)]",
                            task.priority === "LOW" && "bg-[var(--bg-card)] text-[var(--text-muted)]"
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition-colors leading-snug">
                        {task.title}
                      </h4>

                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-[var(--accent)]" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-[var(--text-muted)] italic">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Task Title</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleTaskStatus(t.id)}>
                        <CheckSquare
                          size={16}
                          className={t.status === "COMPLETED" ? "text-[var(--success)]" : "text-[var(--text-muted)] hover:text-[var(--accent)]"}
                        />
                      </button>
                      <span className={cn(t.status === "COMPLETED" && "line-through text-[var(--text-muted)]")}>
                        {t.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--accent-hover)] font-medium">{t.project}</td>
                  <td className="px-4 py-3.5">{t.assignee}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        t.priority === "URGENT" && "bg-[var(--danger-muted)] text-[var(--danger)]",
                        t.priority === "HIGH" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                        t.priority === "MEDIUM" && "bg-[var(--accent-muted)] text-[var(--accent-hover)]",
                        t.priority === "LOW" && "bg-[var(--bg-card)] text-[var(--text-muted)]"
                      )}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold">{t.status.replace("_", " ")}</td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{t.dueDate}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => toggleTaskStatus(t.id)} className="text-[var(--accent)] hover:underline font-medium">
                      Toggle State
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Create New Task
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Task Title</label>
                <input type="text" placeholder="e.g. Implement FPGA DMA queue buffer" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Project</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                    <option>MAXLITH High-Frequency Alpha v4</option>
                    <option>Internal Management Portal</option>
                    <option>Quant Risk Analytics Engine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold">
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
