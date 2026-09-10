import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { isAdminQuery } from "@/lib/admin";

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { data: isAdmin } = useSuspenseQuery(isAdminQuery);

  if (!isAdmin) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl">Kein Zugriff</h1>
        <p className="mt-3 text-muted-foreground">
          Dieses Konto hat keine Administratorrechte. Bitte lass dein Konto freischalten.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">{title}</h1>
        <nav className="flex gap-2 text-sm">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            className="rounded-full border border-border px-4 py-2"
            activeProps={{ className: "bg-primary text-primary-foreground" }}
          >
            Bestellungen
          </Link>
          <Link
            to="/admin/produktion"
            className="rounded-full border border-border px-4 py-2"
            activeProps={{ className: "bg-primary text-primary-foreground" }}
          >
            Produktion
          </Link>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
