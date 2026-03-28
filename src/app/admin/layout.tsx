import type { ReactNode } from "react";

import { logoutAdmin } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdminUser } from "@/server/auth/require-admin";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await requireAdminUser();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" className="px-3 py-1 text-xs uppercase tracking-[0.16em]">
                Admin workspace
              </Badge>
              <Badge variant="highlight" className="px-3 py-1 text-xs uppercase tracking-[0.16em]">
                Session active
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">Operations workspace</p>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Signed in as {adminUser.email ?? "Admin"}. Review submissions, keep follow-up organized, and move each
                request through the review process in one place.
              </p>
            </div>
          </div>

          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" className="min-w-[120px]">
              Sign out
            </Button>
          </form>
        </div>
      </section>

      {children}
    </div>
  );
}
