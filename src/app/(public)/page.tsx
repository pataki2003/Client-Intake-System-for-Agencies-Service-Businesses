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
        title="Client Intake Form"
        description="Starter page for the external lead capture flow. This route is ready for form UI and validation wiring."
        actions={
          <Button asChild>
            <Link href="/success">View success page</Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderPanel
          title="What this page will contain"
          description="Keep the public experience focused on collecting the essentials without exposing internal workflows."
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
            Use this route for the public intake form only. Admin actions, AI generation, and email sending should stay in server-only layers.
          </p>
        </PlaceholderPanel>
      </div>
    </div>
  );
}
