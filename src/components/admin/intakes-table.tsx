import Link from "next/link";

import { IntakeStatusBadge } from "@/components/admin/intake-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBudgetRange, formatDateTime } from "@/lib/intake/formatters";
import type { AdminIntakeListItem } from "@/types";

type IntakesTableProps = {
  items: AdminIntakeListItem[];
};

export function IntakesTable({ items }: IntakesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent submissions</CardTitle>
        <CardDescription>Review new project requests and open the detail view for status changes and notes.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            No intake submissions have been created yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Service type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget range</TableHead>
                <TableHead>Created at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/intakes/${item.id}`} className="hover:text-primary hover:underline">
                      {item.clientName}
                    </Link>
                  </TableCell>
                  <TableCell>{item.companyName ?? "—"}</TableCell>
                  <TableCell className="max-w-64 text-sm text-foreground">{item.serviceRequested}</TableCell>
                  <TableCell>
                    <IntakeStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatBudgetRange(item.budgetRange)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
