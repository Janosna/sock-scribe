type Props = {
  text: string;
  threadColor: string;
  font: string;
  sockColor: string;
};

const FONT_STACK: Record<string, string> = {
  Serif: "var(--font-display)",
  Sans: "var(--font-sans)",
  Script: "var(--font-script)",
};

export function SockPreview({ text, threadColor, font, sockColor }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/60 p-6">
      <svg viewBox="0 0 200 220" className="h-52 w-auto" role="img" aria-label="Vorschau der Socke">
        <path
          d="M60 20h60a10 10 0 0 1 10 10v90c0 18 8 26 24 34l16 8a24 24 0 0 1-12 44l-30-8c-30-8-48-30-48-62V30a10 10 0 0 1 10-10z"
          fill={sockColor}
          stroke="rgba(0,0,0,0.14)"
          strokeWidth="2"
        />
        <path d="M60 20h70v18H60z" fill="rgba(0,0,0,0.05)" />
        <text
          x="95"
          y="78"
          textAnchor="middle"
          fill={threadColor}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="0.4"
          style={{ fontFamily: FONT_STACK[font] ?? FONT_STACK["Sans"], fontSize: 20 }}
        >
          {text || "DEIN TEXT"}
        </text>
      </svg>
      <p className="text-xs text-muted-foreground">
        Visuelle Vorschau – die endgültige Stickerei kann leicht abweichen.
      </p>
    </div>
  );
}
