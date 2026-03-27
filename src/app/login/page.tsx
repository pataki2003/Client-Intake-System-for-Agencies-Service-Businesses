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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Route"
        title="Admin access"
        description="Use your admin credentials to access intake submissions, project notes, and status updates."
      />

      <AdminLoginForm />
    </div>
  );
}
