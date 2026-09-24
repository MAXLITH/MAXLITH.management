"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  GitBranch,
  BookOpen,
  FileText,
  CalendarClock,
  Megaphone,
  Users,
  Building2,
  Bot,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Calendar,
  GitPullRequest,
  Upload,
  Video,
  BarChart3,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Workspace",
    defaultOpen: true,
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Tasks", href: "/tasks?view=my", icon: CheckSquare },
      { label: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  {
    title: "Projects",
    defaultOpen: true,
    items: [
      { label: "All Projects", href: "/projects", icon: FolderKanban },
    ],
  },
  {
    title: "Development",
    items: [
      { label: "GitHub", href: "/development", icon: GitBranch },
      { label: "Pull Requests", href: "/development/pulls", icon: GitPullRequest },
    ],
  },
  {
    title: "Knowledge",
    items: [
      { label: "Documentation", href: "/documentation", icon: BookOpen },
      { label: "Files", href: "/files", icon: Upload },
    ],
  },
  {
    title: "Operations",
    defaultOpen: true,
    items: [
      { label: "Daily Report", href: "/daily-report", icon: FileText },
      { label: "Leave Application", href: "/leave", icon: CalendarClock },
      { label: "Announcements", href: "/announcements", icon: Megaphone },
      { label: "Meetings", href: "/meetings", icon: Video },
    ],
  },
  {
    title: "Team",
    items: [
      { label: "Employees", href: "/team", icon: Users },
      { label: "Departments", href: "/team/departments", icon: Building2 },
    ],
  },
  {
    title: "AI",
    items: [
      { label: "MAXLITH AI", href: "/ai", icon: Bot },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: Shield },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "System", href: "/admin/system", icon: Settings },
    ],
  },
];

function SectionGroup({
  section,
  isCollapsed,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  isCollapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? false);

  // Check if any item in section is active
  const hasActiveItem = section.items.some(
    (item) =>
      pathname === item.href || pathname.startsWith(item.href.split("?")[0] + "/")
  );

  // Auto-open section if it has active item
  React.useEffect(() => {
    if (hasActiveItem) setIsOpen(true);
  }, [hasActiveItem]);

  if (isCollapsed) {
    return (
      <div className="mb-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href.split("?")[0] + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                "flex items-center justify-center w-10 h-10 mx-auto mb-1 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-[var(--accent-muted)] text-[var(--accent-hover)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              )}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        <span>{section.title}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="space-y-0.5">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href.split("?")[0] + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--accent-muted)] text-[var(--accent-hover)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                )}
              >
                <Icon size={18} className={isActive ? "text-[var(--accent)]" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  user?: {
    firstName: string;
    lastName: string;
    email?: string;
    roles?: string[];
    avatar?: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebar();

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "MX";

  const roleDisplay = user?.roles?.[0]?.replace(/_/g, " ") || "Employee";

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          // Mobile
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Header */}
        <div
          className={cn(
            "flex items-center border-b border-[var(--border)] h-16 shrink-0",
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                  MAXLITH
                </h1>
                <p className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                  Management
                </p>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <Link href="/dashboard">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
            </Link>
          )}

          {/* Close button on mobile */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-1">
          {navSections.map((section) => (
            <SectionGroup
              key={section.title}
              section={section}
              isCollapsed={isCollapsed}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        {/* Settings Link */}
        <div className="px-2 pb-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all",
              isCollapsed && "justify-center"
            )}
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>

        {/* User Profile + Collapse Toggle */}
        <div className="border-t border-[var(--border)] p-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <Link href="/me" className="flex items-center gap-3 flex-1 min-w-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate capitalize">
                    {roleDisplay}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCollapsed}
                  title="Collapse sidebar"
                  className="hidden lg:flex p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  title="Logout"
                  className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link href="/me">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-semibold">
                    {userInitials}
                  </div>
                )}
              </Link>
              <button
                onClick={toggleCollapsed}
                title="Expand sidebar"
                className="hidden lg:flex p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
