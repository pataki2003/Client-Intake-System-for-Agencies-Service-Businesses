"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/intake/formatters";
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
    <Card>
      <CardHeader>
        <CardTitle>Internal notes</CardTitle>
        <CardDescription>Private admin-only notes for collaboration and follow-up context.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="internal-note">Add note</Label>
            <Textarea
              id="internal-note"
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              placeholder="Capture next steps, follow-up context, or internal concerns."
              rows={4}
              disabled={isSaving}
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" disabled={isSaving || noteBody.trim().length === 0}>
            {isSaving ? "Saving note..." : "Add note"}
          </Button>
        </form>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No internal notes yet.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="space-y-2 rounded-xl border bg-background px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{getNoteAuthorLabel(note, currentAdminUserId)}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
                </div>
                <p className="whitespace-pre-wrap text-sm">{note.body}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
