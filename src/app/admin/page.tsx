import { IntakesTable } from "@/components/admin/intakes-table";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminIntakeList } from "@/server/admin-intakes/get-admin-intake-list";

export default async function AdminDashboardPage() {
  const intakes = await getAdminIntakeList();
  const totalSubmissions = intakes.length;
  const activeReviews = intakes.filter((intake) => intake.status === "new" || intake.status === "reviewing").length;
  const readyOrContacted = intakes.filter(
    (intake) => intake.status === "brief_ready" || intake.status === "contacted"
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Intake Dashboard"
        description="View incoming project requests, keep them moving through the intake pipeline, and jump into the full submission detail when you need more context."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{totalSubmissions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Needs review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{activeReviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ready or contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{readyOrContacted}</p>
          </CardContent>
        </Card>
      </div>

      <IntakesTable items={intakes} />
    </div>
  );
}
