import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { IntakeStatus } from "@/types";

type UpdatedStatusRow = {
  id: string;
  status: IntakeStatus;
};

export async function updateAdminIntakeStatus(intakeId: string, status: IntakeStatus): Promise<UpdatedStatusRow | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("intakes")
    .update({ status })
    .eq("id", intakeId)
    .select("id, status")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update intake status: ${error.message}`);
  }

  return (data as UpdatedStatusRow | null) ?? null;
}
