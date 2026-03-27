"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
            : "We couldn't submit your request right now. Please try again."
        );
        return;
      }

      router.push("/success");
    } catch {
      setFormError("We couldn't submit your request right now. Please try again.");
    }
  });

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle>Project intake form</CardTitle>
        <CardDescription>
          Share the essentials and we&apos;ll turn this into a structured intake for our team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {formError ? (
            <Alert variant="destructive">
              <AlertTitle>Submission failed</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Jane Smith"
                autoComplete="name"
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@company.com"
                autoComplete="email"
                disabled={isSubmitting}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company name</Label>
              <Input
                id="company_name"
                placeholder="Acme Studio"
                autoComplete="organization"
                disabled={isSubmitting}
                {...register("company_name")}
              />
              <FieldError message={errors.company_name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" disabled={isSubmitting} {...register("deadline")} />
              <FieldError message={errors.deadline?.message} />
            </div>
          </div>

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
                      <SelectValue placeholder="Select a service" />
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
                      <SelectValue placeholder="Select a budget range" />
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
              <FieldError message={errors.budget_range?.message} />
            </div>
          </div>

          {selectedServiceType === "other" ? (
            <div className="space-y-2">
              <Label htmlFor="service_type_other">What service do you need?</Label>
              <Input
                id="service_type_other"
                placeholder="Describe the service you need"
                disabled={isSubmitting}
                {...register("service_type_other")}
              />
              <FieldError message={errors.service_type_other?.message} />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="goal">Primary goal</Label>
            <Textarea
              id="goal"
              placeholder="What outcome do you want this project to create for your business?"
              disabled={isSubmitting}
              {...register("goal")}
            />
            <FieldError message={errors.goal?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_description">Problem description</Label>
            <Textarea
              id="problem_description"
              placeholder="What is not working today, and what is prompting this project now?"
              disabled={isSubmitting}
              {...register("problem_description")}
            />
            <FieldError message={errors.problem_description?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra_notes">Extra notes</Label>
            <Textarea
              id="extra_notes"
              placeholder="Anything else we should know before we review your request?"
              disabled={isSubmitting}
              {...register("extra_notes")}
            />
            <FieldError message={errors.extra_notes?.message} />
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Your answers will be saved to our intake system and reviewed by the team.
            </p>
            <Button className="w-full md:w-auto" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting request..." : "Submit project request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
