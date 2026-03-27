import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";
import { Button } from "@/components/ui/button";

const publicPageHighlights = [
  "Public intake form sections",
  "Input validation and error states",
  "Submission confirmation flow",
  "Clean handoff into the admin dashboard"
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public Route"
        title="Client Intake System"
        description="A lightweight intake flow for agencies and service businesses, now ready to capture real project requests."
        actions={
          <Button asChild>
            <Link href="/start-project">Start a project</Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderPanel
          title="What this page will contain"
          description="Use the dedicated start-project route for the live intake form while this page stays lightweight."
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            {publicPageHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PlaceholderPanel>

        <PlaceholderPanel
          title="MVP guardrails"
          description="The scaffold is intentionally light so we can add business logic in clear server and client boundaries later."
        >
          <p className="text-sm text-muted-foreground">
            Public intake submissions now live at <span className="font-medium text-foreground">/start-project</span>. Admin
            actions, AI generation, and email sending stay in server-only layers.
          </p>
        </PlaceholderPanel>
      </div>
    </div>
  );
}
