/*
 * Helgesprint – grunnleggende programmering (Java som treningsspråk, ikke et eksamenskrav).
 * Oppgaver merket «Bootcamp x.y» er hentet fra helgepraksisfilen. «Egenlaget» er nye varianter for læringsstigen.
 * Alle fasitKode-programmer kjøres og sjekkes mot `utskrift` av scripts/verifiser-java.mjs.
 */
import { java, main } from './java';
import type { HelgOppgave } from './typer';

const SC = 'import java.util.Scanner;';
const AL = 'import java.util.ArrayList;';

export const GRUNN: HelgOppgave[] = [
  /* ======================= VARIABLER, UTSKRIFT, INPUT ======================= */
  {
    id: 'v-se', ferdighet: 'variabler', trinn: 'se', tittel: 'Se: ditt første program', kilde: 'Bootcamp 2.1',
    oppgave: `Les programmet linje for linje. Du skal ikke skrive noe ennå – bare forstå delene.

- \`public class Main\` lager en **klasse** som heter Main (alt i Java ligger i en klasse).
- \`main\` er **startpunktet** – det Java kjører først.
- \`{\` og \`}\` markerer hvor en **kodeblokk** starter og slutter.
- \`System.out.println(...)\` **skriver ut** tekst og hopper til ny linje.
- Tekst står mellom doble anførselstegn: \`"Hei!"\`.
- Semikolon \`;\` avslutter hver instruksjon.

**Kjør det selv:** Lagre som \`Main.java\` og kjør \`java Main.java\` i terminalen (Java 11+), eller trykk Run i IntelliJ/VS Code/BlueJ.`,
    kode: main('System.out.println("Hei!");'),
    hint: ['Programmet gjør bare én ting.', 'Det som står i println skrives ut.', 'Utskriften er: Hei!'],
    fasit: 'Programmet skriver ut `Hei!`. Alt rundt (`class`, `main`) er «rammen» Java krever. Det du skal skrive selv, står inni `main`.',
    fasitKode: main('System.out.println("Hei!");'), utskrift: 'Hei!',
    muntlig: ['Hva er `main`, og hvorfor trenger programmet det?', 'Hva gjør semikolon i Java?'],
  },
  {
    id: '2.1A', ferdighet: 'variabler', trinn: 'skriv', tittel: 'Første endring: tre linjer utskrift', kilde: 'Bootcamp 2.1A',
    oppgave: `Skriv et program som skriver ut tre linjer:

1. Fornavnet ditt.
2. \`Jeg øver på Informasjonsteknologi 2.\`
3. \`Målet mitt er å bestå REA3050.\`

Skriv **fra blankt ark** – ikke kopier. Kjør programmet. Hvis det ikke kjører: sjekk at tekst står i \`" "\`, at parenteser er på plass og at hver \`println\` slutter med \`;\`.`,
    kode: 'public class Main {\n    public static void main(String[] args) {\n        // skriv koden din her\n    }\n}',
    hint: ['Du trenger én utskriftsinstruksjon per linje.', 'Bruk System.out.println("...");  tre ganger inne i main.', 'System.out.println("Amina");\nSystem.out.println("Jeg øver på Informasjonsteknologi 2.");\nSystem.out.println(…);'],
    fasit: java(main('System.out.println("Amina");\nSystem.out.println("Jeg øver på Informasjonsteknologi 2.");\nSystem.out.println("Målet mitt er å bestå REA3050.");')),
    fasitKode: main('System.out.println("Amina");\nSystem.out.println("Jeg øver på Informasjonsteknologi 2.");\nSystem.out.println("Målet mitt er å bestå REA3050.");'),
    utskrift: 'Jeg øver på Informasjonsteknologi 2.\nMålet mitt er å bestå REA3050.',
    krav: [['System\\.out\\.println', 'Du må bruke System.out.println.'], ['(println[\\s\\S]*){3}', 'Du trenger tre println – én per linje.']],
    muntlig: ['Hva er forskjellen på `print` og `println`?', 'Hva skjer hvis du glemmer et anførselstegn?'],
  },
  {
    id: 'v-forutsi', ferdighet: 'variabler', trinn: 'forutsi', tittel: 'Forutsi: tall og tekst med +', kilde: 'Egenlaget (bygger på Bootcamp 2.2)',
    oppgave: 'Les koden. **Uten å kjøre den:** skriv nøyaktig hva den andre linjen skriver ut. Tenk på hva `+` gjør med to tall, og hva det gjør med tekst.',
    kode: main('int antall = 3;\nint pris = 120;\nint total = antall * pris;\nSystem.out.println("Total: " + total);\nSystem.out.println(antall + pris);'),
    hint: ['Linje 1 er «Total: 360». Se på den andre println.', 'Står det tekst («...») i den andre println? Hvis ikke, er + vanlig addisjon.', '3 + 120 = ?'],
    svar: { sporsmal: 'Hva skriver den ANDRE println ut?', godta: ['123'] },
    fasit: 'Andre linje er **123**. `antall + pris` er to `int`-verdier, så `+` betyr addisjon. I første linje står det tekst foran (`"Total: " + total`), da limer `+` sammen tekst: «Total: 360».',
    fasitKode: main('int antall = 3;\nint pris = 120;\nint total = antall * pris;\nSystem.out.println("Total: " + total);\nSystem.out.println(antall + pris);'),
    utskrift: 'Total: 360\n123',
    muntlig: ['Hva er en variabel? Bruk `pris` som eksempel.', 'Når betyr `+` addisjon, og når betyr det å lime sammen tekst?'],
  },
  {
    id: 'v-spor', ferdighet: 'variabler', trinn: 'spor', tittel: 'Spor: verdier linje for linje', kilde: 'Egenlaget',
    oppgave: `Lag en **sporingstabell** på papir: én kolonne for \`a\` og én for \`b\`. Skriv verdiene etter hver linje.

| Linje | a | b |
|---|---|---|
| 1 | 5 | – |
| 2 | ? | ? |
| … | | |`,
    kode: main('int a = 5;\nint b = a + 2;\na = a * b;\nb = b - 1;\nSystem.out.println(a + " " + b);'),
    hint: ['Etter linje 2 er b = 7.', 'Linje 3 bruker de NYE verdiene: a = 5 * 7.', 'a = 35. Linje 4: b = 7 - 1.'],
    svar: { sporsmal: 'Hva skrives ut? (skriv a og b med mellomrom)', godta: ['35 6'] },
    fasit: '| Linje | a | b |\n|---|---|---|\n| 1 | 5 | – |\n| 2 | 5 | 7 |\n| 3 | 35 | 7 |\n| 4 | 35 | 6 |\n\nUtskrift: `35 6`. `=` betyr «regn ut høyre side og lagre i variabelen til venstre» – den gamle verdien forsvinner.',
    fasitKode: main('int a = 5;\nint b = a + 2;\na = a * b;\nb = b - 1;\nSystem.out.println(a + " " + b);'), utskrift: '35 6',
    muntlig: ['Hva betyr `=` i Java? Er det det samme som likhetstegnet i matte?', 'Hvordan sporer du kode du ikke forstår?'],
  },
  {
    id: '2.2A', ferdighet: 'variabler', trinn: 'skriv', tittel: 'Enkel regning: totalpris', kilde: 'Bootcamp 2.2A',
    oppgave: 'Lag variablene `prisPerVare = 79` og `antall = 4`. Regn ut totalprisen i en ny variabel `total` og skriv ut `Total: 316`.',
    hint: ['Du trenger tre variabler av typen int.', 'int total = prisPerVare * antall;', 'System.out.println("Total: " + total);'],
    fasit: java(main('int prisPerVare = 79;\nint antall = 4;\nint total = prisPerVare * antall;\nSystem.out.println("Total: " + total);')),
    fasitKode: main('int prisPerVare = 79;\nint antall = 4;\nint total = prisPerVare * antall;\nSystem.out.println("Total: " + total);'),
    utskrift: 'Total: 316',
    krav: [['int\\s+\\w+\\s*=', 'Lag variablene med datatype, f.eks. int antall = 4;'], ['\\*', 'Ganging skrives med *.']],
    muntlig: ['Hvorfor valgte du `int` og ikke `double`?', 'Hva er input, behandling og output i dette programmet?'],
  },
  {
    id: '2.2B', ferdighet: 'variabler', trinn: 'fullfor', tittel: 'Fullfør: pris med moms', kilde: 'Bootcamp 2.2B',
    oppgave: 'Programmet mangler linjen som regner ut prisen med moms. Fullfør den slik at programmet skriver ut `250.0`. Forklar etterpå hvorfor `MOMS` er en **konstant** (`final`) og hva `0.25` betyr.',
    kode: main('double prisUtenMoms = 200.0;\nfinal double MOMS = 0.25;\n// LAG LINJEN SOM REGNER UT prisMedMoms HER\nSystem.out.println(prisMedMoms);'),
    hint: ['25 % moms betyr at prisen blir 100 % + 25 % = 125 % av prisen uten moms.', 'double prisMedMoms = prisUtenMoms * (… );', 'double prisMedMoms = prisUtenMoms * (1 + MOMS);'],
    fasit: java(main('double prisUtenMoms = 200.0;\nfinal double MOMS = 0.25;\ndouble prisMedMoms = prisUtenMoms * (1 + MOMS);\nSystem.out.println(prisMedMoms); // 250.0')) + '\n\n`final` betyr at verdien ikke kan endres senere – en konstant. `0.25` er 25 %.',
    fasitKode: main('double prisUtenMoms = 200.0;\nfinal double MOMS = 0.25;\ndouble prisMedMoms = prisUtenMoms * (1 + MOMS);\nSystem.out.println(prisMedMoms);'),
    utskrift: '250.0',
    krav: [['prisMedMoms\\s*=', 'Du må lage variabelen prisMedMoms.'], ['MOMS', 'Bruk konstanten MOMS i beregningen.']],
    muntlig: ['Hvorfor er det lurt å ha momsen som en konstant i stedet for å skrive 0.25 flere steder?', 'Hvorfor er `prisMedMoms` en `double`?'],
  },
  {
    id: '2.2C', ferdighet: 'variabler', trinn: 'rett', tittel: 'Rett: feil datatype', kilde: 'Bootcamp 2.2C',
    oppgave: 'Denne linjen kompilerer ikke. Hva er galt? Skriv den rettede linjen slik at `alder` er et **heltall**.',
    kode: 'int alder = "20";',
    hint: ['Se på hva som står på høyre side av =.', 'Anførselstegn gjør verdien til tekst (String).', 'Fjern anførselstegnene.'],
    svar: { sporsmal: 'Skriv den rettede linjen:', godta: ['int alder = 20;', 'int alder = 20'] },
    fasit: '`"20"` er tekst (String), men variabelen er `int`. Riktig: `int alder = 20;` – eller `String alder = "20";` hvis du bare skal vise den som tekst. Dette er en **typefeil** som kompilatoren oppdager (syntaks-/kompileringsfeil).',
    muntlig: ['Hva er forskjellen på `20` og `"20"` i Java?', 'Hvilke fire datatyper bør du kunne? Gi et eksempel på hver.'],
  },
  {
    id: 'v-endre', ferdighet: 'variabler', trinn: 'endre', tittel: 'Endre: matmoms og bedre utskrift', kilde: 'Egenlaget (bygger på Bootcamp 2.2B)',
    oppgave: 'Butikken selger mat, og matmomsen er **15 %**. Endre programmet slik at (1) en vare som koster **80.0** uten moms brukes, (2) momsen er 15 %, og (3) utskriften blir `Pris med moms: 92.0 kr`. Endre så få linjer som mulig.',
    kode: main('double prisUtenMoms = 200.0;\nfinal double MOMS = 0.25;\ndouble prisMedMoms = prisUtenMoms * (1 + MOMS);\nSystem.out.println(prisMedMoms);'),
    hint: ['Tre ting skal endres: prisen, konstanten og utskriften.', 'final double MOMS = 0.15;  og  double prisUtenMoms = 80.0;', 'System.out.println("Pris med moms: " + prisMedMoms + " kr");'],
    fasit: java(main('double prisUtenMoms = 80.0;\nfinal double MOMS = 0.15;\ndouble prisMedMoms = prisUtenMoms * (1 + MOMS);\nSystem.out.println("Pris med moms: " + prisMedMoms + " kr");')) + '\n\nFordi momsen er en konstant, trengte beregningslinjen ingen endring. Det er poenget med konstanter.',
    fasitKode: main('double prisUtenMoms = 80.0;\nfinal double MOMS = 0.15;\ndouble prisMedMoms = prisUtenMoms * (1 + MOMS);\nSystem.out.println("Pris med moms: " + prisMedMoms + " kr");'),
    utskrift: 'Pris med moms: 92.0 kr',
    krav: [['0\\.15', 'Matmomsen er 15 % = 0.15.'], ['80', 'Prisen uten moms er 80.0.']],
    muntlig: ['Hvorfor trengte du ikke endre linjen som regner ut prisMedMoms?', 'Hva ville skjedd hvis 0.25 sto skrevet direkte fem steder i programmet?'],
  },
  {
    id: '2.3A', ferdighet: 'variabler', trinn: 'skriv', tittel: 'Input: spør om alder', kilde: 'Bootcamp 2.3A',
    oppgave: `Lag et program som spør om brukerens alder, lagrer svaret i en \`int\` og skriver ut \`Du er X år gammel.\`

**Test:** skriv inn \`20\`. Da skal programmet skrive \`Du er 20 år gammel.\`

Ny syntaks: \`import java.util.Scanner;\` øverst, \`Scanner input = new Scanner(System.in);\`, og \`input.nextInt()\` leser et heltall.`,
    kode: main('// 1. lag Scanner\n// 2. skriv spørsmål\n// 3. les heltall\n// 4. skriv svar', SC),
    testInput: '20',
    hint: ['Programmet må: spørre → lese → skrive ut.', 'Scanner input = new Scanner(System.in);  og  int alder = input.nextInt();', 'System.out.println("Du er " + alder + " år gammel.");'],
    fasit: java(main('Scanner input = new Scanner(System.in);\nSystem.out.print("Hvor gammel er du? ");\nint alder = input.nextInt();\nSystem.out.println("Du er " + alder + " år gammel.");\ninput.close();', SC)),
    fasitKode: main('Scanner input = new Scanner(System.in);\nSystem.out.print("Hvor gammel er du? ");\nint alder = input.nextInt();\nSystem.out.println("Du er " + alder + " år gammel.");\ninput.close();', SC),
    utskrift: 'Du er 20 år gammel.',
    krav: [['Scanner', 'Du trenger en Scanner for å lese input.'], ['nextInt', 'Bruk nextInt() for å lese et heltall.']],
    muntlig: ['Hva gjør `new Scanner(System.in)`?', 'Hva skjer hvis brukeren skriver «tjue» i stedet for 20? Hvordan kunne du håndtert det?'],
  },
  {
    id: '2.3B', ferdighet: 'variabler', trinn: 'overfor', tittel: 'Overfør: billettkalkulator med input', kilde: 'Bootcamp 2.3B',
    oppgave: `Lag et program som spør om **antall billetter** og **pris per billett**, beregner totalen og skriver den ut.

**Test:** antall \`3\`, pris \`120\` → utskriften skal inneholde \`360\`.

Skriv først input → behandling → output som tre stikkord.`,
    plan: true, testInput: '3\n120',
    hint: ['Samme mønster som forrige oppgave, men du leser to tall.', 'int antall = input.nextInt();  int pris = input.nextInt();', 'int total = antall * pris;  System.out.println("Totalt: " + total + " kr");'],
    fasit: java(main('Scanner input = new Scanner(System.in);\nSystem.out.print("Antall billetter: ");\nint antall = input.nextInt();\nSystem.out.print("Pris per billett: ");\nint pris = input.nextInt();\nint total = antall * pris;\nSystem.out.println("Totalt: " + total + " kr");\ninput.close();', SC)),
    fasitKode: main('Scanner input = new Scanner(System.in);\nSystem.out.print("Antall billetter: ");\nint antall = input.nextInt();\nSystem.out.print("Pris per billett: ");\nint pris = input.nextInt();\nint total = antall * pris;\nSystem.out.println("Totalt: " + total + " kr");\ninput.close();', SC),
    utskrift: '360',
    krav: [['Scanner', 'Du trenger en Scanner.'], ['(next(Int|Double)[\\s\\S]*){2}', 'Du må lese inn to tall.']],
    muntlig: ['Hva er input, behandling og output her?', 'Hvordan ville du testet programmet? Nevn tre testverdier.'],
  },
  {
    id: 'v-forklar', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Forklar: variabler og datatyper', kilde: 'Bootcamp 2.2 / 8.3',
    oppgave: 'Svar høyt (snakketimer!), deretter stikkord: **Hva er en variabel, og hva er en datatype?** Gi et eksempel med `int`, `double`, `String` og `boolean`, og forklar forskjellen på `=` og `==`.',
    hint: ['Tenk «merket boks».', 'En datatype bestemmer hva slags verdi boksen kan ha.', '«En variabel er en navngitt plass … Datatypen bestemmer … `=` lagrer, `==` sammenligner.»'],
    fasit: '«En variabel er en navngitt plass i minnet der programmet lagrer en verdi, for eksempel `int alder = 20;`. Datatypen bestemmer hva slags verdi som kan lagres: `int` for heltall, `double` for desimaltall som `149.50`, `String` for tekst som `"Amina"` og `boolean` for `true`/`false`. `=` er tilordning – lagre verdien. `==` sammenligner om to verdier er like, og brukes i betingelser.»',
    sjekk: ['Jeg definerte variabel med egne ord', 'Jeg ga eksempel på minst tre datatyper', 'Jeg forklarte = og =='],
    muntlig: ['Hvorfor kan det være lurt å velge gode variabelnavn?'],
  },

  /* ======================= IF / ELSE ======================= */
  {
    id: 'if-se', ferdighet: 'if', trinn: 'se', tittel: 'Se: programmet tar valg', kilde: 'Bootcamp 2.4',
    oppgave: `Les forklaringen linje for linje.

- \`if (alder >= 18)\` – **betingelsen** i parentes er enten sann eller usann.
- Hvis den er sann, kjøres blokken rett etter.
- \`else\` – ellers kjøres den andre blokken.
- \`else if\` lar deg sjekke flere tilfeller **i rekkefølge** – den første som er sann, vinner.

Operatorer: \`>\` \`<\` \`>=\` \`<=\` \`==\` (er lik) \`!=\` (ulik) \`&&\` (OG) \`||\` (ELLER) \`!\` (IKKE).`,
    kode: main('int alder = 67;\n\nif (alder < 18) {\n    System.out.println("Barn: 80 kr");\n} else if (alder >= 67) {\n    System.out.println("Senior: 100 kr");\n} else {\n    System.out.println("Voksen: 150 kr");\n}'),
    hint: ['67 < 18? Nei.', '67 >= 67? Ja.', 'Utskrift: Senior: 100 kr'],
    fasit: 'Med `alder = 67` er første betingelse usann, andre sann → `Senior: 100 kr`. `else` kjøres bare når ingen av de andre var sanne.',
    fasitKode: main('int alder = 67;\n\nif (alder < 18) {\n    System.out.println("Barn: 80 kr");\n} else if (alder >= 67) {\n    System.out.println("Senior: 100 kr");\n} else {\n    System.out.println("Voksen: 150 kr");\n}'),
    utskrift: 'Senior: 100 kr',
    muntlig: ['Hva er en betingelse?', 'Hvorfor betyr rekkefølgen noe i en if–else if-kjede?'],
  },
  {
    id: 'if-forutsi', ferdighet: 'if', trinn: 'forutsi', tittel: 'Forutsi: grenseverdien 18', kilde: 'Egenlaget',
    oppgave: 'Hva skriver programmet ut når `alder` er nøyaktig **18**? Gå gjennom betingelsene én for én.',
    kode: main('int alder = 18;\n\nif (alder < 18) {\n    System.out.println("Barn: 80 kr");\n} else if (alder >= 67) {\n    System.out.println("Senior: 100 kr");\n} else {\n    System.out.println("Voksen: 150 kr");\n}'),
    hint: ['Er 18 < 18?', 'Nei – 18 er ikke mindre enn seg selv. Er 18 >= 67?', 'Ingen av dem er sanne, så else kjøres.'],
    svar: { sporsmal: 'Utskrift:', godta: ['Voksen: 150 kr', 'voksen 150 kr', 'voksen'] },
    fasit: '`Voksen: 150 kr`. `18 < 18` er usann (grensen er ikke med), `18 >= 67` er usann, derfor kjøres `else`. Slike grenser er grunnen til at vi tester 17, 18, 66 og 67.',
    fasitKode: main('int alder = 18;\n\nif (alder < 18) {\n    System.out.println("Barn: 80 kr");\n} else if (alder >= 67) {\n    System.out.println("Senior: 100 kr");\n} else {\n    System.out.println("Voksen: 150 kr");\n}'),
    utskrift: 'Voksen: 150 kr',
    muntlig: ['Hva er en grenseverdi, og hvorfor tester vi den?'],
  },
  {
    id: 'if-spor', ferdighet: 'if', trinn: 'spor', tittel: 'Spor: OG og ELLER', kilde: 'Egenlaget',
    oppgave: 'Spor koden. Skriv for hver betingelse om den er **sann** eller **usann**. Hva blir `karakter`?',
    kode: main('int poeng = 7;\nboolean levert = true;\nString karakter;\n\nif (poeng >= 8 && levert) {\n    karakter = "A";\n} else if (poeng >= 5 || !levert) {\n    karakter = "B";\n} else {\n    karakter = "C";\n}\nSystem.out.println(karakter);'),
    hint: ['poeng >= 8 er usann. Usann && hva som helst = ?', '&& krever at BEGGE er sanne. Neste: poeng >= 5 er sann.', 'Sann || noe = sann → karakter = "B".'],
    svar: { sporsmal: 'Hva skrives ut?', godta: ['B'] },
    fasit: '`7 >= 8` er usann, så hele `&&`-uttrykket er usant. `7 >= 5` er sann, og med `||` holder det at én del er sann → `B`.',
    fasitKode: main('int poeng = 7;\nboolean levert = true;\nString karakter;\n\nif (poeng >= 8 && levert) {\n    karakter = "A";\n} else if (poeng >= 5 || !levert) {\n    karakter = "B";\n} else {\n    karakter = "C";\n}\nSystem.out.println(karakter);'),
    utskrift: 'B',
    muntlig: ['Forklar forskjellen på `&&` og `||` med et eksempel fra hverdagen.'],
  },
  {
    id: '2.4A', ferdighet: 'if', trinn: 'skriv', tittel: 'Positivt, negativt eller null', kilde: 'Bootcamp 2.4A',
    oppgave: `Skriv kode som sjekker om et tall er positivt, negativt eller null, og skriver \`Positivt\`, \`Negativt\` eller \`Null\`.

**Test med \`int tall = -3;\`** → \`Negativt\`. Prøv etterpå 5 og 0 selv.`,
    hint: ['Tre tilfeller → if, else if, else.', 'if (tall > 0) { … } else if (tall < 0) { … } else { … }', 'Den siste grenen (else) dekker tall == 0.'],
    fasit: java(main('int tall = -3;\n\nif (tall > 0) {\n    System.out.println("Positivt");\n} else if (tall < 0) {\n    System.out.println("Negativt");\n} else {\n    System.out.println("Null");\n}')),
    fasitKode: main('int tall = -3;\n\nif (tall > 0) {\n    System.out.println("Positivt");\n} else if (tall < 0) {\n    System.out.println("Negativt");\n} else {\n    System.out.println("Null");\n}'),
    utskrift: 'Negativt',
    krav: [['if\\s*\\(', 'Du trenger en if-setning.'], ['else', 'Du trenger else/else if for de andre tilfellene.']],
    muntlig: ['Hvorfor trenger du ikke skrive `else if (tall == 0)` til slutt?', 'Hvilke tre verdier bør du teste, og hvorfor?'],
  },
  {
    id: '2.4B', ferdighet: 'if', trinn: 'fullfor', tittel: 'Fullfør: kinobillett med rabatt', kilde: 'Bootcamp 2.4B',
    oppgave: 'En kinobillett koster 150 kr. Barn **under 18** får 40 % rabatt. Personer **fra og med 67** får 25 % rabatt. Andre betaler full pris. Fyll inn betingelsene og beregningene som mangler. Med `alder = 67` skal utskriften bli `Pris: 112.5 kr`.',
    kode: main('double grunnpris = 150.0;\nint alder = 67;\ndouble pris;\n\nif ( /* ? */ ) {\n    pris = /* ? */;\n} else if ( /* ? */ ) {\n    pris = /* ? */;\n} else {\n    pris = grunnpris;\n}\n\nSystem.out.println("Pris: " + pris + " kr");'),
    hint: ['40 % rabatt = du betaler 60 % = grunnpris * 0.60.', 'Første betingelse: alder < 18. Andre: alder >= 67.', 'pris = grunnpris * 0.60;  og  pris = grunnpris * 0.75;'],
    fasit: java(main('double grunnpris = 150.0;\nint alder = 67;\ndouble pris;\n\nif (alder < 18) {\n    pris = grunnpris * 0.60;\n} else if (alder >= 67) {\n    pris = grunnpris * 0.75;\n} else {\n    pris = grunnpris;\n}\n\nSystem.out.println("Pris: " + pris + " kr");')),
    fasitKode: main('double grunnpris = 150.0;\nint alder = 67;\ndouble pris;\n\nif (alder < 18) {\n    pris = grunnpris * 0.60;\n} else if (alder >= 67) {\n    pris = grunnpris * 0.75;\n} else {\n    pris = grunnpris;\n}\n\nSystem.out.println("Pris: " + pris + " kr");'),
    utskrift: 'Pris: 112.5 kr',
    krav: [['alder\\s*<\\s*18', 'Barnegrensen: alder < 18.'], ['alder\\s*>=\\s*67', 'Seniorgrensen: alder >= 67 («fra og med»).']],
    muntlig: ['Hvorfor står det `>=` ved 67, men `<` ved 18?', 'Hva skjer med en 17-åring og en 18-åring?'],
  },
  {
    id: 'if-rett', ferdighet: 'if', trinn: 'rett', tittel: 'Rett: senioren får voksenpris', kilde: 'Egenlaget (Bootcamp 2.4: «rekkefølgen betyr noe»)',
    oppgave: 'En 70-åring klager: hen får voksenpris. Hva skriver programmet ut for `alder = 70`? Finn den logiske feilen og rett koden slik at utskriften blir `Senior`.',
    kode: main('int alder = 70;\n\nif (alder >= 18) {\n    System.out.println("Voksen");\n} else if (alder >= 67) {\n    System.out.println("Senior");\n} else {\n    System.out.println("Barn");\n}'),
    hint: ['Hvilken betingelse sjekkes først, og er den sann for 70?', '70 >= 18 er sann – da hoppes resten over.', 'Sjekk alder >= 67 FØR alder >= 18.'],
    svar: { sporsmal: 'Hva skriver den feilaktige koden ut for alder = 70?', godta: ['Voksen'] },
    fasit: 'Den skriver `Voksen`, fordi `70 >= 18` er sann og den første sanne grenen vinner. Dette er en **logisk feil** – programmet kjører, men gir feil resultat. Rettet:\n\n' + java(main('int alder = 70;\n\nif (alder >= 67) {\n    System.out.println("Senior");\n} else if (alder >= 18) {\n    System.out.println("Voksen");\n} else {\n    System.out.println("Barn");\n}')),
    fasitKode: main('int alder = 70;\n\nif (alder >= 67) {\n    System.out.println("Senior");\n} else if (alder >= 18) {\n    System.out.println("Voksen");\n} else {\n    System.out.println("Barn");\n}'),
    utskrift: 'Senior',
    muntlig: ['Hvorfor er dette en logisk feil og ikke en syntaksfeil?', 'Hvilken test ville avslørt feilen?'],
  },
  {
    id: '2.8', ferdighet: 'if', trinn: 'endre', tittel: 'Endre: billettkalkulatoren', kilde: 'Bootcamp 2.8',
    oppgave: `Utgangspunktet er billettkalkulatoren under. **Skriv den på nytt fra blankt ark** (ikke kopier), og gjør to endringer:

1. Grunnprisen blir **180 kr**.
2. Barnerabatten blir **50 %** (seniorrabatten er fortsatt 25 %).

La programmet **beregne** prisene i stedet for å ha faste tall. **Test:** alder \`12\` → \`Billettpris: 90.0 kr\`. Kjør også med 30 og 70.`,
    kode: main('Scanner input = new Scanner(System.in);\n\nSystem.out.print("Skriv inn alder: ");\nint alder = input.nextInt();\n\ndouble pris = 150.0;\nif (alder < 18) {\n    pris = 90.0;\n} else if (alder >= 67) {\n    pris = 112.5;\n}\n\nSystem.out.println("Billettpris: " + pris + " kr");\ninput.close();', SC),
    testInput: '12',
    hint: ['Lag en variabel grunnpris = 180.0 og regn ut barne- og seniorprisen fra den.', 'Barn: grunnpris * 0.50. Senior: grunnpris * 0.75.', 'double pris = grunnpris;  if (alder < 18) { pris = grunnpris * 0.50; } else if (alder >= 67) { pris = grunnpris * 0.75; }'],
    fasit: java(main('Scanner input = new Scanner(System.in);\n\nSystem.out.print("Skriv inn alder: ");\nint alder = input.nextInt();\n\ndouble grunnpris = 180.0;\ndouble pris = grunnpris;\nif (alder < 18) {\n    pris = grunnpris * 0.50;\n} else if (alder >= 67) {\n    pris = grunnpris * 0.75;\n}\n\nSystem.out.println("Billettpris: " + pris + " kr");\ninput.close();', SC)) + '\n\nTester: 12 → 90.0, 30 → 180.0, 70 → 135.0.',
    fasitKode: main('Scanner input = new Scanner(System.in);\n\nSystem.out.print("Skriv inn alder: ");\nint alder = input.nextInt();\n\ndouble grunnpris = 180.0;\ndouble pris = grunnpris;\nif (alder < 18) {\n    pris = grunnpris * 0.50;\n} else if (alder >= 67) {\n    pris = grunnpris * 0.75;\n}\n\nSystem.out.println("Billettpris: " + pris + " kr");\ninput.close();', SC),
    utskrift: 'Billettpris: 90.0 kr',
    krav: [['180', 'Grunnprisen skal være 180.'], ['0\\.5', 'Barnerabatten 50 % → ganger med 0.5.']],
    muntlig: ['Hvorfor er det bedre å regne ut prisene fra `grunnpris` enn å skrive 90.0 direkte?', 'Hva ville du endret for å teste programmet raskere?'],
  },
  {
    id: '9.2', ferdighet: 'if', trinn: 'skriv', tittel: 'Rabattkode', kilde: 'Bootcamp 9.2',
    oppgave: 'Et produkt koster 500 kr. Hvis kunden har rabattkode (`boolean rabattkode = true;`), får kunden 10 % rabatt. Skriv kode som beregner riktig pris og skriver den ut. Med rabattkode skal utskriften være `450.0`.',
    hint: ['Én betingelse – du trenger bare if (ikke else).', 'if (rabattkode) { … } – en boolean kan stå alene i if.', 'pris = pris * 0.90;'],
    fasit: java(main('double pris = 500;\nboolean rabattkode = true;\n\nif (rabattkode) {\n    pris = pris * 0.90;\n}\nSystem.out.println(pris);')),
    fasitKode: main('double pris = 500;\nboolean rabattkode = true;\n\nif (rabattkode) {\n    pris = pris * 0.90;\n}\nSystem.out.println(pris);'),
    utskrift: '450.0',
    krav: [['boolean', 'Bruk en boolean for rabattkoden.'], ['if\\s*\\(', 'Du trenger en if.']],
    muntlig: ['Hvorfor trenger du ikke `if (rabattkode == true)`?', 'Hva skriver programmet ut hvis rabattkode er false?'],
  },
  {
    id: 'if-overfor', ferdighet: 'if', trinn: 'overfor', tittel: 'Overfør: fraktpris i nettbutikk', kilde: 'Egenlaget',
    oppgave: `En nettbutikk har disse reglene:
- Ordre på **500 kr eller mer** får gratis frakt.
- **Medlemmer** får alltid gratis frakt.
- Ellers koster frakt **79 kr**.

Lag variablene \`double sum = 300;\` og \`boolean medlem = false;\` og skriv ut \`Frakt: 79 kr\` eller \`Frakt: 0 kr\`. Skriv en plan (input → behandling → output) først. Test også sum 500 og medlem true.`,
    plan: true,
    hint: ['Gratis frakt hvis (sum >= 500) ELLER medlem.', 'if (sum >= 500 || medlem) { frakt = 0; } else { frakt = 79; }', 'int frakt; … System.out.println("Frakt: " + frakt + " kr");'],
    fasit: java(main('double sum = 300;\nboolean medlem = false;\nint frakt;\n\nif (sum >= 500 || medlem) {\n    frakt = 0;\n} else {\n    frakt = 79;\n}\nSystem.out.println("Frakt: " + frakt + " kr");')),
    fasitKode: main('double sum = 300;\nboolean medlem = false;\nint frakt;\n\nif (sum >= 500 || medlem) {\n    frakt = 0;\n} else {\n    frakt = 79;\n}\nSystem.out.println("Frakt: " + frakt + " kr");'),
    utskrift: 'Frakt: 79 kr',
    krav: [['\\|\\||else\\s+if', 'Du må håndtere begge reglene (|| eller else if).'], ['500', 'Grensen er 500.']],
    muntlig: ['Hvorfor passer `||` her?', 'Hvilke grenseverdier vil du teste?', 'Alternativ: hvordan kunne du skrevet dette med to separate if-er? Fordel/ulempe?'],
  },

  /* ======================= LØKKER ======================= */
  {
    id: 'lok-se', ferdighet: 'lokker', trinn: 'se', tittel: 'Se: for- og while-løkke', kilde: 'Bootcamp 2.5',
    oppgave: `En **løkke** gjentar kode.

**for-løkka** – når du vet hvor mange ganger:
- \`int i = 1\` – startverdi (kjøres én gang).
- \`i <= 5\` – betingelse: fortsett så lenge den er sann.
- \`i++\` – øk i med 1 etter hver runde.

**while-løkka** – når du ikke vet antall runder på forhånd. Husk å endre telleren inne i løkka, ellers blir den evig.`,
    kode: main('for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}\n\nint teller = 1;\nwhile (teller <= 3) {\n    System.out.println("Runde " + teller);\n    teller++;\n}'),
    hint: ['for-løkka skriver 1 til 5.', 'while-løkka skriver Runde 1, 2 og 3.', 'Når teller blir 4, er teller <= 3 usann og løkka stopper.'],
    fasit: 'Utskrift: 1, 2, 3, 4, 5 og deretter Runde 1, Runde 2, Runde 3. Begge løkkene stopper fordi telleren øker til betingelsen blir usann.',
    fasitKode: main('for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}\n\nint teller = 1;\nwhile (teller <= 3) {\n    System.out.println("Runde " + teller);\n    teller++;\n}'),
    utskrift: '1\n2\n3\n4\n5\nRunde 1\nRunde 2\nRunde 3',
    muntlig: ['Hva er de tre delene i en for-løkke?', 'Når bruker du while i stedet for for?'],
  },
  {
    id: 'lok-forutsi', ferdighet: 'lokker', trinn: 'forutsi', tittel: 'Forutsi: hopp på 3', kilde: 'Egenlaget',
    oppgave: 'Hva skriver løkka ut? Skriv tallene med mellomrom. Pass på hva `i += 3` gjør, og når betingelsen blir usann.',
    kode: main('for (int i = 2; i <= 10; i += 3) {\n    System.out.print(i + " ");\n}'),
    hint: ['Start på 2.', 'i += 3 betyr i = i + 3: 2, 5, …', 'Neste etter 8 er 11 – er 11 <= 10?'],
    svar: { sporsmal: 'Utskrift:', godta: ['2 5 8'] },
    fasit: '`2 5 8`. Etter 8 blir i = 11, og 11 <= 10 er usann – løkka stopper.',
    fasitKode: main('for (int i = 2; i <= 10; i += 3) {\n    System.out.print(i + " ");\n}'), utskrift: '2 5 8',
    muntlig: ['Hvor mange ganger kjører løkka? Hvordan vet du det?'],
  },
  {
    id: 'lok-spor', ferdighet: 'lokker', trinn: 'spor', tittel: 'Spor: summen bygges opp', kilde: 'Egenlaget',
    oppgave: 'Lag en tabell med kolonnene **runde**, **i** og **sum** (etter runden). Hva skrives ut til slutt?',
    kode: main('int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n    sum = sum + i;\n}\nSystem.out.println(sum);'),
    hint: ['Før løkka: sum = 0.', 'Runde 1: sum = 0 + 1 = 1. Runde 2: sum = 1 + 2 = 3.', 'Runde 3: 3 + 3 = 6. Runde 4: 6 + 4 = ?'],
    svar: { sporsmal: 'Hva skrives ut?', godta: ['10'] },
    fasit: '| Runde | i | sum |\n|---|---|---|\n| 1 | 1 | 1 |\n| 2 | 2 | 3 |\n| 3 | 3 | 6 |\n| 4 | 4 | 10 |\n\nUtskrift `10`. Mønsteret «start på 0, legg til i hver runde» kalles en **akkumulator**.',
    fasitKode: main('int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n    sum = sum + i;\n}\nSystem.out.println(sum);'), utskrift: '10',
    muntlig: ['Hvorfor må `sum` starte på 0 og stå utenfor løkka?'],
  },
  {
    id: '2.5A', ferdighet: 'lokker', trinn: 'skriv', tittel: 'Tallene 1 til 10', kilde: 'Bootcamp 2.5A',
    oppgave: 'Skriv en `for`-løkke som skriver ut tallene 1 til 10, ett tall per linje.',
    hint: ['Start på 1, stopp etter 10.', 'for (int i = 1; i <= 10; i++) { … }', 'Inni løkka: System.out.println(i);'],
    fasit: java(main('for (int i = 1; i <= 10; i++) {\n    System.out.println(i);\n}')),
    fasitKode: main('for (int i = 1; i <= 10; i++) {\n    System.out.println(i);\n}'),
    utskrift: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
    krav: [['for\\s*\\(', 'Bruk en for-løkke.']],
    muntlig: ['Hva måtte du endre for å skrive 0 til 9 i stedet?', 'Hva skjer hvis du skriver `i < 10`?'],
  },
  {
    id: '2.5B', ferdighet: 'lokker', trinn: 'fullfor', tittel: 'Fullfør: sum 1 til 5', kilde: 'Bootcamp 2.5B',
    oppgave: 'Fyll inn linjen som mangler inne i løkka, slik at programmet skriver ut summen **15**.',
    kode: main('int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    // ? \n}\nSystem.out.println(sum);'),
    hint: ['Hver runde skal i legges til summen.', 'sum = sum + i;', 'Kortform: sum += i;'],
    fasit: java(main('int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum); // 15')),
    fasitKode: main('int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'), utskrift: '15',
    krav: [['sum\\s*(\\+=|=\\s*sum\\s*\\+)', 'Summen må økes med i inne i løkka.']],
    muntlig: ['Hva betyr `sum += i`?'],
  },
  {
    id: '2.5C', ferdighet: 'lokker', trinn: 'rett', tittel: 'Rett: evig løkke', kilde: 'Bootcamp 2.5C',
    oppgave: 'Programmet skal skrive 1 til 5, men stopper aldri. Hva mangler? Skriv instruksjonen som må legges inn i løkka.',
    kode: main('int i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n}'),
    hint: ['Hva skjer med i i hver runde?', 'i endres aldri, så i <= 5 er alltid sann.', 'Øk i med 1.'],
    svar: { sporsmal: 'Linjen som mangler:', godta: ['i++;', 'i++', 'i = i + 1;', 'i = i + 1', 'i += 1;', 'i += 1'] },
    fasit: '`i` økes aldri, så betingelsen er alltid sann → **evig løkke**. Legg inn `i++;` etter println:\n\n' + java(main('int i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    i++;\n}')),
    fasitKode: main('int i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    i++;\n}'), utskrift: '1\n2\n3\n4\n5',
    muntlig: ['Hvorfor er dette en logisk feil og ikke en syntaksfeil?', 'Hvordan oppdager du en evig løkke når du tester?'],
  },
  {
    id: '9.3', ferdighet: 'lokker', trinn: 'skriv', tittel: 'Sum med løkke: 1 til 10', kilde: 'Bootcamp 9.3',
    oppgave: 'Skriv **fra blankt ark** kode som legger sammen tallene fra 1 til 10 og skriver ut summen (`55`).',
    hint: ['Du trenger en sum-variabel og en løkke.', 'int sum = 0;  for (int i = 1; i <= 10; i++) { … }', 'sum += i;  og println etter løkka.'],
    fasit: java(main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum); // 55')),
    fasitKode: main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'), utskrift: '55',
    krav: [['for\\s*\\(|while\\s*\\(', 'Bruk en løkke.']],
    muntlig: ['Hvorfor står println etter løkka og ikke inni?'],
  },
  {
    id: 'lok-endre', ferdighet: 'lokker', trinn: 'endre', tittel: 'Endre: bare partall', kilde: 'Egenlaget',
    oppgave: 'Endre summeprogrammet (1 til 10) slik at det bare legger sammen **partallene** 2, 4, 6, 8 og 10. Svaret skal bli `30`. Det finnes minst to måter – velg én og forklar den andre muntlig.',
    kode: main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'),
    hint: ['Enten: hopp to og to. Eller: sjekk om i er partall.', 'Partall: i % 2 == 0 (resten ved deling på 2 er 0).', 'for (int i = 2; i <= 10; i += 2)  ELLER  if (i % 2 == 0) { sum += i; }'],
    fasit: java(main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) {\n        sum += i;\n    }\n}\nSystem.out.println(sum); // 30')) + '\n\nAlternativ: `for (int i = 2; i <= 10; i += 2)` – færre runder, men mindre tydelig hvis regelen senere endres.',
    fasitKode: main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) {\n        sum += i;\n    }\n}\nSystem.out.println(sum);'), utskrift: '30',
    muntlig: ['Hva gjør `%`?', 'Sammenlign de to løsningene: hvilken ville du valgt, og hvorfor?'],
  },
  {
    id: 'lok-overfor', ferdighet: 'lokker', trinn: 'overfor', tittel: 'Overfør: gangetabellen', kilde: 'Egenlaget',
    oppgave: 'Skriv ut 7-gangen fra 1 til 10 i formatet `7 x 1 = 7`, `7 x 2 = 14` … `7 x 10 = 70`. Lag tallet 7 som en variabel, slik at programmet lett kan vise en annen gangetabell.',
    hint: ['Én løkke fra 1 til 10.', 'int tall = 7; for (int i = 1; i <= 10; i++)', 'System.out.println(tall + " x " + i + " = " + (tall * i));'],
    fasit: java(main('int tall = 7;\nfor (int i = 1; i <= 10; i++) {\n    System.out.println(tall + " x " + i + " = " + (tall * i));\n}')) + '\n\nParentesen rundt `tall * i` sørger for at gangingen skjer før teksten limes sammen.',
    fasitKode: main('int tall = 7;\nfor (int i = 1; i <= 10; i++) {\n    System.out.println(tall + " x " + i + " = " + (tall * i));\n}'),
    utskrift: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
    krav: [['for\\s*\\(|while\\s*\\(', 'Bruk en løkke.']],
    muntlig: ['Hvorfor er det lurt å ha 7 i en variabel?', 'Hva skjer hvis du fjerner parentesen rundt `tall * i`?'],
  },
  {
    id: 'lok-alternativ', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ: samme sum med while', kilde: 'Bootcamp 5.6 / 11',
    oppgave: 'Skriv summen 1 til 10 (`55`) med en **while-løkke** i stedet for for. Forklar deretter muntlig én fordel og én ulempe med hver løkketype, og hvilken du ville valgt her.',
    hint: ['Med while må du selv lage telleren før løkka og øke den inni.', 'int i = 1; while (i <= 10) { … }', 'sum += i;  i++;'],
    fasit: java(main('int sum = 0;\nint i = 1;\nwhile (i <= 10) {\n    sum += i;\n    i++;\n}\nSystem.out.println(sum); // 55')) + '\n\n**for**: start, betingelse og økning på én linje – passer når antall runder er kjent. **while**: passer når du ikke vet antall runder (f.eks. «spør til brukeren skriver stopp»), men det er lettere å glemme `i++`. Her ville jeg valgt for.',
    fasitKode: main('int sum = 0;\nint i = 1;\nwhile (i <= 10) {\n    sum += i;\n    i++;\n}\nSystem.out.println(sum);'), utskrift: '55',
    krav: [['while\\s*\\(', 'Bruk while denne gangen.']],
    muntlig: ['Gi én fordel og én ulempe med for og while.', 'Gi et eksempel der while passer bedre.'],
  },

  /* ======================= LISTER / ARRAYER ======================= */
  {
    id: 'lis-se', ferdighet: 'lister', trinn: 'se', tittel: 'Se: liste med navn', kilde: 'Bootcamp 2.6',
    oppgave: `En **liste** lagrer flere verdier i én variabel.

- \`ArrayList<String> navn = new ArrayList<>();\` – lager en tom liste for tekst.
- \`navn.add("Amina")\` – legger til et element bakerst.
- \`navn.get(0)\` – henter elementet på **indeks 0** (det første!).
- \`navn.size()\` – antall elementer.
- En **array** har fast størrelse: \`int[] t = {4, 9, 2};\` – \`t.length\` og \`t[0]\`.

Løkke gjennom lista: \`for (int i = 0; i < navn.size(); i++)\` eller for-each: \`for (String person : navn)\`.`,
    kode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nnavn.add("Jonas");\nnavn.add("Mina");\n\nSystem.out.println(navn.get(0));\nSystem.out.println(navn.size());\n\nfor (String person : navn) {\n    System.out.println(person);\n}', AL),
    hint: ['get(0) gir det første elementet.', 'size() er 3.', 'for-each skriver alle tre navnene.'],
    fasit: 'Utskrift: Amina, 3, Amina, Jonas, Mina. Indekser starter på 0 – siste element har indeks `size() - 1`.',
    fasitKode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nnavn.add("Jonas");\nnavn.add("Mina");\n\nSystem.out.println(navn.get(0));\nSystem.out.println(navn.size());\n\nfor (String person : navn) {\n    System.out.println(person);\n}', AL),
    utskrift: 'Amina\n3\nAmina\nJonas\nMina',
    muntlig: ['Hva er en liste, og hvorfor er den bedre enn tre separate variabler?', 'Hvorfor har det siste elementet indeks size() - 1?'],
  },
  {
    id: 'lis-forutsi', ferdighet: 'lister', trinn: 'forutsi', tittel: 'Forutsi: indeks og størrelse', kilde: 'Egenlaget',
    oppgave: 'Hva skriver programmet ut? Skriv begge linjene med mellomrom mellom (f.eks. `Ola 2`).',
    kode: main('ArrayList<String> byer = new ArrayList<>();\nbyer.add("Oslo");\nbyer.add("Bergen");\nbyer.add("Tromsø");\nbyer.add("Bodø");\nSystem.out.println(byer.get(2));\nSystem.out.println(byer.size());', AL),
    hint: ['Tell fra 0: Oslo er 0.', 'Bergen er 1, Tromsø er 2.', 'Det er fire byer.'],
    svar: { sporsmal: 'Utskrift (to verdier med mellomrom):', godta: ['Tromsø 4', 'Tromso 4'] },
    fasit: '`Tromsø` og `4`. `get(2)` er det **tredje** elementet fordi indekser starter på 0.',
    fasitKode: main('ArrayList<String> byer = new ArrayList<>();\nbyer.add("Oslo");\nbyer.add("Bergen");\nbyer.add("Tromsø");\nbyer.add("Bodø");\nSystem.out.println(byer.get(2));\nSystem.out.println(byer.size());', AL),
    utskrift: 'Tromsø\n4',
    muntlig: ['Hva ville `byer.get(4)` gitt? Hvilken feiltype er det?'],
  },
  {
    id: 'lis-spor', ferdighet: 'lister', trinn: 'spor', tittel: 'Spor: finn største verdi', kilde: 'Egenlaget (forbereder CASE B)',
    oppgave: 'Spor løkka med kolonnene **tall** og **maks**. Hva er `maks` til slutt? Forklar hvorfor `maks` starter på `t[0]` og ikke på 0.',
    kode: main('int[] t = {4, 9, 2, 7};\nint maks = t[0];\nfor (int tall : t) {\n    if (tall > maks) {\n        maks = tall;\n    }\n}\nSystem.out.println(maks);'),
    hint: ['maks starter på 4.', '9 > 4 → maks = 9. 2 > 9? Nei.', '7 > 9? Nei. maks er fortsatt 9.'],
    svar: { sporsmal: 'Hva skrives ut?', godta: ['9'] },
    fasit: '| tall | maks |\n|---|---|\n| 4 | 4 |\n| 9 | 9 |\n| 2 | 9 |\n| 7 | 9 |\n\nUtskrift `9`. Starter vi på `t[0]`, virker koden også om alle tallene er negative (starter vi på 0, ville svaret blitt feil 0).',
    fasitKode: main('int[] t = {4, 9, 2, 7};\nint maks = t[0];\nfor (int tall : t) {\n    if (tall > maks) {\n        maks = tall;\n    }\n}\nSystem.out.println(maks);'), utskrift: '9',
    muntlig: ['Hvorfor starter maks på t[0]?', 'Hvordan ville du endret koden for å finne minste verdi?'],
  },
  {
    id: '2.6A', ferdighet: 'lister', trinn: 'skriv', tittel: 'Tre byer i en liste', kilde: 'Bootcamp 2.6A',
    oppgave: 'Lag en `ArrayList<String>` med byene **Oslo**, **Bergen** og **Trondheim**. Skriv ut alle byene med en løkke (én per linje).',
    hint: ['Husk import java.util.ArrayList; øverst.', 'ArrayList<String> byer = new ArrayList<>(); byer.add("Oslo"); …', 'for (String by : byer) { System.out.println(by); }'],
    fasit: java(main('ArrayList<String> byer = new ArrayList<>();\nbyer.add("Oslo");\nbyer.add("Bergen");\nbyer.add("Trondheim");\n\nfor (String by : byer) {\n    System.out.println(by);\n}', AL)),
    fasitKode: main('ArrayList<String> byer = new ArrayList<>();\nbyer.add("Oslo");\nbyer.add("Bergen");\nbyer.add("Trondheim");\n\nfor (String by : byer) {\n    System.out.println(by);\n}', AL),
    utskrift: 'Oslo\nBergen\nTrondheim',
    krav: [['ArrayList|\\[\\]', 'Bruk en liste eller array.'], ['for\\s*\\(', 'Skriv ut med en løkke.']],
    muntlig: ['Hva er fordelen med løkke her i stedet for tre println?'],
  },
  {
    id: '2.6B', ferdighet: 'lister', trinn: 'skriv', tittel: 'Summen av fem priser', kilde: 'Bootcamp 2.6B',
    oppgave: 'Lag en array med fem priser: `49.0, 120.0, 35.5, 80.0, 15.5`. Beregn summen med en løkke og skriv ut `Sum: 300.0`.',
    hint: ['double[] priser = {49.0, 120.0, 35.5, 80.0, 15.5};', 'double sum = 0; og en løkke over priser.', 'for (double p : priser) { sum += p; }'],
    fasit: java(main('double[] priser = {49.0, 120.0, 35.5, 80.0, 15.5};\ndouble sum = 0;\nfor (double p : priser) {\n    sum += p;\n}\nSystem.out.println("Sum: " + sum);')),
    fasitKode: main('double[] priser = {49.0, 120.0, 35.5, 80.0, 15.5};\ndouble sum = 0;\nfor (double p : priser) {\n    sum += p;\n}\nSystem.out.println("Sum: " + sum);'),
    utskrift: 'Sum: 300.0',
    krav: [['double\\s*\\[\\]|ArrayList<Double>', 'Lagre prisene i en array/liste av desimaltall.'], ['for\\s*\\(', 'Bruk en løkke.']],
    muntlig: ['Hvorfor er dette mer gjenbrukbart enn `49.0 + 120.0 + …`?'],
  },
  {
    id: '2.6C', ferdighet: 'lister', trinn: 'fullfor', tittel: 'Fullfør: tell temperaturer over 20', kilde: 'Bootcamp 2.6C',
    oppgave: 'Fullfør løkka slik at den teller hvor mange temperaturer som er **over** 20 grader (20 skal ikke telles). Forventet utskrift: `2`.',
    kode: main('int[] temp = {18, 21, 20, 26, 9};\nint antall = 0;\nfor (int i = 0; i < temp.length; i++) {\n    // ?\n}\nSystem.out.println(antall);'),
    hint: ['Inni løkka: sjekk ett element, og øk telleren hvis det passer.', 'if (temp[i] > 20) { … }', 'antall++;'],
    fasit: java(main('int[] temp = {18, 21, 20, 26, 9};\nint antall = 0;\nfor (int i = 0; i < temp.length; i++) {\n    if (temp[i] > 20) {\n        antall++;\n    }\n}\nSystem.out.println(antall); // 2')) + '\n\n«Over 20» betyr `> 20`. Med `>= 20` ville 20 også blitt talt (svar 3) – en typisk grenseverdifeil.',
    fasitKode: main('int[] temp = {18, 21, 20, 26, 9};\nint antall = 0;\nfor (int i = 0; i < temp.length; i++) {\n    if (temp[i] > 20) {\n        antall++;\n    }\n}\nSystem.out.println(antall);'), utskrift: '2',
    krav: [['>\\s*20', 'Over 20: bruk > 20.'], ['antall\\s*(\\+\\+|\\+=)', 'Øk telleren antall.']],
    muntlig: ['Hva er forskjellen på `> 20` og `>= 20` her?', 'Hvorfor står det `i < temp.length` og ikke `<=`?'],
  },
  {
    id: 'lis-rett', ferdighet: 'lister', trinn: 'rett', tittel: 'Rett: løkka går én for langt', kilde: 'Egenlaget (off-by-one)',
    oppgave: 'Programmet skriver ut navnene, men krasjer til slutt med `IndexOutOfBoundsException`. Hvilken **type feil** er dette? Rett løkka.',
    kode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nnavn.add("Jonas");\nnavn.add("Mina");\n\nfor (int i = 0; i <= navn.size(); i++) {\n    System.out.println(navn.get(i));\n}', AL),
    hint: ['Lista har indeks 0, 1 og 2. Hvilken verdi får i i siste runde?', 'i blir 3, og get(3) finnes ikke.', 'Bytt <= med <.'],
    svar: { sporsmal: 'Feiltype (syntaksfeil, kjøretidsfeil eller logisk feil):', godta: ['kjøretidsfeil', 'kjøretid', 'runtime', 'kjoretidsfeil'] },
    fasit: 'Det er en **kjøretidsfeil**: koden kompilerer, men krasjer når `i = 3`. Årsaken er en **off-by-one-feil**: `<=` må være `<`.\n\n' + java(main('for (int i = 0; i < navn.size(); i++) {\n    System.out.println(navn.get(i));\n}')),
    fasitKode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nnavn.add("Jonas");\nnavn.add("Mina");\n\nfor (int i = 0; i < navn.size(); i++) {\n    System.out.println(navn.get(i));\n}', AL),
    utskrift: 'Amina\nJonas\nMina',
    muntlig: ['Hva er en off-by-one-feil?', 'Hvordan kunne en for-each-løkke ha unngått feilen?'],
  },
  {
    id: 'lis-endre', ferdighet: 'lister', trinn: 'endre', tittel: 'Endre: gjennomsnittstemperatur', kilde: 'Egenlaget',
    oppgave: 'Ta utgangspunkt i temperaturene `{18, 21, 20, 26, 9}`. Endre programmet slik at det i stedet beregner **gjennomsnittet** og skriver `Snitt: 18.8`. Pass på heltallsdivisjon!',
    kode: main('int[] temp = {18, 21, 20, 26, 9};\nint antall = 0;\nfor (int i = 0; i < temp.length; i++) {\n    if (temp[i] > 20) {\n        antall++;\n    }\n}\nSystem.out.println(antall);'),
    hint: ['Gjennomsnitt = sum / antall elementer.', 'Bygg opp sum i løkka, del på temp.length etterpå.', 'double snitt = (double) sum / temp.length;'],
    fasit: java(main('int[] temp = {18, 21, 20, 26, 9};\nint sum = 0;\nfor (int t : temp) {\n    sum += t;\n}\ndouble snitt = (double) sum / temp.length;\nSystem.out.println("Snitt: " + snitt);')) + '\n\n`(double)` gjør at divisjonen gir desimaler. Uten blir `94 / 5` = `18`.',
    fasitKode: main('int[] temp = {18, 21, 20, 26, 9};\nint sum = 0;\nfor (int t : temp) {\n    sum += t;\n}\ndouble snitt = (double) sum / temp.length;\nSystem.out.println("Snitt: " + snitt);'),
    utskrift: 'Snitt: 18.8',
    krav: [['length|size\\(\\)', 'Del på antall elementer (length/size()).'], ['double', 'Gjennomsnittet bør være double.']],
    muntlig: ['Hva er heltallsdivisjon, og hvordan unngikk du den?'],
  },
  {
    id: 'lis-overfor', ferdighet: 'lister', trinn: 'overfor', tittel: 'Overfør: handleliste', kilde: 'Bootcamp 13.3 Case 7 (mini)',
    oppgave: `Lag en handleliste (\`ArrayList<String>\`) med **melk**, **brød** og **egg**. Skriv ut nummerert og antall:

\`\`\`text
1. melk
2. brød
3. egg
Antall varer: 3
\`\`\`
Skriv planen først: hvilke data, hvilken løkke, hva skrives ut?`,
    plan: true,
    hint: ['Nummeret er indeksen + 1.', 'for (int i = 0; i < liste.size(); i++)', 'System.out.println((i + 1) + ". " + liste.get(i));  og til slutt size().'],
    fasit: java(main('ArrayList<String> liste = new ArrayList<>();\nliste.add("melk");\nliste.add("brød");\nliste.add("egg");\n\nfor (int i = 0; i < liste.size(); i++) {\n    System.out.println((i + 1) + ". " + liste.get(i));\n}\nSystem.out.println("Antall varer: " + liste.size());', AL)),
    fasitKode: main('ArrayList<String> liste = new ArrayList<>();\nliste.add("melk");\nliste.add("brød");\nliste.add("egg");\n\nfor (int i = 0; i < liste.size(); i++) {\n    System.out.println((i + 1) + ". " + liste.get(i));\n}\nSystem.out.println("Antall varer: " + liste.size());', AL),
    utskrift: '1. melk\n2. brød\n3. egg\nAntall varer: 3',
    krav: [['ArrayList', 'Bruk ArrayList (lista skal kunne vokse).'], ['size\\(\\)', 'Bruk size() for antallet.']],
    muntlig: ['Hvorfor passer ArrayList bedre enn array for en handleliste?', 'Hvordan kunne du lagret lista i en fil, og hvilket format ville du brukt?'],
  },
  {
    id: 'lis-alternativ', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ: array eller ArrayList?', kilde: 'Bootcamp 11 eksempel 2',
    oppgave: 'Svar høyt: Når ville du brukt en **array** (`int[]`), og når en **ArrayList**? Gi én fordel og én ulempe med hver, og si hva du ville valgt for (a) ukedagenes besøkstall og (b) en handleliste.',
    hint: ['Tenk på om antallet elementer er kjent.', 'Array: fast størrelse. ArrayList: kan vokse, har add/remove.', '(a) 5 eller 7 dager – kjent antall. (b) varer legges til underveis.'],
    fasit: '«En array har fast størrelse og er enkel når antallet er kjent, for eksempel fem ukedager. En ArrayList kan vokse og krympe og har metoder som `add` og `remove`, men er litt mer omfattende å skrive. For besøkstall per ukedag ville jeg valgt array, for handlelista ArrayList fordi varer legges til og fjernes.»',
    sjekk: ['Jeg nevnte fast vs. dynamisk størrelse', 'Jeg ga én fordel og én ulempe for hver', 'Jeg valgte og begrunnet for begge situasjonene'],
    muntlig: ['Hva skjer hvis du prøver å legge til et ekstra element i en full array?'],
  },

  /* ======================= METODER ======================= */
  {
    id: 'met-se', ferdighet: 'metoder', trinn: 'se', tittel: 'Se: metode med parameter og returverdi', kilde: 'Bootcamp 2.7',
    oppgave: `En **metode** er en navngitt kodeblokk som gjør én oppgave. Den kan **kalles** mange ganger.

- \`public static int summer(int a, int b)\`:
  - \`int\` foran navnet = **returtypen** (hva metoden gir tilbake).
  - \`summer\` = navnet.
  - \`int a, int b\` = **parametere** (verdier metoden får inn).
- \`return a + b;\` sender resultatet tilbake til der metoden ble kalt.
- \`void\` betyr at metoden ikke returnerer noe (den gjør bare noe, f.eks. skriver ut).
- \`static\` gjør at du kan kalle metoden fra \`main\` uten å lage et objekt.

Metodene skrives **inne i klassen, men utenfor main**.`,
    kode: main('int resultat = summer(4, 5);\nSystem.out.println(resultat);\nsiHei("Amina");', '', 'public static int summer(int a, int b) {\n    return a + b;\n}\n\npublic static void siHei(String navn) {\n    System.out.println("Hei " + navn);\n}'),
    hint: ['summer(4, 5) gir 9.', 'resultat = 9 skrives ut.', 'siHei skriver «Hei Amina».'],
    fasit: 'Utskrift: `9` og `Hei Amina`. Når `summer(4, 5)` kalles, får `a` verdien 4 og `b` verdien 5 (argumentene). `return` sender 9 tilbake og lagres i `resultat`.',
    fasitKode: main('int resultat = summer(4, 5);\nSystem.out.println(resultat);\nsiHei("Amina");', '', 'public static int summer(int a, int b) {\n    return a + b;\n}\n\npublic static void siHei(String navn) {\n    System.out.println("Hei " + navn);\n}'),
    utskrift: '9\nHei Amina',
    muntlig: ['Hva er forskjellen på en parameter og en returverdi?', 'Hva betyr `void`?'],
  },
  {
    id: 'met-forutsi', ferdighet: 'metoder', trinn: 'forutsi', tittel: 'Forutsi: to metodekall', kilde: 'Egenlaget',
    oppgave: 'Hva skriver programmet ut? Regn ut hvert metodekall for seg først.',
    kode: main('System.out.println(kvadrat(3) + kvadrat(2));', '', 'public static int kvadrat(int x) {\n    return x * x;\n}'),
    hint: ['kvadrat(3) = 3 * 3.', 'kvadrat(2) = 2 * 2.', '9 + 4 = ?'],
    svar: { sporsmal: 'Utskrift:', godta: ['13'] },
    fasit: '`13`. `kvadrat(3)` returnerer 9 og `kvadrat(2)` returnerer 4. Det er to tall, så `+` er addisjon.',
    fasitKode: main('System.out.println(kvadrat(3) + kvadrat(2));', '', 'public static int kvadrat(int x) {\n    return x * x;\n}'), utskrift: '13',
    muntlig: ['Hva skjer i minnet når kvadrat(3) kalles – hvilken verdi får x?'],
  },
  {
    id: 'met-spor', ferdighet: 'metoder', trinn: 'spor', tittel: 'Spor: metodekall inni metodekall', kilde: 'Egenlaget',
    oppgave: 'Spor kallet `beregn(beregn(2))`. Start med det innerste kallet. Hva skrives ut?',
    kode: main('int r = beregn(beregn(2));\nSystem.out.println(r);', '', 'public static int beregn(int a) {\n    int b = a * 2;\n    return b + 1;\n}'),
    hint: ['Innerst: beregn(2): b = 4, returnerer 5.', 'Så beregn(5): b = 10, returnerer …', '10 + 1.'],
    svar: { sporsmal: 'Utskrift:', godta: ['11'] },
    fasit: 'Innerst: `beregn(2)` → b = 4 → returnerer **5**. Deretter `beregn(5)` → b = 10 → returnerer **11**. Variabelen `b` finnes bare inne i metoden (lokal variabel).',
    fasitKode: main('int r = beregn(beregn(2));\nSystem.out.println(r);', '', 'public static int beregn(int a) {\n    int b = a * 2;\n    return b + 1;\n}'), utskrift: '11',
    muntlig: ['Hva er en lokal variabel? Kan main bruke `b`?'],
  },
  {
    id: '2.7A', ferdighet: 'metoder', trinn: 'skriv', tittel: 'Metoden doble', kilde: 'Bootcamp 2.7A',
    oppgave: 'Skriv metoden `doble(int tall)` som **returnerer** tallet ganget med 2. Kall den fra `main` med 7 og skriv ut resultatet (`14`).',
    hint: ['Metoden skal returnere et heltall → returtype int.', 'public static int doble(int tall) { … }', 'return tall * 2;  og i main: System.out.println(doble(7));'],
    fasit: java(main('System.out.println(doble(7)); // 14', '', 'public static int doble(int tall) {\n    return tall * 2;\n}')),
    fasitKode: main('System.out.println(doble(7));', '', 'public static int doble(int tall) {\n    return tall * 2;\n}'), utskrift: '14',
    krav: [['static\\s+int\\s+doble\\s*\\(\\s*int', 'Metoden skal hete doble, ta en int og returnere int.'], ['return', 'Metoden må returnere verdien.']],
    muntlig: ['Hvorfor bruker du `return` og ikke `println` inne i metoden?'],
  },
  {
    id: '2.7B', ferdighet: 'metoder', trinn: 'skriv', tittel: 'Metoden erMyndig', kilde: 'Bootcamp 2.7B',
    oppgave: 'Skriv metoden `erMyndig(int alder)` som returnerer `true` dersom alderen er minst 18, ellers `false`. Test i `main` med 17 og 18 – utskrift `false` og `true`.',
    hint: ['Returtypen er boolean.', 'Uttrykket alder >= 18 ER allerede true eller false.', 'return alder >= 18;'],
    fasit: java(main('System.out.println(erMyndig(17)); // false\nSystem.out.println(erMyndig(18)); // true', '', 'public static boolean erMyndig(int alder) {\n    return alder >= 18;\n}')),
    fasitKode: main('System.out.println(erMyndig(17));\nSystem.out.println(erMyndig(18));', '', 'public static boolean erMyndig(int alder) {\n    return alder >= 18;\n}'),
    utskrift: 'false\ntrue',
    krav: [['boolean\\s+erMyndig', 'Returtypen skal være boolean.']],
    muntlig: ['Hvorfor testet du akkurat 17 og 18?', 'Hvordan kunne du skrevet metoden med if/else? Hva er best?'],
  },
  {
    id: '9.5', ferdighet: 'metoder', trinn: 'fullfor', tittel: 'Fullfør: største av to tall', kilde: 'Bootcamp 9.5',
    oppgave: 'Fullfør metoden `storst` slik at den returnerer den største av to heltall. `storst(4, 9)` skal gi `9`, og `storst(12, 3)` skal gi `12`.',
    kode: main('System.out.println(storst(4, 9));\nSystem.out.println(storst(12, 3));', '', 'public static int storst(int a, int b) {\n    // ?\n}'),
    hint: ['Sammenlign a og b.', 'if (a > b) { return a; }', 'Etter if-en: return b;'],
    fasit: java('public static int storst(int a, int b) {\n    if (a > b) {\n        return a;\n    }\n    return b;\n}') + '\n\nAlternativ: `return Math.max(a, b);` – kortere, men du viser mindre av logikken selv.',
    fasitKode: main('System.out.println(storst(4, 9));\nSystem.out.println(storst(12, 3));', '', 'public static int storst(int a, int b) {\n    if (a > b) {\n        return a;\n    }\n    return b;\n}'),
    utskrift: '9\n12',
    krav: [['return', 'Metoden må returnere en verdi.']],
    muntlig: ['Hva returnerer metoden hvis a og b er like?', 'Alternativ: Math.max – fordel og ulempe?'],
  },
  {
    id: 'met-rett', ferdighet: 'metoder', trinn: 'rett', tittel: 'Rett: void som returnerer', kilde: 'Egenlaget',
    oppgave: 'Programmet kompilerer ikke: *incompatible types: unexpected return value*. Hvilket ord i metodehodet må byttes ut, og med hva?',
    kode: main('int svar = trippel(5);\nSystem.out.println(svar);', '', 'public static void trippel(int tall) {\n    return tall * 3;\n}'),
    hint: ['Se på returtypen foran metodenavnet.', 'void betyr «returnerer ingenting», men metoden prøver å returnere et tall.', 'Bytt void med int.'],
    svar: { sporsmal: 'Hvilket ord må byttes ut?', godta: ['void', 'void med int', 'void til int'] },
    fasit: '`void` må byttes med `int`: metoden returnerer et heltall. Dette er en **syntaks-/kompileringsfeil** – kompilatoren stopper før programmet kjører. Rettet utskrift: `15`.',
    fasitKode: main('int svar = trippel(5);\nSystem.out.println(svar);', '', 'public static int trippel(int tall) {\n    return tall * 3;\n}'), utskrift: '15',
    muntlig: ['Hvordan hjelper feilmeldingen deg å finne linjen?'],
  },
  {
    id: '2.7C', ferdighet: 'metoder', trinn: 'skriv', tittel: 'Metode som summerer en liste', kilde: 'Bootcamp 2.7C',
    oppgave: 'Skriv en metode `summer(int[] tall)` som mottar en array med heltall og **returnerer** summen. Kall den med `{3, 5, 2, 4}` (svar `14`) og med `{10, 20}` (svar `30`). Forklar muntlig hvorfor dette er mer gjenbrukbart enn å kopiere summekoden flere steder.',
    hint: ['Parameteren er int[] tall; returtypen er int.', 'Inne i metoden: int sum = 0; og en løkke over tall.', 'return sum;  og i main: System.out.println(summer(new int[]{3, 5, 2, 4}));'],
    fasit: java(main('int[] a = {3, 5, 2, 4};\nint[] b = {10, 20};\nSystem.out.println(summer(a)); // 14\nSystem.out.println(summer(b)); // 30', '', 'public static int summer(int[] tall) {\n    int sum = 0;\n    for (int t : tall) {\n        sum += t;\n    }\n    return sum;\n}')),
    fasitKode: main('int[] a = {3, 5, 2, 4};\nint[] b = {10, 20};\nSystem.out.println(summer(a));\nSystem.out.println(summer(b));', '', 'public static int summer(int[] tall) {\n    int sum = 0;\n    for (int t : tall) {\n        sum += t;\n    }\n    return sum;\n}'),
    utskrift: '14\n30',
    krav: [['int\\s*\\[\\]\\s*\\w+\\s*\\)', 'Metoden skal ta en int[] som parameter.'], ['return', 'Returner summen.']],
    muntlig: ['Hvorfor er en metode med parameter mer gjenbrukbar?', 'Hvordan ville du testet metoden? Tenk på tom array.'],
  },
  {
    id: 'met-endre', ferdighet: 'metoder', trinn: 'endre', tittel: 'Endre: flytt prisberegningen til en metode', kilde: 'Bootcamp 2.8 punkt 5 + alternativ løsning',
    oppgave: 'Lag metoden `beregnPris(int alder, double grunnpris)` som returnerer billettprisen (barn under 18: 40 % rabatt, fra 67: 25 % rabatt). Kall den fra `main` for alder 12, 30 og 70 med grunnpris 150. Forventet: `90.0`, `150.0`, `112.5`.',
    hint: ['Flytt if/else-kjeden inn i metoden og bytt pris = … med return ….', 'public static double beregnPris(int alder, double grunnpris)', 'if (alder < 18) return grunnpris * 0.60; else if (alder >= 67) return grunnpris * 0.75; return grunnpris;'],
    fasit: java(main('System.out.println(beregnPris(12, 150));\nSystem.out.println(beregnPris(30, 150));\nSystem.out.println(beregnPris(70, 150));', '', 'public static double beregnPris(int alder, double grunnpris) {\n    if (alder < 18) {\n        return grunnpris * 0.60;\n    } else if (alder >= 67) {\n        return grunnpris * 0.75;\n    }\n    return grunnpris;\n}')) + '\n\nFordel: metoden kan testes separat og gjenbrukes. Ulempe: programmet får flere deler å holde oversikt over.',
    fasitKode: main('System.out.println(beregnPris(12, 150));\nSystem.out.println(beregnPris(30, 150));\nSystem.out.println(beregnPris(70, 150));', '', 'public static double beregnPris(int alder, double grunnpris) {\n    if (alder < 18) {\n        return grunnpris * 0.60;\n    } else if (alder >= 67) {\n        return grunnpris * 0.75;\n    }\n    return grunnpris;\n}'),
    utskrift: '90.0\n150.0\n112.5',
    krav: [['double\\s+beregnPris\\s*\\(', 'Metoden skal hete beregnPris og returnere double.'], ['return', 'Bruk return.']],
    muntlig: ['Sammenlign: all logikk i main vs. egen metode. Hva er fordelen og ulempen?', 'Hvordan gjør metoden testingen enklere?'],
  },
  {
    id: '9.10', ferdighet: 'metoder', trinn: 'forklar', tittel: 'Forklar: gjenbruk med metoder', kilde: 'Bootcamp 9.10',
    oppgave: 'Du har kopiert den samme rabattberegningen tre steder i et program. Forklar høyt **hvordan** du kan gjøre koden mer gjenbrukbar, og **hvorfor** det er bedre. Bruk begrepene metode, parameter, returverdi og DRY.',
    hint: ['Hva skjer hvis rabatten endres og du har tre kopier?', 'Samle beregningen ett sted.', 'En metode med parametere (pris, rabatt) og returverdi (ny pris).'],
    fasit: '«Jeg ville laget en metode, for eksempel `beregnRabatt(double pris, double rabatt)`, som returnerer ny pris. De tre stedene kaller metoden i stedet for å ha egen kopi. Fordelen er at endringer bare gjøres ett sted (DRY – Don\'t Repeat Yourself), det blir færre feil, og metoden kan testes alene. Ulempen er litt mer struktur å holde oversikt over.»',
    sjekk: ['Jeg foreslo en metode med parameter og returverdi', 'Jeg forklarte hvorfor (endring ett sted / færre feil / testbar)', 'Jeg brukte begrepet gjenbruk eller DRY'],
    muntlig: ['Hva betyr DRY?'],
  },
  {
    id: 'met-overfor', ferdighet: 'metoder', trinn: 'overfor', tittel: 'Overfør: tre små metoder', kilde: 'Egenlaget (lørdag 14:15: «skriv tre funksjoner selv»)',
    oppgave: `Skriv tre metoder fra blankt ark og kall dem fra \`main\`:

1. \`arealRektangel(double b, double h)\` – returnerer areal. \`arealRektangel(4, 2.5)\` → \`10.0\`
2. \`erPartall(int n)\` – returnerer true/false. \`erPartall(7)\` → \`false\`
3. \`hils(String navn)\` – \`void\`, skriver \`Hei, Ola!\` når den kalles med "Ola".`,
    plan: true,
    hint: ['To metoder returnerer noe (double, boolean), én er void.', 'return b * h;   return n % 2 == 0;', 'public static void hils(String navn) { System.out.println("Hei, " + navn + "!"); }'],
    fasit: java(main('System.out.println(arealRektangel(4, 2.5));\nSystem.out.println(erPartall(7));\nhils("Ola");', '', 'public static double arealRektangel(double b, double h) {\n    return b * h;\n}\n\npublic static boolean erPartall(int n) {\n    return n % 2 == 0;\n}\n\npublic static void hils(String navn) {\n    System.out.println("Hei, " + navn + "!");\n}')),
    fasitKode: main('System.out.println(arealRektangel(4, 2.5));\nSystem.out.println(erPartall(7));\nhils("Ola");', '', 'public static double arealRektangel(double b, double h) {\n    return b * h;\n}\n\npublic static boolean erPartall(int n) {\n    return n % 2 == 0;\n}\n\npublic static void hils(String navn) {\n    System.out.println("Hei, " + navn + "!");\n}'),
    utskrift: '10.0\nfalse\nHei, Ola!',
    krav: [['void\\s+hils', 'hils skal være void.'], ['boolean\\s+erPartall', 'erPartall skal returnere boolean.']],
    muntlig: ['Hvorfor er hils void, men de to andre ikke?', 'Hvordan ville du testet erPartall? Nevn grenser/spesialtilfeller (0, negative tall).'],
  },
  {
    id: 'met-alternativ', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ: én lang main eller metoder?', kilde: 'Bootcamp 11 eksempel 3',
    oppgave: 'Sensor spør: «Kunne du løst billettkalkulatoren på en annen måte?» Svar etter oppskriften: (1) din løsning, (2) ett alternativ, (3) én fordel og én ulempe, (4) hva du velger her og hvorfor.',
    hint: ['Din løsning kan være all logikk i main.', 'Alternativet: egen metode beregnPris.', 'Fordel: testbar/gjenbruk. Ulempe: flere deler.'],
    fasit: '«Jeg la all logikken i `main`. Et alternativ er en egen metode `beregnPris(alder, grunnpris)`. Fordelen er at metoden kan testes alene og gjenbrukes, for eksempel i en nettside og en kasse. Ulempen er at programmet får flere deler. For et lite program er begge mulige, men jeg ville valgt metoden fordi prisreglene ofte endres og da er det lettere å teste.»',
    sjekk: ['Jeg beskrev min løsning', 'Jeg ga ett konkret alternativ', 'Jeg ga én fordel og én ulempe', 'Jeg valgte og begrunnet'],
    muntlig: ['Hva er et annet alternativ – f.eks. switch eller en tabell med priser?'],
  },
];
