import { useMemo, useState } from 'react';
import type { QuizItem } from './types';
import { topicNavn } from './data/topics';

export function Code({ children }: { children: string }) {
  return <pre className="code"><code>{children}</code></pre>;
}

export function Tekst({ children }: { children: string }) {
  return <div className="tekst">{children}</div>;
}

export function Merker({ tema, km, eksamen, niva }: { tema: string; km: string; eksamen: string; niva: number }) {
  return (
    <div className="merker">
      <span className="merke">{topicNavn(tema)}</span>
      <span className="merke">{km}</span>
      <span className="merke">{eksamen === 'begge' ? 'REA3049 + REA3050' : eksamen === 'skriftlig' ? 'REA3049' : 'REA3050'}</span>
      <span className="merke">{'●'.repeat(niva)}{'○'.repeat(3 - niva)}</span>
    </div>
  );
}

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s"'`]/g, '').replace(',', '.');

/** Viser én quiz-oppgave. Kaller onSvar(riktig) én gang når brukeren har svart. */
export function QuizRunner({ item, onSvar, onNeste }: { item: QuizItem; onSvar: (riktig: boolean) => void; onNeste: () => void }) {
  const [valgt, setValgt] = useState<number | null>(null);
  const [tekst, setTekst] = useState('');
  const [rekke, setRekke] = useState<number[]>([]);
  const [ferdig, setFerdig] = useState<boolean | null>(null);
  const [vist, setVist] = useState(false); // selvvurdert: løsning vist
  const [kryss, setKryss] = useState<boolean[]>([]);
  const stokket = useMemo(() => (item.type === 'sorter' ? shuffle(item.linjer.map((_, i) => i)) : []), [item]);

  const svar = (ok: boolean) => {
    if (ferdig !== null) return;
    setFerdig(ok);
    onSvar(ok);
  };

  return (
    <div className="kort">
      <Merker tema={item.tema} km={item.km} eksamen={item.eksamen} niva={item.niva} />
      <Tekst>{item.sporsmal}</Tekst>
      {'kode' in item && item.kode && <Code>{item.kode}</Code>}

      {item.type === 'flervalg' && (
        <div className="alternativer">
          {item.alternativer.map((a, i) => {
            const cls = ferdig === null ? (valgt === i ? 'valgt' : '') : i === item.riktig ? 'riktig' : valgt === i ? 'feil' : '';
            return (
              <button key={i} className={`alt ${cls}`} disabled={ferdig !== null} onClick={() => { setValgt(i); svar(i === item.riktig); }}>
                <span className="mono">{a}</span>
              </button>
            );
          })}
        </div>
      )}

      {item.type === 'kortsvar' && (
        <form onSubmit={(e) => { e.preventDefault(); if (tekst.trim()) svar(item.aksepter.map(norm).includes(norm(tekst))); }}>
          <div className="rad">
            <input className="input mono" value={tekst} disabled={ferdig !== null} onChange={(e) => setTekst(e.target.value)} placeholder="Ditt svar" autoFocus />
            <button className="knapp" disabled={ferdig !== null || !tekst.trim()}>Sjekk</button>
          </div>
          {ferdig === false && <p className="liten">Riktig svar: <b className="mono">{item.fasit}</b></p>}
        </form>
      )}

      {item.type === 'sorter' && (
        <div>
          <p className="liten">Trykk linjene i riktig rekkefølge.</p>
          <div className="sortert">
            {rekke.map((i, pos) => <div key={pos} className="linje mono">{item.linjer[i]}</div>)}
            {rekke.length === 0 && <div className="liten">(tomt)</div>}
          </div>
          <div className="alternativer">
            {stokket.filter((i) => !rekke.includes(i)).map((i) => (
              <button key={i} className="alt" disabled={ferdig !== null} onClick={() => {
                const ny = [...rekke, i];
                setRekke(ny);
                if (ny.length === item.linjer.length) svar(ny.every((v, k) => item.linjer[v] === item.linjer[k]));
              }}><span className="mono">{item.linjer[i]}</span></button>
            ))}
          </div>
          {ferdig === null && rekke.length > 0 && <button className="knapp sek" onClick={() => setRekke([])}>Start på nytt</button>}
          {ferdig === false && <><p className="liten">Riktig rekkefølge:</p><Code>{item.linjer.join('\n')}</Code></>}
        </div>
      )}

      {item.type === 'selvvurdert' && (
        <div>
          <textarea className="input mono" rows={8} value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Skriv svaret / koden din her før du ser løsningen…" disabled={vist} />
          {!vist ? (
            <button className="knapp" onClick={() => { setVist(true); setKryss(item.sjekkliste.map(() => false)); }}>Vis løsningsforslag</button>
          ) : (
            <>
              <h4>Løsningsforslag</h4>
              <Code>{item.losning}</Code>
              <h4>Kryss av det svaret ditt hadde:</h4>
              {item.sjekkliste.map((s, i) => (
                <label key={i} className="sjekk">
                  <input type="checkbox" checked={kryss[i] ?? false} disabled={ferdig !== null} onChange={() => setKryss(kryss.map((v, k) => (k === i ? !v : v)))} /> {s}
                </label>
              ))}
              {ferdig === null && (
                <button className="knapp" onClick={() => svar(kryss.filter(Boolean).length / item.sjekkliste.length >= 0.6)}>
                  Registrer ({kryss.filter(Boolean).length}/{item.sjekkliste.length})
                </button>
              )}
            </>
          )}
        </div>
      )}

      {ferdig !== null && (
        <div className={`tilbakemelding ${ferdig ? 'ok' : 'nei'}`}>
          <b>{ferdig ? '✓ Riktig' : item.type === 'selvvurdert' ? '✗ Under 60 % – denne kommer igjen snart' : '✗ Ikke riktig'}</b>
          <p>{item.forklaring}</p>
          {item.vanligeFeil && <p className="liten"><b>Vanlig feil:</b> {item.vanligeFeil}</p>}
          <button className="knapp" onClick={onNeste} autoFocus>Neste →</button>
        </div>
      )}
    </div>
  );
}

export function Fremdrift({ verdi, label }: { verdi: number; label?: string }) {
  const p = Math.round(verdi * 100);
  return (
    <div className="fremdrift" title={label}>
      <div className="fyll" style={{ width: `${p}%` }} />
    </div>
  );
}

const IKONER: Record<string, string> = {
  idag: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  plan: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  ov: 'M7 4h11a1 1 0 0 1 1 1v13M5 7h11a1 1 0 0 1 1 1v12H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z',
  eksamen: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  fremdrift: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  innstillinger: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  sol: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  maane: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  auto: 'M12 21a9 9 0 1 0 0-18v18zM12 3a9 9 0 0 1 0 18',
  laas: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  sjekk: 'M5 12l5 5L20 7',
  spill: 'M8 5v14l11-7z',
  kryss: 'M6 6l12 12M18 6L6 18',
  pil: 'M5 12h14M13 6l6 6-6 6',
  tilbake: 'M19 12H5M11 18l-6-6 6-6',
  flamme: 'M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z',
  stjerne: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z',
  kort: 'M4 7h12v13H4zM8 4h12v13',
  match: 'M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z',
  mal: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  repeter: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  mikrofon: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM19 11a7 7 0 0 1-14 0M12 18v3',
  bok: 'M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2zM4 5v17M20 5v17',
  advarsel: 'M12 3l10 18H2zM12 10v5M12 18h.01',
};

export function Ikon({ navn, stor }: { navn: string; stor?: boolean }) {
  const fylt = navn === 'stjerne' || navn === 'flamme' || navn === 'spill';
  return (
    <svg className={`ikon ${stor ? 'ikon-stor' : ''}`} viewBox="0 0 24 24" width={stor ? 48 : 20} height={stor ? 48 : 20} aria-hidden="true"
      fill={fylt ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fylt ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d={IKONER[navn] ?? ''} />
    </svg>
  );
}
