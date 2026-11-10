id: l-spill
tittel: Spill og simulering
tema: spill
dag: 7
minutter: 18
mal: bygge et spill eller en simulering trinnvis med tilstand, spill-løkke, rutenett, naboer og tilfeldighet – og levere en fungerende del-løsning.
===
## Modell, tilstand og spill-løkke

En **modell** er en forenklet beskrivelse av noe virkelig. En **simulering** kjører modellen over tid for å se hva som skjer (smittespredning, skogbrann, trafikk, kø).

Alt som beskriver «hvordan ting er akkurat nå» kalles **tilstanden**: posisjoner, poeng, liv, hvem som er syke, hvilke trær som brenner.

Nesten alle spill og simuleringer har samme skjelett – **spill-løkken**:

```pseudo
sett opp starttilstand
MENS ikke ferdig
    tegn / vis tilstanden
    les input (spill) – eller hopp over (simulering)
    oppdater tilstanden (flytt, regn ut neste steg)
    sjekk hendelser (kollisjon, vant, tapt, mål nådd)
vis resultat
```

Hver runde i løkken er ett **tidssteg** (én «tick» eller generasjon).

> EKSAMEN: Spill/simulering var med i alle de sju siste settene, i ulike drakter: sykdomsspredning, skogbrann, Game of Life, klokker, myntspill. Lær skjelettet – så kjenner du igjen oppgaven uansett kontekst.

?? I et spill der en figur samler mynter: hva er en del av **tilstanden**?
( ) Navnet på programmet
(x) Figurens posisjon og antall poeng
( ) At `while` brukes
( ) Fargen på editoren
=> Tilstanden er dataene som endrer seg mens spillet pågår – posisjon, poeng, gjenværende mynter.
===
## Spillobjekter med OOP

Spill passer perfekt for OOP. Hver ting i spillet blir en klasse:

```java
class Figur {
    protected int x, y;

    public Figur(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public boolean sammePlass(Figur annen) {     // kollisjon = samme rute
        return x == annen.x && y == annen.y;
    }
}

class Spiller extends Figur {
    private int poeng = 0;

    public Spiller(int x, int y) { super(x, y); }

    public void flytt(int dx, int dy, int storrelse) {
        int nyX = x + dx, nyY = y + dy;
        if (nyX >= 0 && nyX < storrelse && nyY >= 0 && nyY < storrelse) {  // kantsjekk
            x = nyX;
            y = nyY;
        }
    }

    public void fikkPoeng() { poeng++; }
    public int getPoeng() { return poeng; }
}
```

Mønstre å legge merke til:
- **Felles superklasse** (`Figur`) for alt som har posisjon – arv gir gjenbruk.
- **Kantsjekk** – spilleren kan ikke gå utenfor brettet.
- **Kollisjon** – to objekter på samme rute (eller overlappende rektangler i grafiske spill).
- **Spill-klassen** *har* en spiller og en liste med mynter (komposisjon).

> TIPS: Når du fjerner elementer fra en liste mens du går gjennom den (f.eks. mynter som blir plukket opp), gå **baklengs**: `for (int i = liste.size() - 1; i >= 0; i--)`. Ellers hopper du over elementer.

?? Hva gjør kantsjekken i `flytt`?
( ) Sjekker om spilleren har fått poeng
(x) Hindrer at spilleren flyttes utenfor brettet
( ) Flytter spilleren tilfeldig
( ) Avslutter spillet
=> Ny posisjon regnes ut først, og den brukes bare hvis den er innenfor 0 til størrelse − 1 i begge retninger.
===
## Rutenett og naboer

Mange simuleringer foregår på et **rutenett** – en 2D-array:

```java
char[][] skog = new char[10][10];   // 10 rader, 10 kolonner
skog[2][3] = 'T';                   // rad 2, kolonne 3 er et tre
```

Gå gjennom alle cellene med **nøstede løkker**:

```java
for (int r = 0; r < skog.length; r++) {
    for (int k = 0; k < skog[0].length; k++) {
        System.out.print(skog[r][k]);
    }
    System.out.println();
}
```

**Naboer** til cellen `(r, k)`: opp `(r-1, k)`, ned `(r+1, k)`, venstre `(r, k-1)`, høyre `(r, k+1)` – og eventuelt de fire diagonale. Langs kanten finnes ikke alle naboene, så **sjekk grensene først**:

```java
static int brennendeNaboer(char[][] s, int r, int k) {
    int antall = 0;
    for (int dr = -1; dr <= 1; dr++) {
        for (int dk = -1; dk <= 1; dk++) {
            if (dr == 0 && dk == 0) continue;           // ikke seg selv
            int nr = r + dr, nk = k + dk;
            if (nr >= 0 && nr < s.length && nk >= 0 && nk < s[0].length
                    && s[nr][nk] == 'B') {
                antall++;
            }
        }
    }
    return antall;
}
```

> FEIL: Uten grensesjekken krasjer programmet med `ArrayIndexOutOfBoundsException` så fort en celle i kanten undersøkes.

?? Hvor mange naboer (inkludert diagonaler) har cellen i øverste venstre hjørne av et rutenett?
( ) 8
( ) 4
(x) 3
( ) 2
=> Høyre, under og diagonalt under-høyre. De fem andre retningene er utenfor rutenettet.
===
## Neste tilstand: bruk et nytt rutenett

Viktig regel i simuleringer som skogbrann og Game of Life: **alle celler skal oppdateres samtidig**, basert på den *gamle* tilstanden.

Endrer du rutenettet direkte mens du går gjennom det, kan et tre som nettopp tok fyr i *denne* runden tenne naboen sin i *samme* runde – brannen hopper flere ruter på ett steg. Løsningen er et **nytt rutenett**:

```java
static char[][] nesteSteg(char[][] skog, double p, Random rnd) {
    char[][] ny = new char[skog.length][skog[0].length];
    for (int r = 0; r < skog.length; r++) {
        for (int k = 0; k < skog[0].length; k++) {
            char c = skog[r][k];                              // les fra GAMMEL
            if (c == 'B') {
                ny[r][k] = '.';                               // brent ned
            } else if (c == 'T' && brennendeNaboer(skog, r, k) > 0 && rnd.nextDouble() < p) {
                ny[r][k] = 'B';                               // tar fyr
            } else {
                ny[r][k] = c;                                 // uendret
            }
        }
    }
    return ny;                                                // skriv til NY
}
// i løkken: skog = nesteSteg(skog, 0.6, rnd);
```

**Conway's Game of Life** følger samme mønster med andre regler: en levende celle med 2 eller 3 levende naboer overlever, en død celle med nøyaktig 3 blir levende, alle andre dør eller forblir døde.

?? Hvorfor bruker vi et nytt rutenett `ny` i stedet for å endre `skog` direkte?
( ) Fordi Java ikke lar oss endre arrays
(x) Fordi alle celler skal bestemmes ut fra den gamle tilstanden, ellers sprer endringer seg for fort i samme runde
( ) For å spare minne
( ) Fordi `Random` krever det
=> Hvert tidssteg skal være et «øyeblikksbilde». Leser du fra det gamle og skriver til det nye, behandles alle cellene likt.
===
## Tilfeldighet og en god eksamensstrategi

**Tilfeldighet** med `Random`:

```java
import java.util.Random;
Random rnd = new Random();
int terning = rnd.nextInt(6) + 1;     // 1–6 (nextInt(6) gir 0–5)
double t = rnd.nextDouble();          // 0.0 til (men ikke med) 1.0
if (rnd.nextDouble() < 0.3) {
    // skjer med 30 % sannsynlighet
}
int retning = rnd.nextInt(3) - 1;     // -1, 0 eller 1
```

`new Random(42)` (med et fast **frø**) gir samme «tilfeldige» tall hver gang – nyttig for testing.

**Test en simulering** med ekstreme verdier der du vet svaret: sannsynlighet `0.0` (ingenting skal skje) og `1.0` (alt skal skje), på et lite rutenett. Sjekk hjørner og kanter.

**Modellens begrensninger:** En modell er alltid en forenkling. I en eksamensbesvarelse bør du si noe om hva den ikke tar med (vind i skogbrann, at folk endrer atferd ved smitte) og hvordan det påvirker resultatet.

> EKSAMEN: **Lever en fungerende del-løsning** heller enn en uferdig helhet. Bygg trinnvis og test etter hvert trinn: 1) tilstand og utskrift av brettet, 2) én figur som kan flytte seg, 3) kollisjon/regler, 4) løkke og avslutning, 5) ekstrafunksjoner. Skriv kort hvordan du testet hvert trinn.

?? Hvilket uttrykk gir et tilfeldig heltall fra 1 til og med 6?
( ) `rnd.nextInt(6)`
(x) `rnd.nextInt(6) + 1`
( ) `rnd.nextInt(7)`
( ) `rnd.nextDouble() * 6`
=> `nextInt(6)` gir 0–5. Legger du til 1, får du 1–6. `nextInt(7)` ville gitt 0–6.
