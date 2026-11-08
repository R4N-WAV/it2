# IT2 Eksamenstrener

Personlig øvingsapp for **Informasjonsteknologi 2**: REA3049 (skriftlig, Java/DIV) og REA3050 (muntlig-praktisk).
Studieperiode 9.–17. november 2026.

**Åpne appen:** https://r4n-wav.github.io/it2/ (krever PIN-kode)

## Hva appen gjør

- **I dag** viser hvor du er i planen og nøyaktig hva du skal gjøre som neste steg.
- **Studieplan** med 9 dager. Hver dag har steg i fast rekkefølge, mål for mestring, og kan tas så mange ganger du vil
  («runder») til du bekrefter at du forstår den.
- **Lær-modus for flashcards** etter Quizlet-modellen: runder på 7 kort, «hopp over», kort du bommer på kommer tilbake
  (som flervalg), og økten er ferdig først når alle kort er mestret minst én gang. Leitner-repetisjon i bakgrunnen.
- **Match**: koble begreper og forklaringer på tid, med rekord.
- **Oppgaver** (forutsi utskrift, finn feil, sorter pseudokode, skriv kode), **dagstester** med krav,
  **eksamensmodus** med tidtaker og **muntlig simulering** (forberedelse → eksaminasjon → ukjent tilleggsoppgave).
- **Fremdrift** som måler reell kunnskap per tema og per kompetansemål.

## Fremdrift og enheter

Fremdriften lagres i nettleseren (localStorage) på enheten du bruker. Den synkroniseres **ikke** automatisk mellom
enheter. Bruk *Innstillinger → Last ned fremdrift / Importer* for å flytte den.

## PIN-lås

Appen ber om en firesifret PIN-kode. Den holder tilfeldige besøkende og roboter ute, men er ikke ekte sikkerhet:
siden er statisk og koden ligger i et offentlig repo (bare en SHA-256-hash av PIN-koden er lagret).

## Utvikling

```bash
npm install
npm run dev      # utviklingsserver
npm test         # tester (innhold, Leitner, dagsforløp)
npm run build    # produksjonsbygg til dist/
```

Hver push til `main` bygges, testes og publiseres automatisk til GitHub Pages (`.github/workflows/deploy.yml`).

Innhold: `src/data/` (flashcards, oppgaver, eksamensoppgaver, studieplan, begreper).
Kode i oppgavene er Java; algoritmer også i pseudokode. Eksamensoppgavene er egne øvingsoppgaver laget etter
oppgavetypene i settene 2023–2026, ikke kopier av originalene.
