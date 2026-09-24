import { NextResponse } from "next/server";
import { getAuthSession, requirePermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap: Record<string, any> = {};

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  const permErr = requirePermission(
    session?.user.permissions,
    "MANAGE_SETTINGS"
  );
  if (permErr) return permErr;

  try {
    const body = await request.json();

    const updatePromises = Object.entries(body).map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      })
    );

    await Promise.all(updatePromises);

    await prisma.auditLog.create({
      data: {
        actorId: session!.user.id,
        action: "SETTINGS_UPDATED",
        resource: "settings",
        metadata: { keysUpdated: Object.keys(body) },
      },
    });

    return NextResponse.json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error updating system settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
