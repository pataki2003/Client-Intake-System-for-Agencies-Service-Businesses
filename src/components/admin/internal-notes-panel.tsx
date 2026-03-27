"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { FormattedDateTime } from "@/components/shared/intake-display";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  return "Admin";
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
        <CardDescription>Private admin-only context for collaboration, follow-up, and decision history.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="rounded-2xl border bg-secondary/20 p-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="internal-note" className="text-sm font-medium">
              Add note
            </Label>
            <p className="text-sm text-muted-foreground">
              Capture next steps, client context, concerns, or anything the next reviewer should know.
            </p>
            <Textarea
              id="internal-note"
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              placeholder="Add internal context for the team."
              rows={5}
              className="min-h-[120px] resize-y"
              disabled={isSaving}
            />
          </div>

          {error ? (
            <Alert variant="destructive" className="bg-destructive/5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || noteBody.trim().length === 0}>
              {isSaving ? "Saving note..." : "Add note"}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">Recent notes</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{notes.length} total</p>
          </div>

          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No internal notes yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className={cn("space-y-3 bg-background px-4 py-4", index > 0 && "border-t", index % 2 === 1 && "bg-secondary/10")}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{getNoteAuthorLabel(note, currentAdminUserId)}</p>
                    <FormattedDateTime
                      value={note.createdAt}
                      showRelative
                      valueClassName="text-xs text-muted-foreground"
                      relativeClassName="text-xs text-muted-foreground"
                    />
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{note.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
