import type { KmId } from '../typer';

export type BlokkType = 'diagnose' | 'les' | 'muntlig' | 'praktisk' | 'drofting' | 'case' | 'sim' | 'repetisjon' | 'svakheter' | 'feillogg' | 'beredskap' | 'pause' | 'eksamensdag';

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
const feillogg = (id: string, start: string, slutt: string): Blokk => ({
  id, start, slutt, type: 'feillogg', tittel: 'Feillogg og kort repetisjon', kort: 5,
  beskrivelse: 'Skriv ned dagens feil og svakheter i feilloggen (appen har allerede lagt inn automatiske funn). Ta forfalte repetisjonskort.',
});

export const STUDIEDAGER: Studiedag[] = [
  {
    nr: 1, dato: '2026-11-23', ukedag: 'Mandag', tittel: 'Kartlegging, IT-systemer, etikk og personvern', km: ['KM1', 'KM2'],
    hovedmal: 'Forstå hva faget handler om, identifisere kunnskapshull og kunne drøfte IT-konsekvenser.',
    krav: 'Kunne forklare et informasjonssystem med seks komponenter, nevne konkrete konsekvenser av IT og gjennomføre en balansert etisk drøfting.',
    blokker: [
      { id: 'd1-1', start: '17.15', slutt: '17.35', type: 'diagnose', tittel: 'Oppstart og diagnostisk kartlegging', kort: 15, beskrivelse: 'Svar uten hjelp på 12 korte spørsmål fra kapittel 1–15. Skriv ned tre temaer du er usikker på. Maks 20 minutter – poenget er å finne startnivået. (Les gjerne «Eksamen, læreplan og strategi» i Lær etterpå hvis du har tid.)' },
      { id: 'd1-2', start: '17.35', slutt: '18.15', type: 'les', tittel: 'Les kapittel 1 + kapittelkontroll', kort: 15, kapitler: ['k01'], beskrivelse: 'Informasjonsteknologi og informasjonssystemer. Data, informasjon og kunnskap. Muligheter, utfordringer og konsekvenser. Avslutt med kapittelkontrollen (forklar uten å se, oppfølgingsspørsmål, én praktisk oppgave). Kortversjon: les 1.1 og 1.5 og gjør kontrollen.' },
      pause('d1-p1', '18.15', '18.25'),
      { id: 'd1-3', start: '18.25', slutt: '19.10', type: 'les', tittel: 'Les kapittel 2 + kapittelkontroll', kort: 30, kapitler: ['k02'], beskrivelse: 'Etikk, GDPR, personopplysninger. Dataminimering og formålsbegrensning. Kameraovervåking, KI-skjevhet og digitale konsekvenser.' },
      pause('d1-p2', '19.10', '19.20'),
      { id: 'd1-4', start: '19.20', slutt: '20.00', type: 'drofting', tittel: 'Drøftingsøvelse: kameraovervåking', kort: 15, muntlig: ['B4', 'B6'], beskrivelse: 'Gjennomfør kameraovervåkingsoppgaven i kapittel 2 (oppgave 3). Snakk høyt i 3 minutter med snakketimeren. Bruk S-I-K-A-T-modellen.' },
      { id: 'd1-5', start: '20.00', slutt: '20.30', type: 'muntlig', tittel: 'Muntlig kontroll: tema A og B', kort: 10, muntlig: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B5'], beskrivelse: 'Svar på sensorsamtale A og B. Spørsmål du får under nivå 3, kommer automatisk tilbake i repetisjonen.' },
      feillogg('d1-6', '20.30', '20.40'),
    ],
  },
  {
    nr: 2, dato: '2026-11-24', ukedag: 'Tirsdag', tittel: 'Programmeringsforståelse og algoritmer', km: ['KM3', 'KM7'],
    hovedmal: 'Kunne forstå, forklare og lage enkel programlogikk.',
    krav: 'Kunne forklare en enkel algoritme steg for steg, skrive eller tilpasse en enkel funksjon, og forklare minst to designvalg.',
    blokker: [
      { id: 'd2-1', start: '17.15', slutt: '17.30', type: 'repetisjon', tittel: 'Repetisjon fra mandag', kort: 10, muntlig: ['B3', 'A3'], km: ['KM1', 'KM2'], beskrivelse: 'Forklar data/informasjon/kunnskap og dataminimering uten å se. Ta forfalte repetisjonskort.' },
      { id: 'd2-2', start: '17.30', slutt: '18.20', type: 'les', tittel: 'Les kapittel 3 + kapittelkontroll', kort: 30, kapitler: ['k03'], beskrivelse: 'Variabler, datatyper, operatorer. Betingelser, løkker og funksjoner. Lister, dictionary, input/output.' },
      pause('d2-p1', '18.20', '18.30'),
      { id: 'd2-3', start: '18.30', slutt: '19.15', type: 'praktisk', tittel: 'Algoritmer og problemløsing', kort: 15, praktisk: ['D01', 'D02', 'D03', 'D04', 'D05', 'D19', 'P11'], beskrivelse: 'Pseudokode, flytskjema, input–behandling–output, grenseverdier og spesialtilfeller. Spor koden med verditabell på papir.' },
      pause('d2-p2', '19.15', '19.25'),
      { id: 'd2-4', start: '19.25', slutt: '20.10', type: 'les', tittel: 'Les kapittel 6 + kapittelkontroll', kort: 15, kapitler: ['k06'], beskrivelse: 'Krav, modularitet og designvalg. Sammenligning av alternative løsninger. Fordypning: fra brukerbehov til robust design.' },
      { id: 'd2-5', start: '20.10', slutt: '20.40', type: 'praktisk', tittel: 'Praktisk: billettprisfunksjonen', kort: 15, praktisk: ['P09', 'P10'], muntlig: ['PD1', 'PD3'], beskrivelse: 'Lag billettprisfunksjonen. Forklar høyt hvorfor betingelsene står i den rekkefølgen. Lag minst fire tester.' },
      feillogg('d2-6', '20.40', '20.50'),
    ],
  },
  {
    nr: 3, dato: '2026-11-25', ukedag: 'Onsdag', tittel: 'OOP og UML', km: ['KM4', 'KM5'],
    hovedmal: 'Dette er en av de viktigste dagene. Du skal kunne modellere en oppgave og forklare OOP med eksempler.',
    krav: 'Kunne forklare forskjell på klasse og objekt, lage en enkel klasse, forstå arv og komposisjon og beskrive en UML-modell.',
    blokker: [
      { id: 'd3-1', start: '17.15', slutt: '17.30', type: 'repetisjon', tittel: 'Repetisjon: pseudokode uten hjelp', kort: 10, muntlig: ['PD1', 'X12'], km: ['KM3'], beskrivelse: 'Skriv pseudokode for en enkel oppgave uten hjelp (f.eks. finn største tall). Ta forfalte repetisjonskort.' },
      { id: 'd3-2', start: '17.30', slutt: '18.20', type: 'les', tittel: 'Les kapittel 4 + kapittelkontroll', kort: 25, kapitler: ['k04'], beskrivelse: 'Klasse, objekt, attributt, metode, konstruktør. self, innkapsling, tilstand. Arv, overstyring, polymorfisme og komposisjon.' },
      pause('d3-p1', '18.20', '18.30'),
      { id: 'd3-3', start: '18.30', slutt: '19.15', type: 'les', tittel: 'Les kapittel 5 + kapittelkontroll', kort: 20, kapitler: ['k05'], beskrivelse: 'UML-klasser. Relasjoner og multiplisitet. Fra tekstlig oppgave til modell.' },
      pause('d3-p2', '19.15', '19.25'),
      { id: 'd3-4', start: '19.25', slutt: '20.10', type: 'case', tittel: 'Praktisk modellering: CASE 1 eller CASE 4', kort: 20, caser: ['C1', 'C4'], praktisk: ['P01', 'P03', 'P05'], beskrivelse: 'Gjør bibliotek- eller togsettcasen uten tidspress. Tegn klassediagram på papir. Forklar hvorfor du valgte arv eller komposisjon.' },
      { id: 'd3-5', start: '20.10', slutt: '20.45', type: 'muntlig', tittel: 'Muntlig kontroll: tema D', kort: 10, muntlig: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'], beskrivelse: 'Svar på sensorsamtale D. Forklar minst ett klassediagram uten å lese.' },
      feillogg('d3-6', '20.45', '20.55'),
    ],
  },
  {
    nr: 4, dato: '2026-11-26', ukedag: 'Torsdag', tittel: 'Testing, feilsøking og gjenbrukbar kode', km: ['KM6', 'KM7'],
    hovedmal: 'Vise at du kan kontrollere kvalitet og forbedre et program.',
    krav: 'Kunne skille feiltyper, lage relevante testtilfeller, forklare hvorfor testing ikke beviser at programmet er feilfritt, og forklare hvordan kode kan gjenbrukes.',
    blokker: [
      { id: 'd4-1', start: '17.15', slutt: '17.30', type: 'repetisjon', tittel: 'Repetisjon av OOP', kort: 10, muntlig: ['D6', 'D4'], km: ['KM4', 'KM5'], beskrivelse: 'Forklar et eget klassediagram fra onsdag høyt. Ta forfalte repetisjonskort.' },
      { id: 'd4-2', start: '17.30', slutt: '18.15', type: 'les', tittel: 'Les kapittel 7 + kapittelkontroll', kort: 25, kapitler: ['k07'], beskrivelse: 'Feiltyper. Testnivåer. Testteknikker og grenseverdier. Feilsøkingsprosess. Fordypning: testing som planlagt del av utviklingen.' },
      pause('d4-p1', '18.15', '18.25'),
      { id: 'd4-3', start: '18.25', slutt: '19.05', type: 'les', tittel: 'Les kapittel 8 + kapittelkontroll', kort: 20, kapitler: ['k08'], beskrivelse: 'Funksjoner og abstraksjon. Gjenbrukbar kode, DRY, modularitet. Fordypning: kodekvalitet og refaktorering.' },
      pause('d4-p2', '19.05', '19.15'),
      { id: 'd4-4', start: '19.15', slutt: '20.00', type: 'praktisk', tittel: 'Praktisk: finn feil og lag testplan', kort: 20, praktisk: ['D02', 'D08', 'D13', 'D14', 'P13', 'P16', 'P12'], beskrivelse: 'Finn logiske feil i kodeeksempler. Lag en testplan for booking eller utlån. Forklar forventet og faktisk resultat.' },
      { id: 'd4-5', start: '20.00', slutt: '20.30', type: 'muntlig', tittel: 'Muntlig kontroll: tema E og F', kort: 10, muntlig: ['E1', 'E2', 'E3', 'E4', 'E5', 'F1', 'F2', 'F3', 'F4', 'F5'], beskrivelse: 'Svar på sensorsamtale E og F.' },
      feillogg('d4-6', '20.30', '20.40'),
    ],
  },
  {
    nr: 5, dato: '2026-11-27', ukedag: 'Fredag', tittel: 'Data, sikkerhet og lagring/utveksling', km: ['KM10', 'KM11'],
    hovedmal: 'Kunne forklare hvordan data struktureres, behandles, lagres og sikres.',
    krav: 'Kunne sammenligne CSV og JSON, forklare primærnøkkel/fremmednøkkel, beskrive enkel dataanalyse, og skille kryptering fra hashing.',
    blokker: [
      { id: 'd5-1', start: '17.15', slutt: '17.30', type: 'repetisjon', tittel: 'Repetisjon: testnivåer og grenseverdier', kort: 10, muntlig: ['E2', 'E4'], km: ['KM6'], beskrivelse: 'Forklar testnivåene og hva en grenseverdi er, uten å se. Ta forfalte repetisjonskort.' },
      { id: 'd5-2', start: '17.30', slutt: '18.10', type: 'les', tittel: 'Les kapittel 11 og 12', kort: 20, kapitler: ['k11', 'k12'], beskrivelse: 'CSV, JSON, XML, tegnkoding. Databaser, primærnøkkel, fremmednøkkel, SQL, relasjoner.' },
      pause('d5-p1', '18.10', '18.20'),
      { id: 'd5-3', start: '18.20', slutt: '19.00', type: 'les', tittel: 'Les kapittel 13 og 14', kort: 20, kapitler: ['k13', 'k14'], beskrivelse: 'Datasett, datakvalitet, statistikk, diagrammer. API, HTTP, klient/server.' },
      pause('d5-p2', '19.00', '19.10'),
      { id: 'd5-4', start: '19.10', slutt: '19.50', type: 'les', tittel: 'Les kapittel 15', kort: 15, kapitler: ['k15'], beskrivelse: 'CIA-triaden. Autentisering/autorisasjon. Kryptering/hashing. Backup, trusler og tiltak.' },
      { id: 'd5-5', start: '19.50', slutt: '20.30', type: 'case', tittel: 'Praktisk og muntlig: CASE 2 eller CASE 6', kort: 20, caser: ['C2', 'C6'], muntlig: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'], praktisk: ['P17', 'P18', 'P21', 'P23'], beskrivelse: 'Gjør idrettsdata- eller værdatacasen. Forklar datakvalitet og sikkerhet. Svar på tema H.' },
      feillogg('d5-6', '20.30', '20.40'),
    ],
  },
  {
    nr: 6, dato: '2026-11-28', ukedag: 'Lørdag', tittel: 'Brukervennlighet, systemutvikling og stor praktisk case', km: ['KM8', 'KM9'],
    hovedmal: 'Knytte tekniske løsninger til brukerbehov og utviklingsprosess.',
    krav: 'Kunne forklare hvordan brukerbehov påvirker design, vise hvordan en løsning kan testes med brukere, og forklare minst én systemutviklingsmetode og ett samarbeidsverktøy.',
    blokker: [
      { id: 'd6-1', start: '10.00', slutt: '10.45', type: 'les', tittel: 'Les kapittel 9 + kapittelkontroll', kort: 20, kapitler: ['k09'], beskrivelse: 'Brukervennlighet, UX, universell utforming og brukertesting.' },
      pause('d6-p1', '10.45', '11.00'),
      { id: 'd6-2', start: '11.00', slutt: '11.45', type: 'les', tittel: 'Les kapittel 10 + kapittelkontroll', kort: 20, kapitler: ['k10'], beskrivelse: 'Fossefall, smidig, Scrum, Git, samarbeid og dokumentasjon.' },
      { id: 'd6-3', start: '11.45', slutt: '12.15', type: 'muntlig', tittel: 'Aktiv gjenkalling: dagens temaer', kort: 10, muntlig: ['G1', 'G2', 'G3', 'G4', 'G5', 'X6', 'X7'], beskrivelse: 'Forklar dagens temaer uten å se i teksten.' },
      pause('d6-p2', '12.15', '13.00', 'Pause / lunsj'),
      { id: 'd6-4', start: '14.15', slutt: '15.00', type: 'les', tittel: 'Les kapittel 16: muntlig faglig formidling', kort: 0, kapitler: ['k16'], beskrivelse: 'Tillegg i appen: slik viser du kompetanse muntlig, forklarer kode og håndterer spørsmål du ikke kan. Leses før den store casen.' },
      { id: 'd6-5', start: '15.00', slutt: '16.00', type: 'case', tittel: 'Full praktisk case', kort: 25, caser: ['C1', 'C4', 'C5', 'C7'], beskrivelse: 'Velg en av CASE 1, 4, 5 eller 7. Bruk 45–60 minutter på modell, funksjon, test og begrunnelse.' },
      pause('d6-p3', '16.00', '16.15'),
      { id: 'd6-6', start: '16.15', slutt: '17.00', type: 'muntlig', tittel: 'Sensorøvelse: minst 12 oppfølgingsspørsmål', kort: 10, km: ['KM4', 'KM5', 'KM6', 'KM8', 'KM9', 'KM10'], beskrivelse: 'Gjennomfør minst 12 oppfølgingsspørsmål blandet fra alle mål. Registrer alle spørsmål du ikke kan svare på.' },
      feillogg('d6-7', '17.00', '17.10'),
    ],
  },
  {
    nr: 7, dato: '2026-11-29', ukedag: 'Søndag', tittel: 'Full eksamenssimulering og sikkerhetsmargin', km: [],
    hovedmal: 'Teste om du kan prestere under realistiske forhold og rette de siste alvorlige hullene.',
    krav: 'To hele simuleringer. Ikke godkjenn eksamensklar-status hvis du ikke klarer å forklare og anvende stoffet på tvers av minst to ulike caser.',
    blokker: [
      { id: 'd7-1', start: '10.00', slutt: '11.15', type: 'sim', tittel: 'Simulering 1: forberedelse + eksaminasjon', kort: 75, beskrivelse: 'Trekk tilfeldig en case. 30 minutter forberedelse uten modellsvar, korte notater som på eksamen. Deretter 45 minutter: forklar løsningen, besvar oppfølgingsspørsmål og en ukjent tilleggsoppgave fra et annet mål.' },
      { id: 'd7-2', start: '11.15', slutt: '11.45', type: 'feillogg', tittel: 'Vurdering: marker de tre største hullene', kort: 10, beskrivelse: 'Bruk rubrikken i simulatoren. Skriv de tre største hullene i feilloggen.' },
      pause('d7-p1', '11.45', '12.15'),
      { id: 'd7-3', start: '12.15', slutt: '13.00', type: 'svakheter', tittel: 'Reparer svakheter', kort: 0, beskrivelse: 'Appen setter sammen en økt fra svakhetene dine: les bare de relevante delkapitlene og løs en ny oppgave på samme område.' },
      { id: 'd7-4', start: '15.00', slutt: '16.15', type: 'sim', tittel: 'Simulering 2: ny case fra et annet fagområde', kort: 0, beskrivelse: 'Trekk en ny case fra et annet fagområde. 30 minutter, ingen fasit. Praktisk demonstrasjon, fagsamtale og ukjent tilleggsoppgave.' },
      { id: 'd7-5', start: '16.15', slutt: '17.00', type: 'beredskap', tittel: 'Siste beredskapskontroll', kort: 5, beskrivelse: 'Forklar alle 11 kompetansemål med én setning hver. Forklar klasse/objekt/arv/komposisjon. Lag en enkel testplan. Drøft et personverndilemma. Forklar CSV/JSON og grunnleggende sikkerhet.' },
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
export const FORSTE_DAG = '2026-11-23';
