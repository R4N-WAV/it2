id: l-variabler
tittel: Variabler og datatyper
tema: grunnlag
dag: 1
minutter: 14
mal: lage variabler med riktig datatype, endre verdien deres, og forklare heltallsdivisjon og modulo (%).
===
## En variabel er en navngitt boks

En **variabel** er et navn på et sted i minnet der programmet kan lagre en verdi. Tenk på en eske med en etikett.

```java
int alder = 17;
```

Les linjen slik: *«Lag en boks som heter `alder`, som kan holde et heltall (`int`), og legg 17 oppi.»*

- `int` er **datatypen** – hva slags verdi boksen kan inneholde.
- `alder` er **navnet**.
- `=` betyr **tilordning**: «legg verdien til høyre inn i boksen til venstre». Det betyr *ikke* «er lik» som i matte.

Du kan bytte innholdet senere – da skriver du ikke typen på nytt:

```java
int alder = 17;
alder = 18;          // boksen inneholder nå 18
alder = alder + 1;   // hent 18, legg til 1, lagre 19
System.out.println(alder);
```

```tekst
19
```

> HUSK: `alder = alder + 1` gir mening i programmering: regn ut høyre side først, lagre resultatet i venstre side.

?? Hva inneholder `x` til slutt?
```java
int x = 5;
x = x * 2;
x = x - 3;
```
( ) 5
( ) 10
(x) 7
( ) -1
=> Først 5. Så 5 · 2 = 10. Så 10 − 3 = 7. Hver linje bruker verdien fra linjen før.
===
## De viktigste datatypene

| Type | Hva den lagrer | Eksempel |
|---|---|---|
| `int` | heltall | `int antall = 42;` |
| `double` | desimaltall | `double pris = 99.90;` |
| `boolean` | sant eller usant | `boolean ferdig = false;` |
| `char` | ett tegn | `char bokstav = 'A';` |
| `String` | tekst | `String navn = "Kari";` |

Legg merke til:
- Desimaltall bruker **punktum**: `99.90`, ikke `99,90`.
- `char` bruker enkle fnutter `'A'`, `String` bruker doble `"Kari"`.
- `String` har stor S (det er en klasse – mer om det senere).

**Konstanter** er verdier som ikke skal endres. I Java skriver vi `final`:

```java
final double MOMS = 0.25;
```

**Gode variabelnavn** forteller hva de inneholder: `antallElever` er bedre enn `a`. Java skiller mellom store og små bokstaver: `alder` og `Alder` er to forskjellige variabler.

?? Hvilken type passer best for å lagre om en bruker er innlogget?
( ) `int`
( ) `String`
(x) `boolean`
( ) `double`
=> Innlogget eller ikke er ja/nei – nøyaktig det `boolean` (true/false) er laget for.
===
## Regning – og fellen med heltallsdivisjon

Java kan regne med `+`, `-`, `*` (gange) og `/` (dele). Men se her:

```java
System.out.println(7 / 2);
System.out.println(7.0 / 2);
```

```tekst
3
3.5
```

Når **begge** tallene er `int`, blir svaret også `int` – og desimalene kastes (ikke avrundet!). Dette kalles **heltallsdivisjon**. Er minst ett av tallene `double`, får du desimaler.

Dette er en av de vanligste feilene i prosentregning:

```java
int elbiler = 30, totalt = 120;
double feil = elbiler / totalt * 100;           // 0.0 (!)
double riktig = (double) elbiler / totalt * 100; // 25.0
```

`(double)` foran en verdi kalles **typekonvertering** (casting): «behandle dette som et desimaltall».

> FEIL: `elbiler / totalt` er `30 / 120`, som er 0 i heltallsdivisjon. 0 · 100 er fortsatt 0. Sett alltid `(double)` foran når du deler to heltall og vil ha desimaler.

?? Hva skrives ut?
```java
int a = 9;
int b = 4;
System.out.println(a / b);
```
( ) 2.25
(x) 2
( ) 3
( ) 2.0
=> Både `a` og `b` er `int`, så det blir heltallsdivisjon: 9 / 4 = 2,25 → desimalene kuttes → 2.
===
## Modulo (%) – resten etter divisjon

`%` gir **resten** når du deler. Det kalles *modulo* (i pseudokode ofte `MOD`).

| Uttrykk | Regning | Resultat |
|---|---|---|
| `7 % 2` | 7 = 3 · 2 + **1** | 1 |
| `10 % 3` | 10 = 3 · 3 + **1** | 1 |
| `12 % 4` | 12 = 3 · 4 + **0** | 0 |
| `5 % 7` | 5 = 0 · 7 + **5** | 5 |

Hvorfor er dette nyttig? Fordi **rest 0 betyr «går opp»**:

- `tall % 2 == 0` → tallet er et **partall**.
- `tall % 2 == 1` → tallet er et **oddetall** (for positive tall).
- `tall % 3 == 0` → tallet er delelig med 3.

> EKSAMEN: Modulo dukker opp i nesten alle pseudokodeoppgaver: partall/oddetall, FizzBuzz-varianter («TrommeLom»), annenhver gang i en løkke. Lær deg dette godt.

?? Hvilket uttrykk er `true` når `n` er delelig med 5?
( ) `n / 5 == 0`
(x) `n % 5 == 0`
( ) `n % 5 == 1`
( ) `n * 5 == 0`
=> Delelig med 5 betyr at resten er 0 når du deler på 5. `n / 5 == 0` er bare sant for tall mindre enn 5.
===
## Tekst (String) og innlesing

Du kan slå sammen tekst med `+`:

```java
String fornavn = "Kari";
int alder = 17;
System.out.println("Hei " + fornavn + ", du er " + alder + " år.");
```

```tekst
Hei Kari, du er 17 år.
```

Pass på rekkefølgen: Java leser fra venstre mot høyre.

```java
System.out.println("Sum: " + 2 + 3);    // Sum: 23  (tekst + 2 = tekst, så + 3)
System.out.println("Sum: " + (2 + 3));  // Sum: 5
```

Nyttige String-metoder: `navn.length()` (antall tegn), `navn.toUpperCase()`, `navn.charAt(0)` (første tegn), `navn.equals("Kari")` (sammenlign tekst).

**Lese inn fra brukeren** gjør vi med `Scanner`:

```java
import java.util.Scanner;   // øverst i filen

Scanner sc = new Scanner(System.in);
System.out.print("Hvor gammel er du? ");
int alder = sc.nextInt();        // leser et heltall
sc.nextLine();                   // tøm resten av linjen
System.out.print("Navn: ");
String navn = sc.nextLine();     // leser en hel linje tekst
```

**Tekst til tall:** `Integer.parseInt("42")` gir tallet 42, og `Double.parseDouble("3.5")` gir 3.5. Dette trenger du når du leser datafiler – der er alt tekst.

?? Hva skrives ut?
```java
System.out.println("Svar: " + 4 + 1);
```
( ) `Svar: 5`
(x) `Svar: 41`
( ) `Svar: 4 + 1`
( ) Feilmelding
=> Fra venstre: `"Svar: " + 4` blir teksten `"Svar: 4"`. Tekst + 1 blir `"Svar: 41"`. Vil du ha 5, må du skrive `(4 + 1)`.
