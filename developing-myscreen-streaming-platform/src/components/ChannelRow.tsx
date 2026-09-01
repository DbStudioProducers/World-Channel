import { useRef, useState } from "react";
import { cn } from "../utils/cn";
import type { Channel } from "../data/iptv";
import { ChannelCard } from "./ChannelCard";
import { ChevronLeft, ChevronRight } from "./icons";

export function ChannelRow({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: Channel[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  if (items.length === 0) return null;

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="mb-2.5 flex items-end justify-between px-4 sm:px-6 lg:px-10">
        <div>
          <h2 className="font-display text-lg font-bold text-white sm:text-xl">{title}</h2>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          onScroll={update}
          className="no-scrollbar flex gap-2.5 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10"
        >
          {items.map((c) => (
            <div key={c.id} className="w-[168px] shrink-0 sm:w-[200px]">
              <ChannelCard channel={c} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollBy(-1)}
          aria-label="Anterior"
          className={cn(
            "absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80 group-hover/row:opacity-100",
            canLeft ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Próximo"
          className={cn(
            "absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80 group-hover/row:opacity-100",
            canRight ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
