import { NextResponse } from "next/server";
import { getAuthSession, requirePermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      priority: p.priority,
      deadline: p.deadline ? p.deadline.toISOString() : null,
      repositoryUrl: p.repositoryUrl,
      techStack: p.techStack,
      manager: p.manager
        ? {
            id: p.manager.id,
            name: `${p.manager.firstName} ${p.manager.lastName}`,
            avatar: p.manager.avatar,
          }
        : null,
      members: p.members.map((m) => ({
        id: m.user.id,
        name: `${m.user.firstName} ${m.user.lastName}`,
        avatar: m.user.avatar,
        role: m.role,
      })),
      taskCount: p._count.tasks,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "CREATE_PROJECT"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();
    const { name, description, priority, deadline, managerId, techStack, repositoryUrl } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description || null,
        priority: priority || "MEDIUM",
        deadline: deadline ? new Date(deadline) : null,
        managerId: managerId || null,
        repositoryUrl: repositoryUrl || null,
        techStack: Array.isArray(techStack) ? techStack : [],
        createdById: session!.user.id,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        actorId: session!.user.id,
        action: "PROJECT_CREATED",
        resource: "project",
        resourceId: project.id,
        resourceName: project.name,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
