import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";

type IntakeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IntakeDetailPage({ params }: IntakeDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Route"
        title={`Intake ${id}`}
        description="Placeholder detail page for reviewing a single submission, internal notes, and the AI-generated project brief."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <PlaceholderPanel
          title="Submission details"
          description="Use this section for all captured client responses and admin-editable metadata."
        />

        <PlaceholderPanel
          title="AI project brief"
          description="This area should render the stored brief and expose a regenerate action later."
        />

        <PlaceholderPanel
          title="Internal notes"
          description="This section should support private collaboration between admins only."
        />
      </div>
    </div>
  );
}
