"use client";

import React from "react";
import Link from "next/link";
import { Building2, Users, FolderKanban, ArrowLeft, Shield } from "lucide-react";

const mockDepartments = [
  {
    id: "dept-1",
    name: "AI & Quantitative Research",
    code: "QUANT-AI",
    head: "Varun Sharma",
    headRole: "Lead Architect",
    headcount: 14,
    activeProjects: 3,
    budget: "$1.4M",
    description: "Machine learning, LLM fine-tuning for sentiment signals, and microsecond orderbook strategy execution.",
  },
  {
    id: "dept-2",
    name: "Hardware Acceleration",
    code: "HW-FPGA",
    head: "David Chen",
    headRole: "Engineering Lead",
    headcount: 8,
    activeProjects: 2,
    budget: "$950K",
    description: "FPGA kernel design, PCIe Gen4 DMA engine optimization, and custom ASIC research.",
  },
  {
    id: "dept-3",
    name: "DevOps & Infrastructure",
    code: "INFRA-OPS",
    head: "Sarah Jenkins",
    headRole: "Head of Infrastructure",
    headcount: 10,
    activeProjects: 4,
    budget: "$800K",
    description: "Multi-region AWS / bare-metal server orchestration, low-latency cross-connects, and Kubernetes clusters.",
  },
  {
    id: "dept-4",
    name: "Compliance & Operations",
    code: "COMP-OPS",
    head: "Marcus Vance",
    headRole: "Compliance Officer",
    headcount: 6,
    activeProjects: 1,
    budget: "$500K",
    description: "FINRA / SEC regulatory trade reporting, internal data governance, and audit trails.",
  },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/team"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Team Directory</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Building2 className="text-[var(--accent)]" size={26} />
            <span>Company Departments</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Department structure, department leads, headcounts, and project allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockDepartments.map((dept) => (
          <div
            key={dept.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 hover:border-[var(--accent)]/50 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent-hover)]">
                  {dept.code}
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{dept.name}</h2>
              </div>
              <span className="text-xs font-bold text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-2.5 py-1 rounded-full">
                {dept.budget} Budget
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{dept.description}</p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)] text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-card)]">
                <span className="text-[var(--text-muted)] block">Department Head</span>
                <strong className="text-[var(--text-primary)] font-bold">{dept.head}</strong>
                <span className="text-[10px] text-[var(--text-muted)] block">{dept.headRole}</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)]">
                <span className="text-[var(--text-muted)] block">Total Staff & Projects</span>
                <strong className="text-[var(--accent-hover)] font-bold">{dept.headcount} Members</strong>
                <span className="text-[10px] text-[var(--text-muted)] block">{dept.activeProjects} Active Initiatives</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
