import { useSyncExternalStore } from 'react';
import { DIMENSJONER } from './data/km';
import type { AktivSim, AppData, Feil, KmId, SimResultat, Vurdering } from './typer';
import { datoNokkel, nesteRep } from './vurdering';

/* Fremdrift lagres lokalt i nettleseren (localStorage). Ingen konto, ingen server. */
export const NOKKEL = 'it2-rea3050-v2';

export function tomData(): AppData {
  return { versjon: 2, lest: {}, forklart: {}, oppgaver: {}, vurderinger: [], rep: {}, sims: [], aktivSim: null, feillogg: [], plan: {}, kortversjon: {}, diagnose: null, aktivitet: [] };
}

function last(): AppData {
  try {
    const raw = localStorage.getItem(NOKKEL);
    return raw ? { ...tomData(), ...JSON.parse(raw) } : tomData();
  } catch {
    return tomData();
  }
}

let data: AppData = typeof localStorage === 'undefined' ? tomData() : last();
const lyttere = new Set<() => void>();

function lagre(ny: AppData, aktivitet = true) {
  const i = datoNokkel();
  if (aktivitet && !ny.aktivitet.includes(i)) ny = { ...ny, aktivitet: [...ny.aktivitet, i] };
  data = ny;
  try { localStorage.setItem(NOKKEL, JSON.stringify(data)); } catch { /* privat modus o.l. */ }
  lyttere.forEach((l) => l());
}

export const hent = () => data;

export function useData(): AppData {
  return useSyncExternalStore((cb) => { lyttere.add(cb); return () => lyttere.delete(cb); }, () => data);
}

/* ---------- Lesing ---------- */
export function markerLest(seksjonId: string, lest = true) {
  const l = { ...data.lest };
  if (lest) l[seksjonId] = Date.now(); else delete l[seksjonId];
  lagre({ ...data, lest: l });
}
export function lagreForklart(seksjonId: string, tekst: string, dekning: number) {
  lagre({ ...data, forklart: { ...data.forklart, [seksjonId]: { tekst, dekning, tid: Date.now() } } });
}
export function lagreOppgaveForsok(nokkel: string, tekst: string, vist: boolean) {
  lagre({ ...data, oppgaver: { ...data.oppgaver, [nokkel]: { tekst, vist, tid: Date.now() } } });
}

/* ---------- Vurderinger ---------- */
function autoFeil(v: Vurdering): Feil[] {
  const ut: Feil[] = [];
  const lave = (Object.entries(v.dim) as [string, number][]).filter(([, n]) => n <= 1).map(([k]) => DIMENSJONER.find((x) => x.id === k)?.navn ?? k);
  if (v.score < 2 || lave.length) {
    ut.push({ id: `auto-${v.id}`, tid: v.tid, km: v.km, auto: true, lost: false,
      tekst: `${v.ref} (${v.kilde}): snitt ${v.score.toFixed(1)}${lave.length ? ` – svakt på ${lave.join(', ')}` : ''}` });
  }
  return ut;
}

/** Lagrer en vurdering, oppdaterer repetisjon (for muntlige/praktiske) og feilloggen. */
export function lagreVurdering(v: Vurdering, repId?: string) {
  const rep = repId ? { ...data.rep, [repId]: nesteRep(data.rep[repId], v.score) } : data.rep;
  lagre({ ...data, vurderinger: [...data.vurderinger, v], rep, feillogg: [...data.feillogg, ...autoFeil(v)] });
}
export function vurderRep(id: string, score: number) {
  lagre({ ...data, rep: { ...data.rep, [id]: nesteRep(data.rep[id], score) } });
}

/* ---------- Feillogg ---------- */
export function leggTilFeil(tekst: string, km: KmId[]) {
  lagre({ ...data, feillogg: [...data.feillogg, { id: `manuell-${Date.now()}`, tid: Date.now(), km, tekst, auto: false, lost: false }] });
}
export function settFeilLost(id: string, lost: boolean) {
  lagre({ ...data, feillogg: data.feillogg.map((f) => (f.id === id ? { ...f, lost } : f)) });
}
export function slettFeil(id: string) {
  lagre({ ...data, feillogg: data.feillogg.filter((f) => f.id !== id) });
}

/* ---------- Plan ---------- */
export function settBlokk(dato: string, blokkId: string, ferdig: boolean) {
  const g = data.plan[dato] ?? [];
  const ny = ferdig ? [...new Set([...g, blokkId])] : g.filter((x) => x !== blokkId);
  lagre({ ...data, plan: { ...data.plan, [dato]: ny } });
}
export function settKortversjon(dato: string, paa: boolean) {
  lagre({ ...data, kortversjon: { ...data.kortversjon, [dato]: paa } });
}
export function lagreDiagnose(svar: Record<string, boolean>, usikker: string) {
  lagre({ ...data, diagnose: { tid: Date.now(), svar, usikker } });
}

/* ---------- Simulator ---------- */
export function startSim(s: AktivSim) { lagre({ ...data, aktivSim: s }); }
export function oppdaterSim(f: (s: AktivSim) => AktivSim) {
  if (data.aktivSim) lagre({ ...data, aktivSim: f(data.aktivSim) });
}
export function avbrytSim() { lagre({ ...data, aktivSim: null }); }
export function fullforSim(r: SimResultat, vurderinger: Vurdering[]) {
  let ny: AppData = { ...data, aktivSim: null, sims: [...data.sims, r] };
  for (const v of vurderinger) ny = { ...ny, vurderinger: [...ny.vurderinger, v], feillogg: [...ny.feillogg, ...autoFeil(v)] };
  lagre(ny);
}

/* ---------- Eksport / import ---------- */
export const eksporter = () => JSON.stringify(data, null, 2);
export function importer(json: string): string | null {
  try {
    const d = JSON.parse(json);
    if (typeof d !== 'object' || d === null || d.versjon !== 2 || !Array.isArray(d.vurderinger)) {
      return 'Dette ser ikke ut som en eksport fra REA3050-treneren (versjon 2).';
    }
    lagre({ ...tomData(), ...d }, false);
    return null;
  } catch {
    return 'Kunne ikke lese JSON-filen.';
  }
}
export function nullstill() { lagre(tomData(), false); }

/** Kun for tester. */
export function _settData(d: AppData) { data = d; }
