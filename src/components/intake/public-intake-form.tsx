"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  PUBLIC_BUDGET_RANGE_OPTIONS,
  PUBLIC_SERVICE_TYPE_OPTIONS
} from "@/lib/intake/public-intake-options";
import {
  DEFAULT_PUBLIC_INTAKE_VALUES,
  publicIntakeSchema,
  type PublicIntakeFormValues
} from "@/lib/validations/public-intake";
import type { PublicIntakeSubmissionResult } from "@/types";
import { FeedbackNotice } from "@/components/shared/feedback-notice";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

function FieldHint({ children }: { children: string }) {
  return <p className="text-xs leading-5 text-muted-foreground">{children}</p>;
}

function FormSection({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-secondary/15 p-4 sm:p-5 md:p-6">
      <div className="space-y-4 sm:space-y-5">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName="text-lg sm:text-xl"
          descriptionClassName="max-w-2xl text-sm"
        />
        {children}
      </div>
    </section>
  );
}

export function PublicIntakeForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PublicIntakeFormValues>({
    resolver: zodResolver(publicIntakeSchema),
    defaultValues: DEFAULT_PUBLIC_INTAKE_VALUES
  });

  const selectedServiceType = watch("service_type");

  useEffect(() => {
    if (selectedServiceType !== "other") {
      setValue("service_type_other", "");
    }
  }, [selectedServiceType, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const response = await fetch("/api/public-intakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const responseBody = (await response.json()) as PublicIntakeSubmissionResult;

      if (!response.ok || !responseBody.success) {
        if (!responseBody.success && responseBody.fieldErrors) {
          for (const [fieldName, messages] of Object.entries(responseBody.fieldErrors)) {
            if (messages?.[0]) {
              setError(fieldName as keyof PublicIntakeFormValues, {
                type: "server",
                message: messages[0]
              });
            }
          }
        }

        setFormError(
          !responseBody.success
            ? responseBody.formError
            : "We couldn't receive your request right now. Please try again in a moment."
        );
        return;
      }

      router.push("/success");
    } catch {
      setFormError("We couldn't receive your request right now. Please try again in a moment.");
    }
  });

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-3 pb-5 sm:space-y-4 sm:pb-6">
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Project request</p>
          <CardTitle className="text-xl tracking-tight sm:text-2xl md:text-3xl">Tell us about the project and what you need.</CardTitle>
        </div>
        <CardDescription>
          A few clear details help us review fit, scope, and the right next step before we reply.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8">
        <form className="space-y-6 sm:space-y-8" onSubmit={onSubmit} noValidate>
          {formError ? (
            <FeedbackNotice tone="error" title="Unable to submit request" description={formError} />
          ) : null}

          <FormSection
            eyebrow="Contact"
            title="Who should we follow up with?"
            description="These details tell us who to contact once the request has been reviewed."
          >
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                <FieldHint>Use the name you&apos;d like us to use in follow-up.</FieldHint>
                <FieldError message={errors.name?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@northlane.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <FieldHint>We&apos;ll use this for confirmation and follow-up only.</FieldHint>
                <FieldError message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company name</Label>
                <Input
                  id="company_name"
                  placeholder="Northlane Advisory"
                  autoComplete="organization"
                  disabled={isSubmitting}
                  {...register("company_name")}
                />
                <FieldHint>Optional, but helpful if the work is for a business.</FieldHint>
                <FieldError message={errors.company_name?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Preferred deadline</Label>
                <Input id="deadline" type="date" disabled={isSubmitting} {...register("deadline")} />
                <FieldHint>A target date is enough if your timing is still flexible.</FieldHint>
                <FieldError message={errors.deadline?.message} />
              </div>
            </div>
          </FormSection>

          <FormSection
            eyebrow="Scope"
            title="What kind of project is this?"
            description="We use this to understand the type of engagement before reviewing the full context."
          >
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service_type">Service type</Label>
                <Controller
                  name="service_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <SelectTrigger id="service_type">
                        <SelectValue placeholder="Select the closest fit" />
                      </SelectTrigger>
                      <SelectContent>
                        {PUBLIC_SERVICE_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldHint>Choose the closest match. You can add context below if needed.</FieldHint>
                <FieldError message={errors.service_type?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_range">Budget range</Label>
                <Controller
                  name="budget_range"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <SelectTrigger id="budget_range">
                        <SelectValue placeholder="Select a working range" />
                      </SelectTrigger>
                      <SelectContent>
                        {PUBLIC_BUDGET_RANGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldHint>A working range helps us assess fit and recommend the right next step.</FieldHint>
                <FieldError message={errors.budget_range?.message} />
              </div>
            </div>

            {selectedServiceType === "other" ? (
              <div className="rounded-xl border bg-background p-4">
                <div className="space-y-2">
                  <Label htmlFor="service_type_other">What kind of support do you need?</Label>
                  <Input
                    id="service_type_other"
                    placeholder="Describe the kind of support you need"
                    disabled={isSubmitting}
                    {...register("service_type_other")}
                  />
                  <FieldHint>A short description is enough. We&apos;ll use it to categorize the request correctly.</FieldHint>
                  <FieldError message={errors.service_type_other?.message} />
                </div>
              </div>
            ) : null}
          </FormSection>

          <FormSection
            eyebrow="Context"
            title="What should we know before we review this?"
            description="The strongest requests explain both the outcome they want and what is getting in the way today."
          >
            <div className="grid gap-3 sm:gap-4">
              <div className="rounded-xl border bg-background p-4 md:p-5">
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary goal</Label>
                  <Textarea
                    id="goal"
                    className="min-h-[140px] resize-y"
                    placeholder="Describe the result you want this project to create."
                    disabled={isSubmitting}
                    {...register("goal")}
                  />
                  <FieldHint>Focus on the business outcome you want from the work.</FieldHint>
                  <FieldError message={errors.goal?.message} />
                </div>
              </div>

              <div className="rounded-xl border bg-background p-4 md:p-5">
                <div className="space-y-2">
                  <Label htmlFor="problem_description">Current challenge</Label>
                  <Textarea
                    id="problem_description"
                    className="min-h-[150px] resize-y"
                    placeholder="Describe what is not working today, what feels unclear, or what is creating urgency."
                    disabled={isSubmitting}
                    {...register("problem_description")}
                  />
                  <FieldHint>Tell us what is making the request important now.</FieldHint>
                  <FieldError message={errors.problem_description?.message} />
                </div>
              </div>

              <div className="rounded-xl border bg-background p-4 md:p-5">
                <div className="space-y-2">
                  <Label htmlFor="extra_notes">Extra notes</Label>
                  <Textarea
                    id="extra_notes"
                    className="min-h-[130px] resize-y"
                    placeholder="Add any stakeholders, constraints, references, or context that would help us review the request well."
                    disabled={isSubmitting}
                    {...register("extra_notes")}
                  />
                  <FieldHint>Optional. Add anything that would make the review more useful.</FieldHint>
                  <FieldError message={errors.extra_notes?.message} />
                </div>
              </div>
            </div>
          </FormSection>

          <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-sm font-semibold">After you submit</p>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Your request is saved immediately, reviewed by the team, and followed up with a clear next step.
                  </p>
                </div>
                <div className="min-h-[2rem]" aria-live="polite">
                  {isSubmitting ? (
                    <div className="inline-flex rounded-full border bg-background px-3 py-1.5">
                      <LoadingIndicator
                        announce
                        size="sm"
                        label="Saving your request"
                        textClassName="text-xs font-medium text-foreground/80"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll see a confirmation screen as soon as your request is received.
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full md:min-w-[220px] md:w-auto" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoadingIndicator size="sm" label="Submitting request" textClassName="font-medium text-inherit" />
                ) : (
                  "Submit request"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
