import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { getPermissionsForRoles } from "@/lib/rbac";
import type { RoleName } from "@/types";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              roles: {
                include: {
                  role: {
                    include: {
                      permissions: true,
                    },
                  },
                },
              },
              department: true,
            },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          if (user.status === "SUSPENDED" || user.status === "OFFBOARDED") {
            return null;
          }

          const isPasswordValid = await compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          const roleNames = user.roles.map((ur: any) => ur.role.name as RoleName);
          const permissions = getPermissionsForRoles(roleNames);

          // Log login to audit
          try {
            await prisma.auditLog.create({
              data: {
                actorId: user.id,
                action: "USER_LOGIN",
                resource: "auth",
                resourceId: user.id,
                metadata: {},
              },
            });
          } catch (auditError) {
            console.error("Failed to write audit log on login:", auditError);
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            roles: roleNames,
            permissions,
          };
        } catch (error) {
          console.error("Error in NextAuth authorize callback:", error);
          return null;
        }
      },
    }),
  ],
});
