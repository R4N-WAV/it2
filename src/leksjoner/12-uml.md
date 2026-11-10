id: l-uml
tittel: Klassediagram (UML) – grunnlaget
tema: uml
dag: 3
minutter: 10
mal: lese en klasseboks i UML og skrive den tilsvarende Java-klassen – og omvendt.
===
## Klasseboksen

**UML** (Unified Modeling Language) er en standard måte å tegne programmer på. Et **klassediagram** viser klassene, hva de inneholder, og hvordan de henger sammen.

Hver klasse er en boks med tre deler:

```tekst
+------------------------------+
|           Konto              |   ← klassenavn
+------------------------------+
| - kontonr : String           |   ← attributter (felt)
| - saldo : double             |
+------------------------------+
| + Konto(kontonr : String)    |   ← konstruktør og metoder
| + settInn(belop : double)    |
| + taUt(belop : double) : boolean |
| + getSaldo() : double        |
+------------------------------+
```

Lesereglene:
- `-` privat, `+` offentlig, `#` beskyttet (protected).
- **Navn først, så kolon og type**: `saldo : double`.
- Metoder: parametere i parentes, **returtype etter kolon** til slutt. Ingen returtype = `void`.

> EKSAMEN: «Implementer klassene fra klassediagrammet» har vært en gjenganger i de fem nyeste eksamenssettene. Det er i stor grad mekanisk oversetting – lær reglene, så får du sikre poeng.

?? Hva betyr `+ getNavn() : String`?
( ) Et privat felt som heter getNavn
(x) En offentlig metode uten parametere som returnerer en String
( ) En metode som tar inn en String
( ) En konstruktør
=> `+` = public, `()` = ingen parametere, `: String` = returtype.
===
## Fra diagram til Java

Diagrammet over blir:

```java
public class Konto {
    private String kontonr;
    private double saldo;

    public Konto(String kontonr) {
        this.kontonr = kontonr;
        this.saldo = 0;
    }

    public void settInn(double belop) {
        if (belop > 0) saldo += belop;
    }

    public boolean taUt(double belop) {
        if (belop > 0 && belop <= saldo) {
            saldo -= belop;
            return true;
        }
        return false;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

Oppskrift:
1. `public class Navn { }`
2. Hver attributt-linje → `private type navn;` (snu rekkefølgen!)
3. Konstruktøren → sett alle felt. Felt som ikke er parametere, gis en fornuftig startverdi.
4. Hver metode → riktig synlighet, returtype og parametere. Fyll inn logikken som oppgaveteksten beskriver.
5. Lag et lite testprogram i `main`.

?? Hvordan blir UML-linjen `+ beregnPris(antall : int) : double` i Java?
( ) `public int beregnPris(double antall)`
(x) `public double beregnPris(int antall)`
( ) `private double beregnPris(int antall)`
( ) `public void beregnPris(int antall, double)`
=> Returtypen (etter siste kolon) er `double` og står foran navnet i Java. Parameteren `antall` er `int`.
===
## Fra tekst til klassediagram

Ofte må du selv lage modellen fra en oppgavetekst. Bruk **substantiv-og-verb-metoden**:

1. Finn **substantivene** (ting): de viktigste blir **klasser**, de små egenskapene blir **attributter**.
2. Finn **verbene** (handlinger): de blir **metoder**.
3. Finn **sammenhengene**: «er en» → arv, «har en / har flere» → komposisjon/aggregering (neste dag).

> EKSEMPEL: «Et treningssenter har **medlemmer** med navn og medlemsnummer. Et medlem kan **booke** en **time**. En time har klokkeslett og maks antall deltakere.»
>
> Klasser: `Medlem`, `Time`, (`Treningssenter`). Attributter: navn, medlemsnummer, klokkeslett, maksDeltakere. Metoder: `booke()`, kanskje `harLedigPlass()`.

Ikke ta med alt: tenk abstraksjon – bare det systemet faktisk trenger.

?? I teksten «En spiller har et navn og en poengsum, og kan hoppe og samle mynter» – hva bør bli metoder?
( ) navn og poengsum
(x) hoppe og samleMynt
( ) spiller og mynter
( ) Alt sammen
=> Verbene (handlingene) blir metoder. navn og poengsum er attributter, og Spiller er klassen.
