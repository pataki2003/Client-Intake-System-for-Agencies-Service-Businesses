"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  useEffect(() => {
    console.error("Admin route error.", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center">
      <Card className="w-full border-border/80 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Admin workspace</p>
            <CardTitle className="text-3xl tracking-tight">This workspace could not be loaded.</CardTitle>
          </div>
          <CardDescription>Try again or return to submissions. No request data was changed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border bg-surface-cool px-4 py-4 text-sm text-muted-foreground">
            If this continues, confirm your session is still active and that the required services are available.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to submissions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
