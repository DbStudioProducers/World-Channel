import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { useStream, type View } from "../context/StreamContext";
import { Logo } from "./Logo";
import {
  SearchIcon,
  CloseIcon,
  HomeIcon,
  TvIcon,
  GridIcon,
  GlobeIcon,
  HeartIcon,
  ClapperIcon,
} from "./icons";

const NAV: { label: string; short: string; view: View; icon: typeof HomeIcon }[] = [
  { label: "Início", short: "Início", view: "home", icon: HomeIcon },
  { label: "Filmes & Séries", short: "Cinema", view: "cinema", icon: ClapperIcon },
  { label: "Canais", short: "Canais", view: "channels", icon: TvIcon },
  { label: "Categorias", short: "Categorias", view: "categories", icon: GridIcon },
  { label: "Países", short: "Países", view: "countries", icon: GlobeIcon },
  { label: "Favoritos", short: "Favoritos", view: "favorites", icon: HeartIcon },
];

export function Navbar() {
  const { view, setView, search, setSearch } = useStream();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const go = (v: View) => {
    setView(v);
    setSearch("");
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "safe-top fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-white/[0.07] bg-[#0a0e1a]/92 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "bg-gradient-to-b from-[#0a0e1a] via-[#0a0e1a]/70 to-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <button onClick={() => go("home")} className="shrink-0 transition-transform hover:scale-105" aria-label="World Channel home">
            <Logo />
          </button>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <button
                key={item.view}
                onClick={() => go(item.view)}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  view === item.view && !search
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                )}
              >
                {item.label}
                {view === item.view && !search && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Busca */}
          <div
            className={cn(
              "flex items-center rounded-full border transition-all duration-300",
              searchOpen ? "w-48 border-white/20 bg-white/5 px-3 sm:w-64" : "w-9 border-transparent"
            )}
          >
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {searchOpen ? <CloseIcon className="h-4.5 w-4.5" /> : <SearchIcon className="h-4.5 w-4.5" />}
            </button>
            {searchOpen && (
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => {
                  if (!search) setSearchOpen(false);
                }}
                placeholder="Canais, países, categorias…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            )}
          </div>

          {/* Status de conexão */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 lg:flex">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-white/70">Em transmissão</span>
          </div>
        </div>
      </header>

      {/* Tab bar mobile */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-white/[0.07] bg-[#0e1526]/97 backdrop-blur-xl md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.view && !search;
          return (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[9px] font-medium leading-tight transition-colors",
                active ? "text-sky-400" : "text-white/45"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              {item.short}
            </button>
          );
        })}
      </nav>
    </>
  );
}
