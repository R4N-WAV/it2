id: l-betingelser
tittel: Betingelser – if, else if og else
tema: grunnlag
dag: 1
minutter: 12
mal: skrive og spore if/else if/else med sammenligninger og &&, || og !, og sammenligne tekst riktig.
===
## Programmet tar valg

Hittil har all kode kjørt hver gang. Med **if** kan programmet velge:

```java
int alder = 15;
if (alder >= 18) {
    System.out.println("Du kan stemme.");
} else {
    System.out.println("Du må vente litt.");
}
```

```tekst
Du må vente litt.
```

- Betingelsen i parentesen `( … )` er enten `true` eller `false`.
- Er den `true`, kjøres blokken etter `if`.
- Er den `false`, kjøres blokken etter `else` (hvis det finnes en).

**Sammenligningsoperatorer** gir alltid `true`/`false`:

| Operator | Betyr | Med tallene 5 og 3 |
|---|---|---|
| `==` | lik | `5 == 3` er false |
| `!=` | ikke lik | `5 != 3` er true |
| `<` / `>` | mindre / større enn | `5 < 3` false, `5 > 3` true |
| `<=` / `>=` | mindre/større enn eller lik | `5 <= 3` false, `5 >= 5` true |

> FEIL: `=` er tilordning, `==` er sammenligning. `if (x = 5)` er feil, `if (x == 5)` er riktig.

?? Hva skrives ut når `temp` er 0?
```java
if (temp > 0) {
    System.out.println("Pluss");
} else {
    System.out.println("Ikke pluss");
}
```
( ) Pluss
(x) Ikke pluss
( ) Ingenting
( ) Begge
=> `0 > 0` er `false` (0 er ikke *større* enn 0), så else-blokken kjøres. Grenseverdier som dette er klassiske eksamensfeller.
===
## Flere valg: else if

Når det er mer enn to muligheter, bruker vi `else if`. Java sjekker **ovenfra og ned** og stopper ved **første** betingelse som er sann.

```java
int poeng = 72;
String karakter;
if (poeng >= 90) {
    karakter = "A";
} else if (poeng >= 70) {
    karakter = "B";
} else if (poeng >= 50) {
    karakter = "C";
} else {
    karakter = "Stryk";
}
System.out.println(karakter);
```

```tekst
B
```

72 er ikke ≥ 90, men det er ≥ 70 → `karakter` blir `"B"`, og resten hoppes over. Selv om 72 også er ≥ 50, sjekkes det aldri.

> HUSK: Rekkefølgen betyr noe. Sett den **strengeste** betingelsen først. Hadde `poeng >= 50` stått øverst, ville alle over 50 fått C.

?? Hva blir `karakter` hvis `poeng` er 90 i koden over?
(x) A
( ) B
( ) C
( ) Både A og B
=> `90 >= 90` er sant, så første blokk kjøres og resten hoppes over. Bare én blokk i en if/else if-kjede kjører.
===
## Kombinere betingelser: &&, || og !

| Java | Pseudokode | Sann når … |
|---|---|---|
| `a && b` | `a OG b` | **begge** er sanne |
| `a` ELLER `b` (skrives med to loddrette streker) | `a ELLER b` | **minst én** er sann |
| `!a` | `IKKE a` | `a` er usann |

«Eller» skrives med to loddrette streker i Java:

```java
// Billettpris: barn under 16 og honnør fra 67 år betaler halv pris
if (alder < 16 || alder >= 67) {
    pris = 50;
} else {
    pris = 100;
}

// Gyldig alder: mellom 0 og 120
if (alder >= 0 && alder <= 120) {
    System.out.println("Gyldig");
}

if (!innlogget) {
    System.out.println("Logg inn først");
}
```

> FEIL: Du kan ikke skrive `0 <= alder <= 120` i Java. Del det opp: `alder >= 0 && alder <= 120`.

?? En butikk gir rabatt hvis du er medlem **og** handler for minst 500 kr. Hvilken betingelse er riktig?
( ) `medlem || sum >= 500`
(x) `medlem && sum >= 500`
( ) `medlem && sum > 500`
( ) `!medlem && sum >= 500`
=> Begge krav må være oppfylt → `&&`. «Minst 500» betyr `>= 500` (500 er med).
===
## Sammenligne tekst: bruk equals

Tall sammenligner du med `==`. **Tekst (String) sammenligner du med `.equals()`**:

```java
String svar = sc.nextLine();
if (svar.equals("ja")) {
    System.out.println("Flott!");
}
if (svar.equalsIgnoreCase("JA")) {   // bryr seg ikke om store/små bokstaver
    System.out.println("Også ja");
}
```

Hvorfor? `==` på tekst sjekker om det er *samme objekt i minnet*, ikke om bokstavene er like. Det kan virke av og til og feile andre ganger – en lumsk feil.

**Nøstede if-er** er if inni if:

```java
if (alder >= 18) {
    if (harFørerkort) {
        System.out.println("Du kan kjøre bil.");
    } else {
        System.out.println("Ta førerkort først.");
    }
}
```

> TIPS: Gjør koden mer brukervennlig med `trim()` (fjerner mellomrom) og `equalsIgnoreCase`: da godtas både " Oslo" og "oslo".

?? Hvordan sjekker du om String-variabelen `by` inneholder teksten Bergen?
( ) `by == "Bergen"`
( ) `by = "Bergen"`
(x) `by.equals("Bergen")`
( ) `equals(by, Bergen)`
=> Tekst sammenlignes med `.equals()`. `=` er tilordning, og `==` sammenligner minneadresser for objekter som String.
