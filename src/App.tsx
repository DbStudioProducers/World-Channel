import { useMemo, useState } from "react";
import { StreamProvider, useStream } from "./context/StreamContext";
import { byCategory, byCountry, listCategories, matches } from "./data/iptv";
import { movieChannels, seriesChannels, withoutCinema } from "./data/cinema";
import { Navbar } from "./components/Navbar";
import { Player } from "./components/Player";
import { Hero } from "./components/Hero";
import { BrandTiles } from "./components/BrandTiles";
import { ChannelRow } from "./components/ChannelRow";
import { ChannelGrid } from "./components/ChannelGrid";
import { CategoryList, CountryList } from "./components/CategoryCountry";
import { CinemaView } from "./components/CinemaView";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreens";
import { Footer } from "./components/Footer";
import { SearchIcon, GridIcon, GlobeIcon, HeartIcon } from "./components/icons";

/* -------------------------------------------------------------------------- */
/*  Página inicial                                                             */
/* -------------------------------------------------------------------------- */
function Home() {
  const { channels } = useStream();

  const filmes = useMemo(() => movieChannels(channels), [channels]);
  const series = useMemo(() => seriesChannels(channels), [channels]);
  /** demais categorias, sem os canais já promovidos para Filmes/Séries */
  const rest = useMemo(() => withoutCinema(channels), [channels]);
  const cats = useMemo(() => listCategories(rest), [rest]);

  /** canais em destaque no hero (preferindo os que têm logo) */
  const featured = useMemo(() => {
    const withLogo = (arr: typeof channels) => arr.filter((c) => c.logo);
    const pool = [
      ...withLogo(filmes).slice(0, 2),
      ...withLogo(series).slice(0, 1),
      ...withLogo(byCategory(rest, "News")).slice(0, 1),
      ...withLogo(byCategory(rest, "Sports")).slice(0, 1),
    ];
    const seen = new Set<string>();
    const unique = pool.filter((c) => !seen.has(c.id) && seen.add(c.id));
    return unique.length > 0 ? unique : withLogo(channels).slice(0, 5);
  }, [channels, filmes, series, rest]);

  return (
    <>
      <Hero items={featured} />
      <main className="relative z-10 space-y-9 pb-16">
        <BrandTiles channels={channels} />

        {/* categorias à parte: filmes e séries */}
        <ChannelRow
          title="🎬 Canais de Filmes"
          subtitle={`${filmes.length} canais transmitindo longas`}
          items={filmes.slice(0, 24)}
        />
        <ChannelRow
          title="🍿 Canais de Séries"
          subtitle={`${series.length} canais com seriados e novelas`}
          items={series.slice(0, 24)}
        />

        {cats.slice(0, 8).map((cat) => (
          <ChannelRow
            key={cat.name}
            title={cat.name}
            subtitle={`${cat.count} canais ao vivo`}
            items={byCategory(rest, cat.name).slice(0, 24)}
          />
        ))}
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cabeçalho reutilizável das páginas internas                                */
/* -------------------------------------------------------------------------- */
function PageHeader({
  icon,
  title,
  subtitle,
  tone = "sky",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone?: "sky" | "violet" | "rose";
}) {
  const tones = {
    sky: "bg-sky-400/10 text-sky-300",
    violet: "bg-violet-400/10 text-violet-300",
    rose: "bg-rose-400/10 text-rose-300",
  } as const;
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ring-white/10 ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-white/45">{subtitle}</p>
      </div>
    </div>
  );
}

const PAGE = "mx-auto min-h-screen max-w-[1500px] px-4 pb-16 pt-24 sm:px-6 lg:px-10";

/* -------------------------------------------------------------------------- */
/*  Grade completa                                                             */
/* -------------------------------------------------------------------------- */
function ChannelsView() {
  const { channels } = useStream();
  const [cat, setCat] = useState("Todos");
  const cats = useMemo(
    () => ["Todos", ...listCategories(channels).map((c) => c.name)],
    [channels]
  );
  const items = cat === "Todos" ? channels : byCategory(channels, cat);

  return (
    <main className={PAGE}>
      <PageHeader
        icon={<GridIcon className="h-5 w-5" />}
        title="Todos os canais"
        subtitle={`${channels.length} canais sintonizados ao vivo de todo o mundo.`}
      />
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              c === cat
                ? "shrink-0 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-[#0a0e1a]"
                : "shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/25 hover:text-white"
            }
          >
            {c}
          </button>
        ))}
      </div>
      <ChannelGrid items={items} />
    </main>
  );
}

function CategoriesView() {
  const { channels } = useStream();
  return (
    <main className={PAGE}>
      <PageHeader
        icon={<GridIcon className="h-5 w-5" />}
        title="Categorias"
        subtitle="Explore os canais por tipo de conteúdo."
      />
      <CategoryList channels={channels} />
    </main>
  );
}

function CountriesView() {
  const { channels } = useStream();
  return (
    <main className={PAGE}>
      <PageHeader
        icon={<GlobeIcon className="h-5 w-5" />}
        title="TV por país"
        subtitle="Descubra canais de todas as regiões do mundo."
        tone="violet"
      />
      <CountryList channels={channels} />
    </main>
  );
}

function FavoritesView() {
  const { favorites, channels } = useStream();
  const items = channels.filter((c) => favorites.includes(c.id));
  return (
    <main className={PAGE}>
      <PageHeader
        icon={<HeartIcon filled className="h-5 w-5" />}
        title="Favoritos"
        subtitle="Seus canais preferidos, salvos neste dispositivo."
        tone="rose"
      />
      {items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
          <HeartIcon className="h-12 w-12 text-white/20" />
          <p className="mt-4 font-display text-lg font-bold text-white">
            Nenhum favorito ainda
          </p>
          <p className="mt-1 max-w-xs text-sm text-white/50">
            Toque no coração de um canal para salvá-lo aqui — assim você o
            encontra mais rápido.
          </p>
        </div>
      ) : (
        <ChannelGrid items={items} />
      )}
    </main>
  );
}

function BrowseView({ type, value }: { type: "category" | "country"; value: string }) {
  const { channels, closeBrowse } = useStream();
  const items =
    type === "category" ? byCategory(channels, value) : byCountry(channels, value);
  return (
    <main className={PAGE}>
      <button
        onClick={closeBrowse}
        className="mb-4 text-sm font-medium text-white/50 transition hover:text-sky-400"
      >
        ← Voltar
      </button>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
          {value}
        </h1>
        <p className="mt-1 text-sm text-white/45">
          {type === "category" ? "Categoria" : "País"} · {items.length} canais ao vivo.
        </p>
      </div>
      <ChannelGrid items={items} />
    </main>
  );
}

function SearchView() {
  const { channels, search } = useStream();
  const results = useMemo(() => matches(channels, search), [channels, search]);
  return (
    <main className={PAGE}>
      <PageHeader
        icon={<SearchIcon className="h-5 w-5" />}
        title="Resultados da busca"
        subtitle={`${results.length} canal${results.length === 1 ? "" : "is"} para “${search}”`}
      />
      {results.length > 0 ? (
        <ChannelGrid items={results} />
      ) : (
        <div className="grid place-items-center py-20 text-center">
          <div className="text-5xl">📺</div>
          <p className="mt-4 font-display text-lg font-semibold text-white">
            Nenhum canal encontrado
          </p>
          <p className="mt-1 text-sm text-white/50">
            Tente outro nome de canal, país ou categoria.
          </p>
        </div>
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roteador simples                                                           */
/* -------------------------------------------------------------------------- */
function Browser() {
  const { view, search, browse, status } = useStream();

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen />;

  const page = search.trim() ? (
    <SearchView />
  ) : browse ? (
    <BrowseView type={browse.type} value={browse.value} />
  ) : view === "cinema" ? (
    <CinemaView />
  ) : view === "categories" ? (
    <CategoriesView />
  ) : view === "countries" ? (
    <CountriesView />
  ) : view === "favorites" ? (
    <FavoritesView />
  ) : view === "channels" ? (
    <ChannelsView />
  ) : (
    <Home />
  );

  return (
    <>
      {page}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <StreamProvider>
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar />
        <Browser />
        <Player />
      </div>
    </StreamProvider>
  );
}
