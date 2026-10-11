"use client";

type Theme = "glass" | "neon" | "minimal" | "lunar";

type ThemeSelectorProps = {
  value: Theme;
  onChange: (theme: Theme) => void;
};

const themes = [
  {
    id: "glass",
    name: "Glass",
    description: "Transparente e elegante",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Brilho para sua live",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Limpo e discreto",
  },
  {
    id: "lunar",
    name: "Lunar",
    description: "Estilo Thun",
  },
] as const;

export function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => {
        const active = value === theme.id;

        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              active
                ? "border-emerald-400/50 bg-emerald-400/10"
                : "border-white/10 bg-white/2 hover:border-white/20"
            }`}
          >
            <p className="font-medium text-white">
              {theme.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {theme.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}