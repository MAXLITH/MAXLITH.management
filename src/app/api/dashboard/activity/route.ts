import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { session, errorResponse } = await getAuthSession();
  if (errorResponse) return errorResponse;

  try {
    const activities = await prisma.activity.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      activities.map((act) => ({
        id: act.id,
        action: act.action,
        resource: act.resource,
        resourceId: act.resourceId,
        resourceName: act.resourceName,
        actorName: act.actor
          ? `${act.actor.firstName} ${act.actor.lastName}`
          : "System",
        actorAvatar: act.actor?.avatar || null,
        createdAt: act.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
