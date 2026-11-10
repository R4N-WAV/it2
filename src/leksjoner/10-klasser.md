id: l-klasser
tittel: Klasser og objekter
tema: oop-klasser
dag: 3
minutter: 15
mal: forklare klasse, objekt, attributt, metode og konstruktør, og skrive en enkel klasse og lage objekter av den.
===
## Fra løse variabler til objekter

Tenk deg et program for et bibliotek. Hver bok har tittel, forfatter og om den er utlånt. Med bare variabler blir det fort rot:

```java
String tittel1 = "Sult";       String forfatter1 = "Hamsun";   boolean utlant1 = false;
String tittel2 = "Naiv. Super"; String forfatter2 = "Loe";     boolean utlant2 = true;
// … og 500 bøker til?
```

**Objektorientert programmering (OOP)** samler data og handlinger som hører sammen i **objekter**. Vi beskriver én gang hvordan en bok ser ut – en **klasse** – og lager så så mange bok-**objekter** vi vil.

| Begrep | Betyr | Eksempel |
|---|---|---|
| **Klasse** | mal/oppskrift/tegning | `Bok` |
| **Objekt** (instans) | en konkret ting laget fra klassen | boka «Sult» |
| **Attributt** (felt) | data hvert objekt har | `tittel`, `utlant` |
| **Metode** | noe objektet kan gjøre | `laanUt()` |
| **Konstruktør** | setter startverdier når objektet lages | `new Bok("Sult", "Hamsun")` |

> EKSEMPEL: Klassen er pepperkakeformen. Objektene er pepperkakene. Én form – mange kaker, og hver kake kan pyntes forskjellig (ha egne verdier).

?? «Bil» er en klasse. Hva er et objekt?
( ) Fargen til en bil
( ) Metoden `kjor()`
(x) Den konkrete bilen med registreringsnummer EL 12345
( ) Ordet `new`
=> Et objekt er én konkret instans av klassen, med sine egne verdier. Farge er et attributt, og `kjor()` er en metode.
===
## Skrive en klasse

```java
public class Bok {
    // Attributter (felt) – hver bok har sine egne
    private String tittel;
    private String forfatter;
    private boolean utlant;

    // Konstruktør – samme navn som klassen, ingen returtype
    public Bok(String tittel, String forfatter) {
        this.tittel = tittel;
        this.forfatter = forfatter;
        this.utlant = false;       // nye bøker er ikke utlånt
    }

    // Metoder – hva en bok kan gjøre
    public void laanUt() {
        utlant = true;
    }

    public boolean erUtlant() {
        return utlant;
    }

    public String getTittel() {
        return tittel;
    }
}
```

Legg merke til:
- **Feltene** står øverst, utenfor alle metoder. De lever like lenge som objektet.
- **Konstruktøren** har samme navn som klassen og *ingen* returtype (ikke engang `void`).
- Metodene har **ikke** `static` – de jobber med *dette objektets* data.

?? Hvordan kjenner du igjen en konstruktør?
( ) Den heter alltid `main`
(x) Den har samme navn som klassen og ingen returtype
( ) Den starter med `static`
( ) Den returnerer alltid `void`
=> `public Bok(…)` – samme navn som klassen `Bok`, og ingen returtype foran navnet.
===
## this – «mitt eget felt»

I konstruktøren heter parameteren og feltet det samme: `tittel`. Hvordan skiller Java dem?

```java
public Bok(String tittel, String forfatter) {
    this.tittel = tittel;
}
```

- `this.tittel` = **feltet** i objektet som lages.
- `tittel` = **parameteren** – verdien som ble sendt inn.

Les linjen: *«Lagre verdien som ble sendt inn i dette objektets felt `tittel`.»*

> FEIL: Skriver du `tittel = tittel;` uten `this`, setter du parameteren lik seg selv. Feltet forblir `null` – og ingen feilmelding forteller deg det.

?? Hva er `this.pris` i en konstruktør?
( ) Parameteren som heter `pris`
(x) Feltet `pris` i objektet som lages
( ) En statisk variabel
( ) En metode
=> `this` peker på objektet selv. `this.pris` er altså objektets eget felt.
===
## Lage og bruke objekter

Objekter lages med `new`, som kaller konstruktøren:

```java
public class Main {
    public static void main(String[] args) {
        Bok b1 = new Bok("Sult", "Hamsun");
        Bok b2 = new Bok("Naiv. Super", "Loe");

        b1.laanUt();

        System.out.println(b1.getTittel() + ": " + b1.erUtlant());
        System.out.println(b2.getTittel() + ": " + b2.erUtlant());
    }
}
```

```tekst
Sult: true
Naiv. Super: false
```

- `b1` og `b2` er **to separate objekter**. Å låne ut `b1` påvirker ikke `b2`.
- Metoder kalles med **punktum**: `objekt.metode()`.
- Objekter kan lagres i lister: `ArrayList<Bok> boker = new ArrayList<>();` og `boker.add(b1);`

> EKSAMEN: Etter at du har skrevet klassene, lag alltid en `main` (et «testprogram») som oppretter objekter og kaller metodene. Det viser at løsningen virker, og oppgavene ber ofte om det.

?? Hva skrives ut?
```java
Bok a = new Bok("A", "X");
Bok b = new Bok("B", "Y");
b.laanUt();
System.out.println(a.erUtlant());
```
(x) false
( ) true
( ) null
( ) Feilmelding
=> Bare `b` er lånt ut. `a` er et eget objekt med egne felt, og `utlant` ble satt til `false` i konstruktøren.
===
## toString og static

**toString()** bestemmer hvordan et objekt ser ut når det skrives ut:

```java
@Override
public String toString() {
    return tittel + " av " + forfatter + (utlant ? " (utlånt)" : "");
}

// i main:
System.out.println(b1);    // Sult av Hamsun (utlånt)
```

Uten `toString` skriver Java noe uleselig som `Bok@1b6d3586`.

(`betingelse ? a : b` er en kort if/else: gir `a` hvis sann, ellers `b`.)

**static vs. instans:**
- Et **instansfelt** (uten `static`) har én verdi **per objekt**: hver bok har sin egen tittel.
- Et **static**-felt deles av **alle** objektene: f.eks. en teller for hvor mange bøker som er laget.

```java
private static int antallBoker = 0;   // felles for alle
public Bok(String tittel, String forfatter) {
    // …
    antallBoker++;
}
```

?? Hvert `Elev`-objekt skal ha sitt eget navn. Hvordan bør feltet `navn` deklareres?
(x) `private String navn;`
( ) `private static String navn;`
( ) `public static final String NAVN;`
( ) Inne i `main`
=> Uten `static` får hvert objekt sin egen kopi. Med `static` ville alle elevene delt ett og samme navn.
