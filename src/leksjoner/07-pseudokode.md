id: l-pseudokode
tittel: Pseudokode
tema: algoritmer
dag: 2
minutter: 12
mal: lese, spore og skrive pseudokode, og oversette mellom pseudokode og Java (med i 7 av 7 eksamenssett).
===
## Hva er pseudokode?

**Pseudokode** er en algoritme skrevet med enkle, kodelignende ord – uten de strenge reglene til et ekte programmeringsspråk. Den kan ikke kjøres, men alle som kan programmere (i hvilket som helst språk) kan lese den.

Den brukes til å:
- **planlegge** et program før du skriver koden,
- **kommunisere** en algoritme uavhengig av språk (derfor bruker eksamen det – kandidater skriver i ulike språk),
- **forklare** logikken uten syntaks-støy.

Det finnes ingen offisiell standard. Udir-eksamenene bruker varianter av dette:

| Pseudokode | Java |
|---|---|
| `x ← 5` eller `SETT x TIL 5` | `x = 5;` |
| `LES alder` | `alder = sc.nextInt();` |
| `SKRIV "Hei"` | `System.out.println("Hei");` |
| `HVIS … ELLERS HVIS … ELLERS` | `if … else if … else` |
| `FOR i FRA 1 TIL 10` | `for (int i = 1; i <= 10; i++)` |
| `FOR HVER x I liste` | `for (int x : liste)` |
| `MENS betingelse` | `while (betingelse)` |
| `a MOD b` | `a % b` |
| `OG`, `ELLER`, `IKKE` | `&&`, to loddrette streker, `!` |
| `FUNKSJON f(n)` … `RETURNER x` | `static int f(int n) { … return x; }` |

> HUSK: `FOR i FRA 1 TIL 10` tar som regel **med** 10. Blokkene vises med **innrykk** i stedet for krøllparenteser.

?? Hvorfor bruker eksamen pseudokode i stedet for Java?
( ) Fordi pseudokode kjører raskere
(x) Fordi den er språkuavhengig – kandidater som skriver i ulike språk kan alle lese den
( ) Fordi Java ikke har løkker
( ) Fordi pseudokode har strengere regler
=> Udir har kandidater i Python, JavaScript, C#, Java og flere. Pseudokode lar alle lese samme algoritme.
===
## Les og spor pseudokode

Samme teknikk som i Java: sporingstabell.

```pseudo
sum ← 0
FOR i FRA 1 TIL 10
    HVIS i MOD 2 = 0
        sum ← sum + i
SKRIV sum
```

Les det på norsk: *«Start med sum 0. For hvert tall fra 1 til 10: hvis tallet er et partall, legg det til summen. Skriv summen.»*

| `i` | `i MOD 2 = 0`? | `sum` |
|---|---|---|
| 1 | nei | 0 |
| 2 | ja | 2 |
| 3 | nei | 2 |
| 4 | ja | 6 |
| … | … | … |
| 10 | ja | 30 |

Utskrift: `30` (2 + 4 + 6 + 8 + 10).

Merk: i pseudokode skrives ofte `=` for sammenligning (ikke `==`), fordi `←` brukes til tilordning.

> EKSAMEN: Når du skal «forklare hva algoritmen gjør», gi både **hva den gjør i ord** («summerer alle partall fra 1 til 10») og et **konkret resultat** (30). Begge deler gir poeng.

?? Hva skrives ut?
```pseudo
teller ← 0
FOR HVER tall I [4, 15, 8, 23, 11]
    HVIS tall > 10
        teller ← teller + 1
SKRIV teller
```
( ) 2
(x) 3
( ) 4
( ) 49
=> 15, 23 og 11 er større enn 10. Algoritmen **teller** hvor mange tall som er over 10.
===
## Skriv din egen pseudokode

Slik går du fram:

1. **Hva er input?** (Hva får algoritmen inn?)
2. **Hva er output?** (Hva skal komme ut?)
3. **Hvilke variabler trenger du** for å huske noe underveis?
4. Skriv stegene i rekkefølge, med HVIS for valg og FOR/MENS for gjentakelse.
5. **Test** med et konkret eksempel – spor deg gjennom.

Oppgave: *«Lag en funksjon som får en temperatur og returnerer "kaldt" under 0, "mildt" fra 0 til og med 15 og "varmt" over 15.»*

```pseudo
FUNKSJON vaer(temp)
    HVIS temp < 0
        RETURNER "kaldt"
    ELLERS HVIS temp <= 15
        RETURNER "mildt"
    ELLERS
        RETURNER "varmt"
```

Test: `vaer(-3)` → kaldt, `vaer(0)` → mildt, `vaer(15)` → mildt, `vaer(16)` → varmt. Grenseverdiene 0 og 15 er sjekket.

Og i Java:

```java
static String vaer(int temp) {
    if (temp < 0) return "kaldt";
    else if (temp <= 15) return "mildt";
    else return "varmt";
}
```

> TIPS: Sensor ser etter **logikken**, ikke perfekt syntaks. Vær konsekvent, bruk innrykk og tydelige navn.

?? I `vaer`-funksjonen: hva returneres for `temp = 15`?
( ) kaldt
(x) mildt
( ) varmt
( ) ingenting
=> 15 er ikke under 0, men `15 <= 15` er sant → "mildt".
===
## Sortere stokket pseudokode

En vanlig eksamensoppgave: linjene i en algoritme er stokket, og du skal sette dem i riktig rekkefølge.

Strategi:
1. Finn ut hva algoritmen skal gjøre (les oppgaveteksten).
2. **Startverdier** kommer først (`sum ← 0`, `storst ← liste[0]`, `LES …`).
3. Så **løkken**, med det som skal gjentas **innrykket** under.
4. **Resultatet** (`SKRIV`, `RETURNER`) kommer **etter** løkken – ikke inni, ellers skrives det ut mange ganger.
5. Spor med et lite eksempel for å sjekke.

Stokket – skal finne det største tallet:

```pseudo
SKRIV storst
        storst ← tall
storst ← liste[0]
    HVIS tall > storst
FOR HVER tall I liste
```

Riktig:

```pseudo
storst ← liste[0]
FOR HVER tall I liste
    HVIS tall > storst
        storst ← tall
SKRIV storst
```

?? I en algoritme som summerer en liste, hvor skal `SKRIV sum` stå?
( ) Før løkken
( ) Inni løkken, innrykket
(x) Etter løkken, uten innrykk
( ) Det spiller ingen rolle
=> Summen er ferdig først når løkken er ferdig. Inni løkken ville den blitt skrevet ut én gang per element.
