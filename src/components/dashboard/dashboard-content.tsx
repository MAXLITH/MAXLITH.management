"use client";

import React from "react";
import { getGreeting } from "@/lib/utils";
import {
  CheckSquare,
  FolderKanban,
  Clock,
  CalendarCheck,
  Megaphone,
  GitBranch,
  FileText,
  Star,
  TrendingUp,
  ArrowUpRight,
  Activity,
  type LucideIcon,
} from "lucide-react";

interface DashboardContentProps {
  user: {
    firstName: string;
    lastName: string;
    roles?: string[];
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color, bgColor }: StatCardProps) {
  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 card-glow overflow-hidden">
      {/* Subtle gradient accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp
                size={12}
                className={trendUp ? "text-[var(--success)]" : "text-[var(--danger)]"}
              />
              <span
                className={`text-xs font-medium ${
                  trendUp ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: bgColor }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  target: string;
  time: string;
  color: string;
}

function ActivityItem({ avatar, name, action, target, time, color }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5"
        style={{ background: color }}
      >
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--text-primary)]">
          <span className="font-medium">{name}</span>{" "}
          <span className="text-[var(--text-secondary)]">{action}</span>{" "}
          <span className="font-medium text-[var(--text-accent)]">{target}</span>
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{time}</p>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
}

function QuickAction({ icon: Icon, label, color }: QuickActionProps) {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all group">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
        {label}
      </span>
      <ArrowUpRight
        size={14}
        className="ml-auto text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"
      />
    </button>
  );
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const greeting = getGreeting();

  // These will be replaced with real API data
  const stats: StatCardProps[] = [
    {
      title: "My Tasks",
      value: 12,
      icon: CheckSquare,
      trend: "+3 this week",
      trendUp: true,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.12)",
    },
    {
      title: "Active Projects",
      value: 4,
      icon: FolderKanban,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.12)",
    },
    {
      title: "Pending Reviews",
      value: 3,
      icon: Clock,
      trend: "2 urgent",
      trendUp: false,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)",
    },
    {
      title: "Upcoming Meetings",
      value: 2,
      icon: CalendarCheck,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.12)",
    },
    {
      title: "Completed Tasks",
      value: 28,
      icon: Star,
      trend: "+8 this month",
      trendUp: true,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.12)",
    },
    {
      title: "Unread Announcements",
      value: 2,
      icon: Megaphone,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.12)",
    },
    {
      title: "GitHub Activity",
      value: 6,
      icon: GitBranch,
      trend: "4 new PRs",
      trendUp: true,
      color: "#14b8a6",
      bgColor: "rgba(20, 184, 166, 0.12)",
    },
    {
      title: "Daily Reports",
      value: "5/5",
      icon: FileText,
      color: "#a855f7",
      bgColor: "rgba(168, 85, 247, 0.12)",
    },
  ];

  const recentActivity: ActivityItemProps[] = [
    {
      avatar: "SV",
      name: "Saran V",
      action: "completed task",
      target: "Fix authentication API",
      time: "10 minutes ago",
      color: "#6366f1",
    },
    {
      avatar: "AR",
      name: "Arun R",
      action: "pushed code to",
      target: "trading-platform/main",
      time: "25 minutes ago",
      color: "#3b82f6",
    },
    {
      avatar: "PK",
      name: "Priya K",
      action: "created document",
      target: "API Integration Guide",
      time: "1 hour ago",
      color: "#8b5cf6",
    },
    {
      avatar: "RN",
      name: "Rahul N",
      action: "submitted daily report for",
      target: "MAXLITH AI Project",
      time: "2 hours ago",
      color: "#22c55e",
    },
    {
      avatar: "MG",
      name: "Manager",
      action: "approved leave request from",
      target: "Deepa S",
      time: "3 hours ago",
      color: "#f59e0b",
    },
    {
      avatar: "SY",
      name: "System",
      action: "published announcement",
      target: "MAXLITH V2 Development Started",
      time: "5 hours ago",
      color: "#ef4444",
    },
  ];

  const quickActions: QuickActionProps[] = [
    { icon: CheckSquare, label: "Create New Task", href: "/tasks/new", color: "#6366f1" },
    { icon: FileText, label: "Submit Daily Report", href: "/daily-report/new", color: "#22c55e" },
    { icon: FolderKanban, label: "View Projects", href: "/projects", color: "#3b82f6" },
    { icon: CalendarCheck, label: "Schedule Meeting", href: "/meetings/new", color: "#8b5cf6" },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-1">
          {greeting},{" "}
          <span className="gradient-text">{user.firstName}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>

        {/* Role badges */}
        {user.roles && user.roles.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
              Current Access:
            </span>
            {user.roles.map((role) => (
              <span
                key={role}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]"
              >
                {role.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* System Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center">
            <Activity size={20} className="text-[var(--success)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">System Status</p>
            <p className="text-sm font-semibold text-[var(--success)]">Operational</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
            <Star size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Security Level</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Enterprise</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--info-muted)] flex items-center justify-center">
            <TrendingUp size={20} className="text-[var(--info)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Session Duration</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Active</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Latest updates across your workspace
                </p>
              </div>
              <button className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="px-5 py-2">
              {recentActivity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Quick Actions
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Frequently used actions
              </p>
            </div>
            <div className="p-3 space-y-2">
              {quickActions.map((action) => (
                <QuickAction key={action.label} {...action} />
              ))}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl mt-6">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Today&apos;s Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Tasks Due</span>
                <span className="text-sm font-semibold text-[var(--warning)]">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Meetings</span>
                <span className="text-sm font-semibold text-[var(--accent)]">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">PRs to Review</span>
                <span className="text-sm font-semibold text-[var(--accent-purple)]">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Report Status</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--success-muted)] text-[var(--success)]">
                  Submitted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
