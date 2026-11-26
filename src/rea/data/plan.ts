import type { KmId } from '../typer';

export type BlokkType = 'kodelab' | 'diagnose' | 'les' | 'muntlig' | 'praktisk' | 'drofting' | 'case' | 'sim' | 'repetisjon' | 'svakheter' | 'feillogg' | 'beredskap' | 'pause' | 'eksamensdag';

export interface Blokk {
  id: string;
  start: string;
  slutt: string;
  type: BlokkType;
  tittel: string;
  beskrivelse: string;
  /** Minutter i 90-minutters kortversjon. 0 = kan hoppes over på en dag med lav kapasitet. */
  kort: number;
  kapitler?: string[]; // k01 …
  muntlig?: string[]; // id-er i muntlig bank
  praktisk?: string[]; // id-er i praktisk/feilsøk-bank
  caser?: string[];
  helg?: string[]; // oppgave-id-er i Kodelab (helgesprint)
  km?: KmId[];
}

export interface Studiedag {
  nr: number;
  dato: string; // YYYY-MM-DD
  ukedag: string;
  tittel: string;
  hovedmal: string;
  km: KmId[];
  krav: string; // «Dagens krav» fra fagstoffpakken
  blokker: Blokk[];
}

const pause = (id: string, start: string, slutt: string, tittel = 'Pause'): Blokk => ({ id, start, slutt, type: 'pause', tittel, beskrivelse: 'Reis deg, drikk vann, se bort fra skjermen.', kort: 0 });

/*
 * HELGEPLAN: bare lørdag 28. og søndag 29. november 2026 (helgepraksisfilen, del 14). Den gamle planen 23.–27.11 er
 * utgått og fjernet. «kort» = minutter i 4-timers redningsplanen («Praktisk redningsplan hvis du ikke har en hel dag»).
 * Fordeling: ca. 15–20 % lesing (mikroleksjoner), 45–50 % koding, 20–25 % muntlig/feilsøking/alternativer, 10 % repetisjon.
 */
export const STUDIEDAGER: Studiedag[] = [
  {
    nr: 1, dato: '2026-11-28', ukedag: 'Lørdag', tittel: 'Lær å kode og forstå kode', km: ['KM3', 'KM5', 'KM6', 'KM7'],
    hovedmal: 'Ved dagens slutt kan du selv skrive, forklare og teste et lite program med variabler, input/output, betingelser, løkker, en liste og minst én metode – og forklare og lage en enkel klasse.',
    krav: 'Lørdagsgrense: Hvis du ikke kan skrive en enkel betingelse, løkke, metode og klasse med støtte, bruker du søndag morgen på disse før du går videre.',
    blokker: [
      { id: 'l1', start: '09.00', slutt: '09.30', type: 'kodelab', tittel: 'Oppsett og første program', kort: 20, helg: ['v-se', '2.1A'], beskrivelse: 'Åpne en editor/terminal. Bekreft at Java kjører: `java -version`, så lagre `Main.java` og kjør `java Main.java`. Endre teksten og kjør igjen. Skriv ned om du faktisk fikk programmet til å kjøre.' },
      { id: 'l2', start: '09.30', slutt: '10.30', type: 'kodelab', tittel: 'Variabler, datatyper, input og regning', kort: 25, helg: ['v-forutsi', 'v-spor', '2.2A', '2.2B', '2.2C', 'v-endre', '2.3A', '2.3B'], beskrivelse: 'Forutsi → spor → skriv selv. Opprett variabel, velg datatype, les input med Scanner, regn og skriv ut. Skriv selv – ikke kopier.' },
      pause('l-p1', '10.30', '10.45'),
      { id: 'l3', start: '10.45', slutt: '11.45', type: 'kodelab', tittel: 'Betingelser og løkker', kort: 45, helg: ['if-se', 'if-forutsi', 'if-spor', '2.4A', '2.4B', 'if-rett', '9.2', 'lok-se', 'lok-forutsi', '2.5A', '2.5B', '2.5C'], beskrivelse: 'Pris-/alderskalkulator og løkker som gjentar beregninger. Må kunne: forklare hva som skjer når betingelsen er sann/usann, og hvorfor løkka stopper.' },
      { id: 'l4', start: '11.45', slutt: '12.15', type: 'kodelab', tittel: 'Forutsi utskrift og spor variabler', kort: 0, helg: ['lok-spor', '9.3', '2.8', 'lok-endre', 'lok-overfor', 'if-overfor'], beskrivelse: 'Skriv verdien til variablene etter hver linje. Forutsi nøyaktig utskrift før du kjører. Deretter endre og overfør.' },
      pause('l-p2', '12.15', '13.00', 'Lunsj'),
      { id: 'l5', start: '13.00', slutt: '14.00', type: 'kodelab', tittel: 'Lister/arrayer og løkker', kort: 45, helg: ['lis-se', 'lis-forutsi', 'lis-spor', '2.6A', '2.6B', '2.6C', 'lis-rett', 'lis-endre', '6.5', 'lis-overfor'], beskrivelse: 'Legg til, søk, tell og beregn gjennomsnitt. Må kunne: hente element, bruke løkke og samle et resultat.' },
      pause('l-p3', '14.00', '14.15'),
      { id: 'l6', start: '14.15', slutt: '15.15', type: 'kodelab', tittel: 'Metoder: parameter, returverdi, gjenbruk', kort: 45, helg: ['met-se', 'met-forutsi', 'met-spor', '2.7A', '2.7B', '9.5', 'met-rett', '2.7C', 'met-endre', 'met-overfor', '9.10'], beskrivelse: 'Skriv minst tre metoder selv. Må kunne: forklare parameter, returverdi og hvorfor metoder gir gjenbruk.' },
      pause('l-p4', '15.15', '15.30'),
      { id: 'l7', start: '15.30', slutt: '16.45', type: 'kodelab', tittel: 'OOP fra null: klasse, objekt, konstruktør', kort: 60, helg: ['oop-se', 'oop-forutsi', 'oop-spor', '9.6', 'oop-rett', '3.10', '9.7', 'oop-endre'], beskrivelse: 'Skriv Bok-klassen fra blankt ark, opprett to objekter og kjør metodene. Må kunne: forklare klasse, objekt, attributt, metode og konstruktør, og vise at en metode endrer objektets tilstand.' },
      { id: 'l8', start: '16.45', slutt: '17.15', type: 'kodelab', tittel: 'Feilsøking: rett minst fem feil', kort: 0, helg: ['feil-se', '5A', '5B', '5C', '5D', '9.8'], beskrivelse: 'Ikke bare les feilene – skriv hva som er feil, hvilken feiltype det er og hvordan du retter det.' },
      { id: 'l9', start: '17.15', slutt: '17.45', type: 'kodelab', tittel: 'Muntlig miniprøve: forklar eget program', kort: 15, helg: ['forklar-eget', 'v-forklar', 'oop-komposisjon'], beskrivelse: 'Forklar ditt eget program høyt uten å lese. Noter spørsmål du ikke kan svare på. Ta gjerne fem spørsmål i Muntlig sensor etterpå.' },
    ],
  },
  {
    nr: 2, dato: '2026-11-29', ukedag: 'Søndag', tittel: 'Bygg, test, forklar og simuler eksamen', km: ['KM1', 'KM2', 'KM3', 'KM4', 'KM5', 'KM6', 'KM7', 'KM8', 'KM9', 'KM10', 'KM11'],
    hovedmal: 'Ved dagens slutt kan du løse minst én liten integrert oppgave, forklare koden, rette feil, foreslå alternativer og svare på bredere fagspørsmål.',
    krav: 'Minst én simulering med praktisk del og ukjent tilleggsoppgave. Etter 17:15: ikke introduser store nye temaer – forbered utstyr og sov.',
    blokker: [
      { id: 's1', start: '09.00', slutt: '09.30', type: 'kodelab', tittel: 'Repetisjon uten fasit: skriv fra hukommelsen', kort: 30, helg: ['gjenkalling'], beskrivelse: 'På blankt ark eller i editor: én variabel, én if/else, én for-løkke, én liste, én metode med returverdi og en enkel klasse med konstruktør. Sjekk etterpå – ikke se på fasit mens du skriver.' },
      { id: 's2', start: '09.30', slutt: '10.45', type: 'kodelab', tittel: 'OOP praktisk: to klasser og en liste med objekter', kort: 60, helg: ['oop-arv', 'oop-komposisjon', 'caseA', 'oop-to-klasser', 'uml-se', 'uml-les', '4A', '4B', '4C', '9.11'], beskrivelse: 'CASE A (utlånssystem): modell først, deretter kode. Rekker du ikke alt: lag en fungerende PC-klasse og forklar hvordan Elev/Lån kobles på. Forklar relasjonene.' },
      pause('s-p1', '10.45', '11.00'),
      { id: 's3', start: '11.00', slutt: '12.00', type: 'kodelab', tittel: 'Feilsøking, testing og alternativer', kort: 45, helg: ['feil-type', 'feil-offbyone', 'test-se', '2.4C', '9.9', 'test-kode', 'test-forklar', 'alt-ifswitch', 'lok-alternativ', 'lis-alternativ', 'met-alternativ'], beskrivelse: 'Feilretting, grenseverdier, testtabell og test av alternative input. For hver løsning: ett alternativ med fordel og ulempe.' },
      pause('s-p2', '12.00', '12.45', 'Lunsj'),
      { id: 's4', start: '12.45', slutt: '13.30', type: 'kodelab', tittel: 'Dataøvelse: datasett, CSV og JSON', kort: 30, helg: ['data-se', '9.12', 'caseB', 'data-csv', 'data-forklar'], beskrivelse: 'Les/undersøk et lite datasett, filtrer, tell, beregn og presenter. Forklar CSV/JSON og si hva dataene ikke kan bevise.' },
      { id: 's5', start: '13.30', slutt: '14.00', type: 'kodelab', tittel: 'Bredde: etikk, personvern, sikkerhet, UX, systemutvikling', kort: 30, helg: ['etikk-kamera', 'gdpr', 'sikkerhet', 'brukervennlighet', 'systemutvikling', 'samfunn'], beskrivelse: 'Korte muntlige svar med eksempler. Bruk snakketimeren.' },
      pause('s-p3', '14.00', '14.15'),
      { id: 's6', start: '14.15', slutt: '15.00', type: 'sim', tittel: 'Eksamenssimulering 1', kort: 45, beskrivelse: 'Trekk en ukjent case. 30 min forberedelse med notater som i forberedelsesrommet, deretter minst 15 min sensorsamtale med ukjent tilleggsoppgave. Utvid til 45 min hvis tiden tillater.' },
      pause('s-p4', '15.00', '15.15'),
      { id: 's7', start: '15.15', slutt: '16.00', type: 'svakheter', tittel: 'Reparer de tre svakeste ferdighetene', kort: 0, beskrivelse: 'Kodelab → Kritiske svakheter: appen viser oppgavetypene du feilet på og gir deg en ny variant av samme type.' },
      { id: 's8', start: '16.00', slutt: '16.45', type: 'sim', tittel: 'Eksamenssimulering 2: annet hovedtema', kort: 0, beskrivelse: 'Ny case med et annet hovedtema – vis at du ikke bare kan én oppskrift.' },
      { id: 's9', start: '16.45', slutt: '17.15', type: 'kodelab', tittel: 'Siste sjekk', kort: 0, helg: ['forklar-eget', 'alt-generell', 'test-forklar', 'data-forklar', 'etikk-kamera'], beskrivelse: 'Uten hjelp: forklar et program, variabler/if/løkke/metode, klasse/objekt/konstruktør, én teststrategi og én feiltype, ett alternativ, én dataanalyse og ett personverndilemma.' },
    ],
  },
];

export const EKSAMENSDAG = {
  dato: '2026-11-30',
  tittel: 'Eksamensdag – REA3050',
  sjekkliste: [
    'Sjekk oppmøtested, tidspunkt og informasjonsskriv i Privatistportalen.',
    'Ta med gyldig legitimasjon.',
    'Ta med egne skrivesaker.',
    'Ta med PC/lader dersom du ønsker å bruke PC i forberedelsesrommet og det er tillatt i informasjonsskrivet.',
    'Ikke regn med internettilgang eller teknisk hjelp.',
    'Husk at hjemmeproduserte notater ikke kan tas med inn under eksaminasjonen i Oslo-modellen; bruk papiret som deles ut i forberedelsesrommet.',
    'Ikke lag PowerPoint.',
    'Når du får oppgaven: finn problem, interessenter, nødvendige data, modell, praktisk del, test og mulige forbedringer.',
    'Husk at sensor kan gi en ukjent tilleggsoppgave fra andre kompetansemål.',
    'Regn med lang ventetid (opptil ca. 4,5 timer fra oppmøte til alle er ferdige). Ta med vann og noe å spise.',
  ],
};

export const EKSAMENSDATO = '2026-11-30';
export const FORSTE_DAG = '2026-11-28';
