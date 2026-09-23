"use client";

import React, { useState } from "react";
import {
  Upload,
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  Download,
  Trash2,
  HardDrive,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockFiles = [
  {
    id: "f-1",
    name: "MAXLITH_Q3_Financial_Performance.pdf",
    size: "4.2 MB",
    type: "pdf",
    uploadedBy: "Sarah Jenkins",
    date: "2026-09-21",
    category: "Reports & Datasets",
  },
  {
    id: "f-2",
    name: "fpga_nasdaq_itch_bitstream_v4.2.bit",
    size: "18.5 MB",
    type: "code",
    uploadedBy: "David Chen",
    date: "2026-09-19",
    category: "Code Assets",
  },
  {
    id: "f-3",
    name: "var_monte_carlo_test_matrix_2026.csv",
    size: "124 MB",
    type: "spreadsheet",
    uploadedBy: "Elena Rostova",
    date: "2026-09-17",
    category: "Reports & Datasets",
  },
  {
    id: "f-4",
    name: "MAXLITH_Non_Disclosure_Agreement_Template.docx",
    size: "850 KB",
    type: "doc",
    uploadedBy: "Varun Sharma",
    date: "2026-09-10",
    category: "Legal & HR",
  },
];

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedMsg, setUploadedMsg] = useState(false);

  const filteredFiles = mockFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulatedUpload = () => {
    setUploadedMsg(true);
    setTimeout(() => setUploadedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Upload className="text-[var(--accent)]" size={26} />
            <span>Files & Storage Hub</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Secure company asset storage for FPGA bitstreams, financial audit reports, and datasets.
          </p>
        </div>
      </div>

      {/* Storage Usage Overview */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0">
            <HardDrive size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Organization Cloud Vault</h3>
            <p className="text-xs text-[var(--text-muted)]">Encrypted end-to-end with AWS S3 & Hardware Security Modules.</p>
          </div>
        </div>

        <div className="space-y-1.5 w-full md:w-64">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[var(--text-secondary)]">Storage Used</span>
            <span className="text-[var(--accent-hover)]">147.5 GB / 1,000 GB</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] rounded-full" style={{ width: "14.7%" }} />
          </div>
        </div>
      </div>

      {/* Upload Drag Drop Area */}
      <div
        onClick={handleSimulatedUpload}
        className={cn(
          "rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center cursor-pointer hover:border-[var(--accent)] transition-all space-y-2",
          dragActive && "border-[var(--accent)] bg-[var(--accent-muted)]/10"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] mx-auto">
          <Upload size={20} />
        </div>
        <p className="text-sm font-bold text-[var(--text-primary)]">
          Click or Drag & Drop files here to upload
        </p>
        <p className="text-xs text-[var(--text-muted)]">Supports FPGA bitstreams (.bit), Datasets (.csv, .parquet), Documents (.pdf, .docx) up to 5GB per file</p>
        {uploadedMsg && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--success)] pt-2">
            <CheckCircle2 size={16} />
            <span>File uploaded and encrypted in vault!</span>
          </div>
        )}
      </div>

      {/* Files Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Upload Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                  <div className="flex items-center gap-2.5">
                    {file.type === "pdf" && <FileText size={18} className="text-rose-400 shrink-0" />}
                    {file.type === "code" && <FileCode size={18} className="text-amber-400 shrink-0" />}
                    {file.type === "spreadsheet" && <FileSpreadsheet size={18} className="text-emerald-400 shrink-0" />}
                    {file.type === "doc" && <File size={18} className="text-blue-400 shrink-0" />}
                    <span className="font-mono">{file.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">{file.category}</td>
                <td className="px-4 py-3.5 font-mono text-[var(--text-muted)]">{file.size}</td>
                <td className="px-4 py-3.5">{file.uploadedBy}</td>
                <td className="px-4 py-3.5 text-[var(--text-muted)]">{file.date}</td>
                <td className="px-4 py-3.5 text-right">
                  <button className="p-1.5 rounded text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors" title="Download File">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
