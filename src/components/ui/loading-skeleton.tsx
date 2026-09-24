import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-800/60 ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 border border-zinc-800/80 bg-zinc-900/40 rounded-xl space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-2 flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-3 px-4 border-b border-zinc-800/50">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
