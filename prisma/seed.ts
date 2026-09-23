import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { ROLE_PERMISSIONS } from "../src/lib/rbac";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/maxlith_management?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding MAXLITH Management database...\n");

  // ============================================
  // 1. Create Roles & Permissions
  // ============================================
  console.log("Creating roles and permissions...");

  const roleNames = Object.keys(ROLE_PERMISSIONS) as Array<keyof typeof ROLE_PERMISSIONS>;

  for (const roleName of roleNames) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: roleName.replace(/_/g, " "),
      },
    });

    const permissions = ROLE_PERMISSIONS[roleName];
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permission: {
            roleId: role.id,
            permission,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permission,
        },
      });
    }
  }

  console.log(`  ✓ ${roleNames.length} roles created with permissions`);

  // ============================================
  // 2. Create Departments
  // ============================================
  console.log("Creating departments...");

  const departments = [
    { name: "Engineering", description: "Software engineering and development" },
    { name: "AI/ML", description: "Artificial intelligence and machine learning" },
    { name: "Product", description: "Product management and strategy" },
    { name: "Design", description: "UI/UX design and branding" },
    { name: "Operations", description: "Business operations and administration" },
    { name: "HR", description: "Human resources and people management" },
    { name: "Management", description: "Executive management and leadership" },
  ];

  const deptMap: Record<string, string> = {};

  for (const dept of departments) {
    const created = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    deptMap[dept.name] = created.id;
  }

  console.log(`  ✓ ${departments.length} departments created`);

  // ============================================
  // 3. Create Users
  // ============================================
  console.log("Creating users...");

  const passwordHash = await hash("maxlith2024", 12);

  const users = [
    {
      email: "admin@maxlith.com",
      firstName: "Saran",
      lastName: "V",
      role: "SUPER_ADMIN",
      department: "Management",
    },
    {
      email: "manager@maxlith.com",
      firstName: "Arun",
      lastName: "R",
      role: "ADMIN",
      department: "Engineering",
    },
    {
      email: "lead@maxlith.com",
      firstName: "Priya",
      lastName: "K",
      role: "MANAGER",
      department: "Engineering",
    },
    {
      email: "dev1@maxlith.com",
      firstName: "Rahul",
      lastName: "N",
      role: "DEVELOPER",
      department: "Engineering",
    },
    {
      email: "dev2@maxlith.com",
      firstName: "Deepa",
      lastName: "S",
      role: "DEVELOPER",
      department: "AI/ML",
    },
    {
      email: "designer@maxlith.com",
      firstName: "Karthik",
      lastName: "M",
      role: "DESIGNER",
      department: "Design",
    },
    {
      email: "ds@maxlith.com",
      firstName: "Meera",
      lastName: "R",
      role: "DATA_SCIENTIST",
      department: "AI/ML",
    },
    {
      email: "intern@maxlith.com",
      firstName: "Vikram",
      lastName: "J",
      role: "INTERN",
      department: "Engineering",
    },
  ];

  const userMap: Record<string, string> = {};

  for (const userData of users) {
    const role = await prisma.role.findUnique({ where: { name: userData.role } });
    if (!role) continue;

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        status: "ACTIVE",
        departmentId: deptMap[userData.department],
        roles: {
          create: { roleId: role.id },
        },
      },
    });

    userMap[userData.email] = user.id;

    // Create leave balance
    await prisma.leaveBalance.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        casual: 12,
        sick: 10,
        annual: 15,
        emergency: 5,
      },
    });
  }

  console.log(`  ✓ ${users.length} users created`);

  // ============================================
  // 4. Create Projects
  // ============================================
  console.log("Creating projects...");

  const adminId = userMap["admin@maxlith.com"];
  const managerId = userMap["manager@maxlith.com"];
  const leadId = userMap["lead@maxlith.com"];

  const projects = [
    {
      name: "MAXLITH Trading Platform",
      description: "Core AI-based trading platform with real-time market analysis, automated trading strategies, and portfolio management.",
      status: "ACTIVE" as const,
      priority: "HIGH" as const,
      managerId,
      techStack: ["Next.js", "Python", "TensorFlow", "PostgreSQL", "Redis", "WebSocket"],
      repositoryUrl: "https://github.com/maxlith/trading-platform",
      createdById: adminId,
    },
    {
      name: "MAXLITH AI Engine",
      description: "Machine learning models for market prediction, sentiment analysis, and risk assessment.",
      status: "ACTIVE" as const,
      priority: "URGENT" as const,
      managerId: leadId,
      techStack: ["Python", "PyTorch", "FastAPI", "Docker", "Kubernetes"],
      repositoryUrl: "https://github.com/maxlith/ai-engine",
      createdById: adminId,
    },
    {
      name: "MAXLITH Website",
      description: "Company marketing website and product landing pages.",
      status: "ACTIVE" as const,
      priority: "MEDIUM" as const,
      managerId,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      repositoryUrl: "https://github.com/maxlith/website",
      createdById: managerId,
    },
    {
      name: "MAXLITH Mobile App",
      description: "iOS and Android mobile application for the trading platform.",
      status: "PLANNING" as const,
      priority: "MEDIUM" as const,
      managerId: leadId,
      techStack: ["React Native", "TypeScript", "Redux"],
      createdById: adminId,
    },
  ];

  const projectMap: Record<string, string> = {};

  for (const proj of projects) {
    const project = await prisma.project.create({ data: proj });
    projectMap[proj.name] = project.id;
  }

  // Add project members
  const devEmails = ["dev1@maxlith.com", "dev2@maxlith.com", "lead@maxlith.com"];
  for (const email of devEmails) {
    if (userMap[email]) {
      await prisma.projectMember.create({
        data: {
          projectId: projectMap["MAXLITH Trading Platform"],
          userId: userMap[email],
          role: email.includes("lead") ? "LEAD" : "DEVELOPER",
        },
      });
    }
  }

  console.log(`  ✓ ${projects.length} projects created`);

  // ============================================
  // 5. Create Tasks
  // ============================================
  console.log("Creating tasks...");

  const tasks = [
    {
      title: "Build authentication system",
      description: "Implement secure login with JWT tokens, session management, and RBAC integration.",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev1@maxlith.com"],
      createdById: leadId,
      tags: ["auth", "security", "backend"],
    },
    {
      title: "Create trading dashboard UI",
      description: "Design and implement the main trading dashboard with real-time charts, portfolio overview, and trade execution panel.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev1@maxlith.com"],
      createdById: leadId,
      tags: ["frontend", "dashboard", "ui"],
    },
    {
      title: "Implement REST API endpoints",
      description: "Create all required REST API endpoints for the trading platform with proper validation and error handling.",
      status: "IN_REVIEW" as const,
      priority: "HIGH" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev2@maxlith.com"],
      createdById: leadId,
      tags: ["api", "backend"],
    },
    {
      title: "Train sentiment analysis model",
      description: "Develop and train NLP model for financial news sentiment analysis using transformer architecture.",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      projectId: projectMap["MAXLITH AI Engine"],
      assigneeId: userMap["ds@maxlith.com"],
      createdById: adminId,
      tags: ["ai", "nlp", "model"],
    },
    {
      title: "Write API documentation",
      description: "Create comprehensive API documentation for all trading platform endpoints.",
      status: "TODO" as const,
      priority: "MEDIUM" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev1@maxlith.com"],
      createdById: managerId,
      tags: ["documentation"],
    },
    {
      title: "Design mobile app wireframes",
      description: "Create wireframes and mockups for the MAXLITH mobile trading application.",
      status: "TODO" as const,
      priority: "MEDIUM" as const,
      projectId: projectMap["MAXLITH Mobile App"],
      assigneeId: userMap["designer@maxlith.com"],
      createdById: leadId,
      tags: ["design", "mobile", "ui"],
    },
    {
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing, building, and deployment.",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev2@maxlith.com"],
      createdById: managerId,
      tags: ["devops", "ci-cd"],
    },
    {
      title: "Implement WebSocket real-time data feed",
      description: "Set up WebSocket connections for real-time market data streaming.",
      status: "BLOCKED" as const,
      priority: "URGENT" as const,
      projectId: projectMap["MAXLITH Trading Platform"],
      assigneeId: userMap["dev1@maxlith.com"],
      createdById: leadId,
      tags: ["websocket", "realtime", "backend"],
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`  ✓ ${tasks.length} tasks created`);

  // ============================================
  // 6. Create Announcements
  // ============================================
  console.log("Creating announcements...");

  await prisma.announcement.create({
    data: {
      title: "MAXLITH V2 Development Kickoff",
      content: "We are excited to announce the start of MAXLITH Trading Platform V2 development. The new version will include advanced AI-powered trading strategies, improved real-time analytics, and a completely redesigned user interface. Team leads will schedule kickoff meetings this week.",
      authorId: adminId,
      priority: "HIGH",
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Office Hours Update",
      content: "Starting next week, office hours will be 9:30 AM to 6:30 PM IST. Flexible working hours are available for engineering team members with prior approval from team leads.",
      authorId: adminId,
      priority: "NORMAL",
    },
  });

  console.log("  ✓ 2 announcements created");

  // ============================================
  // 7. Create Document Categories
  // ============================================
  console.log("Creating document categories...");

  const categories = [
    "Company", "Engineering", "Trading Platform", "AI/ML",
    "Frontend", "Backend", "DevOps", "Security", "HR", "Onboarding",
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    });
  }

  console.log(`  ✓ ${categories.length} document categories created`);

  // ============================================
  // 8. Create Activity
  // ============================================
  console.log("Creating activity feed...");

  const activities = [
    { actorId: adminId, action: "CREATED", resource: "project", resourceName: "MAXLITH Trading Platform" },
    { actorId: userMap["dev1@maxlith.com"], action: "COMPLETED", resource: "task", resourceName: "Build authentication system" },
    { actorId: userMap["dev2@maxlith.com"], action: "PUSHED", resource: "code", resourceName: "API validation changes" },
    { actorId: userMap["lead@maxlith.com"], action: "CREATED", resource: "document", resourceName: "API Integration Guide" },
    { actorId: adminId, action: "APPROVED", resource: "leave", resourceName: "Deepa S leave request" },
  ];

  for (const activity of activities) {
    await prisma.activity.create({ data: activity });
  }

  console.log(`  ✓ ${activities.length} activities created`);

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📋 Login credentials:");
  console.log("   Email: admin@maxlith.com");
  console.log("   Password: maxlith2024");
  console.log("\n   All users share the same password: maxlith2024");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
