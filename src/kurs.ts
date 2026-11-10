/*
 * Kurset: progressive leksjoner du LESER før du øver.
 *
 * Hver leksjon er en Markdown-fil i src/leksjoner/. Format:
 *
 *   id: l-variabler
 *   tittel: Variabler og datatyper
 *   tema: grunnlag, lister
 *   dag: 1
 *   minutter: 12
 *   mal: Hva du skal kunne etter leksjonen.
 *   ===
 *   ## Sidetittel
 *   Vanlig Markdown (avsnitt, lister, tabeller, ```kode```, > HUSK: …)
 *
 *   ?? Kontrollspørsmål (valgfritt, kan ha kodeblokk under)
 *   ( ) feil alternativ
 *   (x) riktig alternativ
 *   => Forklaring som vises etter svar.
 *   ===
 *   ## Neste side …
 */
import type { TopicId } from './types';

export interface Sjekk {
  sporsmal: string; // markdown
  alternativer: string[];
  riktig: number;
  forklaring: string;
}

export interface LeksjonSide {
  tittel: string;
  md: string;
  sjekk?: Sjekk;
}

export interface Leksjon {
  id: string;
  nr: number; // rekkefølge i kurset (fra filnavnet)
  tittel: string;
  temaer: TopicId[];
  dag: number; // studiedagen leksjonen hører til
  minutter: number;
  mal: string;
  sider: LeksjonSide[];
}

export function parseLeksjon(raw: string, filnavn: string): Leksjon {
  const tekst = raw.replace(/\r\n/g, '\n');
  const deler = tekst.split(/\n===[ \t]*\n/);
  const hode: Record<string, string> = {};
  for (const l of deler[0].split('\n')) {
    const m = /^([a-zæøå]+):\s*(.*)$/i.exec(l.trim());
    if (m) hode[m[1].toLowerCase()] = m[2].trim();
  }
  const nr = Number(/(\d+)/.exec(filnavn)?.[1] ?? 0);
  const sider = deler.slice(1).map((d) => parseSide(d, filnavn));
  return {
    id: hode.id ?? filnavn,
    nr,
    tittel: hode.tittel ?? filnavn,
    temaer: (hode.tema ?? '').split(',').map((s) => s.trim()).filter(Boolean) as TopicId[],
    dag: Number(hode.dag ?? 0),
    minutter: Number(hode.minutter ?? 10),
    mal: hode.mal ?? '',
    sider,
  };
}

function parseSide(blokk: string, filnavn: string): LeksjonSide {
  const linjer = blokk.replace(/^\n+/, '').split('\n');
  let tittel = '';
  if (/^##\s+/.test(linjer[0] ?? '')) tittel = linjer.shift()!.replace(/^##\s+/, '').trim();
  // Finn kontrollspørsmålet (utenfor kodeblokker)
  let iKode = false;
  let start = -1;
  for (let i = 0; i < linjer.length; i++) {
    if (linjer[i].startsWith('```')) iKode = !iKode;
    if (!iKode && linjer[i].startsWith('?? ')) { start = i; break; }
  }
  if (start < 0) return { tittel, md: linjer.join('\n').trim() };

  const md = linjer.slice(0, start).join('\n').trim();
  const sp: string[] = [linjer[start].slice(3)];
  const alternativer: string[] = [];
  const forkl: string[] = [];
  let riktig = -1;
  let fase: 'sp' | 'alt' | 'forkl' = 'sp';
  iKode = false;
  for (const l of linjer.slice(start + 1)) {
    if (fase === 'sp' && l.startsWith('```')) iKode = !iKode;
    const alt = !iKode && /^\((x| )\)\s?(.*)$/.exec(l);
    if (alt && fase !== 'forkl') {
      fase = 'alt';
      if (alt[1] === 'x') riktig = alternativer.length;
      alternativer.push(alt[2]);
    } else if (!iKode && l.startsWith('=> ')) {
      fase = 'forkl';
      forkl.push(l.slice(3));
    } else if (fase === 'sp') sp.push(l);
    else if (fase === 'forkl') forkl.push(l);
    else if (l.trim()) alternativer[alternativer.length - 1] += '\n' + l;
  }
  if (riktig < 0 || alternativer.length < 2) throw new Error(`${filnavn}: «${tittel}» har et kontrollspørsmål uten gyldig fasit`);
  return { tittel, md, sjekk: { sporsmal: sp.join('\n').trim(), alternativer, riktig, forklaring: forkl.join('\n').trim() } };
}

const filer = import.meta.glob('./leksjoner/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const leksjoner: Leksjon[] = Object.entries(filer)
  .map(([sti, raw]) => parseLeksjon(raw, sti.split('/').pop()!))
  .sort((a, b) => a.nr - b.nr);

export const leksjon = (id: string) => leksjoner.find((l) => l.id === id);
export const leksjonerForDag = (dagNr: number) => leksjoner.filter((l) => l.dag === dagNr);
