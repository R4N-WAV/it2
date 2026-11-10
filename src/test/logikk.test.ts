import { describe, expect, it } from 'vitest';
import { nesteKortTilstand, INTERVALL, mestringForTema, svakhet } from '../store';
import { flashcards } from '../data/flashcards';
import { quiz, diagnoseIds } from '../data/quiz';
import { examTasks, oralQuestions, oralSims } from '../data/exam';
import { topics, kompetansemal } from '../data/topics';
import { plan } from '../data/plan';
import { quiz as alleQuiz } from '../data/quiz';
import type { AppData } from '../types';
import { aktivDag, kalenderStatus, maalStatus, nesteSteg } from '../forlop';
import { streak, tomDag } from '../store';
import { begreper } from '../data/begreper';
import { leksjonerForDag } from '../kurs';

const tom: AppData = { versjon: 1, leksjoner: {}, kort: {}, quiz: {}, eksamen: [], muntlig: {}, diagnose: null, studielogg: {}, dager: {}, matchBest: {}, aktivitet: [] };

describe('Leitner', () => {
  it('nytt kort: kunne → boks 2, kunne ikke → boks 1, usikker → boks 1', () => {
    expect(nesteKortTilstand(undefined, 2, 0).box).toBe(2);
    expect(nesteKortTilstand(undefined, 0, 0).box).toBe(1);
    expect(nesteKortTilstand(undefined, 1, 0).box).toBe(1);
  });
  it('kunne flytter opp til maks 5, kunne ikke tilbake til 1', () => {
    let s = nesteKortTilstand(undefined, 2, 0);
    for (let i = 0; i < 10; i++) s = nesteKortTilstand(s, 2, 0);
    expect(s.box).toBe(5);
    expect(s.due).toBe(INTERVALL[5]);
    expect(nesteKortTilstand(s, 0, 0).box).toBe(1);
    expect(nesteKortTilstand(s, 1, 0).box).toBe(2);
    expect(s.sett).toBe(11);
  });
});

describe('Mestring', () => {
  it('ubesvart = 0 % og utestet', () => {
    const m = mestringForTema(tom, 'oop-arv');
    expect(m.score).toBe(0);
    expect(m.utestet).toBe(m.total);
  });
  it('feil svar øker svakhet', () => {
    const d: AppData = { ...tom, quiz: { 'q-r2': { forsok: 1, riktige: 0, sisteRiktig: false, sisteTid: 1 } } };
    expect(svakhet(d, 'oop-arv')).toBeGreaterThan(svakhet(tom, 'oop-arv'));
  });
});

describe('Innhold', () => {
  const tema = new Set(topics.map((t) => t.id));
  it('unike id-er', () => {
    const ids = [...flashcards, ...quiz, ...examTasks, ...oralQuestions, ...oralSims].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('alle merket med gyldig tema, km og forklaring', () => {
    for (const x of [...flashcards, ...quiz]) {
      expect(tema.has(x.tema), x.id).toBe(true);
      expect(kompetansemal[x.km], x.id).toBeTruthy();
    }
    for (const q of quiz) expect(q.forklaring.length, q.id).toBeGreaterThan(5);
  });
  it('flervalg har gyldig fasit, sorter har unike linjer', () => {
    for (const q of quiz) {
      if (q.type === 'flervalg') expect(q.riktig).toBeLessThan(q.alternativer.length);
      if (q.type === 'sorter') expect(new Set(q.linjer).size).toBe(q.linjer.length);
    }
  });
  it('diagnose-id-er finnes, plan-temaer gyldige, hvert tema har innhold', () => {
    for (const id of diagnoseIds) expect(quiz.some((q) => q.id === id), id).toBe(true);
    for (const p of plan) for (const t of p.temaer) expect(tema.has(t)).toBe(true);
    for (const t of topics) {
      expect(flashcards.some((k) => k.tema === t.id), t.id).toBe(true);
      expect(quiz.some((q) => q.tema === t.id), t.id).toBe(true);
    }
    expect(plan.map((p: { dato: string }) => p.dato)).toEqual(['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13','2026-11-14','2026-11-15','2026-11-16','2026-11-17']);
  });
  it('alle 11 kompetansemål dekkes, simuleringer har tilleggsoppgave fra annet KM', () => {
    const dekket = new Set([...flashcards, ...quiz].map((x) => x.km));
    for (const km of Object.keys(kompetansemal)) expect(dekket.has(km), km).toBe(true);
    for (const s of oralSims) {
      expect(s.km).not.toContain(s.tilleggsoppgave.km);
      expect(s.oppfolging.length).toBeGreaterThanOrEqual(3);
    }
    for (const t of examTasks) expect(t.kilde.length).toBeGreaterThan(5);
  });
});

describe('Dagsforløp', () => {
  it('starter på dag 1 med lesing, så diagnosen, og går videre når diagnosen er tatt', () => {
    expect(aktivDag(tom).dagNr).toBe(1);
    expect(nesteSteg(tom, plan[0])?.id).toBe('les');
    const lest = Object.fromEntries(leksjonerForDag(1).map((l) => [l.id, { side: 0, ferdig: 1 }]));
    expect(nesteSteg({ ...tom, leksjoner: lest }, plan[0])?.id).toBe('diag');
    const d: AppData = { ...tom, leksjoner: lest, diagnose: { 'q-g1': true } };
    expect(nesteSteg(d, plan[0])?.id).toBe('java');
  });
  it('tar obligatoriske steg før valgfrie, og hopper over buffer-dagen', () => {
    const fullfort = plan[0].steg.filter((s) => !s.valgfri).map((s) => s.id);
    const d: AppData = { ...tom, diagnose: {}, dager: { [plan[0].dato]: { ...tomDag(), fullfort } } };
    expect(nesteSteg(d, plan[0])?.id).toBe('kort2');
    const bekreftet = Object.fromEntries(plan.slice(0, 4).map((p) => [p.dato, { ...tomDag(), bekreftet: true }]));
    expect(aktivDag({ ...tom, dager: bekreftet }).dagNr).toBe(6);
  });
  it('mål: dagstest under kravet er ikke nådd, over kravet er nådd', () => {
    const dag = plan[0];
    const lav = maalStatus({ ...tom, dager: { [dag.dato]: { ...tomDag(), testBest: 0.5 } } }, dag);
    const hoy = maalStatus({ ...tom, dager: { [dag.dato]: { ...tomDag(), testBest: 5 / 6 } } }, dag);
    expect(lav.find((m) => m.tekst.includes('dagstest'))?.ok).toBe(false);
    expect(hoy.find((m) => m.tekst.includes('dagstest'))?.ok).toBe(true);
  });
  it('kalender: viser «bak» når datoen er passert uten at dagene er bekreftet', () => {
    expect(kalenderStatus(tom, new Date('2026-11-12T18:00:00')).type).toBe('bak');
    expect(kalenderStatus(tom, new Date('2026-11-08T18:00:00')).type).toBe('for-tidlig');
  });
  it('streak teller sammenhengende dager', () => {
    expect(streak({ ...tom, aktivitet: ['2026-11-08', '2026-11-09', '2026-11-10'] }, new Date('2026-11-10T12:00:00'))).toBe(3);
    expect(streak({ ...tom, aktivitet: ['2026-11-08'] }, new Date('2026-11-10T12:00:00'))).toBe(0);
  });
  it('alle plan-steg peker på innhold som finnes', () => {
    for (const p of plan) for (const s of p.steg) {
      for (const id of s.ids ?? []) expect(alleQuiz.some((q) => q.id === id), `${p.dato} ${id}`).toBe(true);
      if (s.taskId) expect(examTasks.some((t) => t.id === s.taskId), s.taskId).toBe(true);
      if (s.simId) expect(oralSims.some((t) => t.id === s.simId), s.simId).toBe(true);
      if (s.type === 'kort') expect(flashcards.some((k) => s.temaer!.includes(k.tema))).toBe(true);
    }
    expect(begreper.length).toBeGreaterThanOrEqual(40);
  });
});
