id: l-personvern
tittel: Personvern og GDPR
tema: etikk, lagring
dag: 6
minutter: 12
mal: forklare hva personopplysninger er, de viktigste GDPR-prinsippene, behandlingsgrunnlag, samtykke og rettigheter, og bruke dem på et case.
===
## Personopplysninger

En **personopplysning** er all informasjon som kan knyttes til en person – direkte eller indirekte.

- **Direkte:** navn, fødselsnummer, bilde, e-postadresse.
- **Indirekte:** IP-adresse, posisjon, kombinasjoner («jente, 17 år, bor på Røros, spiller fiolin» kan være nok til å finne én person).

**Særlige kategorier** har ekstra sterkt vern: helse, etnisitet, religion, politisk syn, seksuell orientering, biometri (fingeravtrykk, ansikt brukt til identifisering) og fagforeningsmedlemskap.

**Anonymiserte** data kan ikke kobles tilbake til en person – da gjelder ikke GDPR. **Pseudonymiserte** data (navnet byttet ut med en kode) kan kobles tilbake med en nøkkel, og **er fortsatt personopplysninger**.

**GDPR** er EUs personvernforordning, som gjelder i Norge gjennom personopplysningsloven. **Datatilsynet** fører tilsyn.

?? Et datasett har elev-ID (kode), alder, skole og diagnose, men ikke navn. Skolen har en liste som kobler ID til navn. Er dette personopplysninger?
( ) Nei, navnet er fjernet
(x) Ja, dataene er pseudonymiserte og kan kobles tilbake – og diagnose er en særlig kategori
( ) Bare hvis det er færre enn 10 elever
( ) Nei, fordi det er en skole
=> Så lenge noen kan koble koden tilbake til personen, er det personopplysninger. Helseopplysninger har i tillegg særskilt vern.
===
## Prinsippene i GDPR

Det er sju prinsipper. De fire første er de du oftest trenger på eksamen:

1. **Lovlighet, rettferdighet og åpenhet** – ha et lovlig grunnlag, og fortell folk forståelig hva du gjør.
2. **Formålsbegrensning** – samle inn for et bestemt formål, og ikke bruk dataene til noe annet etterpå.
3. **Dataminimering** – samle inn bare det som er **nødvendig** for formålet.
4. **Riktighet** – hold dataene korrekte.
5. **Lagringsbegrensning** – slett når de ikke trengs lenger.
6. **Integritet og konfidensialitet** – sikre dataene (KIT fra forrige leksjon).
7. **Ansvarlighet** – virksomheten må kunne **vise** at den følger reglene.

**Innebygd personvern** (privacy by design): tenk personvern fra starten når du lager et system – ikke som et plaster etterpå.

> EKSEMPEL: En treningsapp ber om tilgang til kontakter, posisjon hele døgnet og fødselsdato. Formålet er å logge løpeturer. Posisjon *under turen* er nødvendig. Kontakter og døgnposisjon er det ikke → brudd på **dataminimering**.

?? En nettbutikk bruker kundenes kjøpshistorikk, samlet inn for å levere varer, til å selge profiler til forsikringsselskaper. Hvilket prinsipp brytes tydeligst?
( ) Riktighet
(x) Formålsbegrensning
( ) Lagringsbegrensning
( ) Tilgjengelighet
=> Dataene ble samlet inn for å levere varer. Å bruke dem til et helt annet formål uten nytt grunnlag bryter formålsbegrensningen.
===
## Behandlingsgrunnlag og samtykke

All behandling av personopplysninger trenger et **behandlingsgrunnlag** – en lovlig grunn. De vanligste:

- **Samtykke** – personen har sagt ja.
- **Avtale** – nødvendig for å oppfylle en avtale (adressen din for å sende pakken).
- **Rettslig plikt** – loven krever det (regnskap, skattemelding).
- **Allmennhetens interesse / offentlig myndighet** – f.eks. skolen fører fravær.
- **Vitale interesser** – redde liv.
- **Berettiget interesse** – en avveining der virksomhetens behov veies mot personens personvern.

Et gyldig **samtykke** må være:
- **frivillig** – du kan si nei uten ulempe,
- **spesifikt** – for ett bestemt formål,
- **informert** – du vet hva du sier ja til,
- **utvetydig** – en aktiv handling (ikke et ferdig avkrysset felt),
- og kan **trekkes tilbake** like lett som det ble gitt.

> FEIL: Samtykke er ikke alltid riktig grunnlag. Når det er et **maktforhold** (arbeidsgiver–ansatt, skole–elev), er det vanskelig å si nei – da er samtykket ikke reelt frivillig.

?? En skole sier at elever «samtykker» til overvåking av skolens PC-er, ellers får de ikke levere prøver. Hvorfor er dette et dårlig samtykke?
( ) Fordi samtykke aldri er lov i skolen
(x) Fordi det ikke er frivillig – elevene får en ulempe hvis de sier nei
( ) Fordi det må være skriftlig
( ) Fordi elever ikke har personvern
=> Et samtykke man ikke reelt kan avslå, er ikke frivillig. Skolen må i så fall ha et annet grunnlag – og vurdere om tiltaket er nødvendig og forholdsmessig.
===
## Rettigheter og bruk på et case

Den som registreres har blant annet rett til:
- **informasjon** om hva som samles inn og hvorfor,
- **innsyn** – se hva som er lagret,
- **retting** av feil,
- **sletting** i visse tilfeller («retten til å bli glemt»),
- **dataportabilitet** – få med seg dataene sine,
- **å protestere**, og **klage** til Datatilsynet.

Ved høy risiko (f.eks. helsedata i stor skala, overvåking) må virksomheten gjøre en **personvernkonsekvensvurdering (DPIA)** før de starter.

**Slik bruker du det på et case** – spør:
1. Hvilke personopplysninger samles inn? Er noen særlige kategorier?
2. Hva er formålet, og er alt **nødvendig** (dataminimering)?
3. Hvilket **behandlingsgrunnlag**? Er et eventuelt samtykke gyldig?
4. Hvem får **tilgang**, og hvor lenge **lagres** det?
5. Hvordan **sikres** dataene (KIT)?
6. Hvordan ivaretas **rettighetene** (innsyn, sletting)?

> EKSAMEN: Personvern og etikk går hånd i hånd. I en drøfting om f.eks. velferdsteknologi gir det tunge poeng å bruke ord som *dataminimering*, *formålsbegrensning*, *informert samtykke* og *særlige kategorier (helse)* – konkret knyttet til caset.

?? En app for skolen vil lagre elevenes posisjon hele døgnet «i tilfelle det blir nyttig senere». Hva er det beste første forbedringsforslaget?
( ) Kryptere posisjonsdataene
(x) Bare samle posisjon når det faktisk trengs for et tydelig formål – eller ikke i det hele tatt
( ) Be om samtykke i brukervilkårene
( ) Lagre dataene i en annen database
=> Det beste tiltaket er å ikke samle inn unødvendige data (dataminimering og formålsbegrensning). Sikring kommer i tillegg, ikke i stedet.
