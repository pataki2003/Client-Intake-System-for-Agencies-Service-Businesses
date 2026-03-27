import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { AdminIntakeListItem, BudgetRange, IntakeStatus } from "@/types";

type RawIntakeListRow = {
  id: string;
  client_id: string;
  service_requested: string;
  status: IntakeStatus;
  budget_range: BudgetRange | null;
  created_at: string;
};

type RawClientListRow = {
  id: string;
  client_name: string;
  company_name: string | null;
};

type RawBriefListRow = {
  intake_id: string;
};

export async function getAdminIntakeList(): Promise<AdminIntakeListItem[]> {
  const supabase = createServiceRoleClient();

  const { data: intakeRows, error: intakeError } = await supabase
    .from("intakes")
    .select("id, client_id, service_requested, status, budget_range, created_at")
    .order("created_at", { ascending: false });

  if (intakeError) {
    throw new Error(`Failed to load intake submissions: ${intakeError.message}`);
  }

  const typedIntakes = (intakeRows ?? []) as RawIntakeListRow[];

  if (typedIntakes.length === 0) {
    return [];
  }

  const intakeIds = typedIntakes.map((row) => row.id);
  const clientIds = Array.from(new Set(typedIntakes.map((row) => row.client_id)));
  const { data: clientRows, error: clientError } = await supabase
    .from("clients")
    .select("id, client_name, company_name")
    .in("id", clientIds);

  if (clientError) {
    throw new Error(`Failed to load clients for intake submissions: ${clientError.message}`);
  }

  const { data: briefRows, error: briefError } = await supabase
    .from("ai_briefs")
    .select("intake_id")
    .in("intake_id", intakeIds);

  if (briefError) {
    throw new Error(`Failed to load AI brief state for intake submissions: ${briefError.message}`);
  }

  const clientMap = new Map(
    ((clientRows ?? []) as RawClientListRow[]).map((client) => [
      client.id,
      {
        clientName: client.client_name,
        companyName: client.company_name
      }
    ])
  );
  const briefIntakeIds = new Set(((briefRows ?? []) as RawBriefListRow[]).map((brief) => brief.intake_id));

  return typedIntakes.map((row) => {
    const client = clientMap.get(row.client_id);

    return {
      id: row.id,
      clientId: row.client_id,
      clientName: client?.clientName ?? "Unknown client",
      companyName: client?.companyName ?? null,
      serviceRequested: row.service_requested,
      status: row.status,
      budgetRange: row.budget_range,
      hasBrief: briefIntakeIds.has(row.id),
      createdAt: row.created_at
    };
  });
}
