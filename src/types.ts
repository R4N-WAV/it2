export type Exam = 'skriftlig' | 'muntlig' | 'begge';
export type Level = 1 | 2 | 3; // 1 = lett, 2 = middels, 3 = vanskelig

export type TopicId =
  | 'grunnlag'
  | 'funksjoner'
  | 'lister'
  | 'algoritmer'
  | 'oop-klasser'
  | 'oop-arv'
  | 'oop-komposisjon'
  | 'uml'
  | 'feilsoking'
  | 'data'
  | 'lagring'
  | 'spill'
  | 'etikk'
  | 'systemutvikling';

export interface Topic {
  id: TopicId;
  navn: string;
  km: string; // kompetansemål, f.eks. "KM5" (Udirs nummerering 1–11)
  prioritet: 1 | 2 | 3; // 1 = må kunne for å bestå
  eksamen: Exam;
  kort: string; // én setning om hva du må kunne
}

interface Meta {
  id: string;
  tema: TopicId;
  km: string;
  eksamen: Exam;
  niva: Level;
  forklaring: string; // hvorfor svaret er riktig
  vanligeFeil?: string;
}

export interface Flashcard extends Meta {
  sporsmal: string;
  svar: string;
  eksempel?: string; // kode eller konkret eksempel
}

export type QuizItem =
  | (Meta & {
      type: 'flervalg';
      sporsmal: string;
      kode?: string;
      alternativer: string[];
      riktig: number;
    })
  | (Meta & {
      type: 'kortsvar'; // skriv kort svar, sjekkes mot akseptable svar
      sporsmal: string;
      kode?: string;
      aksepter: string[]; // normaliserte svar som godtas
      fasit: string;
    })
  | (Meta & {
      type: 'sorter'; // sorter linjer i riktig rekkefølge
      sporsmal: string;
      linjer: string[]; // i RIKTIG rekkefølge — stokkes i UI
    })
  | (Meta & {
      type: 'selvvurdert'; // skriv svar/kode, sammenlign med løsningsforslag
      sporsmal: string;
      kode?: string;
      losning: string;
      sjekkliste: string[];
    });

export interface ExamTask {
  id: string;
  eksamen: 'skriftlig' | 'muntlig';
  tittel: string;
  tema: TopicId[];
  minutter: number;
  oppgave: string; // markdown-lignende tekst
  kode?: string;
  losning: string;
  godtSvarInneholder: string[];
  niva: Level;
  kilde: string; // hvilken eksamenstype oppgaven bygger på
}

/** Full simulering av muntlig-praktisk eksamen (REA3050) */
export interface OralSim {
  id: string;
  tittel: string;
  km: string[];
  oppgave: string;
  praktisk: string; // hva som skal demonstreres
  losningsskisse: string;
  tilleggsoppgave: { km: string; sporsmal: string; momenter: string[] };
  oppfolging: string[]; // sensors oppfølgingsspørsmål
}

export interface OralQuestion {
  id: string;
  tema: TopicId;
  sporsmal: string;
  godtSvar: string;
  begreper: string[];
  sensorVilHore: string[];
  svaktVsGodt: { svakt: string; nivaa34: string };
}

export type Rating = 0 | 1 | 2; // 0 kunne ikke, 1 usikker, 2 kunne

export interface CardState {
  box: number; // 0 = ny, 1–5
  due: number; // ms timestamp
  sett: number;
  siste: Rating | null;
}

export interface QuizState {
  forsok: number;
  riktige: number;
  sisteRiktig: boolean | null;
  sisteTid: number;
}

export interface ExamAttempt {
  taskId: string;
  tid: number;
  svar: string;
  egenScore: number; // 0–100 % av sjekklisten
}

/** Fremdrift for én studiedag. En «runde» er ett gjennomløp av dagens steg. */
export interface DagState {
  runde: number;
  fullfort: string[]; // steg-id-er fullført i denne runden
  bekreftet: boolean; // du har bekreftet at du forstår dagen
  testSiste: number | null; // dagstest i denne runden (0–1)
  testBest: number | null; // beste dagstest i denne runden
  eksamen: Record<string, number>; // taskId -> egenvurdering (0–100) i denne runden
  historikk: { runde: number; test: number | null; tid: number }[];
}

/** Hvor langt du har kommet i én leksjon. */
export interface LesState {
  side: number; // siste side du var på (0-basert)
  ferdig: number | null; // tidspunkt leksjonen ble lest ferdig
}

export interface AppData {
  versjon: 1;
  leksjoner: Record<string, LesState>; // leksjon-id -> lesefremdrift
  dager: Record<string, DagState>;
  matchBest: Record<string, number>; // sett -> beste tid i ms
  aktivitet: string[]; // datoer (YYYY-MM-DD) med øving – for streak
  kort: Record<string, CardState>;
  quiz: Record<string, QuizState>;
  eksamen: ExamAttempt[];
  muntlig: Record<string, Rating>;
  diagnose: Record<string, boolean> | null;
  studielogg: Record<string, boolean>; // dato -> fullført
}
