import { useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { useStream } from "../context/StreamContext";
import {
  movieChannels,
  seriesChannels,
  animationChannels,
  classicChannels,
  documentaryChannels,
} from "../data/cinema";
import { ChannelGrid } from "./ChannelGrid";
import { ChannelRow } from "./ChannelRow";
import { ClapperIcon, FilmIcon, TvIcon } from "./icons";

type Tab = "todos" | "filmes" | "series";

export function CinemaView() {
  const { channels } = useStream();
  const [tab, setTab] = useState<Tab>("todos");

  const filmes = useMemo(() => movieChannels(channels), [channels]);
  const series = useMemo(() => seriesChannels(channels), [channels]);
  const animacao = useMemo(() => animationChannels(channels), [channels]);
  const classicos = useMemo(() => classicChannels(channels), [channels]);
  const docs = useMemo(() => documentaryChannels(channels), [channels]);

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "todos", label: "Visão geral", count: filmes.length + series.length },
    { id: "filmes", label: "Canais de Filmes", count: filmes.length },
    { id: "series", label: "Canais de Séries", count: series.length },
  ];

  const empty = filmes.length === 0 && series.length === 0;

  return (
    <main className="mx-auto min-h-screen max-w-[1500px] pb-16 pt-24">
      {/* Cabeçalho */}
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-rose-500/20 text-amber-300 ring-1 ring-white/10">
            <ClapperIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
              Filmes &amp; Séries
            </h1>
            <p className="text-sm text-white/45">
              Canais que transmitem longas-metragens e seriados, separados do resto da grade.
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-lg">
          <SummaryCard
            icon={<FilmIcon className="h-5 w-5" />}
            label="Canais de Filmes"
            count={filmes.length}
            tone="amber"
            active={tab === "filmes"}
            onClick={() => setTab("filmes")}
          />
          <SummaryCard
            icon={<TvIcon className="h-5 w-5" />}
            label="Canais de Séries"
            count={series.length}
            tone="violet"
            active={tab === "series"}
            onClick={() => setTab("series")}
          />
        </div>

        {/* Abas */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition",
                tab === t.id
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              )}
            >
              {t.label} · {t.count}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mt-7">
        {empty ? (
          <div className="mx-4 grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center sm:mx-6 lg:mx-10">
            <ClapperIcon className="h-12 w-12 text-white/20" />
            <p className="mt-4 font-display text-lg font-bold text-white">
              Nenhum canal de filmes ou séries encontrado
            </p>
            <p className="mt-1 max-w-sm text-sm text-white/50">
              A lista sintonizada não trouxe canais dessas categorias no momento.
            </p>
          </div>
        ) : tab === "filmes" ? (
          <div className="px-4 sm:px-6 lg:px-10">
            <ChannelGrid items={filmes} />
          </div>
        ) : tab === "series" ? (
          <div className="px-4 sm:px-6 lg:px-10">
            <ChannelGrid items={series} />
          </div>
        ) : (
          <div className="space-y-8">
            <ChannelRow
              title="🎬 Canais de Filmes"
              subtitle={`${filmes.length} canais exibindo longas agora`}
              items={filmes.slice(0, 24)}
            />
            <ChannelRow
              title="📺 Canais de Séries"
              subtitle={`${series.length} canais com seriados e novelas`}
              items={series.slice(0, 24)}
            />
            <ChannelRow
              title="🍿 Clássicos do cinema"
              subtitle={`${classicos.length} canais`}
              items={classicos.slice(0, 24)}
            />
            <ChannelRow
              title="🎨 Animação & Anime"
              subtitle={`${animacao.length} canais`}
              items={animacao.slice(0, 24)}
            />
            <ChannelRow
              title="🎥 Documentários"
              subtitle={`${docs.length} canais`}
              items={docs.slice(0, 24)}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  count,
  tone,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  tone: "amber" | "violet";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
        active
          ? "border-white/25 bg-white/[0.08]"
          : "border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/10",
          tone === "amber"
            ? "bg-amber-400/15 text-amber-300"
            : "bg-violet-400/15 text-violet-300"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-xl font-black leading-none text-white">
          {count}
        </span>
        <span className="mt-1 block truncate text-xs text-white/50">{label}</span>
      </span>
    </button>
  );
}
