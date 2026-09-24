"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Save,
  Bell,
  Lock,
  Activity,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"general" | "activity" | "security" | "notifications">("general");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [joinedAt, setJoinedAt] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || "");
          setDepartment(data.department || "Unassigned");
          setRoles(data.roles || []);
          setJoinedAt(data.joinedAt || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileError("");
      setProfileSuccess(false);

      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setUpdatingPassword(true);
      setPasswordError("");
      setPasswordSuccess(false);

      const res = await fetch("/api/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update password");
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const userInitials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const displayRole = roles[0] ? roles[0].replace(/_/g, " ") : "USER";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-muted)]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-[var(--accent)]/40">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[var(--success)] border-2 border-[var(--bg-secondary)]" title="Online" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {firstName} {lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--accent)]/30 capitalize">
                {displayRole}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              Department: <span className="text-[var(--accent)]">{department}</span>
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-1">
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-[var(--accent)]" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={14} className="text-[var(--accent)]" />
                <span>MAXLITH Org</span>
              </div>
              {joinedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[var(--accent)]" />
                  <span>Joined {new Date(joinedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mt-8 gap-6 text-sm font-medium">
          {[
            { id: "general", label: "General Info", icon: User },
            { id: "security", label: "Security & Password", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 pb-3 border-b-2 transition-colors relative",
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent-hover)] font-semibold"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Personal Information
              </h3>

              {profileError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    First Name
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
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Last Name
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
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)]/50 border border-[var(--border)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                />
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Email address is managed by organization administrator.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSuccess && (
                  <div className="flex items-center gap-2 text-xs text-[var(--success)] font-medium">
                    <CheckCircle2 size={16} />
                    <span>Profile saved successfully!</span>
                  </div>
                )}
                {!profileSuccess && <div />}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors shadow-md shadow-[var(--accent)]/20 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{savingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Account Details
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Assigned Role</span>
                  <span className="text-xs font-bold text-[var(--accent-hover)] uppercase">{displayRole}</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Department</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{department}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm max-w-2xl">
          <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Change Password
          </h3>

          {passwordError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400 flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>Password updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "notifications" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm max-w-2xl">
          <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              { title: "Task Assignments & Mentions", desc: "Get notified when someone assigns a task or mentions you" },
              { title: "Leave & Request Approvals", desc: "Receive immediate notifications for team leave requests" },
              { title: "System & Security Alerts", desc: "Important administrative announcements and security events" },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
