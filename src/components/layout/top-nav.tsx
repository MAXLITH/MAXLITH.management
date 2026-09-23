"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
} from "lucide-react";

interface TopNavProps {
  user?: {
    firstName: string;
    lastName: string;
    roles?: string[];
    avatar?: string | null;
  };
}

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

export default function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();
  const { toggleMobile, isCollapsed } = useSidebar();
  const [searchFocused, setSearchFocused] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 transition-all duration-300",
      )}
    >
      {/* Left side: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <ChevronRight size={14} className="text-[var(--text-muted)]" />
              )}
              <Link
                href={crumb.href}
                className={cn(
                  "transition-colors",
                  i === breadcrumbs.length - 1
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right side: Search + Notifications + Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className={cn(
            "relative transition-all duration-300",
            searchFocused ? "w-72" : "w-48"
          )}
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search workspace..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-all"
          />
        </div>

        {/* Date (hidden on mobile) */}
        <div className="hidden xl:block text-xs text-[var(--text-muted)] px-3">
          {currentDate}
        </div>

        {/* Roles badge */}
        {user?.roles?.[0] && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            <span className="text-xs font-medium text-[var(--text-accent)] capitalize">
              {user.roles[0].replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
        </button>

        {/* User avatar (mobile) */}
        <Link
          href="/me"
          className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-semibold"
        >
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </Link>
      </div>
    </header>
  );
}
