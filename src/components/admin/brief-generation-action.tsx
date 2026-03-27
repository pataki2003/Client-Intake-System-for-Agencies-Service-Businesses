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
    <div className="space-y-3 md:max-w-[280px] md:text-right">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        variant={hasExistingBrief ? "outline" : "secondary"}
        size="sm"
        className="w-full md:min-w-[190px] md:w-auto"
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
          ? "Creating a structured internal summary from the latest intake context."
          : hasExistingBrief
            ? "Refresh the brief after meaningful intake updates."
            : "Generate a structured summary for faster internal review."}
      </p>

      {error ? (
        <FeedbackNotice tone="error" title="Brief unavailable" description={error} className="text-left" />
      ) : null}
    </div>
  );
}
