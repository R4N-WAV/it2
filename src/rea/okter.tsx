import { useMemo, useState } from 'react';
import { Ikon, shuffle } from '../components';
import { allePraktiske, caseMedId, diagnose, kontrollsporsmal, muntlige, praktiskMedId } from './bank';
import { DIM_FOR, kmNavn } from './data/km';
import { DekningVisning, KmMerker, NivaMerke, Rubrikk, SvarBoks } from './felles';
import type { Kapittel } from './pensum';
import { leggTilFeil, lagreDiagnose, lagreVurdering, useData, vurderRep } from './store';
import { Md } from './Tekst';
import type { AppData, DimId, Drofting, EksamensCase, Kilde, KmId, MuntligSpm, Oppfolging, PraktiskOppgave, Tilleggsoppgave } from './typer';
import { antallOrdISvar, forfalteRep, lagVurdering, sjekkBegreper, snitt } from './vurdering';

/* ---------- Felles spørsmålsformat ---------- */
export interface SpmItem {
  id: string; km: KmId[]; type: MuntligSpm['type']; sporsmal: string; hint: string; begreper: string[]; momenter: string[];
  oppfolging: Oppfolging[]; svar: string; kilde: Kilde; etikett: string; niva: number;
}
export const fraMuntlig = (m: MuntligSpm): SpmItem => ({ ...m, kilde: 'muntlig', etikett: m.kilde });
export const fraTillegg = (t: Tilleggsoppgave): SpmItem => ({
  ...t, type: 'drofting', kilde: 'tillegg', etikett: 'Ukjent tilleggsoppgave',
  hint: 'Start med å gjenta hva oppgaven spør etter med egne ord. Bruk strukturen: hva – hvordan – hvorfor – eksempel – vurdering/konklusjon.',
});
export const fraDrofting = (d: Drofting): SpmItem => ({
  ...d, type: 'drofting', kilde: 'drofting', etikett: 'Drøfting',
  hint: `Bruk S-I-K-A-T. Tenk på interessenter som ${d.interessenter.slice(0, 3).join(', ')}. Ta stilling til slutt.`,
});
export const fraCaseSensor = (c: EksamensCase): SpmItem[] => c.sensor.map((s, i) => ({
  id: `${c.id}-s${i + 1}`, km: c.km, type: 'forklaring', sporsmal: s, hint: 'Svar direkte på spørsmålet først, begrunn deretter med et eksempel fra casen.',
  begreper: c.begreper, momenter: c.momenter, oppfolging: [], svar: `Se løsningsskissen for casen:\n\n${c.losning}`, kilde: 'case', etikett: `CASE ${c.nr}`, niva: 2,
}));

/* ---------- Ett sensorspørsmål ---------- */
type Fase = 'svar' | 'hint' | 'vurder' | 'oppf' | 'oppfVurder';

export function SporsmalFlyt({ item, onFerdig, utenOppfolging }: { item: SpmItem; onFerdig: (score: number) => void; utenOppfolging?: boolean }) {
  const [fase, setFase] = useState<Fase>('svar');
  const [svar, setSvar] = useState('');
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [oppfSvar, setOppfSvar] = useState('');
  const [kryss, setKryss] = useState<boolean[]>([]);
  const [oppf] = useState(() => item.oppfolging[Math.floor(Math.random() * item.oppfolging.length)]);
  const dekning = sjekkBegreper(svar, item.begreper);
  const dims = DIM_FOR[item.type];

  const send = () => {
    if (!hint && (dekning.andel < 0.4 || antallOrdISvar(svar) < 12)) setFase('hint');
    else setFase('vurder');
  };

  if (fase === 'svar' || fase === 'hint') {
    return (
      <div className="stack">
        <div className="sensor">
          <p className="etikett">Sensor spør {hint && '· nytt forsøk med hint'}</p>
          <p className="sensor-spm">{item.sporsmal}</p>
          <div className="rad"><KmMerker km={item.km} /><NivaMerke niva={item.niva} /><span className="merke">{item.etikett}</span></div>
        </div>
        {fase === 'hint' ? (
          <div className="flate">
            <p><b>Svaret ditt er foreløpig tynt</b> ({antallOrdISvar(svar)} ord, {dekning.treff.length} av {item.begreper.length} sentrale fagbegreper). Prøv igjen før du ser eksempelsvaret.</p>
            <aside className="md-boks tips"><b className="md-boks-navn">Hint</b><p>{item.hint}</p></aside>
            <div className="rad">
              <button className="knapp" onClick={() => { setHint(true); setFase('svar'); }}>Prøv igjen med hintet</button>
              <button className="knapp sek" onClick={() => setFase('vurder')}>Gå til vurdering uten nytt forsøk</button>
            </div>
          </div>
        ) : (
          <>
            <SvarBoks verdi={svar} settVerdi={setSvar} rader={7} autoFocus />
            <div className="rad mellom">
              <span className="liten dempet">Svar på spørsmålet, bruk fagbegreper, forklar hvorfor og gi et eksempel.</span>
              <button className="knapp" disabled={!svar.trim()} onClick={send}>Send svar</button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (fase === 'vurder') {
    return (
      <div className="stack">
        <div className="sensor"><p className="etikett">Spørsmål</p><p className="sensor-spm">{item.sporsmal}</p></div>
        <div className="flate"><b className="etikett">Ditt svar{hint ? ' (etter hint)' : ''}</b><p className="tekst">{svar}</p><DekningVisning d={dekning} /></div>
        <div className="flate">
          <b className="etikett">Vurderingsmomenter – kryss av det du fikk med</b>
          {item.momenter.map((m, i) => (
            <label key={i} className="sjekk"><input type="checkbox" checked={!!kryss[i]} onChange={() => { const k = [...kryss]; k[i] = !k[i]; setKryss(k); }} /> {m}</label>
          ))}
        </div>
        <details className="flate" open><summary><b>Eksempel på et godt svar (nivå 4)</b></summary><Md tekst={item.svar} /></details>
        <div className="flate">
          <Rubrikk dims={dims} svar={svar} dekning={dekning} hint={hint} onLagre={(dim) => {
            const v = lagVurdering({ kilde: item.kilde, ref: item.id, km: item.km, dim, hint, dekning: dekning.andel, svar });
            lagreVurdering(v, item.kilde === 'case' ? undefined : item.id);
            setScore(v.score);
            if (oppf && !utenOppfolging) setFase('oppf'); else onFerdig(v.score);
          }} />
        </div>
      </div>
    );
  }

  if (fase === 'oppf') {
    return (
      <div className="stack">
        <div className="sensor"><p className="etikett">Sensor følger opp</p><p className="sensor-spm">{oppf[0]}</p></div>
        <SvarBoks verdi={oppfSvar} settVerdi={setOppfSvar} rader={4} autoFocus />
        <div className="rad mellom">
          <button className="lenkeknapp" onClick={() => onFerdig(score)}>Hopp over oppfølgingen</button>
          <button className="knapp" disabled={!oppfSvar.trim()} onClick={() => setFase('oppfVurder')}>Send svar</button>
        </div>
      </div>
    );
  }

  const kort = antallOrdISvar(oppfSvar) < 8;
  return (
    <div className="stack">
      <div className="sensor"><p className="etikett">Oppfølging</p><p className="sensor-spm">{oppf[0]}</p></div>
      <div className="flate"><b className="etikett">Ditt svar</b><p className="tekst">{oppfSvar}</p></div>
      <aside className="md-boks eksempel"><b className="md-boks-navn">Svarretning</b><p>{oppf[1]}</p></aside>
      <div className="flate">
        <p>Hvor godt svarte du på oppfølgingen? {kort && <span className="advar-tekst">Kort svar – maks 2.</span>}</p>
        <div className="skala">
          {[0, 1, 2, 3, 4].map((n) => (
            <button key={n} className="skala-knapp" disabled={kort && n > 2} onClick={() => {
              lagreVurdering(lagVurdering({ kilde: item.kilde, ref: `${item.id}-oppf`, km: item.km, dim: { korrekt: n, overforing: n }, hint: false, dekning: null, svar: oppfSvar }));
              onFerdig(score);
            }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Muntlig økt (flere spørsmål) ---------- */
export function MuntligOkt({ items, onFerdig, utenOppfolging }: { items: SpmItem[]; onFerdig: () => void; utenOppfolging?: boolean }) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<number[]>([]);
  if (items.length === 0) return <div className="flate sentrert"><p>Ingen spørsmål i denne økta.</p><button className="knapp" onClick={onFerdig}>Tilbake</button></div>;
  if (i >= items.length) {
    const svake = items.filter((_, j) => res[j] < 3);
    return (
      <div className="stack">
        <div className="flate sentrert">
          <Ikon navn="sjekk" stor />
          <h2>Økta er ferdig</h2>
          <p>Snitt: <b className="tall">{(res.reduce((a, b) => a + b, 0) / res.length).toFixed(1)}</b> / 4 på {res.length} spørsmål.</p>
        </div>
        <div className="flate">
          <h3>Resultat</h3>
          <table className="tabell"><tbody>{items.map((it, j) => (
            <tr key={it.id}><td>{it.sporsmal}</td><td className="tall"><span className={`chip ${res[j] >= 3 ? 'ok' : res[j] >= 2 ? 'midt' : 'nei'}`}>{res[j].toFixed(1)}</span></td></tr>
          ))}</tbody></table>
          {svake.length > 0 && <p className="liten">{svake.length} spørsmål under nivå 3 kommer tilbake i repetisjonen snart, og er lagt i feilloggen hvis de var under 2.</p>}
        </div>
        <button className="knapp stor" onClick={onFerdig}>Ferdig</button>
      </div>
    );
  }
  return (
    <div className="stack">
      <p className="etikett">Spørsmål {i + 1} av {items.length}</p>
      <SporsmalFlyt key={items[i].id + i} item={items[i]} utenOppfolging={utenOppfolging} onFerdig={(s) => { setRes([...res, s]); setI(i + 1); window.scrollTo(0, 0); }} />
    </div>
  );
}

/* ---------- Praktisk oppgave ---------- */
const normaliser = (s: string) => s.toLowerCase().replace(/["'`\s]/g, '').replace(',', '.');

export function PraktiskFlyt({ oppgave, onFerdig }: { oppgave: PraktiskOppgave; onFerdig: (score: number) => void }) {
  const [tekst, setTekst] = useState(oppgave.start ?? '');
  const [papir, setPapir] = useState(false);
  const [fasitSvar, setFasitSvar] = useState('');
  const [levert, setLevert] = useState(false);
  const [kryss, setKryss] = useState<boolean[]>([]);
  const fasitOk = oppgave.fasit ? oppgave.fasit.godta.map(normaliser).includes(normaliser(fasitSvar)) : null;
  const dekning = sjekkBegreper(tekst, oppgave.begreper);
  const eget = tekst.trim() !== (oppgave.start ?? '').trim() ? tekst.trim() : '';
  const kanLevere = (eget.length >= 10 || (papir && eget.length >= 3)) && (!oppgave.fasit || fasitSvar.trim());
  const erKode = ['kode', 'feilsok', 'les-kode'].includes(oppgave.kategori);

  return (
    <div className="stack">
      <div className="rad"><KmMerker km={oppgave.km} /><NivaMerke niva={oppgave.niva} /><span className="merke">{oppgave.id}</span></div>
      <div className="flate"><h2>{oppgave.tittel}</h2><Md tekst={oppgave.oppgave} /></div>
      {!levert ? (
        <>
          {oppgave.fasit && (
            <label className="flate"><b>{oppgave.fasit.sporsmal}</b>
              <input className="input mono" value={fasitSvar} onChange={(e) => setFasitSvar(e.target.value)} placeholder="Ditt svar" />
            </label>
          )}
          <div>
            <p className="liten dempet">{erKode ? 'Skriv koden/forklaringen din. Du kan kjøre koden i din egen Python-installasjon (IDLE, VS Code) og lime inn resultatet.' : 'Gjør oppgaven – helst på papir slik som på eksamen – og beskriv eller skriv inn løsningen her.'}</p>
            <SvarBoks verdi={tekst} settVerdi={setTekst} rader={erKode ? 12 : 8} mono={erKode} plassholder="Ditt forsøk. Ikke se løsningen før du har levert." />
            <label className="sjekk liten"><input type="checkbox" checked={papir} onChange={() => setPapir(!papir)} /> Jeg gjorde (deler av) oppgaven på papir og beskriver den kort her</label>
          </div>
          <button className="knapp" disabled={!kanLevere} onClick={() => setLevert(true)}>Lever forsøket og se løsningsforslaget</button>
        </>
      ) : (
        <>
          {oppgave.fasit && (
            <p className={`tilbakemelding ${fasitOk ? 'ok' : 'nei'}`}><b>{fasitOk ? '✓ Riktig' : '✗ Ikke riktig'}</b> – du svarte «{fasitSvar}». Godtatt svar: <b className="mono">{oppgave.fasit.godta[0]}</b>.</p>
          )}
          <div className="flate"><b className="etikett">Ditt forsøk</b><pre className={erKode ? 'code' : 'tekst'}>{tekst}</pre><DekningVisning d={dekning} /></div>
          <div className="flate">
            <b className="etikett">Vurderingsmomenter</b>
            {oppgave.momenter.map((m, i) => (
              <label key={i} className="sjekk"><input type="checkbox" checked={!!kryss[i]} onChange={() => { const k = [...kryss]; k[i] = !k[i]; setKryss(k); }} /> {m}</label>
            ))}
          </div>
          <div className="flate"><b className="etikett">Løsningsforslag</b><Md tekst={oppgave.losning} /></div>
          <div className="flate">
            <b className="etikett">Sensor kunne fulgt opp med</b>
            <ul>{oppgave.oppfolging.map(([s, r], i) => <li key={i}>{s} <span className="dempet">– {r}</span></li>)}</ul>
          </div>
          <div className="flate">
            <Rubrikk dims={DIM_FOR.praktisk} svar={tekst} dekning={dekning} hint={false} onLagre={(dim) => {
              const d2: Partial<Record<DimId, number>> = { ...dim };
              if (fasitOk === false) d2.korrekt = Math.min(d2.korrekt ?? 0, 2);
              const v = lagVurdering({ kilde: oppgave.kategori === 'feilsok' || oppgave.kategori === 'les-kode' ? 'feilsok' : 'praktisk', ref: oppgave.id, km: oppgave.km, dim: d2, hint: false, dekning: dekning.andel, svar: tekst });
              lagreVurdering(v, oppgave.id);
              onFerdig(v.score);
            }} />
            {fasitOk === false && <p className="liten advar-tekst">Feil på den automatiske sjekken: faglig korrekthet settes til maks 2.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export function PraktiskOkt({ ids, onFerdig }: { ids: string[]; onFerdig: () => void }) {
  const liste = ids.map(praktiskMedId).filter((x): x is PraktiskOppgave => !!x);
  const [i, setI] = useState(0);
  if (i >= liste.length) return <div className="flate sentrert"><Ikon navn="sjekk" stor /><h2>Oppgavene er gjort</h2><button className="knapp stor" onClick={onFerdig}>Ferdig</button></div>;
  return (
    <div className="stack">
      <div className="rad mellom"><p className="etikett">Oppgave {i + 1} av {liste.length}</p><button className="lenkeknapp" onClick={() => setI(i + 1)}>Hopp over</button></div>
      <PraktiskFlyt key={liste[i].id} oppgave={liste[i]} onFerdig={() => { setI(i + 1); window.scrollTo(0, 0); }} />
    </div>
  );
}

/* ---------- Case uten tidspress ---------- */
export function CaseVisning({ c }: { c: EksamensCase }) {
  return (
    <div className="flate case">
      <p className="etikett">CASE {c.nr} · original treningsoppgave</p>
      <h2>{c.tittel}</h2>
      <KmMerker km={c.km} />
      <Md tekst={c.innledning} />
      <p><b>Du skal:</b></p>
      <ol>{c.duSkal.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <aside className="md-boks eksamen"><b className="md-boks-navn">Praktisk innslag</b><p>{c.praktisk}</p></aside>
    </div>
  );
}

export function CaseOving({ caseId, onFerdig }: { caseId: string; onFerdig: () => void }) {
  const c = caseMedId(caseId)!;
  const [tekst, setTekst] = useState('');
  const [fase, setFase] = useState<'arbeid' | 'vurder' | 'sensor'>('arbeid');
  const dekning = sjekkBegreper(tekst, c.begreper);
  if (fase === 'sensor') return <MuntligOkt items={fraCaseSensor(c)} utenOppfolging onFerdig={onFerdig} />;
  return (
    <div className="stack">
      <CaseVisning c={c} />
      {fase === 'arbeid' ? (
        <>
          <p className="liten dempet">Uten tidspress: lag modell, funksjon, test og begrunnelse. Tegn på papir og skriv hovedpunktene her. Løsningsskissen vises når du leverer.</p>
          <SvarBoks verdi={tekst} settVerdi={setTekst} rader={14} />
          <button className="knapp" disabled={antallOrdISvar(tekst) < 20} onClick={() => setFase('vurder')}>Lever (minst 20 ord) og se løsningsskissen</button>
        </>
      ) : (
        <>
          <div className="flate"><b className="etikett">Ditt arbeid</b><p className="tekst">{tekst}</p><DekningVisning d={dekning} /></div>
          <div className="flate"><b className="etikett">Løsningsskisse</b><Md tekst={c.losning} /><p><b>Kjennetegn på et godt svar:</b> {c.kjennetegn}</p></div>
          <div className="flate"><b className="etikett">Vurderingsmomenter</b><ul>{c.momenter.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
          <div className="flate">
            <Rubrikk dims={DIM_FOR.alle} svar={tekst} dekning={dekning} hint={false} knapp="Lagre og øv på sensorspørsmålene" onLagre={(dim) => {
              lagreVurdering(lagVurdering({ kilde: 'case', ref: c.id, km: c.km, dim, hint: false, dekning: dekning.andel, svar: tekst }));
              setFase('sensor');
            }} />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Kapittelkontroll: lukk teksten, forklar, oppfølging, praktisk ---------- */
export function Kapittelkontroll({ kap, onFerdig }: { kap: Kapittel; onFerdig: () => void }) {
  const d = useData();
  const [steg, setSteg] = useState<'forklar' | 'vurder' | 'oppf' | 'praktisk' | 'ferdig'>('forklar');
  const [tekst, setTekst] = useState('');
  const kapSpm = muntlige.filter((m) => m.kap === kap.nr);
  const begreper = useMemo(() => [...new Set(kapSpm.flatMap((m) => m.begreper))].slice(0, 10), [kapSpm]);
  const oppf = useMemo(() => {
    const usett = kapSpm.filter((m) => !d.rep[m.id]);
    return shuffle(usett.length >= 2 ? usett : kapSpm).slice(0, 2).map(fraMuntlig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kap.id]);
  const praktisk = useMemo(() => {
    const kand = allePraktiske.filter((p) => p.km.some((k) => kap.km.includes(k)));
    const ugjort = kand.filter((p) => !d.rep[p.id]);
    return shuffle(ugjort.length ? ugjort : kand)[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kap.id]);
  const dekning = sjekkBegreper(tekst, begreper);

  if (steg === 'forklar') return (
    <div className="stack">
      <div className="flate fremhevet">
        <p className="etikett">Steg 1 av 3 · Teksten er lukket</p>
        <h2>Forklar hovedideen i «{kap.tittel}» med egne ord</h2>
        <p>Ikke se i teksten. Forklar høyt i 60–120 sekunder som om du underviste en medelev: hva er det, hvordan virker det, hvorfor er det viktig, et eksempel og en begrensning.</p>
      </div>
      <SvarBoks verdi={tekst} settVerdi={setTekst} rader={9} autoFocus />
      <button className="knapp" disabled={!tekst.trim()} onClick={() => setSteg('vurder')}>Ferdig – vurder forklaringen</button>
    </div>
  );
  if (steg === 'vurder') return (
    <div className="stack">
      <div className="flate"><b className="etikett">Din forklaring</b><p className="tekst">{tekst}</p>{begreper.length > 0 && <DekningVisning d={dekning} />}</div>
      <div className="flate"><b className="etikett">Sjekk mot huskelisten</b><Md tekst={kap.seksjoner.find((s) => s.tittel === 'Huskeliste')?.md ?? ''} /></div>
      <div className="flate">
        <Rubrikk dims={DIM_FOR.forklaring} svar={tekst} dekning={begreper.length ? dekning : null} hint={false} knapp="Lagre og gå til oppfølgingsspørsmål" onLagre={(dim) => {
          lagreVurdering(lagVurdering({ kilde: 'kapittel', ref: kap.id, km: kap.km, dim, hint: false, dekning: begreper.length ? dekning.andel : null, svar: tekst }));
          setSteg(oppf.length ? 'oppf' : praktisk ? 'praktisk' : 'ferdig');
        }} />
      </div>
    </div>
  );
  if (steg === 'oppf') return (
    <div className="stack"><p className="etikett">Steg 2 av 3 · Oppfølgingsspørsmål</p>
      <MuntligOkt items={oppf} utenOppfolging onFerdig={() => setSteg(praktisk ? 'praktisk' : 'ferdig')} /></div>
  );
  if (steg === 'praktisk' && praktisk) return (
    <div className="stack"><p className="etikett">Steg 3 av 3 · Praktisk/anvendt oppgave</p>
      <PraktiskFlyt oppgave={praktisk} onFerdig={() => setSteg('ferdig')} /></div>
  );
  return (
    <div className="flate sentrert">
      <Ikon navn="sjekk" stor />
      <h2>Kapittelkontrollen er gjennomført</h2>
      <p>Resultatene er lagret per kompetansemål. Husk: å ha lest kapittelet teller ikke som mestring – det er disse svarene som gjør det.</p>
      <button className="knapp stor" onClick={onFerdig}>Ferdig</button>
    </div>
  );
}

/* ---------- Diagnose ---------- */
export function DiagnoseOkt({ onFerdig }: { onFerdig: () => void }) {
  const [i, setI] = useState(0);
  const [svar, setSvar] = useState<Record<string, boolean>>({});
  const [usikker, setUsikker] = useState('');
  if (i < diagnose.length) {
    const q = diagnose[i];
    return (
      <div className="stack">
        <p className="etikett">Kartlegging · spørsmål {i + 1} av {diagnose.length} · ingen hjelp, ingen fasit underveis</p>
        <div className="flate">
          <p className="sensor-spm">{q.sporsmal}</p>
          {q.kode && <pre className="code">{q.kode}</pre>}
          <div className="alternativer">
            {q.alternativer.map((a, j) => <button key={j} className="alt" onClick={() => { setSvar({ ...svar, [q.id]: j === q.riktig }); setI(i + 1); }}>{a}</button>)}
            <button className="alt" onClick={() => { setSvar({ ...svar, [q.id]: false }); setI(i + 1); }}><i>Vet ikke</i></button>
          </div>
        </div>
      </div>
    );
  }
  const riktige = Object.values(svar).filter(Boolean).length;
  return (
    <div className="stack">
      <div className="flate"><h2>Startnivå: {riktige} av {diagnose.length} riktige</h2>
        <p className="liten dempet">Dette er bare en kartlegging. Flervalg måler gjenkjenning, ikke muntlig kompetanse, så resultatet teller ikke som mestring.</p>
        <table className="tabell"><tbody>{diagnose.map((q) => (
          <tr key={q.id}><td>{svar[q.id] ? '✓' : '✗'}</td><td>{q.sporsmal}<br /><span className="liten dempet">{q.forklaring}</span></td><td><span className="merke">{q.km} · {kmNavn(q.km)}</span></td></tr>
        ))}</tbody></table>
      </div>
      <label className="flate"><b>Skriv ned tre temaer du er usikker på</b>
        <textarea className="input" rows={3} value={usikker} onChange={(e) => setUsikker(e.target.value)} placeholder="1. … 2. … 3. …" /></label>
      <button className="knapp stor" onClick={() => {
        lagreDiagnose(svar, usikker);
        for (const q of diagnose.filter((x) => !svar[x.id])) leggTilFeil(`Kartlegging: «${q.sporsmal}» – ${q.forklaring}`, [q.km]);
        if (usikker.trim()) leggTilFeil(`Usikre temaer fra kartleggingen: ${usikker.trim()}`, []);
        onFerdig();
      }}>Lagre kartleggingen</button>
    </div>
  );
}

/* ---------- Repetisjon (spaced repetition) ---------- */
function KontrollKort({ ids, onFerdig }: { ids: string[]; onFerdig: () => void }) {
  const kort = ids.map((id) => kontrollsporsmal.find((k) => k.id === id)!).filter(Boolean);
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(false);
  if (i >= kort.length) return <div className="flate sentrert"><p>Kontrollspørsmålene er ferdige.</p><button className="knapp" onClick={onFerdig} autoFocus>Videre</button></div>;
  const k = kort[i];
  return (
    <div className="stack">
      <p className="etikett">Kontrollspørsmål {i + 1} av {kort.length} · si svaret høyt før du snur kortet</p>
      <div className="flate sentrert"><p className="sensor-spm">{k.sporsmal}</p>
        {vis ? <p className="svar">{k.svar}</p> : <button className="knapp" onClick={() => setVis(true)}>Jeg har sagt svaret – vis forventet svar</button>}
      </div>
      {vis && (
        <div className="flate"><p>Hvor godt kunne du det? (0 = ikke i det hele tatt, 4 = presist, med eget eksempel)</p>
          <div className="skala">{[0, 1, 2, 3, 4].map((n) => <button key={n} className="skala-knapp" onClick={() => { vurderRep(k.id, n); setI(i + 1); setVis(false); }}>{n}</button>)}</div>
        </div>
      )}
    </div>
  );
}

export function RepetisjonOkt({ d, ekstra = [], onFerdig }: { d: AppData; ekstra?: string[]; onFerdig: () => void }) {
  const forfalt = forfalteRep(d);
  const kontroll = useMemo(() => {
    const due = forfalt.filter((id) => id.startsWith('kontroll-'));
    const nye = kontrollsporsmal.filter((k) => !d.rep[k.id]).map((k) => k.id);
    return [...due, ...shuffle(nye)].slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const munt = useMemo(() => {
    const ids = [...new Set([...forfalt.filter((id) => muntlige.some((m) => m.id === id)), ...ekstra])].slice(0, 5);
    return ids.map((id) => muntlige.find((m) => m.id === id)!).filter(Boolean).map(fraMuntlig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [fase, setFase] = useState<'kort' | 'muntlig'>(kontroll.length ? 'kort' : 'muntlig');
  if (fase === 'kort') return <KontrollKort ids={kontroll} onFerdig={() => setFase('muntlig')} />;
  if (!munt.length) return <div className="flate sentrert"><Ikon navn="sjekk" stor /><p>Repetisjonen er ferdig.</p><button className="knapp stor" onClick={onFerdig}>Ferdig</button></div>;
  return <div className="stack"><p className="etikett">Muntlige spørsmål som forfaller</p><MuntligOkt items={munt} onFerdig={onFerdig} /></div>;
}

export const snittAv = (dim: Partial<Record<DimId, number>>) => snitt(dim);
