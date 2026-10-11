"use client";

import { ThemeSelector } from "./ThemeSelector";

type PlayerLayout =
  | "horizontal"
  | "card"
  | "compact"
  | "minimal"
  | "lunar";

type PlayerTheme =
  | "glass"
  | "neon"
  | "minimal"
  | "lunar";

type PlayerConfig = {
  layout: PlayerLayout;
  theme: PlayerTheme;

  color: string;

  opacity: number;
  blur: number;
  radius: number;

  showCover: boolean;
  showArtist: boolean;
  showProgress: boolean;
};

type AppearancePanelProps = {
  config: PlayerConfig;
  setConfig: React.Dispatch<React.SetStateAction<PlayerConfig>>;
};

const layouts: {
  id: PlayerLayout;
  name: string;
  description: string;
}[] = [
  {
    id: "horizontal",
    name: "Horizontal",
    description: "Player compacto e completo",
  },
  {
    id: "card",
    name: "Card",
    description: "Capa em destaque",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Ocupa pouco espaço",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Visual extremamente limpo",
  },
  {
    id: "lunar",
    name: "🌙 Lunar",
    description: "Estilo especial do Thun",
  },
];

const elements: {
  key: "showCover" | "showArtist" | "showProgress";
  label: string;
}[] = [
  {
    key: "showCover",
    label: "Mostrar capa",
  },
  {
    key: "showArtist",
    label: "Mostrar artista",
  },
  {
    key: "showProgress",
    label: "Mostrar progresso",
  },
];

export function AppearancePanel({
  config,
  setConfig,
}: AppearancePanelProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          Aparência
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Personalize seu overlay para a live.
        </p>
      </div>

      <div className="space-y-8">

        {/* Layout */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Layout
          </label>

          <div className="grid grid-cols-2 gap-3">
            {layouts.map((layout) => {
              const isActive = config.layout === layout.id;

              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() =>
                    setConfig((current) => ({
                      ...current,
                      layout: layout.id,
                    }))
                  }
                  className={`
                    rounded-2xl border p-4 text-left
                    transition-all duration-200
                    ${
                      isActive
                        ? "border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_25px_rgba(52,211,153,0.08)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white">
                      {layout.name}
                    </span>

                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {layout.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tema */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Tema
          </label>

          <ThemeSelector
            value={config.theme}
            onChange={(theme) =>
              setConfig((current) => ({
                ...current,
                theme,
              }))
            }
          />
        </div>

        {/* Cor */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Cor principal
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.color}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  color: event.target.value,
                }))
              }
              className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              aria-label="Escolher cor principal"
            />

            <input
              type="text"
              value={config.color}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  color: event.target.value,
                }))
              }
              className="h-10 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition focus:border-emerald-400/50"
              placeholder="#22C55E"
            />
          </div>
        </div>

        {/* Opacidade */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="opacity"
              className="text-sm text-zinc-300"
            >
              Opacidade
            </label>

            <span className="text-xs text-zinc-500">
              {Math.round(config.opacity * 100)}%
            </span>
          </div>

          <input
            id="opacity"
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={config.opacity}
            onChange={(event) =>
              setConfig((current) => ({
                ...current,
                opacity: Number(event.target.value),
              }))
            }
            className="w-full accent-emerald-400"
          />
        </div>

        {/* Blur */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="blur"
              className="text-sm text-zinc-300"
            >
              Blur
            </label>

            <span className="text-xs text-zinc-500">
              {config.blur}px
            </span>
          </div>

          <input
            id="blur"
            type="range"
            min="0"
            max="30"
            step="1"
            value={config.blur}
            onChange={(event) =>
              setConfig((current) => ({
                ...current,
                blur: Number(event.target.value),
              }))
            }
            className="w-full accent-emerald-400"
          />
        </div>

        {/* Arredondamento */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="radius"
              className="text-sm text-zinc-300"
            >
              Arredondamento
            </label>

            <span className="text-xs text-zinc-500">
              {config.radius}px
            </span>
          </div>

          <input
            id="radius"
            type="range"
            min="0"
            max="40"
            step="1"
            value={config.radius}
            onChange={(event) =>
              setConfig((current) => ({
                ...current,
                radius: Number(event.target.value),
              }))
            }
            className="w-full accent-emerald-400"
          />
        </div>

        {/* Elementos */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Elementos
          </label>

          <div className="space-y-3">
            {elements.map((element) => (
              <label
                key={element.key}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3 transition hover:border-white/10 hover:bg-black/30"
              >
                <span className="text-sm text-zinc-400">
                  {element.label}
                </span>

                <input
                  type="checkbox"
                  checked={config[element.key]}
                  onChange={(event) =>
                    setConfig((current) => ({
                      ...current,
                      [element.key]: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-emerald-400"
                />
              </label>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}




