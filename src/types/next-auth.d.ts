import type { RoleName } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string | null;
      roles: RoleName[];
      permissions: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    roles: RoleName[];
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    roles: RoleName[];
    permissions: string[];
  }
}
