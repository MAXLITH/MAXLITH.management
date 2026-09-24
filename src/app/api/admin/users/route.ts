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
    const [users, departments, roles] = await Promise.all([
      prisma.user.findMany({
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
      }),
      prisma.department.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.role.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, description: true },
      }),
    ]);

    const formattedUsers = users.map((u) => ({
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

    return NextResponse.json({
      users: formattedUsers,
      departments,
      roles,
    });
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

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);
    const targetRoleName = roleName || "EMPLOYEE";

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
        email: cleanEmail,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        departmentId: departmentId || null,
        status: "ACTIVE",
        roles: {
          create: {
            roleId: roleRecord.id,
          },
        },
        leaveBalance: {
          create: {
            casual: 12,
            sick: 10,
            annual: 15,
            emergency: 5,
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

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: `${newUser.firstName} ${newUser.lastName}`,
        avatar: newUser.avatar,
        status: newUser.status,
        department: newUser.department?.name || "Unassigned",
        departmentId: newUser.departmentId,
        role: targetRoleName,
        roles: [targetRoleName],
        createdAt: newUser.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to provision user" },
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
        metadata: { status, roleName, departmentId },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user account" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "SUSPEND_USER"
  );
  if (permErr) return permErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID parameter is required" },
        { status: 400 }
      );
    }

    if (id === session?.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own active administrator account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session!.user.id,
        action: "USER_DELETED",
        resource: "user",
        resourceId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 }
    );
  }
}
