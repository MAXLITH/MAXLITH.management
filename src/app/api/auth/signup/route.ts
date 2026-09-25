import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    // Get default role
    const defaultRole =
      (await prisma.role.findUnique({ where: { name: "EMPLOYEE" } })) ||
      (await prisma.role.findUnique({ where: { name: "DEVELOPER" } }));

    // Create user
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        passwordHash,
        firstName: trimmedEmail.split("@")[0],
        lastName: "",
        status: "ACTIVE",
        roles: defaultRole
          ? { create: { roleId: defaultRole.id } }
          : undefined,
        leaveBalance: {
          create: {
            casual: 12,
            sick: 10,
            annual: 15,
            emergency: 5,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
