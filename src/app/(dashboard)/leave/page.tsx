"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  CalendarClock,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  UserCheck,
  Building2,
  Filter,
  Check,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/loading-skeleton";

interface BalanceItem {
  type: string;
  category: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

interface LeaveRequestItem {
  id: string;
  userId: string;
  applicant: string;
  userAvatar?: string | null;
  userEmail: string;
  type: string;
  rawType: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  handover: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approverName?: string | null;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export default function LeavePage() {
  const { data: session } = useSession();
  const [balances, setBalances] = useState<BalanceItem[]>([]);
  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [canApprove, setCanApprove] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "MINE">("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveCategory, setLeaveCategory] = useState("Paid Vacation (PTO)");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [handoverPerson, setHandoverPerson] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Action Loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leave");
      if (res.ok) {
        const data = await res.json();
        setBalances(data.balances || []);
        setRequests(data.requests || []);
        setTeamMembers(data.teamMembers || []);
        setCanApprove(data.canApprove || false);
      }
    } catch (err) {
      console.error("Failed to load leave data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // Calculate duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    const diffMs = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: leaveCategory,
          startDate,
          endDate,
          reason,
          handoverPerson,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit leave application");
      }

      setStartDate("");
      setEndDate("");
      setHandoverPerson("");
      setReason("");
      setShowApplyModal(false);
      fetchLeaveData();
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED" | "CANCELLED") => {
    try {
      setActionLoadingId(id);
      const res = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to update status");
        return;
      }

      fetchLeaveData();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "PENDING" && req.status !== "PENDING") return false;
    if (activeTab === "MINE" && req.userId !== session?.user?.id) return false;
    if (statusFilter !== "ALL" && req.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <CalendarClock className="text-[var(--accent)]" size={26} />
            <span>Leave Application & PTO Portal</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Apply for leave, track real-time PTO balance, and manage team out-of-office requests.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-28 animate-pulse" />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-28 animate-pulse" />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-28 animate-pulse" />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-28 animate-pulse" />
          </>
        ) : (
          balances.map((b) => {
            const percentage = b.total > 0 ? Math.min(100, (b.remaining / b.total) * 100) : 0;
            return (
              <div
                key={b.category}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-2 shadow-sm hover:border-[var(--accent)]/30 transition-all"
              >
                <p className="text-xs text-[var(--text-muted)] font-medium">{b.type}</p>
                <div className="flex items-baseline justify-between">
                  <p className={`text-2xl font-bold ${b.color}`}>{b.remaining} Days</p>
                  <span className="text-[11px] text-[var(--text-muted)]">Remaining</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] pt-1">
                  {b.used} days used of {b.total} annual allowance
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Leave Requests Table Container */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Leave Applications & History
            </h2>
            {canApprove && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-muted)] text-[var(--accent-hover)] uppercase">
                Manager Review Mode
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {canApprove && (
              <div className="flex items-center p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all cursor-pointer",
                    activeTab === "ALL"
                      ? "bg-[var(--accent)] text-white font-semibold shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  All Requests
                </button>
                <button
                  onClick={() => setActiveTab("PENDING")}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                    activeTab === "PENDING"
                      ? "bg-[var(--accent)] text-white font-semibold shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>Pending</span>
                  {requests.filter((r) => r.status === "PENDING").length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                      {requests.filter((r) => r.status === "PENDING").length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("MINE")}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all cursor-pointer",
                    activeTab === "MINE"
                      ? "bg-[var(--accent)] text-white font-semibold shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  My Requests
                </button>
              </div>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="space-y-2">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No Leave Requests Found"
            description={
              activeTab === "PENDING"
                ? "There are currently no pending leave applications awaiting review."
                : "No leave applications registered in the system yet."
            }
            actionLabel="Apply for Leave"
            onAction={() => setShowApplyModal(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] uppercase font-medium text-[10px] tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Handover Person</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredRequests.map((req) => {
                  const isOwner = req.userId === session?.user?.id;
                  const initials = req.applicant
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={req.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-[var(--text-primary)]">
                        <div className="flex items-center gap-2.5">
                          {req.userAvatar ? (
                            <img
                              src={req.userAvatar}
                              alt={req.applicant}
                              className="w-7 h-7 rounded-full object-cover border border-[var(--border)] shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {initials}
                            </div>
                          )}
                          <div>
                            <span>{req.applicant}</span>
                            {isOwner && (
                              <span className="text-[10px] text-[var(--text-muted)] block font-normal">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[var(--accent-hover)]">
                        {req.type}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[var(--text-muted)]">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[var(--text-primary)]">
                        {req.daysCount} Day(s)
                      </td>
                      <td className="px-4 py-3.5 text-[var(--text-secondary)]">
                        {req.handover}
                      </td>
                      <td className="px-4 py-3.5 max-w-xs truncate text-[var(--text-muted)]" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1",
                            req.status === "APPROVED" && "bg-[var(--success-muted)] text-[var(--success)]",
                            req.status === "PENDING" && "bg-[var(--warning-muted)] text-[var(--warning)]",
                            req.status === "REJECTED" && "bg-[var(--danger-muted)] text-[var(--danger)]",
                            req.status === "CANCELLED" && "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]"
                          )}
                        >
                          {req.status === "APPROVED" && <CheckCircle2 size={11} />}
                          {req.status === "PENDING" && <Clock size={11} />}
                          {req.status === "REJECTED" && <XCircle size={11} />}
                          <span>{req.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Manager inline approvals */}
                          {canApprove && req.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                                disabled={actionLoadingId === req.id}
                                title="Approve Request"
                                className="p-1.5 rounded-lg bg-[var(--success-muted)] hover:bg-[var(--success)] text-[var(--success)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                                disabled={actionLoadingId === req.id}
                                title="Reject Request"
                                className="p-1.5 rounded-lg bg-[var(--danger-muted)] hover:bg-[var(--danger)] text-[var(--danger)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}

                          {/* Regular user cancel option */}
                          {!canApprove && isOwner && req.status === "PENDING" && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, "CANCELLED")}
                              disabled={actionLoadingId === req.id}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--danger-muted)] text-[var(--text-muted)] hover:text-[var(--danger)] text-[11px] font-medium border border-[var(--border)] transition-colors cursor-pointer"
                            >
                              Cancel
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
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleApplyLeave}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] w-full max-w-lg p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
              Submit Leave Application
            </h2>

            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Leave Category *
                </label>
                <select
                  value={leaveCategory}
                  onChange={(e) => setLeaveCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="Paid Vacation (PTO)">Paid Vacation (PTO)</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual / Personal">Casual / Personal</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary)] mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-2.5 rounded-lg bg-[var(--accent-muted)]/50 border border-[var(--accent)]/20 text-xs text-[var(--accent-hover)] font-medium flex items-center justify-between">
                  <span>Calculated Duration:</span>
                  <span className="font-bold">{calculateDays()} Day(s)</span>
                </div>
              )}

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Handover Colleague
                </label>
                <select
                  value={handoverPerson}
                  onChange={(e) => setHandoverPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Select a team member...</option>
                  {teamMembers
                    .filter((m) => m.id !== session?.user?.id)
                    .map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[var(--text-secondary)] mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please provide brief details regarding your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
