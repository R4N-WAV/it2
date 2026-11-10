import { describe, expect, it } from 'vitest';
import { leksjoner, parseLeksjon } from '../kurs';
import { plan } from '../data/plan';
import { topics } from '../data/topics';

describe('Kurs', () => {
  it('leksjonene lastes, i rekkefølge, med unike id-er', () => {
    expect(leksjoner.length).toBeGreaterThanOrEqual(20);
    const ids = leksjoner.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    const nr = leksjoner.map((l) => l.nr);
    expect(new Set(nr).size).toBe(nr.length);
  });
  it('hver leksjon har gyldig tema, dag, mål og minst tre sider med innhold', () => {
    const tema = new Set(topics.map((t) => t.id));
    for (const l of leksjoner) {
      expect(l.temaer.length, l.id).toBeGreaterThan(0);
      for (const t of l.temaer) expect(tema.has(t), `${l.id}: ${t}`).toBe(true);
      expect(plan.some((p) => p.dagNr === l.dag), l.id).toBe(true);
      expect(l.mal.length, l.id).toBeGreaterThan(10);
      expect(l.sider.length, l.id).toBeGreaterThanOrEqual(3);
      for (const s of l.sider) {
        expect(s.tittel, l.id).toBeTruthy();
        expect(s.md.length, `${l.id}: ${s.tittel}`).toBeGreaterThan(80);
      }
    }
  });
  it('kontrollspørsmål har én fasit og en forklaring', () => {
    for (const l of leksjoner) {
      const med = l.sider.filter((s) => s.sjekk);
      expect(med.length, l.id).toBeGreaterThanOrEqual(2);
      for (const s of med) {
        expect(s.sjekk!.alternativer.length).toBeGreaterThanOrEqual(2);
        expect(s.sjekk!.riktig).toBeLessThan(s.sjekk!.alternativer.length);
        expect(s.sjekk!.forklaring.length, `${l.id}: ${s.tittel}`).toBeGreaterThan(10);
      }
    }
  });
  it('kodeblokker er lukket', () => {
    for (const l of leksjoner) for (const s of l.sider) {
      const md = s.md + '\n' + (s.sjekk?.sporsmal ?? '');
      expect((md.match(/^```/gm) ?? []).length % 2, `${l.id}: ${s.tittel}`).toBe(0);
    }
  });
  it('alle studiedager med lese-steg har leksjoner, og lesing kommer før øving', () => {
    for (const p of plan) {
      const les = p.steg.findIndex((s) => s.type === 'les');
      if (les < 0) continue;
      expect(leksjoner.some((l) => l.dag === p.dagNr), `dag ${p.dagNr}`).toBe(true);
      const forsteOving = p.steg.findIndex((s) => ['kort', 'oppgaver', 'eksamen', 'dagstest'].includes(s.type));
      if (forsteOving >= 0) expect(les).toBeLessThan(forsteOving);
    }
    for (const l of leksjoner) {
      expect(plan.find((p) => p.dagNr === l.dag)!.steg.some((s) => s.type === 'les'), l.id).toBe(true);
    }
  });
  it('parser kontrollspørsmål med kode og flerlinjet forklaring', () => {
    const l = parseLeksjon('id: x\ntittel: T\ntema: grunnlag\ndag: 1\nmal: noe\n===\n## A\nTekst\n\n?? Hva?\n```java\nint a = 1;\n```\n( ) en\n(x) to\n=> Fordi\nså.\n', '99-x.md');
    expect(l.nr).toBe(99);
    expect(l.sider[0].sjekk!.riktig).toBe(1);
    expect(l.sider[0].sjekk!.sporsmal).toContain('int a = 1;');
    expect(l.sider[0].sjekk!.forklaring).toBe('Fordi\nså.');
  });
});
