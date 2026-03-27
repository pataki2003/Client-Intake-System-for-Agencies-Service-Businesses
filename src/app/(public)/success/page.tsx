import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public Route"
        title="Project request received"
        description="Thanks for sharing your project details. Your request has been saved and is ready for internal review."
        actions={
          <Button asChild variant="secondary">
            <Link href="/start-project">Submit another request</Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What happens next</CardTitle>
            <CardDescription>We&apos;ll review the request and turn it into an internal project intake.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Your details are now stored in the intake system for the team to review.</p>
            <p>We&apos;ll use the information you shared to evaluate fit, scope, and the next conversation.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need to add context?</CardTitle>
            <CardDescription>If something important was missing, send a fresh request with the updated details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/start-project">Return to the intake form</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
