"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FeedbackNotice } from "@/components/shared/feedback-notice";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
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
        setError(result?.error ?? "We couldn't generate the brief right now. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't generate the brief right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 xl:max-w-[280px] xl:text-right">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        variant={hasExistingBrief ? "outline" : "secondary"}
        size="sm"
        className="w-full xl:min-w-[190px] xl:w-auto"
      >
        {isSubmitting ? (
          <LoadingIndicator
            size="sm"
            label={hasExistingBrief ? "Refreshing brief" : "Generating brief"}
            textClassName="font-medium text-inherit"
          />
        ) : hasExistingBrief ? (
          "Regenerate brief"
        ) : (
          "Generate brief"
        )}
      </Button>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {isSubmitting
          ? "Generating a working summary from the latest request details."
          : hasExistingBrief
            ? "Regenerate the brief after the request details change."
            : "Generate a concise brief for faster team review."}
      </p>

      {error ? (
        <FeedbackNotice tone="error" title="Unable to generate brief" description={error} className="text-left" />
      ) : null}
    </div>
  );
}
