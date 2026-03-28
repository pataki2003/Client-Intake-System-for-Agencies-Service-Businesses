import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const nextSteps = [
  "Your request has been received and added to the review queue.",
  "The team will review the project details, timing, and scope before replying.",
  "If the opportunity is a fit, the follow-up will include a clear recommended next step."
];

export default function SuccessPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <section className="space-y-5 border-b pb-8 md:pb-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-medium text-foreground">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            Request received
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Thank you. Your request has been received.</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              We&apos;ve received your details and shared them with the team for review. The follow-up will come with
              more context and a clearer next step.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-surface-cool px-4 py-4 text-sm">
          <p className="font-medium text-foreground">Your request has been saved.</p>
          <p className="mt-1 text-muted-foreground">We&apos;ll review it and follow up by email with the appropriate next step.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/start-project">Submit another request</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">What happens next</p>
              <CardTitle className="text-2xl">Your request is now under review.</CardTitle>
            </div>
            <CardDescription>The details you shared are now available to the team in the intake workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-xl border bg-surface-cool px-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="accent" className="border-border/70">
          <CardHeader className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Good to know</p>
              <CardTitle className="text-2xl">Clear next step. No obligation.</CardTitle>
            </div>
            <CardDescription>
              This intake simply gives the team the context needed to review the opportunity properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>If anything important changes, you can always send an updated request.</p>
            <p>The goal of this process is a clearer follow-up with less back-and-forth at the start.</p>
            <Button asChild className="w-full">
              <Link href="/start-project">Return to the intake form</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
