"use client";

import React, { useState } from "react";
import {
  Shield,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  MoreVertical,
  Mail,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "usr-1", name: "Varun Sharma", email: "varun@maxlith.com", role: "SUPER_ADMIN", department: "AI & Quant Research", status: "ACTIVE", lastLogin: "10 mins ago" },
  { id: "usr-2", name: "David Chen", email: "david@maxlith.com", role: "ENGINEERING_LEAD", department: "Hardware Acceleration", status: "ACTIVE", lastLogin: "1 hour ago" },
  { id: "usr-3", name: "Elena Rostova", email: "elena@maxlith.com", role: "SENIOR_QUANT", department: "AI & Quant Research", status: "ACTIVE", lastLogin: "3 hours ago" },
  { id: "usr-4", name: "Sarah Jenkins", email: "sarah@maxlith.com", role: "DEVOPS_LEAD", department: "DevOps & Infrastructure", status: "ACTIVE", lastLogin: "Yesterday" },
  { id: "usr-5", name: "Marcus Vance", email: "marcus@maxlith.com", role: "COMPLIANCE_OFFICER", department: "Compliance & Legal", status: "ACTIVE", lastLogin: "2 days ago" },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Shield className="text-[var(--accent)]" size={26} />
            <span>User & Access Control (RBAC)</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Provision user accounts, assign system security roles, and manage permissions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <UserPlus size={18} />
          <span>Provision User</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Assigned Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                  <div>
                    <span className="font-semibold">{u.name}</span>
                    <p className="text-[10px] text-[var(--text-muted)]">{u.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">{u.department}</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)]">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-[var(--success)]">{u.status}</td>
                <td className="px-4 py-3.5 text-[var(--text-muted)]">{u.lastLogin}</td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  <button className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                    <Edit2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Provision New User Account
            </h2>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">First Name</label>
                  <input type="text" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">Email</label>
                <input type="email" placeholder="name@maxlith.com" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">System Role</label>
                <select className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                  <option>SUPER_ADMIN</option>
                  <option>EXECUTIVE</option>
                  <option>ENGINEERING_LEAD</option>
                  <option>SENIOR_QUANT</option>
                  <option>DEVOPS_LEAD</option>
                  <option>EMPLOYEE</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
