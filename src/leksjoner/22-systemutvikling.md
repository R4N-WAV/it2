id: l-systemutvikling
tittel: Systemutvikling og samarbeid
tema: systemutvikling
dag: 8
minutter: 12
mal: forklare faser i systemutvikling, sammenligne fossefall og smidig, og forklare Scrum, prototyping og Git – og velge metode for et case (KM9).
===
## Fra problem til løsning

All systemutvikling går gjennom de samme aktivitetene – spørsmålet er bare i hvilken rekkefølge og hvor ofte:

1. **Behovsanalyse / krav** – hvem er brukerne, og hva trenger de?
2. **Design** – hvordan skal løsningen se ut og være bygget (skisser, klassediagram)?
3. **Implementering** – skrive koden.
4. **Testing** – virker det, og løser det behovet?
5. **Innføring / drift** – ta løsningen i bruk.
6. **Vedlikehold** – rette feil og forbedre.

**Krav** deles i:
- **Funksjonelle krav** – hva systemet skal *gjøre*: «Brukeren skal kunne booke en time.»
- **Ikke-funksjonelle krav** – *hvor godt*: «Siden skal laste på under 2 sekunder», «skal fungere med skjermleser», «data skal krypteres».

En **brukerhistorie** beskriver et krav fra brukerens side: *«Som elev vil jeg se timeplanen på mobilen, slik at jeg vet hvor jeg skal.»*

?? «Appen skal kunne brukes med skjermleser.» Hva slags krav er dette?
( ) Funksjonelt krav
(x) Ikke-funksjonelt krav
( ) Brukerhistorie
( ) Testplan
=> Det beskriver en kvalitet (tilgjengelighet) ved systemet, ikke en bestemt funksjon brukeren utfører.
===
## Fossefall vs. smidig

**Fossefallsmodellen:** fasene tas **én gang, i rekkefølge**, som vann som renner nedover trapper. Ferdig med krav før design, ferdig med design før koding.

- Fordeler: tydelig plan, god dokumentasjon, passer når kravene er **kjente og stabile** (f.eks. sikkerhetskritiske systemer, kontrakter med fast pris).
- Ulemper: brukeren ser løsningen først helt til slutt. Endringer sent er dyre. Feil i kravene oppdages for sent.

**Smidig (agil) / iterativ utvikling:** lag en liten, fungerende versjon, vis den til brukerne, få tilbakemelding, forbedre – og gjenta i korte runder (**iterasjoner**).

- Fordeler: tidlig og hyppig tilbakemelding, tåler endrede krav, brukeren får noe som virker tidlig.
- Ulemper: vanskeligere å vite totalpris og sluttdato, krever tett samarbeid med brukerne.

| | Fossefall | Smidig |
|---|---|---|
| Rekkefølge | alt én gang, lineært | korte runder som gjentas |
| Endringer | dyrt og vanskelig | forventet og velkomment |
| Brukerkontakt | i starten og slutten | hele tiden |
| Passer når | kravene er klare og stabile | kravene er uklare eller endrer seg |

?? En skole vil lage en ny app, men er usikker på hva elevene egentlig ønsker. Hvilken metode passer best?
( ) Fossefall
(x) Smidig, med prototyper og hyppig testing med elever
( ) Ingen metode
( ) Skrive all koden først og spørre elevene til slutt
=> Uklare krav er nettopp der smidig utvikling er sterkest: man lærer underveis hva brukerne trenger.
===
## Scrum og prototyping

**Scrum** er en populær smidig metode:

- **Sprint:** en fast periode (ofte 1–4 uker) der teamet lager en fungerende del.
- **Produktkø (product backlog):** prioritert liste over alt som skal lages.
- **Sprintplanlegging:** teamet velger hva fra køen som skal gjøres i sprinten.
- **Daglig standup:** 15 minutter: Hva gjorde jeg i går, hva gjør jeg i dag, hva hindrer meg?
- **Sprintdemo (review):** vis resultatet til brukere/oppdragsgiver.
- **Retrospektiv:** hva kan teamet gjøre bedre neste sprint?
- Roller: **produkteier** (prioriterer), **Scrum master** (fjerner hindringer), **utviklingsteamet**.

**Prototyping:** lag en enkel modell av løsningen for å teste ideer *før* du bygger alt.
- **Lav-fidelitet:** papirskisser, wireframes – raske og billige.
- **Høy-fidelitet:** klikkbar modell som ligner den ferdige løsningen.

Prototyper lar brukerne si «nei, det var ikke slik vi mente» tidlig – når det er billig å endre.

?? Hva er hovedhensikten med en sprintdemo i Scrum?
( ) Å skrive dokumentasjon
(x) Å vise det som er laget til brukere/oppdragsgiver og få tilbakemelding
( ) Å fordele lønn
( ) Å teste ytelsen
=> Demoen gir hyppig tilbakemelding fra brukerne – kjernen i smidig utvikling.
===
## Samarbeid og versjonskontroll (Git)

Når flere skriver kode sammen, trengs **versjonskontroll**. **Git** er standarden, og **GitHub** er et vanlig sted å lagre koden.

| Begrep | Betyr |
|---|---|
| **Repository (repo)** | prosjektmappen med hele historikken |
| **Commit** | et lagret øyeblikksbilde av endringene, med en melding |
| **Branch (gren)** | en egen kopi der du kan jobbe uten å påvirke hovedkoden |
| **Merge** | slå sammen en gren med hovedkoden |
| **Pull request** | be om at endringene dine blir gjennomgått og slått sammen |
| **Konflikt** | to har endret samme linje – må løses manuelt |

Fordeler: du kan gå tilbake til tidligere versjoner, se hvem som endret hva og hvorfor, og flere kan jobbe samtidig.

Andre samarbeidsverktøy: **Kanban-tavle** (Trello, GitHub Projects) med kolonnene *Å gjøre – Pågår – Ferdig*, felles dokumentasjon, og chat.

> EKSAMEN: Muntlig kan sensor spørre «Hvordan ville du utviklet dette sammen med andre?». Svar med metode (smidig/Scrum), verktøy (Git for kode, Kanban for oppgaver) og brukerinvolvering (prototyper og brukertesting) – og begrunn valgene for caset.

?? To elever jobber på samme program. Hva er den viktigste fordelen med Git?
( ) Koden blir raskere
(x) Begge kan jobbe samtidig, endringene slås sammen, og man kan gå tilbake til tidligere versjoner
( ) Man slipper å teste
( ) Git skriver koden automatisk
=> Versjonskontroll handler om historikk og trygt samarbeid – ikke om hastighet.
