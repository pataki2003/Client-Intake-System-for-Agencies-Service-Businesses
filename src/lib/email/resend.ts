import "server-only";

import { Resend } from "resend";

function getRequiredEnv(name: "RESEND_API_KEY" | "RESEND_FROM_EMAIL") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for intake confirmation emails.`);
  }

  return value;
}

export function formatResendFromAddress(fromEmail: string) {
  return fromEmail.includes("<") ? fromEmail : `Client Intake System <${fromEmail}>`;
}

export function createResendClient() {
  return new Resend(getRequiredEnv("RESEND_API_KEY"));
}

export function getResendFromAddress() {
  return formatResendFromAddress(getRequiredEnv("RESEND_FROM_EMAIL"));
}
