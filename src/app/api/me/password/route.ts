import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function POST(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { id: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Cannot change password for this user account" },
        { status: 400 }
      );
    }

    const isMatch = await compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newHash = await hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { passwordHash: newHash },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session!.user.id,
        action: "PASSWORD_CHANGED",
        resource: "user",
        resourceId: session!.user.id,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
