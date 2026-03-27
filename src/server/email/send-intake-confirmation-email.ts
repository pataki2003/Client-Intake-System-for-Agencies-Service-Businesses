import "server-only";

import { buildIntakeConfirmationEmail } from "@/emails/intake-confirmation";
import { createResendClient, getResendFromAddress } from "@/lib/email/resend";

type SendIntakeConfirmationEmailInput = {
  intakeId: string;
  recipientEmail: string;
  recipientName: string;
};

type SendIntakeConfirmationEmailResult =
  | {
      success: true;
      messageId: string | null;
    }
  | {
      success: false;
      reason: string;
    };

function getSafeErrorDetails(error: unknown) {
  if (error && typeof error === "object") {
    const candidate = error as {
      name?: unknown;
      message?: unknown;
      statusCode?: unknown;
      status?: unknown;
    };

    return {
      errorName: typeof candidate.name === "string" ? candidate.name : "UnknownError",
      errorMessage: typeof candidate.message === "string" ? candidate.message : "Unknown error",
      errorStatus:
        typeof candidate.statusCode === "number"
          ? candidate.statusCode
          : typeof candidate.status === "number"
            ? candidate.status
            : null
    };
  }

  return {
    errorName: "UnknownError",
    errorMessage: "Unknown error",
    errorStatus: null
  };
}

function logConfirmationEmailError(
  context: {
    intakeId: string;
    recipientEmail: string;
  },
  error: unknown
) {
  const safeError = getSafeErrorDetails(error);

  console.error("Failed to send intake confirmation email.", {
    intakeId: context.intakeId,
    recipientEmail: context.recipientEmail,
    errorName: safeError.errorName,
    errorMessage: safeError.errorMessage,
    errorStatus: safeError.errorStatus
  });
}

export async function sendIntakeConfirmationEmail({
  intakeId,
  recipientEmail,
  recipientName
}: SendIntakeConfirmationEmailInput): Promise<SendIntakeConfirmationEmailResult> {
  try {
    const resend = createResendClient();
    const from = getResendFromAddress();
    const email = buildIntakeConfirmationEmail({
      recipientName
    });

    const { data, error } = await resend.emails.send({
      from,
      to: [recipientEmail],
      subject: email.subject,
      html: email.html,
      text: email.text
    });

    if (error) {
      logConfirmationEmailError(
        {
          intakeId,
          recipientEmail
        },
        error
      );

      return {
        success: false,
        reason: "provider_error"
      };
    }

    return {
      success: true,
      messageId: data?.id ?? null
    };
  } catch (error) {
    logConfirmationEmailError(
      {
        intakeId,
        recipientEmail
      },
      error
    );

    return {
      success: false,
      reason: "runtime_error"
    };
  }
}
