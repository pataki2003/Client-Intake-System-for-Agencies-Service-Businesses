import { PageHeader } from "@/components/shared/page-header";
import { PlaceholderPanel } from "@/components/shared/placeholder-panel";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Route"
        title="Admin Login"
        description="Placeholder entry point for authenticated admin access."
      />

      <PlaceholderPanel
        title="Planned scope"
        description="This page will host Supabase authentication UI for agency admins."
      >
        <p className="text-sm text-muted-foreground">
          Keep authentication isolated from the public intake flow and use this route as the single login entry for the dashboard.
        </p>
      </PlaceholderPanel>
    </div>
  );
}
