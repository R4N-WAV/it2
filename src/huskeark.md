### 1. De første 15 minuttene på eksamen

1. Les **hele** settet. Merk oppgavene du kan sikkert, og ta dem først.
2. Fordel tiden etter poeng. Sett en tidsgrense per oppgave og hold den.
3. Står du fast: skriv **pseudokode** eller forklar med ord hva du ville gjort. Del-løsninger gir poeng.

| Oppgaveord | Svaret må ha |
|---|---|
| **Forklar** | begrep → hvordan/hvorfor → konkret **eksempel** |
| **Vurder** | fordeler → ulemper → begrunnet **konklusjon** |
| **Drøft** | dilemma → interessenter → for → mot → tiltak → **konklusjon** |
| **Lag / implementer** | kode som kjører + kort forklaring + test |

### 2. Java – grunnmuren

```java
int antall = 7;            // heltall      7 / 2 == 3   (heltallsdivisjon!)
double snitt = 7 / 2.0;    // desimaltall  3.5
String navn = "Ola";       // tekst – sammenlign med navn.equals("Ola"), ikke ==
boolean ferdig = false;
int rest = 17 % 5;         // modulo = 2   (partall: x % 2 == 0)

if (alder >= 18 && harBillett) { ... } else if (alder >= 12) { ... } else { ... }

for (int i = 0; i < 10; i++) { ... }      // 0, 1, …, 9
while (saldo < maal) { saldo = saldo * 1.05; }
```

```java
int[] tall = {4, 8, 15};                     // fast lengde: tall.length
ArrayList<String> navn = new ArrayList<>();  // import java.util.ArrayList;
navn.add("Kari");  navn.get(0);  navn.size();  navn.remove(0);
for (String n : navn) { System.out.println(n); }

HashMap<String, Integer> antall = new HashMap<>();   // nøkkel → verdi
antall.put("Oslo", antall.getOrDefault("Oslo", 0) + 1);
for (String k : antall.keySet()) { System.out.println(k + ": " + antall.get(k)); }
```

### 3. Algoritmemønstre (nesten alltid med)

```java
int sum = 0, teller = 0, storst = Integer.MIN_VALUE;
for (int x : tall) {
    sum += x;                       // summere
    if (x > 10) teller++;           // telle
    if (x > storst) storst = x;     // finne største
}
double snitt = (double) sum / tall.length;   // castes – ellers heltallsdivisjon
```

**Sporingstabell:** lag én kolonne per variabel og én rad per runde i løkka. Skriv ned verdiene *etter* hver linje som endrer noe. Det er slik du løser «hva skrives ut?».

```pseudo
sum ← 0
FOR i FRA 1 TIL 5
    HVIS i MOD 2 = 0 SÅ
        sum ← sum + i
    SLUTT HVIS
SLUTT FOR
SKRIV sum        // 2 + 4 = 6
```

### 4. Klasser og objekter

```java
public class Konto {
    private String eier;          // attributter – private = innkapsling
    private double saldo;

    public Konto(String eier, double saldo) {   // konstruktør
        this.eier = eier;                       // this = dette objektet
        this.saldo = saldo;
    }
    public void settInn(double belop) {
        if (belop > 0) saldo += belop;          // validering
    }
    public double getSaldo() { return saldo; }
}

Konto k = new Konto("Ola", 100);   // lag et objekt
k.settInn(50);
```

```java
public class Sparekonto extends Konto {         // arv: Sparekonto ER EN Konto
    private double rente;
    public Sparekonto(String eier, double saldo, double rente) {
        super(eier, saldo);                     // kall superklassens konstruktør FØRST
        this.rente = rente;
    }
    @Override
    public String toString() { return "Sparekonto, rente " + rente; }   // overstyring
}
```

| UML | Betyr | Java |
|---|---|---|
| `- saldo: double` | privat attributt | `private double saldo;` |
| `+ settInn(belop: double): void` | offentlig metode | `public void settInn(double belop)` |
| pil med hul trekant | arv («er en») | `extends` |
| linje med fylt rombe | komposisjon («har en», del av) | `ArrayList<Vogn> vogner` i klassen |
| `1..*` | én eller flere | liste |

### 5. Datasett (CSV)

```java
List<String> linjer = Files.readAllLines(Path.of("data.csv"));   // import java.nio.file.*; java.util.*;
HashMap<String, Integer> sumPerFylke = new HashMap<>();
for (int i = 1; i < linjer.size(); i++) {           // i = 1 hopper over overskriften
    String[] felt = linjer.get(i).split(",", -1);   // sjekk skilletegn: , eller ;
    if (felt[3].isBlank()) continue;                // manglende verdi: hopp over og SI det
    String fylke = felt[1].trim();
    int verdi = Integer.parseInt(felt[3].trim());
    sumPerFylke.put(fylke, sumPerFylke.getOrDefault(fylke, 0) + verdi);
}
```

- **Andel i prosent:** `100.0 * del / total` (100.**0** – ellers heltallsdivisjon).
- **Prosentvis endring:** `100.0 * (ny - gammel) / gammel`. Forskjell mellom to prosenter = **prosentpoeng**.
- Avslutt alltid med **tolkning og forbehold**: hva viser tallene, hva viser de ikke, datakvalitet.

### 6. Etisk drøfting – malen

1. **Dilemma** i én setning: «Dilemmaet er trygghet mot personvern.»
2. **Interessenter:** hvem berøres, og hvordan?
3. **For** (minst to argumenter, konkret til caset).
4. **Mot** (minst to argumenter, like konkret).
5. **Tiltak:** dataminimering, kort lagringstid, tilgangsstyring, åpenhet, samtykke, menneskelig kontroll.
6. **Konklusjon** med standpunkt – gjerne betinget: «… kan forsvares **dersom** …».

**Fagbegreper å bruke:** personvern, personopplysninger, samtykke, formålsbegrensning, dataminimering, GDPR, konsekvensetikk (resultatet teller), pliktetikk (rettigheter gjelder uansett), digitalt skille, algoritmisk skjevhet (bias), åpenhet.

### 7. Spill og simulering – grunnmønsteret

```java
int[][] rutenett = new int[RADER][KOLONNER];
// tell naboene til rute (r, k) – med kantsjekk så du ikke går utenfor
int naboer = 0;
for (int dr = -1; dr <= 1; dr++)
    for (int dk = -1; dk <= 1; dk++) {
        int nr = r + dr, nk = k + dk;
        if ((dr != 0 || dk != 0) && nr >= 0 && nr < RADER && nk >= 0 && nk < KOLONNER
                && rutenett[nr][nk] == 1) naboer++;
    }
Random tilfeldig = new Random();
int terning = tilfeldig.nextInt(6) + 1;       // 1–6
```

- Spill-løkka: **les input → oppdater tilstand → sjekk kollisjon/regler → tegn/skriv ut**.
- Simulering: regn neste tilstand i et **nytt** rutenett, så bytt. Ellers påvirker du naboene midt i runden.
- Lever en **fungerende del-løsning** og skriv hva som mangler.

### 8. Feilsøking og test

- **Syntaksfeil** (kompilerer ikke) · **kjøretidsfeil** (krasjer, f.eks. `IndexOutOfBounds`) · **logiske feil** (feil svar).
- Testplan: **normalt** tilfelle, **grenseverdi** (0, tom liste, nøyaktig på grensen) og **ugyldig** input – med forventet resultat.
