id: l-innkapsling
tittel: Innkapsling og abstraksjon
tema: oop-klasser
dag: 3
minutter: 10
mal: forklare innkapsling og abstraksjon, bruke private/public, og skrive get-/set-metoder med validering.
===
## Innkapsling: beskytt dataene

**Innkapsling** betyr å samle data og metodene som hører til i en klasse, og **styre tilgangen** til dataene. Feltene gjøres `private`, og andre deler av programmet må gå via metoder.

Hvorfor? Se på en bankkonto:

```java
public class Konto {
    public double saldo;    // alle kan endre direkte
}
// et annet sted i programmet:
k.saldo = -5000000;          // ingen stopper dette!
```

Med innkapsling:

```java
public class Konto {
    private double saldo;    // bare Konto selv kan endre

    public double getSaldo() {
        return saldo;
    }

    public void settInn(double belop) {
        if (belop > 0) {
            saldo += belop;
        }
    }

    public boolean taUt(double belop) {
        if (belop > 0 && belop <= saldo) {
            saldo -= belop;
            return true;
        }
        return false;   // ikke nok penger
    }
}
```

Nå kan saldoen bare endres på lovlige måter. **Objektet passer selv på at dataene er gyldige.**

?? Hva er hovedfordelen med å gjøre `saldo` privat og bruke `taUt()`?
( ) Programmet blir kortere
(x) Klassen kan kontrollere at endringer er gyldige, f.eks. at saldo ikke går under 0
( ) Feltet blir raskere å lese
( ) Det er påkrevd for at koden skal kompilere
=> Innkapsling handler om kontroll: all endring går gjennom metoder som kan sjekke reglene.
===
## Synlighet, get og set

| Nøkkelord | UML | Hvem kan bruke det |
|---|---|---|
| `public` | `+` | alle klasser |
| `private` | `-` | bare klassen selv |
| `protected` | `#` | klassen selv og subklasser (arv – neste dag) |

Tommelfingerregel: **felt er `private`, metoder er `public`**.

**Get-metoder** (gettere) leser et felt. **Set-metoder** (settere) endrer det – gjerne med kontroll:

```java
public class Elev {
    private String navn;
    private int alder;

    public Elev(String navn, int alder) {
        this.navn = navn;
        setAlder(alder);          // gjenbruk valideringen
    }

    public int getAlder() {
        return alder;
    }

    public void setAlder(int alder) {
        if (alder >= 0 && alder <= 120) {
            this.alder = alder;
        } else {
            System.out.println("Ugyldig alder: " + alder);
        }
    }
}
```

Ikke alle felt trenger en setter. Skal noe aldri endres etter at objektet er laget (f.eks. et personnummer), lager du bare getter.

?? Et felt vises som `- poeng : int` i et klassediagram. Hvordan skrives det i Java?
( ) `public int poeng;`
(x) `private int poeng;`
( ) `protected int poeng;`
( ) `static int poeng;`
=> `-` betyr privat. Navn kommer først og typen etter kolon i UML; i Java er det omvendt: `private int poeng;`.
===
## Abstraksjon: vis bare det som trengs

**Abstraksjon** betyr å forenkle: vise de egenskapene og handlingene som er relevante, og skjule detaljene.

Når du kjører bil, bruker du ratt, gass og brems. Du trenger ikke vite hvordan motoren styrer innsprøytingen. Rattet og pedalene er **grensesnittet**; motoren er detaljene.

I kode: den som bruker `Konto`, kaller `taUt(500)` og får `true` eller `false`. Hvordan sjekken gjøres inni, trenger de ikke vite – og den kan endres senere uten at resten av programmet må endres.

Abstraksjon handler også om hva du tar med i modellen. En `Elev`-klasse i et karaktersystem trenger navn og karakterer – ikke skostørrelse.

| Begrep | Kort forklaring til eksamen |
|---|---|
| Innkapsling | samle data og metoder i en klasse og styre tilgangen (private felt, offentlige metoder) |
| Abstraksjon | ta med bare det relevante, og skjule detaljer bak et enkelt grensesnitt |

?? Hvilket utsagn beskriver abstraksjon?
( ) Alle felt skal være `public`
(x) En modell tar bare med egenskapene som er relevante for formålet, og skjuler detaljene
( ) En klasse arver fra en annen
( ) Et objekt lages med `new`
=> Abstraksjon = forenkling til det relevante. Det er beslektet med innkapsling, men handler om *hva* som vises, mens innkapsling handler om *tilgangskontroll*.
