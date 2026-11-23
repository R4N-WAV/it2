import type { DimId, KmId } from '../typer';

export interface Kompetansemal {
  id: KmId;
  nr: number;
  tittel: string; // Udirs formulering (fra fagstoffpakken)
  kort: string; // kort navn
  ferdighet: string; // hva du konkret må kunne vise
}

export const KOMPETANSEMAL: Kompetansemal[] = [
  { id: 'KM1', nr: 1, kort: 'IT i samfunnet', tittel: 'Utforske og vurdere muligheter, utfordringer og konsekvenser ved bruk av informasjonsteknologi i ulike sammenhenger', ferdighet: 'Analysere et konkret IT-system: gevinster, ulemper, risiko, tilgjengelighet, personvern, kostnader og miljø.' },
  { id: 'KM2', nr: 2, kort: 'Etiske dilemmaer', tittel: 'Drøfte etiske dilemmaer som oppstår som en konsekvens av informasjonsteknologi, både for individ og samfunn', ferdighet: 'Presentere flere sider, identifisere interessenter, vurdere konsekvenser og begrunne en konklusjon.' },
  { id: 'KM3', nr: 3, kort: 'Alternative løsninger', tittel: 'Utforske og vurdere alternative løsninger for design og implementering av et program', ferdighet: 'Foreslå mer enn én løsning (algoritme, datastruktur, lagring, arkitektur) og sammenligne dem.' },
  { id: 'KM4', nr: 4, kort: 'OO-modellering/UML', tittel: 'Anvende objektorientert modellering til å beskrive et programs struktur', ferdighet: 'Gå fra tekst til klassediagram med klasser, attributter, metoder, relasjoner og multiplisitet.' },
  { id: 'KM5', nr: 5, kort: 'OO-programmering', tittel: 'Utvikle objektorienterte programmer med klasser, objekter, metoder og arv', ferdighet: 'Skrive/demonstrere klasser og objekter, bruke metoder og arv, forklare data og oppførsel.' },
  { id: 'KM6', nr: 6, kort: 'Testing og feilsøking', tittel: 'Vurdere og bruke strategier for feilsøking og testing av programkode', ferdighet: 'Finne feil, lage testtilfeller, tolke resultater og forbedre koden.' },
  { id: 'KM7', nr: 7, kort: 'Gjenbrukbar kode', tittel: 'Generalisere løsninger ved å utvikle og bruke gjenbrukbar programkode', ferdighet: 'Lage funksjoner, klasser og moduler med parametere, returverdier og abstraksjon.' },
  { id: 'KM8', nr: 8, kort: 'Brukervennlighet', tittel: 'Vurdere brukervennligheten i egne og andres programmer og foreslå forbedringer', ferdighet: 'Vurdere et grensesnitt, foreslå konkrete forbedringer, planlegge brukertest og universell utforming.' },
  { id: 'KM9', nr: 9, kort: 'Systemutvikling', tittel: 'Velge og bruke relevante systemutviklingsmetoder og -verktøy for samarbeid med andre', ferdighet: 'Forklare og velge mellom fossefall og smidig/Scrum, og bruke Git til samarbeid.' },
  { id: 'KM10', nr: 10, kort: 'Lagring, utveksling, sikring', tittel: 'Gjøre rede for standarder for lagring, utveksling og sikring av ulike typer data', ferdighet: 'CSV/JSON/XML, databaser/SQL, tegnkoding, HTTP/API, kryptering, tilgangskontroll og backup.' },
  { id: 'KM11', nr: 11, kort: 'Reelle datasett', tittel: 'Bruke programmering til å innhente, analysere og presentere informasjon fra reelle datasett', ferdighet: 'Lese inn, rense, beregne, presentere og vurdere datakvalitet og begrensninger.' },
];

export const kmNavn = (id: string) => KOMPETANSEMAL.find((k) => k.id === id)?.kort ?? id;
export const ALLE_KM: KmId[] = KOMPETANSEMAL.map((k) => k.id);

/** Kritiske områder (masterprompt §9.1 / fagstoff §19). Ingen kritisk svakhet er tillatt her. */
export const KRITISKE: { id: string; navn: string; km: KmId[] }[] = [
  { id: 'oop', navn: 'OOP og UML', km: ['KM4', 'KM5'] },
  { id: 'test', navn: 'Testing og feilsøking', km: ['KM6'] },
  { id: 'etikk', navn: 'Etikk, personvern og IT-konsekvenser', km: ['KM1', 'KM2'] },
  { id: 'data', navn: 'Dataformater, datasett og sikkerhet', km: ['KM10', 'KM11'] },
  { id: 'praktisk', navn: 'Praktisk problemløsning og programmering', km: ['KM3', 'KM7'] },
];

export const DIMENSJONER: { id: DimId; navn: string; sporsmal: string }[] = [
  { id: 'korrekt', navn: 'Faglig korrekthet', sporsmal: 'Var det jeg sa faglig riktig?' },
  { id: 'begreper', navn: 'Fagbegreper', sporsmal: 'Brukte jeg presise fagbegreper på riktig måte?' },
  { id: 'hvorfor', navn: 'Hvordan/hvorfor', sporsmal: 'Forklarte jeg hvordan det virker og hvorfor?' },
  { id: 'eksempel', navn: 'Eksempler og anvendelse', sporsmal: 'Ga jeg et konkret eksempel eller brukte kunnskapen?' },
  { id: 'alternativ', navn: 'Begrunnelse og alternativer', sporsmal: 'Begrunnet jeg valg og vurderte minst ett alternativ?' },
  { id: 'overforing', navn: 'Selvstendighet og overføring', sporsmal: 'Klarte jeg det uten fasit, og kan jeg bruke det i en ny situasjon?' },
  { id: 'praktisk', navn: 'Praktisk gjennomføring/testing', sporsmal: 'Viste jeg det praktisk – kode, modell, test eller demonstrasjon?' },
];

export const ANKER: Record<number, string> = {
  0: 'Ingen relevant forståelse.',
  1: 'Fragmentert gjenkjenning; store feil; trenger fasit.',
  2: 'Enkel forståelse; noen riktige svar med støtte, men mangler sammenheng eller praktisk selvstendighet.',
  3: 'God grunnleggende forståelse; kan forklare og anvende i kjente situasjoner; mindre feil.',
  4: 'God og selvstendig kompetanse; forklarer, bruker, begrunner, tester og vurderer alternativer i nye situasjoner.',
};

/** Hvilke dimensjoner som vurderes for hver oppgavetype. */
export const DIM_FOR: Record<string, DimId[]> = {
  definisjon: ['korrekt', 'begreper', 'hvorfor', 'eksempel'],
  forklaring: ['korrekt', 'begreper', 'hvorfor', 'eksempel', 'overforing'],
  drofting: ['korrekt', 'begreper', 'hvorfor', 'eksempel', 'alternativ', 'overforing'],
  demonstrasjon: ['korrekt', 'begreper', 'hvorfor', 'eksempel', 'praktisk'],
  praktisk: ['korrekt', 'begreper', 'hvorfor', 'alternativ', 'praktisk'],
  alle: ['korrekt', 'begreper', 'hvorfor', 'eksempel', 'alternativ', 'overforing', 'praktisk'],
};
