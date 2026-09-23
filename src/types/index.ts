/* ============================================
   MAXLITH MANAGEMENT — Type Definitions
   ============================================ */

// ---- User & Auth ----

export type UserStatus = "ACTIVE" | "SUSPENDED" | "ONBOARDING" | "OFFBOARDED";

export type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "TEAM_LEAD"
  | "DEVELOPER"
  | "DESIGNER"
  | "DATA_SCIENTIST"
  | "INTERN"
  | "EMPLOYEE";

export type Permission =
  | "VIEW_PROJECTS"
  | "CREATE_PROJECT"
  | "EDIT_PROJECT"
  | "DELETE_PROJECT"
  | "VIEW_TASKS"
  | "CREATE_TASK"
  | "EDIT_TASK"
  | "DELETE_TASK"
  | "VIEW_USERS"
  | "CREATE_USER"
  | "EDIT_USER"
  | "SUSPEND_USER"
  | "VIEW_DOCUMENTATION"
  | "CREATE_DOCUMENTATION"
  | "EDIT_DOCUMENTATION"
  | "DELETE_DOCUMENTATION"
  | "VIEW_REPORTS"
  | "CREATE_REPORT"
  | "VIEW_ALL_REPORTS"
  | "MANAGE_LEAVE"
  | "APPLY_LEAVE"
  | "APPROVE_LEAVE"
  | "VIEW_ANNOUNCEMENTS"
  | "CREATE_ANNOUNCEMENT"
  | "MANAGE_GITHUB"
  | "VIEW_GITHUB"
  | "VIEW_FILES"
  | "UPLOAD_FILES"
  | "DELETE_FILES"
  | "VIEW_MEETINGS"
  | "CREATE_MEETING"
  | "VIEW_ANALYTICS"
  | "MANAGE_SETTINGS"
  | "ADMIN_ACCESS"
  | "MANAGE_ROLES"
  | "VIEW_AUDIT_LOGS"
  | "MANAGE_DEPARTMENTS"
  | "USE_AI";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  status: UserStatus;
  departmentId?: string | null;
  department?: Department | null;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  permissions: RolePermission[];
}

export interface RolePermission {
  id: string;
  roleId: string;
  permission: Permission;
}

// ---- Department ----

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  managerId?: string | null;
  manager?: User | null;
  members?: User[];
  _count?: { members: number };
}

// ---- Project ----

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline?: Date | null;
  managerId?: string | null;
  manager?: User | null;
  repositoryUrl?: string | null;
  techStack?: string[];
  createdById: string;
  createdBy?: User;
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number; members: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  user?: User;
  project?: Project;
}

// ---- Task ----

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string | null;
  project?: Project | null;
  assigneeId?: string | null;
  assignee?: User | null;
  createdById: string;
  createdBy?: User;
  deadline?: Date | null;
  tags?: string[];
  comments?: TaskComment[];
  _count?: { comments: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: Date;
}

// ---- Leave ----

export type LeaveType = "CASUAL" | "SICK" | "ANNUAL" | "EMERGENCY" | "OTHER";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: User;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approverId?: string | null;
  approver?: User | null;
  createdAt: Date;
}

export interface LeaveBalance {
  id: string;
  userId: string;
  casual: number;
  sick: number;
  annual: number;
  emergency: number;
}

// ---- Announcement ----

export type AnnouncementPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  priority: AnnouncementPriority;
  isPinned: boolean;
  createdAt: Date;
}

// ---- Meeting ----

export type MeetingType = "TEAM" | "PROJECT" | "CLIENT" | "TECHNICAL" | "MANAGEMENT";

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  date: Date;
  time: string;
  projectId?: string | null;
  project?: Project | null;
  createdById: string;
  createdBy?: User;
  meetingLink?: string | null;
  type: MeetingType;
  participants?: MeetingParticipant[];
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  userId: string;
  user?: User;
}

// ---- Notification ----

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED"
  | "MENTION"
  | "PROJECT_UPDATE"
  | "GITHUB_PR"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "ANNOUNCEMENT"
  | "MEETING_REMINDER"
  | "REPORT_REMINDER"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceId?: string | null;
  resourceType?: string | null;
  isRead: boolean;
  createdAt: Date;
}

// ---- Daily Report ----

export interface DailyReport {
  id: string;
  userId: string;
  user?: User;
  projectId?: string | null;
  project?: Project | null;
  workedOn: string;
  completed: string;
  nextTasks: string;
  blockers?: string | null;
  hoursWorked: number;
  date: Date;
  createdAt: Date;
}

// ---- Activity ----

export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "COMPLETED"
  | "ASSIGNED"
  | "COMMENTED"
  | "UPLOADED"
  | "APPROVED"
  | "REJECTED"
  | "PUSHED"
  | "MERGED"
  | "CONNECTED"
  | "LOGGED_IN";

export interface Activity {
  id: string;
  actorId: string;
  actor?: User;
  action: ActivityAction;
  resource: string;
  resourceId?: string | null;
  resourceName?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ---- Audit Log ----

export interface AuditLog {
  id: string;
  actorId: string;
  actor?: User;
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: Date;
}

// ---- Dashboard ----

export interface DashboardStats {
  myTasks: number;
  activeProjects: number;
  pendingTasks: number;
  completedTasks: number;
  upcomingMeetings: number;
  leaveBalance: number;
  unreadAnnouncements: number;
  pendingReviews: number;
}

// ---- Session ----

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  roles: RoleName[];
  permissions: Permission[];
}
