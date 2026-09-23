"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Building2,
  Shield,
  Key,
  Clock,
  Calendar,
  CheckCircle2,
  Save,
  Bell,
  Lock,
  Smartphone,
  Activity,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<"general" | "activity" | "security" | "notifications">("general");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Admin",
    lastName: user?.lastName || "User",
    email: user?.email || "admin@maxlith.com",
    title: "Senior AI Trading Engineer",
    department: "AI & Quantitative Research",
    bio: "Passionate about high-frequency algorithmic trading systems, LLM fine-tuning, and ultra-low latency execution infrastructure.",
    phone: "+1 (555) 234-5678",
    timezone: "UTC-5 (Eastern Time)",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const userInitials = `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();

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
                {formData.firstName} {formData.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--accent)]/30 capitalize">
                {user?.roles?.[0]?.replace(/_/g, " ") || "SUPER ADMIN"}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              {formData.title} &bull; <span className="text-[var(--accent)]">{formData.department}</span>
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-1">
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-[var(--accent)]" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={14} className="text-[var(--accent)]" />
                <span>MAXLITH HQ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--accent)]" />
                <span>Joined Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] mt-8 gap-6 text-sm font-medium">
          {[
            { id: "general", label: "General Info", icon: User },
            { id: "activity", label: "Activity Log", icon: Activity },
            { id: "security", label: "Security & Auth", icon: Lock },
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
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)]/50 border border-[var(--border)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                />
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Email is managed by organization administrator.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Bio / Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                    <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                    <option value="UTC+5.5 (India)">UTC+5.5 (India Standard Time)</option>
                    <option value="UTC+8 (Singapore)">UTC+8 (Singapore)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess && (
                  <div className="flex items-center gap-2 text-xs text-[var(--success)]">
                    <CheckCircle2 size={16} />
                    <span>Profile saved successfully!</span>
                  </div>
                )}
                {!savedSuccess && <div />}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors shadow-md shadow-[var(--accent)]/20"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
                Role & Permissions
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Current Role</span>
                  <span className="text-xs font-bold text-[var(--accent-hover)] uppercase">Super Admin</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Department</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Engineering & AI</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">2FA Verification</span>
                  <span className="text-xs font-semibold text-[var(--success)]">Enabled (Hardware Key)</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {activeTab === "activity" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Recent Account Activity
          </h3>
          <div className="space-y-3">
            {[
              { title: "Logged in via SSO", time: "10 minutes ago", ip: "192.168.1.105", location: "New York, USA" },
              { title: "Approved Leave Request for Sarah Jenkins", time: "2 hours ago", ip: "192.168.1.105", location: "New York, USA" },
              { title: "Created project 'MAXLITH Ultra-Low Latency Engine'", time: "Yesterday at 16:45", ip: "192.168.1.105", location: "New York, USA" },
              { title: "Updated System Permissions for AI Research Team", time: "Sep 20, 2026", ip: "192.168.1.105", location: "New York, USA" },
            ].map((act, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{act.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">IP: {act.ip} &bull; Location: {act.location}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)] shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm max-w-2xl">
          <h3 className="text-base font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Password & Security
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Current Password</label>
              <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">New Password</label>
              <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
            </div>
            <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
              Update Password
            </button>
          </div>
        </div>
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
              { title: "GitHub & Pull Request Updates", desc: "Updates on PR reviews, merges, and pipeline build status" },
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
