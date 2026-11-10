id: l-algoritmer
tittel: Algoritmemønstre du må kunne
tema: algoritmer
dag: 2
minutter: 18
mal: kjenne igjen og skrive mønstrene telle, summere, snitt, største, nest største, FizzBuzz, palindrom, sortering og søking.
===
## Fem mønstre som løser det meste

De fleste eksamensalgoritmer er varianter av noen få grunnmønstre. Lær dem som «oppskrifter».

**1. Telle** – hvor mange oppfyller et krav?

```pseudo
antall ← 0
FOR HVER x I liste
    HVIS x oppfyller kravet
        antall ← antall + 1
```

**2. Summere**

```pseudo
sum ← 0
FOR HVER x I liste
    sum ← sum + x
```

**3. Gjennomsnitt** = sum / antall

```java
double snitt = (double) sum / liste.length;   // husk (double)!
```

**4. Største verdi** – anta at den første er størst, bytt hvis du finner noe større:

```java
int storst = t[0];
for (int x : t) {
    if (x > storst) storst = x;
}
```

**5. Filtrere** – lag en ny liste med bare de som passer:

```java
ArrayList<Integer> store = new ArrayList<>();
for (int x : t) {
    if (x >= 100) store.add(x);
}
```

> FEIL: Start ikke `storst` på 0. Er alle tallene negative (f.eks. temperaturer om vinteren), blir svaret feil. Start på første element.

?? Hvilken endring gjør maks-mønsteret om til et **minste**-mønster?
( ) Starte på 0
(x) Bytte `x > storst` med `x < minst`
( ) Bytte `for` med `while`
( ) Sortere først og ta det siste
=> Samme oppskrift, bare motsatt sammenligning. (Sortering virker også, men er unødvendig mye arbeid.)
===
## Nest største og FizzBuzz

**Nest største distinkte verdi** (har kommet på eksamen): hold styr på to variabler.

```java
int storst = Integer.MIN_VALUE, nest = Integer.MIN_VALUE;
for (int x : t) {
    if (x > storst) {
        nest = storst;     // den gamle største blir nest størst
        storst = x;
    } else if (x > nest && x != storst) {
        nest = x;
    }
}
```

`Integer.MIN_VALUE` er det minste mulige heltallet – en trygg startverdi.

**FizzBuzz-mønsteret** (eksamen V25 hadde «TrommeLom»): tester delelighet med modulo. **Test «begge» først!**

```pseudo
FOR i FRA 1 TIL 15
    HVIS i MOD 3 = 0 OG i MOD 5 = 0
        SKRIV "FizzBuzz"
    ELLERS HVIS i MOD 3 = 0
        SKRIV "Fizz"
    ELLERS HVIS i MOD 5 = 0
        SKRIV "Buzz"
    ELLERS
        SKRIV i
```

Hvorfor begge først? 15 er delelig med 3. Står «MOD 3» øverst, skrives "Fizz" og resten hoppes over – "FizzBuzz" kommer aldri.

?? I FizzBuzz-algoritmen over: hva skrives for `i = 10`?
( ) Fizz
(x) Buzz
( ) FizzBuzz
( ) 10
=> 10 MOD 3 = 1 (ikke delelig med 3), men 10 MOD 5 = 0 → "Buzz".
===
## Tekst-algoritmer: palindrom og Caesar

**Palindrom** – et ord som er likt forlengs og baklengs (`"agnes i senga"`, `"radar"`). Sammenlign første med siste, nest første med nest siste …

```java
static boolean erPalindrom(String s) {
    s = s.toLowerCase().replace(" ", "");
    int v = 0, h = s.length() - 1;
    while (v < h) {
        if (s.charAt(v) != s.charAt(h)) return false;
        v++;
        h--;
    }
    return true;
}
```

Eller kortere: bygg ordet baklengs og sammenlign med `equals`.

**Caesar-chiffer** – flytt hver bokstav et fast antall plasser i alfabetet. Med forskyvning 3 blir A → D, B → E. Et `char` er egentlig et tall, så du kan regne med det:

```java
char c = 'A';
char kryptert = (char) ((c - 'A' + 3) % 26 + 'A');   // 'D'
```

`% 26` gjør at Z «går rundt» til starten igjen.

**Fibonacci**: hvert tall er summen av de to foregående: 0, 1, 1, 2, 3, 5, 8, 13 …

```pseudo
a ← 0
b ← 1
FOR i FRA 1 TIL n
    SKRIV a
    neste ← a + b
    a ← b
    b ← neste
```

?? Hvorfor trenger Fibonacci-algoritmen en hjelpevariabel `neste`?
( ) For å telle antall runder
(x) For å ikke miste den gamle verdien av `a` eller `b` når de oppdateres
( ) Fordi Java ikke kan legge sammen to variabler
( ) For å skrive ut resultatet
=> Skriver du `a ← b` først, er den gamle `a` borte før du får lagt den til. Hjelpevariabelen tar vare på summen før du flytter verdiene.
===
## Sortering og søking

**Boblesortering** (bubble sort): gå gjennom listen og bytt naboer som står i feil rekkefølge. Gjenta til ingen bytter trengs. Store tall «bobler» bakover.

```java
for (int runde = 0; runde < t.length - 1; runde++) {
    for (int i = 0; i < t.length - 1 - runde; i++) {
        if (t[i] > t[i + 1]) {
            int tmp = t[i];     // bytt med hjelpevariabel
            t[i] = t[i + 1];
            t[i + 1] = tmp;
        }
    }
}
```

I praksis bruker du det innebygde: `Arrays.sort(t)` eller `liste.sort(null)`. Men du bør kunne forklare idéen.

**Lineært søk:** sjekk elementene ett og ett fra start. Virker alltid.

**Binærsøk:** virker bare på en **sortert** liste. Se på midten – er det du leter etter mindre, fortsett i venstre halvdel, ellers i høyre. Halverer hver gang, derfor svært raskt.

**Effektivitet (Big O)** – hvordan tiden vokser når datamengden n vokser:

| Algoritme | Tid | Betyr |
|---|---|---|
| Slå opp `t[5]` eller i HashMap | O(1) | like raskt uansett størrelse |
| Binærsøk | O(log n) | 1 000 000 elementer ≈ 20 steg |
| Lineært søk, sum, maks | O(n) | dobbelt så mye data → dobbelt så lang tid |
| Boblesortering, løkke i løkke | O(n²) | dobbelt så mye data → fire ganger så lang tid |

?? Du skal søke i en usortert liste med 1000 navn. Hvilken metode kan du bruke direkte?
(x) Lineært søk
( ) Binærsøk
( ) Begge
( ) Ingen av dem
=> Binærsøk krever at listen er sortert. Lineært søk virker alltid (men er tregere på store lister).
