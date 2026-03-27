import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminDetailField } from "@/components/admin/admin-detail-field";
import { AdminJsonMetadata } from "@/components/admin/admin-json-metadata";
import { AdminDetailSectionNav } from "@/components/admin/admin-detail-section-nav";
import { InternalNotesPanel } from "@/components/admin/internal-notes-panel";
import { ProjectBriefPanel } from "@/components/admin/project-brief-panel";
import { InfoTile } from "@/components/shared/info-tile";
import {
  FormattedBudgetRange,
  FormattedDateTime,
  FormattedTimeline,
  IntakeStatusBadge
} from "@/components/shared/intake-display";
import { StatusUpdateForm } from "@/components/admin/status-update-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { extractAnswerValue } from "@/lib/intake/formatters";
import { adminIntakeIdSchema } from "@/lib/validations/admin-intakes";
import { cn } from "@/lib/utils";
import { requireAdminUser } from "@/server/auth/require-admin";
import { getAdminIntakeDetail } from "@/server/admin-intakes/get-admin-intake-detail";

type IntakeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const sectionNavItems = [
  { id: "overview", label: "Overview" },
  { id: "ai-brief", label: "AI Brief" },
  { id: "submitted-answers", label: "Submitted Answers" },
  { id: "workflow", label: "Workflow" },
  { id: "notes", label: "Notes" },
  { id: "metadata", label: "Metadata" }
];

export default async function IntakeDetailPage({ params }: IntakeDetailPageProps) {
  const { id } = await params;
  const parsedId = adminIntakeIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const adminUser = await requireAdminUser();
  const intake = await getAdminIntakeDetail(parsedId.data);

  if (!intake) {
    notFound();
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-3xl border border-border/70 bg-surface-cool p-4 shadow-sm sm:p-5 md:p-7">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link href="/admin" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Submissions
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-foreground">
                  Request details
                </span>
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-background/85 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary/75">
                  Review workspace
                </span>
                <IntakeStatusBadge status={intake.status} />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{intake.client.clientName}</h1>
                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base md:text-lg">
                  Review the request, internal brief, follow-up status, and team notes in one workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button asChild variant="outline" className="w-full rounded-full px-4 sm:w-auto">
                <Link href="/admin">
                  <span aria-hidden="true" className="mr-2 text-muted-foreground">
                    &lt;-
                  </span>
                  Back to submissions
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Return to the queue and continue reviewing submissions.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <InfoTile eyebrow="Service type" title={intake.serviceRequested} variant="highlight" />
            <InfoTile
              eyebrow="Budget range"
              title={
                <FormattedBudgetRange
                  value={intake.budgetRange}
                  className="text-sm font-medium text-foreground"
                  fallbackClassName="text-sm font-medium text-muted-foreground"
                />
              }
              variant="accent"
            />
            <InfoTile
              eyebrow="Submitted"
              title={
                <FormattedDateTime
                  value={intake.createdAt}
                  showRelative
                  className="space-y-1"
                  valueClassName="font-medium text-foreground"
                />
              }
              variant="muted"
            />
          </div>

          <AdminDetailSectionNav items={sectionNavItems} />
        </div>
      </section>

      <section className="xl:hidden">
        <Card variant="tinted" className="border-border/70 shadow-sm">
          <CardHeader className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Workflow</p>
              <CardTitle className="text-xl">Review workflow</CardTitle>
            </div>
            <CardDescription>Update status before moving deeper into the request.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-surface-sand p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Current status</p>
                  <p className="text-sm text-muted-foreground">Use this status to show where the request currently sits.</p>
                </div>
                <IntakeStatusBadge status={intake.status} />
              </div>
            </div>

            <StatusUpdateForm intakeId={intake.id} currentStatus={intake.status} idPrefix="mobile-intake-status" />
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.3fr)_380px] xl:items-start">
        <div className="space-y-5 sm:space-y-6">
          <section id="overview" className="scroll-mt-24 space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Overview</p>
                  <CardTitle className="text-2xl">Client details</CardTitle>
                </div>
                <CardDescription>Primary contact and company details attached to this request.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-surface-cool p-4">
                  <AdminDetailField label="Client name" value={intake.client.clientName} />
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-cool p-4">
                  <AdminDetailField label="Company" value={intake.client.companyName ?? "Not provided"} />
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-cool p-4">
                  <AdminDetailField
                    label="Email"
                    value={
                      <a href={`mailto:${intake.client.email}`} className="transition-colors hover:text-primary">
                        {intake.client.email}
                      </a>
                    }
                  />
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-cool p-4">
                  <AdminDetailField label="Phone" value={intake.client.phone ?? "Not provided"} />
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-cool p-4 md:col-span-2">
                  <AdminDetailField
                    label="Website"
                    value={
                      intake.client.website ? (
                        <a
                          href={intake.client.website}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all transition-colors hover:text-primary"
                        >
                          {intake.client.website}
                        </a>
                      ) : (
                        "Not provided"
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="accent" className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Request</p>
                  <CardTitle className="text-2xl">Project request</CardTitle>
                </div>
                <CardDescription>Core request details used for review, scoping, and follow-up.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6">
                <div className="grid gap-3 md:grid-cols-3">
                  <InfoTile eyebrow="Service type" title={intake.serviceRequested} />
                  <InfoTile eyebrow="Budget range" title={<FormattedBudgetRange value={intake.budgetRange} />} variant="accent" />
                  <InfoTile eyebrow="Timeline" title={<FormattedTimeline value={intake.timeline} />} variant="muted" />
                </div>

                <div className="grid gap-4 sm:gap-6">
                  <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
                    <AdminDetailField
                      label="Goal"
                      value={intake.projectSummary}
                      valueClassName="whitespace-pre-wrap text-sm leading-7"
                    />
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
                    <AdminDetailField
                      label="Problem description"
                      value={intake.currentChallenges ?? "Not provided"}
                      valueClassName="whitespace-pre-wrap text-sm leading-7"
                    />
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:p-5">
                    <AdminDetailField
                      label="Extra notes"
                      value={intake.additionalInfo ?? "Not provided"}
                      valueClassName="whitespace-pre-wrap text-sm leading-7"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="ai-brief" className="scroll-mt-24">
            <ProjectBriefPanel intakeId={intake.id} brief={intake.brief} />
          </section>

          <section id="submitted-answers" className="scroll-mt-24">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Original submission</p>
                  <CardTitle className="text-2xl">Submitted answers</CardTitle>
                </div>
                <CardDescription>The exact answers submitted through the public request form.</CardDescription>
              </CardHeader>
              <CardContent>
                {intake.answers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed bg-surface-cool px-4 py-6 text-sm text-muted-foreground">
                    No submitted answers were stored for this request.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {intake.answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className={cn(
                          "grid gap-3 rounded-2xl border border-border/70 bg-background px-4 py-4 shadow-sm md:grid-cols-[220px_minmax(0,1fr)] md:gap-5",
                          index === 0 && "border-[hsl(var(--surface-highlight-strong)/0.9)] bg-surface-highlight"
                        )}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            {answer.questionLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">Submitted through the public request form.</p>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                          {extractAnswerValue(answer.answerValue)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-5 sm:space-y-6 xl:sticky xl:top-6">
          <section id="workflow" className="hidden scroll-mt-24 xl:block">
            <Card variant="tinted" className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Workflow</p>
                  <CardTitle className="text-2xl">Review workflow</CardTitle>
                </div>
                <CardDescription>Keep the current status aligned with the latest team action.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-border/70 bg-surface-sand p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Current status</p>
                      <p className="text-sm text-muted-foreground">Use this status to show where the request currently sits.</p>
                    </div>
                    <IntakeStatusBadge status={intake.status} />
                  </div>
                </div>

                <StatusUpdateForm intakeId={intake.id} currentStatus={intake.status} idPrefix="desktop-intake-status" />
              </CardContent>
            </Card>
          </section>

          <section id="notes" className="scroll-mt-24">
            <InternalNotesPanel intakeId={intake.id} notes={intake.notes} currentAdminUserId={adminUser.id} />
          </section>

          <section id="metadata" className="scroll-mt-24">
            <Card variant="accent" className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Metadata</p>
                  <CardTitle className="text-2xl">Submission metadata</CardTitle>
                </div>
                <CardDescription>Supporting details recorded when this request was created and updated.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5">
                  <AdminDetailField
                    label="Created at"
                    value={<FormattedDateTime value={intake.createdAt} showRelative valueClassName="leading-6 text-foreground" />}
                  />
                  <AdminDetailField
                    label="Last updated"
                    value={<FormattedDateTime value={intake.updatedAt} showRelative valueClassName="leading-6 text-foreground" />}
                  />
                  <AdminDetailField
                    label="Confirmation email"
                    value={
                      <FormattedDateTime
                        value={intake.confirmationSentAt}
                        showRelative
                        fallback="Not sent yet"
                        fallbackClassName="text-sm text-muted-foreground"
                        valueClassName="leading-6 text-foreground"
                      />
                    }
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Source metadata</p>
                  <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                    <AdminJsonMetadata value={intake.sourceMetadata} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
