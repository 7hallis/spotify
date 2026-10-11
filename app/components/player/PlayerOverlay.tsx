"use client";

import type { Track } from "../../types/player";

export type PlayerLayout =
  | "horizontal"
  | "card"
  | "compact"
  | "minimal"
  | "lunar";

export type PlayerOverlayConfig = {
  layout: PlayerLayout;
  theme: "glass" | "neon" | "minimal" | "lunar";

  color: string;

  opacity: number;
  blur: number;
  radius: number;

  showCover: boolean;
  showArtist: boolean;
  showProgress: boolean;

  animation: "none" | "fade" | "slide" | "glow";
};

type PlayerOverlayProps = {
  config: PlayerOverlayConfig;
  track: Track;
};

export function PlayerOverlay({
  config,
  track,
}: PlayerOverlayProps) {
  switch (config.layout) {
    case "card":
      return <CardLayout config={config} track={track} />;

    case "compact":
      return <CompactLayout config={config} track={track} />;

    case "minimal":
      return <MinimalLayout config={config} track={track} />;

    case "lunar":
      return <LunarLayout config={config} track={track} />;

    case "horizontal":
    default:
      return <HorizontalLayout config={config} track={track} />;
  }
}


// HorizontalLayout
function HorizontalLayout({
  config,
  track,
}: PlayerOverlayProps) {
  return (
    <div
      className="relative flex w-full max-w-xl items-center gap-4 overflow-hidden border border-white/10 p-4 shadow-2xl"
      style={{
        borderRadius: config.radius,
        opacity: config.opacity,
        backdropFilter: `blur(${config.blur}px)`,
        backgroundColor: "rgba(9, 9, 11, 0.7)",
      }}
    >
      {config.showCover && (
        <Cover
          src={track.cover}
          color={config.color}
        />
      )}

      <div className="min-w-0 flex-1">
        <Title track={track} />

        {config.showArtist && (
          <Artist track={track} />
        )}

        {config.showProgress && (
          <Progress
            value={track.progress}
            color={config.color}
          />
        )}
      </div>
    </div>
  );
}

// Layout Card

function CardLayout({
  config,
  track,
}: PlayerOverlayProps) {
  return (
    <div
      className="w-full max-w-sm overflow-hidden border border-white/10 bg-zinc-950/80 p-5 shadow-2xl"
      style={{
        borderRadius: config.radius,
        opacity: config.opacity,
        backdropFilter: `blur(${config.blur}px)`,
      }}
    >
      {config.showCover && (
        <div className="aspect-square overflow-hidden rounded-2xl">
          <img
            src={track.cover}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mt-5">
        <Title track={track} />

        {config.showArtist && (
          <Artist track={track} />
        )}

        {config.showProgress && (
          <div className="mt-5">
            <Progress
              value={track.progress}
              color={config.color}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Compact Layout

function CompactLayout({
  config,
  track,
}: PlayerOverlayProps) {
  return (
    <div
      className="flex w-fit items-center gap-3 border border-white/10 bg-black/60 px-3 py-2"
      style={{
        borderRadius: config.radius,
        opacity: config.opacity,
        backdropFilter: `blur(${config.blur}px)`,
      }}
    >
      {config.showCover && (
        <img
          src={track.cover}
          alt=""
          className="h-8 w-8 rounded-lg object-cover"
        />
      )}

      <div className="max-w-48">
        <Title track={track} />

        {config.showArtist && (
          <Artist track={track} />
        )}
      </div>
    </div>
  );
}


// Minimal Layout

function MinimalLayout({
  config,
  track,
}: PlayerOverlayProps) {
  return (
    <div className="w-fit">
      <div className="flex items-center gap-2">
        <span
          style={{ color: config.color }}
          className="text-lg"
        >
          ♪
        </span>

        <span className="text-sm text-white">
          {track.title}
        </span>

        {config.showArtist && (
          <>
            <span className="text-zinc-600">
              •
            </span>

            <span className="text-sm text-zinc-400">
              {track.artist}
            </span>
          </>
        )}
      </div>

      {config.showProgress && (
        <div className="mt-2 h-px w-full bg-white/10">
          <div
            className="h-full"
            style={{
              width: `${track.progress}%`,
              backgroundColor: config.color,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Lunar Layout

function LunarLayout({
  config,
  track,
}: PlayerOverlayProps) {
  return (
    <div className="relative w-full max-w-xl">

      {/* Lua / glow */}
      <div
        className="absolute -left-10 -top-10 h-32 w-32 rounded-full blur-3xl"
        style={{
          backgroundColor: config.color,
          opacity: 0.12,
        }}
      />

      <div
        className="relative overflow-hidden border border-white/10 bg-zinc-950/70 p-5 shadow-2xl backdrop-blur-2xl"
        style={{
          borderRadius: config.radius,
          opacity: config.opacity,
        }}
      >
        <div className="flex items-center gap-4">

          {config.showCover && (
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl blur-xl"
                style={{
                  backgroundColor: config.color,
                  opacity: 0.2,
                }}
              />

              <img
                src={track.cover}
                alt=""
                className="relative h-16 w-16 rounded-2xl object-cover"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2">
              <span
                className="text-sm"
                style={{ color: config.color }}
              >
                ☾
              </span>

              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Now playing
              </span>
            </div>

            <p className="mt-1 truncate text-lg font-semibold text-white">
              {track.title}
            </p>

            {config.showArtist && (
              <p className="text-sm text-zinc-400">
                {track.artist}
              </p>
            )}

            {config.showProgress && (
              <Progress
                value={track.progress}
                color={config.color}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares

function Cover({
  src,
  color,
}: {
  src: string;
  color: string;
}) {
  return (
    <div
      className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"
      style={{
        boxShadow: `0 0 30px ${color}30`,
      }}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function Title({ track }: { track: Track }) {
  return (
    <p className="truncate text-sm font-semibold text-white">
      {track.title}
    </p>
  );
}

function Artist({ track }: { track: Track }) {
  return (
    <p className="mt-0.5 truncate text-xs text-zinc-400">
      {track.artist}
    </p>
  );
}

function Progress({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
}