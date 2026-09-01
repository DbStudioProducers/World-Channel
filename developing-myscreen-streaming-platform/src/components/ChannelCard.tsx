import { useState } from "react";
import { cn } from "../utils/cn";
import type { Channel } from "../data/iptv";
import { useStream } from "../context/StreamContext";
import { PlayIcon, HeartIcon, TvIcon } from "./icons";

export function ChannelCard({ channel }: { channel: Channel }) {
  const { tune, isFav, toggleFav } = useStream();
  const [logoFailed, setLogoFailed] = useState(false);
  const fav = isFav(channel.id);

  return (
    <div className="group/card w-full">
      <button
        onClick={() => tune(channel)}
        className="tile relative w-full select-none overflow-hidden rounded-xl text-left"
      >
        <div className="relative aspect-video overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.07] via-transparent to-violet-500/[0.07]" />

          {channel.logo && !logoFailed ? (
            <img
              src={channel.logo}
              alt={channel.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <span className="relative grid h-full w-full place-items-center text-white/15">
              <TvIcon className="h-10 w-10" />
            </span>
          )}

          {/* AO VIVO */}
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
            Ao vivo
          </span>

          {/* Favoritar */}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(channel.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                toggleFav(channel.id);
              }
            }}
            className={cn(
              "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full backdrop-blur transition",
              fav
                ? "bg-rose-500/90 text-white"
                : "bg-black/50 text-white/60 opacity-0 hover:bg-black/80 hover:text-rose-300 group-hover/card:opacity-100"
            )}
            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <HeartIcon filled={fav} className="h-4 w-4" />
          </span>

          {/* Play no hover */}
          <span className="absolute inset-0 grid place-items-center bg-[#0a0e1a]/0 opacity-0 transition duration-300 group-hover/card:bg-[#0a0e1a]/45 group-hover/card:opacity-100">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#0a0e1a] shadow-2xl transition duration-300 group-hover/card:scale-110">
              <PlayIcon className="ml-0.5 h-5 w-5" />
            </span>
          </span>
        </div>
      </button>

      {/* legenda fora do cartão, estilo Disney+ */}
      <div className="px-0.5 pt-2">
        <p className="truncate font-display text-[13px] font-semibold text-white/90 transition group-hover/card:text-white">
          {channel.name}
        </p>
        <p className="truncate text-[11px] text-white/40">
          {channel.category}
          {channel.country ? ` · ${channel.country}` : ""}
        </p>
      </div>
    </div>
  );
}
