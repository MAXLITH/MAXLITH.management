"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  UserPlus,
  Search,
  AlertCircle,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/loading-skeleton";

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string | null;
  status: string;
  department: string;
  role: string;
  roles: string[];
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New user form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("EMPLOYEE");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) return;

    try {
      setCreating(true);
      setCreateError("");
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          roleName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create user");
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(
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

      {loading ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No Users Found"
          description={
            searchTerm
              ? "No user accounts match your search query."
              : "No registered users in the database yet."
          }
          actionLabel="Provision User"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Created</th>
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
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] uppercase">
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[var(--success)]">{u.status}</td>
                  <td className="px-4 py-3.5 text-right text-[var(--text-muted)]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Provision New User Account
            </h2>

            {createError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{createError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@maxlith.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  System Role
                </label>
                <select
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="SENIOR_QUANT">Senior Quant</option>
                  <option value="ENGINEERING_LEAD">Engineering Lead</option>
                  <option value="DEVOPS_LEAD">DevOps Lead</option>
                  <option value="EXECUTIVE">Executive</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
