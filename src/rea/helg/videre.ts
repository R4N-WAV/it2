/*
 * Helgesprint – OOP, modellering, feilsøking, testing, data, alternativer og muntlig bredde.
 * Java er treningsspråket (helgepraksisfilen), ikke et eksamenskrav.
 */
import { java, main, medKlasser } from './java';
import type { HelgOppgave } from './typer';

const AL = 'import java.util.ArrayList;';

const BOK = `class Bok {
    String tittel;
    String forfatter;
    boolean tilgjengelig;

    Bok(String tittel, String forfatter) {
        this.tittel = tittel;
        this.forfatter = forfatter;
        this.tilgjengelig = true;
    }

    void lanUt() {
        if (tilgjengelig) {
            tilgjengelig = false;
            System.out.println(tittel + " er nå lånt ut.");
        } else {
            System.out.println(tittel + " er allerede lånt ut.");
        }
    }

    void leverTilbake() {
        tilgjengelig = true;
        System.out.println(tittel + " er levert tilbake.");
    }
}`;

const PRODUKT = `class Produkt {
    String navn;
    double pris;

    Produkt(String navn, double pris) {
        this.navn = navn;
        this.pris = pris;
    }

    void visInfo() {
        System.out.println(navn + " koster " + pris + " kr");
    }
}`;

const PC = `class PC {
    String serienummer;
    boolean tilgjengelig;

    PC(String serienummer) {
        this.serienummer = serienummer;
        this.tilgjengelig = true;
    }

    boolean lanUt() {
        if (tilgjengelig) {
            tilgjengelig = false;
            return true;
        }
        return false;
    }

    void leverTilbake() {
        tilgjengelig = true;
    }
}`;

export const VIDERE: HelgOppgave[] = [
  /* ======================= OOP ======================= */
  {
    id: 'oop-se', ferdighet: 'oop', trinn: 'se', tittel: 'Se: klasse, objekt, attributt, metode', kilde: 'Bootcamp 3.1–3.3',
    oppgave: `- En **klasse** er en mal/oppskrift: \`Bok\`.
- Et **objekt** er en konkret ting laget fra klassen: \`bok1\` («Sult»), \`bok2\` («Naiv. Super.»).
- **Attributter** er dataene objektet har: \`tittel\`, \`forfatter\`, \`tilgjengelig\`.
- **Metoder** er det objektet kan gjøre: \`lanUt()\`, \`leverTilbake()\`.
- **Konstruktøren** \`Bok(String tittel, String forfatter)\` kjøres når objektet lages med \`new\`.
- \`this.tittel\` = attributtet til *dette* objektet; \`tittel\` alene = parameteren.
- Punktum brukes til å kalle metoder: \`bok1.lanUt()\`.

Hvert objekt husker sin egen **tilstand**: å låne ut \`bok1\` påvirker ikke \`bok2\`.`,
    kode: medKlasser(BOK, 'Bok bok1 = new Bok("Sult", "Knut Hamsun");\nBok bok2 = new Bok("Naiv. Super.", "Erlend Loe");\nbok1.lanUt();\nbok1.lanUt();\nbok2.lanUt();'),
    hint: ['bok1.lanUt() første gang: tilgjengelig er true.', 'Andre gang: tilgjengelig er nå false.', 'bok2 har sin egen tilstand og kan lånes ut.'],
    fasit: 'Utskrift: «Sult er nå lånt ut.», «Sult er allerede lånt ut.», «Naiv. Super. er nå lånt ut.» – to objekter av samme klasse, hver med egen tilstand.',
    fasitKode: medKlasser(BOK, 'Bok bok1 = new Bok("Sult", "Knut Hamsun");\nBok bok2 = new Bok("Naiv. Super.", "Erlend Loe");\nbok1.lanUt();\nbok1.lanUt();\nbok2.lanUt();'),
    utskrift: 'Sult er nå lånt ut.\nSult er allerede lånt ut.\nNaiv. Super. er nå lånt ut.',
    muntlig: ['Hva er forskjellen på klasse og objekt? Bruk Bok som eksempel.', 'Hva gjør konstruktøren?'],
  },
  {
    id: 'oop-forutsi', ferdighet: 'oop', trinn: 'forutsi', tittel: 'Forutsi: lån, lever, lån', kilde: 'Egenlaget',
    oppgave: 'Hva skriver den **tredje** linjen ut? Følg verdien av `tilgjengelig` for objektet.',
    kode: medKlasser(BOK, 'Bok b = new Bok("Sult", "Knut Hamsun");\nb.lanUt();\nb.leverTilbake();\nb.lanUt();'),
    hint: ['Etter konstruktøren: tilgjengelig = true.', 'lanUt → false. leverTilbake → true.', 'Tredje kall er lanUt igjen med tilgjengelig = true.'],
    svar: { sporsmal: 'Tredje linje:', godta: ['Sult er nå lånt ut.', 'Sult er nå lånt ut'] },
    fasit: '«Sult er nå lånt ut.» – `leverTilbake()` satte `tilgjengelig` tilbake til true, så boken kan lånes igjen. Linjene er: lånt ut / levert tilbake / lånt ut.',
    fasitKode: medKlasser(BOK, 'Bok b = new Bok("Sult", "Knut Hamsun");\nb.lanUt();\nb.leverTilbake();\nb.lanUt();'),
    utskrift: 'Sult er nå lånt ut.\nSult er levert tilbake.\nSult er nå lånt ut.',
    muntlig: ['Hva menes med at et objekt har tilstand?'],
  },
  {
    id: 'oop-spor', ferdighet: 'oop', trinn: 'spor', tittel: 'Spor: konto med innkapsling', kilde: 'Bootcamp 3.6 (variant)',
    oppgave: 'Spor `saldo` gjennom programmet. Hva skrives ut? Forklar hvorfor `settInn(-50)` ikke endrer saldoen, og hvorfor `saldo` er `private`.',
    kode: medKlasser('class Konto {\n    private double saldo;\n\n    Konto(double startSaldo) {\n        saldo = startSaldo;\n    }\n\n    public double hentSaldo() {\n        return saldo;\n    }\n\n    public void settInn(double belop) {\n        if (belop > 0) {\n            saldo += belop;\n        }\n    }\n}', 'Konto k = new Konto(200);\nk.settInn(100);\nk.settInn(-50);\nSystem.out.println(k.hentSaldo());'),
    hint: ['Start: 200.', 'settInn(100): 100 > 0 → saldo 300.', 'settInn(-50): -50 > 0 er usann → ingenting skjer.'],
    svar: { sporsmal: 'Utskrift:', godta: ['300.0', '300'] },
    fasit: '`300.0`. Metoden `settInn` kontrollerer at beløpet er positivt. Fordi `saldo` er `private`, kan ikke kode utenfor klassen skrive `k.saldo = -1000` – all endring må gå gjennom metodene. Det kalles **innkapsling**.',
    fasitKode: medKlasser('class Konto {\n    private double saldo;\n\n    Konto(double startSaldo) {\n        saldo = startSaldo;\n    }\n\n    public double hentSaldo() {\n        return saldo;\n    }\n\n    public void settInn(double belop) {\n        if (belop > 0) {\n            saldo += belop;\n        }\n    }\n}', 'Konto k = new Konto(200);\nk.settInn(100);\nk.settInn(-50);\nSystem.out.println(k.hentSaldo());'),
    utskrift: '300.0',
    muntlig: ['Hva er innkapsling, og hvorfor er det nyttig?'],
  },
  {
    id: '9.6', ferdighet: 'oop', trinn: 'fullfor', tittel: 'Fullfør: konstruktøren i Produkt', kilde: 'Bootcamp 9.6',
    oppgave: 'Konstruktøren i `Produkt` mangler innholdet. Fyll inn de to linjene som lagrer parameterne i attributtene. Programmet skal skrive `Melk koster 24.9 kr`.',
    kode: medKlasser('class Produkt {\n    String navn;\n    double pris;\n\n    Produkt(String navn, double pris) {\n        // ?\n        // ?\n    }\n\n    void visInfo() {\n        System.out.println(navn + " koster " + pris + " kr");\n    }\n}', 'Produkt p = new Produkt("Melk", 24.9);\np.visInfo();'),
    hint: ['Parameteren og attributtet har samme navn.', 'Bruk this for å vise til objektets attributt.', 'this.navn = navn;  this.pris = pris;'],
    fasit: java(PRODUKT) + '\n\n`this.navn` er attributtet i objektet, `navn` er parameteren som ble sendt inn med `new Produkt("Melk", 24.9)`.',
    fasitKode: medKlasser(PRODUKT, 'Produkt p = new Produkt("Melk", 24.9);\np.visInfo();'), utskrift: 'Melk koster 24.9 kr',
    krav: [['this\\.navn\\s*=\\s*navn', 'Lagre navnet: this.navn = navn;'], ['this\\.pris\\s*=\\s*pris', 'Lagre prisen: this.pris = pris;']],
    muntlig: ['Hvorfor bruker vi `this` i Java?', 'Hva er attributtene og metodene i Produkt?'],
  },
  {
    id: 'oop-rett', ferdighet: 'oop', trinn: 'rett', tittel: 'Rett: «null av null»', kilde: 'Egenlaget',
    oppgave: 'Programmet kjører, men skriver noe rart. Hva skriver det ut? Finn feilen i konstruktøren og rett den slik at utskriften blir `Sult av Knut Hamsun`.',
    kode: medKlasser('class Bok {\n    String tittel;\n    String forfatter;\n\n    Bok(String tittel, String forfatter) {\n        tittel = tittel;\n        forfatter = forfatter;\n    }\n\n    void visInfo() {\n        System.out.println(tittel + " av " + forfatter);\n    }\n}', 'Bok b = new Bok("Sult", "Knut Hamsun");\nb.visInfo();'),
    hint: ['I konstruktøren betyr «tittel» parameteren, ikke attributtet.', '«tittel = tittel» lagrer parameteren i seg selv – attributtet forblir tomt (null).', 'Skriv this.tittel = tittel; og this.forfatter = forfatter;'],
    svar: { sporsmal: 'Hva skriver den feilaktige koden ut?', godta: ['null av null'] },
    fasit: 'Den skriver `null av null`. Uten `this` setter konstruktøren parameteren lik seg selv, og attributtene får standardverdien `null`. Det er en **logisk feil** (kjører, men feil resultat). Rett: `this.tittel = tittel; this.forfatter = forfatter;`',
    fasitKode: medKlasser('class Bok {\n    String tittel;\n    String forfatter;\n\n    Bok(String tittel, String forfatter) {\n        this.tittel = tittel;\n        this.forfatter = forfatter;\n    }\n\n    void visInfo() {\n        System.out.println(tittel + " av " + forfatter);\n    }\n}', 'Bok b = new Bok("Sult", "Knut Hamsun");\nb.visInfo();'),
    utskrift: 'Sult av Knut Hamsun',
    muntlig: ['Hva betyr `null`?', 'Hvordan ville en test ha avslørt denne feilen?'],
  },
  {
    id: '3.10', ferdighet: 'oop', trinn: 'skriv', tittel: 'Bok og bibliotek fra blankt ark', kilde: 'Bootcamp 3.10',
    oppgave: `Lag en klasse \`Bok\` med \`tittel\`, \`forfatter\` og \`tilgjengelig\`. Lag en konstruktør (ny bok er tilgjengelig). Lag \`lanUt()\` og \`leverTilbake()\` som skriver meldingene under.

Test i \`main\`: lag «Sult» (Knut Hamsun) og «Naiv. Super.» (Erlend Loe), og kjør: \`bok1.lanUt(); bok1.lanUt(); bok1.leverTilbake(); bok2.lanUt();\`

Forventet utskrift:
\`\`\`text
Sult er nå lånt ut.
Sult er allerede lånt ut.
Sult er levert tilbake.
Naiv. Super. er nå lånt ut.
\`\`\`
**Fremgangsmåte:** finn substantivene (klasser/attributter) og handlingene (metoder) først.`,
    plan: true,
    hint: ['Attributter: String tittel, String forfatter, boolean tilgjengelig.', 'Konstruktør: Bok(String tittel, String forfatter) { this.tittel = tittel; … this.tilgjengelig = true; }', 'lanUt: if (tilgjengelig) { tilgjengelig = false; println(tittel + " er nå lånt ut."); } else { … "er allerede lånt ut." }'],
    fasit: java(medKlasser(BOK, 'Bok bok1 = new Bok("Sult", "Knut Hamsun");\nBok bok2 = new Bok("Naiv. Super.", "Erlend Loe");\nbok1.lanUt();\nbok1.lanUt();\nbok1.leverTilbake();\nbok2.lanUt();')),
    fasitKode: medKlasser(BOK, 'Bok bok1 = new Bok("Sult", "Knut Hamsun");\nBok bok2 = new Bok("Naiv. Super.", "Erlend Loe");\nbok1.lanUt();\nbok1.lanUt();\nbok1.leverTilbake();\nbok2.lanUt();'),
    utskrift: 'Sult er nå lånt ut.\nSult er allerede lånt ut.\nSult er levert tilbake.\nNaiv. Super. er nå lånt ut.',
    krav: [['class\\s+Bok', 'Lag klassen Bok.'], ['Bok\\s*\\(\\s*String', 'Lag en konstruktør Bok(String …).'], ['new\\s+Bok', 'Opprett objekter med new Bok(...).'], ['void\\s+lanUt', 'Lag metoden lanUt().']],
    muntlig: ['Forklar hva klassen Bok er, hva objektet bok1 er, og hva attributtene lagrer.', 'Hvordan testet du at samme bok ikke kan lånes ut to ganger?'],
  },
  {
    id: '9.7', ferdighet: 'oop', trinn: 'skriv', tittel: 'Objektliste: tre produkter', kilde: 'Bootcamp 9.7',
    oppgave: `Bruk klassen \`Produkt\` (navn, pris, konstruktør, \`visInfo()\`). Lag tre produkter – Melk 24.9, Brød 39.0, Egg 52.5 – legg dem i en \`ArrayList<Produkt>\`, og skriv ut alle med en løkke. Skriv deretter ut totalprisen.

\`\`\`text
Melk koster 24.9 kr
Brød koster 39.0 kr
Egg koster 52.5 kr
Totalt: 116.4 kr
\`\`\``,
    hint: ['ArrayList<Produkt> varer = new ArrayList<>(); varer.add(new Produkt("Melk", 24.9)); …', 'for (Produkt p : varer) { p.visInfo(); }', 'Summer p.pris i samme løkke: total += p.pris;'],
    fasit: java(medKlasser(PRODUKT, 'ArrayList<Produkt> varer = new ArrayList<>();\nvarer.add(new Produkt("Melk", 24.9));\nvarer.add(new Produkt("Brød", 39.0));\nvarer.add(new Produkt("Egg", 52.5));\n\ndouble total = 0;\nfor (Produkt p : varer) {\n    p.visInfo();\n    total += p.pris;\n}\nSystem.out.println("Totalt: " + total + " kr");', AL)),
    fasitKode: medKlasser(PRODUKT, 'ArrayList<Produkt> varer = new ArrayList<>();\nvarer.add(new Produkt("Melk", 24.9));\nvarer.add(new Produkt("Brød", 39.0));\nvarer.add(new Produkt("Egg", 52.5));\n\ndouble total = 0;\nfor (Produkt p : varer) {\n    p.visInfo();\n    total += p.pris;\n}\nSystem.out.println("Totalt: " + total + " kr");', AL),
    utskrift: 'Melk koster 24.9 kr\nBrød koster 39.0 kr\nEgg koster 52.5 kr\nTotalt: 116.4 kr',
    krav: [['ArrayList<Produkt>', 'Bruk ArrayList<Produkt>.'], ['for\\s*\\(', 'Gå gjennom lista med en løkke.']],
    muntlig: ['Hva er fordelen med å ha objektene i en liste?', 'Hvordan ville du funnet det dyreste produktet?'],
  },
  {
    id: 'oop-endre', ferdighet: 'oop', trinn: 'endre', tittel: 'Endre: forsinkelsesgebyr', kilde: 'Bootcamp 3.10 «Middels»',
    oppgave: 'Legg til en metode `beregnGebyr(int antallDager)` i `Bok` som returnerer **10 kr per dag over 14 dager** (0 kr om boken leveres innen 14 dager). Test: `beregnGebyr(10)` → `0`, `beregnGebyr(14)` → `0`, `beregnGebyr(20)` → `60`.',
    hint: ['Først: er antallDager over 14?', 'Dager for sent = antallDager - 14.', 'if (antallDager <= 14) return 0; return (antallDager - 14) * 10;'],
    fasit: java('int beregnGebyr(int antallDager) {\n    if (antallDager <= 14) {\n        return 0;\n    }\n    return (antallDager - 14) * 10;\n}') + '\n\nGrenseverdien 14 testes eksplisitt: dag 14 er gratis, dag 15 koster 10.',
    fasitKode: medKlasser('class Bok {\n    String tittel;\n\n    Bok(String tittel) {\n        this.tittel = tittel;\n    }\n\n    int beregnGebyr(int antallDager) {\n        if (antallDager <= 14) {\n            return 0;\n        }\n        return (antallDager - 14) * 10;\n    }\n}', 'Bok b = new Bok("Sult");\nSystem.out.println(b.beregnGebyr(10));\nSystem.out.println(b.beregnGebyr(14));\nSystem.out.println(b.beregnGebyr(20));'),
    utskrift: '0\n0\n60',
    krav: [['beregnGebyr\\s*\\(\\s*int', 'Metoden beregnGebyr(int antallDager).'], ['14', 'Grensen er 14 dager.']],
    muntlig: ['Hvilke testverdier er viktigst her, og hvorfor?', 'Bør gebyret være en konstant? Hvorfor?'],
  },
  {
    id: 'oop-arv', ferdighet: 'oop', trinn: 'fullfor', tittel: 'Fullfør: enkel arv', kilde: 'Bootcamp 3.7 (variant)',
    oppgave: 'En `Elev` **er en** `Person`. Fyll inn det som mangler i klassehodet til `Elev`, slik at `Elev` arver attributtet `navn` og metoden `hils()`. Forventet utskrift: `Hei, jeg heter Ali` og `2STA`.',
    kode: medKlasser('class Person {\n    String navn;\n\n    void hils() {\n        System.out.println("Hei, jeg heter " + navn);\n    }\n}\n\nclass Elev /* ? */ {\n    String klasse;\n}', 'Elev e = new Elev();\ne.navn = "Ali";\ne.klasse = "2STA";\ne.hils();\nSystem.out.println(e.klasse);'),
    hint: ['Arv i Java skrives med ett nøkkelord i klassehodet.', 'class Underklasse ___ Overklasse', 'class Elev extends Person'],
    svar: { sporsmal: 'Hvilket nøkkelord mangler?', godta: ['extends', 'extends Person'] },
    fasit: '`class Elev extends Person`. Elev arver `navn` og `hils()` fra Person og legger til sitt eget attributt `klasse`. Bruk arv bare når relasjonen er «er-en».',
    fasitKode: medKlasser('class Person {\n    String navn;\n\n    void hils() {\n        System.out.println("Hei, jeg heter " + navn);\n    }\n}\n\nclass Elev extends Person {\n    String klasse;\n}', 'Elev e = new Elev();\ne.navn = "Ali";\ne.klasse = "2STA";\ne.hils();\nSystem.out.println(e.klasse);'),
    utskrift: 'Hei, jeg heter Ali\n2STA',
    muntlig: ['Hva er arv? Gi et eget eksempel på «er-en».', 'Hva er overklasse og underklasse her?'],
  },
  {
    id: 'oop-komposisjon', ferdighet: 'oop', trinn: 'forklar', tittel: 'Forklar: arv eller komposisjon?', kilde: 'Bootcamp 3.7–3.8, 11 eksempel 4',
    oppgave: 'Svar høyt: Hva er forskjellen på **arv** («er-en») og **komposisjon** («har-en»)? Avgjør for hvert par: (a) Bil – Kjøretøy, (b) Bil – Motor, (c) Medlem – Lån, (d) Hund – Dyr. Begrunn.',
    hint: ['Spør: «Er en bil et kjøretøy?» og «Er en bil en motor?»', 'Er-en → arv. Har-en → komposisjon/assosiasjon.', '(a) arv, (b) komposisjon, (c) har-en, (d) arv.'],
    fasit: '«Arv brukes når en klasse er en spesialisert type av en annen – en Bil **er et** Kjøretøy, en Hund **er et** Dyr. Komposisjon brukes når en klasse **har** en annen som del – en Bil har en Motor; et Medlem har lån. Bil er ikke en motor, så arv ville vært feil og gjort programmet unødvendig låst.»',
    sjekk: ['Jeg forklarte er-en og har-en', 'Jeg avgjorde alle fire parene riktig', 'Jeg begrunnet minst ett valg'],
    muntlig: ['Hva kan gå galt hvis man bruker arv bare for å dele kode?'],
  },
  {
    id: 'caseA', ferdighet: 'oop', trinn: 'overfor', tittel: 'CASE A: PC-utlån (klasse + test)', kilde: 'Bootcamp 10 CASE A',
    oppgave: `Et skolebibliotek låner ut bærbare PC-er. Lag klassen \`PC\` med \`serienummer\` og \`tilgjengelig\`, en konstruktør, \`boolean lanUt()\` (returnerer **true** hvis utlånet gikk, **false** hvis PC-en allerede er utlånt) og \`leverTilbake()\`.

Test i \`main\` med PC «A-17»: lån ut, lån ut igjen, lever, lån ut. Skriv ut returverdiene:
\`\`\`text
true
false
true
\`\`\`
Etterpå muntlig: alternativ modell og personvern.`,
    plan: true,
    hint: ['Samme mønster som Bok, men lanUt returnerer boolean i stedet for å skrive ut.', 'boolean lanUt() { if (tilgjengelig) { tilgjengelig = false; return true; } return false; }', 'System.out.println(pc.lanUt()); System.out.println(pc.lanUt()); pc.leverTilbake(); System.out.println(pc.lanUt());'],
    fasit: java(medKlasser(PC, 'PC pc = new PC("A-17");\nSystem.out.println(pc.lanUt());\nSystem.out.println(pc.lanUt());\npc.leverTilbake();\nSystem.out.println(pc.lanUt());')) + '\n\nAlternativ modell: en egen `Laan`-klasse (PC, elev-ID, dato) gir historikk. Personvern: lagre helst en intern elev-ID, ikke fullt navn/adresse (dataminimering).',
    fasitKode: medKlasser(PC, 'PC pc = new PC("A-17");\nSystem.out.println(pc.lanUt());\nSystem.out.println(pc.lanUt());\npc.leverTilbake();\nSystem.out.println(pc.lanUt());'),
    utskrift: 'true\nfalse\ntrue',
    krav: [['class\\s+PC', 'Lag klassen PC.'], ['boolean\\s+lanUt', 'lanUt skal returnere boolean.']],
    muntlig: ['Hvorfor har PC-klassen en boolean?', 'Hva skjer hvis to ansatte prøver å låne ut samme PC samtidig?', 'Når ville en database vært bedre enn en liste i minnet?', 'Hvordan beskytter du elevopplysninger?'],
  },
  {
    id: 'oop-to-klasser', ferdighet: 'oop', trinn: 'overfor', tittel: 'To klasser: Medlem har en liste med bøker', kilde: 'Bootcamp 3.10 «Utfordrende» (søndag 09:30)',
    oppgave: `Lag klassen \`Medlem\` med \`navn\` og en \`ArrayList<Bok>\` med lånte bøker, og metoden \`laan(Bok b)\` som bare legger boken til lista hvis \`b.tilgjengelig\` er true (og da kaller \`b.lanUt()\`). Lag \`antallLan()\`.

Test: Medlem «Amina» låner «Sult», prøver «Sult» igjen, låner «Naiv. Super.». Skriv til slutt \`Amina har 2 lån\`.

Forventet siste linje: \`Amina har 2 lån\` (meldingene fra \`lanUt\` kommer før). Forklar relasjonen: hvorfor er dette **ikke** arv?`,
    plan: true,
    hint: ['Medlem HAR bøker → attributt ArrayList<Bok> laante = new ArrayList<>();', 'void laan(Bok b) { if (b.tilgjengelig) { b.lanUt(); laante.add(b); } else { b.lanUt(); } }', 'int antallLan() { return laante.size(); }'],
    fasit: java(medKlasser(`${BOK}

class Medlem {
    String navn;
    ArrayList<Bok> laante = new ArrayList<>();

    Medlem(String navn) {
        this.navn = navn;
    }

    void laan(Bok b) {
        if (b.tilgjengelig) {
            laante.add(b);
        }
        b.lanUt();
    }

    int antallLan() {
        return laante.size();
    }
}`, 'Bok sult = new Bok("Sult", "Knut Hamsun");\nBok naiv = new Bok("Naiv. Super.", "Erlend Loe");\nMedlem m = new Medlem("Amina");\nm.laan(sult);\nm.laan(sult);\nm.laan(naiv);\nSystem.out.println(m.navn + " har " + m.antallLan() + " lån");', AL)) + '\n\nRelasjon: Medlem **har** bøker (assosiasjon/komposisjon, 1 — 0..*). Et medlem er ikke en bok, så arv passer ikke.',
    fasitKode: medKlasser(`${BOK}

class Medlem {
    String navn;
    ArrayList<Bok> laante = new ArrayList<>();

    Medlem(String navn) {
        this.navn = navn;
    }

    void laan(Bok b) {
        if (b.tilgjengelig) {
            laante.add(b);
        }
        b.lanUt();
    }

    int antallLan() {
        return laante.size();
    }
}`, 'Bok sult = new Bok("Sult", "Knut Hamsun");\nBok naiv = new Bok("Naiv. Super.", "Erlend Loe");\nMedlem m = new Medlem("Amina");\nm.laan(sult);\nm.laan(sult);\nm.laan(naiv);\nSystem.out.println(m.navn + " har " + m.antallLan() + " lån");', AL),
    utskrift: 'Amina har 2 lån',
    krav: [['class\\s+Medlem', 'Lag klassen Medlem.'], ['ArrayList<Bok>', 'Medlem skal ha en ArrayList<Bok>.']],
    muntlig: ['Forklar relasjonen mellom Medlem og Bok. Hvilken multiplisitet?', 'Hvorfor kunne en egen Laan-klasse vært enda bedre?'],
  },

  {
    id: 'gjenkalling', ferdighet: 'oop', trinn: 'overfor', tittel: 'Gjenkalling: alt fra lørdag i ett program', kilde: 'Bootcamp 14, søndag økt 1',
    oppgave: `Skriv **fra hukommelsen**, uten å se på gamle løsninger. Programmet skal ha:

1. en klasse \`Vare\` med \`navn\` og \`pris\` og en **konstruktør**
2. en **metode** \`static double total(ArrayList<Vare> varer)\` som **returnerer** summen
3. i \`main\`: en **liste** med Melk (20) og Ost (80), en **for-løkke** som skriver hver vare, og en **if/else** som skriver \`Dyrt\` hvis totalen er over 50, ellers \`Billig\`

\`\`\`text
Melk: 20.0
Ost: 80.0
Total: 100.0
Dyrt
\`\`\`
Sjekk etterpå hva du måtte slå opp – det er dagens første repetisjonsliste.`,
    plan: true,
    hint: ['Start med klassen Vare (attributter + konstruktør med this).', 'Metoden: double sum = 0; for (Vare v : varer) sum += v.pris; return sum;', 'main: ArrayList<Vare> varer = new ArrayList<>(); varer.add(new Vare("Melk", 20)); … if (t > 50) …'],
    fasit: java(medKlasser('class Vare {\n    String navn;\n    double pris;\n\n    Vare(String navn, double pris) {\n        this.navn = navn;\n        this.pris = pris;\n    }\n}', 'ArrayList<Vare> varer = new ArrayList<>();\nvarer.add(new Vare("Melk", 20));\nvarer.add(new Vare("Ost", 80));\n\nfor (Vare v : varer) {\n    System.out.println(v.navn + ": " + v.pris);\n}\ndouble t = total(varer);\nSystem.out.println("Total: " + t);\nif (t > 50) {\n    System.out.println("Dyrt");\n} else {\n    System.out.println("Billig");\n}', AL).replace('    }\n}\n\nclass Vare', '    }\n\n    static double total(ArrayList<Vare> varer) {\n        double sum = 0;\n        for (Vare v : varer) {\n            sum += v.pris;\n        }\n        return sum;\n    }\n}\n\nclass Vare')),
    fasitKode: medKlasser('class Vare {\n    String navn;\n    double pris;\n\n    Vare(String navn, double pris) {\n        this.navn = navn;\n        this.pris = pris;\n    }\n}', 'ArrayList<Vare> varer = new ArrayList<>();\nvarer.add(new Vare("Melk", 20));\nvarer.add(new Vare("Ost", 80));\n\nfor (Vare v : varer) {\n    System.out.println(v.navn + ": " + v.pris);\n}\ndouble t = total(varer);\nSystem.out.println("Total: " + t);\nif (t > 50) {\n    System.out.println("Dyrt");\n} else {\n    System.out.println("Billig");\n}', AL).replace('    }\n}\n\nclass Vare', '    }\n\n    static double total(ArrayList<Vare> varer) {\n        double sum = 0;\n        for (Vare v : varer) {\n            sum += v.pris;\n        }\n        return sum;\n    }\n}\n\nclass Vare'),
    utskrift: 'Melk: 20.0\nOst: 80.0\nTotal: 100.0\nDyrt',
    krav: [['class\\s+Vare', 'Klassen Vare mangler.'], ['Vare\\s*\\(\\s*String', 'Konstruktøren Vare(String navn, double pris) mangler.'], ['double\\s+total\\s*\\(', 'Metoden total(...) mangler.'], ['for\\s*\\(', 'Du trenger en løkke.'], ['if\\s*\\(', 'Du trenger en if/else.']],
    muntlig: ['Gå gjennom programmet: hvor er klassen, objektene, attributtene, metoden, lista, løkka og betingelsen?', 'Hva måtte du slå opp? Det er det du skal repetere først.'],
  },

  /* ======================= UML / MODELLERING ======================= */
  {
    id: 'uml-se', ferdighet: 'uml', trinn: 'se', tittel: 'Se: et klassediagram', kilde: 'Bootcamp 4.2–4.3',
    oppgave: `Et UML-klassediagram har tre deler: **klassenavn**, **attributter** og **metoder**. \`-\` betyr privat, \`+\` offentlig. \`: String\` er datatypen, \`: void\` betyr ingen returverdi.

Relasjoner: **arv** (er-en, åpen trekant), **komposisjon/assosiasjon** (har-en, linje). **Multiplisitet** forteller hvor mange: \`1\`, \`0..1\`, \`0..*\` (null eller flere).`,
    kode: '+----------------------+          +---------------------+\n|       Medlem         |          |        Laan         |\n+----------------------+ 1   0..* +---------------------+\n| - navn: String       |----------| - dato: String      |\n| - medlemsnr: int     |          | - bok: Bok          |\n+----------------------+          +---------------------+\n| + laan(b: Bok): void |          | + erForsinket(): boolean |\n+----------------------+          +---------------------+',
    hint: ['Les ett medlem → mange lån.', '1 ved Medlem, 0..* ved Laan.', 'Hvert lån tilhører ett medlem.'],
    fasit: 'Ett medlem kan ha null eller flere lån (0..*). Hvert lån tilhører nøyaktig ett medlem (1). Medlem har attributtene navn og medlemsnr og metoden laan(b: Bok).',
    muntlig: ['Hva viser de tre delene i en klasseboks?', 'Hva betyr 0..*?'],
  },
  {
    id: 'uml-les', ferdighet: 'uml', trinn: 'forutsi', tittel: 'Les et klassediagram', kilde: 'Egenlaget',
    oppgave: 'Se på diagrammet over (Medlem 1 —— 0..* Laan). **Hvor mange lån kan ett medlem ha?** Svar med multiplisiteten. Forklar så høyt hvorfor `Laan` er en egen klasse og ikke bare et attributt i `Medlem`.',
    kode: 'Medlem 1 ———— 0..* Laan\nLaan  0..* ———— 1 Bok',
    hint: ['Tallet ved Laan-enden sier hvor mange lån ett medlem kan ha.', 'Det står 0..*.', '0..* = null eller flere.'],
    svar: { sporsmal: 'Multiplisitet for lån per medlem:', godta: ['0..*', '0..n', 'null eller flere', 'mange', '0 eller flere'] },
    fasit: '`0..*` – null eller flere. `Laan` er egen klasse fordi et lån har egne data (dato, forfall) og kobler ett medlem til én bok. Da kan samme bok ha mange lån over tid (historikk).',
    muntlig: ['Hva er fordelen med en egen Laan-klasse?'],
  },
  {
    id: '4A', ferdighet: 'uml', trinn: 'skriv', tittel: 'Modell: PC-utlån på skolen', kilde: 'Bootcamp 4A',
    oppgave: `Et skolebibliotek låner ut PC-er til elever. En elev kan låne flere PC-er, men hver PC kan bare være utlånt til én elev om gangen. **Tegn på papir** (eller skriv som tekst): klasser, attributter, metoder og relasjon med multiplisitet.

Metode: (1) marker substantiver → klasser, (2) informasjon → attributter, (3) handlinger → metoder, (4) er-en/har-en, (5) test modellen med «Hva skjer når Ali låner PC A-17?».`,
    plan: true,
    hint: ['Substantiver: elev, PC, (utlån).', 'Elev: elevId, navn. PC: serienummer, tilgjengelig. Laan: dato.', 'Elev 1 —— 0..* Laan 0..1 —— 1 PC (eller Elev 1 —— 0..* PC).'],
    fasit: '```text\nElev                 Laan                    PC\n- elevId: String     - dato: String          - serienummer: String\n- navn: String       - levert: boolean       - tilgjengelig: boolean\n+ laan(pc): boolean  + avslutt(): void       + lanUt(): boolean\n                                             + leverTilbake(): void\nElev 1 ——— 0..* Laan    Laan 0..* ——— 1 PC\n```\nEn PC har mange lån over tid, men bare ett aktivt lån om gangen (sjekkes med `tilgjengelig`).',
    sjekk: ['Jeg har minst to klasser med attributter', 'Jeg har minst én metode per klasse', 'Jeg har relasjon med multiplisitet', 'Jeg testet modellen med et scenario'],
    muntlig: ['Hvorfor valgte du akkurat disse klassene?', 'Hvordan sørger modellen for at én PC ikke er utlånt til to elever?'],
  },
  {
    id: '4B', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ modell: elevNavn i PC?', kilde: 'Bootcamp 4B',
    oppgave: 'Kan du modellere utlån ved å legge `elevNavn` direkte inn i PC-klassen, uten en egen `Laan`-klasse? Forklar én **fordel** og én **ulempe** ved hver løsning, og velg.',
    hint: ['Hvilken løsning er enklest å kode?', 'Hva skjer med historikken når PC-en leveres?', 'Personvern: navn vs. ID.'],
    fasit: '«`elevNavn` i PC er enkelt og raskt å lage, men vi mister historikk når PC-en leveres, og vi lagrer navn direkte. En egen `Laan`-klasse gir historikk, datoer og kan bruke elev-ID (dataminimering), men er mer kompleks. For en skole som vil spore tapte PC-er, ville jeg valgt Laan-klassen.»',
    sjekk: ['Fordel og ulempe for elevNavn-løsningen', 'Fordel og ulempe for Laan-løsningen', 'Jeg valgte og begrunnet'],
    muntlig: ['Hvilken løsning er best for personvernet? Hvorfor?'],
  },
  {
    id: '4C', ferdighet: 'uml', trinn: 'forklar', tittel: 'Forklar: hvorfor modellere før koding?', kilde: 'Bootcamp 4C',
    oppgave: 'Svar høyt: Hvorfor er det nyttig å tegne klassediagram før man programmerer? Gi et eksempel på en **feil** modellen kan avsløre.',
    hint: ['Tenk på samarbeid og manglende data.', 'Hva om du glemmer hvem som har lånt en PC?', 'Modellen avslører manglende attributter/relasjoner før du har skrevet mye kode.'],
    fasit: '«Et klassediagram gjør strukturen tydelig før vi koder, og utviklere kan bli enige om klasser og relasjoner. Det avdekker feil tidlig – for eksempel at PC-klassen mangler kobling til eleven, slik at vi ikke vet hvem som har lånt den. Det er billigere å rette en tegning enn ferdig kode.»',
    sjekk: ['Jeg nevnte minst to fordeler', 'Jeg ga et konkret eksempel på en feil'],
    muntlig: ['Når kan en modell bli for komplisert?'],
  },
  {
    id: '9.11', ferdighet: 'uml', trinn: 'overfor', tittel: 'UML: Medlem, Bok og Laan', kilde: 'Bootcamp 9.11',
    oppgave: 'Lag klassediagram for `Medlem`, `Bok` og `Laan`. Forklar hvilke attributter som hører hjemme **hvor**, og hvorfor et eget `Laan`-objekt kan være nyttig. Ta med multiplisitet.',
    plan: true,
    hint: ['Hvilke data har en bok uansett hvem som låner den?', 'Hvilke data finnes bare når et lån skjer (dato, forfall)?', 'Medlem 1 — 0..* Laan 0..* — 1 Bok'],
    fasit: '```text\nMedlem: - medlemsnr: int, - navn: String, + laan(b: Bok)\nBok:    - isbn: String, - tittel: String, - tilgjengelig: boolean\nLaan:   - utlansdato: String, - forfallsdato: String, - levert: boolean, + erForsinket(): boolean\nMedlem 1 ——— 0..* Laan 0..* ——— 1 Bok\n```\nDato hører til lånet, ikke boken eller medlemmet. Laan-objektet kobler dem og gir historikk.',
    sjekk: ['Tre klasser med fornuftige attributter', 'Datoer ligger i Laan', 'Multiplisitet er med', 'Jeg forklarte hvorfor Laan er nyttig'],
    muntlig: ['Hvorfor ligger forfallsdato i Laan og ikke i Bok?'],
  },

  /* ======================= FEILSØKING ======================= */
  {
    id: 'feil-se', ferdighet: 'feil', trinn: 'se', tittel: 'Se: tre feiltyper og metoden', kilde: 'Bootcamp 5.1–5.2',
    oppgave: `**Syntaksfeil:** koden bryter språkets regler (manglende \`;\`, feil parentes, ukjent variabel). Programmet kompilerer ikke.
**Kjøretidsfeil:** programmet starter, men krasjer (f.eks. \`get(5)\` i en liste med 3 elementer).
**Logisk feil:** programmet kjører, men gir feil resultat (f.eks. \`>\` i stedet for \`>=\`).

**Feilsøkingsmetode:** 1) gjenskap feilen, 2) les feilmeldingen og finn linjen, 3) undersøk verdiene (println/debugger), 4) del opp problemet, 5) endre én ting om gangen, 6) test igjen, 7) test at du ikke ødela noe annet.`,
    hint: ['Kompilerer ikke → syntaks.', 'Krasjer underveis → kjøretid.', 'Feil svar → logisk.'],
    fasit: 'Ikke gjett og endre ti linjer samtidig. Bruk utskrift av verdier for å se hva som skjer.',
    muntlig: ['Forklar forskjellen på syntaksfeil, kjøretidsfeil og logisk feil med ett eksempel hver.'],
  },
  {
    id: '5A', ferdighet: 'feil', trinn: 'rett', tittel: 'Syntaksfeil: finn tegnet som mangler', kilde: 'Bootcamp 5A',
    oppgave: 'Koden kompilerer ikke. Hvilket tegn mangler, og etter hva?',
    kode: 'int alder = 18\nSystem.out.println(alder);',
    hint: ['Se på slutten av hver linje.', 'Hver instruksjon i Java slutter med samme tegn.', 'Første linje mangler ;'],
    svar: { sporsmal: 'Tegnet som mangler:', godta: [';', 'semikolon'] },
    fasit: 'Semikolon `;` mangler etter `18`. Kompilatoren melder ofte feilen på linjen **etter**, så se også på linjen over.',
    muntlig: ['Hvorfor peker feilmeldingen noen ganger på feil linje?'],
  },
  {
    id: '5B', ferdighet: 'feil', trinn: 'rett', tittel: 'Logisk feil: 18-åringen er «barn»', kilde: 'Bootcamp 5B',
    oppgave: 'Man er myndig fra 18. Hva skriver koden ut når `alder` er 18? Rett betingelsen.',
    kode: main('int alder = 18;\nif (alder > 18) {\n    System.out.println("Voksen");\n} else {\n    System.out.println("Barn");\n}'),
    hint: ['Er 18 > 18?', 'Nei – derfor går 18 til else.', 'Bruk >= 18.'],
    svar: { sporsmal: 'Utskrift for alder 18 med feilen:', godta: ['Barn'] },
    fasit: 'Den skriver `Barn`. Grensen er ikke med i `>`. Rett: `if (alder >= 18)`. Dette er en logisk feil og en klassisk **grenseverdifeil**.',
    fasitKode: main('int alder = 18;\nif (alder >= 18) {\n    System.out.println("Voksen");\n} else {\n    System.out.println("Barn");\n}'), utskrift: 'Voksen',
    muntlig: ['Hvilken test avslører denne feilen?'],
  },
  {
    id: '5C', ferdighet: 'feil', trinn: 'rett', tittel: 'Kjøretidsfeil: indeks som ikke finnes', kilde: 'Bootcamp 5C',
    oppgave: 'Programmet kompilerer, men krasjer. Hvilken indeks ville vært riktig for å hente «Amina»?',
    kode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nSystem.out.println(navn.get(1));', AL),
    hint: ['Hvor mange elementer har lista?', 'Ett element – hvilken indeks har det?', 'Indekser starter på 0.'],
    svar: { sporsmal: 'Riktig indeks:', godta: ['0'] },
    fasit: 'Lista har bare indeks 0. `get(1)` gir `IndexOutOfBoundsException` – en **kjøretidsfeil**. Rett: `navn.get(0)`.',
    fasitKode: main('ArrayList<String> navn = new ArrayList<>();\nnavn.add("Amina");\nSystem.out.println(navn.get(0));', AL), utskrift: 'Amina',
    muntlig: ['Hvordan kunne programmet sjekket at indeksen finnes før det henter elementet?'],
  },
  {
    id: '5D', ferdighet: 'feil', trinn: 'forutsi', tittel: 'Heltallsdivisjon: forutsi og rett', kilde: 'Bootcamp 5D',
    oppgave: 'Hva skriver programmet ut? Rett det deretter slik at svaret blir `2.5`.',
    kode: main('int sum = 5;\nint antall = 2;\ndouble snitt = sum / antall;\nSystem.out.println(snitt);'),
    hint: ['sum og antall er begge int.', 'int / int gir int – desimalene kuttes BORT før svaret lagres i double.', '5 / 2 = 2 → lagres som 2.0.'],
    svar: { sporsmal: 'Utskrift:', godta: ['2.0'] },
    fasit: '`2.0`. Med to heltall blir `5 / 2` = `2` (heltallsdivisjon), og først deretter blir det `2.0`. Rett: `double snitt = (double) sum / antall;` → `2.5`. Dette er en **type-/konverteringsfeil**.',
    fasitKode: main('int sum = 5;\nint antall = 2;\ndouble snitt = (double) sum / antall;\nSystem.out.println(snitt);'), utskrift: '2.5',
    muntlig: ['Hva betyr `(double)` foran sum?'],
  },
  {
    id: 'feil-type', ferdighet: 'feil', trinn: 'rett', tittel: 'Type og konvertering: "5" + 3', kilde: 'Egenlaget',
    oppgave: 'Et program leser antall som tekst. Hva skriver første linje ut? Rett deretter koden slik at `svar` blir tallet `8` (bruk `Integer.parseInt`).',
    kode: main('String antallTekst = "5";\nSystem.out.println(antallTekst + 3);\n// int svar = antallTekst + 3;   // kompilerer ikke!'),
    hint: ['Tekst + tall = tekst som limes sammen.', '"5" + 3 = "53".', 'int svar = Integer.parseInt(antallTekst) + 3;'],
    svar: { sporsmal: 'Hva skriver første println ut?', godta: ['53'] },
    fasit: '`53` – med tekst limer `+` sammen. For å regne må teksten **konverteres**: `int svar = Integer.parseInt(antallTekst) + 3;` → `8`. Hvis teksten er «fem», krasjer `parseInt` med `NumberFormatException` (kjøretidsfeil) – derfor bør input valideres.',
    fasitKode: main('String antallTekst = "5";\nSystem.out.println(antallTekst + 3);\nint svar = Integer.parseInt(antallTekst) + 3;\nSystem.out.println(svar);'),
    utskrift: '53\n8',
    muntlig: ['Hva skjer hvis brukeren skriver «fem»? Hvordan ville du håndtert det?'],
  },
  {
    id: 'feil-offbyone', ferdighet: 'feil', trinn: 'rett', tittel: 'Grenseverdi: summen 1–10 blir feil', kilde: 'Egenlaget (off-by-one)',
    oppgave: 'Programmet skal summere 1 til 10 (55). Hva skriver det faktisk ut? Rett feilen.',
    kode: main('int sum = 0;\nfor (int i = 1; i < 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'),
    hint: ['Hva er siste verdi av i som kommer inn i løkka?', 'i < 10 betyr at 10 aldri tas med.', 'Summen 1..9 = ?'],
    svar: { sporsmal: 'Faktisk utskrift:', godta: ['45'] },
    fasit: '`45` – tallet 10 tas aldri med. **Off-by-one-feil**. Rett: `i <= 10` → `55`.',
    fasitKode: main('int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'), utskrift: '55',
    muntlig: ['Hva er en off-by-one-feil, og hvordan tester du for den?'],
  },
  {
    id: '9.8', ferdighet: 'feil', trinn: 'rett', tittel: 'Finn og rett flere feil', kilde: 'Bootcamp 9.8',
    oppgave: 'Koden har **to** feil. Finn begge, skriv rettet kode og kjør den. Forventet utskrift: `Du er 18`.',
    kode: 'int alder = 18\nif (alder = 18) {\n    System.out.println("Du er 18");\n}',
    hint: ['Én feil er et manglende tegn.', 'Den andre: = betyr tilordning. Hva brukes til sammenligning?', 'int alder = 18;  og  if (alder == 18)'],
    fasit: 'Manglende `;` etter `18`, og `=` i betingelsen må være `==` (sammenligning).\n\n' + java(main('int alder = 18;\nif (alder == 18) {\n    System.out.println("Du er 18");\n}')),
    fasitKode: main('int alder = 18;\nif (alder == 18) {\n    System.out.println("Du er 18");\n}'), utskrift: 'Du er 18',
    krav: [['==', 'Sammenligning skrives ==.'], ['18\\s*;', 'Husk semikolon etter 18.']],
    sjekk: ['Jeg fant det manglende semikolonet', 'Jeg byttet = med =='],
    muntlig: ['Forklar forskjellen på `=` og `==`.'],
  },

  /* ======================= TESTING ======================= */
  {
    id: 'test-se', ferdighet: 'testing', trinn: 'se', tittel: 'Se: testtabell med grenseverdier', kilde: 'Bootcamp 5.3–5.4',
    oppgave: `En **testtabell** har input, forventet resultat og faktisk resultat. Test alltid **normaltilfelle**, **grenseverdi** og **ugyldig input**.

| Input alder | Forventet | Hvorfor teste? |
|---:|---|---|
| 10 | Barnpris | Vanlig barn |
| 17 | Barnpris | Rett under grensen |
| 18 | Voksenpris | På grensen |
| 66 | Voksenpris | Rett under seniorgrensen |
| 67 | Seniorpris | På grensen |
| -2 | Ugyldig | Ugyldig verdi |

Testtyper: **enhetstest** (én metode), **integrasjonstest** (flere deler sammen), **systemtest** (hele programmet), **akseptansetest** (dekker brukerens behov).`,
    hint: ['Grenser er der regelen endrer seg.', 'Test rett under, på og rett over.', 'Ugyldig: negativ alder, tekst.'],
    fasit: '«Jeg ville testet normaltilfellet, en grenseverdi og ugyldig input, og sammenlignet faktisk resultat med forventet.»',
    muntlig: ['Hva er en grenseverdi?', 'Hvorfor er det ikke nok å teste ett tilfelle?'],
  },
  {
    id: '2.4C', ferdighet: 'testing', trinn: 'spor', tittel: 'Testtabell: kinobilletten', kilde: 'Bootcamp 2.4C',
    oppgave: 'Bruk regelen fra 2.4B (150 kr, under 18: 40 % rabatt, fra 67: 25 % rabatt). Lag testtabell for **17, 18, 66 og 67**: input, forventet pris og hvorfor. Skriv tabellen i feltet. Hva skal en 17-åring betale?',
    hint: ['17 er under 18.', '150 * 0.60 = ?', '17 → 90.0, 18 → 150.0, 66 → 150.0, 67 → 112.5'],
    svar: { sporsmal: 'Forventet pris for 17 år (tall):', godta: ['90', '90.0', '90 kr', '90.0 kr'] },
    fasit: '| Alder | Forventet | Hvorfor |\n|---:|---:|---|\n| 17 | 90.0 | rett under barnegrensen |\n| 18 | 150.0 | på grensen – første voksenalder |\n| 66 | 150.0 | rett under seniorgrensen |\n| 67 | 112.5 | på grensen – første senioralder |\n\n18 og 67 er viktige fordi det er der regelen skifter. En feil som `>` i stedet for `>=` vises bare akkurat der.',
    sjekk: ['Tabellen har alle fire aldrene', 'Forventet pris er regnet ut for hver', 'Jeg forklarte hvorfor 18 og 67 er grenser'],
    muntlig: ['Hvorfor er 18 og 67 viktige grenseverdier?'],
  },
  {
    id: '9.9', ferdighet: 'testing', trinn: 'skriv', tittel: 'Testplan for rabattmetode', kilde: 'Bootcamp 9.9',
    oppgave: 'Lag testplan (tabell) for en metode som gir rabatt til personer **under 18** og **fra 67**. Du må teste minst: 17, 18, 66, 67 og en ugyldig alder som -1. Kolonner: input, forventet, faktisk (la stå tom), type test (normal/grense/ugyldig).',
    hint: ['Fem rader minimum.', 'Type: 17/18/66/67 = grense, -1 = ugyldig.', 'Legg gjerne til en normal verdi som 35.'],
    fasit: '| Input | Forventet | Faktisk | Type |\n|---:|---|---|---|\n| 35 | ingen rabatt | | normal |\n| 17 | rabatt | | grense |\n| 18 | ingen rabatt | | grense |\n| 66 | ingen rabatt | | grense |\n| 67 | rabatt | | grense |\n| -1 | feilmelding/ugyldig | | ugyldig |',
    sjekk: ['Alle fem påkrevde verdier er med', 'Hver rad har forventet resultat', 'Jeg har en kolonne for faktisk resultat', 'Jeg skilte normal, grense og ugyldig'],
    muntlig: ['Hva skal skje med -1? Hvorfor bør metoden håndtere det?'],
  },
  {
    id: 'test-kode', ferdighet: 'testing', trinn: 'fullfor', tittel: 'Fullfør: automatisk test av en metode', kilde: 'Egenlaget (bygger på kompendiet §32 oppgave 6)',
    oppgave: 'Metoden `test` sammenligner forventet og faktisk verdi og skriver `OK` eller `FEIL`. Fyll inn de tre testkallene for alder **17**, **18** og **67** (forventet 90.0, 150.0 og 112.5). Hvis alt stemmer: tre linjer med OK.',
    kode: main('// test(...) for 17, 18 og 67 her', '', 'public static double beregnPris(int alder) {\n    if (alder < 18) {\n        return 150 * 0.60;\n    } else if (alder >= 67) {\n        return 150 * 0.75;\n    }\n    return 150;\n}\n\npublic static void test(String navn, double faktisk, double forventet) {\n    if (faktisk == forventet) {\n        System.out.println("OK   " + navn);\n    } else {\n        System.out.println("FEIL " + navn + ": fikk " + faktisk + ", ventet " + forventet);\n    }\n}'),
    hint: ['Hvert testkall: navn, faktisk verdi (kall beregnPris), forventet verdi.', 'test("17 år", beregnPris(17), 90.0);', 'Lag tilsvarende for 18 (150.0) og 67 (112.5).'],
    fasit: java('test("17 år", beregnPris(17), 90.0);\ntest("18 år", beregnPris(18), 150.0);\ntest("67 år", beregnPris(67), 112.5);') + '\n\nDette er en enkel **enhetstest**: én metode testes med kjente input og forventede svar. Sammenligning av desimaltall med `==` fungerer her, men kan gi problemer med avrunding i andre beregninger.',
    fasitKode: main('test("17 år", beregnPris(17), 90.0);\ntest("18 år", beregnPris(18), 150.0);\ntest("67 år", beregnPris(67), 112.5);', '', 'public static double beregnPris(int alder) {\n    if (alder < 18) {\n        return 150 * 0.60;\n    } else if (alder >= 67) {\n        return 150 * 0.75;\n    }\n    return 150;\n}\n\npublic static void test(String navn, double faktisk, double forventet) {\n    if (faktisk == forventet) {\n        System.out.println("OK   " + navn);\n    } else {\n        System.out.println("FEIL " + navn + ": fikk " + faktisk + ", ventet " + forventet);\n    }\n}'),
    utskrift: 'OK   17 år\nOK   18 år\nOK   67 år',
    krav: [['test\\s*\\([^)]*17', 'Test alder 17.'], ['test\\s*\\([^)]*18', 'Test alder 18.'], ['test\\s*\\([^)]*67', 'Test alder 67.']],
    muntlig: ['Hva er en enhetstest?', 'Hva er fordelen med å automatisere tester i stedet for å prøve for hånd?'],
  },
  {
    id: 'test-forklar', ferdighet: 'testing', trinn: 'forklar', tittel: 'Forklar: slik tester jeg programmet', kilde: 'Bootcamp 8.2',
    oppgave: 'Sensor: «Hvordan tester du programmet ditt?» Svar høyt i ca. 1 minutt med billettprisen som eksempel. Nevn normaltilfelle, grenseverdi, ugyldig input, forventet vs. faktisk, og én testtype (enhetstest/systemtest/brukertest).',
    hint: ['Start med et vanlig tilfelle.', 'Så grensene der regelen endrer seg.', 'Avslutt med ugyldig input og hva du sammenligner.'],
    fasit: '«Jeg prøver først et vanlig input, for eksempel 35 år. Så tester jeg grenseverdier: 17 og 18, 66 og 67, fordi prisen endres der. Jeg prøver også ugyldig input, som -1 eller tekst. For hver test sammenligner jeg faktisk resultat med forventet resultat i en testtabell. Metoden beregnPris kan jeg teste alene – det er en enhetstest.»',
    sjekk: ['Normaltilfelle', 'Grenseverdi', 'Ugyldig input', 'Forventet vs. faktisk', 'Én testtype nevnt'],
    muntlig: ['Hva er forskjellen på en enhetstest og en brukertest?'],
  },

  /* ======================= DATA ======================= */
  {
    id: 'data-se', ferdighet: 'data', trinn: 'se', tittel: 'Se: datasett, CSV og JSON', kilde: 'Bootcamp 6.1–6.4',
    oppgave: `Et **datasett** er rader (observasjoner) og kolonner (egenskaper).

**CSV** – enkelt tabellformat:
\`\`\`csv
navn,alder,besok
Amina,17,3
Jonas,20,5
\`\`\`
**JSON** – nøkkel/verdi-par og lister, kan nøstes:
\`\`\`json
{ "navn": "Amina", "alder": 17, "aktiv": true, "interesser": ["musikk", "IT"] }
\`\`\`
CSV passer til enkle tabeller/regneark. JSON passer til nøstede objekter og utveksling mellom apper/API-er.

**Analyse:** sum, antall, gjennomsnitt = sum / antall, maks/min. Gjennomsnitt alene kan skjule variasjon – og lite datasett gir usikre konklusjoner.`,
    hint: ['Rad = én person/dag.', 'Kolonne = én egenskap.', 'Snitt = sum / antall.'],
    fasit: 'For besøkstallene 3, 5, 2, 4: sum 14, antall 4, gjennomsnitt 3,5.',
    muntlig: ['Hva er forskjellen på CSV og JSON?', 'Hva kan være galt med et datasett?'],
  },
  {
    id: '6.5', ferdighet: 'data', trinn: 'fullfor', tittel: 'Tell aktive brukere', kilde: 'Bootcamp 6.5',
    oppgave: 'Du får `int[] besok = {3, 5, 2, 4, 8, 1};`. Skriv løkka som teller hvor mange som har **minst 4** besøk. Forventet: `3`.',
    kode: main('int[] besok = {3, 5, 2, 4, 8, 1};\nint antall = 0;\n// løkke her\nSystem.out.println(antall);'),
    hint: ['«Minst 4» betyr 4 eller mer.', 'for (int i = 0; i < besok.length; i++) { if (besok[i] >= 4) … }', 'antall++;'],
    fasit: java(main('int[] besok = {3, 5, 2, 4, 8, 1};\nint antall = 0;\nfor (int i = 0; i < besok.length; i++) {\n    if (besok[i] >= 4) {\n        antall++;\n    }\n}\nSystem.out.println(antall); // 3')),
    fasitKode: main('int[] besok = {3, 5, 2, 4, 8, 1};\nint antall = 0;\nfor (int i = 0; i < besok.length; i++) {\n    if (besok[i] >= 4) {\n        antall++;\n    }\n}\nSystem.out.println(antall);'), utskrift: '3',
    krav: [['>=\\s*4', '«Minst 4» = >= 4.']],
    muntlig: ['Endre programmet til å telle brukere under 18 år – hva mangler i datastrukturen?'],
  },
  {
    id: '9.12', ferdighet: 'data', trinn: 'skriv', tittel: 'Sum, snitt, min og maks', kilde: 'Bootcamp 9.12 + 6.5 videre',
    oppgave: `Besøkstall: \`{2, 4, 4, 6, 1, 7}\`. Beregn **sum, gjennomsnitt, minimum og maksimum** i én løkke og skriv ut:
\`\`\`text
Sum: 24
Snitt: 4.0
Min: 1
Maks: 7
\`\`\`
Skriv deretter en kort tolkning (2 setninger) i feltet for muntlig svar.`,
    hint: ['Start min og maks på det første elementet.', 'I løkka: sum += t; if (t < min) min = t; if (t > maks) maks = t;', 'double snitt = (double) sum / besok.length;'],
    fasit: java(main('int[] besok = {2, 4, 4, 6, 1, 7};\nint sum = 0;\nint min = besok[0];\nint maks = besok[0];\nfor (int t : besok) {\n    sum += t;\n    if (t < min) {\n        min = t;\n    }\n    if (t > maks) {\n        maks = t;\n    }\n}\ndouble snitt = (double) sum / besok.length;\nSystem.out.println("Sum: " + sum);\nSystem.out.println("Snitt: " + snitt);\nSystem.out.println("Min: " + min);\nSystem.out.println("Maks: " + maks);')) + '\n\nTolkning: i snitt 4 besøk, men stor variasjon (1–7). Seks målinger er for lite til sikre konklusjoner.',
    fasitKode: main('int[] besok = {2, 4, 4, 6, 1, 7};\nint sum = 0;\nint min = besok[0];\nint maks = besok[0];\nfor (int t : besok) {\n    sum += t;\n    if (t < min) {\n        min = t;\n    }\n    if (t > maks) {\n        maks = t;\n    }\n}\ndouble snitt = (double) sum / besok.length;\nSystem.out.println("Sum: " + sum);\nSystem.out.println("Snitt: " + snitt);\nSystem.out.println("Min: " + min);\nSystem.out.println("Maks: " + maks);'),
    utskrift: 'Sum: 24\nSnitt: 4.0\nMin: 1\nMaks: 7',
    krav: [['for\\s*\\(', 'Bruk en løkke.']],
    muntlig: ['Hvorfor kan gjennomsnittet alene være misvisende?', 'Hvordan ville du presentert resultatet for en leder: tabell, stolpediagram eller tekst?'],
  },
  {
    id: 'caseB', ferdighet: 'data', trinn: 'overfor', tittel: 'CASE B: besøksanalyse for ungdomshus', kilde: 'Bootcamp 10 CASE B',
    oppgave: `Et ungdomshus registrerer anonymt antall besøk per dag:

| Dag | Besøk |
|---|---:|
| Mandag | 18 |
| Tirsdag | 12 |
| Onsdag | 23 |
| Torsdag | 19 |
| Fredag | 31 |

Lag datastrukturen, beregn total og gjennomsnitt, og finn **dagen** med flest besøk:
\`\`\`text
Totalt: 103
Gjennomsnitt: 20.6
Flest besøk: Fredag (31)
\`\`\`
Tips: to arrayer med samme indeks – \`String[] dager\` og \`int[] besok\`.`,
    plan: true,
    hint: ['Hold styr på INDEKSEN til den største verdien, ikke bare verdien.', 'int maksIndeks = 0; for (int i = 1; i < besok.length; i++) if (besok[i] > besok[maksIndeks]) maksIndeks = i;', 'dager[maksIndeks] + " (" + besok[maksIndeks] + ")"'],
    fasit: java(main('String[] dager = {"Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"};\nint[] besok = {18, 12, 23, 19, 31};\nint sum = 0;\nint maksIndeks = 0;\nfor (int i = 0; i < besok.length; i++) {\n    sum += besok[i];\n    if (besok[i] > besok[maksIndeks]) {\n        maksIndeks = i;\n    }\n}\ndouble snitt = (double) sum / besok.length;\nSystem.out.println("Totalt: " + sum);\nSystem.out.println("Gjennomsnitt: " + snitt);\nSystem.out.println("Flest besøk: " + dager[maksIndeks] + " (" + besok[maksIndeks] + ")");')),
    fasitKode: main('String[] dager = {"Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"};\nint[] besok = {18, 12, 23, 19, 31};\nint sum = 0;\nint maksIndeks = 0;\nfor (int i = 0; i < besok.length; i++) {\n    sum += besok[i];\n    if (besok[i] > besok[maksIndeks]) {\n        maksIndeks = i;\n    }\n}\ndouble snitt = (double) sum / besok.length;\nSystem.out.println("Totalt: " + sum);\nSystem.out.println("Gjennomsnitt: " + snitt);\nSystem.out.println("Flest besøk: " + dager[maksIndeks] + " (" + besok[maksIndeks] + ")");'),
    utskrift: 'Totalt: 103\nGjennomsnitt: 20.6\nFlest besøk: Fredag (31)',
    krav: [['for\\s*\\(', 'Bruk en løkke.'], ['String\\s*\\[\\]|ArrayList<String>', 'Lagre dagene også, ikke bare tallene.']],
    muntlig: ['Kan du konkludere med at fredag er den mest populære dagen? Hva betyr «populær»?', 'Hvilke datakvalitetsproblemer kan finnes (manglende registrering, dobbelttelling, unike personer)?', 'Hvilke personvernprinsipper blir relevante hvis huset vil registrere navn?'],
  },
  {
    id: 'data-csv', ferdighet: 'data', trinn: 'overfor', tittel: 'Overfør: les CSV-linjer og filtrer', kilde: 'Egenlaget (bygger på Bootcamp 6.2)',
    oppgave: `Dataene kommer som CSV-linjer (\`navn,alder,besok\`):
\`\`\`java
String[] linjer = {"Amina,17,3", "Jonas,20,5", "Mina,16,2", "Leo,22,4"};
\`\`\`
For hver linje: del opp med \`split(",")\`, gjør om alder og besøk til tall med \`Integer.parseInt\`. Tell hvor mange som er **under 18**, og regn ut snittet av besøk for alle:
\`\`\`text
Under 18: 2
Snitt besøk: 3.5
\`\`\``,
    plan: true,
    hint: ['String[] felt = linje.split(",");  gir felt[0] = navn, felt[1] = alder, felt[2] = besøk.', 'int alder = Integer.parseInt(felt[1]);', 'if (alder < 18) under18++;  sumBesok += Integer.parseInt(felt[2]);'],
    fasit: java(main('String[] linjer = {"Amina,17,3", "Jonas,20,5", "Mina,16,2", "Leo,22,4"};\nint under18 = 0;\nint sumBesok = 0;\nfor (String linje : linjer) {\n    String[] felt = linje.split(",");\n    int alder = Integer.parseInt(felt[1]);\n    int besok = Integer.parseInt(felt[2]);\n    if (alder < 18) {\n        under18++;\n    }\n    sumBesok += besok;\n}\nSystem.out.println("Under 18: " + under18);\nSystem.out.println("Snitt besøk: " + (double) sumBesok / linjer.length);')) + '\n\nI et ekte program ville linjene blitt lest fra en fil, og overskriftsraden måtte hoppes over.',
    fasitKode: main('String[] linjer = {"Amina,17,3", "Jonas,20,5", "Mina,16,2", "Leo,22,4"};\nint under18 = 0;\nint sumBesok = 0;\nfor (String linje : linjer) {\n    String[] felt = linje.split(",");\n    int alder = Integer.parseInt(felt[1]);\n    int besok = Integer.parseInt(felt[2]);\n    if (alder < 18) {\n        under18++;\n    }\n    sumBesok += besok;\n}\nSystem.out.println("Under 18: " + under18);\nSystem.out.println("Snitt besøk: " + (double) sumBesok / linjer.length);'),
    utskrift: 'Under 18: 2\nSnitt besøk: 3.5',
    krav: [['split', 'Del linjene med split(",").'], ['parseInt', 'Konverter tekst til tall med Integer.parseInt.']],
    muntlig: ['Hva skjer hvis en linje mangler et felt, f.eks. "Ola,19"?', 'Hvorfor er alder en personopplysning sammen med navn?'],
  },
  {
    id: 'data-forklar', ferdighet: 'data', trinn: 'forklar', tittel: 'Forklar: CSV, JSON og datakvalitet', kilde: 'Bootcamp 8.2, 11 eksempel 5',
    oppgave: 'Svar høyt: (1) Hva er forskjellen på CSV og JSON, og når passer hver? (2) Nevn to ting som kan gjøre et datasett upålitelig. (3) Hva er en primærnøkkel?',
    hint: ['CSV = tabell. JSON = objekter/lister som kan nøstes.', 'Manglende verdier, dobbelttelling, feil format, for lite utvalg.', 'Primærnøkkel identifiserer en rad unikt (f.eks. elevId).'],
    fasit: '«CSV passer til en enkel tabell med rader og kolonner og åpnes lett i regneark. JSON kan representere objekter og lister inni hverandre og er vanlig når apper og API-er utveksler data. Et datasett kan være upålitelig hvis det mangler registreringer, har dobbelttellinger eller er for lite. En primærnøkkel er et felt som identifiserer hver rad unikt, for eksempel et elevnummer.»',
    sjekk: ['CSV vs JSON med når hver passer', 'To datakvalitetsproblemer', 'Primærnøkkel forklart'],
    muntlig: ['Hva er forskjellen på korrelasjon og årsakssammenheng?'],
  },

  /* ======================= ALTERNATIVER ======================= */
  {
    id: 'alt-ifswitch', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ: if/else eller switch?', kilde: 'Bootcamp 11 eksempel 1',
    oppgave: 'Et program viser en melding for hver ukedag (1–7). Ville du brukt `if/else` eller `switch`? Gi én fordel og én ulempe, og forklar hvorfor `if/else` passer bedre for aldersgrupper.',
    hint: ['Mange valg basert på samme variabel …', 'switch sammenligner med eksakte verdier.', 'Alder «under 18» er et intervall.'],
    fasit: '«For ukedager med sju eksakte verdier er `switch` ryddig og lett å lese. `if/else` er mer fleksibel med intervaller, som alder under 18 eller fra 67, og derfor bedre der. Ulempen med lange if/else-kjeder er at de blir uoversiktlige.»',
    sjekk: ['Jeg valgte for ukedag-eksempelet', 'Fordel og ulempe', 'Jeg forklarte intervall vs. eksakte verdier'],
    muntlig: ['Hvilken løsning er lettest å utvide med nye regler?'],
  },
  {
    id: 'alt-generell', ferdighet: 'alternativ', trinn: 'alternativ', tittel: 'Alternativ: oppskriften på sensors spørsmål', kilde: 'Bootcamp 11 / 5.6',
    oppgave: 'Velg ett av programmene du har laget i dag (f.eks. Bok, PC-utlån eller besøksanalysen). Svar høyt på: Kunne du brukt en annen løkke? Lagt logikken i en metode? Brukt liste i stedet for separate variabler? Klasse eller bare metoder? Hva blir enklere/vanskeligere?',
    hint: ['Oppskrift: min løsning → alternativ → fordel/ulempe → valg.', 'Eks: lagre utlån i en ArrayList<Laan> i stedet for boolean i PC.', 'Eller: database i stedet for liste i minnet.'],
    fasit: '«Jeg lagret status som `boolean tilgjengelig` i PC. Et alternativ er en liste med `Laan`-objekter. Fordelen er historikk og datoer, ulempen er mer kode. Et tredje alternativ er en database, som er bedre når flere ansatte bruker systemet samtidig og data må lagres permanent. For eksamen ville jeg vist boolean-løsningen og forklart Laan som forbedring.»',
    sjekk: ['Min løsning beskrevet', 'Minst ett konkret alternativ', 'Fordel og ulempe', 'Valg med begrunnelse'],
    muntlig: ['Hva ville du forbedret med mer tid?'],
  },

  /* ======================= MUNTLIG BREDDE (alle 11 mål) ======================= */
  {
    id: 'etikk-kamera', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Etikk: kameraovervåking i ungdomshus (P–F–R–T–K)', kilde: 'Bootcamp 12.1',
    oppgave: 'Drøft høyt i 2–3 minutter: Et ungdomshus vurderer kameraovervåking. Bruk **P–F–R–T–K**: Problem, Fordeler, Risiko, Tiltak, Konklusjon. Nevn minst én fordel, én risiko og ett tiltak.',
    hint: ['P: trygghet vs. privatliv.', 'F: forebygge tyveri. R: mindre privatliv, misbruk av opptak, barn er sårbare.', 'T: ikke i private rom, begrenset tilgang, kort lagringstid, informasjon, alternativer (bemanning).'],
    fasit: '«Dilemmaet er trygghet mot privatliv. Kamera kan forebygge tyveri og hjelpe å undersøke hendelser. Men besøkende – ofte barn og unge – får mindre privatliv, opptak kan misbrukes, og det kan skape mistillit. Tiltak: vurder om kamera er nødvendig, bare ved inngang, ikke i private rom, begrens hvem som ser opptak, slett etter kort tid og informer tydelig. Konklusjon: kan forsvares med et konkret formål og strenge begrensninger, men bedre bemanning bør vurderes først.»',
    sjekk: ['Problem formulert', 'Minst én fordel', 'Minst én risiko', 'Minst ett konkret tiltak', 'Nyansert konklusjon'],
    muntlig: ['Hvem er interessentene?', 'Hvilke GDPR-prinsipper er relevante?'],
  },
  {
    id: 'gdpr', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Personvern: personopplysninger og dataminimering', kilde: 'Bootcamp 12.2',
    oppgave: 'Forklar høyt: Hva er en **personopplysning**? Nevn tre GDPR-prinsipper og bruk PC-utlånet (CASE A) som eksempel: trenger systemet elevens fulle navn og adresse?',
    hint: ['Opplysning som kan knyttes til en identifiserbar person.', 'Formålsbegrensning, dataminimering, lagringsbegrensning, åpenhet …', 'Elev-ID i stedet for navn/adresse.'],
    fasit: '«En personopplysning er informasjon som kan knyttes til en identifisert eller identifiserbar person, som navn, e-post, bilde eller en elev-ID. Dataminimering betyr å samle bare det som trengs, formålsbegrensning at data bare brukes til det oppgitte formålet, og lagringsbegrensning at de slettes når de ikke trengs. PC-utlånet trenger en elev-ID og kanskje klasse – ikke adresse.»',
    sjekk: ['Definisjon av personopplysning', 'Tre prinsipper', 'Koblet til PC-utlånet'],
    muntlig: ['Er en elev-ID en personopplysning? Hvorfor?'],
  },
  {
    id: 'sikkerhet', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Sikkerhet: KIT, autentisering, kryptering', kilde: 'Bootcamp 12.3',
    oppgave: 'Forklar høyt: (1) konfidensialitet, integritet og tilgjengelighet, (2) forskjellen på **autentisering** og **autorisasjon**, (3) forskjellen på **kryptering** og **hashing**. Gi ett tiltak for hver av de tre i (1).',
    hint: ['K: bare autoriserte. I: ikke endret uautorisert. T: tilgjengelig når det trengs.', 'Autentisering = hvem er du. Autorisasjon = hva har du lov til.', 'Kryptering kan dekrypteres med nøkkel; hashing er enveis (passordlagring).'],
    fasit: '«Konfidensialitet betyr at bare de som har lov, får tilgang – tiltak: tilgangsstyring og kryptering. Integritet betyr at data ikke endres uautorisert – tiltak: logging og tilgangskontroll. Tilgjengelighet betyr at systemet virker når det trengs – tiltak: sikkerhetskopi. Autentisering sjekker hvem du er (passord, flerfaktor), autorisasjon hva du har lov til. Kryptering gjør data uleselige uten nøkkel og kan reverseres; hashing er enveis og brukes for å lagre passord.»',
    sjekk: ['K, I og T forklart', 'Ett tiltak per del', 'Autentisering vs autorisasjon', 'Kryptering vs hashing'],
    muntlig: ['Hvorfor lagrer man ikke passord i klartekst?'],
  },
  {
    id: 'brukervennlighet', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Brukervennlighet og universell utforming', kilde: 'Bootcamp 12.4',
    oppgave: 'Et skjema i PC-utlånsappen viser bare «Feil» når noe mangler. Forklar høyt hva **brukervennlighet** er, hvorfor meldingen er dårlig, og foreslå tre forbedringer – minst én for **tilgjengelighet** (universell utforming).',
    hint: ['Forståelig, effektivt, tilpasset brukeren.', 'Hvilket felt? Hvordan rette?', 'Kontrast, skriftstørrelse, skjermleser, ikke bare farge.'],
    fasit: '«Brukervennlighet betyr at systemet er forståelig, effektivt og tilpasset brukerens behov. «Feil» sier ikke hva som er galt eller hvordan man retter det. Bedre: «Elev-ID mangler – skriv 6 siffer», marker feltet, og behold det brukeren har skrevet. For tilgjengelighet: god kontrast, tekst i tillegg til rød farge, og feltnavn som skjermlesere kan lese opp. Jeg ville testet med ekte brukere.»',
    sjekk: ['Definisjon', 'Hvorfor «Feil» er dårlig', 'Tre forbedringer', 'Minst én om tilgjengelighet'],
    muntlig: ['Hvordan gjennomfører du en enkel brukertest?'],
  },
  {
    id: 'systemutvikling', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Systemutvikling: smidig, fossefall og Git', kilde: 'Bootcamp 12.5',
    oppgave: 'Forklar høyt: forskjellen på **fossefall** og **smidig** utvikling, hva en **prototype** er, og hvordan **Git** støtter samarbeid. Hvilken metode ville du valgt for PC-utlånsappen, og hvorfor?',
    hint: ['Fossefall: faser i rekkefølge. Smidig: korte iterasjoner med tilbakemelding.', 'Prototype: tidlig, enkel versjon for å teste en idé.', 'Git: historikk, grener, flere kan jobbe samtidig, gå tilbake.'],
    fasit: '«I fossefall gjennomføres krav, design, programmering og test i faste faser etter hverandre – passer når kravene er klare. Smidig utvikling jobber i korte iterasjoner med hyppig tilbakemelding fra brukerne. En prototype er en tidlig, enkel versjon for å teste idéen. Git er versjonskontroll: den lagrer historikk, lar flere jobbe på grener og slå sammen endringer, og gjør det mulig å gå tilbake. For PC-utlånet ville jeg valgt smidig, fordi bibliotekarene kan gi tilbakemelding underveis.»',
    sjekk: ['Fossefall vs smidig', 'Prototype', 'Git og samarbeid', 'Valg med begrunnelse'],
    muntlig: ['Hva er en sprint i Scrum?'],
  },
  {
    id: 'samfunn', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'IT i samfunnet: muligheter og konsekvenser', kilde: 'Kompendiet kap. 1 / Bootcamp 13.4',
    oppgave: 'Velg ett digitalt system (f.eks. digital skoleportal eller KI som vurderer elevbesvarelser). Forklar høyt: hvem påvirkes, to **muligheter**, to **utfordringer/konsekvenser**, og ett etisk dilemma ved KI.',
    hint: ['Interessenter: elever, lærere, foreldre, skoleeier.', 'Muligheter: effektivitet, tilgang. Utfordringer: personvern, skjevhet, digitalt utenforskap.', 'KI: skjeve treningsdata, hvem har ansvaret, gjennomsiktighet.'],
    fasit: '«En digital skoleportal påvirker elever, lærere og foreldre. Den gir rask informasjon og mindre papir, og fravær kan følges opp tidlig. Men den samler mye personopplysninger og kan gi press og overvåking, og ikke alle har lik digital kompetanse. Bruker man KI til å vurdere besvarelser, kan skjeve treningsdata gi urettferdige karakterer, og det må være tydelig at en lærer har ansvaret.»',
    sjekk: ['Interessenter', 'To muligheter', 'To utfordringer', 'Ett KI-dilemma'],
    muntlig: ['Hva betyr algoritmisk skjevhet?'],
  },
  {
    id: 'forklar-eget', ferdighet: 'muntlig', trinn: 'forklar', tittel: 'Forklar ditt eget program uten å lese', kilde: 'Lørdag 17:15 / Bootcamp 15',
    oppgave: 'Velg ett program du skrev selv i dag. Snakk i **minst 2 minutter uten å se på koden**: formål → input og output → variablene → betingelser og løkker → metoder → (OOP: klasse, objekt, attributter) → hvordan du testet → hva du ville forbedret.',
    hint: ['Start med «Programmet skal …».', '«Denne variabelen lagrer …», «Betingelsen sjekker om …», «Løkken gjentar … så lenge …».', 'Avslutt: «Jeg testet … En forbedring er …».'],
    fasit: 'Svarramme: «Først vil jeg beskrive hva programmet skal få inn og hva det skal gi ut. Jeg delte løsningen inn i disse stegene … Denne variabelen lagrer … Betingelsen sjekker om … Løkken gjentar … så lenge … Metoden samler logikk så jeg kan gjenbruke den. Jeg testet normaltilfellet, en grenseverdi og ugyldig input. En alternativ løsning er …, fordelen er …, ulempen er ….»',
    sjekk: ['Snakket minst 2 minutter uten å lese', 'Forklarte input og output', 'Brukte fagbegreper (variabel, betingelse, løkke, metode)', 'Sa hvordan jeg testet', 'Foreslo en forbedring'],
    muntlig: ['Hva var det vanskeligste i programmet, og hvordan løste du det?'],
  },
];
