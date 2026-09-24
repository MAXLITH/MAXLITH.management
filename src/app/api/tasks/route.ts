import { NextResponse } from "next/server";
import { getAuthSession, requirePermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const assigneeId = searchParams.get("assigneeId");
  const status = searchParams.get("status");

  try {
    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (assigneeId) whereClause.assigneeId = assigneeId;
    if (status) whereClause.status = status;

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        project: {
          select: { id: true, name: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: {
          select: { comments: true, attachments: true },
        },
      },
    });

    const formatted = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      projectId: t.projectId,
      projectName: t.project?.name || null,
      assignee: t.assignee
        ? {
            id: t.assignee.id,
            name: `${t.assignee.firstName} ${t.assignee.lastName}`,
            avatar: t.assignee.avatar,
          }
        : null,
      creatorName: `${t.createdBy.firstName} ${t.createdBy.lastName}`,
      deadline: t.deadline ? t.deadline.toISOString() : null,
      tags: t.tags,
      commentCount: t._count.comments,
      attachmentCount: t._count.attachments,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "CREATE_TASK"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();
    const { title, description, priority, status, projectId, assigneeId, deadline, tags } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        priority: priority || "MEDIUM",
        status: status || "TODO",
        projectId: projectId || null,
        assigneeId: assigneeId || null,
        deadline: deadline ? new Date(deadline) : null,
        tags: Array.isArray(tags) ? tags : [],
        createdById: session!.user.id,
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "TASK_CREATED",
        resource: "task",
        resourceId: task.id,
        resourceName: task.title,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { id, status, priority, title, description, assigneeId, deadline } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    if (status) {
      await prisma.activity.create({
        data: {
          actorId: session!.user.id,
          action: "TASK_STATUS_UPDATED",
          resource: "task",
          resourceId: task.id,
          resourceName: task.title,
          metadata: { newStatus: status },
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
