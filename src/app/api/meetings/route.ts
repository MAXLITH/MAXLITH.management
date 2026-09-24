import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { date: "asc" },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    const formatted = meetings.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      date: m.date.toISOString().split("T")[0],
      time: m.time,
      meetingLink: m.meetingLink,
      type: m.type,
      organizerName: `${m.createdBy.firstName} ${m.createdBy.lastName}`,
      projectName: m.project?.name || null,
      participants: m.participants.map((p) => ({
        id: p.user.id,
        name: `${p.user.firstName} ${p.user.lastName}`,
        avatar: p.user.avatar,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { title, description, date, time, type, meetingLink, projectId } = body;

    if (!title || !date || !time) {
      return NextResponse.json(
        { error: "Title, date, and time are required" },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        title: title.trim(),
        description: description || null,
        date: new Date(date),
        time,
        type: type || "TEAM",
        meetingLink: meetingLink || null,
        projectId: projectId || null,
        createdById: session!.user.id,
      },
    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "MEETING_SCHEDULED",
        resource: "meeting",
        resourceId: meeting.id,
        resourceName: meeting.title,
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
