import { cn } from "../utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-900/40",
        className
      )}
    >
      {/* globo */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.5 2.2 3.8 5 3.8 8.5s-1.3 6.3-3.8 8.5c-2.5-2.2-3.8-5-3.8-8.5s1.3-6.3 3.8-8.5Z" />
        <path d="M7 7c1.6 1.2 3.4 1.8 5 1.8s3.4-.6 5-1.8" opacity=".0" />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-lg font-extrabold tracking-tight text-white">
        World<span className="text-gradient-wc">Channel</span>
      </span>
    </span>
  );
}
