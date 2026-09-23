"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Mail,
  Building2,
  Shield,
  Phone,
  CheckCircle2,
  Briefcase,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockEmployees = [
  {
    id: "usr-1",
    firstName: "Varun",
    lastName: "Sharma",
    email: "varun@maxlith.com",
    title: "Founder & Lead Architect",
    department: "AI & Quantitative Research",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    initials: "VS",
    phone: "+1 (555) 234-5678",
    projectsCount: 4,
  },
  {
    id: "usr-2",
    firstName: "David",
    lastName: "Chen",
    email: "david@maxlith.com",
    title: "Senior FPGA / C++ Hardware Engineer",
    department: "Hardware Acceleration",
    role: "ENGINEERING_LEAD",
    status: "ACTIVE",
    initials: "DC",
    phone: "+1 (555) 345-6789",
    projectsCount: 2,
  },
  {
    id: "usr-3",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena@maxlith.com",
    title: "Lead Quantitative Researcher",
    department: "AI & Quantitative Research",
    role: "SENIOR_QUANT",
    status: "ACTIVE",
    initials: "ER",
    phone: "+1 (555) 456-7890",
    projectsCount: 3,
  },
  {
    id: "usr-4",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah@maxlith.com",
    title: "Head of Infrastructure & Security",
    department: "DevOps & Infrastructure",
    role: "DEVOPS_LEAD",
    status: "ACTIVE",
    initials: "SJ",
    phone: "+1 (555) 567-8901",
    projectsCount: 3,
  },
  {
    id: "usr-5",
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus@maxlith.com",
    title: "Compliance & Regulatory Specialist",
    department: "Compliance & Legal",
    role: "COMPLIANCE_OFFICER",
    status: "ACTIVE",
    initials: "MV",
    phone: "+1 (555) 678-9012",
    projectsCount: 1,
  },
];

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const filteredEmployees = mockEmployees.filter((e) => {
    const matchesSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "ALL" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

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

        <Link
          href="/team/departments"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <Building2 size={18} className="text-[var(--accent)]" />
          <span>View Departments</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search team members by name or role..."
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
            <option value="AI & Quantitative Research">AI & Quant Research</option>
            <option value="Hardware Acceleration">Hardware Acceleration</option>
            <option value="DevOps & Infrastructure">DevOps & Infra</option>
            <option value="Compliance & Legal">Compliance & Legal</option>
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 hover:border-[var(--accent)]/50 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                  {emp.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-hover)] transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium truncate">{emp.title}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] uppercase">
                    {emp.role.replace(/_/g, " ")}
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
                  <span>{emp.projectsCount} Active Projects</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Active</span>
              </span>
              <a
                href={`mailto:${emp.email}`}
                className="text-[var(--accent)] hover:underline font-semibold text-xs"
              >
                Send Message
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
