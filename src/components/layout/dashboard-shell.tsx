"use client";

import React from "react";
import Sidebar from "@/components/layout/sidebar";
import TopNav from "@/components/layout/top-nav";
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    roles?: string[];
    avatar?: string | null;
  };
  children: React.ReactNode;
}

function ShellContent({ user, children }: DashboardShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar user={user} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <TopNav user={user} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <ShellContent user={user}>{children}</ShellContent>
    </SidebarProvider>
  );
}
