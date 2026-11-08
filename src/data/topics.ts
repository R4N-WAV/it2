import type { Topic, TopicId } from '../types';

/** De 11 kompetansemålene etter IT2 (Udir, INF01-03), i Udirs rekkefølge. */
export const kompetansemal: Record<string, string> = {
  KM1: 'Utforske og vurdere muligheter, utfordringer og konsekvenser ved bruk av informasjonsteknologi i ulike sammenhenger',
  KM2: 'Drøfte etiske dilemmaer som oppstår som en konsekvens av informasjonsteknologi, både for individ og samfunn',
  KM3: 'Utforske og vurdere alternative løsninger for design og implementering av et program',
  KM4: 'Anvende objektorientert modellering til å beskrive et programs struktur',
  KM5: 'Utvikle objektorienterte programmer med klasser, objekter, metoder og arv',
  KM6: 'Vurdere og bruke strategier for feilsøking og testing av programkode',
  KM7: 'Generalisere løsninger ved å utvikle og bruke gjenbrukbar programkode',
  KM8: 'Vurdere brukervennligheten i egne og andres programmer og foreslå forbedringer',
  KM9: 'Velge og bruke relevante systemutviklingsmetoder og -verktøy for samarbeid med andre',
  KM10: 'Gjøre rede for standarder for lagring, utveksling og sikring av ulike typer data',
  KM11: 'Bruke programmering til å innhente, analysere og presentere informasjon fra reelle datasett',
};

/** Hvilket kompetansemål hvert tema først og fremst trener. */
export const KM_FOR_TEMA: Record<TopicId, string> = {
  grunnlag: 'KM5', lister: 'KM5', funksjoner: 'KM7', algoritmer: 'KM3',
  'oop-klasser': 'KM5', 'oop-arv': 'KM5', 'oop-komposisjon': 'KM4', uml: 'KM4',
  feilsoking: 'KM6', data: 'KM11', lagring: 'KM10', spill: 'KM3',
  etikk: 'KM2', systemutvikling: 'KM9',
};

/*
 * Prioritet bygger på frekvens i de sju skriftlige settene H23–V26
 * (pseudokode/algoritme, etikk, datasett, spill/simulering: 7 av 7; OOP/UML: 6 av 7; flytskjema 4 av 7)
 * og på hvor raskt temaet kan læres. Historikk ≠ garanti.
 */
export const topics: Topic[] = [
  { id: 'grunnlag', navn: 'Variabler, typer, if og løkker', km: 'KM5', prioritet: 1, eksamen: 'begge', kort: 'Lese og spore kode med datatyper, if/else, for og while.' },
  { id: 'algoritmer', navn: 'Pseudokode, flytskjema og algoritmer', km: 'KM3', prioritet: 1, eksamen: 'begge', kort: 'Spore, sortere og skrive pseudokode, og tolke flytskjema (7 av 7 eksamener).' },
  { id: 'oop-klasser', navn: 'Klasser, objekter og konstruktører', km: 'KM5', prioritet: 1, eksamen: 'begge', kort: 'Lage en klasse med felt, konstruktør og metoder, og lage objekter.' },
  { id: 'oop-arv', navn: 'Arv, super og polymorfi', km: 'KM5', prioritet: 1, eksamen: 'begge', kort: 'Lage en subklasse med extends, kalle super(...) og overstyre metoder.' },
  { id: 'oop-komposisjon', navn: 'Komposisjon, aggregering, assosiasjon', km: 'KM4', prioritet: 1, eksamen: 'begge', kort: 'La et objekt ha en liste med andre objekter, og skille har-en fra er-en.' },
  { id: 'data', navn: 'Datasett: innlesing, filtrering, statistikk', km: 'KM11', prioritet: 1, eksamen: 'begge', kort: 'Lese CSV, filtrere, gruppere, regne sum/snitt/prosent og presentere (7 av 7).' },
  { id: 'etikk', navn: 'Etikk, personvern og konsekvenser', km: 'KM2', prioritet: 1, eksamen: 'begge', kort: 'Drøfte et case med begge sider, fagbegreper og begrunnet konklusjon (7 av 7).' },
  { id: 'spill', navn: 'Spill og simulering', km: 'KM3', prioritet: 1, eksamen: 'begge', kort: 'Modellere spillobjekter og tilstand, oppdatere i løkke, rutenett og tilfeldighet (7 av 7).' },
  { id: 'lister', navn: 'Arrays, ArrayList og HashMap', km: 'KM5', prioritet: 1, eksamen: 'begge', kort: 'Legge til, hente ut, gå gjennom og filtrere samlinger.' },
  { id: 'funksjoner', navn: 'Metoder, parametere og gjenbruk', km: 'KM7', prioritet: 2, eksamen: 'begge', kort: 'Skrive metoder som tar inn verdier og returnerer et resultat, og generalisere.' },
  { id: 'uml', navn: 'Klassediagram (UML)', km: 'KM4', prioritet: 2, eksamen: 'begge', kort: 'Lese og tegne klassediagram med arv, komposisjon og multiplisitet.' },
  { id: 'feilsoking', navn: 'Feilsøking, testing og testplan', km: 'KM6', prioritet: 2, eksamen: 'begge', kort: 'Skille feiltyper, teste grensetilfeller og lage en testplan.' },
  { id: 'lagring', navn: 'Lagring, utveksling og sikring av data', km: 'KM10', prioritet: 2, eksamen: 'begge', kort: 'Forklare CSV/JSON, datatyper, tegnsett, validering og sikker lagring (KIT).' },
  { id: 'systemutvikling', navn: 'Systemutvikling og brukervennlighet', km: 'KM9', prioritet: 3, eksamen: 'muntlig', kort: 'Forklare brukerbehov, brukertesting, smidig utvikling og samarbeidsverktøy (KM8, KM9).' },
];

export const topicNavn = (id: string) => topics.find((t) => t.id === id)?.navn ?? id;
