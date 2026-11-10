id: l-metoder
tittel: Metoder – gjenbruk av kode
tema: funksjoner
dag: 2
minutter: 12
mal: skrive metoder med parametere og returverdi, kalle dem, og forklare hvorfor gjenbrukbar kode er bedre (KM7).
===
## Hvorfor metoder?

Tenk deg at du regner ut moms fem steder i et program. Så endres momsen. Nå må du finne og endre fem steder – og glemmer kanskje ett.

En **metode** (også kalt *funksjon*) er en navngitt kodebit du kan kalle så mange ganger du vil:

```java
static double medMoms(double pris) {
    return pris * 1.25;
}

public static void main(String[] args) {
    System.out.println(medMoms(100));   // 125.0
    System.out.println(medMoms(80));    // 100.0
}
```

Fordeler:
- **Gjenbruk:** skriv én gang, bruk mange ganger.
- **Oversikt:** store problemer deles i små, navngitte deler.
- **Enklere testing og feilsøking:** du kan teste én metode om gangen.
- **Én endring ett sted:** endres momsen, endrer du bare metoden.

> EKSAMEN: Kompetansemål 7 handler om å «generalisere løsninger ved å utvikle og bruke gjenbrukbar programkode». Når du skal forklare *hvorfor* du lagde en metode, bruk ordene over.

?? Hva er den viktigste grunnen til å lage en metode for en beregning som brukes mange steder?
( ) Programmet kjører alltid raskere
(x) Koden skrives én gang og kan gjenbrukes, og endringer gjøres bare ett sted
( ) Java krever at all regning skjer i metoder
( ) Det gjør at man slipper variabler
=> Gjenbruk og vedlikehold er hovedpoenget. Metoder gjør ikke nødvendigvis programmet raskere.
===
## Anatomien til en metode

```java
static int storst(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

| Del | Betyr |
|---|---|
| `static` | metoden hører til klassen (du trenger ikke et objekt). Bruk det for metoder du kaller fra `main`. |
| `int` | **returtypen** – hva slags verdi metoden gir tilbake |
| `storst` | navnet (liten forbokstav, beskriver hva den gjør) |
| `(int a, int b)` | **parametere** – verdiene metoden tar inn |
| `return a;` | gir verdien tilbake og **avslutter metoden** med en gang |

Når du **kaller** metoden, gir du den **argumenter** – de faktiske verdiene:

```java
int s = storst(4, 9);   // a = 4, b = 9  →  s = 9
```

Metoder som ikke gir noe tilbake, har returtypen `void`:

```java
static void hils(String navn) {
    System.out.println("Hei, " + navn + "!");
}
```

?? Hva er returtypen til `static boolean erPartall(int n)`?
( ) `int`
(x) `boolean`
( ) `static`
( ) `void`
=> Typen rett foran metodenavnet er returtypen. Metoden gir tilbake `true` eller `false`.
===
## return vs. println

En vanlig misforståelse: en metode som *skriver ut* et svar, er ikke det samme som en metode som *returnerer* det.

```java
static int dobbel1(int x) {
    return x * 2;              // gir verdien tilbake til den som kalte
}
static void dobbel2(int x) {
    System.out.println(x * 2); // viser verdien på skjermen, gir ingenting tilbake
}

int svar = dobbel1(5) + 1;     // 11 – vi kan regne videre med svaret
// int feil = dobbel2(5) + 1;  // FEIL: void gir ingen verdi
```

**Returner** når andre deler av programmet skal bruke resultatet. Det gjør metoden mer gjenbrukbar – den som kaller, bestemmer selv om svaret skal skrives ut, lagres eller sammenlignes.

**Lokale variabler:** Variabler laget inne i en metode (også parameterne) finnes bare mens metoden kjører, og kan ikke brukes utenfor.

> HUSK: En metode som skal *beregne* noe, bør returnere svaret – ikke skrive det ut.

?? Hva skrives ut?
```java
static int f(int x) {
    return x + 3;
}
// i main:
System.out.println(f(f(2)));
```
( ) 5
(x) 8
( ) 6
( ) 23
=> Innerst først: `f(2)` = 5. Så `f(5)` = 8.
===
## Generalisere en løsning

Å **generalisere** betyr å gjøre en løsning mer generell, slik at den virker i flere tilfeller. Det gjør du ofte ved å bytte ut faste tall med **parametere**.

Spesifikk – virker bare for 10:

```java
static int sumTil10() {
    int sum = 0;
    for (int i = 1; i <= 10; i++) sum += i;
    return sum;
}
```

Generell – virker for alle n:

```java
static int sumTil(int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++) sum += i;
    return sum;
}
```

Enda mer generelt – virker for alle lister med tall:

```java
static double snitt(int[] tall) {
    int sum = 0;
    for (int t : tall) sum += t;
    return (double) sum / tall.length;
}
```

> EKSAMEN: Oppgaver kan be deg «generalisere» eller «gjøre løsningen gjenbrukbar». Svar: lag en metode, erstatt faste verdier med parametere, returner resultatet, og vis at den virker med to ulike kall.

?? Hvilken endring gjør `static double areal()` som alltid regner ut arealet av et 4 × 5-rektangel mest gjenbrukbar?
( ) Bytte navnet til `arealAvRektangel`
(x) Endre den til `static double areal(double bredde, double hoyde)`
( ) Skrive ut svaret i stedet for å returnere det
( ) Gjøre den `void`
=> Med bredde og høyde som parametere virker den for alle rektangler. Å skrive ut i stedet for å returnere gjør den *mindre* gjenbrukbar.
