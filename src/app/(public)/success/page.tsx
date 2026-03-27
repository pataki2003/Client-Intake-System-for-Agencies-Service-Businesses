import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public Route"
        title="Submission Received"
        description="Placeholder success screen shown after a client submits the intake form."
        actions={
          <Button asChild variant="secondary">
            <Link href="/">Back to intake form</Link>
          </Button>
        }
      />

      <PlaceholderPanel
        title="What belongs here"
        description="A short confirmation message, expected next steps, and optional contact details for follow-up."
      >
        <p className="text-sm text-muted-foreground">
          Keep this page short and reassuring. It should confirm that the submission worked without exposing internal processing details.
        </p>
      </PlaceholderPanel>
    </div>
  );
}
