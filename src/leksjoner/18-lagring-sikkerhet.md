id: l-lagring
tittel: Lagring, standarder og informasjonssikkerhet
tema: lagring
dag: 6
minutter: 14
mal: gjøre rede for standarder for lagring og utveksling (filformater, tegnkoding, databaser, API) og for sikring av data (KIT, kryptering, hashing, backup) – KM10.
===
## Standarder og filformater

En **standard** er en felles, avtalt måte å gjøre noe på. Når alle lagrer tekst i UTF-8 og utveksler data som JSON, kan ulike programmer, maskiner og land forstå hverandre. Det heter **interoperabilitet**.

| Format | Brukes til | Kjennetegn |
|---|---|---|
| CSV | tabelldata | enkel tekst, flat |
| JSON | API-er, sammensatte data | nøkkel–verdi, nøstet |
| XML | eldre systemer, dokumenter | tagger `<navn>Kari</navn>`, mer «pratsom» |
| PNG / JPEG | bilder | PNG tapsfri, JPEG tapsbasert (mindre filer) |
| PDF | dokumenter | ser likt ut overalt |
| HTML | nettsider | struktur for innhold |

**Åpne standarder** (fritt tilgjengelige, som CSV, JSON, PNG) gjør at data kan leses i mange år og av mange programmer. **Lukkede/proprietære** formater kan låse deg til én leverandør.

**Strukturerte data** har fast form (tabeller, databaser). **Semistrukturerte** har noe struktur (JSON, XML). **Ustrukturerte** har ingen fast form (fritekst, bilder, video).

?? Hvorfor er det viktig at offentlige data publiseres i åpne standardformater?
( ) Fordi filene blir mindre
(x) Fordi alle kan lese og bruke dataene med ulike programmer, også i fremtiden
( ) Fordi de da ikke kan endres
( ) Fordi det er raskere å lagre
=> Åpne standarder gir interoperabilitet og hindrer at data blir «innelåst» i ett bestemt produkt.
===
## Tegnkoding og datarepresentasjon

Alt i en datamaskin er lagret som **bits** (0 og 1). 8 bits = 1 **byte**. For å lagre tekst trenger vi en avtale om hvilket tall som betyr hvilket tegn – en **tegnkoding**.

- **ASCII**: 128 tegn – engelsk alfabet, tall og tegn. Ikke æ, ø, å.
- **UTF-8** (Unicode): alle verdens tegn, inkludert æøå og emoji. **Dagens standard** – bruk den.

Leser du en fil med feil tegnkoding, ser du rare tegn: `BodÃ¸` i stedet for `Bodø`. Løsningen er å lese og lagre med samme koding (UTF-8).

**Datatyper** i lagring betyr noe: lagres postnummeret `0150` som tall, blir det `150` – nullen forsvinner. Postnummer og telefonnummer bør lagres som **tekst**, fordi du aldri regner med dem.

**Validering** – sjekk at data er gyldige før de lagres (riktig format, innenfor grenser, påkrevde felt fylt ut). Dårlige data inn = dårlige svar ut («garbage in, garbage out»).

?? Postnummeret 0150 lagres i en tallkolonne og blir 150. Hva er den beste løsningen?
( ) Legge til 0 når man skriver det ut
(x) Lagre postnummer som tekst, siden man ikke regner med det
( ) Bruke desimaltall
( ) Fjerne alle postnummer som starter med 0
=> Data som ser ut som tall, men aldri brukes i regning (postnummer, telefonnummer), skal lagres som tekst.
===
## Databaser og API – kort

En **relasjonsdatabase** lagrer data i tabeller som kan kobles sammen. Hver rad har en unik **primærnøkkel** (f.eks. `elevId`). En **fremmednøkkel** i en annen tabell peker på den, slik at tabellene kobles (en karakter-rad peker på riktig elev).

Data hentes med **SQL**:

```sql
SELECT navn, alder FROM Elev WHERE alder >= 18 ORDER BY navn;
```

Fordeler framfor filer: mange brukere samtidig, rask søking, regler som holder dataene riktige, og tilgangsstyring.

Et **API** (Application Programming Interface) er en avtalt måte programmer kan snakke sammen på. Et **web-API** sender ofte JSON over **HTTPS**: appen spør «gi meg været i Bergen», tjeneren svarer med JSON. **HTTPS** er HTTP med kryptering – ingen kan lese eller endre det som sendes underveis.

> TIPS: Du trenger ikke kunne SQL i dybden for IT2-eksamen, men du bør kunne forklare hva en database og et API er, og hvorfor de brukes.

?? Hva er hovedfordelen med et API i JSON-format?
( ) Det gjør programmet raskere å kompilere
(x) Ulike programmer kan utveksle data på en standardisert måte
( ) Det erstatter behovet for internett
( ) Det krypterer alltid alle data
=> Et API er en avtale om hvordan man spør og svarer. JSON er et standardformat begge sider forstår.
===
## Informasjonssikkerhet: KIT

Informasjonssikkerhet handler om tre mål – **KIT** (på engelsk *CIA*):

| Mål | Betyr | Trussel | Tiltak |
|---|---|---|---|
| **Konfidensialitet** | bare de som skal, får se dataene | innbrudd, lekkasje | tilgangsstyring, passord + tofaktor, kryptering |
| **Integritet** | dataene er riktige og ikke endret uten lov | manipulering, feil | hashing/kontrollsum, logging, tilgangsstyring |
| **Tilgjengelighet** | dataene er tilgjengelige når de trengs | serverkrasj, løsepengevirus, DDoS | sikkerhetskopi, reserveløsninger |

Vanlige trusler: **phishing** (falske e-poster som lurer deg til å gi fra deg passord), **skadevare/løsepengevirus**, svake eller gjenbrukte passord, og menneskelige feil.

**Autentisering** = bevise *hvem* du er (passord, BankID, tofaktor). **Autorisasjon** = hva du har *lov* til (en elev kan se egne karakterer, en lærer kan endre dem). Gi alle **minst mulig tilgang** de trenger.

?? Et løsepengevirus krypterer skolens server så ingen får hentet ut timeplanene. Hvilket KIT-mål rammes mest direkte?
( ) Konfidensialitet
( ) Integritet
(x) Tilgjengelighet
( ) Ingen av dem
=> Dataene finnes, men kan ikke brukes når de trengs. Beste forsvar: sikkerhetskopier som er lagret adskilt.
===
## Kryptering, hashing og sikkerhetskopi

**Kryptering** gjør data uleselige uten riktig nøkkel. Det kan **reverseres** av den som har nøkkelen. Brukes ved lagring av sensitive data og ved overføring (HTTPS).

**Hashing** lager et fast «fingeravtrykk» av data. Det kan **ikke reverseres**. Brukes til:
- **Passord:** systemet lagrer hashen, ikke passordet. Ved innlogging hashes det du skriver og sammenlignes. Lekker databasen, er passordene ikke lesbare. (Med **salt** – en tilfeldig verdi per bruker – blir det enda tryggere.)
- **Integritet:** endres én bit i en fil, endres hashen totalt. Da ser du at filen er tuklet med.

**Sikkerhetskopi (backup) – 3-2-1-regelen:**
- **3** kopier av dataene,
- på **2** ulike typer lagring,
- **1** kopi et annet sted (utenfor huset/offline).

Og: **test at gjenoppretting faktisk virker**.

> EKSAMEN: Når du skal «gjøre rede for sikring av data», nevn KIT, gi et konkret tiltak for hvert mål, og knytt dem til caset (f.eks. helsedata i en app: kryptert lagring, tilgangsstyring for helsepersonell, logging, daglig backup).

?? Hvorfor lagrer gode systemer en hash av passordet i stedet for selve passordet?
( ) Hashen tar mindre plass
(x) Hvis databasen lekker, kan ikke angriperen lese passordene direkte, siden hashing ikke kan reverseres
( ) Hashing gjør innloggingen raskere
( ) Det er ikke nødvendig å sjekke passordet da
=> Hashing er enveis. Systemet kan sjekke om passordet er riktig uten noen gang å lagre det i klartekst.
