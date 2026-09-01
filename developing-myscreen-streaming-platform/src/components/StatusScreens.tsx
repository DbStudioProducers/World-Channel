import { useStream } from "../context/StreamContext";
import { LogoMark } from "./Logo";
import { RefreshIcon } from "./icons";

export function LoadingScreen() {
  return (
    <div className="bg-app-gradient fixed inset-0 z-[100] grid place-items-center px-6 text-center">
      <div className="flex flex-col items-center">
        <LogoMark className="h-16 w-16 animate-scale-in rounded-2xl" />
        <p className="mt-4 font-display text-2xl font-black tracking-tight text-white">
          World<span className="text-gradient-wc">Channel</span>
        </p>
        <p className="mt-2 max-w-xs text-sm text-white/50">
          Sintonizando a lista mundial de canais ao vivo…
        </p>
        <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
            style={{ animation: "wc-slide 1s ease-in-out infinite" }}
          />
        </div>
      </div>
      <style>{`@keyframes wc-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }`}</style>
    </div>
  );
}

export function ErrorScreen() {
  const { error, reload } = useStream();
  return (
    <div className="bg-app-gradient fixed inset-0 z-[100] grid place-items-center px-6 text-center">
      <div className="flex max-w-md flex-col items-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-3xl ring-1 ring-white/10">
          📡
        </span>
        <h1 className="mt-5 font-display text-2xl font-black text-white">
          Não foi possível sintonizar
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          A lista de canais pode estar temporariamente fora do ar ou o acesso à
          rede foi bloqueado. Verifique sua conexão e tente novamente.
        </p>
        {error && (
          <p className="mt-3 w-full truncate rounded-lg bg-white/5 px-3 py-2 text-xs text-white/40">
            {error}
          </p>
        )}
        <button
          onClick={reload}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.03]"
        >
          <RefreshIcon className="h-4.5 w-4.5" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
