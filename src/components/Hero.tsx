import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import type { Channel } from "../data/iptv";
import { useStream } from "../context/StreamContext";
import { PlayIcon, HeartIcon, InfoIcon } from "./icons";

/** Hero rotativo, no espírito do Prime Video / Disney+. */
export function Hero({ items }: { items: Channel[] }) {
  const { tune, isFav, toggleFav, setView } = useStream();
  const [index, setIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState<Record<string, boolean>>({});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(
    () => setIndex((i) => (items.length ? (i + 1) % items.length : 0)),
    [items.length]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    timer.current = setInterval(next, 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, items.length]);

  if (items.length === 0) return null;
  const item = items[Math.min(index, items.length - 1)];
  const fav = isFav(item.id);
  const failed = logoFailed[item.id];

  return (
    <section className="relative overflow-hidden">
      {/* fundo em camadas */}
      <div className="absolute inset-0 bg-app-gradient" />
      <div
        className="absolute -right-24 top-0 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #22b7f2 0%, transparent 65%)" }}
      />
      <div
        className="absolute -left-32 top-24 h-[360px] w-[360px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto flex min-h-[540px] max-w-[1500px] flex-col justify-center gap-8 px-4 pb-16 pt-28 sm:px-6 lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:pt-32">
        {/* texto */}
        <div key={item.id} className="animate-fade-up max-w-xl flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
            Ao vivo agora
          </span>

          <h1 className="mt-4 font-display text-4xl font-black leading-[1.03] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {item.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-white/60">
            <span className="rounded border border-white/20 px-1.5 py-0.5 text-[11px] font-semibold text-white/80">
              HD
            </span>
            <span>{item.category}</span>
            {item.country && (
              <>
                <span className="text-white/25">•</span>
                <span>{item.country}</span>
              </>
            )}
            {item.language && (
              <>
                <span className="text-white/25">•</span>
                <span className="capitalize">{item.language}</span>
              </>
            )}
          </div>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
            Transmissão aberta e gratuita, direto da grade mundial. Escolha um
            canal e comece a assistir na hora — sem cadastro, sem login.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => tune(item)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-[#0a0e1a] shadow-xl shadow-black/40 transition hover:scale-[1.03] hover:bg-sky-50 active:scale-95"
            >
              <PlayIcon className="h-4.5 w-4.5" />
              Assistir
            </button>
            <button
              onClick={() => toggleFav(item.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold backdrop-blur transition hover:scale-[1.03] active:scale-95",
                fav
                  ? "border-rose-400/50 bg-rose-500/15 text-rose-200"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <HeartIcon filled={fav} className="h-4.5 w-4.5" />
              {fav ? "Nos favoritos" : "Favoritar"}
            </button>
            <button
              onClick={() => setView("channels")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white/20 active:scale-95"
            >
              <InfoIcon className="h-4.5 w-4.5" />
              Ver grade
            </button>
          </div>
        </div>

        {/* painel do canal */}
        <div className="relative hidden flex-1 items-center justify-center lg:flex">
          <button
            onClick={() => tune(item)}
            className="tile animate-float group relative h-64 w-full max-w-md overflow-hidden rounded-2xl"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10" />
            {item.logo && !failed ? (
              <img
                src={item.logo}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed((m) => ({ ...m, [item.id]: true }))}
                className="relative h-full w-full object-contain p-10 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="relative grid h-full w-full place-items-center text-white/15">
                <PlayIcon className="h-16 w-16" />
              </span>
            )}
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-red-600/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
              Ao vivo
            </span>
          </button>
        </div>
      </div>

      {/* indicadores */}
      {items.length > 1 && (
        <div className="relative mx-auto -mt-6 flex max-w-[1500px] items-center gap-2 px-4 pb-6 sm:px-6 lg:px-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Canal em destaque ${i + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === index ? "w-10 bg-sky-400" : "w-5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}

      {/* fade para o conteúdo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 hero-fade" />
    </section>
  );
}
