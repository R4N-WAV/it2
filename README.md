# IT2 REA3050-trener

Personlig opplæringssystem for **IT2 muntlig-praktisk eksamen (REA3050)**, mandag 30. november 2026.
Studieperiode 23.–29. november. Standardoppsettet følger Oslo Privatistkontors retningslinjer (H26) –
informasjonsskrivet i Privatistportalen har alltid forrang.

**Åpne appen:** https://r4n-wav.github.io/it2/ (krever PIN-kode)

## Hva appen gjør

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
npm test         # tester: pensum, oppgavebanker, plan, vurderingsmotor
npm run build    # produksjonsbygg til dist/
```

Innhold: `src/fagstoff/` (fagstoffpakken ordrett + tilleggsstoff per kapittel) og `src/rea/data/` (oppgavebanker, plan,
kompetansemål). Logikk: `src/rea/pensum.ts` (deler opp fagstoffet), `src/rea/vurdering.ts` (rubrikk, repetisjon,
beredskap). Den tidligere REA3049-versjonen (Java) finnes i git-historikken.
