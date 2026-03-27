"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormattedBudgetRange, FormattedDateTime, IntakeStatusBadge } from "@/components/shared/intake-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AdminIntakeListItem } from "@/types";

type IntakesTableProps = {
  items: AdminIntakeListItem[];
  totalCount: number;
  hasActiveFilters: boolean;
  clearHref: string;
};

export function IntakesTable({ items, totalCount, hasActiveFilters, clearHref }: IntakesTableProps) {
  const router = useRouter();

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">Recent submissions</CardTitle>
          <CardDescription>
            {hasActiveFilters
              ? `Showing ${items.length} matching submissions from ${totalCount} total records in the queue.`
              : "Review incoming requests, scan the current queue, and open the full detail workspace when you need more context."}
          </CardDescription>
        </div>
        <p className="text-sm text-muted-foreground">Select any row to open the full intake review workspace.</p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-6 py-12 text-center">
            <p className="text-base font-medium">
              {hasActiveFilters ? "No submissions match this view yet." : "No intake submissions have been created yet."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try clearing one or both filters to return to the full queue."
                : "New public intake submissions will appear here once clients start submitting requests."}
            </p>
            {hasActiveFilters ? (
              <Button asChild variant="outline" className="mt-5">
                <Link href={clearHref}>Clear filters</Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Client</TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Company</TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Service</TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Status</TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Budget</TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-[0.16em]">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const detailHref = `/admin/intakes/${item.id}`;

                return (
                  <TableRow
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open intake details for ${item.clientName}`}
                    onClick={() => router.push(detailHref)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(detailHref);
                      }
                    }}
                    className="group cursor-pointer outline-none transition-all hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/70"
                  >
                    <TableCell className="py-5">
                      <div className="rounded-xl px-2 py-1 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
                            {item.clientName}
                          </span>
                          {item.hasBrief ? (
                            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[11px] font-medium">
                              Brief
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <span>Open intake workspace</span>
                          <span
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                          >
                            -&gt;
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-1">
                        <p className={cn("text-sm font-medium", !item.companyName && "text-muted-foreground")}>
                          {item.companyName ?? "Not provided"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.companyName ? "Client organization" : "Independent or not specified"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px] py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.serviceRequested}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.hasBrief ? "Brief already generated" : "Awaiting internal brief"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <IntakeStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-1">
                        <FormattedBudgetRange
                          value={item.budgetRange}
                          className="text-sm font-medium text-foreground"
                          fallbackClassName="text-sm font-medium text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.budgetRange ? "Budget guidance provided" : "Needs confirmation"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <FormattedDateTime
                        value={item.createdAt}
                        showRelative
                        className="space-y-1"
                        valueClassName="font-medium text-foreground"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
