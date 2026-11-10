id: l-brukervennlighet
tittel: Brukervennlighet og universell utforming
tema: systemutvikling
dag: 8
minutter: 12
mal: vurdere brukervennligheten i et program med kjente prinsipper, forklare universell utforming og WCAG, og foreslå brukertesting og forbedringer (KM8).
===
## Hva er brukervennlighet?

**Brukervennlighet** (usability) er hvor lett, effektivt og tilfredsstillende brukerne kan nå målene sine med en løsning.

Fem kjennetegn:
- **Lett å lære** – nye brukere forstår raskt.
- **Effektiv** – erfarne brukere gjør ting raskt.
- **Lett å huske** – man finner fram igjen etter en pause.
- **Få feil** – og lett å rette dem.
- **Tilfredsstillende** – behagelig å bruke.

**Brukersentrert design:** involver brukerne gjennom hele prosessen – forstå dem, lag prototyper, test med dem, forbedre.

?? En app er rask å bruke for eksperter, men nye brukere klarer ikke å finne noe. Hvilket kjennetegn er svakt?
( ) Effektivitet
(x) Lett å lære
( ) Få feil
( ) Tilfredsstillelse
=> Nye brukere sliter – appen er vanskelig å lære, selv om den er effektiv for de som allerede kan den.
===
## Prinsipper (heuristikker) for god design

Bruk disse når du skal **vurdere** et program (Jakob Nielsens heuristikker, forenklet):

1. **Synlig status** – vis hva som skjer («Lagrer…», fremdriftslinje).
2. **Snakk brukerens språk** – kjente ord, ikke teknisk sjargong.
3. **Kontroll og frihet** – angre, avbryt, gå tilbake.
4. **Konsistens** – samme ting ser lik ut og virker likt overalt.
5. **Forebygg feil** – f.eks. nedtrekksliste i stedet for fritekst, bekreftelse før sletting.
6. **Gjenkjenning fremfor hukommelse** – vis valgene, ikke la brukeren huske koder.
7. **Fleksibilitet** – snarveier for erfarne.
8. **Enkelt og ryddig** – vis det viktigste, fjern støy.
9. **Gode feilmeldinger** – si hva som er galt *og* hvordan det løses.
10. **Hjelp** – når det trengs.

> EKSEMPEL: Dårlig feilmelding: «Error 0x80041». God: «Postnummeret må ha fire siffer, f.eks. 0150.»

I et konsollprogram (tekst i terminalen) gjelder det samme: tydelige spørsmål, si hvilke svar som godtas, tål `" Ja "` og `"ja"` (`trim()` og `equalsIgnoreCase`), og gi en ny sjanse ved ugyldig input i stedet for å krasje.

?? Brukeren skriver «tolv» når programmet ber om alder, og programmet krasjer. Hvilken forbedring er best?
( ) Skrive «Error» og avslutte
(x) Fange feilen og si «Skriv alderen med tall, f.eks. 12», og spørre igjen
( ) Gjette at brukeren er 12
( ) Fjerne spørsmålet
=> God feilhåndtering forebygger krasj, forklarer hva som er galt, og lar brukeren prøve igjen.
===
## Universell utforming og WCAG

**Universell utforming** betyr at løsninger skal kunne brukes av **flest mulig**, uten spesialtilpasning – også personer med nedsatt syn, hørsel, motorikk eller kognisjon. I Norge er det **lovpålagt** for nettløsninger (likestillings- og diskrimineringsloven), og kravene bygger på **WCAG** (Web Content Accessibility Guidelines).

WCAG har fire prinsipper:

| Prinsipp | Betyr | Eksempel på tiltak |
|---|---|---|
| **Mulig å oppfatte** | innhold kan sanses på flere måter | alternativ tekst på bilder, teksting av video, god kontrast |
| **Mulig å betjene** | alt kan brukes på flere måter | alt virker med tastatur, store nok knapper, nok tid |
| **Forståelig** | innhold og betjening er forståelig | klart språk, forutsigbar navigasjon, tydelige feilmeldinger |
| **Robust** | virker med ulike hjelpemidler | riktig kode så skjermlesere forstår siden |

Ikke bruk **bare farge** for å vise noe (rød/grønn er vanskelig for fargeblinde) – bruk også tekst eller symbol.

> TIPS: Universell utforming hjelper alle: teksting hjelper på bussen uten lyd, god kontrast hjelper i sollys, enkelt språk hjelper alle som har det travelt.

?? Et skjema viser feil felt bare med rød ramme. Hvilket problem gir det, og hva er løsningen?
( ) Ingen problem – rødt er tydelig
(x) Fargeblinde og skjermleserbrukere oppfatter det ikke; legg til en tekst som forklarer feilen
( ) Rammen bør være grønn i stedet
( ) Skjemaet bør fjernes
=> Informasjon skal ikke formidles med farge alene (prinsippet «mulig å oppfatte»). En tekst-feilmelding når alle.
===
## Brukertesting

Den sikreste måten å finne ut om noe er brukervennlig, er å **teste med ekte brukere**.

Slik gjør du det:
1. Lag **konkrete oppgaver**: «Book en time på torsdag kl. 18.»
2. Finn **5–8 representative brukere** (inkludert noen med ulike behov).
3. La dem **tenke høyt** mens de løser oppgavene. Ikke hjelp dem!
4. **Observer og mål:** klarte de det? Hvor lang tid? Hvor stoppet de opp?
5. **Forbedre** løsningen, og test igjen (iterativt).

Andre metoder: spørreskjema etterpå, A/B-testing (to versjoner sammenlignes), intervju.

**Vurdere alternative design** (KM3): sammenlign to løsninger på kriterier som brukervennlighet, ytelse, vedlikehold og sikkerhet, og begrunn hvorfor du velger den ene. Det finnes sjelden én perfekt løsning – vis at du ser fordeler og ulemper.

> EKSAMEN: «Vurder brukervennligheten og foreslå forbedringer» → 1) nevn 2–3 konkrete problemer, 2) knytt hvert til et prinsipp (feilmeldinger, konsistens, universell utforming), 3) foreslå konkret forbedring, 4) foreslå hvordan det kan testes med brukere.

?? Hvorfor ber man testpersoner «tenke høyt» under en brukertest?
( ) For at testen skal gå raskere
(x) For å forstå hva brukeren tenker og forventer, og hvor og hvorfor de blir forvirret
( ) For å ta opp lyd til reklame
( ) Fordi det er lovpålagt
=> Når brukeren sier hva de tenker, ser du *hvorfor* noe er vanskelig – ikke bare *at* det er det.
