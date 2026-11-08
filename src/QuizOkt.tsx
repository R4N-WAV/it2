import { useState } from 'react';
import { QuizRunner } from './components';
import { topicNavn } from './data/topics';
import { registrerQuiz } from './store';
import type { QuizItem } from './types';

/**
 * Øvingsøkt: feil svar legges bakerst og kommer én gang til («Prøv igjen»).
 * Testmodus: ingen ny sjanse – scoren sammenlignes med kravet.
 * Score = andel riktige på første forsøk.
 */
export function QuizOkt({ items, modus, krav, onFerdig, onAvslutt, onLagre }: {
  items: QuizItem[];
  modus: 'ov' | 'test';
  krav?: number;
  onFerdig: (score: number) => void;
  onAvslutt: () => void;
  onLagre?: (score: number) => void; // lagre resultat uten å lukke (ta testen på nytt)
}) {
  const [ko, setKo] = useState<{ item: QuizItem; igjen: boolean }[]>(() => items.map((item) => ({ item, igjen: false })));
  const [pos, setPos] = useState(0);
  const [forste, setForste] = useState<Record<string, boolean>>({});
  const [ferdig, setFerdig] = useState(false);
  const [noekkel, setNoekkel] = useState(0);

  if (items.length === 0) {
    return <div className="fokus-innhold"><div className="flate"><p>Ingen oppgaver her.</p><button className="knapp" onClick={() => onFerdig(1)}>Tilbake</button></div></div>;
  }

  const riktige = Object.values(forste).filter(Boolean).length;
  const score = riktige / items.length;

  if (ferdig) {
    const bestatt = krav === undefined || score >= krav - 1e-9;
    const feil = items.filter((q) => forste[q.id] === false);
    return (
      <div className="fokus-innhold">
        <div className={`flate sentrert ${bestatt ? 'feiring' : ''}`}>
          <div className={`resultat-ring ${bestatt ? 'ok' : 'nei'}`}>{Math.round(score * 100)} %</div>
          <h2>{riktige} av {items.length} riktige på første forsøk</h2>
          {modus === 'test' && krav !== undefined && (
            <p>{bestatt ? `Målet (${Math.round(krav * 100)} %) er nådd.` : `Målet er ${Math.round(krav * 100)} %. Repeter temaene under og ta testen på nytt.`}</p>
          )}
          {feil.length > 0 && (
            <div className="venstre">
              <p className="etikett">Dette bør du se på igjen</p>
              <ul>{feil.map((q) => <li key={q.id}>{topicNavn(q.tema)}: {q.sporsmal.split('\n')[0].slice(0, 90)}</li>)}</ul>
            </div>
          )}
          <div className="rad sentrert-rad">
            {modus === 'test' && !bestatt && (
              <button className="knapp sek" onClick={() => { onLagre?.(score); setKo(items.map((item) => ({ item, igjen: false }))); setPos(0); setForste({}); setFerdig(false); setNoekkel((n) => n + 1); }}>
                Lagre og ta testen på nytt
              </button>
            )}
            <button className="knapp" onClick={() => onFerdig(score)} autoFocus>Fullfør</button>
          </div>
        </div>
      </div>
    );
  }

  const { item, igjen } = ko[pos];
  const unikeFerdig = Object.keys(forste).length;
  return (
    <div className="fokus-innhold">
      <div className="laer-fremdrift">
        <div className="segment"><span className="seg-mestret" style={{ flex: unikeFerdig }} /><span className="seg-ny" style={{ flex: items.length - unikeFerdig }} /></div>
        <div className="seg-tekst"><span>{unikeFerdig} av {items.length}</span>{modus === 'test' && <span>Test – ingen ny sjanse</span>}{igjen && <span className="merke viktig">Prøv igjen</span>}</div>
      </div>
      <QuizRunner key={`${item.id}-${pos}-${noekkel}`} item={item}
        onSvar={(ok) => {
          if (!(item.id in forste)) { setForste((f) => ({ ...f, [item.id]: ok })); registrerQuiz(item.id, ok); }
          if (!ok && modus === 'ov' && !igjen) setKo((k) => [...k, { item, igjen: true }]);
        }}
        onNeste={() => { if (pos + 1 >= ko.length) setFerdig(true); else setPos(pos + 1); }} />
      <button className="lenkeknapp" onClick={onAvslutt}>Avslutt (steget blir ikke fullført)</button>
    </div>
  );
}
