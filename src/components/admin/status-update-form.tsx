"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { IntakeStatusBadge } from "@/components/admin/intake-status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatIntakeStatus } from "@/lib/intake/formatters";
import { INTAKE_STATUSES, type IntakeStatus } from "@/types";

type StatusUpdateFormProps = {
  intakeId: string;
  currentStatus: IntakeStatus;
};

export function StatusUpdateForm({ intakeId, currentStatus }: StatusUpdateFormProps) {
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
        setError(result?.error ?? "We couldn't update the intake status right now.");
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't update the intake status right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">Current status</p>
        <IntakeStatusBadge status={currentStatus} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="intake-status">Update status</Label>
        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as IntakeStatus)}>
          <SelectTrigger id="intake-status">
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

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isSaving || selectedStatus === currentStatus}>
        {isSaving ? "Saving..." : "Save status"}
      </Button>
    </form>
  );
}
