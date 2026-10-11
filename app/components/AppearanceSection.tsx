export function AppearanceSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24">
      {/* Glow */}
      <div className="absolute left-1/2 top-20 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Personalização
          </span>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Seu espaço.
            <br />
            <span className="text-zinc-500">
              Seu jeito.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Personalize sua experiência no Loomi e deixe seu perfil
            com a sua identidade.
          </p>
        </div>

        {/* Card principal */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Preview */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl">

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">

              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">
                  Prévia
                </span>

                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Ao vivo
                </span>
              </div>

              {/* Perfil */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8">

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-xl">
                    T
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Thallis
                    </h3>

                    <p className="text-sm text-zinc-500">
                      Explorando novos mundos...
                    </p>
                  </div>
                </div>

                <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-2/3 rounded-full bg-emerald-400" />
                </div>

              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">

            <h3 className="mb-8 text-xl font-semibold text-white">
              Aparência
            </h3>

            {/* Tema */}
            <div className="mb-8">
              <p className="mb-3 text-sm text-zinc-400">
                Tema
              </p>

              <div className="grid grid-cols-3 gap-3">

                <button className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  Loomi
                </button>

                <button className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 transition hover:border-white/20">
                  Escuro
                </button>

                <button className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-zinc-700 transition hover:border-white/20">
                  Claro
                </button>

              </div>
            </div>

            {/* Cores */}
            <div>
              <p className="mb-3 text-sm text-zinc-400">
                Cor de destaque
              </p>

              <div className="flex gap-3">

                <button className="h-10 w-10 rounded-full bg-emerald-400 ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900" />

                <button className="h-10 w-10 rounded-full bg-blue-400" />

                <button className="h-10 w-10 rounded-full bg-purple-400" />

                <button className="h-10 w-10 rounded-full bg-pink-400" />

                <button className="h-10 w-10 rounded-full bg-orange-400" />

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}