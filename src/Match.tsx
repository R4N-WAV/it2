import { useEffect, useMemo, useRef, useState } from 'react';
import { Ikon, shuffle } from './components';
import { begreper, type Begrep } from './data/begreper';
import { lagreMatch, useData } from './store';
import type { TopicId } from './types';

/*
 * Match etter Quizlets modell: 6 begreper og 6 forklaringer i et rutenett.
 * Trykk på to ruter som hører sammen. Feil par gir 1 sekund straff. Slå din egen rekord.
 */

const PAR = 6;
interface Rute { nokkel: string; tekst: string; par: number; erTerm: boolean }

function lagBrett(temaer?: TopicId[]): Rute[] {
  const kilde = temaer?.length ? begreper.filter((b) => temaer.includes(b.tema)) : begreper;
  const valgt: Begrep[] = shuffle(kilde.length >= PAR ? kilde : begreper).slice(0, PAR);
  return shuffle(valgt.flatMap((b, i) => [
    { nokkel: `t${i}`, tekst: b.term, par: i, erTerm: true },
    { nokkel: `d${i}`, tekst: b.def, par: i, erTerm: false },
  ]));
}

const fmt = (ms: number) => (ms / 1000).toFixed(1) + ' s';

export function MatchSpill({ sett, temaer, onFerdig, onAvslutt }: { sett: string; temaer?: TopicId[]; onFerdig: () => void; onAvslutt: () => void }) {
  const d = useData();
  const [brett, setBrett] = useState<Rute[]>(() => lagBrett(temaer));
  const [valgt, setValgt] = useState<string | null>(null);
  const [borte, setBorte] = useState<Set<string>>(() => new Set());
  const [feil, setFeil] = useState<string[]>([]);
  const [straff, setStraff] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const [naa, setNaa] = useState(0);
  const [slutt, setSlutt] = useState<number | null>(null);
  const rekordFor = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (start === null || slutt !== null) return;
    const t = setInterval(() => setNaa(Date.now()), 100);
    return () => clearInterval(t);
  }, [start, slutt]);

  const tid = start === null ? 0 : (slutt ?? naa) - start + straff;
  const ferdig = slutt !== null;
  const rekord = d.matchBest[sett];

  const trykk = (r: Rute) => {
    if (ferdig || borte.has(r.nokkel)) return;
    if (start === null) { setStart(Date.now()); setNaa(Date.now()); }
    if (valgt === null) { setValgt(r.nokkel); return; }
    if (valgt === r.nokkel) { setValgt(null); return; }
    const a = brett.find((x) => x.nokkel === valgt)!;
    if (a.par === r.par && a.erTerm !== r.erTerm) {
      const ny = new Set(borte); ny.add(a.nokkel); ny.add(r.nokkel);
      setBorte(ny); setValgt(null);
      if (ny.size === brett.length) {
        const s = Date.now();
        setSlutt(s);
        const total = s - (start ?? s) + straff;
        rekordFor.current = d.matchBest[sett];
        lagreMatch(sett, total);
      }
    } else {
      setFeil([a.nokkel, r.nokkel]); setStraff((p) => p + 1000); setValgt(null);
      setTimeout(() => setFeil([]), 450);
    }
  };

  const nyttSpill = () => {
    setBrett(lagBrett(temaer)); setValgt(null); setBorte(new Set()); setStraff(0); setStart(null); setSlutt(null); setNaa(0);
  };

  const nyRekord = ferdig && (rekordFor.current === undefined || tid < rekordFor.current);

  const ruter = useMemo(() => brett, [brett]);
  return (
    <div className="fokus-innhold">
      <div className="match-topp">
        <span className="klokke">{fmt(tid)}</span>
        <span className="liten dempet">{rekord !== undefined ? `Rekord: ${fmt(rekord)}` : 'Ingen rekord ennå'}{straff > 0 ? ` · +${straff / 1000} s straff` : ''}</span>
      </div>
      {!ferdig ? (
        <>
          <div className="match-brett">
            {ruter.map((r) => (
              <button key={r.nokkel}
                className={`match-rute ${r.erTerm ? 'term' : 'def'} ${valgt === r.nokkel ? 'valgt' : ''} ${feil.includes(r.nokkel) ? 'feil' : ''} ${borte.has(r.nokkel) ? 'borte' : ''}`}
                onClick={() => trykk(r)} disabled={borte.has(r.nokkel)} aria-pressed={valgt === r.nokkel}>
                {r.tekst}
              </button>
            ))}
          </div>
          <p className="liten dempet">Trykk på et begrep og forklaringen som hører til. Klokka starter ved første trykk.</p>
        </>
      ) : (
        <div className="flate sentrert feiring">
          <Ikon navn="stjerne" stor />
          <h2>{fmt(tid)}</h2>
          <p className="dempet">{nyRekord ? 'Ny rekord!' : `Rekorden din er ${fmt(rekordFor.current!)}.`}</p>
          <div className="rad sentrert-rad">
            <button className="knapp sek" onClick={nyttSpill}>Spill igjen</button>
            <button className="knapp" onClick={onFerdig} autoFocus>Ferdig</button>
          </div>
        </div>
      )}
      <button className="lenkeknapp" onClick={onAvslutt}>Avslutt</button>
    </div>
  );
}
