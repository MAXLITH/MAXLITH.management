"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertCircle,
  GitBranch,
  ArrowLeft,
  User,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockPulls = [
  {
    id: "pr-101",
    number: 42,
    title: "feat(simd): AVX-512 orderbook matching acceleration",
    repo: "maxlith/hfa-v4-core",
    author: "Varun Sharma",
    branch: "feat/avx512-simd",
    target: "main",
    additions: 412,
    deletions: 28,
    status: "APPROVED",
    ciStatus: "SUCCESS",
    comments: 5,
    updatedAt: "30 minutes ago",
  },
  {
    id: "pr-102",
    number: 18,
    title: "feat(auth): unified NextAuth v5 session handler & RBAC guard",
    repo: "maxlith/management.maxlith",
    author: "Varun Sharma",
    branch: "feat/nextauth-v5",
    target: "main",
    additions: 890,
    deletions: 140,
    status: "CHANGES_REQUESTED",
    ciStatus: "SUCCESS",
    comments: 8,
    updatedAt: "2 hours ago",
  },
  {
    id: "pr-103",
    number: 9,
    title: "fix(pcie): resolve DMA burst length overrun on Xilinx UltraScale+",
    repo: "maxlith/fpga-feed-handler",
    author: "David Chen",
    branch: "fix/pcie-dma-burst",
    target: "main",
    additions: 64,
    deletions: 12,
    status: "REVIEW_NEEDED",
    ciStatus: "RUNNING",
    comments: 2,
    updatedAt: "3 hours ago",
  },
  {
    id: "pr-104",
    number: 24,
    title: "refactor(quant): PyTorch GPU batch matrix inversion for VaR",
    repo: "maxlith/risk-analytics",
    author: "Elena Rostova",
    branch: "refactor/pytorch-gpu-var",
    target: "main",
    additions: 230,
    deletions: 95,
    status: "APPROVED",
    ciStatus: "SUCCESS",
    comments: 4,
    updatedAt: "Yesterday",
  },
];

export default function PullRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPulls = mockPulls.filter(
    (pr) =>
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/development"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Development Overview</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <GitPullRequest className="text-[var(--accent)]" size={26} />
            <span>Pull Requests</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review code changes, CI pipeline checks, and code audit approvals across all repositories.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search PRs by title, repo, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* PRs List */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {filteredPulls.map((pr) => (
            <div
              key={pr.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[var(--accent-hover)] font-bold">
                    #{pr.number}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)]">
                    {pr.repo}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors">
                    {pr.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
                  <div className="flex items-center gap-1.5">
                    <GitBranch size={14} className="text-[var(--accent)]" />
                    <span>{pr.branch} &rarr; {pr.target}</span>
                  </div>
                  <div>Author: <span className="text-[var(--text-primary)]">{pr.author}</span></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[var(--success)] font-bold">+{pr.additions}</span>
                    <span className="text-[var(--danger)] font-bold">-{pr.deletions}</span>
                  </div>
                </div>
              </div>

              {/* Status & Review badges */}
              <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      pr.status === "APPROVED" && "bg-[var(--success-muted)] text-[var(--success)]",
                      pr.status === "CHANGES_REQUESTED" && "bg-[var(--danger-muted)] text-[var(--danger)]",
                      pr.status === "REVIEW_NEEDED" && "bg-[var(--warning-muted)] text-[var(--warning)]"
                    )}
                  >
                    {pr.status.replace("_", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <MessageSquare size={13} />
                    <span>{pr.comments}</span>
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">{pr.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
