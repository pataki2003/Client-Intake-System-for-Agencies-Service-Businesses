import Link from "next/link";

import { InfoTile } from "@/components/shared/info-tile";
import { SectionHeader } from "@/components/shared/section-header";
import { StepCard } from "@/components/shared/step-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminSessionUser } from "@/server/auth/require-admin";

const productCapabilities = [
  "Capture structured project requests instead of sorting through vague inquiry messages.",
  "Keep submitted answers, notes, status, and follow-up context in one review workspace.",
  "Turn strong requests into concise working briefs without rewriting the original submission."
];

const whoItsFor = [
  "Agencies qualifying serious new business inquiries before the first call.",
  "Service businesses that need more structure than a contact form and less weight than a full CRM.",
  "Small teams that want better review discipline without adding a complicated sales stack."
];

const reasonsToChooseIt = [
  "The team gets scope, budget, goals, and constraints up front instead of chasing context later.",
  "Every request lands in a shared review flow instead of disappearing into one inbox.",
  "The brief gives the team a clean internal summary while preserving the original submission."
];

const flowSteps = [
  {
    step: "01",
    title: "Submit request",
    description: "Clients complete a focused request form that captures the essentials from the start."
  },
  {
    step: "02",
    title: "Review internally",
    description: "The team updates status, adds notes, and reviews the opportunity with full context."
  },
  {
    step: "03",
    title: "Generate brief",
    description: "Turn the request into a concise working brief with scope, questions, and next steps."
  }
];

export default async function HomePage() {
  const adminUser = await getAdminSessionUser();
  const secondaryCtaHref = adminUser ? "/admin" : "/login";
  const secondaryCtaLabel = adminUser ? "Open workspace" : "Admin sign in";

  return (
    <div className="space-y-10 sm:space-y-12 md:space-y-16">
      <section className="grid gap-6 rounded-[32px] border border-border/75 bg-background p-5 sm:gap-8 sm:p-7 md:p-8 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-start">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Badge variant="outline" className="px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
              Client Intake System
            </Badge>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                A more deliberate front door for project requests.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
                Capture the right context, review requests as a team, and move promising opportunities forward with a
                clear internal brief.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/start-project">Start a project request</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoTile
              eyebrow="Request"
              title="Structured from the start"
              description="Goals, budget, timing, and current challenges arrive together."
            />
            <InfoTile
              eyebrow="Review"
              title="Built for team use"
              description="Notes and workflow status stay attached to the original submission."
            />
            <InfoTile
              eyebrow="Brief"
              title="Ready for follow-up"
              description="Generate a working summary without losing the client's original wording."
            />
          </div>
        </div>

        <Card className="border-border/70">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <SectionHeader
              eyebrow="Product overview"
              title="Designed for a cleaner intake rhythm"
              description="A focused public request flow, a clear review workspace, and a concise brief for internal alignment."
              titleClassName="text-2xl"
            />

            <div className="grid gap-3">
              <InfoTile
                title="Structured requests"
                description="Collect scope, budget, goals, and decision-making context in one place."
              />
              <InfoTile
                title="Shared review"
                description="Keep status updates, notes, and submitted answers in one workspace."
              />
              <InfoTile
                title="Concise internal brief"
                description="Create a working summary the team can use before responding."
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 rounded-[32px] border border-border/75 bg-background p-5 sm:gap-6 sm:p-6 xl:grid-cols-[minmax(0,1.15fr)_0.95fr]">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="space-y-5 sm:space-y-6 p-4 sm:p-6">
            <SectionHeader
              eyebrow="What it does"
              title="Turn new inquiries into a reviewable workflow"
              description="The intake stays straightforward for the client while giving the team more useful context on day one."
              titleClassName="text-xl sm:text-2xl"
            />

            <div className="grid gap-3">
              {productCapabilities.map((item, index) => (
                <InfoTile key={item} eyebrow={`Benefit ${index + 1}`} title={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-border/70 shadow-sm">
            <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6">
              <SectionHeader
                eyebrow="Who it is for"
                title="A practical fit for lean teams"
                description="Best suited to teams that want a more intentional front door for new business."
                titleClassName="text-lg sm:text-xl"
              />

              <div className="grid gap-3">
                {whoItsFor.map((item) => (
                  <InfoTile key={item} title={item} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="border-border/70 shadow-sm">
            <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6">
              <SectionHeader
                eyebrow="Why it works better"
                title="More context, less avoidable follow-up"
                description="A standard contact form captures interest. This captures the information the team actually needs."
                titleClassName="text-lg sm:text-xl"
              />

              <div className="grid gap-3">
                {reasonsToChooseIt.map((item) => (
                  <InfoTile key={item} title={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-border/70 bg-background p-5 sm:space-y-6 sm:p-6">
        <SectionHeader
          eyebrow="How the flow works"
          title="A simple path from request to review"
          description="The client experience stays light, while the team gets a cleaner internal starting point."
          className="max-w-2xl"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((item) => (
            <StepCard key={item.step} step={item.step} title={item.title} description={item.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
