import type { ReactNode } from "react";

export function ContentPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
