"use client";

import React, { useEffect, useState } from "react";
import { getGreeting } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, CardSkeleton } from "@/components/ui/loading-skeleton";
import Link from "next/link";
import {
  CheckSquare,
  FolderKanban,
  Megaphone,
  Star,
  Users,
  Activity,
  ArrowUpRight,
  Clock,
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
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 card-glow overflow-hidden">
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
  actorName: string;
  actorAvatar: string | null;
  action: string;
  resource: string;
  resourceName?: string | null;
  createdAt: string;
}

function ActivityItem({ actorName, action, resourceName, createdAt }: ActivityItemProps) {
  const initials = actorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--text-primary)]">
          <span className="font-medium">{actorName}</span>{" "}
          <span className="text-[var(--text-secondary)]">{action.toLowerCase().replace(/_/g, " ")}</span>{" "}
          {resourceName && (
            <span className="font-medium text-[var(--text-accent)]">{resourceName}</span>
          )}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{timeAgo(createdAt)}</p>
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

function QuickAction({ icon: Icon, label, href, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all group"
    >
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
    </Link>
  );
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const greeting = getGreeting();

  const [statsData, setStatsData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, actRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activity"),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          setStatsData(s);
        }
        if (actRes.ok) {
          const a = await actRes.json();
          setActivities(a);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const stats: StatCardProps[] = [
    {
      title: "Active Projects",
      value: statsData?.activeProjects ?? (loading ? "..." : 0),
      icon: FolderKanban,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.12)",
    },
    {
      title: "Pending Tasks",
      value: statsData?.pendingTasks ?? (loading ? "..." : 0),
      icon: CheckSquare,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)",
    },
    {
      title: "Completed Tasks",
      value: statsData?.completedTasks ?? (loading ? "..." : 0),
      icon: Star,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.12)",
    },
    {
      title: "Active Team Members",
      value: statsData?.totalEmployees ?? (loading ? "..." : 0),
      icon: Users,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.12)",
    },
  ];

  const quickActions: QuickActionProps[] = [
    { icon: FolderKanban, label: "View Projects", href: "/projects", color: "#3b82f6" },
    { icon: CheckSquare, label: "Manage Tasks", href: "/tasks", color: "#6366f1" },
    { icon: Users, label: "Team Directory", href: "/team", color: "#8b5cf6" },
    { icon: Megaphone, label: "Company Announcements", href: "/announcements", color: "#ef4444" },
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
          Welcome to the MAXLITH Internal Management Platform.
        </p>

        {user.roles && user.roles.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
              Current Role:
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
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Platform Edition</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Enterprise Production</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--info-muted)] flex items-center justify-center">
            <Clock size={20} className="text-[var(--info)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Database Connection</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">PostgreSQL Active</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)
          : stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
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
                  Real-time audit & system events
                </p>
              </div>
            </div>
            <div className="px-5 py-2">
              {loading ? (
                <div className="py-4 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : activities.length === 0 ? (
                <div className="py-6">
                  <EmptyState
                    icon={Activity}
                    title="No Recent Activity"
                    description="System activity logs and updates will appear here as team members perform actions."
                  />
                </div>
              ) : (
                activities.map((item) => <ActivityItem key={item.id} {...item} />)
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Quick Navigation
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Primary modules
              </p>
            </div>
            <div className="p-3 space-y-2">
              {quickActions.map((action) => (
                <QuickAction key={action.label} {...action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
