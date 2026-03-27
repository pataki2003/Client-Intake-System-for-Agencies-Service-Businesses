import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";
import { Button } from "@/components/ui/button";
import { INTAKE_STATUSES } from "@/types";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Route"
        title="Intake Dashboard"
        description="Placeholder dashboard for reviewing incoming client submissions."
        actions={
          <Button asChild>
            <Link href="/admin/intakes/demo-intake">Open sample intake</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <PlaceholderPanel
          title="Dashboard responsibilities"
          description="This page should surface the most important intake information first."
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Recent intake submissions</li>
            <li>Status overview and lightweight filtering</li>
            <li>Fast access to a detail page for each submission</li>
          </ul>
        </PlaceholderPanel>

        <PlaceholderPanel
          title="Suggested status pipeline"
          description="Shared status values are already typed for the rest of the app."
        >
          <div className="flex flex-wrap gap-2">
            {INTAKE_STATUSES.map((status) => (
              <span
                key={status}
                className="rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {status}
              </span>
            ))}
          </div>
        </PlaceholderPanel>
      </div>
    </div>
  );
}
