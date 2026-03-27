import { NextResponse, type NextRequest } from "next/server";

import { adminIntakeIdSchema, intakeStatusUpdateSchema } from "@/lib/validations/admin-intakes";
import { getAdminSessionUser } from "@/server/auth/require-admin";
import { updateAdminIntakeStatus } from "@/server/admin-intakes/update-intake-status";

export const runtime = "nodejs";

type StatusRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: StatusRouteContext) {
  const adminUser = await getAdminSessionUser();

  if (!adminUser) {
    return NextResponse.json(
      {
        error: "You must be signed in as an admin to update intake statuses."
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
        error: "We couldn't read that status update."
      },
      { status: 400 }
    );
  }

  const parsedPayload = intakeStatusUpdateSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: parsedPayload.error.issues[0]?.message ?? "Invalid intake status."
      },
      { status: 400 }
    );
  }

  try {
    const updatedIntake = await updateAdminIntakeStatus(parsedId.data, parsedPayload.data.status);

    if (!updatedIntake) {
      return NextResponse.json(
        {
          error: "That intake could not be found."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      intake: updatedIntake
    });
  } catch (error) {
    console.error("Failed to update intake status.", error);

    return NextResponse.json(
      {
        error: "We couldn't update the intake status right now."
      },
      { status: 500 }
    );
  }
}
