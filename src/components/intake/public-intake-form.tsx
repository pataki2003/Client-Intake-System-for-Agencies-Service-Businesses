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
    <section className="space-y-5">
      <div className="space-y-2 border-b pb-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
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
            : "We couldn't submit your request right now. Please try again in a moment."
        );
        return;
      }

      router.push("/success");
    } catch {
      setFormError("We couldn't submit your request right now. Please try again in a moment.");
    }
  });

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-4 pb-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Project request</p>
          <CardTitle className="text-2xl tracking-tight md:text-3xl">Tell us what you&apos;re building and why it matters.</CardTitle>
        </div>
        <CardDescription>
          A few well-framed details help us review fit, scope, and the most useful next step before we follow up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={onSubmit} noValidate>
          {formError ? (
            <FeedbackNotice tone="error" title="Submission unavailable" description={formError} />
          ) : null}

          <FormSection
            eyebrow="Contact"
            title="Who should we follow up with?"
            description="These details give us the right point of contact once the request has been reviewed."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                <FieldHint>Use the name you&apos;d like us to address in follow-up.</FieldHint>
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
                <FieldHint>We&apos;ll use this for confirmation and the next step only.</FieldHint>
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
                <FieldHint>Optional, but helpful if you&apos;re inquiring on behalf of a business.</FieldHint>
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
            description="We use this to understand the shape of the engagement before we evaluate the details."
          >
            <div className="grid gap-5 md:grid-cols-2">
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
                <FieldHint>Choose the closest match. You can clarify below if needed.</FieldHint>
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
                <FieldHint>A realistic range helps us assess fit and recommend the right next step.</FieldHint>
                <FieldError message={errors.budget_range?.message} />
              </div>
            </div>

            {selectedServiceType === "other" ? (
              <div className="space-y-2">
                <Label htmlFor="service_type_other">What service do you need?</Label>
                <Input
                  id="service_type_other"
                  placeholder="Describe the kind of support you are looking for"
                  disabled={isSubmitting}
                  {...register("service_type_other")}
                />
                <FieldHint>A short description is enough. We&apos;ll use it to categorize the request internally.</FieldHint>
                <FieldError message={errors.service_type_other?.message} />
              </div>
            ) : null}
          </FormSection>

          <FormSection
            eyebrow="Context"
            title="What should we understand before we review this?"
            description="The strongest submissions explain both the opportunity and the friction behind the request."
          >
            <div className="space-y-2">
              <Label htmlFor="goal">Primary goal</Label>
              <Textarea
                id="goal"
                className="min-h-[140px] resize-y"
                placeholder="For example: clarify our positioning and improve the site so qualified leads understand the offer faster."
                disabled={isSubmitting}
                {...register("goal")}
              />
              <FieldHint>Focus on the business outcome you want the project to create.</FieldHint>
              <FieldError message={errors.goal?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem_description">Current challenge</Label>
              <Textarea
                id="problem_description"
                className="min-h-[150px] resize-y"
                placeholder="For example: inquiries are inconsistent, the current experience feels dated, or the offer is hard to understand."
                disabled={isSubmitting}
                {...register("problem_description")}
              />
              <FieldHint>Tell us what is not working today and why this feels important now.</FieldHint>
              <FieldError message={errors.problem_description?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra_notes">Extra notes</Label>
              <Textarea
                id="extra_notes"
                className="min-h-[130px] resize-y"
                placeholder="Share any additional context, constraints, stakeholders, or references that would help us review the request more thoughtfully."
                disabled={isSubmitting}
                {...register("extra_notes")}
              />
              <FieldHint>Optional. Include anything that would improve internal review quality.</FieldHint>
              <FieldError message={errors.extra_notes?.message} />
            </div>
          </FormSection>

          <div className="rounded-2xl border bg-secondary/30 p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">What happens after you submit</p>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Your request is recorded immediately, reviewed internally in a structured workflow, and followed up
                    with a clear next step.
                  </p>
                </div>
                <div className="min-h-[2rem]" aria-live="polite">
                  {isSubmitting ? (
                    <div className="inline-flex rounded-full border bg-background px-3 py-1.5">
                      <LoadingIndicator
                        announce
                        size="sm"
                        label="Saving your request and preparing confirmation"
                        textClassName="text-xs font-medium text-foreground/80"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll see a confirmation screen as soon as the request is recorded.
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full md:min-w-[220px] md:w-auto" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoadingIndicator size="sm" label="Submitting request" textClassName="font-medium text-inherit" />
                ) : (
                  "Submit project request"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
