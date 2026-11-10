id: l-flytskjema
tittel: Flytskjema
tema: algoritmer
dag: 2
minutter: 8
mal: kjenne symbolene i et flytskjema, følge et flytskjema med konkrete verdier, og oversette det til pseudokode.
===
## Symbolene

Et **flytskjema** viser en algoritme som en tegning. Du må kunne fem symboler:

| Symbol | Form | Brukes til |
|---|---|---|
| Start/slutt | avrundet rektangel (oval) | der algoritmen starter og stopper |
| Prosess | rektangel | en handling: `sum ← sum + x` |
| Valg | rombe (diamant) | et ja/nei-spørsmål: `alder < 16?` |
| Input/output | parallellogram (skjevt rektangel) | `LES alder`, `SKRIV pris` |
| Pil | pil | hvilken vei du går videre |

En **rombe** har alltid to utganger: **Ja** og **Nei**. En **løkke** ser du når en pil går **tilbake** til et tidligere punkt.

```tekst
   ( Start )
       |
  /LES alder/
       |
  < alder < 16? > --Ja--> [pris ← 50] --+
       | Nei                            |
  [pris ← 100]                          |
       |  <-----------------------------+
  /SKRIV pris/
       |
   ( Slutt )
```

> EKSAMEN: Flytskjema var med i 4 av 7 eksamenssett. Du kan få et skjema og bli bedt om å forklare det, finne utskriften, eller tegne et skjema til en algoritme.

?? Hvilket symbol brukes for spørsmålet «Er tallet et partall?»
( ) Rektangel
(x) Rombe
( ) Parallellogram
( ) Oval
=> Spørsmål med ja/nei-svar er valg – de tegnes som rombe med to utganger.
===
## Fra flytskjema til pseudokode – og tilbake

Et flytskjema med en løkke:

```tekst
( Start ) → [i ← 1] → < i <= 5? > --Nei--> ( Slutt )
                         | Ja
                     /SKRIV i/
                         |
                     [i ← i + 1]
                         |
              (pil tilbake til < i <= 5? >)
```

Pila som går **tilbake** til rombe-spørsmålet er løkken. Spørsmålet sjekkes **før** hver runde – akkurat som en `MENS`:

```pseudo
i ← 1
MENS i <= 5
    SKRIV i
    i ← i + 1
```

Oversettingsregler:
- Rombe uten pil tilbake → `HVIS … ELLERS`.
- Rombe med pil tilbake til seg selv → `MENS`-løkke.
- Rektangel → én tilordning/handling.
- Parallellogram → `LES` / `SKRIV`.

Å tegne på PC: bruk et tegneprogram eller draw.io, eller lag det med tekst og piler som over. Det viktige er riktige symboler, tydelige Ja/Nei-merker og at pilene går riktig vei.

?? I et flytskjema går en pil fra «i ← i + 1» tilbake til romben «i <= 5?». Hva betyr det?
( ) At algoritmen har en feil
(x) At det er en løkke som gjentas så lenge `i <= 5`
( ) At algoritmen slutter
( ) At `i` leses inn fra brukeren
=> En pil tilbake til et tidligere valg = gjentakelse, altså en løkke.
===
## Følg et flytskjema med konkrete verdier

Slik løser du «Hva blir utskriften?»:

1. Sett fingeren på **Start**.
2. Gjør det som står i hver boks, og **skriv ned verdiene** i en sporingstabell.
3. Ved en rombe: regn ut svaret med verdiene du har, og følg riktig pil.
4. Fortsett til **Slutt**.

Eksempel: skjemaet leser `n`. Så: `resultat ← 1`, `MENS n > 1`: `resultat ← resultat · n`, `n ← n − 1`. Til slutt skrives `resultat`. Med `n = 4`:

| `n` | `n > 1`? | `resultat` |
|---|---|---|
| 4 | ja | 1 · 4 = 4 |
| 3 | ja | 4 · 3 = 12 |
| 2 | ja | 12 · 2 = 24 |
| 1 | nei → slutt | 24 |

Utskrift: `24`. Algoritmen regner ut **fakultet** (4! = 4 · 3 · 2 · 1).

?? Hva blir utskriften fra fakultet-skjemaet over hvis `n = 3`?
( ) 3
(x) 6
( ) 24
( ) 9
=> resultat: 1 · 3 = 3, så 3 · 2 = 6. Når n blir 1, stopper løkken.
