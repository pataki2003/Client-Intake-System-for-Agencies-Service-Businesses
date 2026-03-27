import { NextResponse, type NextRequest } from "next/server";

import { createPublicIntakeSubmission } from "@/server/public-intake/create-public-intake-submission";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        formError: "We couldn't read that submission. Please try again."
      },
      { status: 400 }
    );
  }

  const result = await createPublicIntakeSubmission(payload, {
    referer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent")
  });

  if (result.success) {
    return NextResponse.json(result, { status: 201 });
  }

  return NextResponse.json(result, {
    status: result.fieldErrors ? 400 : 500
  });
}
