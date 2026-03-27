import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSessionUser } from "@/server/auth/require-admin";

const productCapabilities = [
  "Capture structured project requests instead of open-ended messages.",
  "Keep client details, answers, notes, and status in one admin workflow.",
  "Generate a usable internal project brief without rewriting the submission by hand."
];

const whoItsFor = [
  "Agencies qualifying new project inquiries before the first call.",
  "Service businesses that need a cleaner intake and internal handoff.",
  "Small teams that want more structure than a contact form without adopting a heavyweight CRM."
];

const reasonsToChooseIt = [
  "A generic contact form creates follow-up work. This captures budget, goals, challenges, and project context up front.",
  "Submissions move directly into an admin workflow instead of getting buried in an inbox.",
  "The AI brief turns raw intake data into an internal summary your team can actually act on."
];

const flowSteps = [
  {
    step: "01",
    title: "Submit request",
    description: "Clients complete a focused intake form that captures the information your team needs from the start."
  },
  {
    step: "02",
    title: "Review internally",
    description: "Your team reviews the submission, updates status, and adds internal notes before responding."
  },
  {
    step: "03",
    title: "Generate AI brief",
    description: "Turn the intake into a structured internal brief that sharpens scope, questions, and next steps."
  }
];

export default async function HomePage() {
  const adminUser = await getAdminSessionUser();
  const secondaryCtaHref = adminUser ? "/admin" : "/login";
  const secondaryCtaLabel = adminUser ? "Open dashboard" : "Admin login";

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-start">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Client Intake System</p>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              A cleaner way to turn project inquiries into qualified, actionable briefs.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Capture the right details upfront, review submissions internally, and turn every serious inquiry into a
              structured next step for your team.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/start-project">Start your request</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border/80 bg-card/70">
          <CardHeader>
            <CardTitle className="text-xl">Built for a sharper intake handoff</CardTitle>
            <CardDescription>
              Replace vague contact form submissions with a lightweight intake workflow your team can review and act on.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-background px-4 py-3">
              <p className="text-sm font-medium">Structured intake</p>
              <p className="mt-1 text-sm text-muted-foreground">Collect scope, budget, goals, and context in one place.</p>
            </div>
            <div className="rounded-xl border bg-background px-4 py-3">
              <p className="text-sm font-medium">Internal review</p>
              <p className="mt-1 text-sm text-muted-foreground">Status updates and notes stay tied to the original request.</p>
            </div>
            <div className="rounded-xl border bg-background px-4 py-3">
              <p className="text-sm font-medium">AI-ready brief</p>
              <p className="mt-1 text-sm text-muted-foreground">Generate a concise internal brief without reformatting the intake.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What it does</CardTitle>
            <CardDescription>Moves new inquiries from raw submission to internal clarity without adding process overhead.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {productCapabilities.map((item) => (
                <li key={item} className="rounded-xl border bg-background px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Who it is for</CardTitle>
            <CardDescription>Best suited to teams that want a more intentional front door for new business.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {whoItsFor.map((item) => (
                <li key={item} className="rounded-xl border bg-background px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">How the flow works</p>
          <h2 className="text-3xl font-semibold tracking-tight">A compact workflow from submission to internal brief.</h2>
          <p className="text-muted-foreground">
            The intake stays lightweight for the client and structured for your team from the moment it arrives.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((item) => (
            <Card key={item.step} className="h-full">
              <CardHeader className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.step}</p>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Why it is better than a generic contact form</CardTitle>
            <CardDescription>
              A standard contact form captures intent. This product captures the context your team needs to move.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {reasonsToChooseIt.map((item) => (
              <div key={item} className="rounded-xl border bg-background px-4 py-4">
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
