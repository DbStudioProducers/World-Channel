import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const PlayIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" {...p}>
    <path d="M8 5.14v13.72c0 .9.98 1.46 1.75.99l11-6.86a1.16 1.16 0 0 0 0-1.98l-11-6.86A1.16 1.16 0 0 0 8 5.14Z" />
  </svg>
);
export const PauseIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </svg>
);
export const InfoIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
export const VolumeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);
export const MuteIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="m16 9 6 6" />
    <path d="m22 9-6 6" />
  </svg>
);
export const FullscreenIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);
export const ExitFullscreenIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
    <path d="M16 3v3a2 2 0 0 0 2 2h3" />
    <path d="M8 21v-3a2 2 0 0 0-2-2H3" />
    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);
export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.6 1.3 6.5L12 17.3 6.1 20.5l1.3-6.5L2.5 9.4l6.6-.8L12 2.5Z" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z" />
    <path d="M9 22V12h6v10" />
  </svg>
);
export const TvIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="m17 2-5 5-5-5" />
  </svg>
);
export const FilmIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 4v5" />
    <path d="M16 4v5" />
    <path d="M3 15h18" />
    <path d="M8 15v5" />
    <path d="M16 15v5" />
  </svg>
);
export const ClapperIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
    <path d="m3.4 10-.9-3.3a1 1 0 0 1 .7-1.2l14.5-3.9a1 1 0 0 1 1.2.7l.9 3.3Z" />
    <path d="m8 4.6 1.6 4.6" />
    <path d="m13.4 3.1 1.6 4.6" />
  </svg>
);
export const GridIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
export const GlobeIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </svg>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}>
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .8-4.5 2.4C10.5 3.8 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7 7-7Z" />
  </svg>
);
export const ListIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
);
export const SparklesIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
    <path d="m6 6 2 2" />
    <path d="m16 16 2 2" />
    <path d="m6 18 2-2" />
    <path d="m16 8 2-2" />
  </svg>
);
export const DownloadIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4" />
    <path d="m15.4 6.5-6.8 4" />
  </svg>
);
export const RefreshIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v5h-5" />
  </svg>
);
