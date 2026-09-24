import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const reports = await prisma.dailyReport.findMany({
      orderBy: { date: "desc" },
      take: 50,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        project: { select: { id: true, name: true } },
      },
    });

    const formatted = reports.map((r) => ({
      id: r.id,
      userName: `${r.user.firstName} ${r.user.lastName}`,
      userAvatar: r.user.avatar,
      projectName: r.project?.name || "General",
      workedOn: r.workedOn,
      completed: r.completed,
      nextTasks: r.nextTasks,
      blockers: r.blockers,
      hoursWorked: r.hoursWorked,
      date: r.date.toISOString().split("T")[0],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { workedOn, completed, nextTasks, blockers, hoursWorked, projectId } = body;

    if (!workedOn || !completed || !nextTasks) {
      return NextResponse.json(
        { error: "Worked on, completed, and next tasks fields are required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await prisma.dailyReport.upsert({
      where: {
        userId_date: {
          userId: session!.user.id,
          date: today,
        },
      },
      update: {
        workedOn,
        completed,
        nextTasks,
        blockers: blockers || null,
        hoursWorked: hoursWorked ? parseFloat(hoursWorked) : 8,
        projectId: projectId || null,
      },
      create: {
        userId: session!.user.id,
        projectId: projectId || null,
        workedOn,
        completed,
        nextTasks,
        blockers: blockers || null,
        hoursWorked: hoursWorked ? parseFloat(hoursWorked) : 8,
        date: today,
      },
    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "DAILY_REPORT_SUBMITTED",
        resource: "dailyReport",
        resourceId: report.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error saving daily report:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
