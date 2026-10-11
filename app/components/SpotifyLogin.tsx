
"use client";

import { authClient } from "../lib/auth-client";

export function SpotifyLogin() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: "/",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  if (isPending) {
    return (
      <button disabled>
        Carregando...
      </button>
    )
  }

  if (session) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-red-500 px-6 py-3
          font-semibold text-white transition hover:bg-red-600"
      >
        Sair
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="rounded-full bg-[#1DB954] px-6 py-3
        font-semibold text-black transition hover:bg-[#1ed760]"
    >
      Entrar com Spotify
    </button>
  )
}