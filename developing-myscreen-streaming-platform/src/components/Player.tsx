import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { cn } from "../utils/cn";
import { useStream } from "../context/StreamContext";
import {
  PlayIcon,
  PauseIcon,
  CloseIcon,
  VolumeIcon,
  MuteIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
  HeartIcon,
  RefreshIcon,
} from "./icons";

export function Player() {
  const { playing, stop, isFav, toggleFav } = useStream();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retriesRef = useRef(0);

  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  const key = playing?.id ?? "";
  const url = playing?.url ?? "";

  /* --- monta o stream sempre que o canal (ou um retry) muda --- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setBuffering(true);
    setError(false);
    retriesRef.current = 0;

    // limpa instância anterior
    hlsRef.current?.destroy();
    hlsRef.current = null;
    video.removeAttribute("src");
    video.load();

    const isHls = /\.m3u8(\?|$)/i.test(url);
    const canNativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (isHls && Hls.isSupported()) {
      const h = new Hls({ enableWorker: true, maxBufferLength: 30 });
      hlsRef.current = h;
      h.loadSource(url);
      h.attachMedia(video);
      h.on(Hls.Events.MANIFEST_PARSED, () => {
        setBuffering(false);
        video.play().catch(() => {});
      });
      h.on(Hls.Events.ERROR, (_evt, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && retriesRef.current < 3) {
          retriesRef.current += 1;
          h.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && retriesRef.current < 3) {
          retriesRef.current += 1;
          h.recoverMediaError();
        } else {
          setBuffering(false);
          setError(true);
        }
      });
    } else if (isHls && canNativeHls) {
      video.src = url;
      video.play().catch(() => {});
      setBuffering(false);
    } else {
      video.src = url;
      video.play().catch(() => {});
      setBuffering(false);
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [url, reload]);

  // limpeza ao fechar/trocar de canal
  useEffect(() => {
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [key]);

  const poke = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    poke();
  }, [poke, key]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const setVol = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!playing) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setVol(Math.min(1, v.volume + 0.1)); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setVol(Math.max(0, v.volume - 0.1)); }
      else if (e.key.toLowerCase() === "m") setVol(v.volume === 0 ? 0.9 : 0);
      else if (e.key === "f") toggleFullscreen();
      else if (e.key === "Escape") stop();
      poke();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, stop, poke]);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  if (!playing) return null;
  const fav = isFav(playing.id);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[60] bg-black"
      onClick={poke}
      onMouseMove={poke}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        autoPlay
        playsInline
        onPlaying={() => { setBuffering(false); setError(false); }}
        onWaiting={() => setBuffering(true)}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onClick={togglePlay}
      />

      {/* buffering */}
      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
        </div>
      )}

      {/* erro */}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/70 px-6 text-center">
          <div className="max-w-sm">
            <span className="text-4xl">📡</span>
            <h3 className="mt-3 font-display text-xl font-bold text-white">Sinal indisponível</h3>
            <p className="mt-1 text-sm text-white/55">
              Este canal não respondeu no momento. Somente alguns canais
              públicos ficam online 24h — tente outro ou recarregue.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setReload((r) => r + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-100"
              >
                <RefreshIcon className="h-4 w-4" /> Recarregar
              </button>
              <button
                onClick={stop}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topo */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/85 to-transparent p-4 transition-opacity duration-300",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          onClick={stop}
          aria-label="Voltar"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="font-display truncate text-base font-bold text-white">{playing.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="inline-flex items-center gap-1 rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" /> Ao vivo
            </span>
            {playing.category}
            {playing.country && <> · {playing.country}</>}
          </p>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => toggleFav(playing.id)}
          aria-label="Favoritar canal"
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full backdrop-blur transition",
            fav ? "bg-rose-500/90 text-white" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-rose-300"
          )}
        >
          <HeartIcon filled={fav} className="h-5 w-5" />
        </button>
      </div>

      {/* Controles inferiores */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} aria-label="Reproduzir/Pausar" className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:scale-105">
            {isPaused ? <PlayIcon className="ml-0.5 h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVol(muted || volume === 0 ? 0.9 : 0)}
              aria-label="Volume"
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {muted || volume === 0 ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="h-1 w-20 cursor-pointer accent-cyan-400"
              aria-label="Volume"
            />
          </div>

          <div className="flex-1" />

          <span className="hidden rounded border border-white/25 px-1.5 py-0.5 text-[10px] uppercase text-white/60 sm:inline">
            SD / HD
          </span>
          <button onClick={toggleFullscreen} aria-label="Tela cheia" className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white">
            {fullscreen ? <ExitFullscreenIcon className="h-5 w-5" /> : <FullscreenIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
