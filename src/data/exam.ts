import type { ExamTask, OralQuestion, OralSim } from '../types';

/* =========================================================
 * REA3049 – skriftlige øvingsoppgaver. Egne oppgaver laget etter
 * oppgavetypene i settene H23–V26 (ikke kopier av originalene).
 * Løsninger i Java (DIV) og pseudokode.
 * ========================================================= */
export const examTasks: ExamTask[] = [
  {
    id: 'x-konstruktor', eksamen: 'skriftlig', tittel: 'Konstruktører og arv – les og forklar', tema: ['oop-klasser', 'oop-arv'], minutter: 15, niva: 2,
    kilde: 'Oppgavetype: konstruktør + arv (V26 oppg. 1–2, V24 oppg. 1–2)',
    oppgave: 'Se på koden.\n\na) Hva skrives ut?\nb) Forklar hva super(navn, lonn) gjør, og hva som skjer hvis linjen fjernes.\nc) Hvilken metode er overstyrt, og hva betyr det?\nd) Hvorfor er feltene private?',
    kode: 'class Ansatt {\n    private String navn;\n    private int lonn;\n\n    public Ansatt(String navn, int lonn) {\n        this.navn = navn;\n        this.lonn = lonn;\n    }\n\n    public String beskrivelse() {\n        return navn + " tjener " + lonn + " kr";\n    }\n}\n\nclass Konduktor extends Ansatt {\n    private String strekning;\n\n    public Konduktor(String navn, int lonn, String strekning) {\n        super(navn, lonn);\n        this.strekning = strekning;\n    }\n\n    @Override\n    public String beskrivelse() {\n        return super.beskrivelse() + " og jobber på " + strekning;\n    }\n}\n\n// i main:\nAnsatt k = new Konduktor("Nora", 520000, "Dovrebanen");\nSystem.out.println(k.beskrivelse());',
    losning: 'a) Nora tjener 520000 kr og jobber på Dovrebanen\n   (Selv om variabelen er av typen Ansatt, kjøres Konduktor sin versjon – polymorfi.)\n\nb) super(navn, lonn) kaller konstruktøren i superklassen Ansatt, slik at navn og lonn blir satt. Fjernes linjen, kompilerer ikke koden, fordi Ansatt ikke har en konstruktør uten parametere.\n\nc) beskrivelse() er overstyrt. Subklassen har sin egen versjon som brukes i stedet for superklassens. Her gjenbrukes superklassens tekst med super.beskrivelse() og utvides.\n\nd) Innkapsling: feltene kan bare endres via klassens egne metoder, så objektet kan kontrollere at verdiene er gyldige.',
    godtSvarInneholder: ['Riktig utskrift', 'super kaller superklassens konstruktør', 'Konsekvens uten super: kompileringsfeil', 'Overstyring forklart', 'Polymorfi nevnt', 'Innkapsling/private forklart'],
  },
  {
    id: 'x-pseudo', eksamen: 'skriftlig', tittel: 'Pseudokode og flytskjema – billettpris', tema: ['algoritmer'], minutter: 15, niva: 1,
    kilde: 'Oppgavetype: flytdiagram for billettpris (H23 oppg. 5), pseudokode ↔ flytskjema (V23 oppg. 4, V26 oppg. 4)',
    oppgave: 'Et museum har disse prisene:\n• Under 6 år: gratis\n• 6–17 år og 67 år eller eldre: 50 % rabatt\n• Andre: full pris\n\na) Skriv pseudokode som leser inn alder og full pris, og skriver ut hva kunden skal betale.\nb) Beskriv flytskjemaet (figurer, valg og piler).\nc) Hvilke aldre ville du testet, og hvorfor?',
    losning: 'a)\nalder ← LES alder\npris ← LES full pris\nHVIS alder < 6\n    betal ← 0\nELLERS HVIS alder <= 17 ELLER alder >= 67\n    betal ← pris · 0,5\nELLERS\n    betal ← pris\nSKRIV betal\n\nb) (Start) → /Les alder og pris/ → <alder < 6?> Ja → [betal ← 0]. Nei → <alder ≤ 17 eller ≥ 67?> Ja → [betal ← pris · 0,5], Nei → [betal ← pris]. Alle grener → /Skriv betal/ → (Slutt). To romber.\n\nc) Grenseverdier: 5, 6, 17, 18, 66, 67. Og ugyldig: −1. Feil skjuler seg oftest på grensene (< vs <=).',
    godtSvarInneholder: ['Leser inn verdier', 'Riktige grenser', 'HVIS / ELLERS HVIS / ELLERS i riktig rekkefølge', 'Skriver ut', 'Riktige figurer', 'Grenseverdier i testen'],
  },
  {
    id: 'x-algoritme', eksamen: 'skriftlig', tittel: 'Algoritme: palindromtall og nest største', tema: ['algoritmer', 'funksjoner'], minutter: 25, niva: 2,
    kilde: 'Oppgavetype: palindrom (H24 oppg. 5), nest største (H23 oppg. 6)',
    oppgave: 'a) Skriv pseudokode for en funksjon erPalindrom(tall) som returnerer SANN hvis tallet leses likt begge veier (f.eks. 1221).\nb) Skriv funksjonen i Java.\nc) Skriv pseudokode som finner det nest største tallet i en liste. Hva skjer hvis listen har to like største tall?',
    losning: 'a)\nFUNKSJON erPalindrom(tall)\n    tekst ← tall som tekst\n    snudd ← ""\n    FOR i FRA lengde(tekst) − 1 NED TIL 0\n        snudd ← snudd + tekst[i]\n    RETURNER tekst = snudd\n\nb)\nstatic boolean erPalindrom(int tall) {\n    String tekst = String.valueOf(tall);\n    String snudd = "";\n    for (int i = tekst.length() - 1; i >= 0; i--) {\n        snudd = snudd + tekst.charAt(i);\n    }\n    return tekst.equals(snudd);\n}\n// Kortere: new StringBuilder(tekst).reverse().toString()\n\nc)\nstorst ← −uendelig\nnest ← −uendelig\nFOR HVER t I liste\n    HVIS t > storst\n        nest ← storst\n        storst ← t\n    ELLERS HVIS t > nest OG t ≠ storst\n        nest ← t\nSKRIV nest\n\nMed t ≠ storst blir [5, 9, 9, 3] → nest = 5 (nest største ULIKE verdi). Uten den testen blir svaret 9. Si i besvarelsen hvilken tolkning du har valgt.',
    godtSvarInneholder: ['Gjør tallet om til tekst', 'Snur teksten med løkke', 'Sammenligner med .equals i Java', 'nest oppdateres når storst endres', 'Vurderer duplikater', 'Begrunner tolkningen'],
  },
  {
    id: 'x-togsett', eksamen: 'skriftlig', tittel: 'OOP-modellering: togsett', tema: ['oop-klasser', 'oop-arv', 'oop-komposisjon', 'uml'], minutter: 45, niva: 3,
    kilde: 'Oppgavetype: implementere klasser og relasjoner fra beskrivelse (V26 oppg. 5, H24 oppg. 6, V25 oppg. 6)',
    oppgave: 'Et togselskap vil modellere togsettene sine.\n• Et togsett har et navn, ett lokomotiv og flere vogner.\n• Alle vogner har vognnummer og maksvekt.\n• En passasjervogn har i tillegg antall seter.\n• En godsvogn har i tillegg nåværende last.\n• Lokomotivet har trekkraft (maks samlet vekt det kan trekke).\n\na) Tegn et klassediagram med arv og komposisjon.\nb) Programmer klassene.\nc) Lag metoden antallSeter() i Togsett.\nd) Lag lastInn(int kg) i Godsvogn som ikke tillater last over maksvekt.\ne) Lag kanKjore() som sjekker at samlet maksvekt for vognene ikke er over lokomotivets trekkraft.\nf) Forklar hvor du bruker arv og komposisjon, og hvorfor.',
    losning: 'a)\n            Vogn                        Togsett ◆────── 1 Lokomotiv\n     - nummer: int               - navn: String     - trekkraft: int\n     - maksvekt: int             - vogner: List\n     + getMaksvekt(): int        + leggTil(v: Vogn)\n        △          △             + antallSeter(): int\n        │          │             + kanKjore(): boolean\nPassasjervogn   Godsvogn         Togsett ◆────── 1..* Vogn\n - seter: int   - last: int\n                + lastInn(kg): boolean\n\nb–e)\nclass Vogn {\n    private int nummer;\n    private int maksvekt;\n    public Vogn(int nummer, int maksvekt) {\n        this.nummer = nummer;\n        this.maksvekt = maksvekt;\n    }\n    public int getMaksvekt() { return maksvekt; }\n    public int getSeter() { return 0; }          // vanlige vogner har ingen seter\n}\n\nclass Passasjervogn extends Vogn {\n    private int seter;\n    public Passasjervogn(int nummer, int maksvekt, int seter) {\n        super(nummer, maksvekt);\n        this.seter = seter;\n    }\n    @Override\n    public int getSeter() { return seter; }       // polymorfi\n}\n\nclass Godsvogn extends Vogn {\n    private int last = 0;\n    public Godsvogn(int nummer, int maksvekt) {\n        super(nummer, maksvekt);\n    }\n    public boolean lastInn(int kg) {\n        if (last + kg > getMaksvekt()) return false;\n        last += kg;\n        return true;\n    }\n}\n\nclass Lokomotiv {\n    private int trekkraft;\n    public Lokomotiv(int trekkraft) { this.trekkraft = trekkraft; }\n    public int getTrekkraft() { return trekkraft; }\n}\n\nclass Togsett {\n    private String navn;\n    private Lokomotiv lok;\n    private ArrayList<Vogn> vogner = new ArrayList<>();\n\n    public Togsett(String navn, Lokomotiv lok) {\n        this.navn = navn;\n        this.lok = lok;\n    }\n    public void leggTil(Vogn v) { vogner.add(v); }\n\n    public int antallSeter() {\n        int sum = 0;\n        for (Vogn v : vogner) sum += v.getSeter();\n        return sum;\n    }\n\n    public boolean kanKjore() {\n        int vekt = 0;\n        for (Vogn v : vogner) vekt += v.getMaksvekt();\n        return vekt <= lok.getTrekkraft();\n    }\n}\n\n// Test i main:\nTogsett t = new Togsett("Nattoget", new Lokomotiv(100000));\nt.leggTil(new Passasjervogn(1, 40000, 60));\nGodsvogn g = new Godsvogn(2, 30000);\nt.leggTil(g);\nSystem.out.println(t.antallSeter());   // 60\nSystem.out.println(g.lastInn(35000));  // false\nSystem.out.println(t.kanKjore());      // true (70000 <= 100000)\n\nf) Arv: Passasjervogn og Godsvogn ER vogner og deler nummer og maksvekt → felles kode i Vogn (generalisering). Komposisjon: et Togsett HAR et lokomotiv og vogner. Et togsett er ikke en vogn, så arv ville vært feil der. getSeter() i Vogn + overstyring i Passasjervogn gjør at antallSeter() fungerer for alle vogntyper (polymorfi).',
    godtSvarInneholder: ['Klassediagram: tre felt, trekant for arv, rombe for komposisjon, multiplisitet', 'Superklasse Vogn med felles felt', 'Subklasser med extends og super(...)', 'Togsett med ArrayList opprettet med new', 'antallSeter går gjennom vognene', 'lastInn sjekker maksvekt', 'kanKjore sammenligner med trekkraft', 'Testkode i main', 'Forklarer er-en vs har-en'],
  },
  {
    id: 'x-bibliotek', eksamen: 'skriftlig', tittel: 'OOP: bibliotek med bøker og lånere', tema: ['oop-klasser', 'oop-komposisjon', 'feilsoking'], minutter: 35, niva: 2,
    kilde: 'Oppgavetype: biblioteksklasser (V25 oppg. 6), relasjoner (H24 oppg. 2, H25 oppg. 2)',
    oppgave: 'Lag et program for et skolebibliotek.\n• Bok: tittel, forfatter, om den er utlånt.\n• Laaner: navn og en liste over lånte bøker (maks 3).\n• Bibliotek: alle bøker og alle lånere. Metoden laanUt(Laaner l, String tittel) skal låne ut boken hvis den er ledig og låneren har færre enn 3 bøker.\n\na) Programmer klassene.\nb) Hvilken relasjon er det mellom Bibliotek og Bok, og mellom Laaner og Bok? Begrunn.\nc) Lag tre tester som viser at laanUt fungerer, inkludert et grensetilfelle.',
    losning: 'class Bok {\n    private String tittel, forfatter;\n    private boolean utlaant = false;\n    public Bok(String tittel, String forfatter) {\n        this.tittel = tittel;\n        this.forfatter = forfatter;\n    }\n    public String getTittel() { return tittel; }\n    public boolean erUtlaant() { return utlaant; }\n    public void setUtlaant(boolean u) { utlaant = u; }\n}\n\nclass Laaner {\n    private String navn;\n    private ArrayList<Bok> laan = new ArrayList<>();\n    public Laaner(String navn) { this.navn = navn; }\n    public boolean kanLaane() { return laan.size() < 3; }\n    public void leggTil(Bok b) { laan.add(b); }\n}\n\nclass Bibliotek {\n    private ArrayList<Bok> boker = new ArrayList<>();\n    public void leggTil(Bok b) { boker.add(b); }\n\n    public boolean laanUt(Laaner l, String tittel) {\n        if (!l.kanLaane()) return false;\n        for (Bok b : boker) {\n            if (b.getTittel().equals(tittel) && !b.erUtlaant()) {\n                b.setUtlaant(true);\n                l.leggTil(b);\n                return true;\n            }\n        }\n        return false;\n    }\n}\n\nb) Bibliotek–Bok: komposisjon/aggregering (biblioteket HAR bøker). Laaner–Bok: assosiasjon/aggregering – låneren har midlertidig en referanse til bøker som også finnes i biblioteket og som lever videre når lånet slutter. Ikke arv: en låner er ikke en bok.\n\nc)\n1. Normal: låne ledig bok → true.\n2. Boken er allerede utlånt → false.\n3. Grense: låneren har 3 bøker → fjerde lån gir false.\n(+ ukjent tittel → false)',
    godtSvarInneholder: ['Tre klasser med private felt og konstruktører', 'Liste opprettet med new', 'laanUt sjekker både ledig og maks 3', 'Sammenligner tekst med .equals', 'Riktig relasjon med begrunnelse', 'Tester inkl. grensetilfellet 3 bøker'],
  },
  {
    id: 'x-kamera', eksamen: 'skriftlig', tittel: 'Etikk: kameraovervåking i skolen', tema: ['etikk'], minutter: 25, niva: 2,
    kilde: 'Oppgavetype: etisk dilemma (V26 oppg. 6; samme struktur i alle sett H23–V26)',
    oppgave: 'En videregående skole vil installere kameraer med automatisk analyse i ganger og kantine for å oppdage mobbing og slåsskamper. Systemet varsler en voksen hvis det «ser» noe mistenkelig.\n\nDrøft dilemmaet. Vurder konsekvenser for både individ og samfunn, bruk relevante fagbegreper og konkluder.',
    losning: 'Innledning: Kort om teknologien (filmer, analyserer adferd, varsler) og hvem som berøres (elever, ansatte, foreldre, skolen).\n\nVerdier i konflikt: trygghet ↔ personvern og autonomi; effektivitet ↔ tillit.\n\nFor: raskere hjelp ved vold, forebygging, dokumentasjon, kan avlaste voksne.\n\nMot: gjenkjennelige bilder er personopplysninger (GDPR); automatisk analyse av adferd er svært inngripende; elever er mindreårige og har krav på særlig vern; nedkjølingseffekt; feilalarmer kan stemple uskyldige; KI kan være skjev (diskriminering); fare for lekkasje og formålsglidning (opptak brukt til annet).\n\nTiltak: dataminimering (bare kritiske områder, ingen lagring uten hendelse), kort lagringstid, tilgangsstyring, informasjon/skilting, personvernkonsekvensvurdering (DPIA), elevrådet involveres.\n\nIndivid vs samfunn: individet mister privatliv; samfunnet normaliserer overvåking fra ung alder, men kan få tryggere skoler.\n\nKonklusjon: begrunnet egen mening, f.eks. «Automatisk analyse er uforholdsmessig. Flere voksne i friminuttene og et godt antimobbearbeid gir mye av effekten uten overvåking.»',
    godtSvarInneholder: ['Presenterer dilemmaet og hvem som berøres', 'Verdier som står mot hverandre', 'Minst 2 argumenter for og 2 mot, knyttet til caset', 'Fagbegreper (personopplysning, GDPR, dataminimering, formål, lagringstid, tillit, autonomi)', 'Konsekvenser for individ og samfunn', 'Konkrete tiltak', 'Begrunnet konklusjon'],
  },
  {
    id: 'x-velferd', eksamen: 'skriftlig', tittel: 'Etikk: velferdsteknologi og samtykke', tema: ['etikk'], minutter: 20, niva: 2,
    kilde: 'Oppgavetype: velferdsteknologi og informert samtykke (H24 oppg. 7–8)',
    oppgave: 'Kari (84) har begynnende demens og bor alene. Kommunen vil gi henne en GPS-klokke som varsler familien hvis hun går ut om natten, og en sensor som registrerer når hun står opp og åpner kjøleskapet.\n\na) Forklar hva informert samtykke er, og hvorfor det er vanskelig her.\nb) Drøft fordeler og ulemper for Kari og for samfunnet. Konkluder.',
    losning: 'a) Informert samtykke: Kari forstår hva som samles inn, hvorfor, og hvem som ser det, og sier frivillig ja – og kan trekke samtykket. Med demens kan evnen til å forstå variere, så det er vanskelig å vite om samtykket er gyldig. Pårørende og helsepersonell må da vurdere hva som er til hennes beste.\n\nb) For: trygghet, raskere hjelp, hun kan bo hjemme lenger (styrker autonomi), avlaster pårørende og sparer samfunnet for kostnader.\nMot: kontinuerlig overvåking i eget hjem, tap av privatliv og verdighet, helse- og posisjonsdata er sensitive, risiko for lekkasje, teknologi kan erstatte menneskelig kontakt.\nTiltak: dataminimering (bare varsel, ikke lagring av alt), Kari involveres så mye som mulig, tydelig tilgangsstyring.\nKonklusjon: f.eks. GPS-varsling kan forsvares fordi risikoen ved å gå seg bort er stor, men kjøleskapssensoren er mer inngripende enn nødvendig.',
    godtSvarInneholder: ['Definerer informert samtykke', 'Forklarer hvorfor demens gjør det vanskelig', 'Fordeler for individ og samfunn', 'Ulemper (personvern, verdighet, sensitive data)', 'Autonomi som begrep', 'Nyansert, begrunnet konklusjon'],
  },
  {
    id: 'x-csv', eksamen: 'skriftlig', tittel: 'Datasett: registrerte kjøretøy og elbilandel', tema: ['data', 'lister'], minutter: 40, niva: 2,
    kilde: 'Oppgavetype: datasett (V26 oppg. 7; også H23, V23, H24, V24, H25, V25)',
    oppgave: 'Filen kjoretoy.csv har kolonnene: aar,region,totalt,elbiler\n\na) Les inn filen.\nb) Skriv ut samlet antall elbiler i 2025.\nc) Regn ut elbilandelen i prosent for hver region i 2025, og vis resultatet som en ryddig tabell sortert synkende.\nd) Hvor mange prosent økte antall elbiler i Oslo fra 2024 til 2025?\ne) Hvilket diagram ville du brukt for c) og for d)? Begrunn.',
    kode: 'aar,region,totalt,elbiler\n2024,Oslo,390000,140000\n2025,Oslo,400000,160000\n2024,Vestland,345000,85000\n2025,Vestland,350000,98000\n2025,Nordland,120000,18000',
    losning: 'import java.io.IOException;\nimport java.nio.file.*;\nimport java.util.*;\n\npublic class Kjoretoy {\n    public static void main(String[] args) throws IOException {\n        List<String> linjer = Files.readAllLines(Path.of("kjoretoy.csv"));\n        int sumEl2025 = 0;\n        HashMap<String, Double> andel = new HashMap<>();\n        int oslo2024 = 0, oslo2025 = 0;\n\n        for (int i = 1; i < linjer.size(); i++) {\n            String[] f = linjer.get(i).split(",");\n            int aar = Integer.parseInt(f[0].trim());\n            String region = f[1].trim();\n            int totalt = Integer.parseInt(f[2].trim());\n            int el = Integer.parseInt(f[3].trim());\n\n            if (aar == 2025) {\n                sumEl2025 += el;\n                andel.put(region, (double) el / totalt * 100);\n            }\n            if (region.equals("Oslo") && aar == 2024) oslo2024 = el;\n            if (region.equals("Oslo") && aar == 2025) oslo2025 = el;\n        }\n\n        System.out.println("Elbiler 2025: " + sumEl2025);     // 276000\n\n        ArrayList<String> regioner = new ArrayList<>(andel.keySet());\n        regioner.sort((a, b) -> Double.compare(andel.get(b), andel.get(a)));\n        System.out.printf("%-10s %8s%n", "Region", "Andel");\n        for (String r : regioner) {\n            System.out.printf("%-10s %7.1f%%%n", r, andel.get(r));\n        }\n        // Oslo 40.0 %, Vestland 28.0 %, Nordland 15.0 %\n\n        double endring = (double) (oslo2025 - oslo2024) / oslo2024 * 100;\n        System.out.printf("Økning Oslo: %.1f %%%n", endring);  // 14.3 %\n    }\n}\n\ne) c) Stolpediagram – sammenligner kategorier (regioner). d) Linjediagram hvis vi har flere år – viser utvikling over tid.\n\nStrategi: les → del opp → konverter (trim + parseInt) → filtrer på år → grupper i HashMap → regn ut med double → sorter → presenter.',
    godtSvarInneholder: ['Leser filen og hopper over overskrift', 'split + parseInt (gjerne trim)', 'Filtrerer på år', 'Prosent med double (ikke int-divisjon)', 'Sortert, ryddig tabell', 'Prosentvis endring = (ny − gammel) / gammel · 100', 'Begrunnet diagramvalg'],
  },
  {
    id: 'x-friluft', eksamen: 'skriftlig', tittel: 'Datasett: friluftsaktiviteter per fylke', tema: ['data', 'funksjoner'], minutter: 30, niva: 2,
    kilde: 'Oppgavetype: datasett med gruppering og gjennomsnitt (V25 oppg. 8, H25 oppg. 7)',
    oppgave: 'Filen friluft.csv har kolonnene fylke;aktivitet;prosent (merk: semikolon). Noen rader mangler prosent.\n\na) Lag en metode som leser filen og returnerer gjennomsnittlig prosent per aktivitet (HashMap).\nb) Hvordan håndterer du rader med manglende verdier? Begrunn.\nc) Hvilken aktivitet har høyest gjennomsnitt?',
    kode: 'fylke;aktivitet;prosent\nOslo;Fottur;72\nNordland;Fottur;81\nOslo;Ski;40\nNordland;Ski;\nInnlandet;Ski;66',
    losning: 'static HashMap<String, Double> snittPerAktivitet(String fil) throws IOException {\n    HashMap<String, Integer> sum = new HashMap<>();\n    HashMap<String, Integer> antall = new HashMap<>();\n    List<String> linjer = Files.readAllLines(Path.of(fil));\n\n    for (int i = 1; i < linjer.size(); i++) {\n        String[] f = linjer.get(i).split(";", -1);   // -1 beholder tomme felt\n        if (f.length < 3 || f[2].isBlank()) continue; // hopp over manglende\n        String akt = f[1];\n        int p = Integer.parseInt(f[2].trim());\n        sum.put(akt, sum.getOrDefault(akt, 0) + p);\n        antall.put(akt, antall.getOrDefault(akt, 0) + 1);\n    }\n\n    HashMap<String, Double> snitt = new HashMap<>();\n    for (String akt : sum.keySet()) {\n        snitt.put(akt, (double) sum.get(akt) / antall.get(akt));\n    }\n    return snitt;\n}\n// Fottur: (72+81)/2 = 76.5   Ski: (40+66)/2 = 53.0 → høyest: Fottur\n\nb) Rader uten verdi hoppes over, og antall telles bare for gyldige rader. Å sette 0 ville trukket snittet kunstig ned. Nevn valget i besvarelsen.\n\nc) Gå gjennom snitt-mapen og finn største verdi (maks-mønsteret).',
    godtSvarInneholder: ['Bruker ; som skilletegn', 'Hopper over overskrift', 'Håndterer tomme felt uten å krasje', 'Teller sum og antall per gruppe', 'Gjennomsnitt med double', 'Begrunner håndtering av manglende data', 'Finner maks'],
  },
  {
    id: 'x-spill', eksamen: 'skriftlig', tittel: 'Spill: samle mynter i et rutenett', tema: ['spill', 'oop-klasser', 'oop-arv'], minutter: 45, niva: 3,
    kilde: 'Oppgavetype: spill (H23 Manic Mansion, V23 PacTroll, V26 Stolpebyggeren) – laget som tekstspill',
    oppgave: 'Lag grunnstrukturen i et enkelt spill på et rutenett (10 × 10).\n• Alle figurer har x, y og et symbol.\n• Spilleren (symbol S) flyttes med w/a/s/d og kan ikke gå utenfor brettet.\n• Mynter (symbol M) gir 1 poeng når spilleren står på dem, og forsvinner.\n• Et spøkelse (symbol G) flytter seg tilfeldig ett steg hver runde. Treffer det spilleren, er spillet slutt.\n\na) Lag et klassediagram og forklar hvorfor arv passer.\nb) Programmer Figur, Spiller og Spokelse.\nc) Lag spill-løkken (les input → oppdater → sjekk kollisjon → skriv ut brettet).\nd) Forklar hvordan du testet trinnvis.',
    losning: 'a) Figur (x, y, symbol, getX/getY) ← Spiller (poeng, flytt(retning)), Spokelse (flyttTilfeldig()). Mynt kan være en Figur uten egen logikk. Arv fordi alle ER figurer med posisjon; Spill HAR en spiller, et spøkelse og en liste med mynter (komposisjon).\n\nb)\nclass Figur {\n    protected int x, y;\n    protected char symbol;\n    public Figur(int x, int y, char symbol) {\n        this.x = x; this.y = y; this.symbol = symbol;\n    }\n    public boolean sammePlassSom(Figur f) {\n        return x == f.x && y == f.y;\n    }\n}\n\nclass Spiller extends Figur {\n    private int poeng = 0;\n    public Spiller(int x, int y) { super(x, y, \'S\'); }\n    public void flytt(char r, int storrelse) {\n        if (r == \'w\' && y > 0) y--;\n        if (r == \'s\' && y < storrelse - 1) y++;\n        if (r == \'a\' && x > 0) x--;\n        if (r == \'d\' && x < storrelse - 1) x++;\n    }\n    public void gittPoeng() { poeng++; }\n    public int getPoeng() { return poeng; }\n}\n\nclass Spokelse extends Figur {\n    private Random rnd = new Random();\n    public Spokelse(int x, int y) { super(x, y, \'G\'); }\n    public void flyttTilfeldig(int storrelse) {\n        int dx = rnd.nextInt(3) - 1;   // -1, 0 eller 1\n        int dy = rnd.nextInt(3) - 1;\n        x = Math.max(0, Math.min(storrelse - 1, x + dx));\n        y = Math.max(0, Math.min(storrelse - 1, y + dy));\n    }\n}\n\nc)\nint N = 10;\nSpiller s = new Spiller(0, 0);\nSpokelse g = new Spokelse(9, 9);\nArrayList<Figur> mynter = new ArrayList<>();\nmynter.add(new Figur(3, 4, \'M\'));\nmynter.add(new Figur(7, 2, \'M\'));\nScanner sc = new Scanner(System.in);\nboolean ferdig = false;\n\nwhile (!ferdig) {\n    // tegn\n    for (int y = 0; y < N; y++) {\n        StringBuilder rad = new StringBuilder();\n        for (int x = 0; x < N; x++) {\n            char c = \'.\';\n            for (Figur m : mynter) if (m.x == x && m.y == y) c = \'M\';\n            if (g.x == x && g.y == y) c = \'G\';\n            if (s.x == x && s.y == y) c = \'S\';\n            rad.append(c);\n        }\n        System.out.println(rad);\n    }\n    // input + oppdater\n    String inn = sc.nextLine();\n    if (!inn.isEmpty()) s.flytt(inn.charAt(0), N);\n    g.flyttTilfeldig(N);\n    // kollisjoner\n    for (int i = mynter.size() - 1; i >= 0; i--) {\n        if (s.sammePlassSom(mynter.get(i))) {\n            mynter.remove(i);\n            s.gittPoeng();\n        }\n    }\n    if (s.sammePlassSom(g)) { System.out.println("Tatt! Poeng: " + s.getPoeng()); ferdig = true; }\n    if (mynter.isEmpty()) { System.out.println("Du vant!"); ferdig = true; }\n}\n\nd) Trinnvis: 1) tegnet tomt brett, 2) la til spilleren og testet at den ikke går ut over kanten (prøvde «a» i hjørnet), 3) mynter og poeng, 4) spøkelse og kollisjon. Testet etter hvert steg. Fjerner mynter baklengs for å unngå feil indekser.',
    godtSvarInneholder: ['Superklasse Figur med felles felt', 'Subklasser med super(...)', 'Spilleren stoppes ved kanten', 'Tilfeldig bevegelse med Random', 'Spill-løkke: tegn → input → oppdater → kollisjon', 'Poeng og sluttbetingelse', 'Trinnvis testing forklart'],
  },
  {
    id: 'x-skogbrann', eksamen: 'skriftlig', tittel: 'Simulering: skogbrann i et rutenett', tema: ['spill', 'algoritmer'], minutter: 40, niva: 3,
    kilde: 'Oppgavetype: simulering i rutenett (V25 skogbrann, V24 Livets spill, H24 virusspredning, H25 bunndyr)',
    oppgave: 'En skog er et rutenett med tegnene T (tre), B (brenner) og . (brent/tomt).\nRegler for hvert tidssteg:\n• Et tre som har minst én brennende nabo (over, under, venstre, høyre) begynner å brenne med sannsynlighet p.\n• Et brennende tre blir til brent (.) neste steg.\n\na) Skriv pseudokode for ett tidssteg.\nb) Hvorfor må du bruke et nytt rutenett for neste tilstand?\nc) Programmer metoden nesteSteg(char[][] skog, double p) i Java.\nd) Hvordan kan du teste at simuleringen er riktig?',
    losning: 'a)\nny ← kopi av skog\nFOR HVER celle (r, k)\n    HVIS skog[r][k] = B\n        ny[r][k] ← .\n    ELLERS HVIS skog[r][k] = T OG harBrennendeNabo(r, k) OG tilfeldig() < p\n        ny[r][k] ← B\nRETURNER ny\n\nb) Hvis vi endrer skog direkte, vil et tre som nettopp tok fyr i samme runde kunne tenne naboen sin – brannen hopper flere ruter på ett steg. Alle celler skal bestemmes ut fra den gamle tilstanden.\n\nc)\nstatic char[][] nesteSteg(char[][] skog, double p, Random rnd) {\n    int R = skog.length, K = skog[0].length;\n    char[][] ny = new char[R][K];\n    for (int r = 0; r < R; r++) {\n        for (int k = 0; k < K; k++) {\n            char c = skog[r][k];\n            if (c == \'B\') {\n                ny[r][k] = \'.\';\n            } else if (c == \'T\' && harBrennendeNabo(skog, r, k) && rnd.nextDouble() < p) {\n                ny[r][k] = \'B\';\n            } else {\n                ny[r][k] = c;\n            }\n        }\n    }\n    return ny;\n}\n\nstatic boolean harBrennendeNabo(char[][] s, int r, int k) {\n    return (r > 0 && s[r-1][k] == \'B\') || (r < s.length - 1 && s[r+1][k] == \'B\')\n        || (k > 0 && s[r][k-1] == \'B\') || (k < s[0].length - 1 && s[r][k+1] == \'B\');\n}\n\nd) Bruk p = 1.0 (alltid spredning) på et lite rutenett der du vet svaret, og p = 0.0 (ingen spredning). Test et tre i hjørnet (kantsjekk). Skriv ut rutenettet etter hvert steg.',
    godtSvarInneholder: ['Pseudokode med begge reglene', 'Forklarer hvorfor ny tilstand trengs', 'Nøstede løkker over rutenettet', 'Kantsjekk for naboer', 'Sannsynlighet med Random', 'Testing med p = 0 og p = 1'],
  },
  {
    id: 'x-feil', eksamen: 'skriftlig', tittel: 'Feilsøking: finn og rett tre feil', tema: ['feilsoking', 'oop-klasser'], minutter: 15, niva: 2,
    kilde: 'Oppgavetype: feilsøking og testplan (KM6; testplan i V23 og H23)',
    oppgave: 'Klassen skal holde styr på passasjerer i en vogn, men har tre feil: én syntaksfeil, én kjøretidsfeil og én logisk feil. Finn dem, forklar feiltypen, rett dem, og lag en liten testplan.',
    kode: 'class Vogn {\n    private int seter;\n    private ArrayList<String> passasjerer;\n\n    public Vogn(int seter) {\n        this.seter = seter\n    }\n\n    public void leggTil(String navn) {\n        if (passasjerer.size() <= seter) {\n            passasjerer.add(navn);\n        }\n    }\n\n    public int ledige() {\n        return seter - passasjerer.size();\n    }\n}',
    losning: '1) Syntaksfeil: this.seter = seter mangler semikolon → kompilerer ikke.\n\n2) Kjøretidsfeil: passasjerer blir aldri opprettet → NullPointerException ved første leggTil. Rett: private ArrayList<String> passasjerer = new ArrayList<>();\n\n3) Logisk feil: <= slipper inn én passasjer for mye (når listen er full, size() == seter, og testen er fortsatt sann). Rett til <.\n\nTestplan:\nTest           | Handling                 | Forventet\nTom vogn       | new Vogn(2), ledige()    | 2\nNormal         | leggTil("A")             | ledige() = 1\nFull (grense)  | leggTil("A"), ("B")      | ledige() = 0\nOver kapasitet | + leggTil("C")           | ledige() fortsatt 0',
    godtSvarInneholder: ['Manglende semikolon (syntaks)', 'Liste ikke opprettet → NullPointerException (kjøretid)', '<= skal være < (logisk)', 'Forklarer forskjellen på feiltypene', 'Testplan med grensetilfellet full vogn'],
  },

  /* =========================================================
   * REA3050 – praktiske øvingsoppgaver (lokalt gitt eksamen)
   * ========================================================= */
  {
    id: 'm-quiz', eksamen: 'muntlig', tittel: 'Praktisk: quiz-program med poeng', tema: ['grunnlag', 'lister', 'funksjoner', 'systemutvikling'], minutter: 30, niva: 1,
    kilde: 'Egenprodusert øvingsoppgave (REA3050 publiseres ikke)',
    oppgave: 'Lag et quiz-program i terminalen.\n• Spørsmål og svar lagres i en datastruktur.\n• Programmet stiller spørsmålene ett og ett, sjekker svaret og teller poeng.\n• Til slutt vises poengsum og prosent riktig.\n\nVær klar til å forklare løkken, datastrukturen og hvordan du håndterer store/små bokstaver og mellomrom.',
    losning: 'import java.util.*;\n\npublic class Quiz {\n    static int kjorQuiz(String[][] sporsmal, Scanner sc) {\n        int poeng = 0;\n        for (String[] s : sporsmal) {\n            System.out.print(s[0] + " ");\n            String svar = sc.nextLine().trim();\n            if (svar.equalsIgnoreCase(s[1])) {\n                System.out.println("Riktig!");\n                poeng++;\n            } else {\n                System.out.println("Feil, riktig svar er " + s[1]);\n            }\n        }\n        return poeng;\n    }\n\n    public static void main(String[] args) {\n        String[][] sporsmal = {\n            {"Hovedstaden i Norge?", "Oslo"},\n            {"2 + 2?", "4"}\n        };\n        int p = kjorQuiz(sporsmal, new Scanner(System.in));\n        double prosent = (double) p / sporsmal.length * 100;\n        System.out.printf("Du fikk %d av %d (%.0f %%)%n", p, sporsmal.length, prosent);\n    }\n}\n\n// Forklaring: datastrukturen gjør det lett å legge til spørsmål uten å endre logikken (gjenbruk, KM7).\n// trim() + equalsIgnoreCase gjør at « oslo» og «Oslo» godtas likt (brukervennlighet, KM8).\n// Alternativ: en klasse Sporsmal med felt tekst og svar – mer objektorientert.',
    godtSvarInneholder: ['Datastruktur for spørsmål', 'Løkke', 'Teller poeng', 'Prosent med double', 'trim/equalsIgnoreCase begrunnet', 'Metode med return', 'Nevner alternativ (klasse Sporsmal)'],
  },
];

/* =========================================================
 * REA3050 – fullstendige simuleringer.
 * Oslo Privatistkontor (H26): trekk oppgave → minst 30 min forberedelse (alle hjelpemidler,
 * notater på papir fra forberedelsesrommet kan tas med) → inntil 45 min eksaminasjon med praktisk
 * innslag, samtale og en UKJENT tilleggsoppgave fra andre kompetansemål. Ingen PowerPoint.
 * Sjekk ditt eget informasjonsskriv i Privatistportalen.
 * ========================================================= */
export const oralSims: OralSim[] = [
  {
    id: 'sim-kino', tittel: 'Kinobillettsystem', km: ['KM4', 'KM5', 'KM6'],
    oppgave: 'En kino trenger et program for å selge billetter.\n• En sal har et antall rader og seter per rad.\n• Kunder kan kjøpe ett eller flere seter. Et sete kan bare selges én gang.\n• Det finnes vanlige billetter og rabattbilletter (student/honnør).\n\nModeller og programmer en løsning du selv velger omfanget på. Du skal kunne vise programmet, forklare strukturen og hvordan du har testet det.',
    praktisk: 'Vis klassediagrammet, kjør programmet (eller gå gjennom koden på papir), og demonstrer at et sete ikke kan selges to ganger.',
    losningsskisse: 'Klasser: Sal (rader, seter, boolean[][] opptatt, selgSete(r, s)), Billett (pris(), sete) med subklasser Vanlig og Rabatt som overstyrer pris() (arv + polymorfi). Kino HAR saler (komposisjon). Test: selge samme sete to ganger → false; sete utenfor salen → false.',
    tilleggsoppgave: { km: 'KM2', sporsmal: 'Kinoen vil lagre telefonnummeret og kjøpshistorikken til alle kunder for å sende tilbud. Hvilke etiske og personvernmessige hensyn må de ta?', momenter: ['Personopplysninger og GDPR', 'Samtykke til markedsføring', 'Dataminimering og lagringstid', 'Sikker lagring', 'Begrunnet vurdering'] },
    oppfolging: ['Hvorfor valgte du arv for billettypene? Hva ville vært et alternativ?', 'Hva skjer i programmet ditt hvis noen skriver inn rad 0 eller en bokstav?', 'Hvordan ville du gjort programmet mer brukervennlig?', 'Hvilken relasjon er det mellom Kino og Sal i diagrammet ditt?', 'Hvordan ville du lagret solgte billetter mellom hver gang programmet startes?'],
  },
  {
    id: 'sim-trening', tittel: 'Treningslogg med statistikk', km: ['KM11', 'KM5', 'KM10'],
    oppgave: 'Lag et program som leser en CSV-fil med treningsøkter (dato, aktivitet, minutter, puls) og gir brukeren nyttig statistikk: total tid per aktivitet, gjennomsnittlig puls og den lengste økten. Du velger selv hvordan resultatene presenteres.',
    praktisk: 'Kjør programmet på en liten testfil, vis utskriften, og forklar stegene les → behandle → presenter.',
    losningsskisse: 'Klasse Okt (dato, aktivitet, minutter, puls). Metode lesFil() som returnerer ArrayList<Okt> (hopper over overskrift og tomme felt). HashMap<String, Integer> for tid per aktivitet. Gjennomsnitt med double. Maks-mønsteret for lengste økt. Utskrift som tabell med printf.',
    tilleggsoppgave: { km: 'KM9', sporsmal: 'Tenk deg at du og to medelever skal videreutvikle programmet til en app. Hvordan ville dere organisert arbeidet, og hvilke verktøy ville dere brukt?', momenter: ['Smidig/iterativ metode (sprinter)', 'Oppgavefordeling (f.eks. Trello/issues)', 'Versjonskontroll med Git/GitHub', 'Brukertesting underveis', 'Dokumentasjon'] },
    oppfolging: ['Hvorfor lagde du en egen klasse for økter i stedet for å bruke arrays direkte?', 'Hva gjør programmet hvis en linje mangler puls?', 'Hvorfor er puls en sensitiv personopplysning, og hva betyr det for lagringen?', 'Når ville du valgt JSON i stedet for CSV?', 'Hvordan testet du at gjennomsnittet var riktig?'],
  },
  {
    id: 'sim-dyrehage', tittel: 'Dyrehage – modellering', km: ['KM4', 'KM5', 'KM7'],
    oppgave: 'En dyrehage vil ha oversikt over dyrene sine. Alle dyr har navn, art og alder. Noen dyr er pattedyr (pelstype), noen er fugler (vingespenn). Dyrene bor i innhegninger med en maksgrense for antall dyr. Lag en modell og et program som viser hvordan dyr legges inn i innhegninger.',
    praktisk: 'Tegn klassediagrammet på papir og forklar det. Vis koden for minst én subklasse og metoden som legger et dyr i en innhegning.',
    losningsskisse: 'Abstrakt/generell klasse Dyr (navn, art, alder, beskriv()). Pattedyr og Fugl extends Dyr og overstyrer beskriv(). Innhegning HAR ArrayList<Dyr> og maks; leggTil(Dyr d) returnerer false når full. Polymorfi: for (Dyr d : dyr) d.beskriv().',
    tilleggsoppgave: { km: 'KM8', sporsmal: 'Dyrehagen vil lage en app for besøkende. Hva må de tenke på for at appen skal bli brukervennlig og universelt utformet?', momenter: ['Brukerbehov og målgruppe (barn, eldre, turister)', 'Enkel navigasjon og tydelig språk', 'Kontrast, tekststørrelse, alternativ tekst', 'Brukertesting med ekte brukere', 'Konkrete forbedringsforslag'] },
    oppfolging: ['Hva er forskjellen på relasjonen Pattedyr–Dyr og Innhegning–Dyr?', 'Hva betyr det at koden din er gjenbrukbar?', 'Hvordan ville du lagt til en ny dyretype, f.eks. Reptil?', 'Hva skjer hvis man prøver å legge et dyr i en full innhegning?', 'Hva er polymorfi, og hvor bruker du det?'],
  },
];

/* =========================================================
 * REA3050 – enkeltstående sensorspørsmål (ett om gangen)
 * ========================================================= */
export const oralQuestions: OralQuestion[] = [
  {
    id: 'o-klasse', tema: 'oop-klasser',
    sporsmal: 'Kan du forklare forskjellen på en klasse og et objekt, med et eksempel fra programmet ditt?',
    godtSvar: 'En klasse er en mal som beskriver hvilke felt og metoder objektene skal ha. Et objekt er en konkret instans som lages med new. I programmet mitt er Vogn en klasse, og new Vogn(3, 64) er et objekt med nummer 3 og 64 seter. Jeg kan lage mange vognobjekter fra samme klasse, og hvert har sine egne verdier.',
    begreper: ['klasse', 'objekt', 'instans', 'felt', 'metode', 'konstruktør'],
    sensorVilHore: ['Mal vs. konkret ting', 'Eksempel fra egen kode', 'At hvert objekt har egne verdier'],
    svaktVsGodt: { svakt: '«En klasse er en sånn class-greie, og et objekt er noe man lager.»', nivaa34: 'Korrekt definisjon + konkret eksempel fra egen kode + begrepene felt og metode.' },
  },
  {
    id: 'o-konstruktor', tema: 'oop-klasser',
    sporsmal: 'Hva gjør konstruktøren i klassen din, og hva betyr this?',
    godtSvar: 'Konstruktøren kjøres automatisk når et objekt lages med new. Den har samme navn som klassen, tar imot verdier og gir feltene startverdier, f.eks. this.seter = seter. this betyr «dette objektet» – det skiller feltet seter fra parameteren seter.',
    begreper: ['konstruktør', 'new', 'this', 'felt', 'parameter'],
    sensorVilHore: ['Kjøres ved opprettelse', 'Setter startverdier', 'Forklarer this'],
    svaktVsGodt: { svakt: '«Den starter programmet.»', nivaa34: 'Forklarer når den kjøres, hva den gjør og hva this betyr, med eksempel.' },
  },
  {
    id: 'o-arv', tema: 'oop-arv',
    sporsmal: 'Hvorfor valgte du å bruke arv her? Kunne du løst det uten?',
    godtSvar: 'Passasjervogn og Godsvogn ER begge vogner og deler nummer og maksvekt. Med arv skriver jeg det felles én gang i Vogn (generalisering), og subklassene legger bare til det spesielle. Uten arv måtte jeg kopiert feltene inn i hver klasse – duplisert kode som er vanskeligere å vedlikeholde. Ulempen med arv er at endringer i superklassen påvirker alle subklassene.',
    begreper: ['arv', 'superklasse', 'subklasse', 'extends', 'er-en', 'gjenbruk', 'generalisering'],
    sensorVilHore: ['Er-en-forholdet', 'Gjenbruk', 'Et alternativ og en ulempe'],
    svaktVsGodt: { svakt: '«Fordi oppgaven sa det.»', nivaa34: 'Begrunner med er-en og gjenbruk, nevner alternativ og ulempe.' },
  },
  {
    id: 'o-polymorfi', tema: 'oop-arv',
    sporsmal: 'Hva er polymorfi, og hvor ser vi det i koden din?',
    godtSvar: 'Polymorfi betyr at samme metodekall gir ulik oppførsel avhengig av objektets faktiske klasse. Jeg har en ArrayList<Vogn> med både passasjervogner og godsvogner. Når jeg kaller v.getSeter() på hver, kjøres Passasjervogn sin overstyrte versjon for passasjervogner, mens godsvogner bruker Vogn sin som gir 0. Da trenger ikke Togsett å vite hvilken type vogn det er.',
    begreper: ['polymorfi', 'overstyring', '@Override', 'superklasse', 'subklasse'],
    sensorVilHore: ['Definisjon', 'Konkret eksempel', 'Fordelen: koden trenger ikke if-tester per type'],
    svaktVsGodt: { svakt: '«Det er når ting har mange former.»', nivaa34: 'Definisjon + eksempel med overstyring + forklarer fordelen.' },
  },
  {
    id: 'o-komp', tema: 'oop-komposisjon',
    sporsmal: 'Hva er forskjellen på arv og komposisjon? Hvor har du brukt hva?',
    godtSvar: 'Arv beskriver et er-en-forhold: en Sovevogn er en Vogn. Komposisjon beskriver et har-en-forhold: et Togsett har vogner, som jeg lagrer i et ArrayList-felt. Jeg bruker arv for vogntypene og komposisjon mellom togsett og vogner, fordi et togsett ikke er en vogn. I klassediagrammet er arv en hul trekant og komposisjon en fylt rombe.',
    begreper: ['arv', 'komposisjon', 'aggregering', 'er-en', 'har-en', 'klassediagram'],
    sensorVilHore: ['Er-en vs har-en', 'Konkret fra egen kode', 'UML-symbolene'],
    svaktVsGodt: { svakt: '«Komposisjon er når man setter sammen kode.»', nivaa34: 'Skiller er-en og har-en, viser hvor i koden, og knytter til UML.' },
  },
  {
    id: 'o-uml', tema: 'uml',
    sporsmal: 'Kan du gå gjennom klassediagrammet ditt?',
    godtSvar: 'Hver boks er en klasse med navn øverst, felt i midten og metoder nederst. Minus betyr private, pluss public. Hul trekant fra Passasjervogn til Vogn viser arv. Linjen med fylt rombe ved Togsett viser komposisjon: et togsett har 1 eller flere vogner (1..*).',
    begreper: ['klassediagram', 'UML', 'multiplisitet', 'synlighet', 'arv', 'komposisjon'],
    sensorVilHore: ['De tre feltene', 'Tolkning av pilene', 'Multiplisitet og synlighet'],
    svaktVsGodt: { svakt: 'Leser bare opp navnene i boksene.', nivaa34: 'Forklarer strukturen, relasjonene og symbolene.' },
  },
  {
    id: 'o-test', tema: 'feilsoking',
    sporsmal: 'Hvordan testet du programmet ditt? Fant du noen feil?',
    godtSvar: 'Jeg testet etter hver metode med verdier der jeg visste svaret. Jeg lagde også en liten testplan med normaltilfeller, grenseverdier og ugyldig input: tom liste, akkurat full vogn og for mye last. Da fant jeg en logisk feil: jeg brukte <= i stedet for <, så det kom inn én passasjer for mye. Jeg fant den ved å skrive ut størrelsen på listen.',
    begreper: ['testplan', 'grensetilfelle', 'logisk feil', 'syntaksfeil', 'kjøretidsfeil', 'feilsøking'],
    sensorVilHore: ['Testet underveis', 'Grensetilfeller', 'Konkret feil og hvordan den ble funnet'],
    svaktVsGodt: { svakt: '«Jeg kjørte det og det funket.»', nivaa34: 'Systematisk testing med testplan, grensetilfeller og et konkret feilfunn.' },
  },
  {
    id: 'o-feiltyper', tema: 'feilsoking',
    sporsmal: 'Hva er forskjellen på en syntaksfeil, en kjøretidsfeil og en logisk feil?',
    godtSvar: 'Syntaksfeil: koden bryter språkets regler, f.eks. manglende semikolon – Java kompilerer ikke. Kjøretidsfeil: programmet krasjer mens det kjører, f.eks. NullPointerException når en liste ikke er opprettet. Logisk feil: programmet kjører, men svaret er feil, f.eks. int-divisjon i et gjennomsnitt. Logiske feil finner man bare med testing.',
    begreper: ['syntaksfeil', 'kjøretidsfeil', 'logisk feil', 'exception', 'testing'],
    sensorVilHore: ['Definisjon av alle tre', 'Eksempel på hver', 'At logiske feil krever testing'],
    svaktVsGodt: { svakt: '«Syntaksfeil er skrivefeil.»', nivaa34: 'Definerer alle tre med eksempel og nevner hvordan de oppdages.' },
  },
  {
    id: 'o-lokke', tema: 'grunnlag',
    sporsmal: 'Hvorfor brukte du en for-løkke her og ikke en while-løkke?',
    godtSvar: 'Jeg skulle gå gjennom alle elementene i en liste, så jeg visste antall runder – da passer for best. while bruker jeg når antall runder ikke er kjent, f.eks. «spør til brukeren svarer riktig» eller spill-løkken. Med while må jeg selv sørge for at betingelsen blir usann, ellers får jeg en evig løkke.',
    begreper: ['for-løkke', 'while-løkke', 'betingelse', 'iterasjon', 'evig løkke'],
    sensorVilHore: ['Kjent vs ukjent antall', 'Eksempel på while', 'Evig løkke'],
    svaktVsGodt: { svakt: '«For er enklere.»', nivaa34: 'Begrunner valget ut fra problemet og viser at du kjenner alternativet.' },
  },
  {
    id: 'o-gjenbruk', tema: 'funksjoner',
    sporsmal: 'Hvordan har du gjort koden gjenbrukbar og generell?',
    godtSvar: 'Jeg har delt koden i metoder med én oppgave hver, og bruker parametere i stedet for faste verdier – f.eks. snitt(int[] tall) virker for alle lister. Felles kode for vogntypene ligger i superklassen Vogn. Det gir mindre duplisering, og når jeg retter en feil, rettes den alle steder.',
    begreper: ['gjenbruk', 'generalisering', 'metode', 'parameter', 'returverdi', 'superklasse'],
    sensorVilHore: ['Metoder med parametere', 'Arv som gjenbruk', 'Fordel: mindre duplisering'],
    svaktVsGodt: { svakt: '«Fordi det er ryddig.»', nivaa34: 'Konkrete eksempler på både metoder og arv, og forklarer fordelen.' },
  },
  {
    id: 'o-data', tema: 'data',
    sporsmal: 'Hvordan leste du inn og behandlet datasettet?',
    godtSvar: 'Jeg leste filen med Files.readAllLines, hoppet over overskriften og delte hver linje med split(","). Alt i CSV er tekst, så jeg gjorde tallene om med Integer.parseInt og trim. Rader med tomme felt hoppet jeg over. Så grupperte jeg per region i en HashMap, regnet prosent med double for å unngå int-divisjon, og skrev ut en sortert tabell. Til regioner passer et stolpediagram.',
    begreper: ['CSV', 'split', 'parseInt', 'HashMap', 'gruppering', 'gjennomsnitt', 'prosent', 'diagramtype'],
    sensorVilHore: ['Stegene les → konverter → behandle → presenter', 'Typekonvertering', 'Manglende verdier', 'Diagramvalg'],
    svaktVsGodt: { svakt: '«Jeg brukte en metode som leste den.»', nivaa34: 'Forklarer stegene og begrunner valgene.' },
  },
  {
    id: 'o-lagring', tema: 'lagring',
    sporsmal: 'Hva er forskjellen på CSV og JSON, og hvordan kan data lagres sikkert?',
    godtSvar: 'CSV er en flat tabell i ren tekst, én rad per linje – fint for tabelldata og regneark. JSON har objekter og lister, kan være nøstet og har datatyper – fint for strukturerte data og utveksling mellom systemer. Bruk UTF-8 så æøå fungerer. Sikker lagring handler om KIT: kryptering og tilgangsstyring for konfidensialitet, validering for integritet og sikkerhetskopi for tilgjengelighet.',
    begreper: ['CSV', 'JSON', 'tegnsett', 'UTF-8', 'konfidensialitet', 'integritet', 'tilgjengelighet', 'kryptering'],
    sensorVilHore: ['Flat vs nøstet', 'Når man velger hva', 'KIT med tiltak'],
    svaktVsGodt: { svakt: '«JSON er nyere.»', nivaa34: 'Sammenligner formatene og knytter sikring til KIT med tiltak.' },
  },
  {
    id: 'o-simulering', tema: 'spill',
    sporsmal: 'Hvordan er simuleringen din bygd opp, og hvordan vet du at den virker?',
    godtSvar: 'Tilstanden ligger i et rutenett (char[][]) eller i objekter. En løkke kjører ett tidssteg om gangen: jeg regner ut neste tilstand i et nytt rutenett ut fra den gamle, så alle celler oppdateres samtidig, og bytter etterpå. Tilfeldighet lager jeg med Random. Jeg testet med ekstreme verdier (sannsynlighet 0 og 1) på et lite rutenett der jeg visste svaret, og sjekket kantene.',
    begreper: ['tilstand', 'tidssteg', 'løkke', 'rutenett', 'Random', 'sannsynlighet', 'testing'],
    sensorVilHore: ['Tilstand og oppdateringsregel', 'Ny vs gammel tilstand', 'Testing med kjente tilfeller'],
    svaktVsGodt: { svakt: '«Den går i en løkke og så skjer ting.»', nivaa34: 'Forklarer tilstand, oppdatering og testing konkret.' },
  },
  {
    id: 'o-personvern', tema: 'etikk',
    sporsmal: 'Programmet ditt lagrer informasjon om brukere. Hvilke personvernhensyn må du ta?',
    godtSvar: 'Navn og e-post er personopplysninger, så GDPR gjelder. Jeg må ha et formål og et lovlig grunnlag, f.eks. informert samtykke, og bare samle inn det som trengs (dataminimering). Dataene bør krypteres, ha tilgangsstyring og slettes når de ikke trengs. Brukerne har rett til innsyn og sletting.',
    begreper: ['personopplysning', 'GDPR', 'informert samtykke', 'formål', 'dataminimering', 'kryptering'],
    sensorVilHore: ['Identifiserer personopplysninger', '2–3 prinsipper', 'Konkrete tekniske tiltak'],
    svaktVsGodt: { svakt: '«Man må passe på dataene.»', nivaa34: 'Fagbegreper og konkrete tiltak knyttet til eget program.' },
  },
  {
    id: 'o-etikk', tema: 'etikk',
    sporsmal: 'Hvilke etiske dilemmaer ser du ved at KI brukes mer og mer i samfunnet?',
    godtSvar: 'KI kan effektivisere helse og skole og hjelpe folk, men det reiser dilemmaer. Treningsdata kan inneholde personopplysninger, og modeller kan være skjeve og diskriminere. Det er uklart hvem som har ansvaret når KI gjør feil. Deepfakes gjør kildekritikk vanskeligere og truer tilliten i samfunnet. Jeg mener KI bør brukes, men med åpenhet, menneskelig kontroll og strenge krav til personvern.',
    begreper: ['personvern', 'diskriminering/skjevhet', 'ansvar', 'tillit', 'deepfakes', 'kildekritikk'],
    sensorVilHore: ['Begge sider', 'Individ og samfunn', 'Egen begrunnet mening'],
    svaktVsGodt: { svakt: '«KI er skummelt.»', nivaa34: 'Drøfter for og mot med fagbegreper og konkluderer.' },
  },
  {
    id: 'o-brukervennlig', tema: 'systemutvikling',
    sporsmal: 'Hvordan har du tenkt på brukervennlighet, og hva ville du forbedret?',
    godtSvar: 'Jeg gir tydelige meldinger, f.eks. «Skriv et tall mellom 1 og 10» i stedet for at programmet krasjer, og jeg fanger feil input med try/catch. Jeg godtar store og små bokstaver. I en grafisk versjon ville jeg tenkt universell utforming: kontrast, tekststørrelse og alternativ tekst. For å vite hva som må forbedres, ville jeg latt noen i målgruppen teste mens jeg observerer.',
    begreper: ['brukervennlighet', 'universell utforming', 'brukertest', 'feilhåndtering', 'brukerbehov'],
    sensorVilHore: ['Konkrete tiltak', 'Feilhåndtering', 'Brukertesting og forbedring'],
    svaktVsGodt: { svakt: '«Den er lett å bruke.»', nivaa34: 'Konkrete tiltak + hvordan det testes med ekte brukere + forslag til forbedring.' },
  },
  {
    id: 'o-prosess', tema: 'systemutvikling',
    sporsmal: 'Hvordan gikk du frem da du fikk oppgaven?',
    godtSvar: 'Først leste jeg oppgaven og markerte substantiver (blir ofte klasser) og verb (blir ofte metoder). Så tegnet jeg et enkelt klassediagram. Jeg programmerte én klasse om gangen og testet før jeg gikk videre – en iterativ arbeidsmåte, som i smidig utvikling. Hvis noe ikke ble ferdig, kan jeg forklare hva som virker, hva som mangler, og hvordan jeg ville fullført det.',
    begreper: ['dekomponering', 'klassediagram', 'iterativ utvikling', 'smidig', 'testing'],
    sensorVilHore: ['Plan før koding', 'Oppdeling', 'Testing underveis', 'Ærlig om hva som mangler'],
    svaktVsGodt: { svakt: '«Jeg begynte bare å kode.»', nivaa34: 'Strukturert prosess med plan, oppdeling og testing.' },
  },
  {
    id: 'o-alternativ', tema: 'oop-klasser',
    sporsmal: 'Kunne du løst denne oppgaven uten klasser? Hva er fordelen med objektorientering her?',
    godtSvar: 'Ja, med arrays, HashMap og static-metoder. Men klasser samler data og metodene som hører til, så det blir mer oversiktlig. Innkapsling gjør at objektet selv sjekker at verdiene er gyldige, f.eks. at lasten ikke går over maksvekt. Klasser er lette å gjenbruke og utvide med arv. For et veldig lite program kan klasser være mer kode enn nødvendig.',
    begreper: ['objektorientering', 'innkapsling', 'abstraksjon', 'gjenbruk', 'alternativ løsning'],
    sensorVilHore: ['Anerkjenner alternativ', 'Fordeler', 'En ulempe'],
    svaktVsGodt: { svakt: '«Nei, man må ha klasser.»', nivaa34: 'Vurderer alternativet og begrunner valget med fordeler og ulemper (KM3).' },
  },
];
