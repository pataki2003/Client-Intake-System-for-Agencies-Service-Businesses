"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAdmin, type AdminLoginState } from "@/app/login/actions";
import { FeedbackNotice } from "@/components/shared/feedback-notice";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AdminLoginState = {
  error: null
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <LoadingIndicator size="sm" label="Signing in" textClassName="font-medium text-inherit" /> : "Sign in"}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <Card variant="tinted" className="mx-auto w-full max-w-md border-border/80 shadow-sm">
      <CardHeader className="space-y-2.5 border-b border-border/60 sm:space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Restricted access</p>
          <CardTitle className="text-xl tracking-tight sm:text-2xl">Sign in to the intake workspace</CardTitle>
        </div>
        <CardDescription>Sign in with an approved admin account to review submissions, notes, statuses, and project briefs.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4 sm:space-y-5">
          {state.error ? (
            <FeedbackNotice tone="error" title="Unable to sign in" description={state.error} />
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="admin@studio.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" />
          </div>

          <SubmitButton />

          <p className="text-xs leading-5 text-muted-foreground">
            Access is limited to approved admin accounts.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
