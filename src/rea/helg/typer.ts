/* Helgesprint 28.–29. november: praktisk ferdighetstrener (Kodelab). */

/** Ferdighetene appen måler «kan» på. Hver ferdighet trenger to grønne oppgaver (kjent + variant). */
export type Ferdighet =
  | 'variabler' | 'if' | 'lokker' | 'lister' | 'metoder' | 'oop' | 'uml' | 'feil' | 'testing' | 'data' | 'alternativ' | 'muntlig';

/** Læringsstigen (masterprompt §5). */
export type Trinn = 'se' | 'forutsi' | 'spor' | 'fullfor' | 'rett' | 'endre' | 'skriv' | 'forklar' | 'alternativ' | 'overfor';

export interface HelgOppgave {
  id: string;
  ferdighet: Ferdighet;
  trinn: Trinn;
  tittel: string;
  /** «Bootcamp 2.4B» = fra helgepraksisfilen. «Egenlaget» = treningsoppgave laget for appen. */
  kilde: string;
  oppgave: string; // markdown
  /** Kode som vises/skal endres (startkode, kode med feil, kode som skal spores). */
  kode?: string;
  hint: [string, string, string];
  /** Løsningsforslag (markdown). Skjult til brukeren ber om det. */
  fasit: string;
  /** Fullt, kjørbart Java-program for løsningsforslaget (verifiseres med `java` i testskriptet). */
  fasitKode?: string;
  /** Input som gis til programmet ved verifisering/egen test (Scanner). */
  testInput?: string;
  /** Forventet utskrift når fasitKode kjøres med testInput. Brukeren limer inn egen utskrift og sammenlignes. */
  utskrift?: string;
  /** Automatisk sjekk av et kort svar (forutsi/spor/rett). Svar normaliseres før sammenligning. */
  svar?: { sporsmal: string; godta: string[] };
  /** Lettvekts strukturkontroll av koden brukeren skriver: [regex, melding hvis den mangler]. */
  krav?: [string, string][];
  /** Egenkontroll som må krysses av når oppgaven ikke kan sjekkes automatisk. */
  sjekk?: string[];
  /** Muntlige spørsmål etter oppgaven (ett om gangen). */
  muntlig: string[];
  /** Oppgaven krever pseudokode/plan før kode (BYGG FRA OPPGAVETEKST). */
  plan?: boolean;
}

export type HelgStatus = 'ikke' | 'rod' | 'gul' | 'gronn';

/** Lagret forsøk på en helgeoppgave. */
export interface HelgForsok {
  kode: string;
  plan?: string;
  utskrift?: string;
  svar?: string;
  hint: number; // høyeste hintnivå brukt (0–3)
  fasitSett: boolean; // fasit vist FØR oppgaven var løst
  lost: boolean;
  kjort: boolean; // brukeren bekrefter at koden faktisk ble kjørt
  sjekket: number[]; // avkryssede egenkontrollpunkter
  muntlig: Record<number, { tekst: string; selv: number }>; // selv: 0 rød, 1 gul, 2 grønn
  forsok: number;
  tid: number;
}
