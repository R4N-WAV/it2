id: l-arv
tittel: Arv, super og polymorfi
tema: oop-arv
dag: 4
minutter: 16
mal: lage en subklasse med extends og super(...), overstyre metoder, og forklare polymorfi med et eksempel.
===
## Arv: «er en»

Mange klasser har mye felles. En `Bil` og en `Sykkel` har begge en produsent og en makshastighet. I stedet for å skrive det samme to ganger, lager vi en **superklasse** `Kjoretoy` med det felles, og lar `Bil` og `Sykkel` **arve** fra den.

```tekst
        Kjoretoy            ← superklasse (forelder, generell)
        ▲       ▲
        |       |
      Bil     Sykkel        ← subklasser (barn, spesialiserte)
```

Testen for arv er setningen **«X er en Y»**:
- En bil *er et* kjøretøy ✓ → arv passer.
- En elbil *er en* bil ✓ → arv passer.
- En bil *er en* motor ✗ → arv passer **ikke** (en bil *har en* motor).

Subklassen får **alle feltene og metodene** til superklassen, og kan legge til egne – og endre de den arver.

> HUSK: Arv gir **gjenbruk** (felles kode skrives én gang) og **generalisering** (det felles samles i en mer generell klasse). Begge ordene er gode å bruke i forklaringer.

?? Hvilket par passer best for arv?
( ) Skole og Elev
(x) Hund og Dyr
( ) Bil og Hjul
( ) Bibliotek og Bok
=> «En hund er et dyr» gir mening. En skole *har* elever, en bil *har* hjul, og et bibliotek *har* bøker – det er «har en»-forhold, ikke arv.
===
## extends og super

```java
public class Kjoretoy {
    protected String produsent;
    protected int makshastighet;

    public Kjoretoy(String produsent, int makshastighet) {
        this.produsent = produsent;
        this.makshastighet = makshastighet;
    }

    public String beskrivelse() {
        return produsent + ", maks " + makshastighet + " km/t";
    }
}

public class Elbil extends Kjoretoy {
    private int batteriKWh;           // eget felt bare for elbiler

    public Elbil(String produsent, int makshastighet, int batteriKWh) {
        super(produsent, makshastighet);   // kaller Kjoretoy sin konstruktør
        this.batteriKWh = batteriKWh;
    }

    public int rekkevidde() {               // egen metode
        return batteriKWh * 6;
    }
}
```

- `extends Kjoretoy` = «arver fra Kjoretoy».
- `super(...)` kaller **superklassens konstruktør** slik at de arvede feltene får verdier. Den **må stå først** i konstruktøren.
- `protected` gjør at subklassen kan bruke feltene direkte, men andre klasser ikke kan.

```java
Elbil e = new Elbil("Tesla", 200, 75);
System.out.println(e.beskrivelse());   // arvet metode: Tesla, maks 200 km/t
System.out.println(e.rekkevidde());    // egen metode: 450
```

> FEIL: Glemmer du `super(...)` når superklassen bare har en konstruktør med parametere, får du kompileringsfeil. Og `super(...)` kan ikke stå etter andre linjer.

?? Hvor i `Elbil`-konstruktøren må `super(produsent, makshastighet);` stå?
(x) Som første linje
( ) Som siste linje
( ) Hvor som helst
( ) I en egen metode
=> Superklassens del av objektet må bygges før subklassen legger til sitt. Derfor krever Java at `super(...)` er første setning.
===
## Overstyring (@Override)

En subklasse kan gi sin egen versjon av en metode den arver. Det kalles **overstyring** (override):

```java
public class Elbil extends Kjoretoy {
    // …
    @Override
    public String beskrivelse() {
        return super.beskrivelse() + ", batteri " + batteriKWh + " kWh";
    }
}
```

- Samme navn, samme parametere og samme returtype som i superklassen.
- `@Override` er en merkelapp som ber Java sjekke at du faktisk overstyrer noe (fanger skrivefeil).
- `super.beskrivelse()` kaller superklassens versjon – nyttig når du vil *utvide* i stedet for å skrive alt på nytt.

```java
Kjoretoy k = new Kjoretoy("DBS", 40);
Elbil e = new Elbil("Tesla", 200, 75);
System.out.println(k.beskrivelse());  // DBS, maks 40 km/t
System.out.println(e.beskrivelse());  // Tesla, maks 200 km/t, batteri 75 kWh
```

?? Hva gjør `super.beskrivelse()` inne i `Elbil` sin `beskrivelse()`?
( ) Kaller `Elbil` sin egen `beskrivelse()` på nytt
(x) Kaller `Kjoretoy` sin versjon av `beskrivelse()`
( ) Lager et nytt Kjoretoy-objekt
( ) Gir en feil
=> `super.` peker på superklassen. Slik gjenbruker du superklassens tekst og legger til det som er spesielt for elbilen.
===
## Polymorfi: samme kall, ulik oppførsel

**Polymorfi** («mange former») betyr at **samme metodekall** gir **ulik oppførsel** avhengig av hvilken type objektet faktisk er.

```java
public class Dyr {
    public String lyd() { return "..."; }
}
public class Hund extends Dyr {
    @Override public String lyd() { return "Voff"; }
}
public class Katt extends Dyr {
    @Override public String lyd() { return "Mjau"; }
}

ArrayList<Dyr> dyr = new ArrayList<>();
dyr.add(new Hund());
dyr.add(new Katt());
dyr.add(new Hund());

for (Dyr d : dyr) {
    System.out.println(d.lyd());
}
```

```tekst
Voff
Mjau
Voff
```

Listen har typen `Dyr`, men Java kaller riktig `lyd()` for hvert objekt. Fordelen: løkken trenger ingen `if (d er en hund) … else if (d er en katt)`. Lager du en ny `Ku`-klasse senere, virker løkken uten endringer.

**Abstrakte klasser:** Skal det aldri finnes et «bare dyr», kan du skrive `public abstract class Dyr` og `public abstract String lyd();` (uten kropp). Da *må* alle subklasser lage sin egen `lyd()`, og du kan ikke skrive `new Dyr()`.

> EKSAMEN: Forklar polymorfi med et eksempel: «En liste av typen Dyr kan inneholde hunder og katter. Når jeg kaller `lyd()` på hvert element, brukes riktig versjon for hver type. Da slipper jeg if-tester, og nye dyretyper kan legges til uten å endre løkken.»

?? Hvorfor er polymorfi nyttig i løkken over?
( ) Den gjør at alle dyrene sier det samme
(x) Samme kode (`d.lyd()`) virker for alle dyretyper, også nye, uten if-tester
( ) Den gjør programmet raskere
( ) Den hindrer at man kan lage nye dyr
=> Hvert objekt «vet selv» hvilken lyd det lager. Koden som bruker dem blir enkel og lett å utvide.
