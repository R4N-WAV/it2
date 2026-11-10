import type { TopicId } from '../types';

export type StegType = 'les' | 'diagnose' | 'sjekk' | 'kort' | 'repetisjon' | 'oppgaver' | 'svakheter' | 'eksamen' | 'muntlig-spm' | 'muntlig-sim' | 'match' | 'dagstest';

export interface Steg {
  id: string;
  type: StegType;
  tittel: string;
  minutter: number;
  valgfri?: boolean; // del av optimal plan, ikke minimum
  temaer?: TopicId[];
  taskId?: string;
  simId?: string;
  ids?: string[];
  krav?: number; // dagstest: andel riktige som kreves (0–1)
  antall?: number;
  instruks?: string[];
}

export interface PlanDay {
  dato: string; // YYYY-MM-DD
  dagNr: number;
  ukedag: string;
  tittel: string;
  tid: string;
  minimum: boolean;
  type: 'okt' | 'buffer' | 'avslutning';
  mal: string; // læringsmål
  maal: string[]; // mestringsmål: hva du skal klare før du bekrefter dagen
  temaer: TopicId[];
  steg: Steg[];
  repeter: string;
}

const JAVA_OPPSETT = [
  'Installer en JDK (Java 21 eller nyere), f.eks. fra adoptium.net (Temurin).',
  'Installer en editor: VS Code med «Extension Pack for Java», eller IntelliJ IDEA Community.',
  'Lag filen Main.java med Hei-programmet fra første flashcard, og kjør det.',
  'Sjekk at æ, ø og å vises riktig i utskriften.',
  'Gjør dette på PC-en du skal bruke på eksamen.',
];

export const plan: PlanDay[] = [
  {
    dato: '2026-11-09', dagNr: 1, ukedag: 'Mandag', tittel: 'Grunnlaget i Java', tid: '17:00–19:00 (ca. 2 t med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne spore en løkke og forklare en betingelse – i pseudokode og Java.',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten (5 av 6)', 'Kunne forklare høyt hvorfor 7 / 2 blir 3 i Java'],
    temaer: ['grunnlag', 'lister'],
    steg: [
      { id: 'les', type: 'les', tittel: 'Les: fra null til din første kode', minutter: 55 },
      { id: 'diag', type: 'diagnose', tittel: 'Diagnostisk test (se hva som satt)', minutter: 15 },
      { id: 'java', type: 'sjekk', tittel: 'Få Java til å kjøre på PC-en', minutter: 15, instruks: JAVA_OPPSETT },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: variabler, if og løkker', minutter: 15, temaer: ['grunnlag'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: forutsi utskriften', minutter: 15, temaer: ['grunnlag', 'lister'] },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 8, ids: ['q-g2', 'q-g4', 'q-g5', 'q-g6', 'q-l2', 'q-l3'], krav: 0.8 },
      { id: 'kort2', type: 'kort', tittel: 'Ekstra: lær kortene om samlinger', minutter: 10, temaer: ['lister'], valgfri: true },
    ],
    repeter: 'Alt du svarte feil på i diagnosen – det havner automatisk i «Svakheter».',
  },
  {
    dato: '2026-11-10', dagNr: 2, ukedag: 'Tirsdag', tittel: 'Pseudokode og flytskjema', tid: '17:00–18:55 (ca. 2 t med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne spore, sortere og skrive enkel pseudokode, og tolke flytskjema (med i 7 av 7 eksamener).',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Minst 60 % på eksamensoppgaven «billettpris»', 'Kunne skrive TrommeLom-pseudokoden uten hjelp'],
    temaer: ['algoritmer', 'funksjoner'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter kort fra i går', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: metoder, pseudokode og flytskjema', minutter: 45 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: pseudokode og algoritmer', minutter: 15, temaer: ['algoritmer'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: sporing, sortering og TrommeLom', minutter: 20, temaer: ['algoritmer'] },
      { id: 'eks', type: 'eksamen', tittel: 'Eksamensoppgave: billettpris', minutter: 15, taskId: 'x-pseudo' },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 8, ids: ['q-a3', 'q-a4', 'q-a6', 'q-a7', 'q-a10', 'q-f1'], krav: 0.8 },
      { id: 'kort2', type: 'kort', tittel: 'Ekstra: kortene om metoder', minutter: 10, temaer: ['funksjoner'], valgfri: true },
      { id: 'eks2', type: 'eksamen', tittel: 'Ekstra: palindrom og nest største', minutter: 25, taskId: 'x-algoritme', valgfri: true },
    ],
    repeter: 'Sporingstabell for løkker, og MOD/%.',
  },
  {
    dato: '2026-11-11', dagNr: 3, ukedag: 'Onsdag', tittel: 'Klasser og objekter', tid: '17:00–18:50 (ca. 1 t 50 min med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne forklare klasse, objekt, felt, metode og konstruktør, og lage en enkel klasse i Java.',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Ha skrevet og kjørt Batteri-klassen i editoren', 'Kunne forklare høyt hva this og konstruktøren gjør'],
    temaer: ['oop-klasser', 'uml'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: klasser, objekter og UML', minutter: 35 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: klasser og UML', minutter: 15, temaer: ['oop-klasser', 'uml'] },
      { id: 'match', type: 'match', tittel: 'Match: OOP-begreper', minutter: 5, temaer: ['oop-klasser', 'uml', 'oop-arv'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: Hund, Konto, Batteri, Kalkulator', minutter: 25, temaer: ['oop-klasser', 'uml'] },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 8, ids: ['q-o1', 'q-o2', 'q-o3', 'q-o4', 'q-o5', 'q-u1'], krav: 0.8 },
    ],
    repeter: 'Konstruktør og this – det MÅ sitte før arv i morgen.',
  },
  {
    dato: '2026-11-12', dagNr: 4, ukedag: 'Torsdag', tittel: 'Arv og komposisjon', tid: '17:00–18:55 (ca. 2 t med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne bruke arv (extends, super), komposisjon (ArrayList av objekter) og lese klassediagram.',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Minst 60 % på «Konstruktører og arv»', 'Kunne forklare er-en vs har-en med et eget eksempel'],
    temaer: ['oop-arv', 'oop-komposisjon', 'uml'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: arv, komposisjon og testing', minutter: 40 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: arv og relasjoner', minutter: 15, temaer: ['oop-arv', 'oop-komposisjon'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: arv, relasjoner og UML', minutter: 20, temaer: ['oop-arv', 'oop-komposisjon', 'uml'] },
      { id: 'eks', type: 'eksamen', tittel: 'Eksamensoppgave: konstruktører og arv', minutter: 15, taskId: 'x-konstruktor' },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 10, ids: ['q-r1', 'q-r2', 'q-r4', 'q-r5', 'q-r6', 'q-k1', 'q-k2', 'q-k3'], krav: 0.8 },
      { id: 'feil', type: 'oppgaver', tittel: 'Ekstra: feilsøking', minutter: 15, temaer: ['feilsoking'], valgfri: true },
    ],
    repeter: 'super(...) først i konstruktøren, og hvilken vei UML-trekanten peker.',
  },
  {
    dato: '2026-11-13', dagNr: 5, ukedag: 'Fredag', tittel: 'Buffer og hvile', tid: 'Fri – eller maks 20 min', minimum: false, type: 'buffer',
    mal: 'Hvile. Mistet du en dag tidligere i uka, tar du den igjen nå.',
    maal: [],
    temaer: [],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort (gjerne på mobilen)', minutter: 15, valgfri: true },
      { id: 'les-igjen', type: 'sjekk', tittel: 'Ta igjen uleste leksjoner', minutter: 20, valgfri: true, instruks: [
        'Åpne «Lær» og se om noen leksjoner fra dag 1–4 mangler hake.',
        'Les dem nå – dag 6 og 7 bygger på klasser, lister og løkker.',
        'Har du lest alt: bruk «Les alt» på den leksjonen du synes var vanskeligst.',
      ] },
      { id: 'match', type: 'match', tittel: 'Match: blandede begreper', minutter: 5, valgfri: true },
    ],
    repeter: '–',
  },
  {
    dato: '2026-11-14', dagNr: 6, ukedag: 'Lørdag', tittel: 'Datasett og etikk', tid: '3 × 70 min med pauser (ca. 3,5 t med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne lese CSV, filtrere, gruppere og regne prosent, og skrive en strukturert etisk drøfting.',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Minst 60 % på «elbilandel» og «kameraovervåking»', 'Kunne skrive CSV-løkken og drøftingsmalen fra hukommelsen'],
    temaer: ['data', 'lagring', 'etikk'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: datasett, lagring, etikk og personvern', minutter: 60 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: datasett og lagring', minutter: 15, temaer: ['data', 'lagring'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: datasett og lagring', minutter: 20, temaer: ['data', 'lagring'] },
      { id: 'eks', type: 'eksamen', tittel: 'Eksamensoppgave: elbilandel (CSV)', minutter: 40, taskId: 'x-csv' },
      { id: 'kort-etikk', type: 'kort', tittel: 'Lær kortene: etikk og personvern', minutter: 15, temaer: ['etikk'] },
      { id: 'eks-etikk', type: 'eksamen', tittel: 'Eksamensoppgave: kameraovervåking', minutter: 25, taskId: 'x-kamera' },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 10, ids: ['q-d1', 'q-d2', 'q-d3', 'q-d4', 'q-s1', 'q-s3', 'q-p1', 'q-p2'], krav: 0.8 },
      { id: 'eks3', type: 'eksamen', tittel: 'Ekstra: friluftsdata (manglende verdier)', minutter: 30, taskId: 'x-friluft', valgfri: true },
      { id: 'eks4', type: 'eksamen', tittel: 'Ekstra: velferdsteknologi', minutter: 20, taskId: 'x-velferd', valgfri: true },
    ],
    repeter: 'int-divisjon i prosentregning, og konklusjon i drøftinger.',
  },
  {
    dato: '2026-11-15', dagNr: 7, ukedag: 'Søndag', tittel: 'Spill, simulering og stor OOP', tid: '2 × 80 min med pause (ca. 3 t med lesing)', minimum: true, type: 'okt',
    mal: 'Kunne bygge et lite spill/en simulering trinnvis, og løse en stor OOP-oppgave på tid.',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Minst 60 % på «togsett» og «skogbrann»', 'Kunne forklare hvorfor man bruker et nytt rutenett for neste tilstand'],
    temaer: ['spill', 'oop-komposisjon', 'feilsoking'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: spill og simulering', minutter: 20 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: spill og simulering', minutter: 15, temaer: ['spill'] },
      { id: 'ovelse', type: 'oppgaver', tittel: 'Øv: spill og simulering', minutter: 15, temaer: ['spill'] },
      { id: 'eks', type: 'eksamen', tittel: 'Eksamensoppgave: skogbrann', minutter: 40, taskId: 'x-skogbrann' },
      { id: 'eks2', type: 'eksamen', tittel: 'Eksamensoppgave: togsett', minutter: 45, taskId: 'x-togsett' },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 10, ids: ['q-sp1', 'q-sp2', 'q-sp3', 'q-sp4', 'q-e1', 'q-e3', 'q-e4'], krav: 0.8 },
      { id: 'eks3', type: 'eksamen', tittel: 'Ekstra: samle mynter (spill)', minutter: 45, taskId: 'x-spill', valgfri: true },
    ],
    repeter: 'Spill-løkken (tegn → input → oppdater → kollisjon) og kantsjekk.',
  },
  {
    dato: '2026-11-16', dagNr: 8, ukedag: 'Mandag', tittel: 'Muntlig-praktisk trening', tid: '17:00–18:45 (ca. 1 t 45 min med lesing)', minimum: false, type: 'okt',
    mal: 'Kunne forklare egen kode muntlig, svare på oppfølgingsspørsmål og håndtere en ukjent tilleggsoppgave (REA3050).',
    maal: ['Alle dagens flashcards riktig minst én gang', 'Minst 80 % på dagstesten', 'Én full simulering vurdert som «Delvis» eller bedre', 'Kunne forklare polymorfi på 2 minutter'],
    temaer: ['systemutvikling', 'oop-arv', 'lagring'],
    steg: [
      { id: 'rep', type: 'repetisjon', tittel: 'Repeter forfalte kort', minutter: 5 },
      { id: 'les', type: 'les', tittel: 'Les: systemutvikling og brukervennlighet', minutter: 25 },
      { id: 'kort', type: 'kort', tittel: 'Lær kortene: systemutvikling og brukervennlighet', minutter: 10, temaer: ['systemutvikling'] },
      { id: 'spm', type: 'muntlig-spm', tittel: 'Sensorspørsmål – svar høyt', minutter: 15, antall: 5 },
      { id: 'sim', type: 'muntlig-sim', tittel: 'Full simulering: kinobillettsystem', minutter: 45, simId: 'sim-kino' },
      { id: 'test', type: 'dagstest', tittel: 'Dagstest', minutter: 8, ids: ['q-v1', 'q-v2', 'q-p3', 'q-p5', 'q-s2', 'q-s4'], krav: 0.8 },
      { id: 'sim2', type: 'muntlig-sim', tittel: 'Ekstra: simulering treningslogg', minutter: 45, simId: 'sim-trening', valgfri: true },
    ],
    repeter: 'Sensorspørsmål du vurderte som «svakt».',
  },
  {
    dato: '2026-11-17', dagNr: 9, ukedag: 'Tirsdag', tittel: 'Avslutning og beredskap', tid: '17:00–18:45 (ca. 1 t 45 min)', minimum: true, type: 'avslutning',
    mal: 'Avsluttende repetisjon og ærlig vurdering av eksamensberedskap. Ingen nye store temaer.',
    maal: ['Minst 70 % på den blandede sluttesten', 'Ingen forfalte flashcards igjen', 'Praktisk sjekkliste for eksamensdagen gjennomgått'],
    temaer: [],
    steg: [
      { id: 'les', type: 'les', tittel: 'Les: eksamensteknikk', minutter: 15 },
      { id: 'svak', type: 'svakheter', tittel: 'Svakhetsøkt', minutter: 20 },
      { id: 'rep', type: 'repetisjon', tittel: 'Alle forfalte kort', minutter: 15 },
      { id: 'eks', type: 'eksamen', tittel: 'Eksamensoppgave: bibliotek (på tid)', minutter: 35, taskId: 'x-bibliotek' },
      { id: 'test', type: 'dagstest', tittel: 'Blandet sluttest', minutter: 15, ids: ['q-g4', 'q-a7', 'q-a8', 'q-o3', 'q-r2', 'q-k1', 'q-u2', 'q-e2', 'q-d6', 'q-p4'], krav: 0.7 },
      { id: 'sjekk', type: 'sjekk', tittel: 'Sjekkliste før eksamensdagen', minutter: 10, instruks: [
        'Sjekk hjelpemiddelreglene for REA3049-DIV i eksamensinformasjonen din.',
        'Java og editor virker på PC-en, og du vet hvordan du åpner vedlagte filer.',
        'Lader, legitimasjon og innlogging er klart.',
        'Eksamen starter 09:00 (5 timer). Kommer du etter 10:00, får du ikke gjennomføre.',
        'Ikke skriv navnet ditt i besvarelsen. Oppgi kilder du bruker.',
        'Sjekk dato og informasjonsskriv for REA3050 i Privatistportalen.',
        'Legg deg i god tid.',
      ] },
    ],
    repeter: '–',
  },
];

/** Hvis du mister en dag: gjør disse temaene først (rangert etter betydning for å bestå). */
export const prioritetsrekkefolge: { tema: string; hvorfor: string }[] = [
  { tema: '1. Pseudokode og sporing av løkker', hvorfor: 'Med i 7 av 7 sett, og grunnlaget for all annen kode.' },
  { tema: '2. Klasser, konstruktør, arv, komposisjon', hvorfor: 'OOP/UML i 6 av 7 sett, implementering fra klassediagram i de fem nyeste. Viktigst muntlig.' },
  { tema: '3. Datasett (CSV, gruppering, prosent)', hvorfor: '7 av 7 sett, og følger faste mønstre.' },
  { tema: '4. Etisk drøfting', hvorfor: '7 av 7 sett. Raskt å lære: én mal + 6–8 fagbegreper.' },
  { tema: '5. Spill/simulering – grunnmønstrene', hvorfor: '7 av 7 sett. Mål: levere en fungerende del-løsning, ikke en perfekt.' },
  { tema: '6. Feilsøking og testplan', hvorfor: 'Øves også når du løser de andre oppgavene.' },
  { tema: '7. Flytskjema', hvorfor: '4 av 7 sett – få symboler å lære.' },
  { tema: '8. Lagring/sikring, brukervennlighet, systemutvikling', hvorfor: 'Mest aktuelt i muntlig og i tilleggsoppgaven der.' },
];

/** Kompetansemål → øvelser i appen → eksamenstyper (matrise) */
export const kmMatrise: { km: string; ovelser: string; eksamenstyper: string }[] = [
  { km: 'KM1', ovelser: 'Etikk-kort (konsekvenser, risikovurdering), drøftingsoppgaver', eksamenstyper: 'IoT-risiko H23, finanssektor H23' },
  { km: 'KM2', ovelser: 'Etikk-kort, q-p1–p5, «Kameraovervåking», «Velferdsteknologi»', eksamenstyper: 'Alle sett: kamera V26, velferd H24, KI-chatbot H25, VR V25, deepfakes V24' },
  { km: 'KM3', ovelser: 'Pseudokode/algoritmer, spill/simulering, «alternativ løsning»-spørsmål', eksamenstyper: 'Pseudokode i alle sett, simuleringer H24–V26' },
  { km: 'KM4', ovelser: 'UML-kort, relasjoner, «Togsett», «Bibliotek», muntlig «Dyrehage»', eksamenstyper: 'Klassediagram V26, relasjoner H24, H25, V25' },
  { km: 'KM5', ovelser: 'Klasser, arv, polymorfi – flashcards, kodeoppgaver, eksamensoppgaver', eksamenstyper: 'Konstruktør V26, batteri H24, kalkulator V24, togsett V26' },
  { km: 'KM6', ovelser: 'Feilsøking-kort, testplan (q-e5), «Finn og rett tre feil»', eksamenstyper: 'Testplan V23, H23' },
  { km: 'KM7', ovelser: 'Metoder, generalisering (q-f4), arv som gjenbruk', eksamenstyper: 'Generalisering H25, OOP-gjenbruk H24' },
  { km: 'KM8', ovelser: 'Brukervennlighet-kort, q-v2–v3, muntlig tilleggsoppgave', eksamenstyper: 'Mest muntlig' },
  { km: 'KM9', ovelser: 'Smidig/Git-kort, muntlig tilleggsoppgave «Treningslogg»', eksamenstyper: 'Mest muntlig' },
  { km: 'KM10', ovelser: 'Lagring-kort (CSV/JSON, tegnsett, KIT), q-s1–s4', eksamenstyper: 'Del av datasettoppgavene og muntlig' },
  { km: 'KM11', ovelser: 'Data-kort, q-d1–d7, «Kjøretøy», «Friluft», muntlig «Treningslogg»', eksamenstyper: 'Datasett i alle 7 sett' },
];
