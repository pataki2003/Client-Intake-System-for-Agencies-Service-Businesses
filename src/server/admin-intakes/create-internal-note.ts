import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { AdminIntakeNote } from "@/types";

type CreatedNoteRow = {
  id: string;
  intake_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export async function createAdminInternalNote(intakeId: string, authorId: string, body: string): Promise<AdminIntakeNote> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("internal_notes")
    .insert({
      intake_id: intakeId,
      author_id: authorId,
      body
    })
    .select("id, intake_id, author_id, body, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create internal note: ${error?.message ?? "Unknown error"}`);
  }

  const createdNote = data as CreatedNoteRow;

  return {
    id: createdNote.id,
    intakeId: createdNote.intake_id,
    authorId: createdNote.author_id,
    body: createdNote.body,
    createdAt: createdNote.created_at,
    updatedAt: createdNote.updated_at
  };
}
