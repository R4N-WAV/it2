/*
 * Synkronisering av fremdrift mellom DINE enheter (én bruker).
 *
 * Fremdriften lagres som en JSON-fil i en privat («secret») GitHub Gist på din egen konto. Hver enhet kobles til
 * én gang med en GitHub-token som bare har tilgang til gists. Appen henter, slår sammen og laster opp automatisk:
 * ved oppstart, når du kommer tilbake til fanen, et par sekunder etter hver endring og jevnlig i bakgrunnen.
 *
 * Sammenslåingen mister ikke arbeid: vurderinger, simuleringer og feil slås sammen (union), og for ting som kan
 * endres (lest/ikke lest, avkryssinger, repetisjon) vinner den nyeste endringen.
 */
import { useSyncExternalStore } from 'react';
import { erstattFraSynk, hent, tomData, vedEndring } from './store';
import type { AppData, Feil } from './typer';

export const GIST_BESKRIVELSE = 'IT2 REA3050-trener – fremdrift (synkronisering)';
export const GIST_FIL = 'it2-rea3050-fremdrift.json';
const KONF = 'it2-synk';
const API = 'https://api.github.com';

/* ======================= Sammenslåing (ren funksjon) ======================= */

const maks = (a?: number, b?: number) => Math.max(a ?? 0, b ?? 0);

function nyestePerNokkel<T>(a: Record<string, T>, b: Record<string, T>, tid: (x: T) => number): Record<string, T> {
  const ut: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) if (!(k in ut) || tid(v) > tid(ut[k])) ut[k] = v;
  return ut;
}

function unionPaId<T extends { id: string }>(a: T[], b: T[], velg?: (x: T, y: T) => T): T[] {
  const m = new Map<string, T>();
  for (const x of a) m.set(x.id, x);
  for (const y of b) { const x = m.get(y.id); m.set(y.id, x && velg ? velg(x, y) : x ?? y); }
  return [...m.values()];
}

/** Slår sammen lokal fremdrift med fremdrift fra en annen enhet. Rekkefølgen på argumentene spiller ingen rolle for innholdet. */
export function sammenslå(lokal: AppData, fjern: AppData): AppData {
  const a = { ...tomData(), ...lokal };
  const b = { ...tomData(), ...fjern };
  // Nyeste nullstilling vinner: data fra før den nullstillingen forkastes.
  if ((b.nullstilt ?? 0) > (a.nullstilt ?? 0)) return sammenslå({ ...tomData(), nullstilt: b.nullstilt }, b);
  if ((a.nullstilt ?? 0) > (b.nullstilt ?? 0)) return sammenslå(a, { ...tomData(), nullstilt: a.nullstilt });

  const slettet = nyestePerNokkel(a.slettet ?? {}, b.slettet ?? {}, (x) => x);
  const planTid = nyestePerNokkel(a.planTid ?? {}, b.planTid ?? {}, (x) => x);

  const lest = nyestePerNokkel(a.lest, b.lest, (x) => x);
  for (const k of Object.keys(lest)) if ((slettet[`lest:${k}`] ?? 0) >= lest[k]) delete lest[k];

  const plan: Record<string, string[]> = {};
  for (const dato of new Set([...Object.keys(a.plan), ...Object.keys(b.plan)])) {
    plan[dato] = [...new Set([...(a.plan[dato] ?? []), ...(b.plan[dato] ?? [])])]
      .filter((id) => (slettet[`plan:${dato}:${id}`] ?? 0) < (planTid[`${dato}:${id}`] ?? 0) || !(`plan:${dato}:${id}` in slettet));
  }

  const feilTid = (f: Feil) => f.endret ?? f.tid;
  const feillogg = unionPaId(a.feillogg, b.feillogg, (x, y) => (feilTid(y) > feilTid(x) ? y : x))
    .filter((f) => !(`feil:${f.id}` in slettet));

  const sims = unionPaId(a.sims, b.sims);
  const simIder = new Set(sims.map((s) => s.id));
  const aktive = [a.aktivSim, b.aktivSim].filter((s): s is NonNullable<AppData['aktivSim']> => !!s && !simIder.has(s.id));
  const aktivSim = aktive.sort((x, y) => (y.forberedelseStart ?? 0) - (x.forberedelseStart ?? 0))[0] ?? null;

  return {
    versjon: 2,
    lest,
    forklart: nyestePerNokkel(a.forklart, b.forklart, (x) => x.tid),
    oppgaver: nyestePerNokkel(a.oppgaver, b.oppgaver, (x) => x.tid),
    vurderinger: unionPaId(a.vurderinger, b.vurderinger).sort((x, y) => x.tid - y.tid),
    rep: nyestePerNokkel(a.rep, b.rep, (x) => x.sett * 1e13 + x.forfaller),
    sims: sims.sort((x, y) => x.start - y.start),
    aktivSim,
    feillogg: feillogg.sort((x, y) => x.tid - y.tid),
    plan,
    kortversjon: { ...b.kortversjon, ...a.kortversjon },
    diagnose: (b.diagnose?.tid ?? 0) > (a.diagnose?.tid ?? 0) ? b.diagnose : a.diagnose,
    aktivitet: [...new Set([...a.aktivitet, ...b.aktivitet])].sort(),
    slettet,
    planTid,
    nullstilt: maks(a.nullstilt, b.nullstilt) || undefined,
  };
}

/** Stabil serialisering (sorterte nøkler) for å avgjøre om noe faktisk er endret. */
export function stabil(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(stabil).join(',')}]`;
  if (x && typeof x === 'object') return `{${Object.keys(x).filter((k) => (x as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stabil((x as Record<string, unknown>)[k])}`).join(',')}}`;
  return JSON.stringify(x);
}

/* ======================= Tilstand og konfigurasjon ======================= */

interface Konf { token: string; gistId?: string; bruker?: string }
export interface SynkStatus { tilstand: 'av' | 'synker' | 'ok' | 'feil' | 'offline'; melding?: string; sist?: number; bruker?: string }

function lesKonf(): Konf | null {
  try { const r = localStorage.getItem(KONF); return r ? JSON.parse(r) : null; } catch { return null; }
}
function skrivKonf(k: Konf | null) {
  try { if (k) localStorage.setItem(KONF, JSON.stringify(k)); else localStorage.removeItem(KONF); } catch { /* ignorer */ }
}

let status: SynkStatus = lesKonf() ? { tilstand: 'ok', bruker: lesKonf()?.bruker } : { tilstand: 'av' };
const statusLyttere = new Set<() => void>();
function settStatus(s: SynkStatus) { status = s; statusLyttere.forEach((l) => l()); }
export const synkStatus = () => status;
export function useSynk(): SynkStatus {
  return useSyncExternalStore((cb) => { statusLyttere.add(cb); return () => statusLyttere.delete(cb); }, () => status);
}
export const erKoblet = () => !!lesKonf();

/* ======================= GitHub-klient ======================= */

class ApiFeil extends Error {
  kode: number;
  constructor(kode: number, m: string) { super(m); this.kode = kode; }
}

async function api<T>(token: string, sti: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(sti.startsWith('http') ? sti : API + sti, {
    ...init,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (!r.ok) throw new ApiFeil(r.status, `GitHub svarte ${r.status}`);
  return (sti.startsWith('http') ? r.text() : r.json()) as Promise<T>;
}

interface Gist { id: string; description: string | null; files: Record<string, { content?: string; truncated?: boolean; raw_url?: string }> }

async function finnEllerLagGist(token: string): Promise<string> {
  for (let side = 1; side <= 5; side++) {
    const liste = await api<Gist[]>(token, `/gists?per_page=100&page=${side}`);
    const treff = liste.find((g) => g.description === GIST_BESKRIVELSE && g.files[GIST_FIL]);
    if (treff) return treff.id;
    if (liste.length < 100) break;
  }
  const ny = await api<Gist>(token, '/gists', {
    method: 'POST',
    body: JSON.stringify({ description: GIST_BESKRIVELSE, public: false, files: { [GIST_FIL]: { content: JSON.stringify(hent()) } } }),
  });
  return ny.id;
}

async function lesGist(token: string, id: string): Promise<AppData | null> {
  const g = await api<Gist>(token, `/gists/${id}`);
  const f = g.files[GIST_FIL];
  if (!f) return null;
  const tekst = f.truncated && f.raw_url ? await api<string>(token, f.raw_url) : f.content ?? '';
  try {
    const d = JSON.parse(tekst);
    return d && d.versjon === 2 ? d : null;
  } catch { return null; }
}

/* ======================= Synkronisering ======================= */

let pagaar: Promise<void> | null = null;
let igjen = false;

export function synkNaa(): Promise<void> {
  if (pagaar) { igjen = true; return pagaar; }
  pagaar = (async () => {
    do {
      igjen = false;
      await enRunde();
    } while (igjen);
  })().finally(() => { pagaar = null; });
  return pagaar;
}

async function enRunde() {
  const konf = lesKonf();
  if (!konf) { settStatus({ tilstand: 'av' }); return; }
  settStatus({ ...status, tilstand: 'synker' });
  try {
    if (!konf.gistId) { konf.gistId = await finnEllerLagGist(konf.token); skrivKonf(konf); }
    let fjern: AppData | null;
    try {
      fjern = await lesGist(konf.token, konf.gistId);
    } catch (e) {
      if (e instanceof ApiFeil && e.kode === 404) { konf.gistId = await finnEllerLagGist(konf.token); skrivKonf(konf); fjern = await lesGist(konf.token, konf.gistId); }
      else throw e;
    }
    const lokal = hent();
    const samlet = fjern ? sammenslå(lokal, fjern) : lokal;
    const nyLokal = stabil(samlet) !== stabil(lokal);
    if (nyLokal && stabil(hent()) === stabil(lokal)) erstattFraSynk(samlet);
    else if (nyLokal) igjen = true; // det kom en lokal endring underveis – ta en runde til
    if (!fjern || stabil(samlet) !== stabil(fjern)) {
      await api(konf.token, `/gists/${konf.gistId}`, { method: 'PATCH', body: JSON.stringify({ files: { [GIST_FIL]: { content: JSON.stringify(samlet) } } }) });
    }
    settStatus({ tilstand: 'ok', sist: Date.now(), bruker: konf.bruker });
  } catch (e) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) settStatus({ ...status, tilstand: 'offline', melding: 'Ingen nettforbindelse – endringene lastes opp når du er på nett igjen.' });
    else if (e instanceof ApiFeil && e.kode === 401) settStatus({ ...status, tilstand: 'feil', melding: 'GitHub avviste tokenet (ugyldig eller utløpt). Lag et nytt og koble til på nytt.' });
    else if (e instanceof ApiFeil && e.kode === 403) settStatus({ ...status, tilstand: 'feil', melding: 'Tokenet mangler tilgang til gists. Lag et nytt token med «gist» krysset av.' });
    else settStatus({ ...status, tilstand: 'feil', melding: e instanceof Error ? e.message : 'Ukjent feil ved synkronisering.' });
  }
}

/** Kobler denne enheten til synkroniseringen. Finner Gisten fra andre enheter, eller lager en ny. */
export async function kobleTil(token: string): Promise<string | null> {
  const t = token.trim();
  if (!t) return 'Lim inn tokenet først.';
  try {
    const bruker = await api<{ login: string }>(t, '/user');
    skrivKonf({ token: t, bruker: bruker.login });
    settStatus({ tilstand: 'synker', bruker: bruker.login });
    await synkNaa();
    return status.tilstand === 'ok' ? null : status.melding ?? 'Synkroniseringen feilet.';
  } catch (e) {
    skrivKonf(null);
    settStatus({ tilstand: 'av' });
    if (e instanceof ApiFeil && e.kode === 401) return 'GitHub avviste tokenet. Sjekk at du kopierte hele tokenet.';
    return 'Fikk ikke kontakt med GitHub. Er du på nett?';
  }
}

/** Kobler bare denne enheten fra. Fremdriften blir liggende både lokalt og i Gisten. */
export function kobleFra() {
  skrivKonf(null);
  settStatus({ tilstand: 'av' });
}

/* ======================= Automatikk ======================= */

let startet = false;
export function startAutoSynk() {
  if (startet || typeof window === 'undefined') return;
  startet = true;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let ulagret = false;
  const snart = () => {
    if (!erKoblet()) return;
    ulagret = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; ulagret = false; void synkNaa(); }, 3000);
  };
  vedEndring(snart);
  const hvisLengeSiden = () => { if (erKoblet() && Date.now() - (status.sist ?? 0) > 20_000) void synkNaa(); };
  window.addEventListener('focus', hvisLengeSiden);
  window.addEventListener('online', () => { if (erKoblet()) void synkNaa(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') hvisLengeSiden();
    else if (ulagret && erKoblet()) { if (timer) clearTimeout(timer); ulagret = false; void synkNaa(); }
  });
  setInterval(() => { if (erKoblet() && document.visibilityState === 'visible') void synkNaa(); }, 120_000);
  if (erKoblet()) void synkNaa();
}
