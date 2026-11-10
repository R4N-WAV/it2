id: l-lister
tittel: Arrays, ArrayList og HashMap
tema: lister
dag: 1
minutter: 15
mal: lagre mange verdier i array, ArrayList og HashMap, hente ut med indeks eller nøkkel, og gå gjennom dem med løkker.
===
## Array: en rad med bokser

Hva om du skal lagre 30 karakterer? 30 variabler er upraktisk. En **array** (tabell) er én variabel med mange plasser:

```java
int[] poeng = {12, 7, 19, 4};
System.out.println(poeng[0]);       // 12
System.out.println(poeng[3]);       // 4
System.out.println(poeng.length);   // 4
poeng[1] = 10;                      // bytt ut 7 med 10
```

| Indeks | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Verdi | 12 | 7 | 19 | 4 |

- Hver plass har en **indeks**, og **den første er 0**.
- Siste indeks er alltid `length - 1`.
- En array har **fast størrelse**. Du kan lage en tom med `new int[30]` (30 plasser med 0).

> FEIL: `poeng[4]` finnes ikke i en array med 4 elementer. Da krasjer programmet med `ArrayIndexOutOfBoundsException` – en **kjøretidsfeil**.

?? `String[] navn = {"Ali", "Bo", "Cia"};` Hva er `navn[navn.length - 1]`?
( ) `"Ali"`
( ) `"Bo"`
(x) `"Cia"`
( ) Feil – indeks finnes ikke
=> `navn.length` er 3, så `navn[2]` – det siste elementet, `"Cia"`.
===
## Gå gjennom alle elementene

Løkker og arrays hører sammen. To måter:

```java
int[] poeng = {12, 7, 19, 4};

// 1) Vanlig for-løkke med indeks – når du trenger plassnummeret
for (int i = 0; i < poeng.length; i++) {
    System.out.println("Plass " + i + ": " + poeng[i]);
}

// 2) for-each – «for hvert element p i poeng»
int sum = 0;
for (int p : poeng) {
    sum += p;          // sum = sum + p
}
System.out.println("Sum: " + sum);   // Sum: 42
```

`for (int p : poeng)` leses «for hver `p` i `poeng`». Den tilsvarer `FOR HVER p I poeng` i pseudokode. Den er enklere, men du får ikke vite indeksen.

> HUSK: `i < poeng.length` – ikke `<=`. Med `<=` prøver du `poeng[4]` og programmet krasjer.

?? Hva skrives ut?
```java
int[] t = {3, 8, 1, 6};
int antall = 0;
for (int x : t) {
    if (x > 4) {
        antall++;
    }
}
System.out.println(antall);
```
( ) 1
(x) 2
( ) 3
( ) 14
=> Bare 8 og 6 er større enn 4, så `antall` blir 2. Dette er telle-mønsteret – du ser det igjen i neste leksjoner.
===
## ArrayList: en liste som kan vokse

Vet du ikke hvor mange elementer det blir (f.eks. linjer i en fil), bruker du **ArrayList**:

```java
import java.util.ArrayList;

ArrayList<String> handleliste = new ArrayList<>();
handleliste.add("melk");
handleliste.add("brød");
handleliste.add("ost");

System.out.println(handleliste.get(0));    // melk
System.out.println(handleliste.size());    // 3
handleliste.remove("brød");
System.out.println(handleliste);           // [melk, ost]

for (String vare : handleliste) {
    System.out.println("- " + vare);
}
```

| | Array | ArrayList |
|---|---|---|
| Lage | `int[] a = new int[5];` | `ArrayList<Integer> a = new ArrayList<>();` |
| Størrelse | fast, `a.length` | vokser, `a.size()` |
| Hente | `a[0]` | `a.get(0)` |
| Endre | `a[0] = 7;` | `a.set(0, 7);` |
| Legge til | går ikke | `a.add(7);` |

I `< >` skriver du typen. For tall må du bruke **Integer** og **Double** (med stor bokstav) i stedet for `int` og `double`.

?? Hvordan legger du til tallet 5 i `ArrayList<Integer> tall`?
( ) `tall[tall.length] = 5;`
(x) `tall.add(5);`
( ) `tall.put(5);`
( ) `tall = tall + 5;`
=> `add` legger til bakerst i listen og listen vokser med én.
===
## HashMap: slå opp med en nøkkel

En **HashMap** lagrer par av **nøkkel → verdi**, som en ordbok eller en telefonkatalog. Du slår opp med nøkkelen, ikke med et tall.

```java
import java.util.HashMap;

HashMap<String, Integer> innbyggere = new HashMap<>();
innbyggere.put("Oslo", 717710);
innbyggere.put("Bergen", 291940);

System.out.println(innbyggere.get("Oslo"));              // 717710
System.out.println(innbyggere.containsKey("Tromsø"));    // false
System.out.println(innbyggere.getOrDefault("Tromsø", 0)); // 0

for (String by : innbyggere.keySet()) {
    System.out.println(by + ": " + innbyggere.get(by));
}
```

Det viktigste bruksområdet på eksamen er **å telle eller summere per kategori** (gruppering):

```java
String[] farger = {"rød", "blå", "rød", "grønn", "rød"};
HashMap<String, Integer> antall = new HashMap<>();
for (String f : farger) {
    antall.put(f, antall.getOrDefault(f, 0) + 1);
}
System.out.println(antall);   // {rød=3, blå=1, grønn=1} (rekkefølgen kan variere)
```

Les linjen inni løkken slik: *«Hent antallet for denne fargen (eller 0 hvis den er ny), legg til 1, og lagre det tilbake.»*

> EKSAMEN: Datasettoppgavene (med i alle de sju siste settene) handler ofte om å gruppere: «antall per fylke», «sum per år». Da er HashMap-mønsteret over gull verdt.

?? Hva skrives ut?
```java
HashMap<String, Integer> m = new HashMap<>();
m.put("a", 1);
m.put("b", 2);
m.put("a", 5);
System.out.println(m.get("a") + m.size());
```
( ) 3
(x) 7
( ) 8
( ) 6
=> En nøkkel finnes bare én gang. `put("a", 5)` erstatter 1 med 5. Kartet har 2 nøkler, så 5 + 2 = 7.
