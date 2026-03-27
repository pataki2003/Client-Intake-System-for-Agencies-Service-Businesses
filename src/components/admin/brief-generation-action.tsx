"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type BriefGenerationActionProps = {
  intakeId: string;
  hasExistingBrief: boolean;
};

export function BriefGenerationAction({ intakeId, hasExistingBrief }: BriefGenerationActionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/intakes/${intakeId}/brief`, {
        method: "POST"
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error ?? "We couldn't generate the project brief right now.");
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't generate the project brief right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={handleClick} disabled={isSubmitting}>
        {isSubmitting ? (hasExistingBrief ? "Regenerating..." : "Generating...") : hasExistingBrief ? "Regenerate Brief" : "Generate Brief"}
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
