id: l-csv
tittel: Datasett, CSV og JSON
tema: data, lagring
dag: 6
minutter: 15
mal: forklare CSV og JSON, lese en CSV-fil i Java, gjøre tekst om til tall og håndtere manglende verdier.
===
## Hva er et datasett?

Et **datasett** er en samling data, ofte som en tabell: hver **rad** er én observasjon (én kommune, én måling, én person), og hver **kolonne** er én egenskap (navn, år, antall).

| aar | region | totalt | elbiler |
|---|---|---|---|
| 2024 | Oslo | 300000 | 105000 |
| 2025 | Oslo | 300000 | 120000 |
| 2025 | Vestland | 250000 | 70000 |

På eksamen får du nesten alltid et ekte eller realistisk datasett som fil, og skal **lese det inn, behandle det, regne ut noe og presentere** resultatet. Dette var med i alle de sju siste eksamenssettene.

Fire datatyper i kolonner:
- **Tall** (heltall/desimal) – kan regnes med.
- **Tekst/kategori** – f.eks. region, kan grupperes.
- **Dato/tid** – f.eks. år, kan sorteres og vises over tid.
- **Sann/usann** – ja/nei-kolonner.

?? I tabellen over: hva er én rad?
( ) Alle elbilene i Norge
(x) Én observasjon, f.eks. Oslo i 2025
( ) Kolonnen «region»
( ) Hele filen
=> Hver rad beskriver én ting (her: én region ett år). Kolonnene er egenskapene.
===
## CSV og JSON

**CSV** (comma-separated values) er ren tekst der hver linje er en rad og feltene er skilt med komma (eller semikolon):

```csv
aar,region,totalt,elbiler
2024,Oslo,300000,105000
2025,Oslo,300000,120000
2025,Vestland,250000,70000
```

- Første linje er ofte **overskriften** (kolonnenavnene) – den må hoppes over.
- Enkelt, kompakt og kan åpnes i Excel. Men: ingen datatyper (alt er tekst) og bare flate tabeller.
- Norske filer bruker ofte **semikolon** fordi komma brukes som desimaltegn.

**JSON** (JavaScript Object Notation) er tekst med navngitte felt, og kan ha lister og objekter inni hverandre:

```json
{
  "region": "Oslo",
  "aar": 2025,
  "elbiler": 120000,
  "merker": ["Tesla", "VW", "Toyota"]
}
```

- Har **nøkkel: verdi**-par og skiller tall (`2025`) fra tekst (`"Oslo"`).
- Kan beskrive **nøstede** strukturer. Brukes mye av API-er på nettet.
- Tar mer plass enn CSV for enkle tabeller.

| | CSV | JSON |
|---|---|---|
| Struktur | flat tabell | nøstet (objekter i objekter, lister) |
| Datatyper | nei, alt er tekst | ja: tekst, tall, true/false, null |
| Passer til | tabelldata, regneark | API-er, sammensatte data |

?? Du skal lagre en bruker med navn og en liste med favorittsanger. Hva passer best?
( ) CSV
(x) JSON
( ) Begge er like godt egnet
( ) Ingen av dem
=> En liste inni et objekt er en nøstet struktur. JSON håndterer det direkte; CSV er laget for flate tabeller.
===
## Lese en CSV-fil i Java

Dette er **CSV-oppskriften** – lær den nesten utenat:

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        List<String> linjer = Files.readAllLines(Path.of("elbiler.csv"));

        int sum = 0;
        for (int i = 1; i < linjer.size(); i++) {        // i = 1: hopp over overskriften
            String[] felt = linjer.get(i).split(",");     // del opp linjen
            int aar = Integer.parseInt(felt[0].trim());   // tekst → tall
            String region = felt[1].trim();
            int elbiler = Integer.parseInt(felt[3].trim());

            if (aar == 2025) {
                sum += elbiler;
            }
        }
        System.out.println("Elbiler i 2025: " + sum);
    }
}
```

Steg for steg:
1. `Files.readAllLines` gir en liste med alle linjene som tekst.
2. Løkken starter på **1** for å hoppe over overskriften.
3. `split(",")` deler linjen i en array: `"2025,Oslo,300000,120000"` → `["2025", "Oslo", "300000", "120000"]`.
4. `trim()` fjerner mellomrom, og `Integer.parseInt` gjør tekst om til tall.
5. Så bruker du mønstrene du kan: summere, telle, filtrere.

`throws IOException` betyr: «filen kan mangle – da stopper programmet med feilmelding». Filen må ligge i mappen programmet kjører fra, eller du må oppgi riktig sti.

?? Hvorfor står det `int i = 1` og ikke `int i = 0` i løkken?
( ) Fordi Java teller fra 1
(x) For å hoppe over første linje, som er overskriften
( ) For å unngå den siste linjen
( ) Det er en feil
=> Linje 0 er `aar,region,totalt,elbiler`. `Integer.parseInt("aar")` ville krasjet med NumberFormatException.
===
## Rotete data: manglende verdier og feil format

Ekte data er ofte rotete. Typiske problemer:

| Problem | Eksempel | Løsning |
|---|---|---|
| tomt felt | `2025,Oslo,,120000` | sjekk med `isBlank()` og hopp over raden |
| mellomrom | `" 120000"` | `trim()` før `parseInt` |
| desimalkomma | `"12,5"` | `replace(",", ".")` før `parseDouble` |
| semikolon som skilletegn | `2025;Oslo;…` | `split(";")` |
| tekst der det skal være tall | `"ukjent"` | `try/catch` rundt `parseInt` |
| æ, ø, å blir rare tegn | `Bod�` | les filen som UTF-8 (standard i `Files.readAllLines`) |

```java
String[] felt = linje.split(";", -1);         // -1 beholder tomme felt på slutten
if (felt.length < 4 || felt[3].isBlank()) {
    continue;                                  // hopp over ufullstendig rad
}
```

**Viktig valg:** Skal en manglende verdi hoppes over, eller telle som 0? Å sette 0 trekker et gjennomsnitt kunstig ned. Som regel er det riktig å hoppe over – men **skriv i besvarelsen hva du valgte og hvorfor**.

> EKSAMEN: Å kommentere datakvalitet («3 rader manglet verdi og ble utelatt; det kan påvirke snittet for Nordland») er nettopp den typen vurdering som løfter et svar fra 3 til 4–5.

?? Et felt i prosent-kolonnen er tomt. Du skal regne gjennomsnittet. Hva er vanligvis best?
( ) Sette verdien til 0
(x) Hoppe over raden i beregningen og nevne det i besvarelsen
( ) Stoppe programmet
( ) Sette verdien til 100
=> 0 er en reell verdi og ville gjort snittet galt. Utelat raden, tell bare gyldige rader, og dokumenter valget.
