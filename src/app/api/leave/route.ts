import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        approver: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    const formatted = leaves.map((l) => ({
      id: l.id,
      userName: `${l.user.firstName} ${l.user.lastName}`,
      userAvatar: l.user.avatar,
      type: l.type,
      startDate: l.startDate.toISOString().split("T")[0],
      endDate: l.endDate.toISOString().split("T")[0],
      reason: l.reason,
      status: l.status,
      approverName: l.approver ? `${l.approver.firstName} ${l.approver.lastName}` : null,
      createdAt: l.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { type, startDate, endDate, reason } = body;

    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Leave type, start date, end date, and reason are required" },
        { status: 400 }
      );
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: session!.user.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason.trim(),
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
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 });
  }
}
