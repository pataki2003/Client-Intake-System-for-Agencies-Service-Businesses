import type { PublicIntakeFormValues } from "@/lib/validations/public-intake";

export type PublicIntakeFieldErrors = Partial<Record<keyof PublicIntakeFormValues, string[]>>;

export type PublicIntakeSubmissionResult =
  | {
      success: true;
      intakeId: string;
    }
  | {
      success: false;
      formError: string;
      fieldErrors?: PublicIntakeFieldErrors;
    };
