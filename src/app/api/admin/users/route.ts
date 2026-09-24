import { NextResponse } from "next/server";
import { getAuthSession, requirePermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "VIEW_USERS"
  );
  if (permErr) return permErr;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
              select: { id: true, name: true },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.avatar,
      status: u.status,
      department: u.department?.name || "Unassigned",
      departmentId: u.department?.id || null,
      role: u.roles[0]?.role.name || "EMPLOYEE",
      roles: u.roles.map((r) => r.role.name),
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "CREATE_USER"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, roleName, departmentId } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);
    const targetRoleName = roleName || "EMPLOYEE";

    // Find role ID
    const roleRecord = await prisma.role.findUnique({
      where: { name: targetRoleName },
    });

    if (!roleRecord) {
      return NextResponse.json(
        { error: `Role '${targetRoleName}' not found` },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        departmentId: departmentId || null,
        roles: {
          create: {
            roleId: roleRecord.id,
          },
        },
      },
      include: {
        department: true,
        roles: { include: { role: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session!.user.id,
        action: "USER_CREATED",
        resource: "user",
        resourceId: newUser.id,
        metadata: { email: newUser.email, role: targetRoleName },
      },
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      name: `${newUser.firstName} ${newUser.lastName}`,
      status: newUser.status,
      department: newUser.department?.name || "Unassigned",
      role: targetRoleName,
      createdAt: newUser.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "EDIT_USER"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();
    const { id, status, roleName, departmentId, firstName, lastName } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (departmentId !== undefined) updateData.departmentId = departmentId || null;
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (roleName) {
      const roleRecord = await prisma.role.findUnique({
        where: { name: roleName },
      });
      if (roleRecord) {
        await prisma.userRole.deleteMany({ where: { userId: id } });
        await prisma.userRole.create({
          data: { userId: id, roleId: roleRecord.id },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        actorId: session!.user.id,
        action: "USER_UPDATED",
        resource: "user",
        resourceId: id,
        metadata: { status, roleName },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
