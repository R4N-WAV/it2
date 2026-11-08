import type { Exam, Flashcard, Level, TopicId } from '../types';
import { KM_FOR_TEMA } from './topics';

let n = 0;
function k(
  tema: TopicId,
  niva: Level,
  sporsmal: string,
  svar: string,
  opts: { eksempel?: string; forklaring?: string; feil?: string; eksamen?: Exam; km?: string } = {},
): Flashcard {
  n++;
  return {
    id: `fc-${tema}-${n}`,
    tema,
    km: opts.km ?? KM_FOR_TEMA[tema],
    eksamen: opts.eksamen ?? 'begge',
    niva,
    sporsmal,
    svar,
    eksempel: opts.eksempel,
    forklaring: opts.forklaring ?? '',
    vanligeFeil: opts.feil,
  };
}

/* All kode er Java (DIV-varianten). Pseudokode er språkuavhengig. */
export const flashcards: Flashcard[] = [
  /* ---------------- Grunnlag ---------------- */
  k('grunnlag', 1, 'Hvordan ser det minste kjørbare Java-programmet ut?', 'En klasse med en main-metode. Alt du vil kjøre, skrives inne i main.', {
    eksempel: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hei!");\n    }\n}',
    feil: 'Glemme semikolon ; på slutten av setninger, eller at filnavnet må være Main.java.',
  }),
  k('grunnlag', 1, 'Hva er en variabel, og hvorfor må du skrive typen i Java?', 'Et navn som lagrer en verdi. Java er statisk typet: du bestemmer typen når du lager variabelen, og den kan ikke endres.', {
    eksempel: 'int alder = 17;\nalder = alder + 1;   // nå 18\n// alder = "atten"; // FEIL: kan ikke lagre tekst i int',
  }),
  k('grunnlag', 1, 'Nevn de fem vanligste datatypene i Java.', 'int (heltall), double (desimaltall), boolean (true/false), char (ett tegn), String (tekst – stor S, er en klasse).', {
    eksempel: 'int antall = 3;\ndouble pris = 49.90;\nboolean ferdig = false;\nchar bokstav = \'A\';\nString navn = "Ola";',
  }),
  k('grunnlag', 1, 'Hva blir 7 / 2 i Java, og hvorfor?', '3. Når begge tallene er int, blir det heltallsdivisjon (desimalene kuttes). Skriv 7 / 2.0 eller (double) 7 / 2 for å få 3.5.', {
    feil: 'Regne gjennomsnitt med int / int og få feil svar. Dette er en klassisk logisk feil!',
  }),
  k('grunnlag', 1, 'Hva er forskjellen på = og == ?', '= tilordner (lagrer) en verdi. == sammenligner og gir true/false.', {
    eksempel: 'int x = 5;\nSystem.out.println(x == 5);  // true',
    feil: 'Tekst (String) sammenlignes med .equals(), ikke ==.',
  }),
  k('grunnlag', 2, 'Hvordan sammenligner du to String-er i Java?', 'Med .equals(). == sjekker om det er samme objekt i minnet, ikke om teksten er lik.', {
    eksempel: 'if (svar.equals("ja")) { ... }\nif (svar.equalsIgnoreCase("JA")) { ... } // ignorer store/små',
  }),
  k('grunnlag', 1, 'Hvordan ser if / else if / else ut i Java?', 'Betingelsen i parentes, koden i krøllparenteser {}. Bare den første sanne grenen kjøres.', {
    eksempel: 'if (poeng >= 90) {\n    System.out.println("A");\n} else if (poeng >= 50) {\n    System.out.println("Bestått");\n} else {\n    System.out.println("Ikke bestått");\n}',
  }),
  k('grunnlag', 1, 'Hva betyr &&, || og ! ?', '&& = og (begge sanne). || = eller (minst én sann). ! = ikke (snur true/false).', {
    eksempel: 'if (alder >= 18 && harBillett) { ... }',
  }),
  k('grunnlag', 1, 'Hvordan ser en vanlig for-løkke ut, og hva betyr de tre delene?', 'for (start; betingelse; endring). Start kjøres én gang, betingelsen sjekkes før hver runde, endringen etter hver runde.', {
    eksempel: 'for (int i = 0; i < 3; i++) {\n    System.out.println(i);   // 0 1 2\n}',
    feil: 'i <= 3 gir én runde for mye («off-by-one»).',
  }),
  k('grunnlag', 1, 'Når bruker du for-løkke, og når while-løkke?', 'for: når du vet antall runder / går gjennom en samling. while: når du gjentar til en betingelse blir usann.', {
    eksempel: 'while (liv > 0) {\n    liv = liv - 1;\n}',
    feil: 'while der betingelsen aldri endres → evig løkke.',
  }),
  k('grunnlag', 2, 'Hva gjør %-operatoren, og hvordan sjekker du partall?', '% gir resten ved heltallsdivisjon. tall % 2 == 0 betyr partall.', {
    eksempel: '7 % 2   // 1 (oddetall)\n10 % 3  // 1\n15 % 5  // 0 → 15 er delelig med 5',
    forklaring: 'Brukes i FizzBuzz/TrommeLom-oppgaver (V25): delelig med 3? delelig med 5?',
  }),
  k('grunnlag', 2, 'Hvordan leser du inn tekst og tall fra brukeren i Java?', 'Med Scanner. nextLine() for tekst, nextInt() for heltall.', {
    eksempel: 'import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\nSystem.out.print("Alder: ");\nint alder = sc.nextInt();',
  }),
  k('grunnlag', 2, 'Hvordan gjør du en String om til tall?', 'Integer.parseInt("17") gir int. Double.parseDouble("4.5") gir double.', {
    feil: 'Integer.parseInt("17 ") med mellomrom krasjer → bruk .trim() først.',
  }),

  /* ---------------- Samlinger ---------------- */
  k('lister', 1, 'Hva er forskjellen på en array og en ArrayList?', 'Array har fast lengde: int[] tall = new int[5]. ArrayList kan vokse og krympe: add(), remove().', {
    eksempel: 'int[] tall = {4, 8, 15};\nArrayList<String> navn = new ArrayList<>();\nnavn.add("Kari");',
  }),
  k('lister', 1, 'Hvilken indeks har første og siste element?', 'Første: 0. Siste: lengde − 1. Array: tall.length, ArrayList: liste.size().', {
    eksempel: 'tall[0]                 // første\ntall[tall.length - 1]   // siste\nliste.get(liste.size() - 1)',
    feil: 'tall[tall.length] gir ArrayIndexOutOfBoundsException.',
  }),
  k('lister', 1, 'Hvordan går du gjennom alle elementene i en liste?', 'Med for-each: for (Type x : liste). Eller vanlig for med indeks.', {
    eksempel: 'for (String n : navn) {\n    System.out.println(n);\n}',
  }),
  k('lister', 2, 'Hvorfor skriver vi ArrayList<Integer> og ikke ArrayList<int>?', 'Samlinger kan bare lagre objekter. Integer, Double og Boolean er «innpakningsklasser» for int, double og boolean.'),
  k('lister', 2, 'Hva er en HashMap?', 'En samling nøkkel → verdi-par. Du slår opp med nøkkelen. Tilsvarer en ordbok.', {
    eksempel: 'HashMap<String, Integer> poeng = new HashMap<>();\npoeng.put("Ali", 45);\nint p = poeng.get("Ali");\npoeng.getOrDefault("Ola", 0); // 0 hvis mangler',
  }),
  k('lister', 2, 'Hvordan teller du forekomster med HashMap?', 'Hent nåværende verdi (eller 0), legg til 1, og put tilbake.', {
    eksempel: 'for (String by : byer) {\n    antall.put(by, antall.getOrDefault(by, 0) + 1);\n}',
    forklaring: 'Dette er grupperingsmønsteret i nesten alle datasettoppgaver (per fylke, per region, per år).',
  }),
  k('lister', 2, 'Hvordan filtrerer du en liste?', 'Lag en ny tom liste, gå gjennom, og add det som oppfyller if-testen.', {
    eksempel: 'ArrayList<Integer> store = new ArrayList<>();\nfor (int t : tall) {\n    if (t > 10) store.add(t);\n}',
  }),
  k('lister', 2, 'Hvordan sorterer du en liste?', 'Collections.sort(liste) sorterer stigende. Collections.reverseOrder() for synkende. Objekter: liste.sort(Comparator.comparing(...)).', {
    eksempel: 'Collections.sort(tall);\ntall.sort(Collections.reverseOrder());\nelever.sort(Comparator.comparingInt(Elev::getPoeng));',
  }),

  /* ---------------- Metoder / gjenbruk ---------------- */
  k('funksjoner', 1, 'Hva er en metode, og hvorfor bruker vi dem?', 'En navngitt kodeblokk som kan gjenbrukes. Mindre gjentakelse, ryddigere kode, lettere testing (KM7: gjenbrukbar kode).', {
    eksempel: 'static int areal(int b, int h) {\n    return b * h;\n}\n// areal(3, 4) gir 12',
  }),
  k('funksjoner', 1, 'Hva betyr returtypen void?', 'At metoden ikke returnerer noen verdi – den bare gjør noe (f.eks. skriver ut eller endrer et felt).', {
    eksempel: 'void skrivUt() { System.out.println(navn); }\nint dobbel(int x) { return x * 2; }',
  }),
  k('funksjoner', 1, 'Hva er forskjellen på parameter og argument?', 'Parameter: variabelen i metodedefinisjonen (int b). Argument: verdien du sender inn ved kall (3).'),
  k('funksjoner', 1, 'Hva er forskjellen på return og System.out.println?', 'return sender verdien tilbake så den kan brukes videre. println viser den bare på skjermen.', {
    feil: 'Skrive ut i stedet for å returnere, og så ikke kunne regne med resultatet.',
  }),
  k('funksjoner', 2, 'Hva betyr static foran en metode?', 'At metoden hører til klassen, ikke et objekt – du kan kalle den uten å lage objekt (som main). Metoder i vanlige klasser er som regel ikke static.'),
  k('funksjoner', 2, 'Hva betyr det å generalisere en løsning?', 'Lage koden så den virker for mange tilfeller, f.eks. ved å bruke parametere i stedet for faste tall, eller samle felles kode i en superklasse.', {
    eksempel: '// Spesifikk: summer 1 til 10\n// Generell:\nstatic int sumTil(int n) {\n    int s = 0;\n    for (int i = 1; i <= n; i++) s += i;\n    return s;\n}',
  }),

  /* ---------------- Algoritmer / pseudokode ---------------- */
  k('algoritmer', 1, 'Hva er en algoritme?', 'En presis, endelig steg-for-steg-oppskrift som løser et problem.'),
  k('algoritmer', 1, 'Hva kjennetegner pseudokode – og hva er det IKKE?', 'Algoritmen skrevet i et enkelt, språkuavhengig halvspråk med tydelig struktur (HVIS, SÅ LENGE, FOR, innrykk). Den er IKKE kjørbar og har ingen fast syntaks.', {
    eksempel: 'sum ← 0\nFOR i FRA 1 TIL 5\n    sum ← sum + i\nSKRIV sum',
    forklaring: 'H23 oppgave 1 spurte nettopp hva som IKKE kjennetegner pseudokode.',
  }),
  k('algoritmer', 1, 'Hva betyr symbolene i et flytskjema?', 'Oval/avrundet: start/slutt. Rektangel: handling/beregning. Rombe: valg (ja/nei). Parallellogram: inn-/utdata. Piler: rekkefølge.', {
    feil: 'Bruke rektangel for et valg – valg er alltid rombe med to utganger.',
  }),
  k('algoritmer', 2, 'Hvordan ser en løkke ut i et flytskjema?', 'En rombe med en betingelse, der én pil går tilbake opp til et tidligere steg.'),
  k('algoritmer', 2, 'Hvordan sporer du (tracer) en løkke?', 'Lag en tabell med én kolonne per variabel og én rad per runde. Fyll inn verdiene etter hver runde.', {
    eksempel: 'i | sum\n1 | 1\n2 | 3\n3 | 6',
    forklaring: 'Dette er den viktigste enkeltferdigheten for pseudokodeoppgavene.',
  }),
  k('algoritmer', 2, 'Algoritme: finn største tall i en liste uten innebygde funksjoner.', 'Sett storst = første element. Gå gjennom alle; hvis tall > storst, sett storst = tall.', {
    eksempel: 'storst ← liste[0]\nFOR HVER t I liste\n    HVIS t > storst\n        storst ← t\nSKRIV storst',
  }),
  k('algoritmer', 3, 'Algoritme: finn det NEST største tallet (H23).', 'Hold to variabler: storst og nest. Hvis t > storst: nest ← storst, storst ← t. Ellers hvis t > nest (og t ≠ storst): nest ← t.'),
  k('algoritmer', 2, 'Hvordan sjekker du om et tall er et palindrom (H24)?', 'Snu tallet (eller teksten) og sammenlign med originalen. 1221 → 1221 = palindrom.', {
    eksempel: 'tekst ← tall som tekst\nsnudd ← tekst baklengs\nHVIS tekst = snudd SKRIV "palindrom"',
  }),
  k('algoritmer', 2, 'Hva er Fibonacci-tallene, og hvordan lager du dem (V24)?', 'Hvert tall er summen av de to foregående: 0, 1, 1, 2, 3, 5, 8 …', {
    eksempel: 'a ← 0, b ← 1\nGJENTA n GANGER\n    SKRIV a\n    neste ← a + b\n    a ← b\n    b ← neste',
  }),
  k('algoritmer', 3, 'Hvordan fungerer Caesar-chiffer (V25)?', 'Hver bokstav forskyves et fast antall plasser i alfabetet. Med forskyvning 3: A→D, B→E. Bruk % alfabetlengde så Z går rundt til starten.'),
  k('algoritmer', 2, 'Hva er boblesortering (H23)?', 'Gå gjennom listen gjentatte ganger og bytt nabo-par som står i feil rekkefølge. Gjenta til ingen bytter skjer.'),

  /* ---------------- OOP: klasser ---------------- */
  k('oop-klasser', 1, 'Hva er forskjellen på en klasse og et objekt?', 'Klassen er malen. Objektet er en konkret instans laget fra malen med new.', {
    eksempel: 'class Hund { ... }              // klasse\nHund fido = new Hund("Fido");   // objekt',
    forklaring: 'Klasse = kakeform, objekt = kake.',
  }),
  k('oop-klasser', 1, 'Hva er hovedformålet med en konstruktør (V26)?', 'Å gi et nytt objekt startverdier når det opprettes. Konstruktøren har samme navn som klassen og ingen returtype.', {
    eksempel: 'class Hund {\n    private String navn;\n    public Hund(String navn) {\n        this.navn = navn;\n    }\n}',
    feil: 'Skrive void foran konstruktøren – da blir det en vanlig metode.',
  }),
  k('oop-klasser', 1, 'Hva betyr this?', 'Referanse til objektet selv. this.navn = navn betyr «feltet navn i DETTE objektet får verdien til parameteren navn».'),
  k('oop-klasser', 1, 'Hva er et felt (attributt) og hva er en metode?', 'Felt: data objektet har (private int fart). Metode: noe objektet kan gjøre (public void kjor()).'),
  k('oop-klasser', 2, 'Hva er innkapsling, og hvordan gjøres det i Java?', 'Skjule feltene (private) og bare gi tilgang via metoder (get/set). Da kan objektet selv sjekke at verdiene er gyldige.', {
    eksempel: 'private int saldo;\npublic int getSaldo() { return saldo; }\npublic void settInn(int belop) {\n    if (belop > 0) saldo += belop;\n}',
  }),
  k('oop-klasser', 2, 'Hva gjør toString()?', 'Bestemmer teksten som vises når objektet skrives ut med println.', {
    eksempel: '@Override\npublic String toString() {\n    return navn + " (" + alder + " år)";\n}',
  }),
  k('oop-klasser', 2, 'Hva er abstraksjon (V25)?', 'Å skjule interne detaljer og bare vise det som trengs utad (grensesnittet). Brukeren av klassen trenger ikke vite HVORDAN metoden virker, bare HVA den gjør.'),
  k('oop-klasser', 2, 'Hva er hovedprinsippet bak objektorientert programmering (H23)?', 'Programmet modelleres som objekter som samler data (felt) og oppførsel (metoder) som hører sammen, og som samarbeider med hverandre.'),

  /* ---------------- OOP: arv ---------------- */
  k('oop-arv', 1, 'Hva er arv, og hvordan skrives det i Java?', 'En subklasse får felt og metoder fra en superklasse med extends, og kan legge til eller endre. Beskriver «er-en».', {
    eksempel: 'class Dyr { ... }\nclass Katt extends Dyr { ... }  // Katt er et Dyr',
  }),
  k('oop-arv', 1, 'Hva gjør super(...) i en konstruktør?', 'Kaller konstruktøren i superklassen. Må stå FØRST i subklassens konstruktør.', {
    eksempel: 'class Elbil extends Bil {\n    private int batteri;\n    public Elbil(String merke, int batteri) {\n        super(merke);\n        this.batteri = batteri;\n    }\n}',
    feil: 'Glemme super(merke) når superklassen bare har en konstruktør med parameter → kompileringsfeil.',
  }),
  k('oop-arv', 2, 'Hva er overstyring (overriding)?', 'Subklassen lager en metode med samme navn og parametere som i superklassen. Markeres gjerne med @Override.', {
    eksempel: 'class Hund extends Dyr {\n    @Override\n    public String lyd() { return "Voff"; }\n}',
  }),
  k('oop-arv', 2, 'Hva er polymorfi (V25)?', 'Samme metodekall gir ulik oppførsel avhengig av objektets faktiske klasse.', {
    eksempel: 'ArrayList<Dyr> dyr = new ArrayList<>();\ndyr.add(new Hund());\ndyr.add(new Katt());\nfor (Dyr d : dyr) System.out.println(d.lyd()); // Voff, Mjau',
  }),
  k('oop-arv', 2, 'Hva betyr spesialisering og generalisering (V24, H25)?', 'Spesialisering: subklassen er en mer spesiell utgave av superklassen (B extends A). Generalisering: samle felles felt og metoder fra flere klasser i en felles superklasse.'),
  k('oop-arv', 2, 'Hva er protected?', 'Feltet er synlig i klassen selv og i subklasser (og samme pakke). I UML vises det med #.'),
  k('oop-arv', 2, 'Gi én fordel og én ulempe med arv.', 'Fordel: gjenbruk – felles kode skrives én gang. Ulempe: sterk kobling – endring i superklassen påvirker alle subklassene.'),
  k('oop-arv', 3, 'Hva er en abstrakt klasse?', 'En klasse merket abstract som ikke kan brukes til å lage objekter direkte – den er bare ment å arves fra. Kan ha abstrakte metoder som subklassene MÅ lage.', {
    eksempel: 'abstract class Figur {\n    abstract double areal();\n}',
  }),

  /* ---------------- Relasjoner ---------------- */
  k('oop-komposisjon', 1, 'Hva er komposisjon?', 'Et objekt består av andre objekter, og delene finnes bare inne i helheten (sterk har-en). V25 spurte om dette.', {
    eksempel: 'class Togsett {\n    private ArrayList<Vogn> vogner = new ArrayList<>();\n    public void leggTil(Vogn v) { vogner.add(v); }\n}',
  }),
  k('oop-komposisjon', 2, 'Hva er forskjellen på komposisjon, aggregering og assosiasjon?', 'Komposisjon: delen lever ikke uten helheten (hus–rom). Aggregering: delen kan eksistere selvstendig (lag–spiller). Assosiasjon: generell kobling (student–fakultet, H25).'),
  k('oop-komposisjon', 1, 'Er-en eller har-en? Lokomotiv/Vogn – Tog/Vogn', 'Et lokomotiv ER EN slags vogn (arv kan passe). Et tog HAR vogner (komposisjon).', {
    forklaring: 'Test: si setningen høyt. «Et tog er en vogn» er feil → ikke arv.',
  }),
  k('oop-komposisjon', 2, 'Hvordan summerer du noe over alle delene i en komposisjon?', 'Gå gjennom listen og legg sammen et felt fra hvert objekt.', {
    eksempel: 'public int antallSeter() {\n    int total = 0;\n    for (Vogn v : vogner) total += v.getSeter();\n    return total;\n}',
  }),
  k('oop-komposisjon', 2, 'H24: Et felt inneholder objekter av en annen klasse. Hvilken relasjon er det?', 'En har-en-relasjon: komposisjon eller aggregering, avhengig av om delene kan leve alene.'),

  /* ---------------- UML ---------------- */
  k('uml', 1, 'Hva er de tre feltene i en UML-klasseboks?', 'Øverst: klassenavn. Midten: felt/attributter. Nederst: metoder.', {
    eksempel: '┌──────────────────┐\n│ Vogn             │\n├──────────────────┤\n│ - seter: int     │\n├──────────────────┤\n│ + getSeter(): int│\n└──────────────────┘',
  }),
  k('uml', 1, 'Hva betyr +, - og # i UML?', '+ public (offentlig), - private (privat), # protected (beskyttet).'),
  k('uml', 2, 'Hvordan tegnes arv i UML?', 'Heltrukken linje med hul trekant som peker MOT superklassen.', {
    feil: 'Trekanten peker mot superklassen, ikke subklassen.',
  }),
  k('uml', 2, 'Hvordan tegnes komposisjon og aggregering?', 'Linje med rombe ved helheten. Fylt rombe ◆ = komposisjon. Hul rombe ◇ = aggregering. Vanlig strek = assosiasjon.'),
  k('uml', 2, 'Hva betyr multiplisitetene 1, 0..1, 0..* og 1..*?', '1: nøyaktig én. 0..1: ingen eller én. 0..*: null eller flere. 1..*: minst én.'),

  /* ---------------- Feilsøking ---------------- */
  k('feilsoking', 1, 'Hva er forskjellen på syntaksfeil, kjøretidsfeil og logisk feil?', 'Syntaksfeil: koden kompilerer ikke (manglende ;). Kjøretidsfeil: krasjer underveis (NullPointerException). Logisk feil: kjører, men gir feil svar (int-divisjon).'),
  k('feilsoking', 1, 'Hva betyr NullPointerException?', 'Du bruker en variabel som ikke peker på noe objekt (null). Ofte glemt å skrive new, f.eks. ArrayList som aldri ble opprettet.', {
    eksempel: 'private ArrayList<Vogn> vogner;          // null!\nprivate ArrayList<Vogn> vogner = new ArrayList<>(); // riktig',
  }),
  k('feilsoking', 1, 'Hva betyr ArrayIndexOutOfBoundsException / IndexOutOfBoundsException?', 'Du prøver å hente en indeks som ikke finnes, f.eks. tall[5] når lengden er 5 (gyldig 0–4).'),
  k('feilsoking', 2, 'Hva betyr NumberFormatException?', 'Integer.parseInt fikk tekst som ikke er et tall, f.eks. "" eller "12a". Typisk i datasett med tomme felt.'),
  k('feilsoking', 2, 'Hva er en testplan?', 'En tabell med test, inndata, forventet resultat og faktisk resultat. Bør dekke normaltilfeller, grenseverdier og ugyldig input (V23, H23).', {
    eksempel: 'Test       | Inn | Forventet    | Faktisk\nGrense     | 40  | Bestått      | ?\nUnder      | 39  | Ikke bestått | ?\nUgyldig    | -5  | Feilmelding  | ?',
  }),
  k('feilsoking', 2, 'Nevn typiske grensetilfeller du bør teste.', 'Tom liste, ett element, 0, negativ verdi, nøyaktig på grensen (>= vs >), duplikater, manglende felt, tom fil.'),
  k('feilsoking', 2, 'Hvordan feilsøker du systematisk?', '1) Les feilmeldingen (linje + type). 2) Skriv ut variabler med println. 3) Test med verdier du vet svaret på. 4) Endre én ting om gangen.'),
  k('feilsoking', 3, 'Hva gjør try / catch?', 'Fanger en feil (exception) så programmet ikke krasjer, og lar deg håndtere den.', {
    eksempel: 'try {\n    int alder = Integer.parseInt(tekst);\n} catch (NumberFormatException e) {\n    System.out.println("Skriv et tall");\n}',
  }),

  /* ---------------- Data ---------------- */
  k('data', 1, 'Hva er de faste stegene i en datasettoppgave?', '1) Les inn. 2) Del opp hver linje i felt. 3) Konverter tekst til tall. 4) Filtrer/grupper. 5) Regn ut. 6) Presenter (tabell/diagram) og kommenter.'),
  k('data', 2, 'Hvordan leser du en CSV-fil linje for linje i Java?', 'Files.readAllLines gir en liste med linjer. Hopp over overskriften, og del hver linje med split(",").', {
    eksempel: 'List<String> linjer = Files.readAllLines(Path.of("data.csv"));\nfor (int i = 1; i < linjer.size(); i++) {   // i = 1: hopp over overskrift\n    String[] felt = linjer.get(i).split(",");\n    String navn = felt[0];\n    int poeng = Integer.parseInt(felt[1].trim());\n}',
    feil: 'Glemme å hoppe over overskriftslinjen → NumberFormatException på "poeng".',
  }),
  k('data', 2, 'Hvorfor må metoden som leser fil ha throws IOException?', 'Filoperasjoner kan feile (filen finnes ikke). Java krever at du enten fanger feilen med try/catch eller skriver throws IOException.', {
    eksempel: 'public static void main(String[] args) throws IOException { ... }',
  }),
  k('data', 1, 'Hvordan regner du ut en prosentandel?', 'del / helhet * 100. I Java: pass på at minst ett av tallene er double!', {
    eksempel: 'double andel = (double) elbiler / totalt * 100;\nSystem.out.printf("%.1f %%%n", andel);',
    feil: 'elbiler / totalt * 100 med int gir 0 når elbiler < totalt.',
  }),
  k('data', 2, 'Hvordan regner du prosentvis endring?', '(ny − gammel) / gammel * 100. Fra 200 til 250 = +25 %.'),
  k('data', 2, 'Hvordan presenterer du resultater ryddig i konsollen?', 'Med printf og faste kolonnebredder. %-15s = tekst venstrejustert i 15 tegn, %8d = heltall i 8 tegn, %.1f = én desimal.', {
    eksempel: 'System.out.printf("%-15s %8s%n", "Region", "Antall");\nSystem.out.printf("%-15s %8d%n", "Oslo", 1234);',
  }),
  k('data', 2, 'Hvilken diagramtype passer til hva?', 'Søyle/stolpe: sammenligne kategorier. Linje: utvikling over tid. Sektor: andeler av en helhet. Begrunn alltid valget.'),
  k('data', 3, 'Hvordan kan du lage et enkelt diagram i Java uten ekstra bibliotek?', 'Et tekstbasert stolpediagram: skriv ut én linje per kategori med et antall tegn som er proporsjonalt med verdien. (Grafiske diagram krever f.eks. JavaFX eller et bibliotek.)', {
    eksempel: 'for (String r : antall.keySet()) {\n    int n = antall.get(r) / 100;   // skalering\n    System.out.println(r + " " + "#".repeat(n));\n}',
  }),
  k('data', 2, 'Hvordan håndterer du manglende verdier i et datasett?', 'Sjekk om feltet er tomt før du konverterer, og hopp over eller tell raden separat. Si i besvarelsen hva du har valgt og hvorfor.', {
    eksempel: 'if (felt[2].isBlank()) continue;  // hopp over rad uten verdi',
  }),

  /* ---------------- Lagring / utveksling / sikring ---------------- */
  k('lagring', 1, 'Hva er CSV?', 'Comma Separated Values: ren tekstfil der hver linje er en rad, og verdiene er skilt med komma eller semikolon. Første linje er ofte overskrifter. Egnet for tabeller.', {
    eksempel: 'navn,poeng\nAli,45\nKari,52',
  }),
  k('lagring', 1, 'Hva er JSON?', 'JavaScript Object Notation: tekstformat med objekter {"nøkkel": verdi} og lister [ ]. Kan være nøstet og har datatyper (tall, tekst, true/false, null). Brukes mye i API-er.', {
    eksempel: '[{"navn": "Ali", "poeng": 45},\n {"navn": "Kari", "poeng": 52}]',
  }),
  k('lagring', 2, 'Når velger du CSV og når JSON?', 'CSV: flate tabelldata, lett å åpne i regneark. JSON: strukturerte/nøstede data og utveksling mellom systemer. Java har ikke JSON-leser innebygd (krever bibliotek som Gson/org.json), så CSV er enklest å lese i Java.'),
  k('lagring', 2, 'Hva er et tegnsett, og hvorfor betyr det noe?', 'Regler for hvordan tegn lagres som tall. UTF-8 er standard og håndterer æ, ø, å. Feil tegnsett gir «Ã¸» i stedet for «ø».'),
  k('lagring', 2, 'Hva er strukturerte og ustrukturerte data?', 'Strukturerte: fast format med felt (tabell, CSV, database). Ustrukturerte: fritekst, bilder, video – ingen fast oppbygning.'),
  k('lagring', 2, 'Hva er validering og datakvalitet?', 'Validering: sjekke at data er gyldige før de brukes (riktig type, innenfor grenser, ikke tomme). Datakvalitet: at data er korrekte, komplette og oppdaterte.'),
  k('lagring', 1, 'Hva betyr konfidensialitet, integritet og tilgjengelighet (KIT)?', 'Konfidensialitet: bare de som skal, får se data. Integritet: data er korrekte og ikke endret uautorisert. Tilgjengelighet: data er tilgjengelig når det trengs.'),
  k('lagring', 2, 'Nevn tiltak for sikker lagring og overføring av data.', 'Kryptering (lagring og HTTPS), tilgangsstyring, sterke passord + tofaktor, sikkerhetskopi, oppdatert programvare, logging.'),

  /* ---------------- Spill og simulering ---------------- */
  k('spill', 1, 'Hva er tilstanden (state) i et spill eller en simulering?', 'Alle verdiene som beskriver situasjonen akkurat nå: posisjoner, liv, poeng, hvilke celler som brenner osv. Lagres i feltene til objektene.'),
  k('spill', 1, 'Hva er spill-løkken (game loop)?', 'En løkke som gjentas: 1) les input, 2) oppdater tilstanden, 3) tegn/skriv ut. Gjentas til spillet er slutt.', {
    eksempel: 'while (!spillSlutt) {\n    lesInput();\n    oppdater();\n    tegn();\n}',
  }),
  k('spill', 2, 'Hvordan representerer du et rutenett (f.eks. skogbrann, Livets spill)?', 'Med en todimensjonal array: rutenett[rad][kolonne]. Gå gjennom med to nøstede for-løkker.', {
    eksempel: 'char[][] skog = new char[10][10];\nfor (int r = 0; r < 10; r++)\n    for (int k = 0; k < 10; k++)\n        skog[r][k] = \'T\';',
  }),
  k('spill', 2, 'Hvordan finner du naboene til en celle i et rutenett?', 'Sjekk cellene over, under, venstre og høyre (og diagonalt om nødvendig). Pass på kantene så du ikke går utenfor arrayen.', {
    eksempel: 'if (r > 0 && skog[r-1][k] == \'B\') ...   // nabo over\nif (r < rader-1 && skog[r+1][k] == \'B\') ... // nabo under',
  }),
  k('spill', 2, 'Hvorfor lager man ofte en NY tilstand i stedet for å endre den gamle direkte i en simulering?', 'Ellers påvirker endringer tidlig i runden resten av samme runde (en brann sprer seg gjennom hele raden på ett steg). Regn ut ny tilstand fra gammel, og bytt etterpå.'),
  k('spill', 1, 'Hvordan lager du tilfeldige tall i Java?', 'Med Random. nextInt(n) gir 0 til n−1. nextDouble() gir 0.0–1.0, nyttig for sannsynligheter.', {
    eksempel: 'Random rnd = new Random();\nint terning = rnd.nextInt(6) + 1;      // 1–6\nif (rnd.nextDouble() < 0.3) { ... }    // 30 % sjanse',
  }),
  k('spill', 2, 'Hvordan sjekker du kollisjon mellom to figurer?', 'Rutenett: samme rad og kolonne. Rektangler: de overlapper hvis de overlapper både i x- og y-retning.', {
    eksempel: 'boolean kollisjon = spiller.getX() == fiende.getX()\n                 && spiller.getY() == fiende.getY();',
  }),
  k('spill', 1, 'Hvilken strategi gir mest uttelling på en stor spill-/simuleringsoppgave på eksamen?', 'Bygg trinnvis og lever noe som virker: 1) modell/klasser, 2) grunnfunksjon, 3) oppdatering/input, 4) test, 5) ekstra funksjoner. Forklar hva som mangler.'),

  /* ---------------- Etikk ---------------- */
  k('etikk', 1, 'Hva er en personopplysning?', 'Enhver opplysning som kan knyttes til en enkeltperson – direkte (navn, fødselsnr.) eller indirekte (bilde, IP-adresse, posisjon).'),
  k('etikk', 1, 'Hva er GDPR / personopplysningsloven?', 'EUs personvernforordning, gjeldende i Norge gjennom personopplysningsloven. Regulerer innsamling, lagring og bruk av personopplysninger. Datatilsynet fører tilsyn.'),
  k('etikk', 2, 'Nevn fire viktige personvernprinsipper.', 'Lovlig grunnlag (f.eks. informert samtykke), formålsbegrensning, dataminimering, lagringsbegrensning. (+ riktighet, sikkerhet, ansvar.)', {
    forklaring: 'Disse ordene løfter drøftingen din. V23 spurte om personvernprinsipper ved utvikling av KI.',
  }),
  k('etikk', 2, 'Hva er informert samtykke (H24)?', 'Personen har fått tydelig informasjon om hva data brukes til, og har frivillig sagt ja. Samtykket kan trekkes tilbake. Vanskelig når personen er sårbar (f.eks. eldre med demens og velferdsteknologi).'),
  k('etikk', 2, 'Hva betyr autonomi i etiske drøftinger?', 'Selvbestemmelse: retten til å ta egne valg om eget liv. Teknologi kan styrke autonomi (bo hjemme lenger) eller svekke den (overvåking, manipulering).'),
  k('etikk', 2, 'Hva er særlige kategorier (sensitive) personopplysninger?', 'Helse, etnisitet, religion, politisk syn, seksuell orientering, fagforening, genetiske og biometriske data (ansiktsgjenkjenning). Strengere regler.'),
  k('etikk', 1, 'Hvordan bygger du opp en etisk drøfting?', '1) Presenter dilemmaet og hvem som berøres. 2) Hvilke verdier står mot hverandre. 3) Argumenter for og mot, knyttet til caset. 4) Fagbegreper. 5) Konsekvenser for individ og samfunn. 6) Vei hensynene og konkluder.', {
    forklaring: 'Brukt i alle 7 eksamenssett (kamera, velferdsteknologi, KI-chatbot, VR, deepfakes, finans, IoT).',
  }),
  k('etikk', 2, 'Hva er deepfakes, og hvorfor er kildekritikk viktig (V24)?', 'KI-genererte, falske bilder, video eller lyd som ser ekte ut. Kan brukes til svindel og desinformasjon. Kildekritikk: sjekk avsender, sammenlign kilder, se etter tekniske avvik.'),
  k('etikk', 2, 'Hvordan vurderer du konsekvenser for individ OG samfunn (KM1, KM2)?', 'Individ: personvern, trygghet, autonomi, hjelp. Samfunn: tillit, maktbalanse, diskriminering, effektivitet og kostnader, demokrati.', { km: 'KM1' }),
  k('etikk', 2, 'Hva er en risikovurdering (H23 – IoT)?', 'Kartlegge hva som kan gå galt (trusler), hvor sannsynlig det er og hvor alvorlig konsekvensen blir – og velge tiltak. Viktig før man deler data med en leverandør.', { km: 'KM1' }),

  /* ---------------- Systemutvikling ---------------- */
  k('systemutvikling', 1, 'Hva er brukervennlighet?', 'Hvor enkelt, effektivt og tilfredsstillende det er for brukeren å nå målet sitt. Vurder: tydelighet, navigasjon, feilmeldinger, tilgjengelighet, effektivitet.', { km: 'KM8' }),
  k('systemutvikling', 1, 'Hva er universell utforming?', 'At løsningen kan brukes av flest mulig, uavhengig av funksjonsevne: kontrast, tekststørrelse, alternativ tekst, tastaturnavigasjon.', { km: 'KM8' }),
  k('systemutvikling', 2, 'Hva er forskjellen på fossefall og smidig utvikling?', 'Fossefall: faste faser i rekkefølge (krav → design → kode → test). Smidig: korte iterasjoner med testing og tilbakemelding fra brukere, f.eks. Scrum med sprinter.'),
  k('systemutvikling', 2, 'Hvordan finner du brukerbehov og tester brukervennlighet?', 'Intervju, spørreskjema, observasjon, personas, prototyper og brukertester der testpersoner løser oppgaver mens du observerer.', { km: 'KM8' }),
  k('systemutvikling', 2, 'Hva er versjonskontroll (Git), og hvorfor er det nyttig i samarbeid?', 'Lagrer historikk over endringer. Flere kan jobbe samtidig, man kan gå tilbake og se hvem som endret hva. GitHub er en tjeneste for å dele Git-prosjekter.'),
  k('systemutvikling', 2, 'Hvorfor dokumentere kode, og hvordan?', 'Så andre (og du selv) forstår den. Kommentarer, Javadoc (/** ... */), gode navn, README og klassediagram.'),
];
