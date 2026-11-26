# PRAKTISK TILLEGG – IT2 HELGEBOOTCAMP
## REA3050 muntlig-praktisk | Lørdag 28. og søndag 29. november 2026

**Situasjon:** Kandidaten har ikke startet å øve og opplever at hen ikke kan programmere. Kandidaten lærer raskt når stoffet blir vist trinnvis, men trenger å kunne skrive, forstå, rette og forklare kode – ikke bare kjenne igjen begreper.

**Mål:** Forberede kandidaten best mulig til å vise tilstrekkelig kompetanse for karakter 2. Øvingen skal ha en liten sikkerhetsmargin ved å bruke nye varianter av de samme ferdighetene. Det finnes ingen garanti for eksamensresultatet.

**Viktig:** Dette dokumentet er laget for aktiv praksis. Les hvert mikrokapittel, gjør oppgavene uten fasit, og forklar svarene høyt. Det er ikke meningen at du skal lese hele dokumentet passivt.

---

# DEL 1 – HVA SOM FAKTISK MÅ TRENES

## 1.1 Prioritering når du bare har to dager

IT2 har 11 kompetansemål. Det er umulig å lære hele faget grundig fra null på to dager. Derfor må du prioritere det som lar deg vise kompetanse i flere mål samtidig.

### Høyeste prioritet – praktisk kjerne

1. Forstå en enkel oppgavetekst og dele den opp i input, behandling og output.
2. Skrive og forklare variabler, datatyper, operatorer, `if/else`, løkker og lister.
3. Skrive og bruke funksjoner/metoder med parametere og returverdier.
4. Forstå klasse, objekt, attributt, metode og konstruktør.
5. Lage/lese en enkel objektorientert modell og forklare relasjonene.
6. Teste kode, finne feil og begrunne forbedringer.
7. Foreslå et alternativ og sammenligne fordeler/ulemper.

### Andre prioritet – enkel, men viktig bredde

8. Behandle et lite datasett: hente/lese, filtrere, telle, regne og presentere.
9. Forklare CSV, JSON, database, primærnøkkel og enkel datautveksling.
10. Drøfte et IT-etisk dilemma med interessenter, fordeler, ulemper og tiltak.
11. Forklare enkel informasjonssikkerhet, personvern, brukervennlighet og systemutvikling.

Du skal ikke bruke helgen på å lære komplekse rammeverk, avanserte algoritmer, omfattende SQL, webutvikling, store biblioteker eller flere programmeringsspråk.

## 1.2 Hva betyr karakter 2 i praksis?

Udirs læreplan har 11 kompetansemål. Karakteren settes på grunnlag av kompetansen som vises på eksamen, ikke hvor mange sider du har lest. Udir understreker at eksamen skal gi kandidaten mulighet til å vise kompetanse i så stor del av faget som mulig ut fra eksamensformen.

Trøndelag fylkeskommune har publisert et eksempel på vurderingskriterier for REA3050 der lav kompetanse (karakter 2) beskrives med formuleringer som «til en viss grad forklare» og «i noen grad vise forståelse» innen kreativ problemløsing, teknologi/samfunn, modellering/programmering og digital representasjon. Dette er nyttig som et offentlig eksempel på hvordan karakter 2 kan konkretiseres, men det er **ikke et bindende Oslo-kriteriesett**. På din eksamen er kriteriene som følger oppgavesettet og gjeldende lokale regler styrende.

Praktisk oversatt bør du forsøke å vise at du kan litt av de sentrale tingene:
- forklare hva en enkel løsning gjør
- utføre noen grunnleggende programmeringssteg
- beskrive en enkel objektorientert struktur
- teste og rette enkle feil
- forklare hvordan data behandles og lagres
- nevne relevante fordeler, ulemper og sikkerhets-/etikkhensyn

Det er bedre å klare en enkel oppgave og forklare den riktig enn å forsøke å imponere med avansert kode du ikke forstår.

## 1.3 Kjerneprosessen du skal bruke på nesten alle oppgaver

Husk denne rekkefølgen:

**Problem → Input → Behandling → Output → Test → Forklaring → Alternativ**

Eksempel: «Lag et program som regner ut prisen på en kinobillett.»

- Problem: finne riktig billettpris.
- Input: alder og ordinær pris.
- Behandling: sjekke alderen og velge rabatt.
- Output: vise pris.
- Test: prøv barn, voksen, senior og grenseverdier.
- Forklaring: fortell hva betingelsen gjør.
- Alternativ: bruk en egen metode for å regne ut rabatt.

Hvis du står fast på eksamen, start med å si høyt hva programmet skal få inn og hva det skal gi ut. Det hjelper deg å strukturere løsningen.

---

# DEL 2 – PROGRAMMERING FRA ABSOLUTT NULL

> Eksemplene nedenfor bruker Java som et konkret og konsekvent treningsspråk. Dette betyr ikke at REA3050 krever Java. Bruk språket som står i din eksamensinformasjon eller som er relevant for ditt lokale opplegg. Dersom det ikke er avklart, lær logikken først og bruk disse Java-eksemplene som øvelse. Ikke prøv å lære flere språk på to dager.

## 2.1 Hva er kode?

Et program er en rekke presise instruksjoner som datamaskinen utfører. Datamaskinen forstår ikke hva du «mener». Den følger instruksjonene nøyaktig. Hvis du glemmer en parentes, bruker en variabel som ikke finnes, eller skriver en betingelse feil, kan programmet stoppe eller gjøre noe annet enn du ønsket.

I Java kan et minimalt program se slik ut:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hei!");
    }
}
```

Les det slik:
- `public class Main` oppretter en klasse som heter `Main`.
- `main` er startpunktet Java bruker når programmet kjøres.
- `{` og `}` markerer hvor kodeblokker starter og slutter.
- `System.out.println(...)` skriver tekst til skjermen.
- Tekst må stå mellom doble anførselstegn.
- Semikolon `;` avslutter en instruksjon i Java.

Du trenger ikke forstå alle ordene i Java-programmets oppstart fullt ut nå. Du må kunne kjenne igjen strukturen og skrive instruksjonene inni `main`.

### Oppgave 2.1A – første endring

Endre programmet slik at det skriver ut:

1. Fornavnet ditt.
2. `Jeg øver på Informasjonsteknologi 2.`
3. `Målet mitt er å bestå REA3050.`

**Kontroll:** Kjør programmet. Hvis det ikke kjører, sjekk at tekst står i `" "`, at parenteser er på plass og at hver `println` slutter med `;`.

## 2.2 Variabler – lagre informasjon

En variabel er en navngitt plass der programmet lagrer en verdi. Tenk på en merket boks.

```java
int alder = 20;
double pris = 149.50;
String navn = "Amina";
boolean student = true;
```

Vanlige datatyper:

- `int`: heltall, for eksempel `20`.
- `double`: tall med desimaler, for eksempel `149.50`.
- `String`: tekst, for eksempel `"Amina"`.
- `boolean`: sann/usann, `true` eller `false`.

Venstresiden gir variabelen navn og datatype. Høyresiden er verdien som lagres.

```java
int antall = 3;
int prisPerBillett = 120;
int total = antall * prisPerBillett;
System.out.println(total); // 360
```

`=` betyr tilordning: lagre verdien på høyre side i variabelen på venstre side. `==` brukes for å sammenligne om to verdier er like.

### Oppgave 2.2A – enkel regning

Lag variablene `prisPerVare = 79` og `antall = 4`. Regn ut totalprisen og skriv den ut.

### Oppgave 2.2B – moms

Lag `double prisUtenMoms = 200.0` og `final double MOMS = 0.25`. Regn ut pris med moms. Forklar hvorfor `MOMS` er en konstant og hva `0.25` betyr.

**Løsningsforslag:**

```java
double prisUtenMoms = 200.0;
final double MOMS = 0.25;
double prisMedMoms = prisUtenMoms * (1 + MOMS);
System.out.println(prisMedMoms); // 250.0
```

### Oppgave 2.2C – finn feilen

```java
int alder = "20";
```

Hva er galt? `20` er skrevet som tekst, men variabelen forventer et heltall. Riktig kan være `int alder = 20;` eller `String alder = "20";`, avhengig av hva du skal bruke den til.

## 2.3 Input – la brukeren skrive inn data

`Scanner` kan lese inn det brukeren skriver i konsollen.

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Hva heter du? ");
        String navn = input.nextLine();

        System.out.println("Hei, " + navn + "!");
        input.close();
    }
}
```

Viktige deler:
- `import java.util.Scanner;` gjør Scanner-klassen tilgjengelig.
- `new Scanner(System.in)` oppretter et objekt som leser fra tastaturet.
- `nextLine()` leser en tekstlinje.
- `nextInt()` leser et heltall.
- `nextDouble()` leser et desimaltall.
- `+` kan lime sammen tekst og variabler.

**Vanlig nybegynnerproblem:** Etter `nextInt()` kan linjeskiftet bli liggende i inputbufferen. Hvis du senere kaller `nextLine()`, kan den lese den tomme resten av linjen. Et ekstra `input.nextLine()` kan rydde dette opp.

### Oppgave 2.3A

Lag et program som spør om brukerens alder, lagrer svaret i en `int`, og skriver ut `Du er X år gammel.`

### Oppgave 2.3B

Lag et program som spør om antall billetter og pris per billett, beregner totalen og skriver ut svaret.

## 2.4 Betingelser – programmet tar valg

En betingelse lar programmet velge mellom ulike handlinger.

```java
int alder = 17;

if (alder >= 18) {
    System.out.println("Myndig");
} else {
    System.out.println("Ikke myndig");
}
```

- `if`: hvis betingelsen er sann.
- `else`: ellers.
- `>=`: større enn eller lik.
- `>`: større enn.
- `<`: mindre enn.
- `<=`: mindre enn eller lik.
- `==`: er lik.
- `!=`: er ulik.
- `&&`: OG – begge vilkårene må være sanne.
- `||`: ELLER – minst ett vilkår må være sant.
- `!`: IKKE – snur en boolsk verdi.

### Eksempel med flere valg

```java
int alder = 67;

if (alder < 18) {
    System.out.println("Barn: 80 kr");
} else if (alder >= 67) {
    System.out.println("Senior: 100 kr");
} else {
    System.out.println("Voksen: 150 kr");
}
```

Rekkefølgen betyr noe. Hvis du først sjekker `alder >= 18`, kan en senior også gå inn i voksen-grenen og aldri nå seniorvalget. Test derfor grensene.

### Oppgave 2.4A – enkel

Skriv kode som sjekker om et tall er positivt, negativt eller null.

### Oppgave 2.4B – middels

En kinobillett koster 150 kr. Barn under 18 får 40 % rabatt. Personer fra og med 67 år får 25 % rabatt. Andre betaler full pris. Skriv koden som velger riktig pris.

### Oppgave 2.4C – grenseverdier

Hvilken pris skal en person på 17, 18, 66 og 67 år få? Lag testtabell. Forklar hvorfor 18 og 67 er viktige grenseverdier.

**Løsningsforslag til 2.4B:**

```java
double grunnpris = 150.0;
int alder = 67;
double pris;

if (alder < 18) {
    pris = grunnpris * 0.60;
} else if (alder >= 67) {
    pris = grunnpris * 0.75;
} else {
    pris = grunnpris;
}

System.out.println("Pris: " + pris + " kr");
```

## 2.5 Løkker – gjenta kode

En løkke gjentar instruksjoner. Bruk en løkke når du skal gjøre noe flere ganger.

### `for`-løkke

Brukes ofte når du vet hvor mange ganger du skal gjenta.

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

Dette skriver ut 1, 2, 3, 4 og 5.

- `int i = 1`: startverdi.
- `i <= 5`: fortsett så lenge betingelsen er sann.
- `i++`: øk `i` med 1 etter hver runde.

### `while`-løkke

Brukes ofte når du ikke vet på forhånd hvor mange ganger det blir gjentatt.

```java
int teller = 1;
while (teller <= 3) {
    System.out.println("Runde " + teller);
    teller++;
}
```

Hvis du glemmer `teller++`, blir betingelsen aldri usann og løkken kan fortsette evig.

### Oppgave 2.5A

Skriv en `for`-løkke som skriver ut tallene 1 til 10.

### Oppgave 2.5B

Skriv en løkke som legger sammen tallene 1 til 5 og skriver ut summen 15.

### Oppgave 2.5C – finn feilen

```java
int i = 1;
while (i <= 5) {
    System.out.println(i);
}
```

Feilen er at `i` aldri økes. Legg inn `i++;` inne i løkken.

## 2.6 Lister – lagre flere verdier

En liste lar programmet lagre flere verdier i én samling. Java har blant annet `ArrayList`.

```java
import java.util.ArrayList;

ArrayList<String> navn = new ArrayList<>();
navn.add("Amina");
navn.add("Jonas");
navn.add("Mina");

System.out.println(navn.get(0)); // Amina
System.out.println(navn.size()); // 3
```

Indekser starter på 0. Første element har indeks 0, andre har indeks 1 osv.

```java
for (int i = 0; i < navn.size(); i++) {
    System.out.println(navn.get(i));
}
```

Du kan også bruke en for-each-løkke:

```java
for (String person : navn) {
    System.out.println(person);
}
```

### Oppgave 2.6A

Lag en liste med tre byer. Skriv ut alle byene med en løkke.

### Oppgave 2.6B

Lag en liste med fem priser. Beregn summen.

### Oppgave 2.6C

Lag en liste med temperaturer. Tell hvor mange temperaturer som er over 20 grader.

## 2.7 Metoder – del opp programmet

En metode er en navngitt kodeblokk som utfører en bestemt oppgave. Metoder gjør programmet mer oversiktlig og gjør det mulig å gjenbruke kode.

```java
public static int summer(int a, int b) {
    return a + b;
}
```

Kall metoden slik:

```java
int resultat = summer(4, 5);
System.out.println(resultat); // 9
```

- `public`: tilgjengelig fra andre deler av programmet (i denne enkle sammenhengen).
- `static`: metoden kan kalles fra `main` uten å opprette et objekt av klassen.
- `int`: metoden returnerer et heltall.
- `summer`: metodenavnet.
- `int a, int b`: parametere, altså verdier metoden mottar.
- `return`: sender resultatet tilbake.

### Metode uten returverdi

```java
public static void siHei(String navn) {
    System.out.println("Hei " + navn);
}
```

`void` betyr at metoden ikke returnerer en verdi.

### Oppgave 2.7A

Skriv en metode `doble(int tall)` som returnerer tallet ganget med 2.

### Oppgave 2.7B

Skriv en metode `erMyndig(int alder)` som returnerer `true` dersom alderen er minst 18, ellers `false`.

### Oppgave 2.7C

Skriv en metode som mottar en liste med heltall og returnerer summen. Forklar hvorfor dette er mer gjenbrukbart enn å kopiere summekoden flere steder.

**Løsningsforslag:**

```java
public static int doble(int tall) {
    return tall * 2;
}

public static boolean erMyndig(int alder) {
    return alder >= 18;
}
```

## 2.8 Samlet program – billettkalkulator

Dette programmet kombinerer input, variabler, betingelser og output.

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Skriv inn alder: ");
        int alder = input.nextInt();

        double pris = 150.0;
        if (alder < 18) {
            pris = 90.0;
        } else if (alder >= 67) {
            pris = 112.5;
        }

        System.out.println("Billettpris: " + pris + " kr");
        input.close();
    }
}
```

### Gjør dette selv – ikke kopier

1. Skriv programmet på nytt fra blankt ark.
2. Kjør det med alder 12, 30 og 70.
3. Endre grunnprisen til 180 kr.
4. Endre barnerabatten til 50 %.
5. Legg til en egen metode som beregner prisen.
6. Forklar hver linje i din egen versjon.

### Alternativ løsning

I stedet for å ha hele logikken i `main`, kan du lage metoden `beregnPris(int alder, double grunnpris)`. Fordelen er at metoden kan testes separat og gjenbrukes. Ulempen er at programmet får litt flere deler, som en nybegynner må holde oversikt over.

---

# DEL 3 – OBJEKTORIENTERT PROGRAMMERING FRA NULL

## 3.1 Hvorfor bruker vi objektorientering?

I et program som håndterer bøker, medlemmer, bestillinger eller spillfigurer, har vi mange ting med egne data og handlinger. Objektorientert programmering (OOP) lar oss samle data og funksjonalitet i klasser og objekter.

Tenk på en bok:
- Data/attributter: tittel, forfatter, ISBN, tilgjengelig.
- Handlinger/metoder: lån ut, lever tilbake, vis informasjon.

En klasse er en oppskrift eller mal. Et objekt er en konkret ting laget fra klassen.

Eksempel:
- `Bok` er klassen.
- `bok1` som representerer «Sult» er et objekt.
- `bok2` som representerer «Naiv. Super.» er et annet objekt av samme klasse.

## 3.2 Attributter og metoder

```java
class Bok {
    String tittel;
    String forfatter;
    boolean tilgjengelig;

    void visInfo() {
        System.out.println(tittel + " av " + forfatter);
    }
}
```

Attributtene beskriver objektets tilstand. Metoden beskriver noe objektet kan gjøre.

Opprett objekt:

```java
Bok bok1 = new Bok();
bok1.tittel = "Sult";
bok1.forfatter = "Knut Hamsun";
bok1.tilgjengelig = true;
bok1.visInfo();
```

`new Bok()` lager et nytt objekt. Punktum brukes til å hente/endre egenskaper eller kalle metoder.

## 3.3 Konstruktør

En konstruktør setter opp objektet når det opprettes.

```java
class Bok {
    String tittel;
    String forfatter;
    boolean tilgjengelig;

    Bok(String tittel, String forfatter) {
        this.tittel = tittel;
        this.forfatter = forfatter;
        this.tilgjengelig = true;
    }
}
```

Opprett objekt:

```java
Bok bok1 = new Bok("Sult", "Knut Hamsun");
```

`this.tittel` betyr attributtet som tilhører dette objektet. `tittel` uten `this` viser her til parameteren som ble sendt inn.

## 3.4 Metoder som endrer tilstand

```java
class Bok {
    String tittel;
    boolean tilgjengelig = true;

    Bok(String tittel) {
        this.tittel = tittel;
    }

    void lanUt() {
        if (tilgjengelig) {
            tilgjengelig = false;
            System.out.println("Boken er lånt ut.");
        } else {
            System.out.println("Boken er allerede utlånt.");
        }
    }

    void leverTilbake() {
        tilgjengelig = true;
    }
}
```

Objektet husker sin egen tilstand. Når `lanUt()` kjøres, endres `tilgjengelig` for akkurat dette objektet.

## 3.5 En klasse og et objekt – muntlig forklaring

Et godt grunnleggende svar:

«En klasse er en mal som beskriver hvilke data og metoder objektene skal ha. Et objekt er en konkret instans av klassen. Hvis jeg har en klasse Bok, kan jeg lage flere bokobjekter. Hvert objekt kan ha forskjellig tittel og forfatter, men bruke de samme metodene.»

## 3.6 Innkapsling – beskytt data

Innkapsling betyr at data ikke nødvendigvis skal endres fritt uten kontroll. Vi kan gjøre attributter private og bruke metoder for å lese eller endre dem.

```java
class Konto {
    private double saldo;

    Konto(double startSaldo) {
        saldo = startSaldo;
    }

    public double hentSaldo() {
        return saldo;
    }

    public void settInn(double belop) {
        if (belop > 0) {
            saldo += belop;
        }
    }
}
```

Fordel: vi kan kontrollere at saldo ikke endres med ugyldige verdier fra utsiden.

Du trenger ikke kunne alle detaljer om tilgangsmodifikatorer, men du bør forstå hvorfor det er nyttig å beskytte data.

## 3.7 Arv – «er-en»

Arv brukes når en klasse er en mer spesialisert type av en annen klasse.

Eksempel: `Bil` er et `Kjoretoy`.

```java
class Kjoretoy {
    String merke;

    void start() {
        System.out.println("Kjøretøyet starter");
    }
}

class Bil extends Kjoretoy {
    int antallDorer;
}
```

`Bil extends Kjoretoy` betyr at Bil arver fra Kjoretoy. Bil får tilgang til arvede egenskaper/metoder som er tilgjengelige.

Bruk arv når relasjonen faktisk er «er en». Ikke bruk arv bare for å dele kode.

## 3.8 Komposisjon – «har-en»

Komposisjon beskriver at en klasse består av eller har en annen klasse.

Eksempel: En `Bil` har en `Motor`.

```java
class Motor {
    int effekt;

    Motor(int effekt) {
        this.effekt = effekt;
    }
}

class Bil {
    String merke;
    Motor motor;

    Bil(String merke, Motor motor) {
        this.merke = merke;
        this.motor = motor;
    }
}
```

Bil er ikke en motor; bilen har en motor. Derfor er komposisjon mer naturlig enn arv.

## 3.9 Polymorfisme – samme grensesnitt, ulik oppførsel

Polymorfisme betyr at ulike objekter kan brukes gjennom en felles overordnet type, men oppføre seg forskjellig når en metode kalles.

```java
class Dyr {
    void lagLyd() {
        System.out.println("Ukjent lyd");
    }
}

class Hund extends Dyr {
    @Override
    void lagLyd() {
        System.out.println("Voff");
    }
}

class Katt extends Dyr {
    @Override
    void lagLyd() {
        System.out.println("Mjau");
    }
}
```

Dette er støttebegrep. På to dager er det viktigere at du forstår klasse/objekt, attributt/metode, konstruktør og enkel arv enn at du kan avansert polymorfisme.

## 3.10 Minioppgave – Bok og bibliotek

**Oppgave:** Lag en klasse `Bok` med `tittel`, `forfatter` og `tilgjengelig`. Lag en konstruktør. Lag metodene `lanUt()` og `leverTilbake()`. Opprett to bokobjekter og test metodene.

### Fremgangsmåte

1. Finn substantivene i oppgaven: bok, tittel, forfatter.
2. Bestem attributter: tittel, forfatter, tilgjengelig.
3. Bestem handlinger: låne ut, levere tilbake.
4. Lag konstruktør som fyller inn tittel og forfatter.
5. Test at bok som er tilgjengelig kan lånes ut.
6. Test at samme bok ikke kan lånes ut to ganger uten tilbakelevering.

### Løsningsforslag

```java
class Bok {
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
}
```

### Oppgaver med stigende vanskelighetsgrad

**Grunnleggende:** Forklar hva klassen Bok er, hva objektet `bok1` er, og hva attributtene lagrer.

**Middels:** Legg til `int antallDager` og en metode som beregner en hypotetisk forsinkelsesavgift.

**Utfordrende:** Lag en klasse `Medlem` som kan ha en liste over lånte bøker. Forklar hvorfor et medlem «har» bøker/lån, og hvorfor det ikke er arv.

---

# DEL 4 – UML OG MODELLERING

## 4.1 Hva er modellering?

Modellering er å lage en forenklet beskrivelse av et system før eller mens det utvikles. Modellen viser de delene som er relevante for problemet. Den trenger ikke vise alt i den virkelige verden.

Fordeler:
- gjør krav og struktur tydeligere
- hjelper utviklere å bli enige
- avdekker manglende data eller relasjoner
- gjør det lettere å forklare systemet

## 4.2 Klassediagram

Et UML-klassediagram viser klasser, attributter, metoder og relasjoner.

Eksempel:

```text
+-------------------+
|       Bok         |
+-------------------+
| - tittel: String  |
| - forfatter: String|
| - tilgjengelig: bool|
+-------------------+
| + lanUt(): void   |
| + leverTilbake(): void|
+-------------------+
```

- Øverste del: klassenavn.
- Midtre del: attributter.
- Nederste del: metoder.
- `-` betyr privat, `+` betyr offentlig.
- `String`, `int`, `boolean` er datatyper.
- `void` betyr at metoden ikke returnerer en verdi.

## 4.3 Relasjoner

- **Assosiasjon:** Klasser har en forbindelse til hverandre.
- **Arv:** En underklasse er en type av en annen klasse («er-en»).
- **Komposisjon:** En klasse består av en annen del («har-en», sterk del-helhet-relasjon).
- **Aggregasjon:** En svakere del-helhet-relasjon der delen kan eksistere uavhengig.
- **Multiplisitet:** Hvor mange objekter som kan være knyttet sammen, for eksempel 1, 0..1 eller 0..*.

Eksempel: Ett medlem kan ha mange lån. Hvert lån tilhører ett medlem. Dette kan beskrives som `Medlem 1 —— 0..* Laan`.

## 4.4 Fra tekst til klassediagram – metode

1. Les teksten og marker substantiv – mulige klasser.
2. Finn informasjon som må lagres – mulige attributter.
3. Finn handlinger – mulige metoder.
4. Finn relasjoner – «er-en» eller «har-en».
5. Sjekk om klassene har tydelige ansvarsområder.
6. Test modellen med et konkret scenario: «Hva skjer når en bruker låner en bok?»

### Oppgave 4A – skoleutstyr

Et skolebibliotek låner ut PC-er til elever. En elev kan låne flere PC-er, men hver PC kan bare være utlånt til én elev om gangen. Lag forslag til klasser, attributter, metoder og relasjon.

### Oppgave 4B – alternativ modell

Kan du modellere utlån ved å legge `elevNavn` direkte inn i PC-klassen, uten en egen `Laan`-klasse? Forklar en fordel og en ulempe ved hver løsning.

### Oppgave 4C – muntlig

Hvorfor er det nyttig å tegne klassediagram før man programmerer? Svar med et eksempel på en feil modellen kan avsløre.

---

# DEL 5 – FEILSØKING OG TESTING

## 5.1 Tre viktige feiltyper

### Syntaksfeil

Koden bryter språkets regler. Eksempel: manglende semikolon i Java, feil parentes eller ukjent variabelnavn. Programmet kan vanligvis ikke kompileres/kjøres før feilen er rettet.

### Kjøretidsfeil

Programmet starter, men krasjer under kjøring. Eksempel: du prøver å hente element nummer 5 fra en liste som bare har 3 elementer.

### Logisk feil

Programmet kjører, men resultatet blir feil. Eksempel: du bruker `>` i stedet for `>=`, slik at nøyaktig 18 år ikke får forventet resultat.

## 5.2 Feilsøkingsmetode

1. Gjenskap feilen med samme input.
2. Les feilmeldingen og finn linjen.
3. Undersøk verdiene før feilen.
4. Del problemet i mindre deler.
5. Endre én ting om gangen.
6. Kjør testen igjen.
7. Test også at endringen ikke ødela noe annet.

Bruk utskrift/debugger for å se verdier. Ikke gjett og endre ti linjer samtidig.

## 5.3 Testtyper du bør kunne forklare

- **Enhetstest:** Tester en liten del, for eksempel én metode.
- **Integrasjonstest:** Tester om flere deler fungerer sammen.
- **Systemtest:** Tester hele programmet.
- **Akseptansetest:** Undersøker om løsningen dekker brukerens behov.

## 5.4 Testtilfeller og grenseverdier

For billettprisen med barn under 18, senior fra 67:

| Input alder | Forventet resultat | Hvorfor teste? |
|---:|---|---|
| 10 | Barnpris | Vanlig barn |
| 17 | Barnpris | Rett under grensen |
| 18 | Voksenpris | På grensen |
| 35 | Voksenpris | Vanlig voksen |
| 66 | Voksenpris | Rett under seniorgrensen |
| 67 | Seniorpris | På grensen |
| -2 | Ugyldig input | Ugyldig verdi |

Test normaltilfelle, grenseverdi og ugyldig input.

## 5.5 Feiloppgaver

### Oppgave 5A – syntaks

```java
int alder = 18
System.out.println(alder);
```

Finn feilen: Mangler semikolon etter `18`.

### Oppgave 5B – logikk

```java
if (alder > 18) {
    System.out.println("Voksen");
} else {
    System.out.println("Barn");
}
```

Hva skjer når alder er 18? Hvis grensen er myndig fra 18, skal betingelsen være `alder >= 18`.

### Oppgave 5C – kjøretid

```java
ArrayList<String> navn = new ArrayList<>();
navn.add("Amina");
System.out.println(navn.get(1));
```

Det finnes bare element på indeks 0. `get(1)` gir indeksfeil.

### Oppgave 5D – heltallsdivisjon

```java
int sum = 5;
int antall = 2;
double snitt = sum / antall;
System.out.println(snitt);
```

I Java blir `5 / 2` med heltall først `2`, så resultatet blir `2.0`. Bruk `5.0 / 2` eller konverter til `double` for å få `2.5`.

## 5.6 Alternative løsninger

Etter at du har løst en oppgave, svar:
- Kunne jeg løst dette med en annen løkke?
- Kunne jeg lagt logikken i en metode?
- Er en liste mer egnet enn separate variabler?
- Er det best å bruke en klasse eller bare funksjoner?
- Hva blir enklere eller vanskeligere med alternativet?

Sensor trenger ikke alltid høre at du valgte den eneste riktige løsningen. Sensor vil se at du kan begrunne valget.

---

# DEL 6 – DATASETT OG INFORMASJON

## 6.1 Hva er et datasett?

Et datasett er en samling registrerte verdier. Hver rad kan være én observasjon, og hver kolonne kan være en egenskap.

Eksempel:

| navn | alder | besøk |
|---|---:|---:|
| Amina | 17 | 3 |
| Jonas | 20 | 5 |
| Mina | 16 | 2 |
| Leo | 22 | 4 |

Du kan spørre:
- Hvor mange rader finnes?
- Hva er gjennomsnittsalderen?
- Hvem har mer enn 3 besøk?
- Hvor mange er under 18?
- Hvilke begrensninger har dataene?

## 6.2 CSV

CSV (Comma-Separated Values) er et enkelt tekstformat for tabell-data. Eksempel:

```csv
navn,alder,besok
Amina,17,3
Jonas,20,5
Mina,16,2
Leo,22,4
```

Fordeler: enkelt, lesbart, støttes av mange programmer og regneark. Ulemper: datatyper og relasjoner er ikke tydelig definert, separatorer i tekstfelt kan skape utfordringer, og store/komplekse datastrukturer blir tungvinte.

## 6.3 JSON

JSON er et tekstformat for strukturerte data med nøkkel/verdi-par og lister.

```json
{
  "navn": "Amina",
  "alder": 17,
  "aktiv": true,
  "interesser": ["musikk", "IT"]
}
```

CSV egner seg ofte til en enkel tabell. JSON egner seg ofte til nøstede objekter og data som skal utveksles mellom apper og API-er.

## 6.4 Enkel analyse

Antall besøk i tabellen: 3, 5, 2, 4.

Sum = 3 + 5 + 2 + 4 = 14.  
Antall registreringer = 4.  
Gjennomsnitt = 14 / 4 = 3,5 besøk.

Gjennomsnitt alene kan skjule variasjon. Verdiene er 2–5, og datasettet er svært lite. Du vet heller ikke om alle besøk er registrert korrekt.

## 6.5 Programmeringsoppgave – tell aktive brukere

Du får en liste med antall besøk:

```java
int[] besok = {3, 5, 2, 4, 8, 1};
```

Skriv en løkke som teller hvor mange som har minst 4 besøk.

**Løsningsforslag:**

```java
int antall = 0;
for (int i = 0; i < besok.length; i++) {
    if (besok[i] >= 4) {
        antall++;
    }
}
System.out.println(antall); // 3
```

### Videre oppgaver

1. Beregn summen av alle besøk.
2. Beregn gjennomsnittet.
3. Finn høyeste verdi.
4. Endre programmet slik at det bare teller brukere under 18 år – hva mangler i datastrukturen for å gjøre dette?
5. Hvordan ville du presentert resultatet for en leder: tabell, stolpediagram eller tekst? Begrunn.

---

# DEL 7 – DE VIKTIGSTE BEGREPENE DU MÅ KUNNE FORKLARE

## Programmering

- **Variabel:** Navngitt plass for en verdi.
- **Datatype:** Bestemmer hva slags verdi en variabel kan lagre.
- **Betingelse:** Et uttrykk som er sant eller usant og styrer et valg.
- **Løkke:** Gjentar kode.
- **Funksjon/metode:** Navngitt kodeblokk som utfører en oppgave.
- **Parameter:** Variabel som mottar verdi når funksjon/metode kalles.
- **Returverdi:** Resultatet en funksjon/metode sender tilbake.
- **Liste/array:** Samling av flere verdier.
- **Algoritme:** Trinnvis metode for å løse et problem.
- **Pseudokode:** Uformell beskrivelse av algoritme som ligner programkode.

## Objektorientering

- **Klasse:** Mal for objekter.
- **Objekt:** Konkret instans av en klasse.
- **Attributt:** Data/egenskap i en klasse eller et objekt.
- **Metode:** Handling/funksjon knyttet til en klasse eller et objekt.
- **Konstruktør:** Kode som kjøres når objekt opprettes.
- **Arv:** Underklasse bygger på en overklasse («er-en»).
- **Komposisjon:** En klasse inneholder/bruker objekter av en annen klasse («har-en»).
- **Innkapsling:** Beskytte og kontrollere tilgang til data.
- **Polymorfisme:** Ulike objekttyper kan brukes gjennom en felles type og oppføre seg forskjellig.

## Testing og systemutvikling

- **Syntaksfeil:** Koden bryter språkreglene.
- **Kjøretidsfeil:** Feil oppstår mens programmet kjører.
- **Logisk feil:** Programmet kjører, men gir feil resultat.
- **Testtilfelle:** Konkret input med forventet resultat.
- **Enhetstest:** Test av én liten enhet/metode.
- **Brukertest:** Reelle brukere prøver løsningen.
- **Prototyp:** Tidlig og enkel versjon for å teste idé/design.
- **Versjonskontroll:** Holder oversikt over endringer i kode, for eksempel Git.
- **Smidig utvikling:** Arbeide i korte iterasjoner og justere etter tilbakemelding.

## Data og sikkerhet

- **CSV:** Enkelt tabellbasert tekstformat.
- **JSON:** Strukturert dataformat med objekter og lister.
- **Database:** Organisert lagring av data.
- **Primærnøkkel:** Felt som identifiserer en rad unikt.
- **Fremmednøkkel:** Felt som peker til en rad i en annen tabell.
- **Autentisering:** Kontroll av hvem du er.
- **Autorisasjon:** Kontroll av hva du har lov til.
- **Kryptering:** Gjør data uleselige uten nøkkel.
- **Hashing:** Lager en kontrollsum/verdi fra data; brukes blant annet i passordlagring.
- **Backup:** Sikkerhetskopi for å kunne gjenopprette data.
- **Personopplysning:** Opplysning som kan knyttes til en identifisert eller identifiserbar person.

---

# DEL 8 – MUNTLIG SENSORTRening

## 8.1 Universell svarstruktur

Når sensor spør «forklar», bruk denne strukturen:

1. **Definer:** Hva betyr begrepet?
2. **Vis:** Gi et lite konkret eksempel.
3. **Knytt til oppgaven:** Hvorfor er det relevant her?
4. **Vurder:** Hva er styrke, begrensning eller risiko?
5. **Test/forbedre:** Hvordan ville du kontrollert eller forbedret løsningen?

Du trenger ikke lange læreboksvar. Et kort, presist svar med et relevant eksempel er bedre enn mye generell prat.

## 8.2 Eksempler på gode grunnleggende svar

### «Hva er forskjellen på klasse og objekt?»

«En klasse er en mal som sier hvilke attributter og metoder en type ting har. Et objekt er en konkret instans av klassen. Hvis jeg har klassen Bok, kan jeg lage flere bokobjekter med forskjellig tittel og forfatter.»

### «Hvorfor bruker du en metode?»

«Jeg bruker en metode for å samle kode som utfører én bestemt oppgave. Da kan jeg kalle den flere steder i programmet i stedet for å kopiere den samme koden. Det gjør programmet ryddigere og enklere å teste.»

### «Hvordan tester du programmet?»

«Jeg prøver først et vanlig input. Så tester jeg grenseverdier, for eksempel akkurat 18 år dersom rabatten endres ved 18. Jeg prøver også ugyldig input. Jeg sammenligner faktisk resultat med forventet resultat.»

### «Hva er en alternativ løsning?»

«Jeg kunne også laget beregningen i en egen metode. Fordelen er at den kan gjenbrukes og testes separat. Ulempen er at det blir litt flere deler å holde styr på. For dette lille programmet er begge løsningene mulige.»

### «Hva er forskjellen på CSV og JSON?»

«CSV passer godt til en enkel tabell med rader og kolonner. JSON kan representere objekter og lister som kan ligge inni hverandre. CSV er enkelt å åpne i regneark, mens JSON er vanlig når apper utveksler strukturert data.»

### «Hva er et etisk dilemma ved kameraovervåking?»

«Det kan øke tryggheten og gjøre det lettere å undersøke hendelser, men det kan også gripe inn i privatlivet og samle inn informasjon om personer som ikke har gjort noe galt. Jeg ville vurdert nødvendighet, formål, tilgang, lagringstid og om mindre inngripende tiltak kan fungere.»

## 8.3 Sensorbank – programmering

1. Hva er en variabel?
2. Hva er forskjellen på `=` og `==`?
3. Hva gjør en if-setning?
4. Hva er forskjellen på en `for`- og en `while`-løkke?
5. Hva skjer hvis løkkens tellevariabel aldri endres?
6. Hva er en liste?
7. Hvorfor starter en liste ofte på indeks 0?
8. Hva er en metode?
9. Hva er parameter og returverdi?
10. Hva betyr det at en metode er gjenbrukbar?
11. Hvordan deler du en større oppgave i mindre deler?
12. Hvordan finner du ut hva en kodebit skriver ut?

## 8.4 Sensorbank – OOP og modellering

1. Hva er en klasse?
2. Hva er et objekt?
3. Hva er et attributt?
4. Hva er en metode?
5. Hva gjør en konstruktør?
6. Hvorfor bruker vi `this` i Java?
7. Hva er arv?
8. Hva betyr «er-en»?
9. Hva betyr «har-en»?
10. Hva er komposisjon?
11. Hvordan finner du klasser fra en oppgavetekst?
12. Hva viser et klassediagram?
13. Hvorfor er det nyttig å modellere før koding?
14. Når kan en modell bli for komplisert?

## 8.5 Sensorbank – testing, data, samfunn

1. Hva er forskjellen på syntaksfeil, kjøretidsfeil og logisk feil?
2. Hva er en grenseverdi?
3. Hvorfor er det ikke nok å teste bare ett tilfelle?
4. Hva er CSV?
5. Hva er JSON?
6. Hvordan beregner du gjennomsnitt?
7. Hva kan være galt med et datasett?
8. Hva er personopplysninger?
9. Hva er forskjellen på autentisering og autorisasjon?
10. Hva er forskjellen på kryptering og hashing?
11. Hva er brukervennlighet?
12. Hvordan kan du gjøre en app mer tilgjengelig?
13. Hva er en prototype?
14. Hva betyr smidig utvikling?
15. Hvem påvirkes av et digitalt system?

---

# DEL 9 – PRAKTISKE OPPGAVER MED VARIERENDE VANSKELIGHET

**Instruks:** Forsøk å løse oppgaven før du leser løsningsforslaget. Skriv koden i eget utviklingsmiljø hvis mulig. Hvis du ikke får kjørt kode, skriv pseudokode og forklar hvordan du ville testet programmet.

## Oppgave 9.1 – Enkel poengsum

Skriv et program som lagrer poengsummen 12 i en variabel og skriver ut `Du fikk 12 poeng`.

**Hint:** `int`, `String`, `System.out.println`.

**Løsningsforslag:**

```java
int poeng = 12;
System.out.println("Du fikk " + poeng + " poeng");
```

## Oppgave 9.2 – Rabatt

Et produkt koster 500 kr. Hvis kunden har rabattkode, får kunden 10 % rabatt. Skriv kode som beregner riktig pris.

**Løsningsforslag:**

```java
double pris = 500;
boolean rabattkode = true;

if (rabattkode) {
    pris = pris * 0.90;
}
System.out.println(pris);
```

## Oppgave 9.3 – Sum med løkke

Skriv kode som legger sammen tallene fra 1 til 10.

**Løsningsforslag:**

```java
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println(sum); // 55
```

## Oppgave 9.4 – Tell verdier i liste

Du har `int[] temperaturer = {17, 22, 19, 25, 14, 21};`. Tell hvor mange temperaturer som er minst 20.

**Løsningsforslag:**

```java
int antall = 0;
for (int i = 0; i < temperaturer.length; i++) {
    if (temperaturer[i] >= 20) {
        antall++;
    }
}
System.out.println(antall); // 3
```

## Oppgave 9.5 – Metode

Lag en metode som returnerer den største av to heltall.

**Løsningsforslag:**

```java
public static int storst(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

## Oppgave 9.6 – Klasse og objekt

Lag en klasse `Produkt` med navn og pris. Lag en konstruktør og en metode som skriver ut produktinformasjon.

**Løsningsforslag:**

```java
class Produkt {
    String navn;
    double pris;

    Produkt(String navn, double pris) {
        this.navn = navn;
        this.pris = pris;
    }

    void visInfo() {
        System.out.println(navn + " koster " + pris + " kr");
    }
}
```

## Oppgave 9.7 – Objektliste

Lag tre Produkt-objekter, legg dem i en liste og skriv ut informasjon om alle med en løkke.

**Tips:** `ArrayList<Produkt>`.

## Oppgave 9.8 – Finn og rett flere feil

```java
int alder = 18
if (alder = 18) {
    System.out.println("Du er 18");
}
```

Finn minst to problemer: manglende semikolon etter `18`, og `=` brukes for tilordning, ikke sammenligning. Bruk `==`.

## Oppgave 9.9 – Testplan

Lag testplan for en metode som gir rabatt til personer under 18 og fra 67 år.

Du må teste minst: 17, 18, 66, 67 og en ugyldig alder som -1.

## Oppgave 9.10 – Gjenbruk

Du har kopiert den samme rabattberegningen tre steder. Hvordan kan du gjøre koden mer gjenbrukbar?

Forventet idé: legg beregningen i en metode med parametere og returverdi.

## Oppgave 9.11 – UML

Lag klassediagram for `Medlem`, `Bok` og `Laan`. Forklar hvilke attributter som hører hjemme hvor, og hvorfor et eget Laan-objekt kan være nyttig.

## Oppgave 9.12 – Datasett

Du har antall besøk `{2, 4, 4, 6, 1, 7}`. Beregn sum, gjennomsnitt, minimum og maksimum. Skriv deretter en kort tolkning.

**Fasit:** sum 24, gjennomsnitt 4, minimum 1, maksimum 7.

---

# DEL 10 – TO INTEGRERTE PRAKTISKE CASES

## CASE A – Enkelt utlånssystem for skoleutstyr

### Situasjon

Et skolebibliotek låner ut bærbare PC-er til elever. Ansatte trenger oversikt over hvilke PC-er som er tilgjengelige og hvilke som er utlånt.

### Oppgave

Lag en enkel modell og demonstrer en løsning som kan registrere PC-er og markere dem som utlånt eller tilgjengelig.

### Dette bør du gjøre

1. Beskriv problemet og brukerne.
2. Foreslå klassene `PC` og eventuelt `Ulaan` eller `Elev`.
3. Identifiser attributter: PC-nummer, modell, tilgjengelig; elev-ID; lånedato.
4. Lag en enkel klasse og objekt.
5. Lag metode `lanUt()` og `leverTilbake()`.
6. Test at en utlånt PC ikke kan lånes ut på nytt.
7. Foreslå én alternativ modell.
8. Drøft personvern: trenger systemet å lagre elevens fulle navn, adresse eller bare en intern ID?

### Mulig enkel kode

```java
class PC {
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
}
```

### Sensor kan spørre

- Hvorfor har PC-klassen en boolean?
- Hva skjer hvis to ansatte prøver å låne ut samme PC samtidig?
- Hvordan ville du testet metoden?
- Kunne du lagret utlånene i en liste?
- Når ville en database vært bedre enn en liste i minnet?
- Hvordan beskytter du elevopplysninger?

## CASE B – Besøksanalyse for et ungdomshus

### Situasjon

Et ungdomshus registrerer anonymt antall besøk per dag og vil se hvilke dager som har høyest aktivitet.

### Datasett

| Dag | Besøk |
|---|---:|
| Mandag | 18 |
| Tirsdag | 12 |
| Onsdag | 23 |
| Torsdag | 19 |
| Fredag | 31 |

### Oppgave

1. Lag en enkel datastruktur med tallene.
2. Beregn totalt antall besøk.
3. Beregn gjennomsnitt per dag.
4. Finn dagen med flest besøk.
5. Presenter resultatet i tekst eller diagram.
6. Forklar datakvalitet: manglende registreringer, dobbelttelling, eller at besøk ikke sier hvor mange unike personer som kom.
7. Drøft personvern dersom huset vurderer å registrere navn i stedet for anonyme tall.

### Mulig kode

```java
int[] besok = {18, 12, 23, 19, 31};
int sum = 0;
int maks = besok[0];

for (int tall : besok) {
    sum += tall;
    if (tall > maks) {
        maks = tall;
    }
}

double gjennomsnitt = (double) sum / besok.length;
System.out.println("Totalt: " + sum);
System.out.println("Gjennomsnitt: " + gjennomsnitt);
System.out.println("Flest besøk: " + maks);
```

Fasit: sum 103, gjennomsnitt 20,6, maksimum 31.

### Sensor kan spørre

- Hvorfor er det en array/list?
- Hvorfor trenger vi en løkke?
- Hva betyr gjennomsnittet?
- Kan du konkludere med at fredag er den mest populære dagen? Hva betyr «populær»?
- Hvilke data ville du samlet inn for en bedre analyse?
- Hvordan ville du visualisert resultatet?
- Hvilke personvernprinsipper er relevante?

---

# DEL 11 – ALTERNATIVE LØSNINGER OG DESIGNVALG

Når sensor ber om «andre løsningsforslag», bruk denne oppskriften:

1. Si hva din opprinnelige løsning er.
2. Beskriv ett alternativ.
3. Sammenlign minst én fordel og én ulempe.
4. Si hvilken du ville valgt i denne situasjonen og hvorfor.

Eksempler:

### Eksempel 1: `if/else` eller `switch`

For to eller tre enkle valg er `if/else` lett å lese. Ved mange valg basert på samme variabel kan `switch` være ryddigere. `if/else` er mer fleksibel med intervaller, for eksempel alder under 18.

### Eksempel 2: Array eller ArrayList

Array har fast størrelse og er enkel når antallet elementer er kjent. ArrayList kan vokse og krympe, og har metoder som `add` og `remove`, men er litt mer omfattende.

### Eksempel 3: Én lang `main` eller metoder

Én lang `main` kan være lett å starte med i et veldig lite program. Metoder deler opp ansvar, gjør kode lettere å teste og gjenbruke, men krever at man forstår parametere og returverdier.

### Eksempel 4: Arv eller komposisjon

Arv passer ved «er-en», for eksempel Bil er et Kjøretøy. Komposisjon passer ved «har-en», for eksempel Bil har en Motor. Feil arv kan gjøre programmet unødvendig låst.

### Eksempel 5: CSV eller JSON

CSV passer for tabellformede data og regneark. JSON passer for mer hierarkiske data og kommunikasjon mellom apper. Valget avhenger av datastrukturen og hvordan informasjonen skal brukes.

---

# DEL 12 – ETIKK, PERSONVERN, SIKKERHET OG BRUKERVENNLIGHET

## 12.1 Oppskrift for etisk drøfting

Bruk **P–F–R–T–K**:

- **P – Problem:** Hva er dilemmaet?
- **F – Fordeler:** Hvem får nytte av løsningen?
- **R – Risiko:** Hvem kan bli skadet eller få mindre kontroll?
- **T – Tiltak:** Hvordan kan risiko reduseres?
- **K – Konklusjon:** Hva mener du, og hvorfor?

### Eksempel: Kameraovervåking i ungdomshus

Fordeler:
- kan forebygge tyveri og skadeverk
- kan bidra til trygghet
- kan hjelpe med å undersøke hendelser

Ulemper/risiko:
- besøkende kan oppleve mindre privatliv
- opptak kan misbrukes eller komme på avveie
- overvåking kan skape mistillit
- barn og unge kan bli særlig sårbare

Tiltak:
- vurder om kamera er nødvendig
- bruk minst mulig omfattende overvåking
- ikke plasser kamera i private rom
- begrens hvem som kan se opptak
- slett opptak etter en begrunnet kort tid
- informer tydelig
- vurder alternativer, som bedre låser eller bemanning

En god konklusjon er nyansert: overvåking kan i noen situasjoner være nødvendig, men formålet må være konkret og inngrepet må begrenses.

## 12.2 GDPR/personvern – helt grunnleggende

Personopplysninger er informasjon som kan knyttes til en identifisert eller identifiserbar person. Eksempler kan være navn, adresse, telefonnummer, e-post, bilde, posisjonsdata eller identifikatorer.

Viktige prinsipper:
- **Formålsbegrensning:** Bruk data til tydelige formål.
- **Dataminimering:** Samle bare det som trengs.
- **Riktighet:** Data bør være korrekte og oppdaterte.
- **Lagringsbegrensning:** Ikke lagre data lenger enn nødvendig.
- **Konfidensialitet/integritet:** Beskytt data mot uvedkommende og uønskede endringer.
- **Åpenhet:** Forklar hva som samles inn og hvorfor.

Husk: ikke alle data er personopplysninger, men data som kan kobles til en person kan være det.

## 12.3 Informasjonssikkerhet

Tre grunnprinsipper:
- **Konfidensialitet:** Bare autoriserte personer får tilgang.
- **Integritet:** Data er riktige og ikke endret uautorisert.
- **Tilgjengelighet:** System og data er tilgjengelige når de trengs.

Eksempler på tiltak:
- sterke, unike passord og flerfaktorautentisering
- tilgangsstyring etter arbeidsoppgaver
- kryptering ved lagring og overføring
- sikkerhetskopier og gjenopprettingstester
- oppdatering av programvare
- logging og overvåking av mistenkelig aktivitet

Autentisering betyr å kontrollere hvem du er. Autorisasjon betyr å kontrollere hva du har lov til å gjøre.

## 12.4 Brukervennlighet

Et brukervennlig system er forståelig, effektivt og tilpasset brukernes behov. Vurder:
- tydelig navigasjon og språk
- konsekvent design
- lesbar tekst og god kontrast
- tilbakemelding når brukeren gjør noe
- forståelige feilmeldinger
- tilgjengelighet for personer med ulike forutsetninger
- få unødvendige steg

Eksempel på forbedring: Hvis et skjema bare sier «Feil», bør det heller si hvilket felt som mangler og hvordan brukeren kan rette det.

## 12.5 Systemutvikling

En enkel utviklingsprosess:
1. Kartlegg behov og krav.
2. Planlegg løsning.
3. Design/modeller.
4. Programmer.
5. Test.
6. Evaluer med brukere.
7. Forbedre og vedlikehold.

Smidig utvikling deler arbeidet i små iterasjoner, med hyppig tilbakemelding. Fossefallsmodellen følger ofte tydeligere faser i rekkefølge. Git er et versjonskontrollsystem som holder styr på kodeendringer og gjør samarbeid enklere.

---

# DEL 13 – REALISTISK MUNTLIG-PRAKTISK EKSAMEN

## 13.1 Hvis eksamen er i Oslo

Oslo Privatistkontors retningslinjer for privatister, revidert V26, sier blant annet:
- Kandidaten trekker ett av flere oppgavesett.
- Forberedelsen skjer på eksamensstedet og varer minimum 30 minutter.
- Alle hjelpemidler er tillatt i forberedelsen, også egen PC, men kandidaten må selv sørge for maskin/programvare/strøm; internett kan ikke forutsettes.
- Notater må skrives på papir som er tilgjengelig i forberedelsesrommet. Notater skrevet hjemme kan ikke tas med inn under eksaminasjonen.
- Praktisk innslag skal fremgå av oppgaven. Det kan være demonstrasjon/forsøk eller at du forklarer/tegner på papir.
- Sensor kan stille utdypende spørsmål og gir en ukjent tilleggsoppgave som tester andre kompetansemål.
- Muntlig-praktisk eksamen varer inntil 45 minutter. Det skal ikke være PowerPoint.

Følg alltid din egen Privatistportal/oppgaveinformasjon dersom noe avviker. Dette dokumentet kan ikke se din private eksamensinnkalling.

## 13.2 Bruk de 30 minuttene slik

- **0–5 min:** Les oppgaven, marker hva du skal utvikle, vise eller drøfte.
- **5–10 min:** Skriv problem, input, behandling, output.
- **10–18 min:** Lag pseudokode/klasseskisse eller enkel modell.
- **18–24 min:** Planlegg den praktiske demonstrasjonen eller forklaringen.
- **24–27 min:** Skriv 2–3 testtilfeller.
- **27–30 min:** Skriv mulige alternativer, begrensninger og fagbegreper.

Ikke bruk hele forberedelsen på å kode uten plan. Du må også kunne forklare det du har laget.

## 13.3 Åtte korte eksamenscaser

Disse er egenlagde treningsoppgaver, ikke ekte tidligere Oslo-eksamener.

### Case 1 – Bibliotekutlån

Modeller og demonstrer et program som holder oversikt over bøker og utlån. Inkluder minst én klasse, et objekt, en metode og en test. Drøft hvilke personopplysninger som bør lagres.

### Case 2 – Arrangementspåmelding

Lag en enkel løsning som registrerer navn og antall plasser, og hindrer at kapasiteten overskrides. Forklar alternative måter å lagre påmeldinger på. Drøft personvern.

### Case 3 – Ungdomshusstatistikk

Bruk et datasett til å telle besøk, finne gjennomsnitt og presentere et resultat. Forklar datakvalitet og hva analysen ikke kan fortelle.

### Case 4 – Skole-PC-utlån

Lag modell med PC, elev og utlån. Demonstrer hvordan status endres. Test at samme PC ikke lånes ut dobbelt. Sammenlign arv og komposisjon der det er relevant.

### Case 5 – Enkel spørreundersøkelse

Lag struktur for å lagre svaralternativer og telle svar. Forklar hvordan du unngår dobbeltregistrering og hvordan resultater kan visualiseres.

### Case 6 – Kameraovervåking

Foreslå et system for overvåking av inngangsparti. Diskuter funksjon, lagring, sikkerhet, personvern og alternativer. Sensor kan be deg skissere dataflyt eller tilgangsmodell.

### Case 7 – Enkel handleliste

Lag program som kan legge til varer, vise listen og telle antall. Bruk liste og minst én metode. Foreslå hvordan du kan lagre listen i fil.

### Case 8 – Enkel quiz

Lag program som stiller tre spørsmål, kontrollerer svar og teller poeng. Bruk variabler, betingelser, løkke eller metoder. Forklar hvordan du ville gjort koden mer gjenbrukbar.

## 13.4 Tilleggsoppgave – bredden kan komme uansett

Etter hovedcasen skal appen tilfeldig stille ett spørsmål fra et annet område, for eksempel:
- Forklar forskjellen på CSV og JSON.
- Forklar konfidensialitet, integritet og tilgjengelighet.
- Hva er en primærnøkkel?
- Hva er en brukertest?
- Nevn et etisk dilemma ved KI.
- Hva er forskjellen på autentisering og autorisasjon?
- Hva er en syntaksfeil kontra en logisk feil?
- Forklar hvordan Git kan støtte samarbeid.

---

# PRAKTISK REDNINGSPLAN HVIS DU IKKE HAR EN HEL DAG

Den detaljerte planen under er en intensiv fullversjon. Dersom du bare får til omtrent fire timer hver dag, bruk denne minimumsrekkefølgen – ikke forsøk å lese alt.

**Lørdag – fire timer:**
1. 30 min: få et lite program til å kjøre; variabler og utskrift.
2. 45 min: input, `if/else` og én billett-/rabattoppgave.
3. 45 min: `for`-løkke, liste og telling/sum.
4. 45 min: skriv én metode med parameter og returverdi.
5. 60 min: klasse, objekt, attributt, konstruktør og én metode.
6. 15 min: forklar egen kode høyt.

**Søndag – fire timer:**
1. 30 min: skriv fra hukommelsen variabel, if, løkke, metode og klasse.
2. 60 min: bygg en miniutgave av utlånssystemet med én klasse og test den.
3. 45 min: finn og rett syntaks-, logikk- og grenseverdifeil.
4. 30 min: datasett, telling/gjennomsnitt og CSV/JSON.
5. 30 min: etikk/personvern/sikkerhet og brukervennlighet.
6. 45 min: én muntlig simulering med praktisk del og ukjent tilleggsoppgave.

Hvis du har mer tid, legg til den komplette planen nedenfor. Hvis du har mindre tid, prioriter å kunne skrive og forklare en liten fungerende løsning, forstå OOP-grunnbegrepene og vise testing/feilsøking.

---

# DEL 14 – TO-DAGERS DETALJPLAN

## LØRDAG 28. NOVEMBER – FRA NULL TIL ET LITE PROGRAM

### Økt 1 – 09:00–09:30: Oppstart og diagnostikk

**Gjør:**
- Åpne utviklingsmiljøet.
- Opprett eller åpne et enkelt program.
- Kjør `Hei verden`.
- Endre teksten og kjør igjen.
- Skriv ned om du faktisk fikk programmet til å kjøre.

**Kontrollspørsmål:** Hva er en klasse? Hva er `main`? Hva gjør `println`? Ikke forvent at du kan alt ennå.

### Økt 2 – 09:30–10:30: Variabler, input, output og regning

Les del 2.1–2.3. Gjør oppgave 2.1A, 2.2A, 2.2B og 2.3A.

**Må kunne:** Opprette variabel, velge datatype, lese enkel input, regne og skrive resultat.

### Pause 10:30–10:45

### Økt 3 – 10:45–11:45: Betingelser og løkker

Les del 2.4–2.5. Gjør 2.4A, 2.4B, 2.4C, 2.5A og 2.5B.

**Må kunne:** Forklare hva som skjer når betingelsen er sann/usann, og hvorfor løkken stopper.

### Økt 4 – 11:45–12:15: Spor kode

Bruk kode fra øktene. Skriv verdien til variablene etter hver linje. Forutsi nøyaktig utskrift før du kjører.

### Lunsj 12:15–13:00

### Økt 5 – 13:00–14:00: Lister og data

Les 2.6 og del 6. Gjør oppgave 2.6A–C og 6.5. Skriv en løkke som teller verdier som oppfyller et krav.

**Må kunne:** Forklare at liste/array har flere elementer, hente element, bruke løkke og samle resultat.

### Pause 14:00–14:15

### Økt 6 – 14:15–15:15: Metoder

Les 2.7. Gjør oppgavene 2.7A–C.

**Må kunne:** Forklare parameter, returverdi og hvorfor metoder gir gjenbruk.

### Pause 15:15–15:30

### Økt 7 – 15:30–16:45: OOP

Les del 3.1–3.6 og 3.10. Skriv Bok-klassen fra blankt ark. Opprett to objekter. Kjør metodene.

**Må kunne:** Forklare klasse, objekt, attributt, metode og konstruktør. Vis hva som skjer når metoden endrer objektets tilstand.

### Økt 8 – 16:45–17:15: Feilsøking

Gjør oppgave 5A–D. Ikke bare les feilene – skriv hva som er feil og hvordan du retter dem.

### Økt 9 – 17:15–17:45: Muntlig miniprøve

Ta fem spørsmål fra sensorbanken. Svar høyt uten å lese. Noter spørsmål du ikke kan svare på.

**Lørdagsgrense:** Hvis du ikke kan skrive en enkel betingelse, løkke, metode og klasse med støtte, må du bruke søndag morgen på disse før du går videre.

## SØNDAG 29. NOVEMBER – BRUK KUNNSKAPEN OG ØV TIL EKSAMEN

### Økt 1 – 09:00–09:30: Gjenkalling uten hjelp

På blankt ark eller i kodeeditor, skriv fra hukommelsen:
- én variabel
- én if/else
- én for-løkke
- én metode med returverdi
- en enkel klasse med konstruktør

Sjekk etterpå. Ikke se på fasiten mens du skriver.

### Økt 2 – 09:30–10:45: To klasser og objekter

Løs CASE A (utlånssystem). Lag først modellen, deretter kode. Hvis du ikke rekker alt, lag en fungerende klasse PC og forklar hvordan Elev/Lån kunne kobles på.

**Må kunne:** Forklare hvorfor du har valgt klassene, hvilke data de eier, og hvordan en utlånsmetode virker.

### Pause 10:45–11:00

### Økt 3 – 11:00–12:00: Testing, feil og alternativer

Gå gjennom del 5 og 11. Rett feil i dine egne programmer. Lag testtilfeller. For hver løsning: gi ett alternativ med fordel og ulempe.

### Lunsj 12:00–12:45

### Økt 4 – 12:45–13:30: Datasett og dataformater

Løs CASE B. Forklar CSV, JSON, gjennomsnitt, maksverdi og datakvalitet. Øv på å presentere et resultat og si hva dataene ikke kan bevise.

### Økt 5 – 13:30–14:00: Teoribredde på 30 minutter

Svar kort og muntlig på disse temaene:
1. Etikk/personvern.
2. Informasjonssikkerhet.
3. Brukervennlighet.
4. Systemutvikling/Git.
5. CSV/JSON/lagring.

### Pause 14:00–14:15

### Økt 6 – 14:15–15:00: Eksamenssimulering 1

Trekk én case tilfeldig. Sett timer på 30 min til forberedelse. Skriv notater som om du var i forberedelsesrommet. Deretter gjennomfører du minst 15 min muntlig dialog med deg selv, en medhjelper eller appens sensorfunksjon. Hvis du har tiden, utvid til 45 min.

### Pause 15:00–15:15

### Økt 7 – 15:15–16:00: Målrettet reparasjon

Finn de tre tingene du gjorde svakest i simulering 1. Les bare den relevante forklaringen. Gjør én ny praktisk oppgave for hver svakhet.

### Økt 8 – 16:00–16:45: Eksamenssimulering 2

Trekk en ny case med annet hovedtema. Målet er å vise at du ikke bare kan én oppskrift.

### Økt 9 – 16:45–17:15: Siste kontroll

Uten hjelp, forklar:
- hva et program gjør
- variabler, if/else, løkke og metode
- klasse, objekt, attributt og konstruktør
- én teststrategi og én feiltype
- én alternativ løsning
- én dataanalyse
- ett personverndilemma og ett sikkerhetstiltak

Avslutt deretter. Ikke sitt oppe og prøv å lære et stort nytt emne.

---

# DEL 15 – MINIMAL HUSKELISTE FOR EKSAMEN

## Når du får en praktisk oppgave

1. Hva skal løsningen gjøre?
2. Hvem skal bruke den?
3. Hvilke data får den inn?
4. Hva skal behandles?
5. Hva skal komme ut?
6. Hvilke klasser, metoder eller datastrukturer passer?
7. Hvordan kan jeg teste løsningen?
8. Hvilke personvern-/sikkerhetshensyn finnes?
9. Hvilket alternativ kunne jeg valgt?

## Når du forklarer kode

- Start med programmets formål.
- Forklar input og output.
- Gå gjennom variablene.
- Forklar betingelser og løkker.
- Forklar metoder og hvordan de kalles.
- Hvis OOP: forklar klasse, objekt, attributter, metoder og relasjoner.
- Forklar hvordan du testet.
- Si hva du ville forbedret.

## Når du får spørsmål du ikke kan

Ikke bløff. Si hva du vet og resonnér:

«Jeg er ikke helt sikker på den eksakte syntaksen, men logikken jeg vil bruke er … Først … Deretter … Til slutt … Jeg ville testet det ved å …»

Det er bedre å vise forståelse og en ryddig fremgangsmåte enn å late som du kan noe du ikke kan.

---

# DEL 16 – KILDER OG AVGRENSNINGER

Kildene er kontrollert 26. november 2026. Bruk alltid Privatistportalens eksamensinformasjon dersom den avviker fra eksemplene nedenfor.

1. **Udir – kompetansemål etter Informasjonsteknologi 2 (INF01-03):** https://www.udir.no/lk20/inf01-03/kompetansemaal-og-vurdering/kv978?lang=nob&context=ingen
   - De 11 kompetansemålene om IT-konsekvenser, etiske dilemmaer, alternative design, objektorientert modellering og programmering, testing, gjenbruk, brukervennlighet, systemutvikling, dataformater/sikring og analyse av datasett.
2. **Udir – REA3050:** https://www.udir.no/lk20/fagkoder/rea3050
   - REA3050 er muntlig-praktisk, lokalt utarbeidet og lokalt sensurert. For privatister er den obligatorisk.
3. **Udir – regler for muntlig og muntlig-praktisk eksamen:** https://www.udir.no/eksamen-og-prover/eksamen/muntlig-eksamen/
   - Eksamen skal gi anledning til å vise kompetanse i så stor del av faget som mulig. Muntlig-praktisk eksamen har inntil 45 minutter. Kompetansen som vises på eksamensdagen vurderes.
4. **Oslo Privatistkontor – retningslinjer for muntlig og muntlig-praktisk eksamen for privatister i Oslo (revidert V26):** https://www.oslo.kommune.no/get-file/1331100/be6d01abbe6d99d40574c0831a962ac2bb57e52416b0b26cb1e6ca418c87132f
   - Minimum 30 minutter forberedelse, hjelpemidler i forberedelsesrommet, papirnotater skrevet der, praktisk innslag, ukjent tilleggsoppgave og inntil 45 minutter eksaminasjon. Gjelder Oslo-privatister.
5. **Trøndelag fylkeskommune – vurderingskriterier for REA3050:** https://www.trondelagfylke.no/contentassets/4d84c03ede51441d9bb23301c0c8500e/vurderingskriterier---it-2---rea3050.pdf
   - Offentlig eksempel på beskrivelser av lav kompetanse (karakter 2), middels kompetanse (3–4) og høy kompetanse (5–6). Ikke bindende for Oslo.
6. **Østfold fylkeskommune – muntlig-praktisk eksamen i Informasjonsteknologi:** https://ofk.no/tjenester/skole-og-opplaring/eksamen-og-vitnemal/eksamen-for-elever/gjennomforing-av-eksamen/rammedokument-for-eleveksamen-i-lk20/muntlig-praktisk-eksamen/muntlig-praktisk-eksamen-i-informasjonsteknologi-eleveksamen.188346.aspx
   - Eksempel på annen lokal modell (48 timer forberedelse og bred, sammensatt oppgave). Ikke bruk som Oslo-regel.
7. **Buskerud fylkeskommune – muntlig-praktisk eksamen i Informasjonsteknologi, privatister:** https://bfk.no/tjenester/skole-og-opplaring/eksamen-og-vitnemal/privatisteksamen/forbered-deg-til-eksamen/rammedokument-for-privatisteksamen-i-lk20/muntlig-praktisk-eksamen/muntlig-praktisk-eksamen-i-informasjonsteknologi-privatisteksamen.186930.aspx
   - Eksempel på lokal organisering i et annet fylke. Ikke bruk som Oslo-regel.

### Tidligere muntlige eksamensoppgaver

Jeg har ikke funnet et offentlig arkiv med faktiske tidligere REA3050-muntlig-praktiske oppgaver fra Oslo. Oslo sine publiserte retningslinjer beskriver gjennomføringen, men publiserer ikke oppgavesettene. Casene i dette dokumentet er derfor **originale treningsoppgaver**, ikke kopier av eller påstander om historiske eksamensoppgaver.

### Avgrensning

Dette er et komprimert, praktisk treningsopplegg. Det dekker sentrale deler av læreplanen, men kan ikke dekke alle mulige oppgaver eller garantere bestått. På eksamen skal kandidaten vise den kompetansen hen faktisk har, og lokale oppgavekriterier gjelder.
