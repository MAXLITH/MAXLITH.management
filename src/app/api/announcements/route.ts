import { NextResponse } from "next/server";
import { getAuthSession, requirePermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        reads: {
          where: { userId: session!.user.id },
          select: { id: true },
        },
      },
    });

    const formatted = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      priority: a.priority,
      isPinned: a.isPinned,
      authorName: `${a.author.firstName} ${a.author.lastName}`,
      authorAvatar: a.author.avatar,
      isRead: a.reads.length > 0,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "CREATE_ANNOUNCEMENT"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();
    const { title, content, priority, isPinned } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Announcement title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Announcement content is required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        priority: priority || "NORMAL",
        isPinned: Boolean(isPinned),
        authorId: session!.user.id,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "ANNOUNCEMENT_CREATED",
        resource: "announcement",
        resourceId: announcement.id,
        resourceName: announcement.title,
      },
    });

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      isPinned: announcement.isPinned,
      authorName: `${announcement.author.firstName} ${announcement.author.lastName}`,
      authorAvatar: announcement.author.avatar,
      isRead: true,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
