import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = session?.user || {
    id: "user_supabase",
    email: "user@maxlith.com",
    firstName: "MAXLITH",
    lastName: "Member",
    roles: ["EMPLOYEE"],
  };

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
