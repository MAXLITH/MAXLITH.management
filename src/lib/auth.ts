import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { getPermissionsForRoles } from "@/lib/rbac";
import type { RoleName } from "@/types";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId:
        process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET ||
        process.env.GOOGLE_CLIENT_SECRET ||
        "",
    }),
    GitHub({
      clientId:
        process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret:
        process.env.AUTH_GITHUB_SECRET ||
        process.env.GITHUB_CLIENT_SECRET ||
        "",
    }),
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

        const email = (credentials.email as string).trim().toLowerCase();
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

          const roleNames = user.roles.map(
            (ur: any) => ur.role.name as RoleName
          );
          const permissions = getPermissionsForRoles(roleNames);

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
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      // Execute base jwt callback safely
      if (authConfig.callbacks?.jwt) {
        const baseToken = await authConfig.callbacks.jwt({ token, user, account } as any);
        if (baseToken) {
          token = baseToken;
        }
      }

      // Handle OAuth sign-in user resolution from Prisma database
      if (user && account && (account.provider === "google" || account.provider === "github")) {
        try {
          const email = user.email?.toLowerCase().trim();
          if (email) {
            let dbUser = await prisma.user.findUnique({
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
              },
            });

            // If OAuth user does not exist in DB, create user with default EMPLOYEE role
            if (!dbUser) {
              const nameParts = (user.name || "").trim().split(" ");
              const firstName = nameParts[0] || "User";
              const lastName = nameParts.slice(1).join(" ") || "";
              
              const defaultRole = (await prisma.role.findUnique({ where: { name: "EMPLOYEE" } })) ||
                (await prisma.role.findUnique({ where: { name: "DEVELOPER" } }));

              dbUser = await prisma.user.create({
                data: {
                  email,
                  firstName,
                  lastName,
                  avatar: user.image,
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
                },
              });
            } else if (user.image && dbUser.avatar !== user.image) {
              // Sync user profile avatar if updated
              dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: { avatar: user.image },
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
                },
              });
            }

            const roleNames = dbUser.roles.map(
              (ur: any) => ur.role.name as RoleName
            );
            const roles = roleNames.length > 0 ? roleNames : (["EMPLOYEE"] as RoleName[]);
            const permissions = getPermissionsForRoles(roles);

            token.id = dbUser.id;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.avatar = dbUser.avatar || user.image || null;
            token.roles = roles;
            token.permissions = permissions;
          }
        } catch (dbError) {
          console.error("Error linking OAuth user to database:", dbError);
          if (!token.roles || (token.roles as string[]).length === 0) {
            token.roles = ["EMPLOYEE"];
            token.permissions = getPermissionsForRoles(["EMPLOYEE"]);
          }
        }
      }

      return token;
    },
  },
});
