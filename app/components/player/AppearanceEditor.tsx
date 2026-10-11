"use client";

import { useState } from "react";
import { PlayerPreview } from "./PlayerPreview";
import { AppearancePanel } from "./AppearancePanel";

type PlayerConfig = {
  theme: "glass" | "neon" | "minimal" | "lunar";
  color: string;
  opacity: number;
  blur: number;
  radius: number;
  showCover: boolean;
  showArtist: boolean;
  showProgress: boolean;
};

export function AppearanceEditor() {
  const [config, setConfig] = useState<PlayerConfig>({
    theme: "lunar",
    color: "#22c55e",
    opacity: 0.95,
    blur: 16,
    radius: 24,
    showCover: true,
    showArtist: true,
    showProgress: true,
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-sm font-medium text-emerald-400">
              THUN PLAYER
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Aparência
            </h1>
          </div>

          <button className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300">
            Salvar
          </button>

        </div>
      </header>

      {/* Editor */}
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">

        {/* Preview */}
        <section>
          <div className="mb-4">
            <p className="text-sm text-zinc-500">
              PREVIEW
            </p>

            <h2 className="text-lg font-medium">
              Veja como ficará na sua live
            </h2>
          </div>

          <PlayerPreview config={config} />
        </section>

        {/* Configurações */}
        <AppearancePanel
          config={config}
          setConfig={setConfig}
        />

      </div>
    </main>
  );
}