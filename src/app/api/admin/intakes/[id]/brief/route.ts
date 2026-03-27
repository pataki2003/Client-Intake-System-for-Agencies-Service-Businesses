import { NextResponse } from "next/server";

import { adminIntakeIdSchema } from "@/lib/validations/admin-intakes";
import { getAdminSessionUser } from "@/server/auth/require-admin";
import { generateIntakeBrief, IntakeBriefGenerationError } from "@/server/briefs/generate-intake-brief";

export const runtime = "nodejs";

type BriefRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: BriefRouteContext) {
  const adminUser = await getAdminSessionUser();

  if (!adminUser) {
    return NextResponse.json(
      {
        error: "You must be signed in as an admin to generate project briefs."
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

  try {
    const brief = await generateIntakeBrief(parsedId.data);

    return NextResponse.json({
      success: true,
      brief
    });
  } catch (error) {
    console.error("Failed to generate intake brief.", error);

    if (error instanceof IntakeBriefGenerationError) {
      return NextResponse.json(
        {
          error: error.message
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "We couldn't generate the project brief right now."
      },
      { status: 500 }
    );
  }
}
