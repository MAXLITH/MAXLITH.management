"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Folder,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockCategories = [
  { name: "Architecture & Core Engine", count: 12, icon: Folder, color: "text-[var(--accent)]" },
  { name: "Quantitative Trading Models", count: 8, icon: Folder, color: "text-[var(--accent-purple)]" },
  { name: "Hardware Acceleration (FPGA)", count: 5, icon: Folder, color: "text-[var(--warning)]" },
  { name: "Company Policy & HR", count: 6, icon: Folder, color: "text-[var(--success)]" },
];

const mockDocs = [
  {
    id: "doc-1",
    title: "MAXLITH Sub-Microsecond Execution Architecture Spec",
    category: "Architecture & Core Engine",
    author: "Varun Sharma",
    updatedAt: "2026-09-20",
    views: 142,
    readTime: "8 min read",
    tags: ["Rust", "SIMD", "Low-Latency"],
  },
  {
    id: "doc-2",
    title: "Value-at-Risk (VaR) Monte Carlo Math Formulation",
    category: "Quantitative Trading Models",
    author: "Elena Rostova",
    updatedAt: "2026-09-18",
    views: 89,
    readTime: "12 min read",
    tags: ["Math", "Risk", "PyTorch"],
  },
  {
    id: "doc-3",
    title: "NASDAQ ITCH 5.0 FPGA Parsing Protocol Guide",
    category: "Hardware Acceleration (FPGA)",
    author: "David Chen",
    updatedAt: "2026-09-15",
    views: 64,
    readTime: "15 min read",
    tags: ["Verilog", "PCIe", "FPGA"],
  },
  {
    id: "doc-4",
    title: "MAXLITH Engineering Onboarding & Code Review Standards",
    category: "Company Policy & HR",
    author: "Sarah Jenkins",
    updatedAt: "2026-09-01",
    views: 210,
    readTime: "5 min read",
    tags: ["Onboarding", "Git", "Standards"],
  },
];

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewDocModal, setShowNewDocModal] = useState(false);

  const filteredDocs = mockDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <BookOpen className="text-[var(--accent)]" size={26} />
            <span>Company Knowledge Base & Docs</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Centralized technical specifications, quantitative trading math, hardware protocols, and company guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowNewDocModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          <span>New Document</span>
        </button>
      </div>

      {/* Category Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-2 hover:border-[var(--accent)]/50 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon size={20} className={cat.color} />
                <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)]">
                  {cat.count} Docs
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-1">{cat.name}</h3>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search docs, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Documents Stream */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--accent)]/50 transition-all shadow-sm group"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[var(--accent-hover)] bg-[var(--accent-muted)] px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">&bull; {doc.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition-colors">
                {doc.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)] text-xs text-[var(--text-muted)] shrink-0">
              <div className="text-right">
                <p className="font-semibold text-[var(--text-primary)]">{doc.author}</p>
                <p className="text-[10px] mt-0.5">Updated {doc.updatedAt} &bull; {doc.views} views</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border)] font-semibold text-xs transition-colors">
                <FileText size={14} />
                <span>Read Doc</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Doc Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Create New Documentation Entry
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Document Title</label>
                <input type="text" placeholder="Title..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Category</label>
                <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                  <option>Architecture & Core Engine</option>
                  <option>Quantitative Trading Models</option>
                  <option>Hardware Acceleration (FPGA)</option>
                  <option>Company Policy & HR</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Content (Markdown supported)</label>
                <textarea rows={5} placeholder="Write technical specification..." className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowNewDocModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowNewDocModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
