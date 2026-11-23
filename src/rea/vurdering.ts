/*
 * Vurderingsmotor og beredskapskontroll.
 *
 * Dette er en INTERN TRENINGSRUBRIKK (0–4 på sju dimensjoner), ikke Udirs sensorveiledning og ikke en
 * omregning til eksamenskarakter. Vurderingen er egenvurdering mot vurderingsmomenter og eksempelsvar,
 * støttet av en automatisk begrepssjekk som hindrer at du gir deg selv høy skår uten å bruke fagbegrepene.
 */
import { ALLE_KM, DIMENSJONER, KRITISKE, kmNavn } from './data/km';
import { kapitlerForKm } from './pensum';
import { allePraktiske, caser, muntlige } from './bank';
import type { AppData, DimId, KmId, RepState, Vurdering } from './typer';

/* ---------- Begrepssjekk ---------- */

export interface Dekning { treff: string[]; mangler: string[]; andel: number }

export const begrepNavn = (b: string) => b.split('|')[0].replace(/\\/g, '').replace(/\.\*/g, ' … ');

export function sjekkBegreper(tekst: string, begreper: string[]): Dekning {
  const t = tekst.toLowerCase();
  const treff: string[] = [];
  const mangler: string[] = [];
  for (const b of begreper) {
    const ok = b.toLowerCase().split('|').some((alt) => {
      try { return new RegExp(alt, 'i').test(t); } catch { return t.includes(alt); }
    });
    (ok ? treff : mangler).push(begrepNavn(b));
  }
  return { treff, mangler, andel: begreper.length ? treff.length / begreper.length : 1 };
}

export const antallOrdISvar = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Øvre grense for «fagbegreper»-dimensjonen ut fra hvor mange sentrale begreper svaret faktisk inneholder. */
export function begrepTak(andel: number) {
  if (andel >= 0.6) return 4;
  if (andel >= 0.4) return 3;
  if (andel >= 0.2) return 2;
  return 1;
}

export interface Begrensning { dim: DimId | 'alle'; tak: number; grunn: string }

/** Ærlighetsregler: begrens egenvurderingen når svaret objektivt ikke kan være på det nivået. */
export function begrensninger(svar: string, dekning: Dekning | null, hint: boolean, dims: DimId[]): Begrensning[] {
  const b: Begrensning[] = [];
  const ord = antallOrdISvar(svar);
  if (ord < 12) b.push({ dim: 'alle', tak: 2, grunn: `Svaret har bare ${ord} ord. En setning eller to viser ikke sammenheng – maks nivå 2.` });
  if (dekning && dims.includes('begreper')) {
    const tak = begrepTak(dekning.andel);
    if (tak < 4) b.push({ dim: 'begreper', tak, grunn: `Du brukte ${dekning.treff.length} av ${dekning.treff.length + dekning.mangler.length} sentrale begreper – maks ${tak} på fagbegreper.` });
  }
  if (hint && dims.includes('overforing')) b.push({ dim: 'overforing', tak: 2, grunn: 'Du brukte hint – selvstendighet maks 2.' });
  return b;
}

export function brukBegrensninger(dim: Partial<Record<DimId, number>>, b: Begrensning[]) {
  const ut: Partial<Record<DimId, number>> = { ...dim };
  for (const k of Object.keys(ut) as DimId[]) {
    for (const x of b) if (x.dim === 'alle' || x.dim === k) ut[k] = Math.min(ut[k]!, x.tak);
  }
  return ut;
}

export function snitt(dim: Partial<Record<DimId, number>>) {
  const v = Object.values(dim).filter((x): x is number => typeof x === 'number');
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

export const erSvakt = (score: number, dekning: Dekning | null) => score < 2.5 || (dekning !== null && dekning.andel < 0.4);

/* ---------- Repetisjon (spaced repetition) ---------- */

const MIN = 60_000;
const TIME = 60 * MIN;
const DOGN = 24 * TIME;
export const INTERVALL = [0, 10 * MIN, 4 * TIME, DOGN, 2 * DOGN, 3 * DOGN];

export function nesteRep(gammel: RepState | undefined, score: number, naa = Date.now()): RepState {
  const boks = gammel?.boks ?? 0;
  let ny: number;
  if (score < 2) ny = 1;
  else if (score < 3) ny = 2;
  else if (score < 3.5) ny = Math.min(4, Math.max(3, boks + 1));
  else ny = Math.min(5, Math.max(3, boks + 1));
  return { boks: ny, forfaller: naa + INTERVALL[ny], sett: (gammel?.sett ?? 0) + 1, siste: score };
}

export const forfalteRep = (d: AppData, naa = Date.now()) => Object.entries(d.rep).filter(([, s]) => s.forfaller <= naa).map(([id]) => id);

/* ---------- Mestring per kompetansemål ---------- */

export type KmStatus = 'ingen' | 'rod' | 'gul' | 'gronn' | 'blaa';

export interface KmMestring {
  km: KmId;
  antall: number;
  datoer: { dato: string; snitt: number; n: number }[]; // nyeste først
  siste: number | null;
  stabil3: boolean; // to siste studiedager begge ≥ 3
  niva4: boolean; // stabil og snitt av to siste dager ≥ 3,5
  status: KmStatus;
  gjenkallingsdager: number;
  dimSnitt: Partial<Record<DimId, number>>;
  lest: number; // andel delkapitler markert lest (vises separat – teller IKKE som mestring)
}

const GJENKALLING = new Set(['kapittel', 'muntlig', 'drofting', 'case', 'tillegg']);

export function mestring(d: AppData, km: KmId): KmMestring {
  const v = d.vurderinger.filter((x) => x.km.includes(km));
  const perDato = new Map<string, number[]>();
  for (const x of v) perDato.set(x.dato, [...(perDato.get(x.dato) ?? []), x.score]);
  const datoer = [...perDato.entries()].sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dato, s]) => ({ dato, snitt: s.reduce((a, b) => a + b, 0) / s.length, n: s.length }));
  const siste = datoer[0]?.snitt ?? null;
  const stabil3 = datoer.length >= 2 && datoer[0].snitt >= 3 && datoer[1].snitt >= 3;
  const niva4 = stabil3 && (datoer[0].snitt + datoer[1].snitt) / 2 >= 3.5;
  let status: KmStatus = 'ingen';
  if (siste !== null) status = niva4 ? 'blaa' : stabil3 ? 'gronn' : siste < 2.5 ? 'rod' : 'gul';
  const gjenkallingsdager = new Set(v.filter((x) => GJENKALLING.has(x.kilde)).map((x) => x.dato)).size;
  const dimSum: Partial<Record<DimId, number[]>> = {};
  for (const x of v) for (const [k, n] of Object.entries(x.dim)) (dimSum[k as DimId] ??= []).push(n as number);
  const dimSnitt = Object.fromEntries(Object.entries(dimSum).map(([k, a]) => [k, a!.reduce((s, n) => s + n, 0) / a!.length]));
  const seksjoner = kapitlerForKm(km).flatMap((k) => k.seksjoner);
  const lest = seksjoner.length ? seksjoner.filter((s) => d.lest[s.id]).length / seksjoner.length : 0;
  return { km, antall: v.length, datoer, siste, stabil3, niva4, status, gjenkallingsdager, dimSnitt, lest };
}

/* ---------- Beredskapskontroll (masterprompt §9.1) ---------- */

export interface Vilkar { id: string; tekst: string; ok: boolean; detalj: string; tiltak?: string }

export interface Beredskap {
  klar: boolean;
  risiko: 'høy' | 'middels' | 'lav';
  vilkar: Vilkar[];
  kritiske: { id: string; navn: string; svake: KmId[] }[];
  prioritet: string[]; // konkrete neste steg
  mestring: KmMestring[];
}

/** Statisk kontroll: hvert mål har minst én leksjon, én oppgave og ett muntlig spørsmål i appen. */
export function dekketIAppen(km: KmId) {
  return kapitlerForKm(km).length > 0
    && muntlige.some((m) => m.km.includes(km))
    && (allePraktiske.some((p) => p.km.includes(km)) || caser.some((c) => c.km.includes(km)));
}

export function beredskap(d: AppData): Beredskap {
  const m = ALLE_KM.map((km) => mestring(d, km));
  const navnListe = (l: KmMestring[]) => l.map((x) => kmNavn(x.km)).join(', ');
  const vilkar: Vilkar[] = [];

  const udekket = ALLE_KM.filter((km) => !dekketIAppen(km));
  vilkar.push({ id: 'dekket', tekst: 'Alle 11 kompetansemål er dekket i appen', ok: udekket.length === 0, detalj: udekket.length ? `Mangler innhold: ${udekket.join(', ')}` : 'Hvert mål har leksjon, oppgave og muntlig spørsmål.' });

  const lavGjenkalling = m.filter((x) => x.gjenkallingsdager < 2);
  vilkar.push({ id: 'gjenkalling', tekst: 'Minst to runder aktiv gjenkalling (på ulike dager) for hvert mål', ok: lavGjenkalling.length === 0,
    detalj: lavGjenkalling.length ? `${lavGjenkalling.length} mål mangler: ${navnListe(lavGjenkalling)}` : 'Oppfylt for alle mål.',
    tiltak: lavGjenkalling.length ? `Ta kapittelkontroll eller muntlig trening i ${kmNavn(lavGjenkalling[0].km)}.` : undefined });

  const fullforte = d.sims.length;
  vilkar.push({ id: 'sims', tekst: 'Minst to fullstendige eksamenssimuleringer', ok: fullforte >= 2, detalj: `${fullforte} av 2 gjennomført.`, tiltak: fullforte < 2 ? 'Kjør en full simulering i Simulator.' : undefined });

  const under3 = m.filter((x) => !x.stabil3);
  vilkar.push({ id: 'stabil3', tekst: 'Stabilt nivå 3 eller bedre i alle mål (to ulike dager)', ok: under3.length === 0,
    detalj: under3.length ? `Ikke stabilt ≥ 3: ${navnListe(under3)}` : 'Oppfylt.', tiltak: under3.length ? `Øv på ${kmNavn(under3[0].km)} – to ulike dager med snitt ≥ 3.` : undefined });

  const niva4 = m.filter((x) => x.niva4);
  vilkar.push({ id: 'niva4', tekst: 'Nivå 4 i de viktigste styrkeområdene (minst 3 mål, minst ett kritisk)', ok: niva4.length >= 3 && niva4.some((x) => KRITISKE.some((k) => k.km.includes(x.km))),
    detalj: niva4.length ? `Nivå 4 nå: ${navnListe(niva4)}` : 'Ingen mål er stabilt på nivå 4 ennå.' });

  const kritiske = KRITISKE.map((k) => {
    const svake = k.km.filter((km) => {
      const x = m.find((y) => y.km === km)!;
      const apneFeil = d.feillogg.filter((f) => !f.lost && f.km.includes(km)).length;
      return x.status === 'ingen' || x.status === 'rod' || (x.siste !== null && x.siste < 2.5) || apneFeil >= 3;
    });
    return { id: k.id, navn: k.navn, svake };
  });
  const kritiskSvak = kritiske.filter((k) => k.svake.length);
  vilkar.push({ id: 'kritisk', tekst: 'Ingen kritisk svakhet i OOP/UML, testing, etikk/personvern, data/sikkerhet eller praktisk problemløsning', ok: kritiskSvak.length === 0,
    detalj: kritiskSvak.length ? kritiskSvak.map((k) => `${k.navn} (${k.svake.join(', ')})`).join('; ') : 'Ingen kritiske svakheter registrert.',
    tiltak: kritiskSvak.length ? `Prioriter ${kritiskSvak[0].navn} nå.` : undefined });

  const tillegg = d.vurderinger.filter((v) => v.kilde === 'tillegg' && !v.hint && v.score >= 3);
  vilkar.push({ id: 'tillegg', tekst: 'Ukjente tilleggsoppgaver besvart på nivå 3+ uten fasit (minst 2)', ok: tillegg.length >= 2, detalj: `${tillegg.length} av 2.`, tiltak: tillegg.length < 2 ? 'Ta en ukjent tilleggsoppgave i Muntlig eller Simulator.' : undefined });

  const sammenh = d.sims.filter((s) => s.sammenhengende && s.snakkeSek >= 180).length;
  vilkar.push({ id: 'snakke', tekst: 'Snakket sammenhengende om løsningen (≥ 3 min uten å lese) i minst to simuleringer', ok: sammenh >= 2, detalj: `${sammenh} av 2.`, tiltak: sammenh < 2 ? 'Bruk snakketimeren på startforklaringen i neste simulering.' : undefined });

  const klar = vilkar.every((v) => v.ok);
  const risiko = klar ? 'lav' : kritiskSvak.length ? 'høy' : 'middels';

  // Prioriter: kritiske først, så svakeste mål, så manglende vilkår
  const prioritet: string[] = [];
  for (const k of kritiskSvak) for (const km of k.svake) {
    const x = m.find((y) => y.km === km)!;
    prioritet.push(x.status === 'ingen' ? `${kmNavn(km)} (${km}): ikke testet ennå – kritisk område. Les og ta kapittelkontroll.` : `${kmNavn(km)} (${km}): siste snitt ${x.siste?.toFixed(1)} – kritisk område. Øv målrettet.`);
  }
  for (const v of vilkar) if (!v.ok && v.tiltak && !prioritet.includes(v.tiltak)) prioritet.push(v.tiltak);

  return { klar, risiko, vilkar, kritiske, prioritet: prioritet.slice(0, 6), mestring: m };
}

/* ---------- Gjentakende feil ---------- */

export function gjentakendeFeil(d: AppData) {
  const perKm = new Map<KmId, number>();
  for (const f of d.feillogg.filter((x) => !x.lost)) for (const k of f.km) perKm.set(k, (perKm.get(k) ?? 0) + 1);
  const dimLav = new Map<DimId, number>();
  for (const v of d.vurderinger) for (const [k, n] of Object.entries(v.dim)) if ((n as number) <= 1) dimLav.set(k as DimId, (dimLav.get(k as DimId) ?? 0) + 1);
  return {
    km: [...perKm.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]),
    dim: [...dimLav.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1])
      .map(([id, n]) => ({ id, navn: DIMENSJONER.find((x) => x.id === id)!.navn, n })),
  };
}

/** Forbedringsforslag basert på svake dimensjoner. */
export const FORSLAG: Record<DimId, string> = {
  korrekt: 'Les delkapitlet på nytt og sammenlign svaret ditt med eksempelsvaret – rett faktafeilene først.',
  begreper: 'Lær begrepene i huskelisten og bruk dem bevisst: si begrepet, og forklar det med egne ord.',
  hvorfor: 'Etter hvert «hva», si «fordi …». Forklar mekanismen, ikke bare resultatet.',
  eksempel: 'Ha ett konkret eksempel klart for hvert hovedbegrep (gjerne fra en av casene).',
  alternativ: 'Nevn alltid minst ett alternativ og si hvorfor du valgte som du gjorde («Jeg vurderte A og B …»).',
  overforing: 'Øv på tilleggsoppgaver og nye caser uten å se fasit – bruk strukturen hva–hvordan–hvorfor–eksempel–vurdering.',
  praktisk: 'Gjør oppgaven fysisk: tegn diagrammet, skriv koden, lag testtabellen – og forklar mens du gjør det.',
};

export function forbedringer(dim: Partial<Record<DimId, number>>) {
  return (Object.entries(dim) as [DimId, number][]).filter(([, n]) => n <= 2).sort((a, b) => a[1] - b[1]).map(([k]) => FORSLAG[k]);
}

export function lagVurdering(p: Omit<Vurdering, 'id' | 'score' | 'dato' | 'tid'> & { naa?: Date }): Vurdering {
  const naa = p.naa ?? new Date();
  const { naa: _ignorer, ...rest } = p;
  void _ignorer;
  return { ...rest, id: `${p.kilde}-${p.ref}-${naa.getTime()}-${Math.random().toString(36).slice(2, 6)}`, score: snitt(p.dim), dato: datoNokkel(naa), tid: naa.getTime() };
}

export function datoNokkel(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
