"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { FeedbackNotice } from "@/components/shared/feedback-notice";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatIntakeStatus } from "@/lib/intake/formatters";
import { INTAKE_STATUSES, type IntakeStatus } from "@/types";

type StatusUpdateFormProps = {
  intakeId: string;
  currentStatus: IntakeStatus;
  idPrefix?: string;
};

export function StatusUpdateForm({
  intakeId,
  currentStatus,
  idPrefix = "intake-status"
}: StatusUpdateFormProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<IntakeStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedStatus === currentStatus) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/intakes/${intakeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: selectedStatus
        })
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error ?? "We couldn't update the status right now. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't update the status right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor={idPrefix} className="text-sm font-medium">
          Update status
        </Label>
        <p className="text-sm text-muted-foreground">
          Move the request forward as the team reviews it, prepares the brief, or follows up.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor={idPrefix} className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </Label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as IntakeStatus)}
            disabled={isSaving}
          >
            <SelectTrigger id={idPrefix}>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {INTAKE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatIntakeStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isSaving || selectedStatus === currentStatus} className="w-full sm:min-w-[132px] sm:w-auto">
          {isSaving ? (
            <LoadingIndicator size="sm" label="Saving status" textClassName="font-medium text-inherit" />
          ) : (
            "Save status"
          )}
        </Button>
      </div>

      {error ? (
        <FeedbackNotice tone="error" title="Unable to update status" description={error} />
      ) : null}
    </form>
  );
}
