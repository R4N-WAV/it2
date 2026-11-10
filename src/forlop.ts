import { flashcards } from './data/flashcards';
import { plan, type PlanDay, type Steg } from './data/plan';
import { leksjonerForDag } from './kurs';
import { datoNokkel, erLest, tomDag } from './store';
import type { AppData, DagState } from './types';

export const dagState = (d: AppData, dato: string): DagState => d.dager[dato] ?? tomDag();

/** Diagnosen gjelder hele kurset – den regnes som gjort når den er tatt én gang. */
export function stegFullfort(d: AppData, dag: PlanDay, steg: Steg): boolean {
  if (steg.type === 'diagnose') return d.diagnose !== null || dagState(d, dag.dato).fullfort.includes(steg.id);
  // Lesing gjelder hele kurset: er leksjonene lest, er steget gjort (også i nye runder).
  if (steg.type === 'les') {
    const l = leksjonerForDag(dag.dagNr);
    return (l.length > 0 && l.every((x) => erLest(d, x.id))) || dagState(d, dag.dato).fullfort.includes(steg.id);
  }
  return dagState(d, dag.dato).fullfort.includes(steg.id);
}

export function dagFremdrift(d: AppData, dag: PlanDay) {
  const krav = dag.steg.filter((s) => !s.valgfri);
  const ferdig = krav.filter((s) => stegFullfort(d, dag, s)).length;
  return { ferdig, totalt: krav.length, alleKravFerdig: ferdig === krav.length };
}

/** Første steg som ikke er gjort: først obligatoriske, så valgfrie. */
export function nesteSteg(d: AppData, dag: PlanDay): Steg | null {
  return dag.steg.find((s) => !s.valgfri && !stegFullfort(d, dag, s)) ?? dag.steg.find((s) => !stegFullfort(d, dag, s)) ?? null;
}

export interface MaalStatus {
  tekst: string;
  ok: boolean | null; // null = må vurderes av deg selv
}

/** Sjekker mestringsmålene som kan måles automatisk; resten må du vurdere selv. */
export function maalStatus(d: AppData, dag: PlanDay): MaalStatus[] {
  const g = dagState(d, dag.dato);
  return dag.maal.map((tekst) => {
    const t = tekst.toLowerCase();
    if (t.includes('flashcards riktig')) {
      const kortSteg = dag.steg.filter((s) => s.type === 'kort' && !s.valgfri);
      return { tekst, ok: kortSteg.every((s) => g.fullfort.includes(s.id)) };
    }
    if (t.includes('dagstest') || t.includes('sluttest')) {
      const test = dag.steg.find((s) => s.type === 'dagstest');
      return { tekst, ok: test ? (g.testBest ?? 0) >= (test.krav ?? 0.8) - 1e-9 : null };
    }
    if (t.includes('% på «') || t.includes('% på eksamensoppgaven')) {
      const eks = dag.steg.filter((s) => s.type === 'eksamen' && !s.valgfri);
      return { tekst, ok: eks.length ? eks.every((s) => (g.eksamen[s.taskId!] ?? 0) >= 60) : null };
    }
    if (t.includes('simulering vurdert')) {
      const sim = dag.steg.find((s) => s.type === 'muntlig-sim' && !s.valgfri);
      return { tekst, ok: sim ? (d.muntlig[sim.simId!] ?? -1) >= 1 : null };
    }
    if (t.includes('ingen forfalte')) {
      const naa = Date.now();
      return { tekst, ok: !flashcards.some((k) => d.kort[k.id] && d.kort[k.id].due <= naa) };
    }
    if (t.includes('sjekkliste')) {
      const s = dag.steg.find((x) => x.type === 'sjekk');
      return { tekst, ok: s ? g.fullfort.includes(s.id) : null };
    }
    return { tekst, ok: null };
  });
}

export const studiedager = plan.filter((p) => p.type !== 'buffer');

/** Dagen du står på: første studiedag som ikke er bekreftet. */
export function aktivDag(d: AppData): PlanDay {
  return studiedager.find((p) => !dagState(d, p.dato).bekreftet) ?? studiedager[studiedager.length - 1];
}

export function alleBekreftet(d: AppData) {
  return studiedager.every((p) => dagState(d, p.dato).bekreftet);
}

/** Hvor du er i forhold til kalenderen. */
export function kalenderStatus(d: AppData, naa = new Date()) {
  const idag = datoNokkel(naa);
  const aktiv = aktivDag(d);
  if (idag < plan[0].dato) return { type: 'for-tidlig' as const, tekst: 'Planen starter mandag 9. november, men du kan godt begynne nå.' };
  if (idag > plan[plan.length - 1].dato) return { type: 'etter' as const, tekst: 'Studieperioden er over. Lykke til på eksamen!' };
  const kalenderDag = [...studiedager].reverse().find((p) => p.dato <= idag) ?? studiedager[0];
  const bak = studiedager.indexOf(kalenderDag) - studiedager.indexOf(aktiv);
  if (alleBekreftet(d)) return { type: 'ferdig' as const, tekst: 'Du har bekreftet alle dagene. Bruk tiden på svakheter og eksamensoppgaver.' };
  if (bak > 0) return { type: 'bak' as const, tekst: `Du ligger ${bak} ${bak === 1 ? 'økt' : 'økter'} bak kalenderen. Gjør bare de obligatoriske stegene til du har tatt igjen.` };
  if (bak < 0) return { type: 'foran' as const, tekst: 'Du ligger foran planen. Bra!' };
  return { type: 'i-rute' as const, tekst: 'Du følger planen.' };
}
