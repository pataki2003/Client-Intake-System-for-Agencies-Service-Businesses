import type { ReactNode } from "react";

import type { JsonValue } from "@/types";

function isJsonObject(value: JsonValue | null | undefined): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatMetadataKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderMetadataValue(value: JsonValue, depth = 0): ReactNode {
  if (value === null || value === "") {
    return <p className="text-sm text-muted-foreground">Not provided</p>;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <p className="break-words text-sm leading-6 text-foreground">{String(value)}</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-muted-foreground">Not provided</p>;
    }

    return (
      <ul className="space-y-2">
        {value.map((entry, index) => (
          <li key={`${index}-${String(entry)}`} className="rounded-xl border bg-background px-3 py-2">
            {renderMetadataValue(entry, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  const entries = Object.entries(value);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No source metadata captured for this submission.</p>;
  }

  return (
    <dl className={depth > 0 ? "space-y-3 rounded-xl border bg-background px-4 py-3" : "space-y-3"}>
      {entries.map(([key, entryValue]) => (
        <div key={key} className="grid gap-1.5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {formatMetadataKey(key)}
          </dt>
          <dd>{renderMetadataValue(entryValue, depth + 1)}</dd>
        </div>
      ))}
    </dl>
  );
}

type AdminJsonMetadataProps = {
  value: JsonValue | null;
};

export function AdminJsonMetadata({ value }: AdminJsonMetadataProps) {
  if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
    return <p className="text-sm text-muted-foreground">No source metadata captured for this submission.</p>;
  }

  if (isJsonObject(value) && Object.keys(value).length === 0) {
    return <p className="text-sm text-muted-foreground">No source metadata captured for this submission.</p>;
  }

  return <div className="space-y-3">{renderMetadataValue(value)}</div>;
}
