import { useEffect, useRef, useState } from 'react';
import { Fremdrift, Ikon } from './components';
import { leksjoner, type Leksjon, type Sjekk } from './kurs';
import { Inline, Md } from './Md';
import { plan } from './data/plan';
import { erLest, fullforLeksjon, lagreLesePosisjon, useData } from './store';
import type { AppData } from './types';

/* ---------- Kontrollspørsmål på slutten av en side ---------- */
function SjekkBoks({ sjekk, onKlar }: { sjekk: Sjekk; onKlar: () => void }) {
  const [feil, setFeil] = useState<number[]>([]);
  const [riktig, setRiktig] = useState(false);
  const vist = riktig || feil.length >= 2;

  const velg = (i: number) => {
    if (vist || feil.includes(i)) return;
    if (i === sjekk.riktig) setRiktig(true);
    else setFeil([...feil, i]);
  };
  useEffect(() => { if (vist) onKlar(); }, [vist, onKlar]);

  return (
    <section className="sjekk-boks" aria-label="Sjekk at du forstod">
      <p className="etikett">Sjekk at du forstod</p>
      <Md tekst={sjekk.sporsmal} />
      <div className="alternativer">
        {sjekk.alternativer.map((a, i) => {
          const cls = vist && i === sjekk.riktig ? 'riktig' : feil.includes(i) ? 'feil' : '';
          return (
            <button key={i} className={`alt ${cls}`} disabled={vist || feil.includes(i)} onClick={() => velg(i)}>
              <span><Inline tekst={a} /></span>
            </button>
          );
        })}
      </div>
      {!vist && feil.length === 1 && (
        <div className="tilbakemelding nei"><b>Ikke helt.</b><p>Les teksten over en gang til og prøv igjen.</p></div>
      )}
      {vist && (
        <div className={`tilbakemelding ${riktig ? 'ok' : 'nei'}`}>
          <b>{riktig ? (feil.length ? '✓ Riktig nå' : '✓ Riktig') : 'Riktig svar er markert i grønt'}</b>
          {sjekk.forklaring && <Md tekst={sjekk.forklaring} />}
        </div>
      )}
    </section>
  );
}

/* ---------- Én leksjon, side for side ---------- */
export function LeksjonLeser({ leksjon, onFerdig, onAvslutt }: { leksjon: Leksjon; onFerdig: () => void; onAvslutt: () => void }) {
  const d = useData();
  const tidligere = d.leksjoner[leksjon.id];
  const [side, setSide] = useState(() => (tidligere && !tidligere.ferdig ? Math.min(tidligere.side, leksjon.sider.length - 1) : 0));
  const [klar, setKlar] = useState<Record<number, boolean>>({});
  const [ferdig, setFerdig] = useState(false);
  const topp = useRef<HTMLDivElement>(null);
  const s = leksjon.sider[side];
  const kanGaVidere = !s.sjekk || klar[side];

  const gaTil = (n: number) => {
    setSide(n);
    lagreLesePosisjon(leksjon.id, n);
    topp.current?.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  };
  const neste = () => {
    if (side < leksjon.sider.length - 1) gaTil(side + 1);
    else { fullforLeksjon(leksjon.id); setFerdig(true); window.scrollTo(0, 0); }
  };

  if (ferdig) {
    return (
      <div className="fokus-innhold">
        <div className="flate sentrert">
          <Ikon navn="sjekk" stor />
          <h2>Leksjonen er lest</h2>
          <p className="dempet">{leksjon.mal}</p>
          <p className="liten">Nå er du klar til å øve på dette. Du kan alltid åpne leksjonen igjen fra «Lær».</p>
          <button className="knapp stor" onClick={onFerdig} autoFocus>Fortsett</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fokus-innhold leksjon" ref={topp}>
      <div className="leksjon-topp">
        <p className="etikett">Leksjon {leksjon.nr} · side {side + 1} av {leksjon.sider.length}</p>
        <Fremdrift verdi={(side + 1) / leksjon.sider.length} />
      </div>
      {side === 0 && leksjon.mal && (
        <p className="leksjon-mal"><b>Etter denne leksjonen skal du kunne:</b> {leksjon.mal}</p>
      )}
      <article className="flate leksjon-side">
        {s.tittel && <h2 className="leksjon-sidetittel">{s.tittel}</h2>}
        <Md tekst={s.md} />
        {s.sjekk && <SjekkBoks key={`${leksjon.id}-${side}`} sjekk={s.sjekk} onKlar={() => setKlar((k) => (k[side] ? k : { ...k, [side]: true }))} />}
      </article>
      <div className="leksjon-knapper">
        {side > 0 ? <button className="knapp sek" onClick={() => gaTil(side - 1)}><Ikon navn="tilbake" /> Forrige</button> : <button className="knapp sek" onClick={onAvslutt}>Avslutt</button>}
        <button className="knapp" onClick={neste} disabled={!kanGaVidere}>
          {side < leksjon.sider.length - 1 ? <>Neste <Ikon navn="pil" /></> : <>Ferdig <Ikon navn="sjekk" /></>}
        </button>
      </div>
      {!kanGaVidere && <p className="liten sentrert-tekst">Svar på spørsmålet for å gå videre.</p>}
    </div>
  );
}

/* ---------- Hele leksjonen på én side (oppslag/repetisjon) ---------- */
export function LeksjonOppslag({ leksjon, onLukk }: { leksjon: Leksjon; onLukk: () => void }) {
  return (
    <div className="fokus-innhold leksjon">
      <p className="leksjon-mal"><b>Mål:</b> {leksjon.mal}</p>
      {leksjon.sider.map((s, i) => (
        <article key={i} className="flate leksjon-side">
          {s.tittel && <h2 className="leksjon-sidetittel">{s.tittel}</h2>}
          <Md tekst={s.md} />
          {s.sjekk && (
            <details className="sjekk-boks">
              <summary>Kontrollspørsmål: <Inline tekst={s.sjekk.sporsmal.split('\n')[0]} /></summary>
              <Md tekst={s.sjekk.sporsmal.split('\n').slice(1).join('\n')} />
              <p><b>Svar:</b> <Inline tekst={s.sjekk.alternativer[s.sjekk.riktig]} /></p>
              <Md tekst={s.sjekk.forklaring} />
            </details>
          )}
        </article>
      ))}
      <button className="knapp" onClick={onLukk}>Lukk</button>
    </div>
  );
}

/* ---------- Lese-steget i studieplanen: flere leksjoner etter hverandre ---------- */
export function LesOkt({ dagNr, onFerdig, onAvslutt }: { dagNr: number; onFerdig: () => void; onAvslutt: () => void }) {
  const d = useData();
  // Uleste leksjoner fra tidligere dager tas først – kurset bygger på seg selv.
  const [etterslep] = useState(() => leksjoner.filter((l) => l.dag < dagNr && !erLest(d, l.id)));
  const liste = [...etterslep, ...leksjoner.filter((l) => l.dag === dagNr)];
  const [aktiv, setAktiv] = useState<Leksjon | null>(null);
  const neste = liste.find((l) => !erLest(d, l.id));

  if (aktiv) return <LeksjonLeser key={aktiv.id} leksjon={aktiv} onFerdig={() => setAktiv(null)} onAvslutt={() => setAktiv(null)} />;

  return (
    <div className="fokus-innhold">
      <div className="flate">
        <h2>Les før du øver</h2>
        <p className="dempet">
          Her lærer du stoffet du skal øve på i dag. Les én leksjon om gangen, i rekkefølge. Svar på spørsmålene underveis – de sjekker at du har forstått før du går videre.
        </p>
        {etterslep.length > 0 && (
          <p className="status-linje advar">
            <Ikon navn="advarsel" /> Du har {etterslep.length} {etterslep.length === 1 ? 'ulest leksjon' : 'uleste leksjoner'} fra tidligere dager. Dagens stoff bygger på dem, så de står først.
          </p>
        )}
        <ol className="les-liste">
          {liste.map((l) => {
            const lest = erLest(d, l.id);
            const paabegynt = !lest && (d.leksjoner[l.id]?.side ?? 0) > 0;
            return (
              <li key={l.id}>
                <button className={`les-rad ${lest ? 'lest' : ''} ${l === neste ? 'neste-les' : ''}`} onClick={() => setAktiv(l)}>
                  <span className="les-status">{lest ? <Ikon navn="sjekk" /> : l.nr}</span>
                  <span className="les-tekst"><b>{l.tittel}</b><span className="liten">{l.minutter} min{paabegynt ? ' · påbegynt' : ''}{lest ? ' · lest' : ''}</span></span>
                  <Ikon navn="pil" />
                </button>
              </li>
            );
          })}
        </ol>
        {neste ? (
          <button className="knapp stor" onClick={() => setAktiv(neste)} autoFocus>
            <Ikon navn="spill" /> {(d.leksjoner[neste.id]?.side ?? 0) > 0 ? 'Fortsett' : 'Start'}: {neste.tittel}
          </button>
        ) : (
          <button className="knapp stor gronn" onClick={onFerdig} autoFocus><Ikon navn="sjekk" /> Alt er lest – gå videre</button>
        )}
        <button className="lenkeknapp" onClick={onAvslutt}>Ta en pause (fremdriften lagres)</button>
      </div>
    </div>
  );
}

/* ---------- «Lær»-siden: hele kurset ---------- */
const nesteLeksjon = (d: AppData) => leksjoner.find((l) => !erLest(d, l.id)) ?? null;

export function KursSide({ d, apneLeksjon, apneOppslag }: { d: AppData; apneLeksjon: (l: Leksjon) => void; apneOppslag: (l: Leksjon) => void }) {
  const lest = leksjoner.filter((l) => erLest(d, l.id)).length;
  const neste = nesteLeksjon(d);
  const dager = plan.filter((p) => leksjoner.some((l) => l.dag === p.dagNr));

  return (
    <div className="stack">
      <div className="side-topp">
        <h1>Lær faget</h1>
        <p className="dempet">
          Et kurs fra null: du trenger ingen bakgrunn i programmering. Leksjonene bygger på hverandre, så les dem i rekkefølge.
          Hver dag i studieplanen starter med dagens leksjoner – først lærer du, så øver du.
        </p>
      </div>

      <section className="helt">
        <p className="etikett lys">{lest} av {leksjoner.length} leksjoner lest</p>
        <div className="helt-fremdrift"><Fremdrift verdi={leksjoner.length ? lest / leksjoner.length : 0} /></div>
        {neste ? (
          <div className="neste">
            <div className="neste-info">
              <span className="neste-ikon"><Ikon navn="bok" /></span>
              <div>
                <p className="etikett lys">{(d.leksjoner[neste.id]?.side ?? 0) > 0 ? 'Fortsett der du slapp' : 'Neste leksjon'} · ca. {neste.minutter} min</p>
                <p className="neste-tittel">{neste.nr}. {neste.tittel}</p>
              </div>
            </div>
            <button className="knapp stor lys-knapp" onClick={() => apneLeksjon(neste)}><Ikon navn="spill" /> Les</button>
          </div>
        ) : (
          <p>Du har lest hele kurset. Bruk «Les alt» på en leksjon for rask repetisjon.</p>
        )}
      </section>

      {dager.map((p) => (
        <section key={p.dagNr} className="flate" aria-labelledby={`kurs-dag-${p.dagNr}`}>
          <h2 id={`kurs-dag-${p.dagNr}`} className="seksjon-tittel">Dag {p.dagNr} · {p.tittel}</h2>
          <ol className="les-liste">
            {leksjoner.filter((l) => l.dag === p.dagNr).map((l) => {
              const er = erLest(d, l.id);
              const paabegynt = !er && (d.leksjoner[l.id]?.side ?? 0) > 0;
              return (
                <li key={l.id} className="les-linje">
                  <button className={`les-rad ${er ? 'lest' : ''} ${l === neste ? 'neste-les' : ''}`} onClick={() => apneLeksjon(l)}>
                    <span className="les-status">{er ? <Ikon navn="sjekk" /> : l.nr}</span>
                    <span className="les-tekst"><b>{l.tittel}</b><span className="liten">{l.minutter} min · {l.sider.length} sider{paabegynt ? ' · påbegynt' : ''}</span></span>
                    <Ikon navn="pil" />
                  </button>
                  {er && <button className="knapp sek liten-knapp" onClick={() => apneOppslag(l)}>Les alt</button>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
