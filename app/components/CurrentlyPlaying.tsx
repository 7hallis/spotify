
"use client";

import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";


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
    external_urls?: { spotify?: string };
  } | null;
};

function formatTime(ms: number) {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function CurrentlyPlaying() {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState("Carregando música...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let lastSync = Date.now();
    let interval: ReturnType<typeof setInterval>;

    async function refreshTrack() {
      try {
        const { data: accounts, error: accountsError } =
          await authClient.listAccounts();

        if (accountsError) throw new Error(accountsError.message);

        const account = accounts?.find(
          (item) => item.providerId === "spotify"
        );

        if (!account) throw new Error("Conecte sua conta Spotify.");

        const { data: tokenData, error: tokenError } =
          await authClient.getAccessToken({
            accountId: account.id,
          });

        const accessToken = tokenData?.accessToken;

        if (tokenError || !accessToken) {
          throw new Error("Não foi possível obter o token Spotify.");
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
          if (active) {
            setTrack(null);
            setMessage("Nenhuma música tocando agora.");
          }
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro Spotify: ${response.status}`);
        }

        const data: TrackData = await response.json();

        if (active) {
          setTrack(data);
          setPosition(data.progress_ms ?? 0);
          lastSync = Date.now();
          setMessage(data.item ? "" : "Nenhuma música disponível.");
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Erro ao buscar música."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    refreshTrack();

    // Atualiza os dados do Spotify a cada 10 segundos
    const syncInterval = setInterval(refreshTrack, 10_000);

    // Anima a linha do tempo a cada segundo
    interval = setInterval(() => {
      if (!active) return;

      setPosition((current) => {
        if (!track?.is_playing || !track.item) return current;

        const elapsed = Date.now() - lastSync;
        return Math.min(
          (track.progress_ms ?? 0) + elapsed,
          track.item.duration_ms
        );
      });
    }, 1000);

    return () => {
      active = false;
      clearInterval(syncInterval);
      clearInterval(interval);
    };
  }, [track?.is_playing, track?.item?.duration_ms, track?.progress_ms]);

  if (loading) return <p>Carregando música...</p>;
  if (!track?.item) return <p>{message}</p>;

  const song = track.item;
  const canvasUrl = song.album.images[0]?.url ?? "";
  const duration = song.duration_ms;
  const progress = Math.min(position, duration);
  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md space-y-3 rounded-2xl border p-4">
      <div className="flex items-center gap-3">
   
        {song.album?.images?.[0]?.url && (
            
          <img
            src={song.album.images[0].url}
            alt={`Capa de ${song.album.name}`}
            className={`h-20 w-20 rounded-full object-cover ${
                track.is_playing ? "" : ""
            }`}
            />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{song.name}</p>
          <p className="truncate text-sm text-gray-500">
            {song.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className="text-xs text-gray-500">
            {track.is_playing ? "Tocando agora" : "Pausada"}
          </p>
        </div>
      </div>

      {/* Linha do tempo */}
      <div className="space-y-1">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-700"
          role="progressbar"
          aria-label="Progresso da música"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-[#1DB954] transition-[width] duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {song.external_urls?.spotify && (
        <a
          href={song.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          Abrir no Spotify
        </a>
      )}
    </div>
  );
}