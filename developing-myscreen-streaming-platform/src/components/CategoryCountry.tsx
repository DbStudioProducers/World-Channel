import type { Channel } from "../data/iptv";
import { listCategories, listCountries } from "../data/iptv";
import { cinemaCounts, withoutCinema } from "../data/cinema";
import { useStream } from "../context/StreamContext";
import { TvIcon, GlobeIcon, ChevronRight, ClapperIcon } from "./icons";

export function CategoryList({ channels }: { channels: Channel[] }) {
  const { openBrowse, setView } = useStream();
  const cats = listCategories(withoutCinema(channels));
  const { filmes, series } = cinemaCounts(channels);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {/* categorias à parte: filmes e séries */}
      <button
        onClick={() => setView("cinema")}
        className="group col-span-2 flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-500/10 to-rose-500/10 p-4 text-left transition hover:border-amber-400/50 hover:from-amber-500/15 hover:to-rose-500/15"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-white/10">
          <ClapperIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-bold text-white">
            Filmes &amp; Séries
          </span>
          <span className="text-xs text-white/50">
            {filmes} canais de filmes · {series} de séries
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-amber-300" />
      </button>

      {cats.map((c) => (
        <button
          key={c.name}
          onClick={() => openBrowse({ type: "category", value: c.name })}
          className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300 ring-1 ring-white/10">
            <TvIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-bold text-white">{c.name}</span>
            <span className="text-xs text-white/45">{c.count} canais</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
        </button>
      ))}
    </div>
  );
}

export function CountryList({ channels }: { channels: Channel[] }) {
  const { openBrowse } = useStream();
  const countries = listCountries(channels);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {countries.map((c) => (
        <button
          key={c.name}
          onClick={() => openBrowse({ type: "country", value: c.name })}
          className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left transition hover:border-violet-400/40 hover:bg-white/[0.06]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-violet-300 ring-1 ring-white/10">
            <GlobeIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-bold text-white">{c.name}</span>
            <span className="text-xs text-white/45">{c.count} canais</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-violet-300" />
        </button>
      ))}
    </div>
  );
}
