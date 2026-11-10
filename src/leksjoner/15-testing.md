id: l-testing
tittel: Feilsøking, testing og testplan
tema: feilsoking
dag: 4
minutter: 12
mal: skille de tre feiltypene, feilsøke systematisk, velge gode testtilfeller med grenseverdier og sette opp en testplan.
===
## Tre typer feil

| Feiltype | Når | Eksempel | Hvordan du finner den |
|---|---|---|---|
| **Syntaksfeil** | før kjøring (kompilering) | glemt `;`, feil stavet `Sytem`, manglende `}` | editoren streker under, kompileringsfeil |
| **Kjøretidsfeil** | mens programmet kjører – det krasjer | indeks utenfor listen, dele heltall på 0, `parseInt("abc")` | feilmelding (exception) med linjenummer |
| **Logisk feil** | programmet kjører, men svaret er **feil** | `<` i stedet for `<=`, int-divisjon, feil startverdi | **bare testing** avslører den |

Logiske feil er de farligste – ingen feilmelding forteller deg om dem.

```java
// Logisk feil: snittet blir feil – hvorfor?
int sum = 7 + 8;
double snitt = sum / 2;    // 7.0, ikke 7.5 (int-divisjon)
```

?? Programmet kjører uten feilmelding, men gjennomsnittet blir 7.0 i stedet for 7.5. Hvilken feiltype?
( ) Syntaksfeil
( ) Kjøretidsfeil
(x) Logisk feil
( ) Ingen feil
=> Programmet kjører og gir et svar – men svaret er galt. Det er en logisk feil (her: heltallsdivisjon).
===
## Feilsøk systematisk

Ikke endre tilfeldige ting og håpe. Gjør dette:

1. **Gjenskap feilen** – hvilken input gir feil svar?
2. **Les feilmeldingen** – den sier hvilken type feil og **hvilken linje**. Start der.
3. **Spor** – skriv ut variabler underveis (`System.out.println("i=" + i + " sum=" + sum);`) eller bruk *debuggeren* i editoren (sett et stoppunkt og gå linje for linje).
4. **Avgrens** – test små deler hver for seg (én metode om gangen).
5. **Rett én ting om gangen**, og test på nytt.

**Unntakshåndtering** – fang kjøretidsfeil i stedet for å krasje:

```java
try {
    int alder = Integer.parseInt(tekst);
    System.out.println("Alder: " + alder);
} catch (NumberFormatException e) {
    System.out.println("Skriv et tall, ikke bokstaver.");
}
```

`try` prøver koden. Skjer det en feil av typen i `catch`, hopper programmet dit i stedet for å krasje. Nyttig ved brukerinput og innlesing av filer.

> TIPS: På eksamen kan du skrive «Jeg feilsøkte ved å skrive ut verdiene av i og sum i hver runde, og så at sum ble nullstilt inne i løkken.» Det viser en *strategi* (KM6).

?? Programmet krasjer med `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`. Hva er mest sannsynlig feil?
( ) Et manglende semikolon
(x) En løkke bruker `<=` i stedet for `<` mot `length`
( ) Heltallsdivisjon
( ) Feil navn på klassen
=> Lengde 5 betyr indeks 0–4. Indeks 5 nås typisk når løkken går til og med `length` (`<=`).
===
## Gode testtilfeller

En **test** er en input der du vet hvilket svar som er riktig, sånn at du kan sammenligne. Test tre typer:

1. **Normaltilfeller** – vanlige, gyldige verdier.
2. **Grenseverdier** – rett på, rett under og rett over grensene. Her skjuler `<`/`<=`-feil seg.
3. **Ugyldige/spesielle verdier** – negativt tall, tom liste, tom tekst, bokstaver der det skal være tall, manglende verdi i fil.

Eksempel: *billettpris – under 16 år eller 67+ betaler 50 kr, ellers 100 kr.*

| Test | Input | Forventet | Hvorfor |
|---|---|---|---|
| normal | 30 | 100 | vanlig voksen |
| grense | 15 | 50 | siste barnealder |
| grense | 16 | 100 | første voksenalder |
| grense | 66 | 100 | siste før honnør |
| grense | 67 | 50 | første honnøralder |
| ugyldig | -5 | feilmelding | negativ alder |
| ugyldig | "abc" | feilmelding | ikke et tall |

**Svartboks- og hvitbokstesting:**
- *Svartboks:* du tester ut fra **kravene** uten å se på koden (tabellen over).
- *Hvitboks:* du ser på **koden** og sørger for at hver gren (hver `if`/`else`) blir kjørt minst én gang.

?? Regelen er «rabatt hvis du kjøper **minst** 10 varer». Hvilke verdier er de viktigste grenseverdiene å teste?
( ) 0 og 100
(x) 9 og 10
( ) 5 og 15
( ) 1 og 2
=> Grensen går mellom 9 (ingen rabatt) og 10 (rabatt). Feil `>` i stedet for `>=` avsløres bare av akkurat 10.
===
## Testplan og testnivåer

En **testplan** er en tabell du lager *før* (eller mens) du koder:

| Nr | Hva testes | Input | Forventet resultat | Faktisk resultat | OK? |
|---|---|---|---|---|---|
| 1 | snitt av vanlig liste | [2, 4, 6] | 4.0 | 4.0 | ✓ |
| 2 | ett element | [5] | 5.0 | 5.0 | ✓ |
| 3 | tom liste | [] | melding «ingen data» | krasj (deling på 0) | ✗ → rettet |

Den viser at du har testet *planlagt*, og hva du fant.

**Testnivåer:**
- **Enhetstest** – én metode eller klasse alene.
- **Integrasjonstest** – at delene virker sammen.
- **Systemtest** – hele programmet mot kravene.
- **Brukertest / akseptansetest** – ekte brukere prøver løsningen.

**Kodekvalitet** som gjør feil sjeldnere: beskrivende navn, korte metoder som gjør én ting, ingen kopiert kode (bruk metoder), konsekvent innrykk, kommentarer der logikken ikke er åpenbar.

> EKSAMEN: «Lag en testplan» → en tabell med kolonnene over, med **minst** ett normaltilfelle, to grenseverdier og ett ugyldig tilfelle. Fyll ut «forventet» før du kjører.

?? Hva er kolonnen «forventet resultat» i en testplan?
( ) Det programmet faktisk skrev ut
(x) Det riktige svaret, bestemt ut fra kravene før du kjører testen
( ) Hvor lang tid testen tok
( ) Hvem som testet
=> Du bestemmer det riktige svaret på forhånd. Så sammenligner du med det faktiske resultatet – avvik betyr feil.
