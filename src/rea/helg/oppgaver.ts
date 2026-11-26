import { GRUNN } from './grunn';
import type { Ferdighet, HelgOppgave, Trinn } from './typer';
import { VIDERE } from './videre';

export const TRINN: { id: Trinn; navn: string; forklaring: string }[] = [
  { id: 'se', navn: '1 Se', forklaring: 'Lite eksempel, forklart linje for linje' },
  { id: 'forutsi', navn: '2 Forutsi', forklaring: 'Si hva programmet skriver ut – før du kjører' },
  { id: 'spor', navn: '3 Spor', forklaring: 'Følg verdiene linje for linje i en tabell' },
  { id: 'fullfor', navn: '4 Fullfør', forklaring: 'Skriv linjene som mangler' },
  { id: 'rett', navn: '5 Rett', forklaring: 'Finn og rett feilen' },
  { id: 'endre', navn: '6 Endre', forklaring: 'Endre programmet for et nytt krav' },
  { id: 'skriv', navn: '7 Skriv selv', forklaring: 'Fra blankt ark, uten fasit' },
  { id: 'forklar', navn: '8 Forklar', forklaring: 'Forklar høyt med fagbegreper' },
  { id: 'alternativ', navn: '9 Alternativ', forklaring: 'Annen løsning – fordel og ulempe' },
  { id: 'overfor', navn: '10 Overfør', forklaring: 'Samme idé, ny situasjon' },
];
export const trinnNavn = (t: Trinn) => TRINN.find((x) => x.id === t)!.navn;

export const FERDIGHETER: { id: Ferdighet; navn: string; kort: string; kritisk: boolean }[] = [
  { id: 'variabler', navn: 'Variabler, datatyper, utskrift og input', kort: 'Variabler', kritisk: true },
  { id: 'if', navn: 'Betingelser (if / else)', kort: 'if/else', kritisk: true },
  { id: 'lokker', navn: 'Løkker (for / while)', kort: 'Løkker', kritisk: true },
  { id: 'lister', navn: 'Lister og arrayer', kort: 'Lister', kritisk: true },
  { id: 'metoder', navn: 'Metoder: parameter og returverdi', kort: 'Metoder', kritisk: true },
  { id: 'oop', navn: 'OOP: klasse, objekt, konstruktør, arv', kort: 'OOP', kritisk: true },
  { id: 'uml', navn: 'Klassediagram og modellering', kort: 'UML', kritisk: false },
  { id: 'feil', navn: 'Feilsøking (syntaks, type, logikk, grense)', kort: 'Feilsøking', kritisk: true },
  { id: 'testing', navn: 'Testing og testtabell', kort: 'Testing', kritisk: true },
  { id: 'data', navn: 'Datasett, CSV og JSON', kort: 'Data', kritisk: false },
  { id: 'alternativ', navn: 'Alternative løsninger', kort: 'Alternativer', kritisk: false },
  { id: 'muntlig', navn: 'Muntlig bredde: etikk, personvern, sikkerhet, UX, systemutvikling', kort: 'Bredde', kritisk: false },
];
export const ferdighetNavn = (f: Ferdighet) => FERDIGHETER.find((x) => x.id === f)!.navn;

/** Alle oppgaver i læringsrekkefølge (helgeplanens rekkefølge). */
export const HELG_OPPGAVER: HelgOppgave[] = [...GRUNN, ...VIDERE];

const idx = new Map(HELG_OPPGAVER.map((o, i) => [o.id, i]));
export const helgOppgave = (id: string) => HELG_OPPGAVER[idx.get(id) ?? -1];

/** Oppgavene for én ferdighet sortert etter læringsstigen. */
export function stige(f: Ferdighet): HelgOppgave[] {
  const t = (x: Trinn) => TRINN.findIndex((y) => y.id === x);
  return HELG_OPPGAVER.filter((o) => o.ferdighet === f).sort((a, b) => t(a.trinn) - t(b.trinn) || idx.get(a.id)! - idx.get(b.id)!);
}

/** Generelle muntlige spørsmål (masterprompt §7E) – to av dem legges til etter hver praktiske oppgave. */
export const GENERELLE_MUNTLIGE = [
  'Hva var problemet du skulle løse?',
  'Hva er input, behandling og output?',
  'Hva gjør hver viktig linje?',
  'Hvorfor valgte du denne løsningen?',
  'Hvilke begrensninger har den?',
  'Hvilken alternativ løsning kunne du valgt?',
  'Hvordan testet du den?',
  'Hva ville du forbedret med mer tid?',
];

/** Svarramme hvis du står fast (masterprompt §11). */
export const SVARRAMME = [
  '«Først vil jeg beskrive hva programmet skal få inn og hva det skal gi ut.»',
  '«Jeg ville delt løsningen inn i disse stegene …»',
  '«Denne variabelen lagrer …»',
  '«Betingelsen sjekker om …»',
  '«Løkken gjentar … så lenge …»',
  '«En metode gjør at jeg kan samle logikk og gjenbruke den.»',
  '«Jeg ville testet normaltilfellet, en grenseverdi og ugyldig input.»',
  '«En alternativ løsning er … Fordelen er …, men ulempen er …»',
  '«Jeg er ikke helt sikker på den eksakte syntaksen, men logikken jeg vil bruke er … Først … Deretter … Til slutt …»',
];

/** Muntlige spørsmål for en oppgave: oppgavens egne + to generelle (roterer per oppgave). */
export function muntligeFor(o: HelgOppgave): string[] {
  if (o.trinn === 'se' || o.trinn === 'forklar' || o.trinn === 'alternativ') return o.muntlig;
  const n = idx.get(o.id) ?? 0;
  const g = [GENERELLE_MUNTLIGE[(n * 3) % 8], GENERELLE_MUNTLIGE[(n * 3 + 5) % 8]];
  return [...o.muntlig, ...g.filter((x) => !o.muntlig.includes(x))];
}
