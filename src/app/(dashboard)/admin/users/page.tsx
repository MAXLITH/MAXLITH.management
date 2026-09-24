"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  UserPlus,
  Search,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Lock,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string | null;
  status: "ACTIVE" | "SUSPENDED" | "ONBOARDING" | "OFFBOARDED";
  department: string;
  departmentId: string | null;
  role: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface DepartmentItem {
  id: string;
  name: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Provision Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("EMPLOYEE");
  const [departmentId, setDepartmentId] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Modal
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editStatus, setEditStatus] = useState<UserItem["status"]>("ACTIVE");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Delete Modal
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setUnauthorized(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setDepartments(data.departments || []);
        setRoles(data.roles || []);
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
          departmentId: departmentId || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to provision user account");
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRoleName("EMPLOYEE");
      setDepartmentId("");
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || "Failed to provision user");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setUpdating(true);
      setUpdateError("");
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser.id,
          roleName: editRoleName,
          status: editStatus,
          departmentId: editDepartmentId || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user account");
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      setDeleting(true);
      setDeleteError("");
      const res = await fetch(`/api/admin/users?id=${deletingUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user account");
      }

      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete user account");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (unauthorized) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <Lock size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Access Restricted</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            You require Administrator or Super Admin privileges to access User & Access Control.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Shield className="text-[var(--accent)]" size={26} />
            <span>User & Access Control (RBAC)</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Provision user accounts, assign system security roles, and manage user permissions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0 cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Provision User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="DEVELOPER">Developer</option>
            <option value="DESIGNER">Designer</option>
            <option value="DATA_SCIENTIST">Data Scientist</option>
            <option value="INTERN">Intern</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="OFFBOARDED">Offboarded</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
            searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL"
              ? "No user accounts match your active search filters."
              : "No registered users in the database yet."
          }
          actionLabel="Provision User"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.map((u) => {
                  const initials = `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase();
                  const isCurrentSessionUser = session?.user?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3.5 font-medium text-[var(--text-primary)]">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-[var(--border)] shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                              {initials}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold block text-[var(--text-primary)]">
                              {u.name} {isCurrentSessionUser && "(You)"}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] block">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{u.department}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] uppercase tracking-wide">
                          {u.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            u.status === "ACTIVE" && "bg-[var(--success-muted)] text-[var(--success)]",
                            u.status === "SUSPENDED" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                            u.status === "OFFBOARDED" && "bg-[var(--danger-muted)] text-[var(--danger)]"
                          )}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--text-muted)] font-mono">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setEditRoleName(u.role);
                              setEditStatus(u.status);
                              setEditDepartmentId(u.departmentId || "");
                            }}
                            title="Edit Role & Permissions"
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>

                          {!isCurrentSessionUser && (
                            <button
                              onClick={() => {
                                setDeletingUser(u);
                                setDeleteError("");
                              }}
                              title="Delete Account"
                              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision Modal */}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    System Role *
                  </label>
                  <select
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="DEVELOPER">Developer</option>
                    <option value="DESIGNER">Designer</option>
                    <option value="DATA_SCIENTIST">Data Scientist</option>
                    <option value="INTERN">Intern</option>
                    <option value="TEAM_LEAD">Team Lead</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    Department
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                  >
                    <option value="">Unassigned</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {creating ? "Provisioning..." : "Provision Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateUser}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Edit User Account: {editingUser.name}
            </h2>

            {updateError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{updateError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  System Role
                </label>
                <select
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="DESIGNER">Designer</option>
                  <option value="DATA_SCIENTIST">Data Scientist</option>
                  <option value="INTERN">Intern</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="OFFBOARDED">Offboarded</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Department
                </label>
                <select
                  value={editDepartmentId}
                  onChange={(e) => setEditDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
                >
                  <option value="">Unassigned</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-[var(--danger)] flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Confirm Account Deletion</span>
            </h2>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Are you sure you want to delete the account for <strong className="text-[var(--text-primary)]">{deletingUser.name}</strong> ({deletingUser.email})? This action will remove all associated user permissions and cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
