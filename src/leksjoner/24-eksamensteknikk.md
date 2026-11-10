id: l-eksamensteknikk
tittel: Eksamensteknikk – skriftlig og muntlig
tema: algoritmer, etikk
dag: 9
minutter: 12
mal: forstå hva oppgaveordene krever, fordele tiden på skriftlig eksamen, og strukturere svar på muntlig-praktisk eksamen.
===
## Oppgaveordene – hva sensor ber om

| Ordet | Betyr | Slik svarer du |
|---|---|---|
| **Forklar** | få fram *hvordan* og *hvorfor* | begrep → forklaring → konkret eksempel (gjerne kode) |
| **Gjør rede for** | grundig, saklig beskrivelse, uten egen mening | dekk alle delene ryddig, bruk fagbegreper |
| **Vurder** | se fordeler og ulemper, og konkluder | kriterier → for → mot → begrunnet konklusjon |
| **Drøft** | se saken fra flere sider og vei dem mot hverandre | dilemma → interessenter → for → mot → tiltak → konklusjon |
| **Utvikle / implementer / lag** | skriv kode som virker | plan (pseudokode) → kode → test → kort forklaring |
| **Analyser datasettet** | les inn, behandle, beregn, presenter, tolk | tall + tabell/diagram + tolkning + forbehold |
| **Test** | vis at løsningen virker | testplan med normal-, grense- og ugyldige tilfeller |

> HUSK: «Forklar» krever et **eksempel**. «Vurder» og «drøft» krever en **konklusjon**. Glemmer du dem, mister du lett en karakter.

?? Oppgaven sier: «Vurder om det er lurt å bruke arv i denne løsningen.» Hva må svaret ha?
( ) Bare kode
( ) En definisjon av arv
(x) Fordeler og ulemper for akkurat denne løsningen, og en begrunnet konklusjon
( ) En liste over alle OOP-begreper
=> «Vurder» = se begge sider og konkludere. En definisjon alene svarer bare på «forklar».
===
## Skriftlig eksamen (REA3049): taktikk

**Rammer:** 5 timer på PC. Skriftlig er ofte en blanding av korte oppgaver (spor pseudokode, forklar begrep) og lengre (implementer klasser, analyser datasett, drøft).

**De første 15 minuttene:**
1. Les **hele** oppgavesettet.
2. Merk hvilke oppgaver du kan sikkert – **ta dem først** for å sikre poeng.
3. Fordel tiden omtrent etter poeng/omfang. Sett deg en tidsgrense per oppgave.

**Under eksamen:**
- **Del-løsninger gir poeng.** Får du ikke alt til, lever det som virker og skriv hva du ville gjort videre (gjerne i pseudokode eller kommentarer).
- **Test koden** underveis – kjør etter hvert trinn.
- **Forklar valgene dine** kort i kommentarer eller tekst: hvorfor arv, hvorfor HashMap, hvorfor stolpediagram.
- **Kopier ikke** kode du ikke forstår – du må kunne stå for den.
- Bruk **riktige fagbegreper**: innkapsling, polymorfi, grenseverdi, dataminimering, prosentpoeng.

**Til slutt (siste 20 min):** sjekk at alle oppgaver har *noe* svar, at koden kjører, og at filene er lagret og levert riktig.

> EKSAMEN: Ikke skriv navnet ditt i besvarelsen. Oppgi kilder hvis du bruker noe (f.eks. dokumentasjon). Sjekk hjelpemiddelreglene for din eksamen i forkant.

?? Du sitter fast på en implementeringsoppgave og har brukt mye tid. Hva er smartest?
( ) Bruke resten av eksamen på den
(x) Levere det som virker, beskrive resten i pseudokode/kommentarer, og gå videre
( ) Slette alt og hoppe over oppgaven
( ) Skrive svaret fra en annen oppgave
=> Delvise løsninger med tydelig plan gir poeng, og du redder tid til oppgaver du kan.
===
## Muntlig-praktisk eksamen (REA3050)

**Typisk format** (sjekk informasjonsskrivet ditt i Privatistportalen – det varierer mellom fylker): du **trekker en oppgave** og får **forberedelsestid** (i Oslo minst 30 minutter, med alle hjelpemidler). Selve eksaminasjonen varer **inntil 45 minutter**. Du **viser** en praktisk løsning (kode som kjører, eller tegning/forklaring på papir), **forklarer** den og svarer på **oppfølgingsspørsmål**. Du får også en **tilleggsoppgave** fra andre kompetansemål, som du ikke kjenner på forhånd. Ingen PowerPoint – det er en faglig samtale.

> TIPS: Skriv stikkord på papiret i forberedelsesrommet: hovedideen, 3–4 fagbegreper du vil bruke, hvordan du testet, og én svakhet/forbedring. Notatene kan du ta med inn.

**Strukturen som virker – vis, forklar, vurder:**
1. **Vis:** kjør programmet. Vis at det virker med et konkret eksempel.
2. **Forklar:** gå gjennom den viktigste koden. Bruk fagbegreper: «Her har jeg en klasse med private felt – det er innkapsling, slik at saldoen bare kan endres via metodene.»
3. **Vurder:** hva er bra, hva er svakt, hva ville du forbedret? «En svakhet er at jeg ikke håndterer tom fil. Jeg ville lagt til try/catch og en melding.»

**Ved oppfølgingsspørsmål du ikke kan:**
- Tenk høyt. Si hva du vet som er i nærheten.
- Knytt til et eksempel fra din egen kode.
- Det er lov å si «jeg er usikker, men jeg tror …» – det er bedre enn stillhet.

**Tilleggsoppgaven** (f.eks. personvern, brukervennlighet, systemutvikling): bruk malene fra leksjonene – begrep, eksempel, vurdering.

?? Sensor spør: «Hvorfor brukte du en ArrayList her?» Hva er det beste svaret?
( ) «Det sto i et eksempel jeg fant.»
(x) «Fordi antall elementer ikke er kjent på forhånd. En ArrayList kan vokse, mens en array har fast størrelse.»
( ) «Det er det vanligste.»
( ) «Jeg vet ikke.»
=> Et godt svar begrunner valget faglig og sammenligner med et alternativ – det viser forståelse, ikke bare at koden virker.
===
## Siste døgnet før eksamen

Du har lært mye på kort tid. Bruk siste dag til å **befeste**, ikke lære nytt:

- Repeter **kortene som forfaller** og **svakhetene** dine i appen.
- Skriv fra hukommelsen: **CSV-oppskriften**, **HashMap-tellingen**, en **klasse med konstruktør**, en **subklasse med super(...)**, **maks-mønsteret** og **drøftingsmalen**. Klarer du disse seks, har du dekket en stor del av eksamen.
- Sjekk at **Java og editor virker** på eksamens-PC-en, at du har lader, og at du vet hvor og når du skal møte.
- **Sov.** Søvn fester det du har lært. Én time ekstra søvn er verdt mer enn én time ekstra lesing.

> HUSK: Målet ditt er å **bestå**, helst med 3–4. Det krever ikke perfekte svar – det krever at du svarer på **alle** oppgavene med det du kan, bruker fagbegreper, og forklarer tankegangen din.

?? Hva er den beste bruken av kvelden før eksamen?
( ) Lære et helt nytt tema
( ) Være oppe til langt på natt og løse oppgaver
(x) Repetere de viktigste mønstrene kort, sjekke utstyret og legge seg i tide
( ) Ikke tenke på eksamen i det hele tatt
=> Repetisjon av kjente mønstre + søvn gir bedre resultat enn nytt stoff og lite søvn.
