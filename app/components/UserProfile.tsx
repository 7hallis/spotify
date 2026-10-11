"use client";

import { authClient } from "../lib/auth-client";

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Carregando...</p>;
  }

  if (!session) {
    return <p>Você não está conectado.</p>;
  }

  return (
    <div>
      {session.user.image && (
        <img
          src={session.user.image}
          alt="Foto do perfil"
          width={80}
          height={80}   
        />  
      )}

      <h2>{session.user.name}</h2>
      <p>{session.user.email}</p>
      {/* <p>ID interno: {session.user.id}</p> */}
      <p></p>
    </div>
  );
}