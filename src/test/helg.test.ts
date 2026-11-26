import { describe, expect, it } from 'vitest';
import { ferdighetStatus, helgKlar, oppgaveStatus, svakheter, svarRiktig, utskriftStemmer } from '../rea/helg/mestring';
import { FERDIGHETER, HELG_OPPGAVER, helgOppgave, stige } from '../rea/helg/oppgaver';
import type { HelgForsok } from '../rea/helg/typer';
import { tomData, tomtForsok } from '../rea/store';
import { sammenslå } from '../rea/synk';

const f = (x: Partial<HelgForsok>): HelgForsok => ({ ...tomtForsok(), tid: 1, ...x });

describe('Helgeoppgaver (Kodelab)', () => {
  it('unike id-er, tre hint, fasit og muntlige spørsmål på alle', () => {
    expect(new Set(HELG_OPPGAVER.map((o) => o.id)).size).toBe(HELG_OPPGAVER.length);
    for (const o of HELG_OPPGAVER) {
      expect(o.hint.length, o.id).toBe(3);
      expect(o.fasit.length, o.id).toBeGreaterThan(20);
      expect(o.muntlig.length, o.id).toBeGreaterThan(0);
    }
  });
  it('alle bootcamp-oppgavene fra helgepraksisfilen er med', () => {
    const krav = ['2.1A', '2.2A', '2.2B', '2.2C', '2.3A', '2.3B', '2.4A', '2.4B', '2.4C', '2.5A', '2.5B', '2.5C', '2.6A', '2.6B', '2.6C', '2.7A', '2.7B', '2.7C', '2.8', '3.10',
      '4A', '4B', '4C', '5A', '5B', '5C', '5D', '6.5', '9.2', '9.3', '9.5', '9.6', '9.7', '9.8', '9.9', '9.10', '9.11', '9.12', 'caseA', 'caseB'];
    for (const id of krav) expect(helgOppgave(id), id).toBeTruthy();
  });
  it('hver programmeringsferdighet har hele læringsstigen (10 trinn)', () => {
    for (const fe of ['variabler', 'if', 'lokker', 'lister', 'metoder', 'oop'] as const) {
      const trinn = new Set(HELG_OPPGAVER.filter((o) => o.ferdighet === fe || (o.ferdighet === 'alternativ' || o.ferdighet === 'muntlig')).map((o) => o.trinn));
      const egne = new Set(stige(fe).map((o) => o.trinn));
      for (const t of ['se', 'forutsi', 'spor', 'fullfor', 'rett', 'endre', 'skriv', 'overfor'] as const) expect(egne.has(t), `${fe}: ${t}`).toBe(true);
      expect(trinn.has('forklar') && trinn.has('alternativ'), fe).toBe(true);
    }
  });
  it('hver oppgave kan løses på en ærlig måte (kort svar, kjøring eller egenkontroll)', () => {
    for (const o of HELG_OPPGAVER.filter((x) => x.trinn !== 'se')) expect(!!o.svar || !!o.utskrift || !!o.sjekk, o.id).toBe(true);
  });
  it('krav-regexene er gyldige og godtar løsningsforslaget', () => {
    for (const o of HELG_OPPGAVER) for (const [re, msg] of o.krav ?? []) {
      expect(() => new RegExp(re), o.id).not.toThrow();
      if (o.fasitKode) expect(new RegExp(re).test(o.fasitKode), `${o.id}: ${msg}`).toBe(true);
    }
  });
});

describe('Streng målestokk for «kan»', () => {
  const o = helgOppgave('2.2A');
  it('utskrift sammenlignes linje for linje, uavhengig av mellomrom og store bokstaver', () => {
    expect(utskriftStemmer('total:  316\n', 'Total: 316')).toBe(true);
    expect(utskriftStemmer('Hvor gammel er du? Du er 20 år gammel.', 'Du er 20 år gammel.')).toBe(true);
    expect(utskriftStemmer('1\n2\n3', '1\n3\n2')).toBe(false);
    expect(utskriftStemmer('Total: 315', 'Total: 316')).toBe(false);
    expect(svarRiktig(helgOppgave('5D'), '2,0')).toBe(true);
  });
  it('fasit sett før løsning = rød, hint = gul, kjørt uten hint = grønn, ikke kjørt = gul', () => {
    expect(oppgaveStatus(o)).toBe('ikke');
    expect(oppgaveStatus(o, f({ forsok: 1 }))).toBe('rod');
    expect(oppgaveStatus(o, f({ fasitSett: true, lost: true, kjort: true }))).toBe('rod');
    expect(oppgaveStatus(o, f({ lost: true, kjort: true, hint: 1 }))).toBe('gul');
    expect(oppgaveStatus(o, f({ lost: true, kjort: false }))).toBe('gul');
    expect(oppgaveStatus(o, f({ lost: true, kjort: true }))).toBe('gronn');
  });
  it('ferdighet blir grønn først med to grønne varianter, minst én praktisk', () => {
    const d = tomData();
    d.helg = { 'v-forutsi': f({ lost: true }), 'v-spor': f({ lost: true }) };
    expect(ferdighetStatus(d, 'variabler').status).toBe('gul'); // bare lese/spore, ingen praktisk
    d.helg['2.2A'] = f({ lost: true, kjort: true });
    expect(ferdighetStatus(d, 'variabler').status).toBe('gronn');
  });
  it('tom fremdrift gir «IKKE KLAR» med de kritiske punktene for kode, OOP, feilsøking og testing', () => {
    const k = helgKlar(tomData());
    expect(k.klar).toBe(false);
    expect(k.kritiskeMangler.map((p) => p.id)).toEqual(['kode', 'oop', 'feil', 'testing']);
    expect(k.kritiskeMangler.every((p) => p.ovelse && helgOppgave(p.ovelse))).toBe(true);
  });
  it('kritiske svakheter foreslår en ny variant av samme ferdighet', () => {
    const d = tomData();
    d.helg = { '2.5C': f({ forsok: 2 }) };
    const sv = svakheter(d);
    expect(sv[0].oppgave.id).toBe('2.5C');
    expect(sv[0].variant?.ferdighet).toBe('lokker');
    expect(sv[0].variant?.id).not.toBe('2.5C');
  });
  it('helgefremdrift synkroniseres: nyeste forsøk per oppgave vinner', () => {
    const a = { ...tomData(), helg: { '2.2A': f({ tid: 5, lost: true }), x: f({ tid: 1 }) } };
    const b = { ...tomData(), helg: { '2.2A': f({ tid: 3 }), y: f({ tid: 2 }) } };
    const m = sammenslå(a, b);
    expect(m.helg?.['2.2A'].lost).toBe(true);
    expect(Object.keys(m.helg ?? {}).sort()).toEqual(['2.2A', 'x', 'y']);
  });
  it('alle ferdigheter har oppgaver', () => {
    for (const fe of FERDIGHETER) expect(stige(fe.id).length, fe.id).toBeGreaterThan(1);
  });
});
