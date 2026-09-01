/** Leitura/escrita segura em localStorage (não precisa de login — fica no dispositivo). */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota/private-mode errors */
  }
}

export const LS_KEYS = {
  favorites: "worldchannel.favorites",
  lastChannel: "worldchannel.lastChannel",
} as const;
