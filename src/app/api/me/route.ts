import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        createdAt: true,
        department: {
          select: { id: true, name: true },
        },
        roles: {
          select: {
            role: {
              select: { name: true, description: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      status: user.status,
      department: user.department?.name || "Unassigned",
      roles: user.roles.map((r) => r.role.name),
      joinedAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { firstName, lastName, avatar } = body;

    const updateData: any = {};
    if (firstName && typeof firstName === "string") updateData.firstName = firstName.trim();
    if (lastName && typeof lastName === "string") updateData.lastName = lastName.trim();
    if (avatar !== undefined) updateData.avatar = avatar || null;

    const updatedUser = await prisma.user.update({
      where: { id: session!.user.id },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
