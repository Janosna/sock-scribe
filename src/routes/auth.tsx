import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Anmelden | Fadenglück" },
      { name: "description", content: "Anmeldung zum internen Bereich von Fadenglück." },
      { property: "og:title", content: "Anmelden | Fadenglück" },
      { property: "og:description", content: "Interner Bereich von Fadenglück." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Bitte gib eine gültige E-Mail ein.").max(180),
  password: z.string().min(8, "Das Passwort braucht mindestens 8 Zeichen.").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Bitte prüfe deine Eingaben.");
      return;
    }
    setLoading(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword(parsed.data)
        : await supabase.auth.signUp({
            ...parsed.data,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "signup") {
      toast.success("Konto erstellt. Bitte bestätige ggf. deine E-Mail.");
    }
    navigate({ to: "/admin" });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Anmeldung mit Google hat nicht geklappt.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <div className="container-page flex max-w-md flex-col py-20">
      <h1 className="text-4xl">{mode === "login" ? "Anmelden" : "Konto erstellen"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Zugang zum internen Bereich von Fadenglück.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted-foreground">E-Mail</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted-foreground">Passwort</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl"
            required
          />
        </label>
        <Button type="submit" disabled={loading} className="w-full rounded-full" size="lg">
          {mode === "login" ? "Anmelden" : "Registrieren"}
        </Button>
      </form>

      <Button variant="outline" className="mt-3 w-full rounded-full" onClick={google}>
        Mit Google anmelden
      </Button>

      <button
        className="mt-6 text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon registriert? Anmelden"}
      </button>
    </div>
  );
}
