import { useEffect, useState } from "react";
import type { Channel } from "../data/iptv";
import { ChannelCard } from "./ChannelCard";

const PAGE = 90;

export function ChannelGrid({ items }: { items: Channel[] }) {
  const [n, setN] = useState(PAGE);

  useEffect(() => {
    setN(PAGE);
  }, [items]);

  const shown = items.slice(0, n);

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {shown.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </div>
      {n < items.length && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => setN((v) => v + PAGE)}
            className="rounded-lg border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-sky-400/50 hover:bg-white/10"
          >
            Mostrar mais ({items.length - n} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
