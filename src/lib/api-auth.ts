import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Permission } from "@/types";

/**
 * Get the authenticated session or return a 401 response.
 * Use in API routes:
 *   const { session, errorResponse } = await getAuthSession();
 *   if (errorResponse) return errorResponse;
 */
export async function getAuthSession() {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { session, errorResponse: null };
}

/**
 * Check if the session user has the required permission.
 * Returns a 403 response if not.
 */
export function requirePermission(
  permissions: string[] | undefined,
  required: Permission
) {
  if (!permissions?.includes(required)) {
    return NextResponse.json(
      { error: "Forbidden: insufficient permissions" },
      { status: 403 }
    );
  }
  return null;
}
