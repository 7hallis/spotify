
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "../../lib/auth-client";

type PlayerLayout =
  | "horizontal"
  | "card"
  | "compact"
  | "minimal"
  | "lunar";

type PlayerTheme = "glass" | "neon" | "minimal" | "lunar";

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

type PlayerPreviewProps = {
  config: PlayerConfig;
};

type TrackData = {
  is_playing: boolean;
  progress_ms: number | null;
  item: {
    name: string;
    duration_ms: number;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    external_urls?: {
      spotify?: string;
    };
  } | null;
};

function formatTime(ms: number) {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function PlayerPreview({ config }: PlayerPreviewProps) {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackRef = useRef<TrackData | null>(null);
  const lastSyncRef = useRef(0);

  const refreshTrack = useCallback(async () => {
    try {
      const accountsResult = await authClient.listAccounts();
      const accounts = accountsResult.data ?? [];

      const account = accounts.find(
        (item) => item.providerId === "spotify"
      );

      if (!account) {
        trackRef.current = null;
        setTrack(null);
        setProgress(0);
        setError("Conecte sua conta Spotify para visualizar o player.");
        return;
      }

      const tokenResult = await authClient.getAccessToken({
        accountId: account.id,
      });

      const accessToken = tokenResult.data?.accessToken;

      if (!accessToken) {
        setError("Não foi possível obter o token do Spotify.");
        return;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 204) {
        trackRef.current = null;
        setTrack(null);
        setProgress(0);
        setError(null);
        return;
      }

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Sessão Spotify expirada. Reconecte sua conta."
            : `Erro ao consultar Spotify (${response.status}).`
        );
      }

      const data: TrackData = await response.json();

      trackRef.current = data;
      const syncedAt = Date.now();
      lastSyncRef.current = syncedAt;

      setTrack(data);
      setProgress(data.progress_ms ?? 0);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar a música."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTrack();

    const pollInterval = setInterval(() => {
      void refreshTrack();
    }, 10000);

    const progressInterval = setInterval(() => {
      const current = trackRef.current;

      if (!current?.is_playing || !current.item) return;

      const elapsed = Date.now() - lastSyncRef.current;
      const currentProgress = current.progress_ms ?? 0;

      setProgress(
        Math.min(
          currentProgress + elapsed,
          current.item.duration_ms
        )
      );
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(progressInterval);
    };
  }, [refreshTrack]);

  const item = track?.item;
  const duration = item?.duration_ms ?? 0;
  const safeProgress = Math.min(progress, duration);

  const progressPercent =
    duration > 0 ? (safeProgress / duration) * 100 : 0;

  const cover = item?.album.images?.[0]?.url;

  const artist =
    item?.artists.map((entry) => entry.name).join(", ") ??
    "Artista desconhecido";

  // O layout controla a disposição dos elementos.
  // O tema controla somente as cores e os efeitos.
  const isHorizontal = config.layout === "horizontal";
  const isCard = config.layout === "card";
  const isCompact = config.layout === "compact";
  const isMinimal = config.layout === "minimal";
  const isLunarLayout = config.layout === "lunar";
  const isLunarTheme = config.theme === "lunar";

  const themeStyles: Record<
    PlayerTheme,
    {
      background: string;
      border: string;
      shadow: string;
      text: string;
      muted: string;
    }
  > = {
    glass: {
      background: `rgba(24, 24, 27, 0.65,${config.opacity})`,
      border: "rgba(255,255,255,0.18)",
      shadow: "0 8px 32px rgba(0,0,0,0.15)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.60)",
    },
    neon: {
      background: `rgba(10,10,20,${config.opacity})`,
      border: `${config.color}88`,
      shadow: `0 0 24px ${config.color}33`,
      text: "#ffffff",
      muted: "rgba(255,255,255,0.60)",
    },
    minimal: {
      background: `rgba(24,24,27,${config.opacity})`,
      border: "rgba(255,255,255,0.10)",
      shadow: "0 4px 18px rgba(0,0,0,0.12)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.55)",
    },
    lunar: {
      background: `linear-gradient(145deg, rgba(25,30,55,${Math.max(
        config.opacity,
        0.85
      )}), rgba(8,10,25,0.98))`,
      border: `${config.color}66`,
      shadow: `0 12px 40px rgba(0,0,0,0.35), 0 0 28px ${config.color}18`,
      text: "#f5f3ff",
      muted: "rgba(226,232,240,0.60)",
    },
  };

  const theme = themeStyles[config.theme];

  const coverSize = isMinimal
    ? "h-10 w-10"
    : isCompact
      ? "h-14 w-14"
      : isLunarLayout
        ? "h-36 w-36 sm:h-44 sm:w-44"
        : "h-20 w-20 sm:h-24 sm:w-24";

  // Apenas o layout muda a posição da capa e das informações.
  const contentLayout = isCard
    ? "flex-col items-start"
    : isLunarLayout
      ? "flex-col items-center text-center"
      : "flex-row items-center";

  return (
    <div
      className="relative isolate flex w-full min-w-0 max-w-full flex-col gap-4 overflow-hidden border p-4 sm:p-5"
      style={{
        background: theme.background,
        borderColor: theme.border,
        boxShadow: theme.shadow,
        borderRadius: `${config.radius}px`,
        backdropFilter: `blur(${config.blur}px)`,
        WebkitBackdropFilter: `blur(${config.blur}px)`,
        color: theme.text,
      }}
    >
      {/* Decoração exclusiva do tema Lunar */}
      {isLunarTheme && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 -z-10 h-44 w-44 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: config.color }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-12 -z-10 h-36 w-36 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: "#a5b4fc" }}
          />
        </>
      )}

      {/* Cabeçalho Lunar */}
      {isLunarTheme && (
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
            Lunar player
          </span>

          <span className="flex shrink-0 items-center gap-1.5 text-[10px] text-white/60">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: track?.is_playing
                  ? "#86efac"
                  : "#94a3b8",
              }}
            />
            {track?.is_playing ? "NOW PLAYING" : "SPOTIFY"}
          </span>
        </div>
      )}

      {/* Conteúdo principal */}
      <div
        className={[
          "flex w-full min-w-0 gap-3",
          contentLayout,
          isHorizontal ? "sm:gap-4" : "",
          isCompact ? "gap-3" : "",
          isLunarLayout ? "gap-4" : "",
        ].join(" ")}
      >
        {/* Capa */}
        {config.showCover && (
          <div
            className={[
              "relative shrink-0 overflow-hidden bg-white/5",
              coverSize,
              isLunarTheme ? "ring-1 ring-white/15" : "",
            ].join(" ")}
            style={{
              borderRadius: isLunarTheme
                ? "16px"
                : `${Math.max(6, config.radius * 0.65)}px`,
              boxShadow: isLunarTheme
                ? `0 8px 30px ${config.color}22`
                : undefined,
            }}
          >
            {cover ? (
              <img
                src={cover}
                alt={`Capa do álbum ${item?.album.name ?? ""}`}
                className="block h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/35">
                <span className="text-2xl">♫</span>
              </div>
            )}
          </div>
        )}

        {/* Informações da música */}
        <div
          className={[
            "min-w-0 flex-1",
            isLunarLayout ? "w-full" : "",
            isCard ? "w-full" : "",
          ].join(" ")}
        >
          <p
            className={[
              "w-full truncate font-semibold",
              isLunarLayout ? "text-lg sm:text-xl" : "text-sm sm:text-base",
            ].join(" ")}
            title={item?.name ?? ""}
          >
            {loading
              ? "Carregando música..."
              : item?.name ?? "Nenhuma música tocando"}
          </p>

          {config.showArtist && (
            <p
              className="mt-1 w-full truncate text-xs"
              style={{ color: theme.muted }}
              title={artist}
            >
              {item ? artist : "Sua música aparecerá aqui"}
            </p>
          )}

          {isLunarTheme && item?.album.name && (
            <p
              className="mt-1 w-full truncate text-[11px]"
              style={{ color: theme.muted }}
              title={item.album.name}
            >
              {/* {item.album.name} */}
            </p>
          )}

          {error && (
            <p
              className="mt-2 break-words text-xs text-red-400"
              role="status"
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Linha do tempo: sempre abaixo do conteúdo */}
      {config.showProgress && (
        <div className="w-full min-w-0">
          <div
            className="mb-2 flex items-center justify-between gap-3 text-[10px] tabular-nums"
            style={{ color: theme.muted }}
          >
            <span>{formatTime(safeProgress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div
            role="progressbar"
            aria-label="Progresso da música"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercent)}
            className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: config.color,
                boxShadow: isLunarTheme
                  ? `0 0 12px ${config.color}88`
                  : undefined,
              }}
            />
          </div>
        </div>
      )}

      {/* Rodapé Lunar */}
      {isLunarTheme && (
        <div
          className={[
            "flex w-full min-w-0 items-center gap-2 pt-1 text-[10px] tracking-wide",
            isLunarLayout ? "justify-center" : "",
          ].join(" ")}
          style={{ color: theme.muted }}
        >
          <span aria-hidden="true">☾</span>
          <span className="truncate">
            {track?.is_playing
              ? "Em sintonia com a noite"
              : "Seu universo musical"}
          </span>
          <span aria-hidden="true">✦</span>
        </div>
      )}
    </div>
  );
}