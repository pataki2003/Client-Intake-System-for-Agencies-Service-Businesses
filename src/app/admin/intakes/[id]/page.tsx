import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminDetailField } from "@/components/admin/admin-detail-field";
import { AdminJsonMetadata } from "@/components/admin/admin-json-metadata";
import { AdminDetailSectionNav } from "@/components/admin/admin-detail-section-nav";
import { InternalNotesPanel } from "@/components/admin/internal-notes-panel";
import { ProjectBriefPanel } from "@/components/admin/project-brief-panel";
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
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link href="/admin" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Submission queue
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-foreground">
                  Intake detail
                </span>
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Intake detail
                </span>
                <IntakeStatusBadge status={intake.status} />
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{intake.client.clientName}</h1>
                <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
                  Review the client context, project request, internal brief, and workflow state in one structured
                  workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button asChild variant="outline" className="rounded-full px-4">
                <Link href="/admin">
                  <span aria-hidden="true" className="mr-2 text-muted-foreground">
                    &lt;-
                  </span>
                  Back to submissions
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Return to the queue and continue triage from the dashboard.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-background px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Service type</p>
              <p className="mt-2 text-sm font-medium">{intake.serviceRequested}</p>
            </div>
            <div className="rounded-xl border bg-background px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Budget range</p>
              <FormattedBudgetRange
                value={intake.budgetRange}
                className="mt-2 text-sm font-medium text-foreground"
                fallbackClassName="mt-2 text-sm font-medium text-muted-foreground"
              />
            </div>
            <div className="rounded-xl border bg-background px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Submitted</p>
              <FormattedDateTime
                value={intake.createdAt}
                showRelative
                className="mt-2 space-y-1"
                valueClassName="font-medium text-foreground"
              />
            </div>
          </div>

          <AdminDetailSectionNav items={sectionNavItems} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px] xl:items-start">
        <div className="space-y-6">
          <section id="overview" className="scroll-mt-24 space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Overview</p>
                  <CardTitle className="text-2xl">Client details</CardTitle>
                </div>
                <CardDescription>Primary contact information attached to this intake submission.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <AdminDetailField label="Client name" value={intake.client.clientName} />
                <AdminDetailField label="Company" value={intake.client.companyName ?? "Not provided"} />
                <AdminDetailField
                  label="Email"
                  value={
                    <a href={`mailto:${intake.client.email}`} className="transition-colors hover:text-primary">
                      {intake.client.email}
                    </a>
                  }
                />
                <AdminDetailField label="Phone" value={intake.client.phone ?? "Not provided"} />
                <AdminDetailField
                  label="Website"
                  className="md:col-span-2"
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
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Request</p>
                  <CardTitle className="text-2xl">Project request</CardTitle>
                </div>
                <CardDescription>The canonical intake record used for the dashboard and onboarding workflow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5 md:grid-cols-3">
                  <AdminDetailField label="Service type" value={intake.serviceRequested} />
                  <AdminDetailField label="Budget range" value={<FormattedBudgetRange value={intake.budgetRange} />} />
                  <AdminDetailField label="Timeline" value={<FormattedTimeline value={intake.timeline} />} />
                </div>

                <div className="grid gap-6">
                  <AdminDetailField
                    label="Goal"
                    value={intake.projectSummary}
                    valueClassName="whitespace-pre-wrap text-sm leading-7"
                  />
                  <AdminDetailField
                    label="Problem description"
                    value={intake.currentChallenges ?? "Not provided"}
                    valueClassName="whitespace-pre-wrap text-sm leading-7"
                  />
                  <AdminDetailField
                    label="Extra notes"
                    value={intake.additionalInfo ?? "Not provided"}
                    valueClassName="whitespace-pre-wrap text-sm leading-7"
                  />
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
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Raw intake data</p>
                  <CardTitle className="text-2xl">Submitted answers</CardTitle>
                </div>
                <CardDescription>The raw answers captured from the public intake form for auditability and admin context.</CardDescription>
              </CardHeader>
              <CardContent>
                {intake.answers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No structured answers were stored for this intake.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border">
                    {intake.answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className={cn(
                          "grid gap-3 px-4 py-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-5",
                          index > 0 && "border-t",
                          index % 2 === 1 && "bg-secondary/10"
                        )}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            {answer.questionLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">Captured from the public intake form.</p>
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

        <div className="space-y-6 xl:sticky xl:top-6">
          <section id="workflow" className="scroll-mt-24">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Workflow</p>
                  <CardTitle className="text-2xl">Review state</CardTitle>
                </div>
                <CardDescription>Keep the current pipeline status aligned with the latest internal action.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border bg-secondary/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Current status</p>
                      <p className="text-sm text-muted-foreground">
                        Use this as the source of truth for where the intake currently sits in the review workflow.
                      </p>
                    </div>
                    <IntakeStatusBadge status={intake.status} />
                  </div>
                </div>

                <StatusUpdateForm intakeId={intake.id} currentStatus={intake.status} />
              </CardContent>
            </Card>
          </section>

          <section id="notes" className="scroll-mt-24">
            <InternalNotesPanel intakeId={intake.id} notes={intake.notes} currentAdminUserId={adminUser.id} />
          </section>

          <section id="metadata" className="scroll-mt-24">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Metadata</p>
                  <CardTitle className="text-2xl">Submission metadata</CardTitle>
                </div>
                <CardDescription>Operational context captured when this intake was created and updated.</CardDescription>
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
                  <div className="rounded-2xl border bg-secondary/20 p-4">
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
