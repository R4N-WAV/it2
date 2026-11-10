id: l-lokker
tittel: Løkker og sporing
tema: grunnlag
dag: 1
minutter: 15
mal: skrive for- og while-løkker, spore dem med en sporingstabell, og finne de vanligste løkkefeilene.
===
## Gjenta uten å kopiere: for-løkken

En **løkke** gjentar kode. Vil du skrive tallene 1 til 5, kan du skrive fem `println` – eller:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

```tekst
1
2
3
4
5
```

For-løkken har tre deler, skilt med semikolon:

1. **Start:** `int i = 1` – lag tellervariabelen `i` og gi den startverdi. Kjøres én gang.
2. **Betingelse:** `i <= 5` – sjekkes *før* hver runde. Er den `false`, stopper løkken.
3. **Oppdatering:** `i++` – kjøres *etter* hver runde. `i++` betyr `i = i + 1`.

Hver gjennomkjøring kalles en **iterasjon**.

Varianter: `i += 2` (hopp med 2), `i--` (tell nedover):

```java
for (int i = 10; i > 0; i -= 3) {
    System.out.print(i + " ");
}
```

```tekst
10 7 4 1
```

?? Hvor mange ganger kjører løkken?
```java
for (int i = 0; i < 4; i++) {
    System.out.println("Hei");
}
```
( ) 3
(x) 4
( ) 5
( ) Uendelig
=> `i` blir 0, 1, 2, 3 – fire runder. Når `i` blir 4, er `4 < 4` usant og løkken stopper. Mønsteret «start på 0, `< n`» gir alltid nøyaktig n runder.
===
## Sporingstabell – slik finner du svaret sikkert

På eksamen får du ofte spørsmålet «Hva skrives ut?». Ikke gjett – lag en **sporingstabell** med én kolonne per variabel og én rad per iterasjon.

```java
int sum = 0;
for (int i = 1; i <= 4; i++) {
    sum = sum + i;
}
System.out.println(sum);
```

| Runde | `i` | `i <= 4`? | `sum` etter runden |
|---|---|---|---|
| start | – | – | 0 |
| 1 | 1 | ja | 0 + 1 = 1 |
| 2 | 2 | ja | 1 + 2 = 3 |
| 3 | 3 | ja | 3 + 3 = 6 |
| 4 | 4 | ja | 6 + 4 = 10 |
| – | 5 | nei → stopp | 10 |

Utskrift: `10`.

> EKSAMEN: Skriv sporingstabellen i besvarelsen når du forklarer hva en algoritme gjør. Det viser sensor at du forstår, og gir delpoeng selv om du regner feil ett sted.

?? Hva skrives ut? Lag gjerne en sporingstabell på papir.
```java
int x = 1;
for (int i = 0; i < 3; i++) {
    x = x * 2;
}
System.out.println(x);
```
( ) 6
(x) 8
( ) 4
( ) 16
=> Tre runder: x = 1 → 2 → 4 → 8.
===
## while-løkken: gjenta så lenge noe er sant

**while** gjentar *så lenge* betingelsen er sann. Du bruker den når du **ikke vet** på forhånd hvor mange runder det blir.

```java
int saldo = 1000;
int aar = 0;
while (saldo < 2000) {
    saldo = saldo * 2;   // dobling hvert år (urealistisk rente!)
    aar++;
}
System.out.println("Antall år: " + aar);
```

```tekst
Antall år: 1
```

Et typisk bruksområde er å spørre brukeren til svaret er gyldig:

```java
int tall = -1;
while (tall < 1 || tall > 10) {
    System.out.print("Skriv et tall fra 1 til 10: ");
    tall = sc.nextInt();
}
```

| Bruk | Når |
|---|---|
| `for` | du vet antall runder (f.eks. gå gjennom en liste, telle fra 1 til n) |
| `while` | du gjentar til noe skjer (gyldig input, spillet er slutt, målet er nådd) |

`break` avslutter en løkke med en gang. `continue` hopper til neste runde.

?? Hva skrives ut?
```java
int n = 20;
int teller = 0;
while (n > 1) {
    n = n / 2;
    teller++;
}
System.out.println(teller);
```
( ) 3
(x) 4
( ) 5
( ) 10
=> n: 20 → 10 → 5 → 2 → 1 (heltallsdivisjon: 5/2 = 2, 2/2 = 1). Fire halveringer, og så er `1 > 1` usant.
===
## De vanligste løkkefeilene

**1. Uendelig løkke** – betingelsen blir aldri usann:

```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    // glemt i++  → i er alltid 0 → kjører for alltid
}
```

**2. «Én for mye / én for lite»** (off-by-one): `<` eller `<=`? Start på 0 eller 1?

```java
for (int i = 1; i < 10; i++)   // 1 til 9  – 10 er IKKE med
for (int i = 1; i <= 10; i++)  // 1 til 10
```

**3. Startverdien settes inni løkken** – da nullstilles den hver runde:

```java
for (int i = 1; i <= 3; i++) {
    int sum = 0;        // FEIL: lages på nytt hver runde
    sum = sum + i;
}
```

Variabler som skal «huske» noe mellom rundene (sum, teller, størst), må lages **før** løkken.

> HUSK: Mønsteret for nesten alle løkkeoppgaver er: 1) lag en variabel før løkken, 2) oppdater den inni løkken, 3) bruk resultatet etter løkken.

?? Koden skal skrive ut tallene 1 til og med 10, men skriver bare 1 til 9. Hva er feilen?
```java
for (int i = 1; i < 10; i++) {
    System.out.println(i);
}
```
( ) `i++` skal være `i--`
(x) `i < 10` skal være `i <= 10`
( ) `int i = 1` skal være `int i = 0`
( ) Det mangler `break`
=> Med `< 10` stopper løkken før 10 blir skrevet ut. `<= 10` tar med 10. Å starte på 0 ville gitt 0–9, som også er feil.
