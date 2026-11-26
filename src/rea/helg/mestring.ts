/*
 * Streng målestokk for «kan» (masterprompt §10):
 *  - Lest, sett fasit, kopiert eller bare flervalg teller ikke.
 *  - Grønn oppgave = løst uten hint og uten å se fasit (kode: kjørt med riktig utskrift).
 *  - Gul = løst med hint, eller løst uten å ha kjørt koden.
 *  - Rød = forsøkt, men ikke løst, eller fasit sett før løsning.
 *  - Ferdighet grønn = minst TO grønne oppgaver (en kjent og en variant), minst én praktisk.
 */
import type { AppData } from '../typer';
import { FERDIGHETER, HELG_OPPGAVER, helgOppgave, stige } from './oppgaver';
import type { Ferdighet, HelgForsok, HelgOppgave, HelgStatus, Trinn } from './typer';

export const PRAKTISKE_TRINN: Trinn[] = ['fullfor', 'rett', 'endre', 'skriv', 'overfor'];

export function normaliserSvar(s: string): string {
  return s.toLowerCase().replace(/[«»"'`]/g, '').replace(/(\d),(\d)/g, '$1.$2').replace(/\s+/g, ' ').trim().replace(/[.;:!]+$/, '').trim();
}
const normLinje = (s: string) => s.toLowerCase().replace(/(\d),(\d)/g, '$1.$2').replace(/\s+/g, ' ').trim();

/** Hver forventet linje må finnes (som del av en linje) i faktisk utskrift, i samme rekkefølge. */
export function utskriftStemmer(faktisk: string, forventet: string): boolean {
  const f = faktisk.replace(/\r/g, '').split('\n').map(normLinje).filter(Boolean);
  const e = forventet.split('\n').map(normLinje).filter(Boolean);
  let i = 0;
  for (const linje of e) {
    while (i < f.length && !f[i].includes(linje)) i++;
    if (i >= f.length) return false;
    i++;
  }
  return true;
}

export function svarRiktig(o: HelgOppgave, svar: string): boolean {
  if (!o.svar) return false;
  const n = normaliserSvar(svar);
  return n.length > 0 && o.svar.godta.some((g) => normaliserSvar(g) === n);
}

/** Må koden kjøres for å få grønn? (praktiske kodeoppgaver med forventet utskrift og uten kort svar) */
export const kreverKjoring = (o: HelgOppgave) => !!o.utskrift && !o.svar && o.trinn !== 'se';
export const tellerIkke = (o: HelgOppgave) => o.trinn === 'se';

export function oppgaveStatus(o: HelgOppgave, f?: HelgForsok): HelgStatus {
  if (!f) return 'ikke';
  if (!f.lost) return f.forsok > 0 || f.fasitSett || f.kode.trim() || f.svar ? 'rod' : 'ikke';
  if (f.fasitSett) return 'rod';
  if (f.hint > 0) return 'gul';
  if (kreverKjoring(o) && !f.kjort) return 'gul';
  if (f.muntlig?.[-1]?.selv === 0) return 'gul'; // egenvurdert som usikker ved levering
  return 'gronn';
}

export const statusFor = (d: AppData, id: string) => oppgaveStatus(helgOppgave(id), d.helg?.[id]);

export interface FerdighetStatus { id: Ferdighet; status: HelgStatus; gronne: number; praktiskGronn: boolean; totalt: number; neste?: HelgOppgave }

export function ferdighetStatus(d: AppData, f: Ferdighet): FerdighetStatus {
  const liste = stige(f).filter((o) => !tellerIkke(o));
  const st = liste.map((o) => ({ o, s: oppgaveStatus(o, d.helg?.[o.id]) }));
  const gronne = st.filter((x) => x.s === 'gronn');
  const praktiskGronn = gronne.some((x) => PRAKTISKE_TRINN.includes(x.o.trinn));
  const kodeFerdighet = FERDIGHETER.find((x) => x.id === f)!.kritisk;
  const krav2 = gronne.length >= 2 && (!kodeFerdighet || praktiskGronn || f === 'testing');
  const status: HelgStatus = krav2 ? 'gronn' : gronne.length || st.some((x) => x.s === 'gul') ? 'gul' : st.some((x) => x.s === 'rod') ? 'rod' : 'ikke';
  const se = stige(f).find((o) => tellerIkke(o) && !d.helg?.[o.id]?.lost);
  const neste = se ?? st.find((x) => x.s !== 'gronn')?.o;
  return { id: f, status, gronne: gronne.length, praktiskGronn, totalt: liste.length, neste };
}

export interface Sjekkpunkt { id: string; tekst: string; ok: boolean; kritisk: boolean; ovelse?: string; detalj: string }

/** Sjekkpunktene for minimum bestått-forberedelse (masterprompt §10). Interne treningskrav, ikke Udir-grenser. */
export function sjekkpunkter(d: AppData): Sjekkpunkt[] {
  const fs = (f: Ferdighet) => ferdighetStatus(d, f);
  const gronn = (f: Ferdighet) => fs(f).status === 'gronn';
  const kode: Ferdighet[] = ['variabler', 'if', 'lokker', 'lister', 'metoder'];
  const kodeSvak = kode.filter((f) => !gronn(f));
  const oppg = (id: string) => statusFor(d, id);
  const p: Sjekkpunkt[] = [
    { id: 'kode', kritisk: true, tekst: 'Jeg kan skrive eller fullføre variabler, if/else, løkke, liste og metode', ok: kodeSvak.length === 0,
      detalj: kodeSvak.length ? `Ikke grønn ennå: ${kodeSvak.map((f) => FERDIGHETER.find((x) => x.id === f)!.kort).join(', ')}` : 'To grønne varianter i alle fem.', ovelse: kodeSvak.length ? fs(kodeSvak[0]).neste?.id : undefined },
    { id: 'oop', kritisk: true, tekst: 'Jeg forstår klasse, objekt, attributt, metode og enkel konstruktør', ok: gronn('oop'), detalj: `${fs('oop').gronne} grønne OOP-oppgaver (krav: 2, minst én praktisk).`, ovelse: fs('oop').neste?.id },
    { id: 'feil', kritisk: true, tekst: 'Jeg kan finne og forklare minst én logisk feil', ok: gronn('feil'), detalj: `${fs('feil').gronne} grønne feilsøkingsoppgaver.`, ovelse: fs('feil').neste?.id },
    { id: 'testing', kritisk: true, tekst: 'Jeg kan teste normaltilfelle, grenseverdi og ugyldig input', ok: gronn('testing'), detalj: `${fs('testing').gronne} grønne testoppgaver.`, ovelse: fs('testing').neste?.id },
    { id: 'forklar', kritisk: false, tekst: 'Jeg kan forklare de viktigste delene av et enkelt program', ok: oppg('forklar-eget') === 'gronn', detalj: 'Oppgaven «Forklar ditt eget program uten å lese».', ovelse: 'forklar-eget' },
    { id: 'uml', kritisk: false, tekst: 'Jeg kan lese et enkelt klassediagram og forklare klassene/relasjonene', ok: gronn('uml'), detalj: `${fs('uml').gronne} grønne modelleringsoppgaver.`, ovelse: fs('uml').neste?.id },
    { id: 'alternativ', kritisk: false, tekst: 'Jeg kan foreslå minst én alternativ løsning og si én fordel/ulempe', ok: fs('alternativ').gronne >= 1, detalj: `${fs('alternativ').gronne} grønne alternativoppgaver.`, ovelse: fs('alternativ').neste?.id },
    { id: 'data', kritisk: false, tekst: 'Jeg kan forklare enkel håndtering av datasett/dataformat', ok: gronn('data'), detalj: `${fs('data').gronne} grønne dataoppgaver.`, ovelse: fs('data').neste?.id },
    { id: 'etikk', kritisk: false, tekst: 'Jeg kan drøfte et etisk dilemma med fordel, risiko og tiltak', ok: oppg('etikk-kamera') === 'gronn', detalj: 'Oppgaven «Etikk: kameraovervåking (P–F–R–T–K)».', ovelse: 'etikk-kamera' },
    { id: 'snakke', kritisk: false, tekst: 'Jeg kan snakke om sentrale fagtemaer uten å lese fra notater', ok: d.sims.length >= 1 && fs('muntlig').gronne >= 3, detalj: `${d.sims.length} eksamenssimulering(er), ${fs('muntlig').gronne} grønne muntlige breddeoppgaver (krav: 1 og 3).`, ovelse: fs('muntlig').neste?.id },
  ];
  return p;
}

export function helgKlar(d: AppData) {
  const p = sjekkpunkter(d);
  const kritiskeMangler = p.filter((x) => x.kritisk && !x.ok);
  return { punkter: p, kritiskeMangler, klar: p.every((x) => x.ok), ok: p.filter((x) => x.ok).length };
}

/** KRITISKE SVAKHETER: oppgaver du har feilet/trengt hint på, med en ny variant av samme type. */
export function svakheter(d: AppData): { oppgave: HelgOppgave; status: HelgStatus; variant?: HelgOppgave }[] {
  const ut: { oppgave: HelgOppgave; status: HelgStatus; variant?: HelgOppgave }[] = [];
  for (const o of HELG_OPPGAVER) {
    if (tellerIkke(o)) continue;
    const s = oppgaveStatus(o, d.helg?.[o.id]);
    if (s !== 'rod' && s !== 'gul') continue;
    const kandidater = stige(o.ferdighet).filter((x) => x.id !== o.id && !tellerIkke(x) && oppgaveStatus(x, d.helg?.[x.id]) !== 'gronn');
    const variant = kandidater.find((x) => x.trinn === o.trinn) ?? kandidater.find((x) => PRAKTISKE_TRINN.includes(x.trinn)) ?? kandidater[0];
    ut.push({ oppgave: o, status: s, variant });
  }
  const rang = { rod: 0, gul: 1, gronn: 2, ikke: 3 };
  const kritisk = (o: HelgOppgave) => (FERDIGHETER.find((f) => f.id === o.ferdighet)!.kritisk ? 0 : 1);
  return ut.sort((a, b) => rang[a.status] - rang[b.status] || kritisk(a.oppgave) - kritisk(b.oppgave));
}
