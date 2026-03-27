import "server-only";

type IntakeConfirmationEmailInput = {
  recipientName: string;
};

type IntakeConfirmationEmail = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getGreetingName(name: string) {
  const trimmedName = name.trim();

  return trimmedName.length > 0 ? trimmedName : "there";
}

export function buildIntakeConfirmationEmail({
  recipientName
}: IntakeConfirmationEmailInput): IntakeConfirmationEmail {
  const greetingName = getGreetingName(recipientName);
  const escapedGreetingName = escapeHtml(greetingName);
  const subject = "We received your project request";
  const text = [
    `Hi ${greetingName},`,
    "",
    "Thank you for submitting your project request. We've received your details and our team is reviewing them now.",
    "",
    "What happens next: we'll review your request, align internally on the best next step, and follow up by email as soon as possible.",
    "",
    "We appreciate the opportunity to learn more about your project.",
    "",
    "Client Intake System Team"
  ].join("\n");

  const html = `
    <div style="background:#f6f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#111827;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:32px;">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#6b7280;">Hi ${escapedGreetingName},</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#111827;">Thank you for reaching out</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
          Thank you for submitting your project request. We've received your details and our team is reviewing them now.
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">
          What happens next: we'll review your request, align internally on the best next step, and follow up by email as soon as possible.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">
          We appreciate the opportunity to learn more about your project.
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">Client Intake System Team</p>
      </div>
    </div>
  `.trim();

  return {
    subject,
    html,
    text
  };
}
