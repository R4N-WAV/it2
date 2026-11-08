import { useCallback, useEffect, useState } from 'react';
import { Ikon } from './components';

/*
 * Enkel PIN-lås. Merk: siden er statisk (GitHub Pages), så låsen holder tilfeldige besøkende
 * og roboter ute, men er ikke ekte sikkerhet. Fremdriften ligger uansett bare i din egen nettleser.
 * PIN-koden lagres ikke i klartekst – bare en SHA-256-hash.
 */
const PIN_HASH = '63de8cd1ce2ab18639401c7376ec7a816d4642b005bba4dc1412f52191532903';
const NOKKEL = 'it2-ulast';

async function hash(pin: string) {
  const data = new TextEncoder().encode('it2-eksamenstrener:' + pin);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function erUlast() {
  try { return sessionStorage.getItem(NOKKEL) === '1'; } catch { return false; }
}
export function laas() {
  try { sessionStorage.removeItem(NOKKEL); } catch { /* ignorer */ }
  location.reload();
}

export function LaasSkjerm({ onUlast }: { onUlast: () => void }) {
  const [pin, setPin] = useState('');
  const [feil, setFeil] = useState(false);
  const [sjekker, setSjekker] = useState(false);

  const prov = useCallback(async (p: string) => {
    setSjekker(true);
    let ok = false;
    try { ok = (await hash(p)) === PIN_HASH; } catch { ok = false; }
    setSjekker(false);
    if (ok) {
      try { sessionStorage.setItem(NOKKEL, '1'); } catch { /* ignorer */ }
      onUlast();
    } else {
      setFeil(true);
      setTimeout(() => { setFeil(false); setPin(''); }, 600);
    }
  }, [onUlast]);

  const trykk = useCallback((t: string) => {
    if (sjekker || feil) return;
    if (t === 'slett') { setPin(pin.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const ny = pin + t;
    setPin(ny);
    if (ny.length === 4) void prov(ny);
  }, [pin, sjekker, feil, prov]);

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) trykk(e.key);
      else if (e.key === 'Backspace') trykk('slett');
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [trykk]);

  return (
    <div className="laas">
      <div className="laas-boks">
        <div className="laas-ikon"><Ikon navn="laas" /></div>
        <h1>IT2 Eksamenstrener</h1>
        <p className="dempet">Skriv inn PIN-koden</p>
        <div className={`pin-prikker ${feil ? 'rist' : ''}`} aria-live="polite" aria-label={`${pin.length} av 4 siffer`}>
          {[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? 'fylt' : ''} />)}
        </div>
        <p className="pin-feil" role="alert">{feil ? 'Feil PIN-kode. Prøv igjen.' : ' '}</p>
        <div className="tastatur">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((t) => <button key={t} onClick={() => trykk(t)}>{t}</button>)}
          <span />
          <button onClick={() => trykk('0')}>0</button>
          <button onClick={() => trykk('slett')} aria-label="Slett">⌫</button>
        </div>
      </div>
    </div>
  );
}
