import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const users = await prisma.user.findMany({
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        department: {
          select: { id: true, name: true },
        },
        roles: {
          select: {
            role: {
              select: { id: true, name: true, description: true },
            },
          },
        },
        _count: {
          select: {
            assignedTasks: true,
            projectMembers: true,
          },
        },
        createdAt: true,
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      avatar: u.avatar,
      status: u.status,
      department: u.department?.name || "Unassigned",
      departmentId: u.department?.id || null,
      roles: u.roles.map((r) => r.role.name),
      taskCount: u._count.assignedTasks,
      projectCount: u._count.projectMembers,
      joinedAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
