import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { to: "/shop", label: "Alle Socken" },
      { to: "/faq", label: "FAQ" },
      { to: "/versand", label: "Versand & Lieferung" },
      { to: "/rueckgabe", label: "Rückgabe" },
    ],
  },
  {
    title: "Marke",
    links: [
      { to: "/ueber-uns", label: "Über uns" },
      { to: "/kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { to: "/impressum", label: "Impressum" },
      { to: "/datenschutz", label: "Datenschutz" },
      { to: "/agb", label: "AGB" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Fadenglück</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Personalisierte und fertig bestickte Socken – in kleiner Auflage in unserer Werkstatt
            gefertigt.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-foreground">
              <Instagram className="size-5" />
            </a>
            <a href="#" aria-label="Facebook" className="transition-colors hover:text-foreground">
              <Facebook className="size-5" />
            </a>
            <a href="#" aria-label="TikTok" className="transition-colors hover:text-foreground">
              <Music2 className="size-5" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold tracking-wide uppercase">{col.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fadenglück. Alle Preise inkl. MwSt.
      </div>
    </footer>
  );
}
