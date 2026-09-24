import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const [
      totalEmployees,
      activeProjects,
      pendingTasks,
      completedTasks,
      totalAnnouncements,
    ] = await Promise.all([
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.task.count({
        where: { status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] } },
      }),
      prisma.task.count({ where: { status: "COMPLETED" } }),
      prisma.announcement.count(),
    ]);

    return NextResponse.json({
      totalEmployees,
      activeProjects,
      pendingTasks,
      completedTasks,
      totalAnnouncements,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
