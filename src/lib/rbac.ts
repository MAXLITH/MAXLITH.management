/* ============================================
   MAXLITH MANAGEMENT — RBAC System
   Role-Based Access Control
   ============================================ */

import type { Permission, RoleName } from "@/types";

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  SUPER_ADMIN: [
    "VIEW_PROJECTS", "CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK", "DELETE_TASK",
    "VIEW_USERS", "CREATE_USER", "EDIT_USER", "SUSPEND_USER",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION", "DELETE_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT", "VIEW_ALL_REPORTS",
    "MANAGE_LEAVE", "APPLY_LEAVE", "APPROVE_LEAVE",
    "VIEW_ANNOUNCEMENTS", "CREATE_ANNOUNCEMENT",
    "MANAGE_GITHUB", "VIEW_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES", "DELETE_FILES",
    "VIEW_MEETINGS", "CREATE_MEETING",
    "VIEW_ANALYTICS", "MANAGE_SETTINGS", "ADMIN_ACCESS",
    "MANAGE_ROLES", "VIEW_AUDIT_LOGS", "MANAGE_DEPARTMENTS", "USE_AI",
  ],
  ADMIN: [
    "VIEW_PROJECTS", "CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK", "DELETE_TASK",
    "VIEW_USERS", "CREATE_USER", "EDIT_USER", "SUSPEND_USER",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION", "DELETE_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT", "VIEW_ALL_REPORTS",
    "MANAGE_LEAVE", "APPLY_LEAVE", "APPROVE_LEAVE",
    "VIEW_ANNOUNCEMENTS", "CREATE_ANNOUNCEMENT",
    "MANAGE_GITHUB", "VIEW_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES", "DELETE_FILES",
    "VIEW_MEETINGS", "CREATE_MEETING",
    "VIEW_ANALYTICS", "MANAGE_SETTINGS", "ADMIN_ACCESS",
    "MANAGE_ROLES", "VIEW_AUDIT_LOGS", "MANAGE_DEPARTMENTS", "USE_AI",
  ],
  MANAGER: [
    "VIEW_PROJECTS", "CREATE_PROJECT", "EDIT_PROJECT",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK",
    "VIEW_USERS",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT", "VIEW_ALL_REPORTS",
    "APPLY_LEAVE", "APPROVE_LEAVE",
    "VIEW_ANNOUNCEMENTS", "CREATE_ANNOUNCEMENT",
    "VIEW_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES",
    "VIEW_MEETINGS", "CREATE_MEETING",
    "VIEW_ANALYTICS", "USE_AI",
  ],
  TEAM_LEAD: [
    "VIEW_PROJECTS", "CREATE_PROJECT", "EDIT_PROJECT",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK",
    "VIEW_USERS",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT", "VIEW_ALL_REPORTS",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES",
    "VIEW_MEETINGS", "CREATE_MEETING",
    "VIEW_ANALYTICS", "USE_AI",
  ],
  DEVELOPER: [
    "VIEW_PROJECTS",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_GITHUB", "MANAGE_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES",
    "VIEW_MEETINGS",
    "USE_AI",
  ],
  DESIGNER: [
    "VIEW_PROJECTS",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_FILES", "UPLOAD_FILES",
    "VIEW_MEETINGS",
    "USE_AI",
  ],
  DATA_SCIENTIST: [
    "VIEW_PROJECTS",
    "VIEW_TASKS", "CREATE_TASK", "EDIT_TASK",
    "VIEW_DOCUMENTATION", "CREATE_DOCUMENTATION", "EDIT_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_GITHUB",
    "VIEW_FILES", "UPLOAD_FILES",
    "VIEW_MEETINGS",
    "USE_AI",
  ],
  INTERN: [
    "VIEW_PROJECTS",
    "VIEW_TASKS", "EDIT_TASK",
    "VIEW_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_FILES",
    "VIEW_MEETINGS",
  ],
  EMPLOYEE: [
    "VIEW_PROJECTS",
    "VIEW_TASKS",
    "VIEW_DOCUMENTATION",
    "VIEW_REPORTS", "CREATE_REPORT",
    "APPLY_LEAVE",
    "VIEW_ANNOUNCEMENTS",
    "VIEW_FILES",
    "VIEW_MEETINGS",
  ],
};

/**
 * Check if a user with given permissions has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has ANY of the required permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if a user has ALL of the required permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}

/**
 * Check if a user has a specific role
 */
export function hasRole(userRoles: RoleName[], requiredRole: RoleName): boolean {
  return userRoles.includes(requiredRole);
}

/**
 * Check if a user has any of the admin roles
 */
export function isAdmin(userRoles: RoleName[]): boolean {
  return userRoles.some((r) => r === "SUPER_ADMIN" || r === "ADMIN");
}

/**
 * Check if user is manager-level or above
 */
export function isManagerOrAbove(userRoles: RoleName[]): boolean {
  return userRoles.some(
    (r) => r === "SUPER_ADMIN" || r === "ADMIN" || r === "MANAGER" || r === "TEAM_LEAD"
  );
}

/**
 * Get all permissions for a set of roles
 */
export function getPermissionsForRoles(roles: RoleName[]): Permission[] {
  const permSet = new Set<Permission>();
  for (const role of roles) {
    const perms = ROLE_PERMISSIONS[role];
    if (perms) {
      perms.forEach((p) => permSet.add(p));
    }
  }
  return Array.from(permSet);
}
