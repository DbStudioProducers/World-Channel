import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Channel } from "../data/iptv";
import { loadChannels } from "../data/iptv";
import { load, save, LS_KEYS } from "../lib/storage";

export type View =
  | "home"
  | "channels"
  | "cinema"
  | "categories"
  | "countries"
  | "favorites";
export type Status = "loading" | "ready" | "error";
export interface Browse {
  type: "category" | "country";
  value: string;
}

interface StreamState {
  channels: Channel[];
  status: Status;
  error: string | null;
  reload: () => void;

  view: View;
  setView: (v: View) => void;

  /** canal sintonizado no player */
  playing: Channel | null;
  tune: (c: Channel) => void;
  stop: () => void;

  favorites: string[];
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;

  search: string;
  setSearch: (s: string) => void;

  browse: Browse | null;
  openBrowse: (b: Browse) => void;
  closeBrowse: () => void;
}

const Ctx = createContext<StreamState | null>(null);

export function StreamProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [view, setView] = useState<View>("home");
  const [playing, setPlaying] = useState<Channel | null>(null);
  const [search, setSearch] = useState("");
  const [browse, setBrowse] = useState<Browse | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => load(LS_KEYS.favorites, []));

  useEffect(() => save(LS_KEYS.favorites, favorites), [favorites]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);
    loadChannels()
      .then((ch) => {
        if (cancelled) return;
        setChannels(ch);
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Não foi possível carregar os canais.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const tune = useCallback((c: Channel) => setPlaying(c), []);
  const stop = useCallback(() => setPlaying(null), []);

  const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);
  const toggleFav = useCallback((id: string) => {
    setFavorites((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    );
  }, []);

  const openBrowse = useCallback((b: Browse) => setBrowse(b), []);
  const closeBrowse = useCallback(() => setBrowse(null), []);

  // trava a rolagem quando o player estiver aberto
  useEffect(() => {
    document.body.style.overflow = playing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [playing]);

  const value = useMemo<StreamState>(
    () => ({
      channels,
      status,
      error,
      reload,
      view,
      setView,
      playing,
      tune,
      stop,
      favorites,
      isFav,
      toggleFav,
      search,
      setSearch,
      browse,
      openBrowse,
      closeBrowse,
    }),
    [
      channels, status, error, reload, view, playing, tune, stop,
      favorites, isFav, toggleFav, search, browse, openBrowse, closeBrowse,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStream() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStream must be used within StreamProvider");
  return ctx;
}
