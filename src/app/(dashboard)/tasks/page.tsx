"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  User,
  Calendar,
  Flag,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, CardSkeleton } from "@/components/ui/loading-skeleton";

interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: string | null;
  projectName: string | null;
  assignee: { id: string; name: string; avatar: string | null } | null;
  creatorName: string;
  deadline: string | null;
  tags: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/projects"),
      ]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data);
      }
      if (projectsRes.ok) {
        const pData = await projectsRes.json();
        setProjects(pData);
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setCreating(true);
      setCreateError("");
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          description: newTaskDesc.trim(),
          priority: newTaskPriority,
          projectId: newTaskProject || null,
          tags: newTaskTags
            ? newTaskTags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create task");
      }

      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskTags("");
      setShowCreateModal(false);
      fetchTasks();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const updateTaskStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update task status", err);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.projectName && t.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.assignee && t.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

      {/* Main Content View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks Found"
          description="There are no tasks in the database yet. Click 'Create Task' to add a new task."
          actionLabel="Create Task"
          onAction={() => setShowCreateModal(true)}
        />
      ) : viewMode === "kanban" ? (
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
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3.5 space-y-3 shadow-sm hover:border-[var(--accent)]/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {task.projectName && (
                          <span className="text-[10px] font-semibold text-[var(--accent-hover)] bg-[var(--accent-muted)] px-2 py-0.5 rounded truncate">
                            {task.projectName}
                          </span>
                        )}
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ml-auto",
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

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-[var(--accent)]" />
                          <span>{task.assignee ? task.assignee.name : "Unassigned"}</span>
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
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
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                    <span className={cn(t.status === "COMPLETED" && "line-through text-[var(--text-muted)]")}>
                      {t.title}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--accent-hover)] font-medium">
                    {t.projectName || "General"}
                  </td>
                  <td className="px-4 py-3.5">{t.assignee ? t.assignee.name : "Unassigned"}</td>
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
                  <td className="px-4 py-3.5 font-semibold">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                      className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)]"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() =>
                        updateTaskStatus(
                          t.id,
                          t.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED"
                        )
                      }
                      className="text-[var(--accent)] hover:underline font-medium"
                    >
                      {t.status === "COMPLETED" ? "Reopen" : "Mark Done"}
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
          <form
            onSubmit={handleCreateTask}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Create New Task
            </h2>

            {createError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{createError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement order routing API"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Project
                  </label>
                  <select
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                  >
                    <option value="">General / None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. API, Auth, Next.js"
                  value={newTaskTags}
                  onChange={(e) => setNewTaskTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Task specifications..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "Creating..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
