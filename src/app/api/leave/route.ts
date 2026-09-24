import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";
import { isManagerOrAbove } from "@/lib/rbac";
import type { LeaveType, RoleName } from "@/types";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;
  const userRoles = (session!.user.roles || []) as RoleName[];
  const userPerms = session!.user.permissions || [];
  const canApprove =
    isManagerOrAbove(userRoles) || userPerms.includes("APPROVE_LEAVE");

  try {
    // 1. Fetch or create user leave balance
    let balance = await prisma.leaveBalance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await prisma.leaveBalance.create({
        data: {
          userId,
          casual: 12,
          sick: 10,
          annual: 15,
          emergency: 5,
        },
      });
    }

    // 2. Fetch approved requests to calculate used days for the current user
    const userApprovedRequests = await prisma.leaveRequest.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
    });

    const usedDays = {
      ANNUAL: 0,
      SICK: 0,
      CASUAL: 0,
      EMERGENCY: 0,
    };

    for (const req of userApprovedRequests) {
      const diffMs = new Date(req.endDate).getTime() - new Date(req.startDate).getTime();
      const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);
      if (req.type === "ANNUAL" || req.type === "OTHER") usedDays.ANNUAL += days;
      else if (req.type === "SICK") usedDays.SICK += days;
      else if (req.type === "CASUAL") usedDays.CASUAL += days;
      else if (req.type === "EMERGENCY") usedDays.EMERGENCY += days;
    }

    const balances = [
      {
        type: "Paid Vacation (PTO)",
        category: "ANNUAL",
        total: balance.annual,
        used: usedDays.ANNUAL,
        remaining: Math.max(0, balance.annual - usedDays.ANNUAL),
        color: "text-[var(--accent)]",
      },
      {
        type: "Sick Leave",
        category: "SICK",
        total: balance.sick,
        used: usedDays.SICK,
        remaining: Math.max(0, balance.sick - usedDays.SICK),
        color: "text-[var(--warning)]",
      },
      {
        type: "Casual / Personal",
        category: "CASUAL",
        total: balance.casual,
        used: usedDays.CASUAL,
        remaining: Math.max(0, balance.casual - usedDays.CASUAL),
        color: "text-[var(--accent-purple)]",
      },
      {
        type: "Emergency Leave",
        category: "EMERGENCY",
        total: balance.emergency,
        used: usedDays.EMERGENCY,
        remaining: Math.max(0, balance.emergency - usedDays.EMERGENCY),
        color: "text-[var(--success)]",
      },
    ];

    // 3. Fetch leave requests (all requests for managers/admins, own requests for employees)
    const requests = await prisma.leaveRequest.findMany({
      where: canApprove ? {} : { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // 4. Fetch team members for handover dropdown
    const teamMembers = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
    });

    const formattedRequests = requests.map((l) => {
      const diffMs = new Date(l.endDate).getTime() - new Date(l.startDate).getTime();
      const daysCount = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);

      // Parse handover if present in reason string: "[Handover: Name] Reason"
      let handover = "Unassigned";
      let cleanReason = l.reason;
      if (l.reason.startsWith("[Handover:")) {
        const parts = l.reason.split("]");
        handover = parts[0].replace("[Handover:", "").trim();
        cleanReason = parts.slice(1).join("]").trim();
      }

      const typeDisplay =
        l.type === "ANNUAL"
          ? "Paid Vacation (PTO)"
          : l.type === "SICK"
          ? "Sick Leave"
          : l.type === "CASUAL"
          ? "Casual / Personal"
          : l.type === "EMERGENCY"
          ? "Emergency Leave"
          : "Other Leave";

      return {
        id: l.id,
        userId: l.userId,
        applicant: `${l.user.firstName} ${l.user.lastName}`,
        userAvatar: l.user.avatar,
        userEmail: l.user.email,
        type: typeDisplay,
        rawType: l.type,
        startDate: l.startDate.toISOString().split("T")[0],
        endDate: l.endDate.toISOString().split("T")[0],
        daysCount,
        reason: cleanReason,
        handover,
        status: l.status,
        approverName: l.approver ? `${l.approver.firstName} ${l.approver.lastName}` : null,
        createdAt: l.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      balances,
      requests: formattedRequests,
      teamMembers: teamMembers.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
      })),
      canApprove,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json({ error: "Failed to fetch leave data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { type, startDate, endDate, reason, handoverPerson } = body;

    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Leave type, start date, end date, and reason are required" },
        { status: 400 }
      );
    }

    const handoverPrefix = handoverPerson ? `[Handover: ${handoverPerson}] ` : "";
    const fullReason = `${handoverPrefix}${reason.trim()}`;

    // Map leave type strings to LeaveType enum
    let leaveEnum: LeaveType = "CASUAL";
    if (type === "Paid Vacation (PTO)" || type === "ANNUAL") leaveEnum = "ANNUAL";
    else if (type === "Sick Leave" || type === "SICK") leaveEnum = "SICK";
    else if (type === "Emergency Leave" || type === "EMERGENCY") leaveEnum = "EMERGENCY";
    else if (type === "Casual / Personal" || type === "CASUAL") leaveEnum = "CASUAL";
    else leaveEnum = "OTHER";

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: session!.user.id,
        type: leaveEnum,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: fullReason,
        status: "PENDING",
      },
    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "LEAVE_REQUESTED",
        resource: "leaveRequest",
        resourceId: leave.id,
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error("Error creating leave request:", error);
    return NextResponse.json({ error: "Failed to submit leave application" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const userRoles = (session!.user.roles || []) as RoleName[];
  const userPerms = session!.user.permissions || [];
  const canApprove =
    isManagerOrAbove(userRoles) || userPerms.includes("APPROVE_LEAVE");

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    // Check authorization: approving/rejecting requires manager/admin permissions
    if (status === "APPROVED" || status === "REJECTED") {
      if (!canApprove) {
        return NextResponse.json(
          { error: "Unauthorized. Manager or Admin privileges required to review leave requests." },
          { status: 403 }
        );
      }
    } else if (status === "CANCELLED") {
      // Users can cancel their own pending request
      if (existingRequest.userId !== session!.user.id && !canApprove) {
        return NextResponse.json(
          { error: "You can only cancel your own leave request" },
          { status: 403 }
        );
      }
    }

    const updatedRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        approverId: session!.user.id,
      },

    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: status === "APPROVED" ? "APPROVED" : status === "REJECTED" ? "REJECTED" : "UPDATED",
        resource: "leaveRequest",
        resourceId: id,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating leave request status:", error);
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 });
  }
}
