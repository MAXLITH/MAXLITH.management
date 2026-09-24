"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  GitBranch,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, CardSkeleton } from "@/components/ui/loading-skeleton";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  repositoryUrl: string | null;
  techStack: string[];
  manager: { id: string; name: string; avatar: string | null } | null;
  members: { id: string; name: string; avatar: string | null; role: string }[];
  taskCount: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectPriority, setNewProjectPriority] = useState("MEDIUM");
  const [newProjectTech, setNewProjectTech] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      setCreateError("");
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDesc.trim(),
          priority: newProjectPriority,
          techStack: newProjectTech
            ? newProjectTech.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create project");
      }

      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectTech("");
      setShowCreateModal(false);
      fetchProjects();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter((p) => p.status === "ACTIVE").length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {loading ? "..." : projects.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)]">
            <FolderKanban size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Initiatives</p>
            <p className="text-2xl font-bold text-[var(--success)] mt-1">
              {loading ? "..." : activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center text-[var(--success)]">
            <Clock size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Completed</p>
            <p className="text-2xl font-bold text-[var(--accent-purple)] mt-1">
              {loading ? "..." : completedCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center text-[var(--accent-purple)]">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Planning</p>
            <p className="text-2xl font-bold text-[var(--warning)] mt-1">
              {loading ? "..." : projects.filter((p) => p.status === "PLANNING").length}
            </p>
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
            placeholder="Search projects..."
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
              <option value="PLANNING">Planning</option>
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

      {/* Projects List/Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Projects Found"
          description={
            searchTerm || statusFilter !== "ALL"
              ? "No projects match your search criteria or filter."
              : "No projects have been created yet. Click 'New Project' to create your first project."
          }
          actionLabel="New Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all duration-200 p-5 flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition-colors">
                    {project.name}
                  </h3>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0",
                      project.status === "ACTIVE" && "bg-[var(--success-muted)] text-[var(--success)]",
                      project.status === "PLANNING" && "bg-[var(--accent-muted)] text-[var(--accent)]",
                      project.status === "ON_HOLD" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                      project.status === "COMPLETED" && "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                    )}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {project.description || "No description provided."}
                </p>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Manager: {project.manager ? project.manager.name : "Unassigned"}
                </span>

                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {project.taskCount} Tasks
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                    <div>
                      <span className="font-semibold text-sm">{p.name}</span>
                      {p.description && (
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{p.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                        p.status === "ACTIVE" && "bg-[var(--success-muted)] text-[var(--success)]",
                        p.status === "PLANNING" && "bg-[var(--accent-muted)] text-[var(--accent)]",
                        p.status === "ON_HOLD" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                        p.status === "COMPLETED" && "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">{p.manager ? p.manager.name : "Unassigned"}</td>
                  <td className="px-4 py-3.5">{p.taskCount}</td>
                  <td className="px-4 py-3.5 text-right text-[var(--text-muted)]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProject}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Create New Project
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
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra-Low Latency Execution Engine"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Priority
                </label>
                <select
                  value={newProjectPriority}
                  onChange={(e) => setNewProjectPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rust, C++, Python, PostgreSQL"
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of project goals and architecture..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
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
                {creating ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
