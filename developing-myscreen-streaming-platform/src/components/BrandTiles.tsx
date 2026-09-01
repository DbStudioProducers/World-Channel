import { useStream } from "../context/StreamContext";
import type { Channel } from "../data/iptv";
import { byCategory } from "../data/iptv";
import { movieChannels, seriesChannels } from "../data/cinema";

/**
 * Blocos de marca no estilo Disney+ : atalhos grandes e ilustrados para as
 * principais frentes do catálogo.
 */
interface Tile {
  key: string;
  label: string;
  emoji: string;
  gradient: string;
  count: number;
  go: () => void;
}

export function BrandTiles({ channels }: { channels: Channel[] }) {
  const { setView, openBrowse } = useStream();

  const count = (cat: string) => byCategory(channels, cat).length;

  const tiles: Tile[] = [
    {
      key: "movies",
      label: "Filmes",
      emoji: "🎬",
      gradient: "from-amber-500/25 via-orange-500/10 to-transparent",
      count: movieChannels(channels).length,
      go: () => setView("cinema"),
    },
    {
      key: "series",
      label: "Séries",
      emoji: "🍿",
      gradient: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
      count: seriesChannels(channels).length,
      go: () => setView("cinema"),
    },
    {
      key: "news",
      label: "Notícias",
      emoji: "📰",
      gradient: "from-sky-500/25 via-blue-500/10 to-transparent",
      count: count("News"),
      go: () => openBrowse({ type: "category", value: "News" }),
    },
    {
      key: "sports",
      label: "Esportes",
      emoji: "⚽",
      gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
      count: count("Sports"),
      go: () => openBrowse({ type: "category", value: "Sports" }),
    },
    {
      key: "music",
      label: "Música",
      emoji: "🎵",
      gradient: "from-pink-500/25 via-rose-500/10 to-transparent",
      count: count("Music"),
      go: () => openBrowse({ type: "category", value: "Music" }),
    },
    {
      key: "kids",
      label: "Infantil",
      emoji: "🧸",
      gradient: "from-cyan-500/25 via-sky-500/10 to-transparent",
      count: count("Kids"),
      go: () => openBrowse({ type: "category", value: "Kids" }),
    },
  ];

  return (
    <section className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <button
            key={t.key}
            onClick={t.go}
            className="tile group relative overflow-hidden rounded-xl p-3 text-center sm:p-4"
          >
            <span
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${t.gradient} opacity-80`}
            />
            <span className="relative flex flex-col items-center gap-1.5">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
                {t.emoji}
              </span>
              <span className="font-display text-xs font-bold text-white sm:text-sm">
                {t.label}
              </span>
              <span className="text-[10px] text-white/45">{t.count} canais</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
