/*
 * Pensum: Fagstoffpakken (src/fagstoff/IT2_REA3050_FAGSTOFF_OG_EKSAMENSPAKKE.md) er lagt inn ordrett
 * og deles her automatisk i kapitler og delkapitler. Ingenting i fagteksten forkortes.
 *
 *  - «# KAPITTEL n» blir et kapittel; hver «## n.m» blir et delkapittel.
 *  - Fordypningene i DEL IX (§25–31) og ekstraoppgavene i §32 festes til kapittelet de utdyper.
 *  - Oppgaveblokkene («### Oppgaver – kapittel n», «### Fordypningsoppgaver») flyttes ut av lesestoffet:
 *    kapitteloppgavene står med løsningsforslag i tilleggsfilene, fordypningsoppgavene i den muntlige banken.
 *  - Tilleggsstoff (src/fagstoff/tillegg/kNN.md) legger til læringsmål, eksempler, muntlig modellforklaring,
 *    oppgaver med løsningsforslag, vanlige feil og huskeliste.
 */
import raw from '../fagstoff/IT2_REA3050_FAGSTOFF_OG_EKSAMENSPAKKE.md?raw';
import type { KmId } from './typer';

export type SeksjonType = 'fagstoff' | 'fordypning' | 'ekstra' | 'tillegg';

export interface Seksjon {
  id: string;
  tittel: string;
  md: string;
  type: SeksjonType;
}

export interface Kapittel {
  id: string; // k00 … k16
  nr: number;
  tittel: string;
  km: KmId[];
  dag: number; // studiedag 1–7
  sentral: boolean; // sentralt hovedtema (krav om full leksjonsstruktur)
  seksjoner: Seksjon[];
  fjernedeOppgaver: string; // oppgaveteksten som er flyttet til tillegg/bank (for kontroll i testene)
  ord: number;
}

interface Meta { nr: number; km: KmId[]; dag: number; sentral: boolean; tittel?: string }

/** Rekkefølgen her er leserekkefølgen i appen (følger dag-for-dag-planen). */
export const KAPITTEL_META: Meta[] = [
  { nr: 0, km: [], dag: 1, sentral: false, tittel: 'Eksamen, læreplan og strategi' },
  { nr: 1, km: ['KM1'], dag: 1, sentral: true },
  { nr: 2, km: ['KM2', 'KM1'], dag: 1, sentral: true },
  { nr: 3, km: ['KM3', 'KM7'], dag: 2, sentral: true },
  { nr: 6, km: ['KM3'], dag: 2, sentral: true },
  { nr: 4, km: ['KM5', 'KM4'], dag: 3, sentral: true },
  { nr: 5, km: ['KM4'], dag: 3, sentral: true },
  { nr: 7, km: ['KM6'], dag: 4, sentral: true },
  { nr: 8, km: ['KM7'], dag: 4, sentral: true },
  { nr: 11, km: ['KM10'], dag: 5, sentral: true },
  { nr: 12, km: ['KM10'], dag: 5, sentral: true },
  { nr: 13, km: ['KM11'], dag: 5, sentral: true },
  { nr: 14, km: ['KM10'], dag: 5, sentral: true },
  { nr: 15, km: ['KM10'], dag: 5, sentral: true },
  { nr: 9, km: ['KM8'], dag: 6, sentral: true },
  { nr: 10, km: ['KM9'], dag: 6, sentral: true },
  { nr: 16, km: [], dag: 6, sentral: false },
];

const FORDYPNING_TIL: Record<number, number> = { 25: 6, 26: 7, 27: 8, 28: 9, 29: 11, 30: 14, 31: 15 };
const EKSTRAOPPGAVE_TIL: Record<number, number> = { 1: 3, 2: 3, 3: 4, 4: 4, 5: 11, 6: 7 };
const TILLEGG_FORAN = new Set(['Læringsmål']);
export const TILLEGG_REKKEFOLGE = [
  'Læringsmål', 'Flere eksempler', 'Gjennomarbeidet eksempel', 'Praktisk demonstrasjon', 'Muntlig forklaring',
  'Sensoroppfølging', 'Oppgaver og løsningsforslag', 'Vanlige feil', 'Huskeliste',
];

/* ---------- Hjelpere ---------- */

interface Blokk { tittel: string; tekst: string }

/** Deler tekst på overskrifter med gitt nivå, men ikke inne i kodeblokker. */
export function delPaOverskrift(tekst: string, niva: number): { innledning: string; blokker: Blokk[] } {
  const pre = '#'.repeat(niva) + ' ';
  const linjer = tekst.replace(/\r\n/g, '\n').split('\n');
  const blokker: Blokk[] = [];
  const innledning: string[] = [];
  let gjeldende: Blokk | null = null;
  let buf: string[] = [];
  let iKode = false;
  for (const l of linjer) {
    if (l.startsWith('```')) iKode = !iKode;
    if (!iKode && l.startsWith(pre)) {
      if (gjeldende) { gjeldende.tekst = buf.join('\n').trim(); blokker.push(gjeldende); } else innledning.push(...buf);
      gjeldende = { tittel: l.slice(pre.length).trim(), tekst: '' };
      buf = [];
    } else buf.push(l);
  }
  if (gjeldende) { gjeldende.tekst = buf.join('\n').trim(); blokker.push(gjeldende); } else innledning.push(...buf);
  return { innledning: innledning.join('\n').trim(), blokker };
}

export function slug(s: string) {
  return s.toLowerCase().replace(/[`*]/g, '').replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

export function antallOrd(s: string) {
  return s.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\s]+/g, 'x')).split(/\s+/).filter(Boolean).length;
}

/** Fjerner «### Oppgaver …»/«### Fordypningsoppgaver» og alt etter i en seksjon. */
function skillUtOppgaver(tekst: string): { les: string; oppgaver: string } {
  const m = /\n?### (Oppgaver – kapittel \d+|Fordypningsoppgaver)[\s\S]*$/.exec(tekst);
  if (!m) return { les: tekst, oppgaver: '' };
  const les = tekst.slice(0, m.index).replace(/\n---\s*$/, '').trim();
  return { les, oppgaver: m[0].replace(/\n---\s*$/, '').trim() };
}

/* ---------- Del opp fagstoffet ---------- */

const topp = delPaOverskrift(raw, 1).blokker;
const finnDel = (start: string) => topp.find((b) => b.tittel.startsWith(start));

const kapittelBlokker = new Map<number, Blokk>();
for (const b of topp) {
  const m = /^KAPITTEL (\d+) – (.*)$/.exec(b.tittel);
  if (m) kapittelBlokker.set(Number(m[1]), { tittel: m[2], tekst: b.tekst });
}

const tilleggFiler = import.meta.glob('../fagstoff/tillegg/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
function tilleggFor(nr: number): Blokk[] {
  const fil = Object.entries(tilleggFiler).find(([sti]) => sti.endsWith(`/k${String(nr).padStart(2, '0')}.md`));
  return fil ? delPaOverskrift(fil[1], 2).blokker : [];
}

function tittelCase(s: string) {
  const lav = s.toLowerCase();
  return lav.charAt(0).toUpperCase() + lav.slice(1).replace(/\b(it|oop|uml|sql|http|api|ux)\b/gi, (x) => x.toUpperCase());
}

function byggKapittel(meta: Meta): Kapittel {
  const id = `k${String(meta.nr).padStart(2, '0')}`;
  const seksjoner: Seksjon[] = [];
  const brukt = new Set<string>();
  const leggTil = (tittel: string, md: string, type: SeksjonType) => {
    let sid = `${id}-${slug(tittel)}`;
    while (brukt.has(sid)) sid += '-x';
    brukt.add(sid);
    seksjoner.push({ id: sid, tittel, md, type });
  };
  let fjernet = '';
  let tittel = meta.tittel ?? '';

  const tillegg = tilleggFor(meta.nr);
  for (const t of tillegg.filter((t) => TILLEGG_FORAN.has(t.tittel))) leggTil(t.tittel, t.tekst, 'tillegg');

  if (meta.nr === 0) {
    const forord = /^> \*\*Viktig om karakter:\*\*.*$/m.exec(raw)?.[0];
    if (forord) leggTil('Viktig om karakter', forord, 'fagstoff');
    for (const del of ['DEL I ', 'DEL II ', 'DEL VII ', 'DEL X ']) {
      const b = finnDel(del);
      if (!b) throw new Error(`Fant ikke ${del} i fagstoffet`);
      for (const s of delPaOverskrift(b.tekst, 2).blokker) leggTil(s.tittel, s.tekst.replace(/\n---\s*$/, '').trim(), 'fagstoff');
    }
  } else {
    const kb = kapittelBlokker.get(meta.nr);
    if (!kb) throw new Error(`Fant ikke kapittel ${meta.nr}`);
    tittel = tittelCase(kb.tittel);
    const { innledning, blokker } = delPaOverskrift(kb.tekst, 2);
    if (innledning) leggTil('Innledning', innledning, 'fagstoff');
    for (const s of blokker) {
      const { les, oppgaver } = skillUtOppgaver(s.tekst);
      fjernet += oppgaver + '\n';
      leggTil(s.tittel, les, 'fagstoff');
    }
    // Fordypning fra DEL IX
    const del9 = finnDel('DEL IX');
    if (del9) {
      for (const s of delPaOverskrift(del9.tekst, 2).blokker) {
        const nr = Number(/^(\d+)\./.exec(s.tittel)?.[1]);
        if (FORDYPNING_TIL[nr] === meta.nr) {
          const { les, oppgaver } = skillUtOppgaver(s.tekst);
          fjernet += oppgaver + '\n';
          leggTil(s.tittel, les, 'fordypning');
        }
        if (nr === 32) {
          for (const o of delPaOverskrift(s.tekst, 3).blokker) {
            const onr = Number(/^Oppgave (\d+)/.exec(o.tittel)?.[1]);
            if (EKSTRAOPPGAVE_TIL[onr] === meta.nr) leggTil(`Ekstra kodeoppgave: ${o.tittel}`, o.tekst.replace(/\n---\s*$/, '').trim(), 'ekstra');
          }
        }
      }
    }
  }

  const etter = tillegg.filter((t) => !TILLEGG_FORAN.has(t.tittel));
  etter.sort((a, b) => TILLEGG_REKKEFOLGE.indexOf(a.tittel) - TILLEGG_REKKEFOLGE.indexOf(b.tittel));
  for (const t of etter) leggTil(t.tittel, t.tekst, 'tillegg');

  return {
    id, nr: meta.nr, tittel, km: meta.km, dag: meta.dag, sentral: meta.sentral, seksjoner,
    fjernedeOppgaver: fjernet.trim(),
    ord: seksjoner.reduce((a, s) => a + antallOrd(s.md), 0),
  };
}

export const kapitler: Kapittel[] = KAPITTEL_META.map(byggKapittel);
export const kapittel = (id: string) => kapitler.find((k) => k.id === id);
export const kapittelNr = (nr: number) => kapitler.find((k) => k.nr === nr);
export const kapitlerForDag = (dag: number) => kapitler.filter((k) => k.dag === dag);
export const kapitlerForKm = (km: KmId) => kapitler.filter((k) => k.km.includes(km));
export const seksjonMedId = (id: string) => {
  for (const k of kapitler) { const s = k.seksjoner.find((x) => x.id === id); if (s) return { kapittel: k, seksjon: s }; }
  return undefined;
};

/* ---------- Andre deler av fagstoffpakken ---------- */

/** Fagstoffets egne sider for en del, f.eks. 'DEL VI' (dagplanen) eller 'DEL VIII' (kilder). */
export function delSeksjoner(start: string): Blokk[] {
  const b = finnDel(start);
  return b ? delPaOverskrift(b.tekst, 2).blokker.map((s) => ({ ...s, tekst: s.tekst.replace(/\n---\s*$/, '').trim() })) : [];
}

/** «40 raske kontrollspørsmål med forventet svar» — brukes til repetisjon (spaced repetition). */
export interface Kontrollspm { id: string; sporsmal: string; svar: string }
export const kontrollsporsmal: Kontrollspm[] = (() => {
  const s = delSeksjoner('DEL V').find((b) => b.tittel.startsWith('40 raske'));
  if (!s) return [];
  return [...s.tekst.matchAll(/^(\d+)\. \*\*(.+?)\*\* (.+)$/gm)].map((m) => ({ id: `kontroll-${m[1]}`, sporsmal: m[2], svar: m[3] }));
})();

/** Begrepsliste (fagstoff §34) koblet til definisjoner fra kontrollspørsmålene der det finnes. */
export const begrepsliste: string[] = (() => {
  const s = delSeksjoner('DEL X').find((b) => b.tittel.startsWith('34.'));
  if (!s) return [];
  return s.tekst.split('\n').filter((l) => l.trim() && !l.startsWith('I tillegg'))
    .concat(s.tekst.split('\n').filter((l) => l.startsWith('I tillegg')).map((l) => l.replace(/^I tillegg bør du kunne forklare:\s*/, '')))
    .join(', ').split(/,\s*|\s+og\s+/).map((x) => x.replace(/\.$/, '').trim()).filter(Boolean);
})();

export const fagstoffOrd = antallOrd(raw);
