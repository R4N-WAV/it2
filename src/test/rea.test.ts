import { describe, expect, it } from 'vitest';
import { ALLE_KM, KOMPETANSEMAL } from '../rea/data/km';
import { STUDIEDAGER } from '../rea/data/plan';
import { kapitler, kapittel, kontrollsporsmal, TILLEGG_REKKEFOLGE, fagstoffOrd } from '../rea/pensum';
import {
  allePraktiske, caser, diagnose, droftinger, feilsok, muntlige, praktiske, tilleggForCase, tilleggsoppgaver,
} from '../rea/bank';
import {
  beredskap, begrensninger, brukBegrensninger, dekketIAppen, lagVurdering, mestring, nesteRep, sjekkBegreper, INTERVALL,
} from '../rea/vurdering';
import { tomData } from '../rea/store';
import type { AppData, DimId, KmId } from '../rea/typer';

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('Pensum fra fagstoffpakken', () => {
  it('har alle 16 kapitler pluss eksamenskapittelet', () => {
    expect(kapitler.length).toBe(17);
    for (let nr = 1; nr <= 16; nr++) expect(kapitler.some((k) => k.nr === nr), `kapittel ${nr}`).toBe(true);
    expect(fagstoffOrd).toBeGreaterThan(20000);
  });

  it('sentrale kapitler har full leksjonsstruktur og minst 900 ord', () => {
    for (const k of kapitler.filter((x) => x.sentral)) {
      const titler = k.seksjoner.filter((s) => s.type === 'tillegg').map((s) => s.tittel);
      for (const t of TILLEGG_REKKEFOLGE) expect(titler, `${k.id} mangler «${t}»`).toContain(t);
      expect(k.ord, `${k.id} har ${k.ord} ord`).toBeGreaterThanOrEqual(900);
      expect(k.seksjoner[0].tittel, k.id).toBe('Læringsmål');
    }
  });

  it('ingen fagtekst er forkortet: hvert delkapittel i fagstoffet finnes igjen', () => {
    const k4 = kapittel('k04')!;
    expect(k4.seksjoner.some((s) => s.tittel === '4.7 Arv' && s.md.includes('Arv passer når det er et tydelig «er-en»-forhold'))).toBe(true);
    expect(kapittel('k06')!.seksjoner.some((s) => s.type === 'fordypning' && s.tittel.startsWith('25.'))).toBe(true);
    expect(kapittel('k15')!.seksjoner.some((s) => s.tittel.startsWith('31.'))).toBe(true);
    expect(kapittel('k00')!.seksjoner.some((s) => s.tittel.startsWith('2. Hva vet vi'))).toBe(true);
  });

  it('kapitteloppgavene som er flyttet ut av lesestoffet, står ordrett i tilleggsstoffet', () => {
    for (const k of kapitler) {
      const kapOppg = k.fjernedeOppgaver.split(/### Fordypningsoppgaver/)[0];
      const tillegg = norm(k.seksjoner.filter((s) => s.type === 'tillegg').map((s) => s.md).join('\n'));
      for (const l of kapOppg.split('\n')) {
        const m = /^\d+\.\s+(.*)$/.exec(l) ?? /^(\*\*[^*]+:\*\*.*)$/.exec(l);
        if (m) expect(tillegg, `${k.id}: «${m[1].slice(0, 60)}»`).toContain(norm(m[0]));
      }
    }
  });

  it('fordypningsoppgavene står ordrett i den muntlige banken', () => {
    const spm = new Set(muntlige.map((m) => norm(m.sporsmal)));
    for (const k of kapitler) {
      const del = k.fjernedeOppgaver.split(/### Fordypningsoppgaver/).slice(1).join('\n');
      for (const l of del.split('\n')) {
        const m = /^\d+\.\s+(.*)$/.exec(l);
        if (m) expect(spm.has(norm(m[1])), `${k.id}: ${m[1]}`).toBe(true);
      }
    }
  });

  it('hver oppgave i tilleggsstoffet har løsningsforslag, og oppgaver finnes på tre nivåer', () => {
    for (const k of kapitler.filter((x) => x.sentral)) {
      const oppg = k.seksjoner.find((s) => s.tittel === 'Oppgaver og løsningsforslag')!.md;
      const blokker = oppg.split(':::oppgave ').slice(1);
      for (const b of blokker) expect(b, k.id).toContain(':::losning');
      const nivaer = blokker.map((b) => b.split('\n')[0].trim());
      expect(nivaer.filter((n) => n === 'Grunnleggende').length, k.id).toBeGreaterThanOrEqual(2);
      expect(nivaer.filter((n) => n === 'Middels').length, k.id).toBeGreaterThanOrEqual(2);
      expect(nivaer.filter((n) => n === 'Utfordrende').length, k.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('kodeblokker og :::-blokker er lukket i alle seksjoner', () => {
    for (const k of kapitler) for (const s of k.seksjoner) {
      expect((s.md.match(/^```/gm) ?? []).length % 2, `${s.id}`).toBe(0);
      const apne = (s.md.match(/^:::(oppgave|modell|eksempel)/gm) ?? []).length;
      const lukk = (s.md.match(/^:::\s*$/gm) ?? []).length;
      expect(lukk, s.id).toBe(apne);
    }
  });

  it('40 kontrollspørsmål er hentet ut', () => {
    expect(kontrollsporsmal.length).toBe(40);
  });
});

describe('Oppgavebanker', () => {
  it('oppfyller minstekravene i masterprompten', () => {
    expect(muntlige.length).toBeGreaterThanOrEqual(80);
    expect(praktiske.length).toBeGreaterThanOrEqual(30);
    expect(caser.length).toBeGreaterThanOrEqual(8);
    expect(tilleggsoppgaver.length).toBeGreaterThanOrEqual(8);
    expect(feilsok.length).toBeGreaterThanOrEqual(20);
    expect(droftinger.length).toBeGreaterThanOrEqual(15);
    expect(diagnose.length).toBe(12);
  });

  it('alle id-er er unike', () => {
    const ids = [...muntlige, ...allePraktiske, ...caser, ...tilleggsoppgaver, ...droftinger].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hvert element har mål, nivå, vurderingsmomenter, oppfølging og eksempelsvar', () => {
    const gyldig = new Set(ALLE_KM);
    for (const m of [...muntlige, ...tilleggsoppgaver, ...droftinger]) {
      expect(m.km.length, m.id).toBeGreaterThan(0);
      m.km.forEach((k) => expect(gyldig.has(k), m.id).toBe(true));
      expect([1, 2, 3]).toContain(m.niva);
      expect(m.momenter.length, m.id).toBeGreaterThanOrEqual(2);
      expect(m.oppfolging.length, m.id).toBeGreaterThanOrEqual(1);
      expect(m.svar.length, m.id).toBeGreaterThan(150);
      expect(m.begreper.length, m.id).toBeGreaterThanOrEqual(3);
    }
    for (const p of allePraktiske) {
      expect(p.km.length, p.id).toBeGreaterThan(0);
      expect(p.momenter.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.oppfolging.length, p.id).toBeGreaterThanOrEqual(1);
      expect(p.losning.length, p.id).toBeGreaterThan(40);
    }
    for (const c of caser) {
      expect(c.sensor.length, c.id).toBeGreaterThanOrEqual(5);
      expect(c.praktisk.length, c.id).toBeGreaterThan(20);
      expect(c.losning.length, c.id).toBeGreaterThan(300);
      expect(c.km.length, c.id).toBeLessThan(ALLE_KM.length); // hovedcasen dekker ikke alle mål
    }
  });

  it('begrepsmønstrene er gyldige regulære uttrykk', () => {
    for (const x of [...muntlige, ...allePraktiske, ...caser, ...tilleggsoppgaver, ...droftinger]) {
      for (const b of x.begreper) for (const alt of b.split('|')) expect(() => new RegExp(alt, 'i'), `${x.id}: ${alt}`).not.toThrow();
    }
  });

  it('hver case har minst to tilleggsoppgaver fra ANDRE kompetansemål', () => {
    for (const c of caser) {
      const t = tilleggForCase(c.id);
      expect(t.length, c.id).toBeGreaterThanOrEqual(2);
      for (const x of t) expect(x.km.some((k) => c.km.includes(k))).toBe(false);
    }
  });

  it('alle 11 kompetansemål er knyttet til leksjon, oppgave og muntlig spørsmål', () => {
    expect(KOMPETANSEMAL.length).toBe(11);
    for (const km of ALLE_KM) expect(dekketIAppen(km), km).toBe(true);
  });

  it('automatiske fasiter stemmer med løsningsforslaget', () => {
    for (const p of allePraktiske.filter((x) => x.fasit)) {
      expect(p.fasit!.godta.length, p.id).toBeGreaterThan(0);
      expect(norm(p.losning).toLowerCase(), p.id).toContain(p.fasit!.godta[0].replace(/"/g, '').toLowerCase());
    }
  });
});

describe('Dag-for-dag-plan', () => {
  it('har sju studiedager 23.–29. november', () => {
    expect(STUDIEDAGER.map((d) => d.dato)).toEqual(['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29']);
  });
  it('kortversjonen er ca. 90 minutter hver dag', () => {
    for (const d of STUDIEDAGER) {
      const sum = d.blokker.reduce((a, b) => a + b.kort, 0);
      expect(sum, d.dato).toBeGreaterThanOrEqual(85);
      expect(sum, d.dato).toBeLessThanOrEqual(95);
    }
  });
  it('alle henvisninger peker på innhold som finnes', () => {
    for (const d of STUDIEDAGER) for (const b of d.blokker) {
      b.kapitler?.forEach((k) => expect(kapittel(k), `${b.id}: ${k}`).toBeTruthy());
      b.muntlig?.forEach((id) => expect(muntlige.some((m) => m.id === id), `${b.id}: ${id}`).toBe(true));
      b.praktisk?.forEach((id) => expect(allePraktiske.some((p) => p.id === id), `${b.id}: ${id}`).toBe(true));
      b.caser?.forEach((id) => expect(caser.some((c) => c.id === id), `${b.id}: ${id}`).toBe(true));
    }
  });
  it('hver studiedag 1–6 har lesing, gjenkalling/muntlig, anvendelse og feillogg', () => {
    for (const d of STUDIEDAGER.slice(0, 6)) {
      const typer = new Set(d.blokker.map((b) => b.type));
      expect(typer.has('les'), d.dato).toBe(true);
      expect(typer.has('muntlig') || typer.has('drofting') || d.blokker.some((b) => b.muntlig?.length), d.dato).toBe(true);
      expect(typer.has('praktisk') || typer.has('case') || typer.has('drofting'), d.dato).toBe(true);
      expect(typer.has('feillogg'), d.dato).toBe(true);
    }
    expect(STUDIEDAGER[6].blokker.filter((b) => b.type === 'sim').length).toBe(2);
  });
});

describe('Vurderingsmotor', () => {
  it('begrepssjekk godtar synonymer og regex', () => {
    const d = sjekkBegreper('Vi bruker en hashverdi med salt, og kryptering for HTTPS.', ['hash', 'kryptering', 'enveis', 'salt|passord']);
    expect(d.treff).toEqual(['hash', 'kryptering', 'salt']);
    expect(d.mangler).toEqual(['enveis']);
    expect(d.andel).toBe(0.75);
  });

  it('korte svar, lav begrepsdekning og hint begrenser egenvurderingen', () => {
    const dims: DimId[] = ['korrekt', 'begreper', 'overforing'];
    const full = { korrekt: 4, begreper: 4, overforing: 4 };
    expect(brukBegrensninger(full, begrensninger('Det er en klasse.', null, false, dims))).toEqual({ korrekt: 2, begreper: 2, overforing: 2 });
    const langt = 'Dette er et langt nok svar som forklarer hvordan og hvorfor løsningen virker i praksis med eksempel.';
    const b = begrensninger(langt, { treff: ['a'], mangler: ['b', 'c', 'd', 'e'], andel: 0.2 }, true, dims);
    expect(brukBegrensninger(full, b)).toEqual({ korrekt: 4, begreper: 2, overforing: 2 });
  });

  it('repetisjon: svake svar kommer raskt tilbake, sterke senere', () => {
    expect(nesteRep(undefined, 1, 0)).toMatchObject({ boks: 1, forfaller: INTERVALL[1] });
    expect(nesteRep(undefined, 2.5, 0).boks).toBe(2);
    expect(nesteRep({ boks: 3, forfaller: 0, sett: 1, siste: 4 }, 4, 0).boks).toBe(4);
    expect(nesteRep({ boks: 4, forfaller: 0, sett: 2, siste: 4 }, 1.5, 0).boks).toBe(1);
  });

  const med = (vs: { km: KmId; score: number; dato: string; kilde?: 'muntlig' | 'tillegg' }[]): AppData => ({
    ...tomData(),
    vurderinger: vs.map((v, i) => ({ ...lagVurdering({ kilde: v.kilde ?? 'muntlig', ref: `r${i}`, km: [v.km], dim: { korrekt: v.score }, hint: false, dekning: null, naa: new Date(`${v.dato}T18:00:00`) }) })),
  });

  it('stabilt nivå 3 krever to ulike dager, og lesing teller ikke som mestring', () => {
    const d = med([{ km: 'KM4', score: 4, dato: '2026-11-25' }, { km: 'KM4', score: 4, dato: '2026-11-25' }]);
    expect(mestring(d, 'KM4').stabil3).toBe(false);
    const d2 = med([{ km: 'KM4', score: 3.5, dato: '2026-11-25' }, { km: 'KM4', score: 4, dato: '2026-11-26' }]);
    expect(mestring(d2, 'KM4')).toMatchObject({ stabil3: true, niva4: true, status: 'blaa' });
    const lestAlt = { ...tomData(), lest: Object.fromEntries(kapitler.flatMap((k) => k.seksjoner.map((s) => [s.id, 1]))) };
    expect(mestring(lestAlt, 'KM4').status).toBe('ingen');
    expect(beredskap(lestAlt).klar).toBe(false);
  });

  it('beredskap: tom fremdrift gir høy risiko og ikke klar', () => {
    const b = beredskap(tomData());
    expect(b.klar).toBe(false);
    expect(b.risiko).toBe('høy');
    expect(b.vilkar.find((v) => v.id === 'dekket')!.ok).toBe(true);
    expect(b.prioritet.length).toBeGreaterThan(0);
  });

  it('beredskap: klar først når ALLE vilkår er oppfylt', () => {
    const vs = ALLE_KM.flatMap((km) => [
      { km, score: 3.8, dato: '2026-11-27' }, { km, score: 3.8, dato: '2026-11-28' },
    ]);
    const d = med([...vs, { km: 'KM8', score: 3.5, dato: '2026-11-29', kilde: 'tillegg' }, { km: 'KM9', score: 3.5, dato: '2026-11-29', kilde: 'tillegg' }]);
    expect(beredskap(d).klar).toBe(false); // mangler simuleringer
    const sim = { id: 's', caseId: 'C1', tilleggId: 'T9', start: 0, slutt: 1, forberedelseMin: 30, startform: 'forklaring' as const, hoved: 3.5, tillegg: 3.5, sammenhengende: true, snakkeSek: 200, dim: {}, tilleggDim: {}, forbedring: [] };
    const klar = { ...d, sims: [sim, { ...sim, id: 's2' }] };
    const b = beredskap(klar);
    expect(b.vilkar.filter((v) => !v.ok).map((v) => v.id)).toEqual([]);
    expect(b.klar).toBe(true);
    expect(b.risiko).toBe('lav');
  });
});
