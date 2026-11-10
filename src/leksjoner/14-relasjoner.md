id: l-relasjoner
tittel: Komposisjon, aggregering og UML-relasjoner
tema: oop-komposisjon, uml
dag: 4
minutter: 14
mal: skille «er en» fra «har en», kode et objekt som har en liste med andre objekter, og lese piler og multiplisitet i UML.
===
## «Har en»: objekter inni objekter

Ikke alt er arv. Et **bibliotek** *er* ikke en bok – det **har** mange bøker. Da lagrer vi objektene i et felt:

```java
public class Bibliotek {
    private String navn;
    private ArrayList<Bok> boker = new ArrayList<>();

    public Bibliotek(String navn) {
        this.navn = navn;
    }

    public void leggTil(Bok b) {
        boker.add(b);
    }

    public int antallLedige() {
        int antall = 0;
        for (Bok b : boker) {
            if (!b.erUtlant()) antall++;
        }
        return antall;
    }
}
```

```java
Bibliotek bib = new Bibliotek("Deichman");
bib.leggTil(new Bok("Sult", "Hamsun"));
bib.leggTil(new Bok("Naiv. Super", "Loe"));
System.out.println(bib.antallLedige());   // 2
```

Dette mønsteret – **en klasse med en ArrayList av en annen klasse, pluss metoder som går gjennom listen** – er kanskje det viktigste i hele OOP-delen av eksamen. Tog med vogner, lag med spillere, handlekurv med varer: samme mønster.

?? En `Handlekurv` skal inneholde mange `Vare`-objekter. Hva er best?
( ) `class Handlekurv extends Vare`
(x) Et felt `private ArrayList<Vare> varer` i `Handlekurv`
( ) `class Vare extends Handlekurv`
( ) Én variabel per vare: `vare1`, `vare2`, …
=> En handlekurv *har* varer – det er et har-en-forhold. En liste lar kurven ha så mange varer som trengs.
===
## Komposisjon, aggregering og assosiasjon

Det finnes tre styrker av «har en / kjenner til»:

| Relasjon | Betyr | Delen uten helheten? | Eksempel |
|---|---|---|---|
| **Komposisjon** | sterk «del av» | nei – delen dør med helheten | hus og rom, ordre og ordrelinjer |
| **Aggregering** | svak «har» | ja – delen kan leve videre alene | lag og spillere, bibliotek og bøker |
| **Assosiasjon** | «kjenner til / bruker» | ja – ingen eier den andre | lærer og elev, kunde og butikk |

Tenk: *Hvis helheten slettes, gir det mening at delen fortsatt finnes?*
- Rive et hus → rommene forsvinner også → **komposisjon**.
- Legge ned et fotballag → spillerne finnes fortsatt → **aggregering**.

I koden ser komposisjon og aggregering ofte like ut (et felt med et objekt eller en liste). Forskjellen er i *meningen*: ved komposisjon lages delene typisk **inni** helheten (`new` i konstruktøren), ved aggregering sendes de **inn** utenfra.

> TIPS: Er du usikker på eksamen, si «har-en-relasjon (komposisjon/aggregering)» og begrunn med livsløp. Begrunnelsen teller mer enn ordet.

?? En `Ordre` har `Ordrelinje`-objekter som ikke gir mening uten ordren. Hvilken relasjon er det?
(x) Komposisjon
( ) Aggregering
( ) Arv
( ) Ingen relasjon
=> Ordrelinjene er en del av ordren og slettes med den – sterk «del av» = komposisjon.
===
## Pilene i klassediagrammet

| Relasjon | Tegnes som | Huskeregel |
|---|---|---|
| Arv | heltrukken linje med **åpen, hul trekant** | trekanten peker **mot superklassen** |
| Komposisjon | linje med **fylt (svart) diamant** | diamanten er hos **helheten** |
| Aggregering | linje med **hul (hvit) diamant** | diamanten er hos **helheten** |
| Assosiasjon | vanlig linje (evt. med åpen pil) | – |

```tekst
  Kjoretoy ◁──── Elbil          Elbil ER ET kjøretøy (trekant hos superklassen)

  Hus ◆────── Rom               Hus består av rom (fylt diamant hos helheten)

  Lag ◇────── Spiller           Lag har spillere (hul diamant hos helheten)
```

> FEIL: Trekanten peker mot den **generelle** klassen (forelderen), ikke mot subklassen. Diamanten sitter ved **den som eier**, ikke ved delen.

?? I et diagram går en linje fra `Hund` til `Dyr` med en hul trekant ved `Dyr`. Hva betyr det?
( ) Dyr arver fra Hund
(x) Hund arver fra Dyr (Hund er et Dyr)
( ) Hund har mange Dyr
( ) Dyr er en del av Hund
=> Trekanten peker mot superklassen. Hund er subklassen.
===
## Multiplisitet: hvor mange?

Tall ved enden av en linje sier **hvor mange** objekter som kan være koblet:

| Skrives | Betyr |
|---|---|
| `1` | nøyaktig én |
| `0..1` | ingen eller én |
| `*` eller `0..*` | null eller flere |
| `1..*` | minst én |
| `2..4` | mellom to og fire |

```tekst
  Tog ◆──────────── Vogn
       1        1..*
```

Les: *«Ett tog har én eller flere vogner. En vogn hører til nøyaktig ett tog.»* Tallet ved **Vogn** sier hvor mange vogner hvert tog har.

I koden betyr `1` et vanlig felt (`private Lokomotiv lok;`), mens `*` eller `1..*` betyr en liste (`private ArrayList<Vogn> vogner;`). Kravet «minst én» kan sjekkes i koden, f.eks. at toget ikke kjører uten vogner.

?? Mellom `Kunde` og `Ordre` står `1` ved Kunde og `0..*` ved Ordre. Hva betyr det?
( ) En kunde har nøyaktig én ordre
(x) En kunde kan ha null eller mange ordrer, og hver ordre tilhører én kunde
( ) En ordre kan ha mange kunder
( ) Det må finnes minst én ordre
=> Tallet ved Ordre (0..*) sier hvor mange ordrer en kunde har. Tallet ved Kunde (1) sier at hver ordre har nøyaktig én kunde.
===
## Arv eller komposisjon? En metode for eksamen

1. Si setningene høyt: «A **er en** B» og «A **har en** B».
2. Den som høres riktig ut, vinner. «En elbil er en bil» → arv. «En bil har en motor» → komposisjon.
3. Usikker? **Velg komposisjon.** Arv binder klassene sterkt sammen; komposisjon er mer fleksibel. («Favor composition over inheritance» er et kjent prinsipp.)
4. Begrunn valget i besvarelsen.

Eksamensklassiker – **kjøretøy, elbil, batteri og passasjerer**:
- `Elbil` **er et** `Kjoretoy` → arv.
- `Elbil` **har et** `Batteri` → komposisjon (batteriet lages inni og byttes sjelden).
- `Kjoretoy` **har** passasjerer (`Person`) → aggregering (passasjerene finnes uten bilen).

> EKSAMEN: Et godt svar på «velg og begrunn struktur» nevner relasjonstypen, setningen «er en / har en», og en konsekvens: «Med arv får Elbil alle metodene til Kjoretoy, så jeg slipper å skrive dem på nytt.»

?? En `Spiller` i et spill skal ha et `Vapen` som kan byttes ut underveis. Hva passer best?
( ) `Spiller extends Vapen`
( ) `Vapen extends Spiller`
(x) Et felt `private Vapen vapen;` i `Spiller` (har-en)
( ) Ingen kobling
=> En spiller *har* et våpen – og det kan byttes. Det er en har-en-relasjon, ikke arv.
