id: l-program
tittel: Hva er et program?
tema: grunnlag
dag: 1
minutter: 10
mal: forklare hva et program og en algoritme er, og lese et helt lite Java-program linje for linje.
===
## Datamaskinen gjør nøyaktig det du sier

En datamaskin er rask, men den tenker ikke selv. Den følger instruksjoner – én etter én, ovenfra og ned – og gjør **nøyaktig** det som står, selv om det er feil.

Et **program** er en liste med slike instruksjoner, skrevet i et språk datamaskinen kan oversette, for eksempel Java.

En **algoritme** er selve oppskriften: en presis, trinnvis beskrivelse av hvordan et problem skal løses. Algoritmen er ideen. Programmet er algoritmen skrevet i et bestemt programmeringsspråk.

> EKSEMPEL: Oppskrift på te: 1) Kok vann. 2) Legg teposen i koppen. 3) Hell vann i koppen. 4) Vent 3 minutter. 5) Ta ut posen. Bytter du om på 2 og 5, blir resultatet feil. Rekkefølgen betyr alt – også i kode.

I IT2 skal du kunne **lese**, **spore** (følge med på hva som skjer), **forklare**, **endre** og **skrive** enkel kode. Du skal ikke bli profesjonell utvikler på åtte dager – du skal kunne nok til å løse eksamensoppgavene.

?? Hva er forskjellen på en algoritme og et program?
( ) Det er det samme ordet
(x) Algoritmen er oppskriften (ideen), programmet er oppskriften skrevet i et programmeringsspråk
( ) Et program er alltid kortere enn en algoritme
( ) En algoritme kan bare skrives i Java
=> En algoritme kan skrives på norsk, som pseudokode eller som flytskjema. Når den skrives i Java (eller et annet språk) slik at maskinen kan kjøre den, er det et program.
===
## Ditt første Java-program

Slik ser det minste nyttige Java-programmet ut:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hei, IT2!");
    }
}
```

```tekst
Hei, IT2!
```

Du trenger ikke forstå hvert ord ennå. Dette er det viktige:

- `public class Main { … }` – all Java-kode ligger inne i en **klasse**. Filen må hete `Main.java` når klassen heter `Main`.
- `public static void main(String[] args) { … }` – **main-metoden**. Her starter programmet. Det som står mellom krøllparentesene `{ }` kjøres ovenfra og ned.
- `System.out.println("…");` – skriver tekst til skjermen og hopper til ny linje. `print` (uten *ln*) skriver uten linjeskift.

> HUSK: Hver instruksjon i Java slutter med semikolon `;`. Glemmer du det, får du en **syntaksfeil** og programmet kan ikke kjøres.

?? Hvor begynner et Java-program å kjøre?
( ) På første linje i filen
( ) I klassen som heter `Start`
(x) I `main`-metoden
( ) Der det står `println`
=> `public static void main(String[] args)` er inngangsdøra. Java leter etter den og starter der.
===
## Ovenfra og ned, og krøllparenteser

Instruksjonene kjøres i rekkefølge:

```java
System.out.println("En");
System.out.println("To");
System.out.print("Tre ");
System.out.println("og fire");
```

```tekst
En
To
Tre og fire
```

Krøllparentesene `{ }` lager **blokker**. Alt mellom en `{` og den tilhørende `}` hører sammen. Vi bruker **innrykk** (mellomrom foran linjene) for å vise hva som er inni hva. Java bryr seg ikke om innrykk, men mennesker – og sensorer – gjør det.

**Kommentarer** er tekst for mennesker, som Java hopper over:

```java
// Dette er en kommentar på én linje
/* Dette er en kommentar
   over flere linjer */
```

> TIPS: Skriv gjerne korte kommentarer i eksamenskoden som forklarer *hvorfor* du gjør noe. Det viser forståelse.

?? Hva skrives ut?
```java
System.out.print("A");
System.out.print("B");
System.out.println("C");
System.out.println("D");
```
( ) A, B, C og D på hver sin linje
(x) `ABC` på første linje og `D` på andre
( ) `ABCD` på én linje
( ) `AB` på første linje og `CD` på andre
=> `print` lager ikke linjeskift, så A, B og C havner på samme linje. Etter `println("C")` kommer et linjeskift, og D havner på neste linje.
===
## Slik kjører du Java på din egen PC

For å kjøre Java trenger du to ting:

1. **JDK** (Java Development Kit) – selve Java. Last ned Temurin fra adoptium.net (versjon 21 eller nyere).
2. En **editor** – VS Code med «Extension Pack for Java», eller IntelliJ IDEA Community.

Lag filen `Main.java`, lim inn Hei-programmet og trykk «Run». Ser du `Hei, IT2!`, virker alt.

Når du trykker «Run», skjer to ting:
- **Kompilering:** Java sjekker at koden følger språkets regler og oversetter den. Bryter du en regel (glemt `;`, feil stavet ord), får du en *kompileringsfeil* her.
- **Kjøring:** programmet utføres instruksjon for instruksjon.

> EKSAMEN: Skriftlig eksamen (REA3049) er på PC i 5 timer, og du skal levere kode. Sørg for at Java virker på PC-en du skal bruke – det er et eget steg i dag.

?? Du har glemt et semikolon. Når oppdager Java feilen?
(x) Under kompileringen, før programmet kjører
( ) Først når programmet er ferdig
( ) Aldri – Java legger det til selv
( ) Bare hvis du bruker `println`
=> Semikolon er en del av Java-syntaksen (grammatikken). Syntaksfeil oppdages når koden kompileres, og programmet kjører ikke før feilen er rettet.
