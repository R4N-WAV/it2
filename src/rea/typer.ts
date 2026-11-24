/* Typer for REA3050-trenerens innhold og fremdrift. */

export type KmId = 'KM1' | 'KM2' | 'KM3' | 'KM4' | 'KM5' | 'KM6' | 'KM7' | 'KM8' | 'KM9' | 'KM10' | 'KM11';
export type Niva = 1 | 2 | 3; // 1 grunnleggende, 2 middels, 3 utfordrende

/** De sju rubrikkdimensjonene (masterprompt §9). */
export type DimId = 'korrekt' | 'begreper' | 'hvorfor' | 'eksempel' | 'alternativ' | 'overforing' | 'praktisk';

/** [spørsmål, kort svarretning] */
export type Oppfolging = [string, string];

export interface MuntligSpm {
  id: string;
  km: KmId[];
  kap: number; // kapittel i fagstoffpakken
  niva: Niva;
  type: 'definisjon' | 'forklaring' | 'drofting' | 'demonstrasjon';
  sporsmal: string;
  hint: string;
  /** Sentrale fagbegreper. «a|b» betyr at a eller b godtas. Brukes til automatisk begrepssjekk. */
  begreper: string[];
  momenter: string[]; // vurderingsmomenter
  oppfolging: Oppfolging[];
  svar: string; // eksempel på svar på nivå 4
  kilde: string;
}

export type PraktiskKategori = 'uml' | 'kode' | 'les-kode' | 'feilsok' | 'testplan' | 'data' | 'ui' | 'format' | 'modell' | 'system';

export interface PraktiskOppgave {
  id: string;
  km: KmId[];
  niva: Niva;
  kategori: PraktiskKategori;
  tittel: string;
  oppgave: string; // markdown
  start?: string; // startkode / mal
  /** Automatisk sjekk (f.eks. «hva skrives ut?»). Svarene normaliseres før sammenligning. */
  fasit?: { sporsmal: string; godta: string[] };
  begreper: string[];
  momenter: string[];
  oppfolging: Oppfolging[];
  losning: string; // markdown
}

export interface EksamensCase {
  id: string;
  nr: number;
  tittel: string;
  km: KmId[];
  innledning: string; // markdown
  duSkal: string[];
  praktisk: string; // det praktiske innslaget
  sensor: string[]; // oppfølgingsspørsmål
  begreper: string[];
  momenter: string[];
  losning: string; // løsningsskisse (markdown)
  kjennetegn: string;
}

export interface Tilleggsoppgave {
  id: string;
  km: KmId[];
  niva: Niva;
  sporsmal: string;
  begreper: string[];
  momenter: string[];
  oppfolging: Oppfolging[];
  svar: string;
  kilde: string;
}

export interface Drofting {
  id: string;
  km: KmId[];
  niva: Niva;
  sporsmal: string;
  interessenter: string[];
  begreper: string[];
  momenter: string[];
  oppfolging: Oppfolging[];
  svar: string;
}

export interface Diagnosespm {
  id: string;
  km: KmId;
  kap: number;
  sporsmal: string;
  kode?: string;
  alternativer: string[];
  riktig: number;
  forklaring: string;
}

/* ---------- Fremdrift ---------- */

export type Kilde = 'muntlig' | 'praktisk' | 'feilsok' | 'drofting' | 'kapittel' | 'case' | 'tillegg' | 'oppgave';

/** Én vurdert prestasjon etter rubrikken. score = snitt av vurderte dimensjoner (0–4). */
export interface Vurdering {
  id: string;
  kilde: Kilde;
  ref: string; // id på oppgaven/spørsmålet/kapittelet
  km: KmId[];
  dim: Partial<Record<DimId, number>>;
  score: number;
  hint: boolean; // fikk hint før endelig svar
  dekning: number | null; // andel sentrale begreper nevnt (0–1)
  dato: string; // YYYY-MM-DD
  tid: number;
  svar?: string;
  simId?: string;
}

export interface RepState {
  boks: number; // 1–5
  forfaller: number; // ms
  sett: number;
  siste: number; // siste score 0–4
}

export interface Feil {
  id: string;
  tid: number;
  km: KmId[];
  tekst: string;
  auto: boolean;
  lost: boolean;
  endret?: number; // sist status ble endret (for synkronisering)
}

export interface SimResultat {
  id: string;
  caseId: string;
  tilleggId: string;
  start: number;
  slutt: number;
  forberedelseMin: number;
  startform: 'forklaring' | 'samtale';
  hoved: number; // snitt hovedcase (0–4)
  tillegg: number; // snitt tilleggsoppgave (0–4)
  sammenhengende: boolean; // snakket sammenhengende uten å lese
  snakkeSek: number; // målt tid på startforklaring
  dim: Partial<Record<DimId, number>>;
  tilleggDim: Partial<Record<DimId, number>>;
  forbedring: string[];
}

export type SimFase = 'oppstart' | 'forberedelse' | 'start' | 'samtale' | 'tillegg' | 'vurdering' | 'ferdig';

export interface AktivSim {
  id: string;
  caseId: string;
  tilleggId: string;
  fase: SimFase;
  startform: 'forklaring' | 'samtale';
  forberedelseMin: number;
  forberedelseStart: number | null;
  eksaminasjonStart: number | null;
  notater: string;
  startSvar: string;
  snakkeSek: number;
  sensorIndeks: number;
  sensorSvar: string[];
  tilleggSvar: string;
}

export interface AppData {
  versjon: 2;
  lest: Record<string, number>; // seksjon-id -> tidspunkt markert som lest
  forklart: Record<string, { tekst: string; dekning: number; tid: number }>; // teach-back per delkapittel
  oppgaver: Record<string, { tekst: string; vist: boolean; tid: number }>; // forsøk på leksjonsoppgaver
  vurderinger: Vurdering[];
  rep: Record<string, RepState>; // muntlige spørsmål + kontrollspørsmål
  sims: SimResultat[];
  aktivSim: AktivSim | null;
  feillogg: Feil[];
  plan: Record<string, string[]>; // dato -> fullførte blokk-id-er
  kortversjon: Record<string, boolean>; // dato -> bruker 90-minutters kortversjon
  diagnose: { tid: number; svar: Record<string, boolean>; usikker: string } | null;
  aktivitet: string[]; // datoer med aktivitet
  /* Synkronisering mellom enheter */
  slettet?: Record<string, number>; // «gravsteiner»: 'lest:id', 'plan:dato:id', 'feil:id' -> tidspunkt fjernet
  planTid?: Record<string, number>; // 'dato:id' -> tidspunkt blokken ble krysset av
  nullstilt?: number; // tidspunkt for siste nullstilling (nyeste nullstilling vinner på alle enheter)
}
