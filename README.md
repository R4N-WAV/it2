# IT2 REA3050-trener

Personlig opplæringssystem for **IT2 muntlig-praktisk eksamen (REA3050)**, mandag 30. november 2026.
**Helgesprint: bare lørdag 28. og søndag 29. november** – appen er en praktisk ferdighetstrener, ikke en les/quiz-app. Standardoppsettet følger Oslo Privatistkontors retningslinjer (H26) –
informasjonsskrivet i Privatistportalen har alltid forrang.

**Åpne appen:** https://r4n-wav.github.io/it2/ (krever PIN-kode)

## Helgesprint 28.–29. november (hovedsaken)

- **Kodelab**: ~95 praktiske oppgaver (alle oppgavene i helgepraksisfilen + egne varianter) i læringsstigen
  Se → Forutsi → Spor → Fullfør → Rett → Endre → Skriv selv → Forklar → Alternativ → Overfør, for variabler, if/else,
  løkker, lister, metoder og OOP – pluss UML, feilsøking, testing, data, alternativer og muntlig bredde (alle 11 mål).
  Moduser: Lær kode fra null, Les og forklar kode, Feilsøker, Bygg fra oppgavetekst (plan/pseudokode først),
  Alternative løsninger, Kritiske svakheter og Alle oppgaver.
- Hver oppgave: stor oppgavetekst, kodeeditor, tre hintnivåer (idé → syntaks → nesten løsning), fasit skjult til du ber
  om den, kjør koden selv og lim inn utskriften (sjekkes linje for linje), og muntlige spørsmål etter oppgaven – ett om
  gangen med egenvurdering og svarramme.
- **Streng målestokk**: grønn = løst uten hint og uten fasit, og koden er kjørt med riktig utskrift. Hint eller ikke kjørt
  = gul. Fasit sett først = rød. En ferdighet er grønn først etter to grønne varianter (minst én praktisk). «I dag» viser
  «IKKE KLAR – øv på dette nå» så lenge kode, OOP, feilsøking eller testing ikke er grønt.
- **Helgeplan**: bare 28. og 29. november med klokkeslett, avkrysning og 4-timers redningsplan. Den gamle 23.–27.-planen
  er fjernet.
- **Språk**: Java som treningsspråk (helgepraksisfilen bruker Java; ikke et eksamenskrav). Appen kan ikke kjøre Java selv –
  kjør `java Main.java` på egen maskin. Alle løsningsforslag kjøres og sjekkes mot forventet utskrift i testene
  (`src/test/java.test.ts`, hoppes over hvis Java mangler).

## Øvrige funksjoner

- **I dag – «Er jeg klar?»**: dager igjen, dagens plan og neste blokk, status per kompetansemål (bare vurderte svar
  teller – «lest» teller ikke som mestring), gjentakende feil, repetisjon som forfaller, siste simulering og en streng
  beredskapskontroll med åtte vilkår og konkret prioritering.
- **Plan**: dag-for-dag-planen 23.–29.11 fra fagstoffpakken, koblet til øktene, med 90-minutters kortversjon og
  eksamensdag-sjekkliste.
- **Les**: hele fagstoffpakken ordrett, delt i kapitler/delkapitler med innholdsfortegnelse, fordypning, kodeblokker med
  kopiknapp og UML-/flytdiagrammer. Hvert kapittel har i tillegg læringsmål, flere eksempler, gjennomarbeidet eksempel,
  praktisk demonstrasjon, muntlig modellforklaring, sensoroppfølging, oppgaver på tre nivåer med låste løsningsforslag,
  vanlige feil og huskeliste. «Forklar med egne ord» etter hvert delkapittel og kapittelkontroll til slutt.
- **Muntlig**: sensorsamtale ett spørsmål om gangen, snakketimer, begrepssjekk, hint og nytt forsøk ved svakt svar,
  eksempelsvar først etter forsøk, rubrikk 0–4 på sju dimensjoner og oppfølgingsspørsmål.
- **Verksted**: praktiske mikrooppgaver, feilsøking/kodeforståelse (noen med automatisk sjekk) og hele caser.
- **Simulator**: trekk én av 8 originale caser, 30 min forberedelse med notatark, startforklaring eller fagsamtale,
  praktisk demonstrasjon, ukjent tilleggsoppgave fra andre mål, rubrikkvurdering og neste økt fra svakhetene.
- **Oppgavebank** (87 muntlige, 31 praktiske, 21 feilsøking, 8 caser, 13 tilleggsoppgaver, 15 drøftinger) og **feillogg**.

Rubrikken er en intern treningsrubrikk, ikke Udirs sensorveiledning. Ingen app kan garantere en karakter.
Casene er originale treningsoppgaver – Oslo publiserer ikke tidligere muntlige oppgaver.

## Offline, fremdrift og synkronisering

Alt innhold ligger lokalt i appen, og en service worker gjør at den virker uten nett etter første besøk. Fremdriften
lagres i nettleseren (localStorage).

**Synk mellom enheter** (én bruker): *Innstillinger → Synkronisering*. Lag en GitHub-token med bare `gist`-tilgang og
lim den inn på hver enhet. Fremdriften lagres i en privat Gist på din konto og synkes automatisk ved oppstart, når
appen får fokus, noen sekunder etter hver endring og hvert 2. minutt. Endringer fra flere enheter (også offline)
slås sammen uten at noe overskrives (`src/rea/synk.ts`). Manuell sikkerhetskopi som JSON finnes fortsatt.

## Utvikling

```bash
npm install
npm run dev      # utviklingsserver (legg til ?dato=2026-11-25 for å simulere en dag)
npm test         # tester: pensum, oppgavebanker, helgeplan, Kodelab-mestring, og kjører alle Java-fasitene
npm run build    # produksjonsbygg til dist/
```

Innhold: `src/rea/helg/` (Kodelab: oppgaver, mestring, UI), `src/fagstoff/` (fagstoffpakken ordrett, helgebootcampen og tilleggsstoff per kapittel) og `src/rea/data/` (oppgavebanker, plan,
kompetansemål). Logikk: `src/rea/pensum.ts` (deler opp fagstoffet), `src/rea/vurdering.ts` (rubrikk, repetisjon,
beredskap). Den tidligere REA3049-versjonen (Java) finnes i git-historikken.
