import type { ReactNode } from "react";

import { logoutAdmin } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { requireAdminUser } from "@/server/auth/require-admin";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await requireAdminUser();

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Protected Admin Area</p>
          <div>
            <p className="text-lg font-semibold tracking-tight">Signed in as {adminUser.email ?? "Admin"}</p>
            <p className="text-sm text-muted-foreground">Review submissions, manage statuses, and keep internal notes in one place.</p>
          </div>
        </div>

        <form action={logoutAdmin}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>

      {children}
    </div>
  );
}
