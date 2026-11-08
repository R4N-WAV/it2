import { useCallback, useEffect, useMemo, useState } from 'react';
import { Code, Ikon, Merker, shuffle } from './components';
import { flashcards as alleKort } from './data/flashcards';
import { vurderKort } from './store';
import type { Flashcard, Rating } from './types';

/*
 * Lær-modus etter Quizlets modell:
 *  - Kortene tas i runder på inntil 7.
 *  - «Kunne» = mestret. «Usikker» og «Kunne ikke» legger kortet tilbake i bunken.
 *  - Når et kort kommer tilbake, får du det som flervalg, så du må vise at du kan det.
 *  - «Hopp over» legger kortet bakerst uten at det teller som feil.
 *  - Økten er ferdig først når ALLE kort er mestret minst én gang.
 */

const RUNDE = 7;
type Status = 'ny' | 'laerer' | 'mestret';

export function LaerOkt({ kort, onFerdig, onAvslutt }: { kort: Flashcard[]; onFerdig: () => void; onAvslutt: () => void }) {
  const [ko, setKo] = useState<string[]>(() => shuffle(kort.map((k) => k.id)));
  const [status, setStatus] = useState<Record<string, Status>>(() => Object.fromEntries(kort.map((k) => [k.id, 'ny'])));
  const [runde, setRunde] = useState<string[]>(() => []);
  const [rundeNr, setRundeNr] = useState(0);
  const [pos, setPos] = useState(0);
  const [snudd, setSnudd] = useState(false);
  const [mcValg, setMcValg] = useState<number | null>(null);
  const [vurdert, setVurdert] = useState<Set<string>>(() => new Set()); // første vurdering → Leitner
  const [forsok, setForsok] = useState(0);
  const [mcBom, setMcBom] = useState<Set<string>>(() => new Set()); // bommet på flervalg → vis som kort først
  const [fase, setFase] = useState<'start' | 'kort' | 'rundeslutt' | 'ferdig'>('start');

  const byId = useMemo(() => Object.fromEntries(kort.map((k) => [k.id, k])), [kort]);
  const antall = (s: Status) => kort.filter((k) => status[k.id] === s).length;

  const startRunde = useCallback((k: string[]) => {
    const neste = k.filter((id) => status[id] !== 'mestret').slice(0, RUNDE);
    if (neste.length === 0) { setFase('ferdig'); return; }
    setRunde(neste); setPos(0); setSnudd(false); setMcValg(null); setRundeNr((n) => n + 1); setFase('kort');
  }, [status]);

  const id = runde[pos];
  const k = id ? byId[id] : undefined;
  // Kort du har bommet på kommer tilbake som flervalg (når settet er stort nok)
  const somFlervalg = !!k && status[k.id] === 'laerer' && !mcBom.has(k.id) && kort.length >= 4;
  const alternativer = useMemo(() => {
    if (!k || !somFlervalg) return [];
    const samme = alleKort.filter((x) => x.id !== k.id && x.tema === k.tema);
    const andre = alleKort.filter((x) => x.id !== k.id && x.tema !== k.tema);
    const distraktorer = shuffle(samme).concat(shuffle(andre)).slice(0, 3).map((x) => x.svar);
    return shuffle([k.svar, ...distraktorer]);
  }, [k, somFlervalg]);

  const gaVidere = useCallback((ko2: string[]) => {
    if (pos + 1 < runde.length) { setPos(pos + 1); setSnudd(false); setMcValg(null); }
    else { setKo(ko2); setFase('rundeslutt'); }
  }, [pos, runde.length]);

  const svar = useCallback((r: Rating) => {
    if (!k) return;
    setForsok((f) => f + 1);
    if (!vurdert.has(k.id)) { vurderKort(k.id, r); setVurdert(new Set(vurdert).add(k.id)); }
    const nyStatus: Status = r === 2 ? 'mestret' : 'laerer';
    const bom = new Set(mcBom);
    if (somFlervalg && r !== 2) bom.add(k.id); else bom.delete(k.id);
    setMcBom(bom);
    setStatus((s) => ({ ...s, [k.id]: nyStatus }));
    // Fjern fra køen og legg bakerst hvis ikke mestret
    const uten = ko.filter((x) => x !== k.id);
    gaVidere(nyStatus === 'mestret' ? uten : [...uten, k.id]);
  }, [k, ko, vurdert, gaVidere, mcBom, somFlervalg]);

  const hoppOver = useCallback(() => {
    if (!k) return;
    gaVidere([...ko.filter((x) => x !== k.id), k.id]);
  }, [k, ko, gaVidere]);

  // Tastatur (PC): mellomrom = snu, 1/2/3 = vurder, S = hopp over
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (fase !== 'kort' || !k) return;
      if (somFlervalg) {
        if (mcValg === null && ['1', '2', '3', '4'].includes(e.key)) setMcValg(Number(e.key) - 1);
        else if (mcValg !== null && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); svar(alternativer[mcValg] === k.svar ? 2 : 0); }
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!snudd) setSnudd(true); }
      else if (snudd && e.key === '1') svar(0);
      else if (snudd && e.key === '2') svar(1);
      else if (snudd && e.key === '3') svar(2);
      else if (e.key.toLowerCase() === 's') hoppOver();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [fase, k, snudd, somFlervalg, mcValg, alternativer, svar, hoppOver]);

  const fremdrift = (
    <div className="laer-fremdrift" aria-label="Fremdrift">
      <div className="segment">
        <span className="seg-mestret" style={{ flex: antall('mestret') }} />
        <span className="seg-laerer" style={{ flex: antall('laerer') }} />
        <span className="seg-ny" style={{ flex: antall('ny') }} />
      </div>
      <div className="seg-tekst">
        <span><i className="prikk mestret" />{antall('mestret')} mestret</span>
        <span><i className="prikk laerer" />{antall('laerer')} lærer</span>
        <span><i className="prikk ny" />{antall('ny')} ikke sett</span>
      </div>
    </div>
  );

  if (fase === 'start') {
    return (
      <div className="fokus-innhold">
        <div className="flate sentrert">
          <Ikon navn="kort" stor />
          <h2>{kort.length} kort</h2>
          <p className="dempet">Tenk ut svaret før du snur kortet. Kort du ikke kan, kommer tilbake til du har klart alle minst én gang.</p>
          <p className="liten tast-hint">PC: <kbd>Mellomrom</kbd> snu · <kbd>1</kbd> kunne ikke · <kbd>2</kbd> usikker · <kbd>3</kbd> kunne · <kbd>S</kbd> hopp over</p>
          <button className="knapp stor" onClick={() => startRunde(ko)} autoFocus>Start</button>
        </div>
      </div>
    );
  }

  const alleMestret = antall('mestret') === kort.length;
  if (fase === 'ferdig' || (fase === 'rundeslutt' && alleMestret)) {
    return (
      <div className="fokus-innhold">
        <div className="flate sentrert feiring">
          <Ikon navn="stjerne" stor />
          <h2>Alle {kort.length} kort er mestret!</h2>
          <p className="dempet">{forsok} svar på {rundeNr} {rundeNr === 1 ? 'runde' : 'runder'}. Kortene du slet med, dukker opp igjen i repetisjonen senere.</p>
          <button className="knapp stor" onClick={onFerdig} autoFocus>Fullfør</button>
        </div>
      </div>
    );
  }

  if (fase === 'rundeslutt') {
    const igjen = kort.length - antall('mestret');
    return (
      <div className="fokus-innhold">
        {fremdrift}
        <div className="flate sentrert">
          <h2>Runde {rundeNr} ferdig</h2>
          <p className="dempet">{antall('mestret')} av {kort.length} kort mestret. {igjen > 0 ? `${igjen} igjen – de du bommet på kommer nå som flervalg.` : ''}</p>
          <div className="rad sentrert-rad">
            <button className="knapp stor" onClick={() => startRunde(ko)} autoFocus>{igjen > 0 ? 'Neste runde' : 'Fullfør'}</button>
          </div>
        </div>
      </div>
    );
  }

  if (!k) return null;
  return (
    <div className="fokus-innhold">
      {fremdrift}
      <p className="liten dempet">Runde {rundeNr} · kort {pos + 1} av {runde.length}</p>

      {somFlervalg ? (
        <div className="flate">
          <Merker tema={k.tema} km={k.km} eksamen={k.eksamen} niva={k.niva} />
          <p className="etikett">Velg riktig svar</p>
          <h2 className="kort-sporsmal">{k.sporsmal}</h2>
          <div className="alternativer">
            {alternativer.map((a, i) => {
              const cls = mcValg === null ? '' : a === k.svar ? 'riktig' : mcValg === i ? 'feil' : 'dempet-alt';
              return (
                <button key={i} className={`alt ${cls}`} disabled={mcValg !== null} onClick={() => setMcValg(i)}>
                  <span className="alt-nr">{i + 1}</span><span>{a}</span>
                </button>
              );
            })}
          </div>
          {mcValg !== null && (
            <div className={`tilbakemelding ${alternativer[mcValg] === k.svar ? 'ok' : 'nei'}`}>
              <b>{alternativer[mcValg] === k.svar ? 'Riktig – kortet er mestret.' : 'Ikke riktig – kortet kommer igjen.'}</b>
              {k.eksempel && <Code>{k.eksempel}</Code>}
              <button className="knapp" onClick={() => svar(alternativer[mcValg] === k.svar ? 2 : 0)} autoFocus>Fortsett</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button className={`flippkort ${snudd ? 'snudd' : ''}`} onClick={() => setSnudd(!snudd)} aria-label={snudd ? 'Vis spørsmålet' : 'Vis svaret'}>
            <div className="flipp-indre">
              <div className="flipp-side forside">
                <Merker tema={k.tema} km={k.km} eksamen={k.eksamen} niva={k.niva} />
                <h2 className="kort-sporsmal">{k.sporsmal}</h2>
                <span className="liten dempet">Trykk for å snu</span>
              </div>
              <div className="flipp-side bakside">
                <p className="liten dempet bakside-sporsmal">{k.sporsmal}</p>
                <div className="svar">{k.svar}</div>
                {k.eksempel && <Code>{k.eksempel}</Code>}
                {k.forklaring && <p className="liten">{k.forklaring}</p>}
                {k.vanligeFeil && <p className="liten"><b>Vanlig feil:</b> {k.vanligeFeil}</p>}
              </div>
            </div>
          </button>
          {snudd ? (
            <div className="vurdering">
              <button className="knapp rod" onClick={() => svar(0)}>Kunne ikke</button>
              <button className="knapp gul" onClick={() => svar(1)}>Usikker</button>
              <button className="knapp gronn" onClick={() => svar(2)}>Kunne</button>
            </div>
          ) : (
            <div className="rad mellom">
              <button className="knapp sek" onClick={hoppOver}>Hopp over</button>
              <button className="knapp" onClick={() => setSnudd(true)}>Vis svar</button>
            </div>
          )}
        </>
      )}
      <button className="lenkeknapp" onClick={onAvslutt}>Avslutt økten (steget blir ikke fullført)</button>
    </div>
  );
}
