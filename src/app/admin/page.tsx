import { AdminDashboardFilters } from "@/components/admin/admin-dashboard-filters";
import { IntakesTable } from "@/components/admin/intakes-table";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminIntakeList } from "@/server/admin-intakes/get-admin-intake-list";
import { INTAKE_STATUSES, type AdminIntakeListItem, type IntakeStatus } from "@/types";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    status?: string | string[];
    service?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSelectedStatus(value: string | undefined): IntakeStatus | null {
  if (!value) {
    return null;
  }

  return INTAKE_STATUSES.includes(value as IntakeStatus) ? (value as IntakeStatus) : null;
}

function getServiceOptions(items: AdminIntakeListItem[]) {
  return Array.from(new Set(items.map((item) => item.serviceRequested))).sort((left, right) => left.localeCompare(right));
}

function getDashboardStats(items: AdminIntakeListItem[]) {
  return {
    totalSubmissions: items.length,
    needsReview: items.filter((item) => item.status === "new" || item.status === "reviewing").length,
    readyOrContacted: items.filter((item) => item.status === "brief_ready" || item.status === "contacted").length,
    briefsGenerated: items.filter((item) => item.hasBrief).length
  };
}

const statCardConfig = [
  {
    key: "totalSubmissions",
    label: "Total requests",
    description: "In the current view",
    tone: "border-border/70"
  },
  {
    key: "needsReview",
    label: "Awaiting review",
    description: "New or currently in review",
    tone: "border-sky-200/70 bg-sky-50/40"
  },
  {
    key: "readyOrContacted",
    label: "Ready to follow up",
    description: "Brief ready or already contacted",
    tone: "border-emerald-200/70 bg-emerald-50/40"
  },
  {
    key: "briefsGenerated",
    label: "Briefs available",
    description: "Requests with stored project briefs",
    tone: "border-amber-200/70 bg-amber-50/40"
  }
] as const;

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const intakes = await getAdminIntakeList();
  const serviceOptions = getServiceOptions(intakes);
  const requestedStatus = getSelectedStatus(getSingleSearchParam(resolvedSearchParams.status));
  const requestedService = getSingleSearchParam(resolvedSearchParams.service);
  const selectedService = requestedService && serviceOptions.includes(requestedService) ? requestedService : null;
  const filteredIntakes = intakes.filter((item) => {
    if (requestedStatus && item.status !== requestedStatus) {
      return false;
    }

    if (selectedService && item.serviceRequested !== selectedService) {
      return false;
    }

    return true;
  });
  const stats = getDashboardStats(filteredIntakes);
  const hasActiveFilters = Boolean(requestedStatus || selectedService);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Operations dashboard"
        description="Review incoming requests, keep the queue moving, and open the full intake workspace when more context is needed."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCardConfig.map((stat) => (
          <Card key={stat.key} className={stat.tone}>
            <CardHeader className="space-y-3 pb-3">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
                <CardTitle className="text-4xl font-semibold tracking-tight">
                  {stats[stat.key]}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {intakes.length > 0 ? (
        <AdminDashboardFilters
          totalCount={intakes.length}
          filteredCount={filteredIntakes.length}
          selectedStatus={requestedStatus}
          selectedService={selectedService}
          serviceOptions={serviceOptions}
        />
      ) : null}

      <IntakesTable
        items={filteredIntakes}
        totalCount={intakes.length}
        hasActiveFilters={hasActiveFilters}
        clearHref="/admin"
      />
    </div>
  );
}
