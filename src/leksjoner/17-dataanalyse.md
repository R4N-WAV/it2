id: l-dataanalyse
tittel: Analysere og presentere data
tema: data
dag: 6
minutter: 15
mal: gruppere med HashMap, regne snitt, median, andel, prosentvis endring og prosentpoeng, velge riktig diagram og tolke kritisk.
===
## Gruppering: én verdi per kategori

Spørsmål som «antall per fylke» eller «sum per år» løses med **HashMap** – kategorien er nøkkelen:

```java
HashMap<String, Integer> elPerRegion = new HashMap<>();

for (int i = 1; i < linjer.size(); i++) {
    String[] f = linjer.get(i).split(",");
    String region = f[1].trim();
    int el = Integer.parseInt(f[3].trim());
    elPerRegion.put(region, elPerRegion.getOrDefault(region, 0) + el);
}

for (String r : elPerRegion.keySet()) {
    System.out.println(r + ": " + elPerRegion.get(r));
}
```

For **gjennomsnitt per kategori** trenger du to kart – sum og antall – og deler etterpå:

```java
double snitt = (double) sum.get(r) / antall.get(r);
```

**Sortere** resultatet (størst først):

```java
ArrayList<String> regioner = new ArrayList<>(elPerRegion.keySet());
regioner.sort((a, b) -> elPerRegion.get(b) - elPerRegion.get(a));
```

`(a, b) -> …` er en kort funksjon som sier hvordan to elementer sammenlignes. `b - a` gir synkende rekkefølge.

**Pen tabell** med `printf`: `%-10s` = tekst venstrejustert i 10 tegn, `%8d` = heltall i 8 tegn, `%.1f` = desimaltall med én desimal, `%n` = linjeskift.

```java
System.out.printf("%-10s %8d%n", r, elPerRegion.get(r));
```

?? Hva gjør `kart.getOrDefault(k, 0) + 1` i en gruppering?
( ) Sletter nøkkelen
(x) Henter nåværende antall for kategorien (0 hvis den er ny) og legger til 1
( ) Setter alle verdier til 1
( ) Sorterer kartet
=> Første gang en kategori dukker opp, finnes den ikke – da brukes 0. Ellers hentes eksisterende verdi.
===
## Snitt, median og spredning

- **Gjennomsnitt** = summen delt på antallet. Påvirkes mye av ekstreme verdier.
- **Median** = midterste verdi når de er sortert (snitt av de to midterste ved partall antall). Påvirkes lite av ekstreme verdier.
- **Typetall** = verdien som forekommer oftest.
- **Variasjonsbredde** = største − minste.

> EKSEMPEL: Lønninger 30, 32, 35, 38 og 400 (tusen). Snitt = 107. Median = 35. Medianen beskriver «en vanlig person» mye bedre – den ene høye lønna drar snittet opp. En **uteligger** er en verdi som skiller seg kraftig fra resten: sjekk om den er en feil eller ekte.

```java
Arrays.sort(t);
double median = (t.length % 2 == 1)
    ? t[t.length / 2]
    : (t[t.length / 2 - 1] + t[t.length / 2]) / 2.0;
```

?? Verdiene er 2, 3, 3, 4 og 50. Hvilket mål beskriver «det typiske» best?
( ) Gjennomsnittet (12,4)
(x) Medianen (3)
( ) Største verdi (50)
( ) Variasjonsbredden (48)
=> 50 er en uteligger som drar snittet langt opp. Medianen 3 ligger der de fleste verdiene er.
===
## Prosent, prosentpoeng og endring

**Andel i prosent** = del / helhet · 100

```java
double andel = (double) elbiler / totalt * 100;   // husk (double)!
```

**Prosentvis endring** = (ny − gammel) / gammel · 100

> EKSEMPEL: Elbiler i Oslo økte fra 105 000 til 120 000. Endring = (120 000 − 105 000) / 105 000 · 100 ≈ **14,3 %**.

**Prosentpoeng** brukes når du sammenligner to *prosenttall*:

> EKSEMPEL: Elbilandelen økte fra 35 % til 40 %. Det er en økning på **5 prosentpoeng** – men en økning på (40 − 35) / 35 · 100 ≈ **14,3 prosent**.

Begge er riktige, men betyr forskjellige ting. Å blande dem er en klassisk feil.

?? Arbeidsledigheten går fra 4 % til 5 %. Hva er riktig?
( ) Den økte med 1 prosent
(x) Den økte med 1 prosentpoeng (som er 25 prosent)
( ) Den økte med 25 prosentpoeng
( ) Den økte med 5 prosent
=> Differansen mellom to prosenttall er prosentpoeng: 5 − 4 = 1. Den relative økningen er 1/4 = 25 %.
===
## Velg riktig diagram

| Du vil vise … | Diagram |
|---|---|
| sammenligning mellom kategorier (fylker, merker) | **stolpediagram** |
| utvikling over tid (år, måneder) | **linjediagram** |
| deler av en helhet (andeler som summerer til 100 %) – få kategorier | **sektordiagram** (kake) |
| sammenheng mellom to tallvariabler | **punktdiagram** |
| fordeling av mange verdier | **histogram** |

Et godt diagram har **tittel**, **aksetitler med enhet**, y-akse som starter på 0 for stolper (ellers overdrives forskjeller), og ikke for mange kategorier i én kake.

> EKSAMEN: Du blir ofte bedt om å «presentere» og «begrunne valg av diagram». Skriv f.eks.: «Jeg valgte stolpediagram fordi jeg sammenligner regioner, som er kategorier uten naturlig rekkefølge. For utviklingen i Oslo 2015–2025 passer linjediagram fordi det viser trend over tid.» Kan du ikke lage diagrammet i kode, lag en tydelig tabell og beskriv diagrammet.

?? Du skal vise hvordan antall elbiler i Norge har endret seg hvert år fra 2010 til 2025. Hvilket diagram?
( ) Sektordiagram
(x) Linjediagram
( ) Punktdiagram
( ) Histogram
=> Utvikling over tid → linjediagram. Linjen viser trenden tydelig.
===
## Tolk data kritisk

En god analyse stopper ikke ved tallene. Spør:

- **Kilde:** Hvem har samlet inn dataene, og hvorfor? Er kilden pålitelig (f.eks. SSB)?
- **Utvalg:** Er dataene representative? En spørreundersøkelse på Instagram sier lite om eldre.
- **Korrelasjon er ikke årsak:** Is-salg og drukningsulykker øker samtidig – begge skyldes sommer, ikke hverandre.
- **Manglende data:** Hva ble utelatt, og kan det skjeve resultatet?
- **Absolutte tall vs. andeler:** Oslo har flest elbiler – men også flest biler. Andel kan gi et annet bilde.
- **Feilkilder:** skrivefeil, endrede definisjoner over tid, avrunding.

**Slik skriver du en konklusjon:**
1. Hva viser dataene? (konkrete tall)
2. Hvordan tolker du det?
3. Hvilke forbehold må tas?

> EKSEMPEL: «Oslo har høyest elbilandel i 2025 (40 %), mot 28 % i Vestland. Det kan henge sammen med bedre ladeinfrastruktur og kortere avstander. Datasettet har bare tre regioner og to år, så vi kan ikke si noe sikkert om resten av landet eller om årsakene.»

?? Et datasett viser at elever som spiser frokost får bedre karakterer. Hva kan du konkludere?
( ) Frokost gir bedre karakterer
(x) Det er en sammenheng, men den beviser ikke årsak – andre faktorer kan forklare begge
( ) Karakterer gjør at elever spiser frokost
( ) Dataene er feil
=> Korrelasjon ≠ kausalitet. F.eks. kan faste rutiner hjemme påvirke både frokost og skolearbeid.
