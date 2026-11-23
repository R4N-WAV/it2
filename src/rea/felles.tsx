import { useEffect, useRef, useState } from 'react';
import { ANKER, DIMENSJONER, kmNavn } from './data/km';
import type { DimId, KmId } from './typer';
import { begrensninger, brukBegrensninger, snitt, type Begrensning, type Dekning, type KmStatus } from './vurdering';

/* ---------- Dato (kan overstyres med ?dato=YYYY-MM-DD for testing) ---------- */
export function iDag(): Date {
  try {
    const q = new URLSearchParams(location.search).get('dato');
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) {
      const n = new Date();
      return new Date(`${q}T${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}:00`);
    }
  } catch { /* ignorer */ }
  return new Date();
}

export const fmtTid = (sek: number) => `${Math.floor(Math.max(0, sek) / 60)}:${String(Math.floor(Math.max(0, sek) % 60)).padStart(2, '0')}`;

/* ---------- Merker ---------- */
export function KmMerker({ km }: { km: KmId[] }) {
  return <span className="merker">{km.map((k) => <span key={k} className="merke" title={kmNavn(k)}>{k} · {kmNavn(k)}</span>)}</span>;
}
export function NivaMerke({ niva }: { niva: number }) {
  return <span className="merke" title="Vanskelighetsgrad">{['', 'Grunnleggende', 'Middels', 'Utfordrende'][niva]}</span>;
}

const STATUS: Record<KmStatus, { tekst: string; klasse: string }> = {
  ingen: { tekst: 'Ikke testet', klasse: 'nei' },
  rod: { tekst: 'Svak', klasse: 'nei' },
  gul: { tekst: 'Ustabil', klasse: 'midt' },
  gronn: { tekst: 'Stabil nivå 3', klasse: 'ok' },
  blaa: { tekst: 'Nivå 4', klasse: 'aksent' },
};
export function StatusChip({ status }: { status: KmStatus }) {
  return <span className={`chip ${STATUS[status].klasse}`}>{STATUS[status].tekst}</span>;
}

/* ---------- Snakketimer og diktering ---------- */
export function useStoppeklokke() {
  const [sek, setSek] = useState(0);
  const [gaar, setGaar] = useState(false);
  useEffect(() => {
    if (!gaar) return;
    const t = setInterval(() => setSek((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [gaar]);
  return { sek, gaar, start: () => setGaar(true), stopp: () => setGaar(false), nullstill: () => { setGaar(false); setSek(0); } };
}

interface Gjenkjenning { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null; onend: (() => void) | null }
function lagGjenkjenning(): Gjenkjenning | null {
  const w = window as unknown as Record<string, new () => Gjenkjenning>;
  const K = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return K ? new K() : null;
}

/** Tekstfelt for svar med snakketimer (si det høyt) og valgfri diktering der nettleseren støtter det. */
export function SvarBoks({ verdi, settVerdi, plassholder, rader = 6, onSnakk, autoFocus, mono }: {
  verdi: string; settVerdi: (s: string) => void; plassholder?: string; rader?: number; onSnakk?: (sek: number) => void; autoFocus?: boolean; mono?: boolean;
}) {
  const klokke = useStoppeklokke();
  const [dikterer, setDikterer] = useState(false);
  const gj = useRef<Gjenkjenning | null>(null);
  const kanDiktere = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const verdiRef = useRef(verdi);
  useEffect(() => { verdiRef.current = verdi; }, [verdi]);
  useEffect(() => { onSnakk?.(klokke.sek); }, [klokke.sek, onSnakk]);
  useEffect(() => () => gj.current?.stop(), []);

  const diktering = () => {
    if (dikterer) { gj.current?.stop(); return; }
    const g = lagGjenkjenning();
    if (!g) return;
    g.lang = 'nb-NO'; g.continuous = true; g.interimResults = false;
    g.onresult = (e) => {
      let ny = '';
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) ny += e.results[i][0].transcript + ' ';
      if (ny) settVerdi((verdiRef.current + ' ' + ny).trim());
    };
    g.onend = () => setDikterer(false);
    gj.current = g;
    g.start();
    setDikterer(true);
  };

  return (
    <div className="svarboks">
      <textarea className={`input ${mono ? 'mono' : ''}`} rows={rader} value={verdi} onChange={(e) => settVerdi(e.target.value)} placeholder={plassholder ?? 'Si svaret høyt først – skriv deretter det du sa, eller stikkord.'} autoFocus={autoFocus} spellCheck={!mono} />
      <div className="rad liten">
        <button type="button" className={`knapp liten-knapp ${klokke.gaar ? 'rod' : 'sek'}`} onClick={klokke.gaar ? klokke.stopp : klokke.start}>
          {klokke.gaar ? '■ Stopp' : '● Snakk høyt'} <span className="tall">{fmtTid(klokke.sek)}</span>
        </button>
        {kanDiktere && <button type="button" className={`knapp liten-knapp ${dikterer ? 'rod' : 'sek'}`} onClick={diktering} title="Talegjenkjenning i nettleseren. Krever ofte nettilgang.">{dikterer ? 'Stopp diktering' : 'Dikter'}</button>}
        <span className="dempet">{verdi.trim() ? verdi.trim().split(/\s+/).length : 0} ord</span>
      </div>
    </div>
  );
}

/* ---------- Begrepssjekk ---------- */
export function DekningVisning({ d, vis = true }: { d: Dekning; vis?: boolean }) {
  return (
    <div className="dekning">
      <p className="liten"><b>Begrepssjekk:</b> {d.treff.length} av {d.treff.length + d.mangler.length} sentrale fagbegreper brukt.</p>
      {vis && (
        <div className="merker">
          {d.treff.map((t) => <span key={t} className="chip ok">✓ {t}</span>)}
          {d.mangler.map((t) => <span key={t} className="chip nei">– {t}</span>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Rubrikk ---------- */
export function Rubrikk({ dims, svar, dekning, hint, onLagre, knapp = 'Lagre vurdering' }: {
  dims: DimId[]; svar: string; dekning: Dekning | null; hint: boolean; onLagre: (dim: Partial<Record<DimId, number>>, b: Begrensning[]) => void; knapp?: string;
}) {
  const [valg, setValg] = useState<Partial<Record<DimId, number>>>({});
  const b = begrensninger(svar, dekning, hint, dims);
  const tak = (d: DimId) => Math.min(4, ...b.filter((x) => x.dim === 'alle' || x.dim === d).map((x) => x.tak));
  const ferdig = dims.every((d) => valg[d] !== undefined);
  const endelig = brukBegrensninger(valg, b);
  return (
    <div className="rubrikk">
      <p className="liten dempet">Vurder deg selv ærlig fra 0 til 4 mot vurderingsmomentene og eksempelsvaret. Dette er en intern treningsrubrikk, ikke en offisiell sensorveiledning.</p>
      {dims.map((d) => {
        const info = DIMENSJONER.find((x) => x.id === d)!;
        const t = tak(d);
        return (
          <div key={d} className="rubrikk-rad">
            <div><b>{info.navn}</b> <span className="liten dempet">– {info.sporsmal}</span></div>
            <div className="skala" role="radiogroup" aria-label={info.navn}>
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={valg[d] === n} title={ANKER[n]}
                  className={`skala-knapp ${valg[d] === n ? 'valgt' : ''} ${n > t ? 'over-tak' : ''}`} onClick={() => setValg({ ...valg, [d]: n })}>{n}</button>
              ))}
            </div>
            {valg[d] !== undefined && valg[d]! > t && <p className="liten advar-tekst">Settes til {t}: {b.find((x) => x.dim === d || x.dim === 'alle')?.grunn}</p>}
          </div>
        );
      })}
      <details className="liten"><summary>Hva betyr 0–4?</summary><ul>{[0, 1, 2, 3, 4].map((n) => <li key={n}><b>{n}:</b> {ANKER[n]}</li>)}</ul></details>
      <div className="rad mellom">
        <span>{ferdig ? <>Snitt: <b className="tall">{snitt(endelig).toFixed(1)}</b> / 4</> : <span className="dempet">Vurder alle {dims.length} dimensjonene.</span>}</span>
        <button className="knapp" disabled={!ferdig} onClick={() => onLagre(endelig, b)}>{knapp}</button>
      </div>
    </div>
  );
}

/* ---------- Kopier ---------- */
export function KopierKnapp({ tekst }: { tekst: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="kopier" onClick={() => { navigator.clipboard?.writeText(tekst).then(() => { setOk(true); setTimeout(() => setOk(false), 1500); }).catch(() => undefined); }} aria-label="Kopier koden">
      {ok ? 'Kopiert ✓' : 'Kopier'}
    </button>
  );
}

/** Nedtelling basert på starttidspunkt (overlever omlasting). */
export function useNaa(intervall = 1000) {
  const [naa, setNaa] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNaa(Date.now()), intervall); return () => clearInterval(t); }, [intervall]);
  return naa;
}
