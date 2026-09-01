/**
 * ============================================================================
 *  World Channel · Classificador de canais de FILMES e SÉRIES
 * ============================================================================
 *  A lista iptv-org marca parte dos canais com as categorias "Movies" e
 *  "Series" no atributo group-title. Porém muitos canais de cinema ficam
 *  soltos em "General"/"Entertainment".
 *
 *  Este módulo separa esses canais em categorias à parte, combinando:
 *    1. a categoria original do M3U (group-title);
 *    2. uma heurística pelo nome do canal (multi-idioma).
 * ============================================================================
 */

import type { Channel } from "./iptv";

export type CinemaKind = "filmes" | "series" | null;

/** Nomes que indicam canal de SÉRIES / novelas / doramas. */
const SERIES_RE =
  /(s[ée]ries?\b|seriado|novelas?\b|telenovela|teleserie|sitcom|dorama|k-?drama|soap\s?opera|episodios?|episodes?\b|tv\s?shows?\b)/i;

/** Nomes que indicam canal de FILMES / cinema. */
const MOVIES_RE =
  /(cine\b|cinema|cin[ée]|filmes?\b|films?\b|movies?\b|kino\b|pel[ií]culas?|cinemax|telecine|megapix|hollywood|blockbuster|box\s?office|drive-?in|grindhouse|cinestar|moviestar|film\s?box|filmbox)/i;

/** Canais de animação/desenho — exibidos como linha complementar. */
const ANIMATION_RE = /(anima[çc][ãa]o|animation|anime\b|cartoon|desenho|toons?\b)/i;

/** Clássicos / cinema antigo. */
const CLASSIC_RE = /(cl[áa]ssicos?|classic|retro|vintage|oldies|nostalgia)/i;

function haystack(c: Channel) {
  return `${c.name} ${c.groupTitle}`.toLowerCase();
}

/**
 * Classifica um canal como "filmes", "series" ou null (nenhum dos dois).
 * A categoria oficial do M3U tem prioridade sobre a heurística de nome.
 */
export function classify(c: Channel): CinemaKind {
  const group = c.groupTitle.toLowerCase();

  // 1) categoria oficial do iptv-org
  if (/\bseries\b/.test(group)) return "series";
  if (/\bmovies?\b/.test(group)) return "filmes";

  // 2) heurística pelo nome (séries primeiro: é o termo mais específico)
  const name = c.name;
  if (SERIES_RE.test(name)) return "series";
  if (MOVIES_RE.test(name)) return "filmes";

  return null;
}

export const isCinemaChannel = (c: Channel) => classify(c) !== null;

/** Todos os canais que transmitem FILMES. */
export function movieChannels(channels: Channel[]): Channel[] {
  return channels.filter((c) => classify(c) === "filmes");
}

/** Todos os canais que transmitem SÉRIES. */
export function seriesChannels(channels: Channel[]): Channel[] {
  return channels.filter((c) => classify(c) === "series");
}

/** Canais de animação (desenhos/anime). */
export function animationChannels(channels: Channel[]): Channel[] {
  return channels.filter(
    (c) => /\banimation\b/.test(c.groupTitle.toLowerCase()) || ANIMATION_RE.test(haystack(c))
  );
}

/** Canais de clássicos do cinema. */
export function classicChannels(channels: Channel[]): Channel[] {
  return channels.filter(
    (c) => /\bclassic\b/.test(c.groupTitle.toLowerCase()) || CLASSIC_RE.test(haystack(c))
  );
}

/** Canais de documentários. */
export function documentaryChannels(channels: Channel[]): Channel[] {
  return channels.filter((c) => /\bdocumentar/.test(c.groupTitle.toLowerCase()));
}

/** Contagens rápidas para a UI. */
export function cinemaCounts(channels: Channel[]) {
  let filmes = 0;
  let series = 0;
  for (const c of channels) {
    const k = classify(c);
    if (k === "filmes") filmes++;
    else if (k === "series") series++;
  }
  return { filmes, series, total: filmes + series };
}

/**
 * Categorias "normais" — exclui os canais já promovidos para Filmes/Séries,
 * evitando que apareçam duplicados nas linhas comuns da Home.
 */
export function withoutCinema(channels: Channel[]): Channel[] {
  return channels.filter((c) => classify(c) === null);
}
