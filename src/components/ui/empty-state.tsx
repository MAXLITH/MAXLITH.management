import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
      <div className="p-3 bg-zinc-800/50 rounded-full text-zinc-400 mb-4 border border-zinc-700/50">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
