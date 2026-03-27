import { NextResponse, type NextRequest } from "next/server";

import { adminIntakeIdSchema, internalNoteSchema } from "@/lib/validations/admin-intakes";
import { getAdminSessionUser } from "@/server/auth/require-admin";
import { createAdminInternalNote } from "@/server/admin-intakes/create-internal-note";

export const runtime = "nodejs";

type NotesRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, { params }: NotesRouteContext) {
  const adminUser = await getAdminSessionUser();

  if (!adminUser) {
    return NextResponse.json(
      {
        error: "You must be signed in as an admin to add internal notes."
      },
      { status: 401 }
    );
  }

  const { id } = await params;
  const parsedId = adminIntakeIdSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error: parsedId.error.issues[0]?.message ?? "Invalid intake id."
      },
      { status: 400 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "We couldn't read that note."
      },
      { status: 400 }
    );
  }

  const parsedPayload = internalNoteSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: parsedPayload.error.issues[0]?.message ?? "Enter a valid note."
      },
      { status: 400 }
    );
  }

  try {
    const note = await createAdminInternalNote(parsedId.data, adminUser.id, parsedPayload.data.body);

    return NextResponse.json(
      {
        success: true,
        note
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create internal note.", error);

    return NextResponse.json(
      {
        error: "We couldn't save that note right now."
      },
      { status: 500 }
    );
  }
}
