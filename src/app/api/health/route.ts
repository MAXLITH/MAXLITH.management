import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {};
  let overallStatus = "OPERATIONAL";

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "OPERATIONAL";
  } catch {
    checks.database = "OFFLINE";
    overallStatus = "DEGRADED";
  }

  // App check
  checks.application = "OPERATIONAL";

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      checks,
    },
    { status: overallStatus === "OPERATIONAL" ? 200 : 503 }
  );
}
