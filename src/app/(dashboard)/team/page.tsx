"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Mail,
  Building2,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";

interface TeamMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  status: string;
  department: string;
  roles: string[];
  taskCount: number;
  projectCount: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  useEffect(() => {
    async function loadTeam() {
      try {
        setLoading(true);
        const res = await fetch("/api/team");
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (err) {
        console.error("Failed to load team members", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "ALL" || m.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(members.map((m) => m.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Users className="text-[var(--accent)]" size={26} />
            <span>MAXLITH Team Directory</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Connect with engineers, quantitative researchers, and operations colleagues across the company.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[var(--text-muted)]" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] w-full sm:w-auto"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Team Members Found"
          description={
            searchTerm || deptFilter !== "ALL"
              ? "No team members match your current filter criteria."
              : "No team members are currently listed in the directory."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((emp) => {
            const initials = `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase() || "U";
            const roleName = emp.roles[0] || "EMPLOYEE";

            return (
              <div
                key={emp.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 hover:border-[var(--accent)]/50 transition-all shadow-sm flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-hover)] transition-colors">
                        {emp.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] uppercase">
                        {roleName.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] space-y-2 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-[var(--accent)] shrink-0" />
                      <span className="truncate">{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[var(--accent)] shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-[var(--accent)] shrink-0" />
                      <span>{emp.projectCount} Projects &bull; {emp.taskCount} Tasks</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>{emp.status}</span>
                  </span>
                  <a
                    href={`mailto:${emp.email}`}
                    className="text-[var(--accent)] hover:underline font-semibold text-xs"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
