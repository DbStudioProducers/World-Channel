/**
 * ============================================================================
 *  World Channel · Camada de dados (lista de canais IPTV)
 * ============================================================================
 *  Sintoniza a lista pública iptv-org (https://iptv-org.github.io/iptv/index.m3u),
 *  a maior lista colaborativa de canais gratuitos do mundo.
 *
 *  O M3U é baixado no navegador (sem servidor, sem login) e interpretado aqui.
 *  Vários espelhos são tentados em sequência para contornar problemas de CORS.
 * ============================================================================
 */

export interface Channel {
  /** id único (a própria URL do stream) */
  id: string;
  name: string;
  logo?: string;
  category: string;
  country: string;
  language: string;
  groupTitle: string;
  url: string;
  /** extremidade de vídeo (para agrupar na UI) */
  isHls: boolean;
}

/** Fontes da playlist, em ordem de prioridade e com fallback de CORS. */
const SOURCES = [
  "https://iptv-org.github.io/iptv/index.m3u",
  "https://cdn.jsdelivr.net/gh/iptv-org/iptv@master/index.m3u",
  "https://iptv-org.github.io/iptv/categories/news.m3u",
];

async function fetchText(url: string, timeoutMs = 30000): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Interpreta o formato M3U do iptv-org. */
export function parseM3U(text: string): Channel[] {
  const lines = text.split(/\r?\n/);
  const channels: Channel[] = [];
  let pending: Partial<Channel> | null = null;

  const attrRe = /([\w-]+)="([^"]*)"/g;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("#EXTINF")) {
      const attrs: Record<string, string> = {};
      let m: RegExpExecArray | null;
      attrRe.lastIndex = 0;
      while ((m = attrRe.exec(line)) !== null) attrs[m[1].toLowerCase()] = m[2];

      // nome = tudo após a última vírgula
      const comma = line.lastIndexOf(",");
      const name = comma >= 0 ? line.slice(comma + 1).trim() : "";
      const groupTitle = attrs["group-title"] ?? "";

      pending = {
        name,
        logo: attrs["tvg-logo"] || undefined,
        groupTitle,
        category: groupTitle.split(";")[0]?.trim() || "Geral",
        country: guessCountry(groupTitle, attrs["tvg-country"]),
        language: attrs["tvg-language"] || "",
      };
    } else if (line && !line.startsWith("#")) {
      if (pending && pending.name) {
        const url = line;
        pending.url = url;
        pending.id = url;
        pending.isHls = /\.m3u8(\?|$)/i.test(url);
        channels.push(pending as Channel);
      }
      pending = null;
    }
  }

  // remove duplicados pela URL, preservando a primeira ocorrência
  const seen = new Set<string>();
  const unique = channels.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  return unique;
}

/* ----------------------------------------------------------------------------
 * Detecção de país (a partir do group-title ou do atributo tvg-country)
 * -------------------------------------------------------------------------- */
const COUNTRY: Array<[string, string]> = [
  ["BR", "Brasil"], ["US", "EUA"], ["PT", "Portugal"], ["GB", "Reino Unido"],
  ["UK", "Reino Unido"], ["FR", "França"], ["DE", "Alemanha"], ["ES", "Espanha"],
  ["IT", "Itália"], ["JP", "Japão"], ["KR", "Coreia do Sul"], ["CN", "China"],
  ["IN", "Índia"], ["CA", "Canadá"], ["MX", "México"], ["AR", "Argentina"],
  ["CL", "Chile"], ["CO", "Colômbia"], ["PE", "Peru"], ["UY", "Uruguai"],
  ["PY", "Paraguai"], ["BO", "Bolívia"], ["EC", "Equador"], ["VE", "Venezuela"],
  ["RU", "Rússia"], ["UA", "Ucrânia"], ["PL", "Polônia"], ["NL", "Países Baixos"],
  ["BE", "Bélgica"], ["SE", "Suécia"], ["NO", "Noruega"], ["DK", "Dinamarca"],
  ["FI", "Finlândia"], ["IE", "Irlanda"], ["AT", "Áustria"], ["CH", "Suíça"],
  ["CZ", "Tchéquia"], ["SK", "Eslováquia"], ["HU", "Hungria"], ["RO", "Romênia"],
  ["BG", "Bulgária"], ["GR", "Grécia"], ["TR", "Turquia"], ["IL", "Israel"],
  ["SA", "Arábia Saudita"], ["AE", "Emirados"], ["QA", "Qatar"], ["EG", "Egito"],
  ["ZA", "África do Sul"], ["NG", "Nigéria"], ["KE", "Quênia"], ["MA", "Marrocos"],
  ["AU", "Austrália"], ["NZ", "Nova Zelândia"], ["ID", "Indonésia"], ["MY", "Malásia"],
  ["SG", "Singapura"], ["TH", "Tailândia"], ["VN", "Vietnã"], ["PH", "Filipinas"],
  ["TW", "Taiwan"], ["HK", "Hong Kong"], ["BD", "Bangladesh"], ["PK", "Paquistão"],
  ["IR", "Irã"], ["IQ", "Iraque"], ["JO", "Jordânia"], ["LB", "Líbano"],
  ["CU", "Cuba"], ["DO", "Rep. Dominicana"], ["GT", "Guatemala"], ["CR", "Costa Rica"],
  ["PA", "Panamá"], ["PR", "Porto Rico"],
];

const CODE_TO_NAME = new Map(COUNTRY.map(([c, n]) => [c.toUpperCase(), n]));
const NAME_TO_CODE = new Map<string, string>();
for (const [c, n] of COUNTRY) {
  NAME_TO_CODE.set(n.toLowerCase(), c);
  NAME_TO_CODE.set(n.toString().toLowerCase(), c);
}

function guessCountry(groupTitle: string, tvgCountry?: string): string {
  if (tvgCountry) {
    const n = CODE_TO_NAME.get(tvgCountry.trim().toUpperCase());
    if (n) return n;
  }
  const parts = groupTitle.split(";").map((p) => p.trim()).filter(Boolean);
  for (const p of parts.slice(1)) {
    const code = CODE_TO_NAME.get(p.toUpperCase());
    if (code) return code;
    const found = NAME_TO_CODE.get(p.toLowerCase());
    if (found) return CODE_TO_NAME.get(found.toUpperCase()) ?? "";
  }
  return "";
}

/* ----------------------------------------------------------------------------
 *  Carregamento com fallback de espelhos
 * -------------------------------------------------------------------------- */
export async function loadChannels(): Promise<Channel[]> {
  let lastErr: unknown = null;
  for (const url of SOURCES) {
    try {
      const text = await fetchText(url);
      const channels = parseM3U(text);
      if (channels.length > 0) return channels;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Falha ao baixar a lista de canais.");
}

/** Categorias presentes na lista, ordenadas por quantidade de canais. */
export function listCategories(channels: Channel[]): Array<{ name: string; count: number }> {
  const map = new Map<string, number>();
  for (const c of channels) map.set(c.category, (map.get(c.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Países presentes na lista, ordenados por quantidade de canais. */
export function listCountries(channels: Channel[]): Array<{ name: string; count: number }> {
  const map = new Map<string, number>();
  for (const c of channels) {
    const k = c.country || "Internacional";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function byCategory(channels: Channel[], category: string): Channel[] {
  return channels.filter((c) => c.category === category);
}
export function byCountry(channels: Channel[], country: string): Channel[] {
  return channels.filter((c) => (c.country || "Internacional") === country);
}
export function matches(channels: Channel[], q: string): Channel[] {
  const s = q.trim().toLowerCase();
  return channels.filter((c) =>
    [c.name, c.category, c.country, c.language].some((f) => f.toLowerCase().includes(s))
  );
}

/** categoria com mais canais (para o destaque da Home). */
export function topCategory(channels: Channel[]): string {
  const list = listCategories(channels);
  return list[0]?.name ?? "News";
}
