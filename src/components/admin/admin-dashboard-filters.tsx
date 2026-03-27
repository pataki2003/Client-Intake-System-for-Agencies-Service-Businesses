"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatIntakeStatus } from "@/lib/intake/formatters";
import { cn } from "@/lib/utils";
import { INTAKE_STATUSES, type IntakeStatus } from "@/types";

type AdminDashboardFiltersProps = {
  totalCount: number;
  filteredCount: number;
  selectedStatus: IntakeStatus | null;
  selectedService: string | null;
  serviceOptions: string[];
};

export function AdminDashboardFilters({
  totalCount,
  filteredCount,
  selectedStatus,
  selectedService,
  serviceOptions
}: AdminDashboardFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = Boolean(selectedStatus || selectedService);

  function updateFilter(key: "status" | "service", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const nextHref = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(nextHref);
    });
  }

  return (
    <Card className="border-border/70 bg-secondary/15 shadow-sm">
      <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">View controls</p>
            <p className="text-lg font-semibold tracking-tight">Filter the queue</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? `Showing ${filteredCount} of ${totalCount} requests in this view.`
              : `${totalCount} requests in the current queue.`}
          </p>
          {hasActiveFilters ? (
            <div className="flex flex-wrap gap-2">
              {selectedStatus ? <Badge variant="outline">Status: {formatIntakeStatus(selectedStatus)}</Badge> : null}
              {selectedService ? <Badge variant="outline">Service: {selectedService}</Badge> : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[180px] space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Status</Label>
            <Select
              disabled={isPending}
              onValueChange={(value) => updateFilter("status", value)}
              value={selectedStatus ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {INTAKE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatIntakeStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[220px] space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Service</Label>
            <Select
              disabled={isPending}
              onValueChange={(value) => updateFilter("service", value)}
              value={selectedService ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="All services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            {hasActiveFilters ? (
              <Button asChild variant="ghost">
                <Link href={pathname}>Reset filters</Link>
              </Button>
            ) : null}

            <p
              className={cn(
                "text-xs text-muted-foreground transition-opacity",
                isPending ? "opacity-100" : "opacity-0"
              )}
            >
              Updating results...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
