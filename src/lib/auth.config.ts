import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "maxlith_dev_auth_secret_key_32_characters_minimum_length_required",
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
        token.id = (user.id || token.sub) as string;
        token.firstName =
          (u.firstName as string) ||
          (user.name ? user.name.split(" ")[0] : "") ||
          "User";
        token.lastName =
          (u.lastName as string) ||
          (user.name ? user.name.split(" ").slice(1).join(" ") : "") ||
          "";
        token.avatar = (u.avatar as string | null) || user.image || null;
        token.roles = (u.roles as any[]) || ["MEMBER"];
        token.permissions = (u.permissions as string[]) || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id || token.sub) as string;
        session.user.firstName = (token.firstName as string) || "";
        session.user.lastName = (token.lastName as string) || "";
        session.user.avatar = (token.avatar as string | null) || null;
        session.user.roles = (token.roles as any[]) || ["MEMBER"];
        session.user.permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
};
