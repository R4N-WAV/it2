import type { QuizItem } from '../types';

/*
 * Spørsmålstyper:
 *  flervalg    – velg ett alternativ
 *  kortsvar    – skriv et kort svar (f.eks. utskriften av koden) – sjekkes automatisk
 *  sorter      – sett linjer i riktig rekkefølge (pseudokode/kode)
 *  selvvurdert – skriv kode/drøfting, sammenlign med løsningsforslag og sjekkliste
 * Kode er Java. Pseudokode bruker ← for tilordning.
 */

export const quiz: QuizItem[] = [
  /* ===================== GRUNNLAG ===================== */
  {
    id: 'q-g1', type: 'kortsvar', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'int x = 4;\nint y = x * 2;\nx = 10;\nSystem.out.println(y);',
    aksepter: ['8'], fasit: '8',
    forklaring: 'y regnes ut én gang (4 * 2 = 8). Å endre x etterpå endrer ikke y.',
    vanligeFeil: 'Tro at y «følger med» når x endres (svare 20).',
  },
  {
    id: 'q-g2', type: 'kortsvar', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut? (tallene med mellomrom)',
    kode: 'for (int i = 2; i < 8; i += 2) {\n    System.out.print(i + " ");\n}',
    aksepter: ['246', '2 4 6'], fasit: '2 4 6',
    forklaring: 'Starter på 2, øker med 2, og fortsetter så lenge i < 8. Når i blir 8, stopper løkken.',
    vanligeFeil: 'Ta med 8 — betingelsen er i < 8, ikke i <= 8.',
  },
  {
    id: 'q-g3', type: 'flervalg', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'poeng er 50. Hva skrives ut?',
    kode: 'if (poeng > 50) {\n    System.out.println("Høy");\n} else if (poeng >= 50) {\n    System.out.println("Akkurat");\n} else {\n    System.out.println("Lav");\n}',
    alternativer: ['Høy', 'Akkurat', 'Lav', 'Akkurat og Lav'], riktig: 1,
    forklaring: '50 > 50 er false. 50 >= 50 er true → «Akkurat». Etter første sanne gren hoppes resten over.',
    vanligeFeil: 'Blande > og >=. Tro at flere grener kan kjøre.',
  },
  {
    id: 'q-g4', type: 'kortsvar', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'int n = 1;\nwhile (n < 20) {\n    n = n * 3;\n}\nSystem.out.println(n);',
    aksepter: ['27'], fasit: '27',
    forklaring: 'n: 1 → 3 → 9 → 27. Når n = 27 er 27 < 20 false, så løkken stopper og 27 skrives.',
    vanligeFeil: 'Svare 9 — betingelsen sjekkes først når løkken skal starte en ny runde.',
  },
  {
    id: 'q-g5', type: 'kortsvar', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);',
    aksepter: ['3'], fasit: '3',
    forklaring: 'int / int gir heltallsdivisjon i Java. 7 / 2 = 3 (resten kuttes). Skriv 7 / 2.0 for 3.5.',
    vanligeFeil: 'Svare 3.5. Dette gir ofte feil gjennomsnitt i datasettoppgaver!',
  },
  {
    id: 'q-g6', type: 'kortsvar', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvor mange ganger skrives "Hei" ut? (V23-type)',
    kode: 'int i = 10;\nwhile (i > 0) {\n    System.out.println("Hei");\n    i = i - 3;\n}',
    aksepter: ['4'], fasit: '4',
    forklaring: 'i: 10 (skriv) → 7 (skriv) → 4 (skriv) → 1 (skriv) → −2 (stopp). 4 ganger.',
    vanligeFeil: 'Stoppe på 3 ved å glemme runden der i = 1.',
  },
  {
    id: 'q-g7', type: 'flervalg', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvilken påstand om løkker er RIKTIG? (H23-type)',
    alternativer: ['En for-løkke kan aldri erstattes av en while-løkke', 'En while-løkke kan kjøre null ganger', 'En while-løkke kjører alltid minst én gang', 'for-løkker kan bare telle oppover'], riktig: 1,
    forklaring: 'while sjekker betingelsen FØR første runde. Er den false fra start, kjører løkken null ganger. (do-while kjører minst én gang.)',
  },
  {
    id: 'q-g8', type: 'flervalg', tema: 'grunnlag', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvorfor kan denne if-testen gi feil resultat?',
    kode: 'String svar = sc.nextLine();\nif (svar == "ja") { ... }',
    alternativer: ['nextLine leser ikke tekst', 'String må sammenlignes med .equals("ja")', '"ja" må stå i enkle anførselstegn', 'if kan ikke brukes med String'], riktig: 1,
    forklaring: '== på objekter sjekker om det er SAMME objekt, ikke samme tekst. Bruk svar.equals("ja").',
  },

  /* ===================== SAMLINGER ===================== */
  {
    id: 'q-l1', type: 'kortsvar', tema: 'lister', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'ArrayList<String> dyr = new ArrayList<>();\ndyr.add("katt");\ndyr.add("hund");\ndyr.add("ku");\nSystem.out.println(dyr.get(1) + " " + dyr.size());',
    aksepter: ['hund3', 'hund 3'], fasit: 'hund 3',
    forklaring: 'Indeks 1 er det ANDRE elementet («hund»). size() er antall elementer: 3.',
    vanligeFeil: 'Tro at indeks 1 er første element.',
  },
  {
    id: 'q-l2', type: 'kortsvar', tema: 'lister', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'int[] tall = {3, 12, 7, 20};\nint antall = 0;\nfor (int t : tall) {\n    if (t > 5) {\n        antall++;\n    }\n}\nSystem.out.println(antall);',
    aksepter: ['3'], fasit: '3',
    forklaring: '12, 7 og 20 er større enn 5 → 3.',
  },
  {
    id: 'q-l3', type: 'kortsvar', tema: 'lister', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'HashMap<String, Integer> antall = new HashMap<>();\nString[] byer = {"Oslo", "Bergen", "Oslo"};\nfor (String b : byer) {\n    antall.put(b, antall.getOrDefault(b, 0) + 1);\n}\nSystem.out.println(antall.get("Oslo"));',
    aksepter: ['2'], fasit: '2',
    forklaring: 'Første Oslo: 0 + 1 = 1. Andre Oslo: 1 + 1 = 2. Dette er tellemønsteret for gruppering.',
  },
  {
    id: 'q-l4', type: 'selvvurdert', tema: 'lister', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Skriv kode som teller hvor mange dager som var under 0 grader.',
    kode: 'int[] temp = {2, -3, -1, 4, 0, -5};',
    losning: 'int antall = 0;\nfor (int t : temp) {\n    if (t < 0) {\n        antall++;\n    }\n}\nSystem.out.println(antall);   // 3',
    sjekkliste: ['Teller-variabel som starter på 0', 'Løkke over arrayen', 'if (t < 0) — ikke <= 0', 'Øker telleren', 'Skriver ut etter løkken'],
    forklaring: 'Tellemønsteret: start på 0, gå gjennom, øk når betingelsen er sann. Brukes i nesten alle dataoppgaver.',
  },

  /* ===================== METODER ===================== */
  {
    id: 'q-f1', type: 'kortsvar', tema: 'funksjoner', km: 'KM7', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'static int kvadrat(int x) {\n    return x * x;\n}\n\n// i main:\nSystem.out.println(kvadrat(3) + kvadrat(2));',
    aksepter: ['13'], fasit: '13',
    forklaring: '9 + 4 = 13.',
  },
  {
    id: 'q-f2', type: 'flervalg', tema: 'funksjoner', km: 'KM7', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvorfor kompilerer ikke denne koden?',
    kode: 'static void dobbel(int x) {\n    System.out.println(x * 2);\n}\n\nint y = dobbel(5) + 1;',
    alternativer: ['x må være double', 'dobbel er void og returnerer ingenting, så den kan ikke brukes i et regnestykke', 'Metoden mangler parameter', 'static er ikke lov'], riktig: 1,
    forklaring: 'void betyr ingen returverdi. Endre til static int dobbel(int x) { return x * 2; }',
    vanligeFeil: 'Tro at println og return er det samme.',
  },
  {
    id: 'q-f3', type: 'selvvurdert', tema: 'funksjoner', km: 'KM7', eksamen: 'begge', niva: 2,
    sporsmal: 'Skriv en metode gjennomsnitt(int[] tall) som returnerer gjennomsnittet som double. Den skal returnere 0 hvis arrayen er tom.',
    losning: 'static double gjennomsnitt(int[] tall) {\n    if (tall.length == 0) {\n        return 0;\n    }\n    int sum = 0;\n    for (int t : tall) {\n        sum += t;\n    }\n    return (double) sum / tall.length;\n}',
    sjekkliste: ['Returtype double', 'Håndterer tom array', 'Summerer i løkke', 'Gjør om til double FØR deling', 'Bruker return'],
    forklaring: 'To klassiske feller: tom array (deling på 0) og int-divisjon.',
  },
  {
    id: 'q-f4', type: 'flervalg', tema: 'funksjoner', km: 'KM7', eksamen: 'begge', niva: 2,
    sporsmal: 'Du har tre nesten like metoder: sumTil10(), sumTil20() og sumTil50(). Hva er den beste generaliseringen?',
    alternativer: ['Kopiere til en fjerde metode', 'Én metode sumTil(int n) med grensen som parameter', 'Lage en klasse per metode', 'Slå dem sammen med if-tester'], riktig: 1,
    forklaring: 'Generalisering (KM7): erstatt faste verdier med parametere, så samme kode kan gjenbrukes.',
  },

  /* ===================== PSEUDOKODE / ALGORITMER / FLYTSKJEMA ===================== */
  {
    id: 'q-a1', type: 'sorter', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 1,
    sporsmal: 'Sorter pseudokoden slik at den teller hvor mange tall i listen som er større enn 10. (V26-type)',
    linjer: ['antall ← 0', 'FOR HVER tall I liste', '    HVIS tall > 10', '        antall ← antall + 1', 'SKRIV antall'],
    forklaring: 'Nullstill telleren før løkken, test inne i løkken, skriv ut ETTER løkken.',
    vanligeFeil: 'Skrive ut inne i løkken, eller nullstille telleren inne i løkken.',
  },
  {
    id: 'q-a2', type: 'sorter', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Sorter pseudokoden som finner det største av tre tall a, b og c. (V23-type)',
    linjer: ['LES a, b, c', 'storst ← a', 'HVIS b > storst', '    storst ← b', 'HVIS c > storst', '    storst ← c', 'SKRIV storst'],
    forklaring: 'Anta at a er størst, og bytt hvis du finner noe større. Begge HVIS-testene må stå etter at storst har fått en startverdi.',
  },
  {
    id: 'q-a3', type: 'kortsvar', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut? (summen av partall, V26-type)\n\nsum ← 0\nFOR i FRA 1 TIL 10\n    HVIS i MOD 2 = 0\n        sum ← sum + i\nSKRIV sum',
    aksepter: ['30'], fasit: '30',
    forklaring: '2 + 4 + 6 + 8 + 10 = 30. «FRA 1 TIL 10» i pseudokode tar som regel med 10.',
  },
  {
    id: 'q-a4', type: 'kortsvar', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Flytskjema (lest ovenfra):\n(Start) → [x ← 1] → <x < 10?> —Ja→ [x ← x · 2] → tilbake til <x < 10?>\n                              —Nei→ /Skriv x/ → (Slutt)\nHva skrives ut?',
    aksepter: ['16'], fasit: '16',
    forklaring: 'x: 1 → 2 → 4 → 8 → 16. 16 < 10 er usant → skriv 16.',
    vanligeFeil: 'Stoppe på 8 fordi 8 er «siste under 10».',
  },
  {
    id: 'q-a5', type: 'flervalg', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 1,
    sporsmal: 'I et flytskjema: hvilken figur brukes for «Er alder ≥ 18?»',
    alternativer: ['Oval', 'Rektangel', 'Rombe', 'Parallellogram'], riktig: 2,
    forklaring: 'Valg/betingelse = rombe, med to utganger (Ja/Nei).',
  },
  {
    id: 'q-a6', type: 'flervalg', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilket utsagn kjennetegner IKKE pseudokode? (H23-type)',
    alternativer: ['Den er uavhengig av programmeringsspråk', 'Den kan kjøres direkte av datamaskinen', 'Den beskriver stegene i en algoritme', 'Den bruker innrykk for å vise struktur'], riktig: 1,
    forklaring: 'Pseudokode er for mennesker – den kan ikke kjøres direkte.',
  },
  {
    id: 'q-a7', type: 'kortsvar', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut? (nedtelling og løpende sum, V24-type)\n\nn ← 5\nsum ← 0\nSÅ LENGE n > 0\n    sum ← sum + n\n    n ← n − 2\nSKRIV sum',
    aksepter: ['9'], fasit: '9',
    forklaring: 'n = 5: sum 5, n 3. n = 3: sum 8, n 1. n = 1: sum 9, n −1. Stopp. Svar 9.',
  },
  {
    id: 'q-a8', type: 'selvvurdert', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Skriv pseudokode for funksjonen TrommeLom(n) (V25, FizzBuzz-type): returner "TrommeLom" hvis n er delelig med både 3 og 5, "Tromme" hvis delelig med 3, "Lom" hvis delelig med 5, ellers tallet selv.',
    losning: 'FUNKSJON TrommeLom(n)\n    HVIS n MOD 3 = 0 OG n MOD 5 = 0\n        RETURNER "TrommeLom"\n    ELLERS HVIS n MOD 3 = 0\n        RETURNER "Tromme"\n    ELLERS HVIS n MOD 5 = 0\n        RETURNER "Lom"\n    ELLERS\n        RETURNER n\n\n// Java:\nstatic String trommeLom(int n) {\n    if (n % 3 == 0 && n % 5 == 0) return "TrommeLom";\n    else if (n % 3 == 0) return "Tromme";\n    else if (n % 5 == 0) return "Lom";\n    else return String.valueOf(n);\n}',
    sjekkliste: ['Bruker MOD / % for delelighet', 'Tester «begge» FØRST', 'Riktig rekkefølge på ELLERS HVIS', 'Returnerer tallet ellers', 'Tydelig struktur med innrykk'],
    forklaring: 'Rekkefølgen er hele poenget: tester du «delelig med 3» først, får 15 svaret «Tromme» i stedet for «TrommeLom».',
    vanligeFeil: 'Teste den mest spesielle betingelsen (begge) sist.',
  },
  {
    id: 'q-a9', type: 'selvvurdert', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Skriv pseudokode for en billettautomat: alder leses inn. Under 16 og fra 67 år betaler 50 kr, ellers 100 kr. (H23 – flytdiagram for billettpris)',
    losning: 'alder ← LES alder\nHVIS alder < 16 ELLER alder >= 67\n    pris ← 50\nELLERS\n    pris ← 100\nSKRIV pris',
    sjekkliste: ['Leser inn alder', 'ELLER mellom betingelsene', 'Riktige grenser (< 16 og >= 67)', 'HVIS/ELLERS', 'Skriver ut pris'],
    forklaring: 'Pseudokode har ingen fast syntaks, men må være entydig.',
  },
  {
    id: 'q-a10', type: 'flervalg', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva gjør denne algoritmen?\n\nsvar ← liste[0]\nFOR HVER x I liste\n    HVIS x < svar\n        svar ← x\nSKRIV svar',
    alternativer: ['Finner største verdi', 'Finner minste verdi', 'Regner ut summen', 'Sorterer listen'], riktig: 1,
    forklaring: 'svar byttes ut hver gang vi finner noe MINDRE → til slutt er svar det minste.',
  },
  {
    id: 'q-a11', type: 'sorter', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 3,
    sporsmal: 'Sorter pseudokoden som skriver ut de n første Fibonacci-tallene. (V24-type)',
    linjer: ['LES n', 'a ← 0', 'b ← 1', 'GJENTA n GANGER', '    SKRIV a', '    neste ← a + b', '    a ← b', '    b ← neste'],
    forklaring: 'Du trenger en hjelpevariabel (neste), ellers mister du den gamle verdien av a eller b når du flytter dem.',
  },
  {
    id: 'q-a12', type: 'kortsvar', tema: 'algoritmer', km: 'KM3', eksamen: 'begge', niva: 3,
    sporsmal: 'Caesar-chiffer med forskyvning 3 (V25-type). Hva blir "ZOO" kryptert? Alfabetet er A–Z (26 bokstaver), og etter Z kommer A igjen.',
    aksepter: ['crr'], fasit: 'CRR',
    forklaring: 'Z → A → B → C (går rundt med MOD 26). O → P → Q → R.',
  },

  /* ===================== OOP: KLASSER ===================== */
  {
    id: 'q-o1', type: 'kortsvar', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'class Hund {\n    private String navn;\n\n    public Hund(String navn) {\n        this.navn = navn;\n    }\n\n    public String bjeff() {\n        return navn + " sier voff";\n    }\n}\n\n// i main:\nHund h = new Hund("Rex");\nSystem.out.println(h.bjeff());',
    aksepter: ['rexsiervoff', 'rex sier voff'], fasit: 'Rex sier voff',
    forklaring: 'Konstruktøren lagrer "Rex" i feltet navn. bjeff() bruker feltet.',
  },
  {
    id: 'q-o2', type: 'flervalg', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva er hovedformålet med en konstruktør? (V26-type)',
    alternativer: ['Å slette objekter', 'Å gi et nytt objekt startverdier når det opprettes', 'Å skrive ut objektet', 'Å arve fra en annen klasse'], riktig: 1,
    forklaring: 'Konstruktøren kjøres når du skriver new, og setter feltene til startverdier.',
  },
  {
    id: 'q-o3', type: 'kortsvar', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'class Konto {\n    private int saldo;\n\n    public Konto(int saldo) {\n        this.saldo = saldo;\n    }\n\n    public void taUt(int belop) {\n        if (belop <= saldo) {\n            saldo -= belop;\n        }\n    }\n\n    public int getSaldo() { return saldo; }\n}\n\n// i main:\nKonto k = new Konto(100);\nk.taUt(30);\nk.taUt(90);\nSystem.out.println(k.getSaldo());',
    aksepter: ['70'], fasit: '70',
    forklaring: '100 − 30 = 70. Uttak av 90 avvises fordi 90 > 70. Innkapsling: objektet passer selv på saldoen.',
    vanligeFeil: 'Svare −20 — glemme at if-testen stopper uttaket.',
  },
  {
    id: 'q-o4', type: 'flervalg', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilken linje lager et OBJEKT?',
    alternativer: ['class Bil {', 'public Bil(String merke) {', 'Bil b = new Bil("Tesla");', 'this.merke = merke;'], riktig: 2,
    forklaring: 'new Bil("Tesla") kaller konstruktøren og lager en ny instans.',
  },
  {
    id: 'q-o5', type: 'flervalg', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvilket OOP-prinsipp handler om å skille grensesnittet (hva klassen tilbyr) fra de interne detaljene? (V25-type)',
    alternativer: ['Arv', 'Abstraksjon', 'Polymorfi', 'Rekursjon'], riktig: 1,
    forklaring: 'Abstraksjon: vis bare det som trengs utad. (Innkapsling er nært beslektet: gjøre feltene private.)',
  },
  {
    id: 'q-o6', type: 'selvvurdert', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Lag klassen Batteri (H24-type) med kapasitet og nåværende lading. Metoder: lad(int mengde) som ikke kan gå over kapasiteten, og bruk(int mengde) som returnerer false hvis det ikke er nok energi.',
    losning: 'public class Batteri {\n    private int kapasitet;\n    private int lading;\n\n    public Batteri(int kapasitet) {\n        this.kapasitet = kapasitet;\n        this.lading = 0;\n    }\n\n    public void lad(int mengde) {\n        lading = Math.min(kapasitet, lading + mengde);\n    }\n\n    public boolean bruk(int mengde) {\n        if (mengde > lading) {\n            return false;\n        }\n        lading -= mengde;\n        return true;\n    }\n\n    public int getLading() { return lading; }\n}',
    sjekkliste: ['Private felt', 'Konstruktør som setter kapasitet og starter lading på 0', 'lad() går ikke over kapasitet', 'bruk() sjekker nok energi og returnerer boolean', 'Getter for lading'],
    forklaring: 'Typisk eksamensklasse: felt + konstruktør + metoder som endrer tilstand med kontroll (innkapsling).',
  },
  {
    id: 'q-o7', type: 'selvvurdert', tema: 'oop-klasser', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Lag klassen Kalkulator (V24-type) med metodene pluss, minus, gange og dele (to double-parametere). Hva gjør du med deling på 0?',
    losning: 'public class Kalkulator {\n    public double pluss(double a, double b)  { return a + b; }\n    public double minus(double a, double b)  { return a - b; }\n    public double gange(double a, double b)  { return a * b; }\n\n    public double dele(double a, double b) {\n        if (b == 0) {\n            System.out.println("Kan ikke dele på 0");\n            return Double.NaN;\n        }\n        return a / b;\n    }\n}',
    sjekkliste: ['Fire metoder med to parametere', 'Riktige returtyper (double)', 'Håndterer b == 0', 'Forklarer valget for deling på 0'],
    forklaring: 'Deling på 0 er grensetilfellet sensor ser etter. Alternativ: kaste en exception.',
  },

  /* ===================== ARV ===================== */
  {
    id: 'q-r1', type: 'kortsvar', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'class Dyr {\n    public String lyd() { return "..."; }\n}\nclass Ku extends Dyr {\n    @Override\n    public String lyd() { return "Mø"; }\n}\nclass Fisk extends Dyr { }\n\n// i main:\nSystem.out.println(new Ku().lyd() + " " + new Fisk().lyd());',
    aksepter: ['mø...', 'mø ...'], fasit: 'Mø ...',
    forklaring: 'Ku overstyrer lyd(). Fisk har ingen egen lyd(), så den arver Dyr sin.',
  },
  {
    id: 'q-r2', type: 'flervalg', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvorfor kompilerer ikke Buss-klassen?',
    kode: 'class Kjoretoy {\n    protected String merke;\n    public Kjoretoy(String merke) {\n        this.merke = merke;\n    }\n}\n\nclass Buss extends Kjoretoy {\n    private int seter;\n    public Buss(String merke, int seter) {\n        this.seter = seter;\n    }\n}',
    alternativer: ['Buss arver ikke fra Kjoretoy', 'Buss sin konstruktør mangler super(merke); på første linje', 'seter må være protected', 'merke må være public'], riktig: 1,
    forklaring: 'Kjoretoy har bare en konstruktør med parameter. Da MÅ subklassen kalle super(merke) først.',
    vanligeFeil: 'Tro at arv automatisk setter feltene fra superklassen.',
  },
  {
    id: 'q-r3', type: 'sorter', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Sorter linjene til en riktig subklasse Elbil.',
    linjer: ['public class Elbil extends Bil {', '    private int batteri;', '    public Elbil(String merke, int batteri) {', '        super(merke);', '        this.batteri = batteri;', '    }', '}'],
    forklaring: 'Klasselinje med extends → felt → konstruktør → super(...) FØRST → egne felt.',
  },
  {
    id: 'q-r4', type: 'flervalg', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilket par passer best for ARV?',
    alternativer: ['Bibliotek og Bok', 'Spiller og Inventar', 'Elev og Person', 'Bil og Motor'], riktig: 2,
    forklaring: '«En elev ER EN person» → arv. De andre er har-en.',
  },
  {
    id: 'q-r5', type: 'flervalg', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Klassen Hund og klassen Katt har begge navn, alder og metoden spis(). Hvilken mekanisme lar deg samle dette i én klasse? (H25-type)',
    alternativer: ['Komposisjon', 'Generalisering til en superklasse Dyr', 'Polymorfi', 'Innkapsling'], riktig: 1,
    forklaring: 'Generalisering: flytt felles felt og metoder opp i en superklasse som Hund og Katt arver fra.',
  },
  {
    id: 'q-r6', type: 'flervalg', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 2,
    sporsmal: 'Superklassen og subklassene har en metode med samme navn som gjør forskjellige ting. Hva kalles prinsippet? (V25-type)',
    alternativer: ['Polymorfi', 'Komposisjon', 'Abstraksjon', 'Aggregering'], riktig: 0,
    forklaring: 'Polymorfi («mange former»): samme kall, ulik oppførsel ut fra objektets faktiske klasse.',
  },
  {
    id: 'q-r7', type: 'selvvurdert', tema: 'oop-arv', km: 'KM5', eksamen: 'begge', niva: 3,
    sporsmal: 'Gitt klassen Vogn(int nummer, int seter) med metoden info(). Lag subklassen Sovevogn som også har antallKupeer, og som overstyrer info() slik at kupeene vises.',
    losning: 'public class Sovevogn extends Vogn {\n    private int antallKupeer;\n\n    public Sovevogn(int nummer, int seter, int antallKupeer) {\n        super(nummer, seter);\n        this.antallKupeer = antallKupeer;\n    }\n\n    @Override\n    public String info() {\n        return super.info() + ", " + antallKupeer + " kupeer";\n    }\n}',
    sjekkliste: ['extends Vogn', 'Konstruktør med alle tre parametere', 'super(nummer, seter) først', 'Nytt felt lagres', 'info() overstyres (gjerne med super.info())'],
    forklaring: 'super.info() gjenbruker superklassens tekst – da slipper du å skrive den på nytt.',
  },

  /* ===================== RELASJONER ===================== */
  {
    id: 'q-k1', type: 'kortsvar', tema: 'oop-komposisjon', km: 'KM4', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'class Vogn {\n    private int seter;\n    public Vogn(int seter) { this.seter = seter; }\n    public int getSeter() { return seter; }\n}\n\nclass Tog {\n    private ArrayList<Vogn> vogner = new ArrayList<>();\n    public void leggTil(Vogn v) { vogner.add(v); }\n    public int seter() {\n        int sum = 0;\n        for (Vogn v : vogner) sum += v.getSeter();\n        return sum;\n    }\n}\n\n// i main:\nTog t = new Tog();\nt.leggTil(new Vogn(50));\nt.leggTil(new Vogn(30));\nSystem.out.println(t.seter());',
    aksepter: ['80'], fasit: '80',
    forklaring: 'Toget HAR to Vogn-objekter. seter() summerer: 50 + 30.',
  },
  {
    id: 'q-k2', type: 'flervalg', tema: 'oop-komposisjon', km: 'KM4', eksamen: 'begge', niva: 1,
    sporsmal: 'Objektene finnes bare inne i en annen klasse, og forsvinner når helheten slettes (f.eks. rommene i et hus). Hvilken relasjon er det? (V25-type)',
    alternativer: ['Arv', 'Komposisjon', 'Assosiasjon', 'Polymorfi'], riktig: 1,
    forklaring: 'Komposisjon: sterk har-en der delenes levetid er knyttet til helheten.',
  },
  {
    id: 'q-k3', type: 'flervalg', tema: 'oop-komposisjon', km: 'KM4', eksamen: 'begge', niva: 2,
    sporsmal: 'En Student er knyttet til et Fakultet, men begge kan finnes uavhengig av hverandre. Hvilken relasjon passer best? (H25-type)',
    alternativer: ['Arv (Student extends Fakultet)', 'Komposisjon', 'Assosiasjon/aggregering', 'Ingen relasjon'], riktig: 2,
    forklaring: 'En student ER ikke et fakultet (ikke arv), og studenten forsvinner ikke om fakultetet legges ned (ikke komposisjon).',
  },
  {
    id: 'q-k4', type: 'selvvurdert', tema: 'oop-komposisjon', km: 'KM4', eksamen: 'begge', niva: 3,
    sporsmal: 'Lag klassen Togsett som har en liste med vogner. Metoder: leggTilVogn(Vogn v), antallSeter() og fjernVogn(int nummer) som returnerer true hvis vognen ble funnet. Vogn har getNummer() og getSeter().',
    losning: 'import java.util.ArrayList;\n\npublic class Togsett {\n    private String navn;\n    private ArrayList<Vogn> vogner = new ArrayList<>();\n\n    public Togsett(String navn) {\n        this.navn = navn;\n    }\n\n    public void leggTilVogn(Vogn v) {\n        vogner.add(v);\n    }\n\n    public int antallSeter() {\n        int total = 0;\n        for (Vogn v : vogner) {\n            total += v.getSeter();\n        }\n        return total;\n    }\n\n    public boolean fjernVogn(int nummer) {\n        for (Vogn v : vogner) {\n            if (v.getNummer() == nummer) {\n                vogner.remove(v);\n                return true;\n            }\n        }\n        return false;\n    }\n}',
    sjekkliste: ['ArrayList opprettet med new (unngår NullPointerException)', 'leggTilVogn bruker add', 'antallSeter summerer og returnerer', 'fjernVogn leter etter riktig nummer', 'Returnerer false hvis ikke funnet'],
    forklaring: 'Komposisjonsmønsteret: liste-felt + metode for å legge til + metoder som går gjennom listen.',
  },

  /* ===================== UML ===================== */
  {
    id: 'q-u1', type: 'flervalg', tema: 'uml', km: 'KM4', eksamen: 'begge', niva: 1,
    sporsmal: 'Klassediagram (transportsystem, V26-type):\n\n     Kjoretoy\n        △\n   ┌────┴────┐\n  Buss      Tog\n\nHva viser figuren?',
    alternativer: ['Kjoretoy har en Buss og et Tog', 'Buss og Tog arver fra Kjoretoy', 'Kjoretoy arver fra Buss og Tog', 'Buss og Tog er komposisjon'], riktig: 1,
    forklaring: 'Hul trekant peker mot superklassen. Buss og Tog ER kjøretøy.',
  },
  {
    id: 'q-u2', type: 'flervalg', tema: 'uml', km: 'KM4', eksamen: 'begge', niva: 2,
    sporsmal: 'Klassediagram:\n\n  Togsett ◆────────── Vogn\n          1     1..*\n\nHva betyr dette?',
    alternativer: ['Vogn arver fra Togsett', 'Et togsett består av én eller flere vogner (komposisjon)', 'En vogn har mange togsett', 'Ingen sammenheng'], riktig: 1,
    forklaring: 'Fylt rombe ved Togsett = helheten. 1..* = minst én vogn.',
  },
  {
    id: 'q-u3', type: 'selvvurdert', tema: 'uml', km: 'KM4', eksamen: 'begge', niva: 2,
    sporsmal: 'Tegn (med tekst) et klassediagram for Vogn (nummer, seter, info()) og Togsett (navn, vogner, leggTilVogn(), antallSeter()) med riktig relasjon og multiplisitet.',
    losning: '┌───────────────────────┐            ┌────────────────┐\n│ Togsett               │            │ Vogn           │\n├───────────────────────┤ 1     1..* ├────────────────┤\n│ - navn: String        │◆───────────│ - nummer: int  │\n│ - vogner: List<Vogn>  │            │ - seter: int   │\n├───────────────────────┤            ├────────────────┤\n│ + leggTilVogn(v: Vogn)│            │ + info(): String│\n│ + antallSeter(): int  │            └────────────────┘\n└───────────────────────┘',
    sjekkliste: ['Tre felt per klasse', 'Komposisjon med fylt rombe ved Togsett', 'Multiplisitet', 'Synlighet (+/-) og typer'],
    forklaring: 'Det viktige er de tre feltene, riktig relasjon og multiplisitet.',
  },

  /* ===================== FEILSØKING ===================== */
  {
    id: 'q-e1', type: 'flervalg', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilken linje har en syntaksfeil?',
    kode: '1  int sum = 0\n2  for (int i = 0; i < 5; i++) {\n3      sum += i;\n4  }',
    alternativer: ['Linje 1', 'Linje 2', 'Linje 3', 'Ingen'], riktig: 0,
    forklaring: 'Linje 1 mangler semikolon: int sum = 0;',
  },
  {
    id: 'q-e2', type: 'flervalg', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 2,
    sporsmal: 'Metoden skal regne gjennomsnittet av {1, 2}, men gir 1.0 i stedet for 1.5. Hvorfor?',
    kode: 'static double snitt(int[] tall) {\n    int sum = 0;\n    for (int t : tall) sum += t;\n    return sum / tall.length;\n}',
    alternativer: ['sum må starte på 1', 'sum / tall.length er int-divisjon, så desimalene forsvinner før det blir double', 'tall.length er feil', 'for-each kan ikke brukes på arrays'], riktig: 1,
    forklaring: '3 / 2 = 1 (int), og så blir 1 til 1.0. Skriv (double) sum / tall.length.',
    vanligeFeil: 'Tro at returtypen double ordner det. Konverteringen skjer for sent.',
  },
  {
    id: 'q-e3', type: 'flervalg', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 2,
    sporsmal: 'Programmet krasjer med NullPointerException når leggTil kalles. Hvorfor?',
    kode: 'class Lag {\n    private ArrayList<String> spillere;\n    public void leggTil(String navn) {\n        spillere.add(navn);\n    }\n}',
    alternativer: ['navn er null', 'Listen er aldri opprettet med new ArrayList<>()', 'add finnes ikke', 'private hindrer add'], riktig: 1,
    forklaring: 'Feltet er bare deklarert, så det er null. Skriv = new ArrayList<>(); på feltet eller i konstruktøren.',
  },
  {
    id: 'q-e4', type: 'flervalg', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 1,
    sporsmal: 'Programmet stopper aldri. Hvorfor?',
    kode: 'int i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n}',
    alternativer: ['println er feil', 'i økes aldri, så i < 5 er alltid sann', 'while kan ikke brukes med tall', 'i må starte på 1'], riktig: 1,
    forklaring: 'Legg til i++; i løkken.',
  },
  {
    id: 'q-e5', type: 'selvvurdert', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 2,
    sporsmal: 'Lag en testplan for metoden karakter(int poeng) som skal gi «Bestått» for 40–100 poeng og «Ugyldig» for poeng utenfor 0–100. Hvilken test avslører feilen? (V23 – testplan for karakterprogram)',
    kode: 'static String karakter(int poeng) {\n    if (poeng < 0 || poeng > 100) return "Ugyldig";\n    if (poeng > 40) return "Bestått";\n    return "Ikke bestått";\n}',
    losning: 'Test        | Inndata | Forventet     | Faktisk\nNormal      | 70      | Bestått       | Bestått\nGrense      | 40      | Bestått       | Ikke bestått  ← FEIL\nRett under  | 39      | Ikke bestått  | Ikke bestått\nNedre grense| 0       | Ikke bestått  | Ikke bestått\nØvre grense | 100     | Bestått       | Bestått\nUgyldig     | -5      | Ugyldig       | Ugyldig\nUgyldig     | 101     | Ugyldig       | Ugyldig\n\nTesten med 40 avslører feilen: > skal være >=.',
    sjekkliste: ['Tabell med inndata, forventet og faktisk', 'Normaltilfelle', 'Grenseverdier (40, 39, 0, 100)', 'Ugyldige verdier', 'Finner og forklarer feilen (> vs >=)'],
    forklaring: 'Feil skjuler seg oftest akkurat på grensen. En testplan viser at du tester systematisk.',
  },
  {
    id: 'q-e6', type: 'flervalg', tema: 'feilsoking', km: 'KM6', eksamen: 'begge', niva: 2,
    sporsmal: 'Du leser en CSV-fil og får NumberFormatException: For input string: "antall". Hva er mest sannsynlig feil?',
    alternativer: ['Filen finnes ikke', 'Du prøver å gjøre overskriftslinjen om til tall', 'Komma er feil skilletegn', 'Java kan ikke lese tall'], riktig: 1,
    forklaring: '"antall" er kolonneoverskriften. Start løkken på i = 1 for å hoppe over linje 0.',
  },

  /* ===================== DATA ===================== */
  {
    id: 'q-d1', type: 'kortsvar', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva skrives ut?',
    kode: 'String linje = "Viken,1200,340";\nString[] felt = linje.split(",");\nint totalt = Integer.parseInt(felt[1]);\nint elbiler = Integer.parseInt(felt[2]);\nSystem.out.println(felt[0] + " " + (totalt - elbiler));',
    aksepter: ['viken860', 'viken 860'], fasit: 'Viken 860',
    forklaring: 'split gir ["Viken", "1200", "340"]. Indeks 0 er tekst, 1 og 2 gjøres om til tall: 1200 − 340 = 860.',
  },
  {
    id: 'q-d2', type: 'kortsvar', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 1,
    sporsmal: 'En region har 1200 registrerte kjøretøy, og 300 av dem er elbiler. Hvor mange prosent er elbiler? (bare tallet)',
    aksepter: ['25', '25%', '25.0', '25,0'], fasit: '25',
    forklaring: '300 / 1200 * 100 = 25 %. I Java: (double) 300 / 1200 * 100.',
  },
  {
    id: 'q-d3', type: 'kortsvar', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 2,
    sporsmal: 'Antall elever i et fag gikk fra 200 til 250. Hva er den prosentvise endringen? (bare tallet)',
    aksepter: ['25', '25%', '+25', '25.0'], fasit: '25',
    forklaring: '(250 − 200) / 200 * 100 = 25 % økning.',
    vanligeFeil: 'Dele på den nye verdien (50/250 = 20 %).',
  },
  {
    id: 'q-d4', type: 'flervalg', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 1,
    sporsmal: 'Du skal vise befolkningsutviklingen i Norge fra 1950 til 2025 (H24-type). Hvilket diagram passer best?',
    alternativer: ['Sektordiagram', 'Linjediagram', 'Stolpediagram per fylke', 'Kun tabell'], riktig: 1,
    forklaring: 'Utvikling over tid → linjediagram.',
  },
  {
    id: 'q-d5', type: 'flervalg', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 1,
    sporsmal: 'Du skal sammenligne deltakelse i friluftsaktiviteter mellom fylkene i ett bestemt år (V25-type). Hvilket diagram passer best?',
    alternativer: ['Linjediagram', 'Stolpediagram', 'Punktdiagram', 'Sektordiagram med ett fylke'], riktig: 1,
    forklaring: 'Sammenligne kategorier → stolpediagram. Sortér gjerne stolpene.',
  },
  {
    id: 'q-d6', type: 'selvvurdert', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 3,
    sporsmal: 'Filen kjoretoy.csv har kolonnene region,totalt,elbiler. Skriv et program som leser filen og skriver ut elbilandelen i prosent for hver region, og hvilken region som har høyest andel. (V26-type)',
    kode: 'region,totalt,elbiler\nOslo,400000,160000\nVestland,350000,98000\nNordland,120000,18000',
    losning: 'import java.nio.file.*;\nimport java.util.*;\nimport java.io.IOException;\n\npublic class Elbiler {\n    public static void main(String[] args) throws IOException {\n        List<String> linjer = Files.readAllLines(Path.of("kjoretoy.csv"));\n        String best = "";\n        double bestAndel = -1;\n\n        System.out.printf("%-10s %8s%n", "Region", "Elbil %");\n        for (int i = 1; i < linjer.size(); i++) {\n            String[] f = linjer.get(i).split(",");\n            int totalt = Integer.parseInt(f[1].trim());\n            int elbiler = Integer.parseInt(f[2].trim());\n            double andel = (double) elbiler / totalt * 100;\n            System.out.printf("%-10s %7.1f%n", f[0], andel);\n            if (andel > bestAndel) {\n                bestAndel = andel;\n                best = f[0];\n            }\n        }\n        System.out.println("Høyest andel: " + best);\n    }\n}\n// Oslo 40.0, Vestland 28.0, Nordland 15.0 → Høyest: Oslo',
    sjekkliste: ['Leser filen (Files.readAllLines eller BufferedReader)', 'Hopper over overskriften', 'split(",") og parseInt', 'Prosent med double (ikke int-divisjon)', 'Finner maks med løkke', 'Ryddig utskrift (tabell)'],
    forklaring: 'Les → del opp → konverter → regn ut → finn maks → presenter. Del alltid oppgaven inn i disse stegene.',
  },
  {
    id: 'q-d7', type: 'selvvurdert', tema: 'data', km: 'KM11', eksamen: 'begge', niva: 2,
    sporsmal: 'Du har HashMap<String, Integer> antall med antall elever per fag. Skriv kode som skriver ut et enkelt tekstbasert stolpediagram (én # per 10 elever).',
    losning: 'for (String fag : antall.keySet()) {\n    int n = antall.get(fag);\n    System.out.printf("%-12s %s %d%n", fag, "#".repeat(n / 10), n);\n}',
    sjekkliste: ['Går gjennom alle nøklene', 'Henter verdien', 'Skalerer (n / 10)', 'Viser også tallet', 'Ryddig justering'],
    forklaring: 'Når du ikke har et grafikkbibliotek, er et tydelig tekstdiagram + tabell en grei presentasjon. Forklar valget.',
  },

  /* ===================== LAGRING ===================== */
  {
    id: 'q-s1', type: 'flervalg', tema: 'lagring', km: 'KM10', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilket format passer best for nøstede data, f.eks. en elev med en liste over fag og karakterer?',
    alternativer: ['CSV', 'JSON', 'Ren tekst uten struktur', 'Bilde'], riktig: 1,
    forklaring: 'JSON kan ha lister inne i objekter. CSV er flat (én tabell).',
  },
  {
    id: 'q-s2', type: 'flervalg', tema: 'lagring', km: 'KM10', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva sikrer kryptering først og fremst?',
    alternativer: ['Tilgjengelighet', 'Konfidensialitet', 'Brukervennlighet', 'Hastighet'], riktig: 1,
    forklaring: 'Kryptert data kan ikke leses av uvedkommende → konfidensialitet.',
  },
  {
    id: 'q-s3', type: 'flervalg', tema: 'lagring', km: 'KM10', eksamen: 'begge', niva: 2,
    sporsmal: 'Et datasett viser «TrÃ¸ndelag» i stedet for «Trøndelag». Hva er årsaken?',
    alternativer: ['Filen er ødelagt', 'Filen er lest med feil tegnsett (ikke UTF-8)', 'Feil skilletegn', 'Datatypen er int'], riktig: 1,
    forklaring: 'UTF-8-tegn lest som et annet tegnsett. Les filen med UTF-8.',
  },
  {
    id: 'q-s4', type: 'flervalg', tema: 'lagring', km: 'KM10', eksamen: 'begge', niva: 2,
    sporsmal: 'Hvilket tiltak sikrer først og fremst TILGJENGELIGHET?',
    alternativer: ['Kryptering', 'Sikkerhetskopi (backup) og reservesystemer', 'Sterke passord', 'Anonymisering'], riktig: 1,
    forklaring: 'Backup gjør at data kan gjenopprettes og brukes selv om noe går galt.',
  },

  /* ===================== SPILL / SIMULERING ===================== */
  {
    id: 'q-sp1', type: 'kortsvar', tema: 'spill', km: 'KM3', eksamen: 'begge', niva: 1,
    sporsmal: 'Hva skrives ut?',
    kode: 'int x = 0;\nint fart = 3;\nfor (int steg = 0; steg < 4; steg++) {\n    x = x + fart;\n}\nSystem.out.println(x);',
    aksepter: ['12'], fasit: '12',
    forklaring: 'Figuren flytter seg 3 per oppdatering i 4 oppdateringer: 12. Slik fungerer bevegelse i spill-løkken.',
  },
  {
    id: 'q-sp2', type: 'flervalg', tema: 'spill', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'En ball har y-posisjon og fart dy. Ved bunnen (y >= 400) skal den sprette opp. Hvilken kode gjør det?',
    alternativer: ['y = 0;', 'dy = -dy;', 'dy = 0;', 'y = y + dy;'], riktig: 1,
    forklaring: 'Å snu fortegnet på farten gjør at ballen beveger seg motsatt vei.',
  },
  {
    id: 'q-sp3', type: 'flervalg', tema: 'spill', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'Hva er IKKE nødvendig å sjekke når du ser etter naboen til venstre for cellen rutenett[r][k]?',
    alternativer: ['At k > 0', 'At rutenett[r][k-1] har ønsket verdi', 'At r er et partall', 'At du ikke går utenfor arrayen'], riktig: 2,
    forklaring: 'Du må sjekke at k − 1 finnes (k > 0). Om r er partall er irrelevant.',
  },
  {
    id: 'q-sp4', type: 'flervalg', tema: 'spill', km: 'KM3', eksamen: 'begge', niva: 2,
    sporsmal: 'I en skogbrannsimulering endrer du rutenettet mens du går gjennom det, og brannen sprer seg over hele raden på ett tidssteg. Hva er den beste løsningen?',
    alternativer: ['Gå baklengs gjennom raden', 'Regn ut neste tilstand i et nytt rutenett, og bytt etter at hele steget er ferdig', 'Senk sannsynligheten', 'Bruk while i stedet for for'], riktig: 1,
    forklaring: 'Alle celler skal oppdateres ut fra den GAMLE tilstanden. Dette gjelder også Livets spill (V24).',
  },
  {
    id: 'q-sp5', type: 'selvvurdert', tema: 'spill', km: 'KM3', eksamen: 'begge', niva: 3,
    sporsmal: 'Lag en enkel virussimulering (H24-type): 100 personer i en ArrayList<Person>, der Person har boolean smittet. Hver dag: hver smittet person smitter en tilfeldig person med 30 % sannsynlighet. Kjør 10 dager og skriv ut antall smittede per dag.',
    losning: 'import java.util.*;\n\nclass Person {\n    private boolean smittet = false;\n    public boolean erSmittet() { return smittet; }\n    public void smitt() { smittet = true; }\n}\n\npublic class Simulering {\n    public static void main(String[] args) {\n        Random rnd = new Random();\n        ArrayList<Person> folk = new ArrayList<>();\n        for (int i = 0; i < 100; i++) folk.add(new Person());\n        folk.get(0).smitt();\n\n        for (int dag = 1; dag <= 10; dag++) {\n            ArrayList<Person> nyeSmittede = new ArrayList<>();\n            for (Person p : folk) {\n                if (p.erSmittet() && rnd.nextDouble() < 0.3) {\n                    nyeSmittede.add(folk.get(rnd.nextInt(folk.size())));\n                }\n            }\n            for (Person p : nyeSmittede) p.smitt();   // oppdater etterpå\n\n            int antall = 0;\n            for (Person p : folk) if (p.erSmittet()) antall++;\n            System.out.println("Dag " + dag + ": " + antall);\n        }\n    }\n}',
    sjekkliste: ['Klasse Person med tilstand', 'Lager 100 objekter og smitter én', 'Løkke over dager', 'Random med sannsynlighet 0.3', 'Oppdaterer etter at runden er regnet ut', 'Teller og skriver ut per dag'],
    forklaring: 'Simuleringsmønsteret: modell (klasser) → starttilstand → løkke over tidssteg → regel med tilfeldighet → oppdater → mål/skriv ut.',
  },

  /* ===================== ETIKK ===================== */
  {
    id: 'q-p1', type: 'flervalg', tema: 'etikk', km: 'KM2', eksamen: 'begge', niva: 1,
    sporsmal: 'Hvilken er IKKE en personopplysning?',
    alternativer: ['Et bilde der en person kan gjenkjennes', 'En IP-adresse', 'Gjennomsnittstemperaturen i Oslo i fjor', 'Et bilskilt'], riktig: 2,
    forklaring: 'Temperatur kan ikke knyttes til en person. Bilder, IP og bilskilt kan.',
  },
  {
    id: 'q-p2', type: 'flervalg', tema: 'etikk', km: 'KM2', eksamen: 'begge', niva: 2,
    sporsmal: 'En app samler inn posisjon, kontakter og alder, men trenger bare alder. Hvilket prinsipp brytes tydeligst?',
    alternativer: ['Tilgjengelighet', 'Dataminimering', 'Dataportabilitet', 'Universell utforming'], riktig: 1,
    forklaring: 'Dataminimering: samle bare inn det som er nødvendig for formålet.',
  },
  {
    id: 'q-p3', type: 'flervalg', tema: 'etikk', km: 'KM2', eksamen: 'begge', niva: 2,
    sporsmal: 'En eldre kvinne med begynnende demens får en sensor hjemme som varsler om hun faller (H24 – velferdsteknologi). Hvilke verdier står tydeligst mot hverandre?',
    alternativer: ['Effektivitet og hastighet', 'Trygghet og personvern/autonomi', 'Pris og design', 'Brukervennlighet og tilgjengelighet'], riktig: 1,
    forklaring: 'Sensoren gir trygghet, men innebærer overvåking i hjemmet, og det er vanskelig å sikre informert samtykke.',
  },
  {
    id: 'q-p4', type: 'selvvurdert', tema: 'etikk', km: 'KM2', eksamen: 'begge', niva: 3,
    sporsmal: 'Drøft: En kommune vil installere kameraer i skolegårder og ganger for å redusere mobbing og hærverk (V26-type). Skriv 8–12 setninger.',
    losning: 'Dilemmaet: Kameraer kan gjøre skolen tryggere, men elever og ansatte blir overvåket hver dag. De som berøres, er elever, ansatte, foreldre og skolen.\n\nFor: Kameraer kan forebygge og avdekke mobbing og hærverk, og gi bevis når noe skjer. Noen elever kan føle seg tryggere.\n\nMot: Bilder av gjenkjennelige personer er personopplysninger etter GDPR. Barn har krav på særlig beskyttelse. Overvåking kan gi en «nedkjølingseffekt» der elevene endrer adferd, og tilliten mellom elever og skolen kan svekkes. Mye mobbing skjer digitalt eller utenfor kameraets synsfelt, så effekten kan være begrenset. Opptakene kan misbrukes eller lekke.\n\nHensyn: Formålsbegrensning (opptak kun brukt mot hærverk/vold), dataminimering (bare utsatte områder, ikke klasserom/toaletter), kort lagringstid, tilgangsstyring, skilting og informasjon.\n\nKonsekvenser: For individet – mindre privatliv, men kanskje tryggere. For samfunnet – normalisering av overvåking fra ung alder.\n\nKonklusjon: Jeg mener generell overvåking av ganger og skolegårder er for inngripende. Mer voksne til stede og tiltak mot mobbing er bedre. Kameraer kan forsvares mot hærverk utenfor skoletid, med strenge rammer.',
    sjekkliste: ['Presenterer dilemmaet og hvem som berøres', 'Verdier som står mot hverandre (trygghet vs personvern)', 'Argumenter for OG mot knyttet til caset', 'Minst 3 fagbegreper (personopplysning, GDPR, formål, dataminimering, lagringstid, tillit)', 'Konsekvenser for individ og samfunn', 'Begrunnet konklusjon'],
    forklaring: 'Karakter 3–4 krever begge sider, fagbegreper og en begrunnet konklusjon. Uten konklusjon er det en liste, ikke en drøfting.',
  },
  {
    id: 'q-p5', type: 'flervalg', tema: 'etikk', km: 'KM2', eksamen: 'begge', niva: 2,
    sporsmal: 'En KI-chatbot markedsføres som «venn» for ensomme ungdommer (H25-type). Hvilket er det mest relevante etiske problemet?',
    alternativer: ['Chatboten bruker mye strøm', 'Sårbare brukere kan bli avhengige, få feil råd, og dele sensitive opplysninger med et selskap', 'Chatboten skriver for lange svar', 'Den er laget i et annet land'], riktig: 1,
    forklaring: 'Sårbarhet, ansvar, tillit og personvern (helseopplysninger) er de sentrale hensynene.',
  },

  /* ===================== SYSTEMUTVIKLING ===================== */
  {
    id: 'q-v1', type: 'flervalg', tema: 'systemutvikling', km: 'KM9', eksamen: 'muntlig', niva: 1,
    sporsmal: 'Hva kjennetegner smidig (agil) utvikling?',
    alternativer: ['All planlegging skjer før koding', 'Korte iterasjoner med jevnlig testing og tilbakemelding fra brukere', 'Ingen testing før slutten', 'Kun én utvikler'], riktig: 1,
    forklaring: 'Smidig: små steg, test ofte, juster underveis (Scrum, sprinter).',
  },
  {
    id: 'q-v2', type: 'flervalg', tema: 'systemutvikling', km: 'KM8', eksamen: 'muntlig', niva: 1,
    sporsmal: 'Hvilket tiltak handler om universell utforming?',
    alternativer: ['Kryptere passord', 'God fargekontrast og alternativ tekst på bilder', 'Bruke klasser', 'Lagre data i JSON'], riktig: 1,
    forklaring: 'Universell utforming = tilgjengelig for flest mulig, f.eks. svaksynte.',
  },
  {
    id: 'q-v3', type: 'selvvurdert', tema: 'systemutvikling', km: 'KM8', eksamen: 'muntlig', niva: 2,
    sporsmal: 'Du har laget et program for å kjøpe togbilletter. Beskriv hvordan du ville testet og forbedret brukervennligheten.',
    losning: 'Jeg finner 3–5 testpersoner fra målgruppen, gjerne i ulik alder. De får konkrete oppgaver, f.eks. «Kjøp en honnørbillett fra Oslo til Hamar i morgen». Jeg observerer uten å hjelpe, ber dem tenke høyt, og noterer hvor de nøler eller gjør feil. Etterpå spør jeg om opplevelsen. Funnene bruker jeg til å forbedre løsningen (tydeligere knapper, bedre feilmeldinger), og så tester jeg på nytt (iterativt).',
    sjekkliste: ['Testpersoner fra målgruppen', 'Konkrete oppgaver', 'Observasjon / tenke høyt', 'Konkrete forbedringer', 'Tester på nytt'],
    forklaring: 'Sensor vil høre at du tester med EKTE brukere og bruker resultatene til å forbedre.',
  },
];

/** Kort diagnostisk test – 14 oppgaver på tvers av temaene */
export const diagnoseIds = [
  'q-g1', 'q-g3', 'q-g6', 'q-l1', 'q-a1', 'q-a3', 'q-a5', 'q-o1', 'q-o3', 'q-r2', 'q-k2', 'q-e2', 'q-d2', 'q-p2',
];
