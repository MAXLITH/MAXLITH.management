import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Added in auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.id = user.id;
        token.firstName = u.firstName as string;
        token.lastName = u.lastName as string;
        token.avatar = u.avatar as string | null;
        token.roles = u.roles as string[];
        token.permissions = u.permissions as string[];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.avatar = token.avatar as string | null;
        session.user.roles = token.roles as any[];
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
};
