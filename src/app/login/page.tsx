import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { PageHeader } from "@/components/shared/page-header";
import { getAdminSessionUser } from "@/server/auth/require-admin";

export default async function LoginPage() {
  const adminUser = await getAdminSessionUser();

  if (adminUser) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Admin workspace"
        title="Sign in to continue"
        description="Use your admin account to review submissions, notes, statuses, and project briefs."
      />

      <AdminLoginForm />
    </div>
  );
}
