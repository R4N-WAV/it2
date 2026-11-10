import { useSyncExternalStore } from 'react';
import type { AppData, CardState, DagState, Rating, TopicId } from './types';
import { flashcards } from './data/flashcards';
import { quiz } from './data/quiz';
import { topics } from './data/topics';

const KEY = 'it2-eksamenstrener-v1';
const MIN = 60_000;
const DAG = 24 * 60 * MIN;
// Komprimerte Leitner-intervaller (kort tid til eksamen): boks 1..5
export const INTERVALL = [0, 10 * MIN, 1 * DAG, 2 * DAG, 3 * DAG, 5 * DAG];

export const EKSAMENSDATO = new Date('2026-11-18T09:00:00');
export const SISTE_STUDIEDAG = new Date('2026-11-17T23:59:00');

function tom(): AppData {
  return { versjon: 1, leksjoner: {}, kort: {}, quiz: {}, eksamen: [], muntlig: {}, diagnose: null, studielogg: {}, dager: {}, matchBest: {}, aktivitet: [] };
}

function last(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return tom();
    const d = JSON.parse(raw);
    return { ...tom(), ...d };
  } catch {
    return tom();
  }
}

let data: AppData = last();
const lyttere = new Set<() => void>();

export function datoNokkel(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function lagre(ny: AppData, aktivitet = true) {
  const i = datoNokkel();
  if (aktivitet && !ny.aktivitet.includes(i)) ny = { ...ny, aktivitet: [...ny.aktivitet, i] };
  data = ny;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* privat modus o.l. — fortsett i minnet */
  }
  lyttere.forEach((l) => l());
}

export function useData(): AppData {
  return useSyncExternalStore(
    (cb) => {
      lyttere.add(cb);
      return () => lyttere.delete(cb);
    },
    () => data,
  );
}

/* ---------- Flashcards (Leitner) ---------- */

export function nesteKortTilstand(gammel: CardState | undefined, r: Rating, naa = Date.now()): CardState {
  const box = gammel?.box ?? 0;
  let nyBox: number;
  if (r === 0) nyBox = 1; // kunne ikke → tilbake til start
  else if (r === 1) nyBox = Math.max(1, Math.min(box, 2)); // usikker → maks boks 2
  else nyBox = Math.min(5, Math.max(box, 1) + 1); // kunne → opp én boks
  return { box: nyBox, due: naa + INTERVALL[nyBox], sett: (gammel?.sett ?? 0) + 1, siste: r };
}

export function vurderKort(id: string, r: Rating) {
  lagre({ ...data, kort: { ...data.kort, [id]: nesteKortTilstand(data.kort[id], r) } });
}

export function kortSomForfaller(d: AppData, naa = Date.now()) {
  return flashcards.filter((k) => {
    const s = d.kort[k.id];
    return s && s.due <= naa;
  });
}

/* ---------- Leksjoner (kurset) ---------- */

export function lagreLesePosisjon(id: string, side: number) {
  const g = data.leksjoner[id] ?? { side: 0, ferdig: null };
  if (g.side === side) return;
  lagre({ ...data, leksjoner: { ...data.leksjoner, [id]: { ...g, side } } });
}
export function fullforLeksjon(id: string) {
  const g = data.leksjoner[id] ?? { side: 0, ferdig: null };
  lagre({ ...data, leksjoner: { ...data.leksjoner, [id]: { side: 0, ferdig: g.ferdig ?? Date.now() } } });
}
export const erLest = (d: AppData, id: string) => !!d.leksjoner[id]?.ferdig;

/* ---------- Quiz ---------- */

export function registrerQuiz(id: string, riktig: boolean) {
  const g = data.quiz[id] ?? { forsok: 0, riktige: 0, sisteRiktig: null, sisteTid: 0 };
  lagre({
    ...data,
    quiz: {
      ...data.quiz,
      [id]: { forsok: g.forsok + 1, riktige: g.riktige + (riktig ? 1 : 0), sisteRiktig: riktig, sisteTid: Date.now() },
    },
  });
}

/* ---------- Andre ---------- */

export function registrerEksamen(taskId: string, svar: string, egenScore: number) {
  lagre({ ...data, eksamen: [...data.eksamen, { taskId, svar, egenScore, tid: Date.now() }] });
}
export function vurderMuntlig(id: string, r: Rating) {
  lagre({ ...data, muntlig: { ...data.muntlig, [id]: r } });
}
export function lagreDiagnose(res: Record<string, boolean>) {
  // Diagnosen teller også som quiz-forsøk, slik at svakhetene vises med en gang
  const q = { ...data.quiz };
  for (const [id, ok] of Object.entries(res)) {
    const g = q[id] ?? { forsok: 0, riktige: 0, sisteRiktig: null, sisteTid: 0 };
    q[id] = { forsok: g.forsok + 1, riktige: g.riktige + (ok ? 1 : 0), sisteRiktig: ok, sisteTid: Date.now() };
  }
  lagre({ ...data, diagnose: res, quiz: q });
}
export function toggleStudiedag(dato: string) {
  lagre({ ...data, studielogg: { ...data.studielogg, [dato]: !data.studielogg[dato] } });
}

export function eksporter(): string {
  return JSON.stringify(data, null, 2);
}
export function importer(json: string): string | null {
  try {
    const d = JSON.parse(json);
    if (typeof d !== 'object' || d === null || d.versjon !== 1 || typeof d.kort !== 'object') {
      return 'Dette ser ikke ut som en eksport fra IT2 Eksamenstrener. Sjekk at du har kopiert hele teksten.';
    }
    lagre({ ...tom(), ...d }, false);
    return null;
  } catch {
    return 'Kunne ikke lese JSON-filen.';
  }
}
export function nullstill() {
  lagre(tom(), false);
}

/* ---------- Studiedager ---------- */
export function tomDag(): DagState {
  return { runde: 1, fullfort: [], bekreftet: false, testSiste: null, testBest: null, eksamen: {}, historikk: [] };
}
function endreDag(dato: string, f: (g: DagState) => DagState) {
  lagre({ ...data, dager: { ...data.dager, [dato]: f(data.dager[dato] ?? tomDag()) } });
}
export function fullforSteg(dato: string, stegId: string) {
  endreDag(dato, (g) => (g.fullfort.includes(stegId) ? g : { ...g, fullfort: [...g.fullfort, stegId] }));
}
export function registrerDagstest(dato: string, score: number) {
  endreDag(dato, (g) => ({ ...g, testSiste: score, testBest: Math.max(score, g.testBest ?? 0) }));
}
export function registrerDagEksamen(dato: string, taskId: string, score: number) {
  endreDag(dato, (g) => ({ ...g, eksamen: { ...g.eksamen, [taskId]: Math.max(score, g.eksamen[taskId] ?? 0) } }));
}
/** Start dagen på nytt: ny runde, stegene nullstilles, læringsdata (kort/quiz) beholdes. */
export function nyRunde(dato: string) {
  endreDag(dato, (g) => ({
    ...tomDag(),
    runde: g.runde + 1,
    historikk: [...g.historikk, { runde: g.runde, test: g.testBest, tid: Date.now() }],
  }));
}
export function bekreftDag(dato: string, ja: boolean) {
  endreDag(dato, (g) => ({ ...g, bekreftet: ja }));
}
export function lagreMatch(sett: string, ms: number) {
  const g = data.matchBest[sett];
  if (g === undefined || ms < g) lagre({ ...data, matchBest: { ...data.matchBest, [sett]: ms } });
}

/** Antall dager på rad (til og med i dag eller i går) med øving. */
export function streak(d: AppData, naa = new Date()): number {
  const sett = new Set(d.aktivitet);
  const dag = new Date(naa.getFullYear(), naa.getMonth(), naa.getDate());
  if (!sett.has(datoNokkel(dag))) dag.setDate(dag.getDate() - 1);
  let n = 0;
  while (sett.has(datoNokkel(dag))) { n++; dag.setDate(dag.getDate() - 1); }
  return n;
}

/* ---------- Mestring ----------
 * Tre nivåer per tema (krav 12):
 *  - "henter frem": kort i boks ≥3 og quiz besvart riktig siste gang
 *  - "forstår med eksempel": usikker / boks 2 / noen riktige
 *  - "mestrer ikke": feil siste gang / boks 1
 * Ubesvarte elementer teller som "ikke testet" — ikke som mestret.
 */
export interface Mestring {
  henter: number;
  forstar: number;
  ikke: number;
  utestet: number;
  total: number;
  score: number; // 0–1, reell kunnskap
}

export function mestringForTema(d: AppData, tema: TopicId): Mestring {
  const m: Mestring = { henter: 0, forstar: 0, ikke: 0, utestet: 0, total: 0, score: 0 };
  for (const k of flashcards.filter((f) => f.tema === tema)) {
    m.total++;
    const s = d.kort[k.id];
    if (!s) m.utestet++;
    else if (s.box >= 3 && s.siste === 2) m.henter++;
    else if (s.siste === 0) m.ikke++;
    else m.forstar++;
  }
  for (const q of quiz.filter((f) => f.tema === tema)) {
    m.total++;
    const s = d.quiz[q.id];
    if (!s) m.utestet++;
    else if (s.sisteRiktig && s.riktige >= 1 && s.riktige / s.forsok >= 0.6) m.henter++;
    else if (s.sisteRiktig) m.forstar++;
    else m.ikke++;
  }
  m.score = m.total ? (m.henter + 0.4 * m.forstar) / m.total : 0;
  return m;
}

/** Hvor "svakt" et tema er: høyere = mer trening trengs. Tar hensyn til prioritet. */
export function svakhet(d: AppData, tema: TopicId): number {
  const m = mestringForTema(d, tema);
  const t = topics.find((x) => x.id === tema)!;
  const testet = m.total - m.utestet;
  const feilAndel = testet ? m.ikke / testet : 0.5; // utestet = middels usikkerhet
  const vekt = t.prioritet === 1 ? 1.5 : t.prioritet === 2 ? 1.1 : 0.8;
  return (feilAndel * 0.7 + (1 - m.score) * 0.3) * vekt;
}

export function beredskap(d: AppData, eksamen: 'skriftlig' | 'muntlig') {
  const rel = topics.filter((t) => t.eksamen === 'begge' || t.eksamen === eksamen);
  let sum = 0;
  let vekt = 0;
  for (const t of rel) {
    const w = t.prioritet === 1 ? 3 : t.prioritet === 2 ? 2 : 1;
    sum += mestringForTema(d, t.id).score * w;
    vekt += w;
  }
  let score = vekt ? sum / vekt : 0;
  // Eksamensoppgaver/muntlig-trening veier inn
  if (eksamen === 'skriftlig' && d.eksamen.length) {
    const avg = d.eksamen.reduce((a, e) => a + e.egenScore, 0) / d.eksamen.length / 100;
    score = score * 0.75 + avg * 0.25;
  }
  if (eksamen === 'muntlig') {
    const v = Object.values(d.muntlig);
    const avg = v.length ? v.reduce<number>((a, r) => a + r, 0) / (2 * v.length) : 0;
    score = score * 0.7 + avg * 0.3;
  }
  return score;
}

export function dagerIgjen(naa = new Date()) {
  const a = new Date(naa.getFullYear(), naa.getMonth(), naa.getDate());
  const b = new Date(EKSAMENSDATO.getFullYear(), EKSAMENSDATO.getMonth(), EKSAMENSDATO.getDate());
  return Math.round((b.getTime() - a.getTime()) / DAG);
}
