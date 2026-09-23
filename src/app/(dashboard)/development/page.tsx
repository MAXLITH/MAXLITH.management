"use client";

import React from "react";
import Link from "next/link";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockRepos = [
  {
    name: "maxlith/hfa-v4-core",
    description: "High-Frequency Alpha v4 Rust engine with ultra-low latency execution and SIMD processing.",
    stars: 48,
    forks: 12,
    openPulls: 3,
    language: "Rust",
    langColor: "bg-amber-500",
    lastCommit: "20 minutes ago",
    status: "PASSING",
  },
  {
    name: "maxlith/management.maxlith",
    description: "Next.js 15 internal management portal for MAXLITH employees & operations.",
    stars: 15,
    forks: 4,
    openPulls: 2,
    language: "TypeScript",
    langColor: "bg-blue-500",
    lastCommit: "1 hour ago",
    status: "PASSING",
  },
  {
    name: "maxlith/fpga-feed-handler",
    description: "Verilog / SystemVerilog NASDAQ ITCH and CME MDP orderbook hardware parser.",
    stars: 32,
    forks: 8,
    openPulls: 1,
    language: "Verilog",
    langColor: "bg-purple-500",
    lastCommit: "Yesterday",
    status: "BUILDING",
  },
  {
    name: "maxlith/risk-analytics",
    description: "Quantitative portfolio risk calculation, VaR, and stress testing models.",
    stars: 20,
    forks: 5,
    openPulls: 0,
    language: "Python",
    langColor: "bg-emerald-500",
    lastCommit: "3 days ago",
    status: "PASSING",
  },
];

const mockCommits = [
  {
    hash: "8f3a1b2",
    repo: "maxlith/hfa-v4-core",
    author: "Varun Sharma",
    message: "feat(simd): add AVX-512 intrinsic vector alignment for L2 orderbook parser",
    time: "20 minutes ago",
    branch: "main",
  },
  {
    hash: "c4d29e1",
    repo: "maxlith/management.maxlith",
    author: "Varun Sharma",
    message: "feat(tasks): implement Kanban board view and creation modal",
    time: "45 minutes ago",
    branch: "main",
  },
  {
    hash: "7e9b0a3",
    repo: "maxlith/fpga-feed-handler",
    author: "David Chen",
    message: "fix(dma): resolve burst length overflow in PCIe Gen4 interface",
    time: "3 hours ago",
    branch: "feat/pcie-dma",
  },
  {
    hash: "1a2b3c4",
    repo: "maxlith/risk-analytics",
    author: "Elena Rostova",
    message: "refactor(monte-carlo): vectorize covariance matrix inversion in PyTorch",
    time: "Yesterday",
    branch: "main",
  },
];

export default function DevelopmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <GitBranch className="text-[var(--accent)]" size={26} />
            <span>GitHub Development Hub</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time GitHub organization activity, CI/CD pipelines, and pull request tracking.
          </p>
        </div>

        <Link
          href="/development/pulls"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <GitPullRequest size={18} />
          <span>View Pull Requests (6)</span>
        </Link>
      </div>

      {/* Repositories Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text-primary)]">Core Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRepos.map((repo) => (
            <div
              key={repo.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 space-y-3 hover:border-[var(--accent)]/50 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-[var(--accent)]" />
                  <a
                    href={`https://github.com/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors font-mono"
                  >
                    {repo.name}
                  </a>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                    repo.status === "PASSING" && "bg-[var(--success-muted)] text-[var(--success)]",
                    repo.status === "BUILDING" && "bg-[var(--warning-muted)] text-[var(--warning)]"
                  )}
                >
                  {repo.status === "PASSING" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  <span>{repo.status}</span>
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {repo.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${repo.langColor}`} />
                    <span className="font-medium text-[var(--text-secondary)]">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitPullRequest size={14} className="text-[var(--accent)]" />
                    <span>{repo.openPulls} PRs</span>
                  </div>
                </div>

                <span>Updated {repo.lastCommit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Commit Stream */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
          <GitCommit className="text-[var(--accent)]" size={18} />
          <span>Recent Organization Commits</span>
        </h2>

        <div className="space-y-3">
          {mockCommits.map((c) => (
            <div
              key={c.hash}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs hover:border-[var(--accent)]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-[var(--accent-muted)] font-mono text-[11px] font-bold text-[var(--accent-hover)] shrink-0">
                  {c.hash}
                </span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{c.message}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    <span className="font-mono text-[var(--text-secondary)]">{c.repo}</span> &bull; Author: {c.author} &bull; Branch: <code>{c.branch}</code>
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] shrink-0">{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
