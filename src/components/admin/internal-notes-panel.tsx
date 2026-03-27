"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { FormattedDateTime } from "@/components/shared/intake-display";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AdminIntakeNote } from "@/types";

type InternalNotesPanelProps = {
  intakeId: string;
  notes: AdminIntakeNote[];
  currentAdminUserId: string;
};

function getNoteAuthorLabel(note: AdminIntakeNote, currentAdminUserId: string) {
  if (note.authorId && note.authorId === currentAdminUserId) {
    return "You";
  }

  if (note.authorId) {
    return "Admin";
  }

  return "Author unavailable";
}

function getNoteAuthorTone(note: AdminIntakeNote, currentAdminUserId: string) {
  if (note.authorId && note.authorId === currentAdminUserId) {
    return "bg-secondary text-secondary-foreground";
  }

  if (note.authorId) {
    return "bg-background text-foreground";
  }

  return "bg-muted text-muted-foreground";
}

export function InternalNotesPanel({ intakeId, notes, currentAdminUserId }: InternalNotesPanelProps) {
  const router = useRouter();
  const [noteBody, setNoteBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/intakes/${intakeId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          body: noteBody
        })
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error ?? "We couldn't save that note right now.");
        return;
      }

      setNoteBody("");
      router.refresh();
    } catch {
      setError("We couldn't save that note right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Notes</p>
          <CardTitle className="text-2xl">Internal notes</CardTitle>
        </div>
        <CardDescription>
          Capture follow-up context, next steps, and internal decisions for anyone reviewing this intake later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4 rounded-2xl border bg-secondary/20 p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="internal-note" className="text-sm font-medium">
              Add collaboration note
            </Label>
            <p className="text-sm text-muted-foreground">
              Notes are private to the admin workspace and are best used for handoff context, follow-up reminders, or
              review decisions.
            </p>
          </div>

          <Textarea
            id="internal-note"
            value={noteBody}
            onChange={(event) => setNoteBody(event.target.value)}
            placeholder="Example: strong fit, but budget may need confirmation before follow-up. Revisit after internal review."
            rows={5}
            className="min-h-[140px] resize-y bg-background"
            disabled={isSaving}
          />

          {error ? (
            <Alert variant="destructive" className="bg-destructive/5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Visible to admins only. New notes appear at the top of the list.</p>
            <Button type="submit" disabled={isSaving || noteBody.trim().length === 0} className="sm:min-w-[132px]">
              {isSaving ? "Saving note..." : "Save note"}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Activity notes</p>
              <p className="text-xs text-muted-foreground">Chronological collaboration history, newest first.</p>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{notes.length} total</p>
          </div>

          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No internal notes yet. Use this space to capture follow-up ideas, client context, and review decisions as the
              intake moves forward.
            </div>
          ) : (
            <ol className="space-y-3">
              {notes.map((note, index) => (
                <li key={note.id} className="rounded-2xl border bg-background px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 hidden h-full self-stretch sm:block">
                      <div className="flex h-full min-h-[24px] w-5 justify-center">
                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full border bg-background" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", getNoteAuthorTone(note, currentAdminUserId))}
                          >
                            {getNoteAuthorLabel(note, currentAdminUserId)}
                          </Badge>
                          {index === 0 ? (
                            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                              Latest
                            </Badge>
                          ) : null}
                        </div>

                        <FormattedDateTime
                          value={note.createdAt}
                          showRelative
                          className="space-y-1 text-left sm:text-right"
                          valueClassName="text-xs text-muted-foreground"
                          relativeClassName="text-xs text-muted-foreground"
                        />
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{note.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
