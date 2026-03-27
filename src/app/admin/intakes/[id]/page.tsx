import Link from "next/link";
import { notFound } from "next/navigation";

import { IntakeStatusBadge } from "@/components/admin/intake-status-badge";
import { InternalNotesPanel } from "@/components/admin/internal-notes-panel";
import { StatusUpdateForm } from "@/components/admin/status-update-form";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { extractAnswerValue, formatBudgetRange, formatDateTime, formatJsonValue, formatProjectTimeline } from "@/lib/intake/formatters";
import { adminIntakeIdSchema } from "@/lib/validations/admin-intakes";
import { requireAdminUser } from "@/server/auth/require-admin";
import { getAdminIntakeDetail } from "@/server/admin-intakes/get-admin-intake-detail";

type IntakeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
      <PageHeader
        eyebrow="Intake Detail"
        title={intake.client.clientName}
        description="Review the client context, update the current workflow status, and keep internal notes tied to this request."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client details</CardTitle>
              <CardDescription>Primary contact information attached to this intake submission.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client name</p>
                <p className="text-sm">{intake.client.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p className="text-sm">{intake.client.companyName ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{intake.client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{intake.client.phone ?? "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="text-sm">{intake.client.website ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project request</CardTitle>
              <CardDescription>The canonical intake record used for the dashboard and onboarding workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service type</p>
                  <p className="text-sm">{intake.serviceRequested}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget range</p>
                  <p className="text-sm">{formatBudgetRange(intake.budgetRange)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                  <p className="text-sm">{formatProjectTimeline(intake.timeline)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmation email</p>
                  <p className="text-sm">{intake.confirmationSentAt ? formatDateTime(intake.confirmationSentAt) : "Not sent yet"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal</p>
                <p className="whitespace-pre-wrap text-sm">{intake.projectSummary}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Problem description</p>
                <p className="whitespace-pre-wrap text-sm">{intake.currentChallenges ?? "—"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Extra notes</p>
                <p className="whitespace-pre-wrap text-sm">{intake.additionalInfo ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitted answers</CardTitle>
              <CardDescription>The raw answers captured from the public intake form for auditability and admin context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {intake.answers.length === 0 ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No structured answers were stored for this intake.
                </div>
              ) : (
                intake.answers.map((answer) => (
                  <div key={answer.id} className="rounded-xl border bg-background px-4 py-3">
                    <p className="text-sm font-medium">{answer.questionLabel}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {extractAnswerValue(answer.answerValue)}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI project brief</CardTitle>
              <CardDescription>Stored brief content from the generation flow when it becomes available.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {intake.brief ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Model</p>
                      <p className="text-sm">{intake.brief.model ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last updated</p>
                      <p className="text-sm">{formatDateTime(intake.brief.updatedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Brief markdown</p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">
                      {intake.brief.briefMarkdown}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No AI brief has been generated for this intake yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
              <CardDescription>Current pipeline state and admin controls for this submission.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-xl border bg-background px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current status</p>
                  <p className="text-sm text-foreground">Keep this aligned with your latest admin action.</p>
                </div>
                <IntakeStatusBadge status={intake.status} />
              </div>

              <StatusUpdateForm intakeId={intake.id} currentStatus={intake.status} />
            </CardContent>
          </Card>

          <InternalNotesPanel intakeId={intake.id} notes={intake.notes} currentAdminUserId={adminUser.id} />

          <Card>
            <CardHeader>
              <CardTitle>Submission metadata</CardTitle>
              <CardDescription>Operational context captured when this intake was created.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created at</p>
                <p className="text-sm">{formatDateTime(intake.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last updated</p>
                <p className="text-sm">{formatDateTime(intake.updatedAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source metadata</p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">
                  {formatJsonValue(intake.sourceMetadata)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
