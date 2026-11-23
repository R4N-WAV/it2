import { useEffect, useState } from 'react';
import { Ikon, shuffle } from '../components';
import { caseMedId, caser, tilleggForCase, tilleggMedId } from './bank';
import { DIM_FOR, DIMENSJONER, kmNavn } from './data/km';
import { DekningVisning, fmtTid, KmMerker, Rubrikk, SvarBoks, useNaa } from './felles';
import { CaseVisning } from './okter';
import { avbrytSim, fullforSim, oppdaterSim, startSim, useData } from './store';
import { Md } from './Tekst';
import type { AktivSim, AppData, DimId, SimResultat } from './typer';
import { beredskap, forbedringer, lagVurdering, mestring, sjekkBegreper, snitt } from './vurdering';

const EKSAMEN_MIN = 45;

function trekk(d: AppData, startform: AktivSim['startform'], forberedelseMin: number): AktivSim {
  const brukte = new Set(d.sims.map((s) => s.caseId));
  const kand = caser.filter((c) => !brukte.has(c.id));
  const c = shuffle(kand.length ? kand : caser)[0];
  const tBrukt = new Set(d.sims.map((s) => s.tilleggId));
  const tKand = tilleggForCase(c.id);
  const svakeKm = (t: { km: string[] }) => t.km.some((k) => ['ingen', 'rod'].includes(mestring(d, k as never).status));
  const t = shuffle(tKand).sort((a, b) => Number(tBrukt.has(a.id)) - Number(tBrukt.has(b.id)) || Number(svakeKm(b)) - Number(svakeKm(a)))[0];
  return {
    id: `sim-${Date.now()}`, caseId: c.id, tilleggId: t.id, fase: 'forberedelse', startform, forberedelseMin,
    forberedelseStart: Date.now(), eksaminasjonStart: null, notater: '', startSvar: '', snakkeSek: 0, sensorIndeks: 0, sensorSvar: [], tilleggSvar: '',
  };
}

export function SimulatorSide({ onApneKapittel }: { onApneKapittel: (id: string) => void }) {
  const d = useData();
  const s = d.aktivSim;
  if (!s) return <Oppstart d={d} />;
  return <AktivSimulering s={s} d={d} onApneKapittel={onApneKapittel} />;
}

function Oppstart({ d }: { d: AppData }) {
  const [startform, setStartform] = useState<AktivSim['startform']>('forklaring');
  const [min, setMin] = useState(30);
  const siste = d.sims[d.sims.length - 1];
  return (
    <div className="stack">
      <header className="side-topp">
        <p className="etikett">Full eksamenssimulering · Oslo-modellen</p>
        <h1>Simulator</h1>
      </header>
      <div className="flate">
        <h2>Slik foregår simuleringen</h2>
        <ol className="liste">
          <li>Du trekker tilfeldig én av {caser.length} originale, brede eksamenscaser (ikke tidligere ekte oppgaver).</li>
          <li><b>30 minutter forberedelse.</b> Alle hjelpemidler er lov, men ikke modellsvaret. Skriv korte stikkord i notatfeltet – det simulerer notatarket du får utdelt.</li>
          <li><b>Eksaminasjon, inntil 45 minutter:</b> startforklaring (eller direkte fagsamtale), praktisk demonstrasjon og sensors oppfølgingsspørsmål.</li>
          <li>En <b>ukjent tilleggsoppgave</b> fra andre kompetansemål enn casen.</li>
          <li>Vurdering med rubrikk, lagring per kompetansemål og forslag til neste økt.</li>
        </ol>
        <p className="liten dempet">Ingen PowerPoint. Si svarene høyt – bruk snakketimeren – og skriv det du sa eller stikkord.</p>
      </div>
      <div className="flate">
        <h3>Avklares før forberedelsen</h3>
        <label className="sjekk"><input type="radio" checked={startform === 'forklaring'} onChange={() => setStartform('forklaring')} /> Jeg starter med å forklare/presentere løsningen min (anbefalt)</label>
        <label className="sjekk"><input type="radio" checked={startform === 'samtale'} onChange={() => setStartform('samtale')} /> Vi går rett i fagsamtale</label>
        <h3>Forberedelsestid</h3>
        <label className="sjekk"><input type="radio" checked={min === 30} onChange={() => setMin(30)} /> 30 minutter – eksamensrealistisk (standard)</label>
        <label className="sjekk"><input type="radio" checked={min === 45} onChange={() => setMin(45)} /> 45 minutter – treningsmodus</label>
        <label className="sjekk"><input type="radio" checked={min === 60} onChange={() => setMin(60)} /> 60 minutter – treningsmodus</label>
        {min !== 30 && <p className="liten advar-tekst">Treningsmodus er ikke eksamensrealistisk. Ta minst to simuleringer med 30 minutter før eksamen.</p>}
        <button className="knapp stor" onClick={() => startSim(trekk(d, startform, min))}><Ikon navn="spill" /> Trekk oppgave og start forberedelsen</button>
      </div>
      {d.sims.length > 0 && (
        <div className="flate">
          <h3>Tidligere simuleringer ({d.sims.length})</h3>
          <table className="tabell"><tbody>{[...d.sims].reverse().map((r) => (
            <tr key={r.id}><td>{new Date(r.start).toLocaleString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
              <td>CASE {caseMedId(r.caseId)?.nr} {caseMedId(r.caseId)?.tittel}</td>
              <td className="tall">Hoved {r.hoved.toFixed(1)}</td><td className="tall">Tillegg {r.tillegg.toFixed(1)}</td>
              <td>{r.forberedelseMin !== 30 ? <span className="chip midt">trening</span> : null}</td></tr>
          ))}</tbody></table>
          {siste && <SimResultatVisning r={siste} />}
        </div>
      )}
    </div>
  );
}

function AktivSimulering({ s, d, onApneKapittel }: { s: AktivSim; d: AppData; onApneKapittel: (id: string) => void }) {
  const c = caseMedId(s.caseId)!;
  const t = tilleggMedId(s.tilleggId)!;
  const naa = useNaa(1000);
  const igjen = s.forberedelseStart ? s.forberedelseMin * 60 - (naa - s.forberedelseStart) / 1000 : 0;
  const brukt = s.eksaminasjonStart ? (naa - s.eksaminasjonStart) / 1000 : 0;
  const tilEksaminasjon = () => oppdaterSim((x) => ({ ...x, fase: x.startform === 'forklaring' ? 'start' : 'samtale', eksaminasjonStart: Date.now() }));

  useEffect(() => {
    if (s.fase === 'forberedelse' && igjen <= 0) tilEksaminasjon();
  }, [s.fase, igjen]);

  const sporsmal = [`Demonstrer det praktiske innslaget: ${c.praktisk}`, ...c.sensor];

  const topp = (
    <div className="sim-topp">
      <span><b>CASE {c.nr}</b> · {c.tittel}</span>
      {s.fase === 'forberedelse' ? (
        <span className={`klokke ${igjen < 300 ? 'advar' : ''}`}>Forberedelse: <b className="tall">{fmtTid(igjen)}</b></span>
      ) : s.eksaminasjonStart && s.fase !== 'vurdering' ? (
        <span className={`klokke ${brukt > EKSAMEN_MIN * 60 ? 'advar' : ''}`}>Eksaminasjon: <b className="tall">{fmtTid(brukt)}</b> / {EKSAMEN_MIN}:00</span>
      ) : null}
      <button className="lenkeknapp" onClick={() => { if (confirm('Avbryte simuleringen? Den teller ikke som gjennomført.')) avbrytSim(); }}>Avbryt</button>
    </div>
  );

  if (s.fase === 'forberedelse') return (
    <div className="stack">
      {topp}
      <CaseVisning c={c} />
      <div className="flate notatark">
        <b className="etikett">Øvelsesnotater – simulerer notatarket du får på eksamen</b>
        <p className="liten dempet">Skriv korte stikkord, ikke manus. Plan: 0–5 forstå, 5–10 struktur, 10–20 lag det viktigste, 20–25 test og vurder, 25–30 forbered forklaringen.</p>
        <textarea className="input mono" rows={14} value={s.notater} onChange={(e) => oppdaterSim((x) => ({ ...x, notater: e.target.value }))} placeholder={'Problem: …\nModell/klasser: …\nDemo: …\nTester: …\nBegrensning/forbedring: …\nPersonvern/sikkerhet: …'} />
      </div>
      <div className="flate liten">
        <b>Hjelpemidler i forberedelsen:</b> Alt er lov, også lærebokstoffet i appen. Ikke åpne løsningsskissen.
        <div className="rad">{[...new Set(c.km)].slice(0, 4).map((km) => <button key={km} className="knapp sek liten-knapp" onClick={() => onApneKapittel(km)}>Les om {kmNavn(km)}</button>)}</div>
      </div>
      <button className="knapp stor" onClick={tilEksaminasjon}>Jeg er klar – start eksaminasjonen nå</button>
    </div>
  );

  if (s.fase === 'start') return (
    <div className="stack">
      {topp}
      <div className="sensor"><p className="etikett">Sensor</p><p className="sensor-spm">Vær så god – fortell om oppgaven og løsningen din.</p></div>
      <details className="flate"><summary>Notatarket ditt (støtte – ikke les fra det)</summary><pre className="tekst">{s.notater || '(tomt)'}</pre></details>
      <p className="liten dempet">Snakk høyt i 3–5 minutter: hva oppgaven går ut på → modell → praktisk → test → vurdering. Start snakketimeren. Skriv etterpå det du sa i stikkord.</p>
      <SvarBoks verdi={s.startSvar} settVerdi={(v) => oppdaterSim((x) => ({ ...x, startSvar: v }))} rader={8}
        onSnakk={(sek) => sek > 0 && oppdaterSim((x) => ({ ...x, snakkeSek: Math.max(x.snakkeSek, sek) }))} />
      <p className="liten">Målt snakketid: <b className="tall">{fmtTid(s.snakkeSek)}</b></p>
      <button className="knapp" disabled={!s.startSvar.trim()} onClick={() => oppdaterSim((x) => ({ ...x, fase: 'samtale' }))}>Ferdig med startforklaringen – gå til fagsamtalen</button>
    </div>
  );

  if (s.fase === 'samtale') {
    const i = s.sensorIndeks;
    const svar = s.sensorSvar[i] ?? '';
    return (
      <div className="stack">
        {topp}
        <p className="etikett">Fagsamtale · spørsmål {i + 1} av {sporsmal.length}</p>
        <div className="sensor"><p className="etikett">Sensor</p><p className="sensor-spm">{sporsmal[i]}</p></div>
        <SvarBoks key={i} verdi={svar} settVerdi={(v) => oppdaterSim((x) => { const a = [...x.sensorSvar]; a[i] = v; return { ...x, sensorSvar: a }; })} rader={6} autoFocus />
        <div className="rad mellom">
          <span className="liten dempet">Vet du ikke? Resonner høyt: «Jeg er ikke sikker, men jeg ville undersøkt …»</span>
          <button className="knapp" disabled={!svar.trim()} onClick={() => oppdaterSim((x) => (i + 1 < sporsmal.length ? { ...x, sensorIndeks: i + 1 } : { ...x, fase: 'tillegg' }))}>
            {i + 1 < sporsmal.length ? 'Neste spørsmål' : 'Videre til tilleggsoppgaven'}
          </button>
        </div>
      </div>
    );
  }

  if (s.fase === 'tillegg') return (
    <div className="stack">
      {topp}
      <div className="sensor ukjent">
        <p className="etikett">Ukjent tilleggsoppgave · andre kompetansemål: {t.km.map(kmNavn).join(', ')}</p>
        <p className="sensor-spm">{t.sporsmal}</p>
      </div>
      <p className="liten dempet">Start med å avklare hva oppgaven spør etter. Du har ikke sett denne før – det er poenget.</p>
      <SvarBoks verdi={s.tilleggSvar} settVerdi={(v) => oppdaterSim((x) => ({ ...x, tilleggSvar: v }))} rader={8} autoFocus />
      <button className="knapp" disabled={!s.tilleggSvar.trim()} onClick={() => oppdaterSim((x) => ({ ...x, fase: 'vurdering' }))}>Avslutt eksaminasjonen og gå til vurdering</button>
    </div>
  );

  return <Vurdering s={s} d={d} brukt={brukt} />;
}

function Vurdering({ s, d, brukt }: { s: AktivSim; d: AppData; brukt: number }) {
  const c = caseMedId(s.caseId)!;
  const t = tilleggMedId(s.tilleggId)!;
  const [hovedDim, setHovedDim] = useState<Partial<Record<DimId, number>> | null>(null);
  const [sammenh, setSammenh] = useState(false);
  const hovedTekst = [s.startSvar, ...s.sensorSvar].join('\n');
  const dHoved = sjekkBegreper(hovedTekst, c.begreper);
  const dTillegg = sjekkBegreper(s.tilleggSvar, t.begreper);
  const [ferdig, setFerdig] = useState<SimResultat | null>(null);
  if (ferdig) return <div className="stack"><SimResultatVisning r={ferdig} /><NesteOkt d={d} /></div>;

  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Vurdering · brukte {fmtTid(brukt)} av {EKSAMEN_MIN}:00</p><h1>Sensorvurdering</h1></header>
      {!hovedDim ? (
        <>
          <div className="flate"><b className="etikett">Dine svar på hovedcasen</b>
            {s.startform === 'forklaring' && <><p><b>Startforklaring</b> (snakketid {fmtTid(s.snakkeSek)})</p><p className="tekst">{s.startSvar}</p></>}
            {s.sensorSvar.map((x, i) => <p key={i} className="tekst"><b>{i === 0 ? 'Demonstrasjon' : c.sensor[i - 1]}</b><br />{x}</p>)}
            <DekningVisning d={dHoved} />
          </div>
          <div className="flate"><b className="etikett">Løsningsskisse</b><Md tekst={c.losning} /><p><b>Kjennetegn på et godt svar:</b> {c.kjennetegn}</p>
            <b>Vurderingsmomenter</b><ul>{c.momenter.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
          {s.startform === 'forklaring' && (
            <label className="flate sjekk"><input type="checkbox" checked={sammenh} onChange={() => setSammenh(!sammenh)} />
              <span>Jeg snakket sammenhengende om løsningen (minst 3 minutter) uten å lese direkte fra notatene. <span className="dempet">Målt: {fmtTid(s.snakkeSek)}</span></span></label>
          )}
          <div className="flate"><h3>Hovedcasen – alle sju dimensjoner</h3>
            <Rubrikk dims={DIM_FOR.alle} svar={hovedTekst} dekning={dHoved} hint={false} knapp="Videre til tilleggsoppgaven" onLagre={(dim) => setHovedDim(dim)} /></div>
        </>
      ) : (
        <>
          <div className="flate"><b className="etikett">Tilleggsoppgaven</b><p className="sensor-spm">{t.sporsmal}</p><p className="tekst">{s.tilleggSvar}</p><DekningVisning d={dTillegg} /></div>
          <div className="flate"><b className="etikett">Eksempelsvar</b><p>{t.svar}</p><b>Vurderingsmomenter</b><ul>{t.momenter.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
          <div className="flate"><h3>Tilleggsoppgaven</h3>
            <Rubrikk dims={DIM_FOR.drofting} svar={s.tilleggSvar} dekning={dTillegg} hint={false} knapp="Lagre simuleringen" onLagre={(tDim) => {
              const vH = lagVurdering({ kilde: 'case', ref: c.id, km: c.km, dim: hovedDim, hint: false, dekning: dHoved.andel, svar: hovedTekst, simId: s.id });
              const vT = lagVurdering({ kilde: 'tillegg', ref: t.id, km: t.km, dim: tDim, hint: false, dekning: dTillegg.andel, svar: s.tilleggSvar, simId: s.id });
              const r: SimResultat = {
                id: s.id, caseId: c.id, tilleggId: t.id, start: s.forberedelseStart ?? Date.now(), slutt: Date.now(), forberedelseMin: s.forberedelseMin, startform: s.startform,
                hoved: snitt(hovedDim), tillegg: snitt(tDim), sammenhengende: sammenh, snakkeSek: s.snakkeSek, dim: hovedDim, tilleggDim: tDim,
                forbedring: [...new Set([...forbedringer(hovedDim), ...forbedringer(tDim)])],
              };
              fullforSim(r, [vH, vT]);
              setFerdig(r);
            }} /></div>
        </>
      )}
    </div>
  );
}

function SimResultatVisning({ r }: { r: SimResultat }) {
  const c = caseMedId(r.caseId);
  const t = tilleggMedId(r.tilleggId);
  return (
    <div className="flate">
      <h3>Siste simulering: CASE {c?.nr} {c?.tittel}</h3>
      <div className="fliser">
        <div className="flis"><b className="tall">{r.hoved.toFixed(1)}</b><span>hovedcase (0–4)</span></div>
        <div className="flis"><b className="tall">{r.tillegg.toFixed(1)}</b><span>tilleggsoppgave</span></div>
        <div className="flis"><b className="tall">{fmtTid(r.snakkeSek)}</b><span>{r.sammenhengende ? 'sammenhengende tale ✓' : 'snakketid'}</span></div>
      </div>
      <table className="tabell"><tbody>{DIMENSJONER.map((x) => (
        <tr key={x.id}><td>{x.navn}</td><td className="tall">{r.dim[x.id] ?? '–'}</td><td className="tall">{r.tilleggDim[x.id] ?? '–'}</td></tr>
      ))}</tbody></table>
      {t && <p className="liten">Tilleggsoppgave: {t.km.map(kmNavn).join(', ')}</p>}
      {r.forbedring.length > 0 && <><b>Forbedringsforslag</b><ul>{r.forbedring.map((f, i) => <li key={i}>{f}</li>)}</ul></>}
      <p className="liten dempet">Treningsrubrikk – ikke en karakter. {r.forberedelseMin !== 30 && 'Treningsmodus (ikke 30 min).'}</p>
    </div>
  );
}

function NesteOkt({ d }: { d: AppData }) {
  const b = beredskap(d);
  const svake = [...b.mestring].sort((a, x) => (a.siste ?? -1) - (x.siste ?? -1)).slice(0, 3);
  return (
    <div className="flate fremhevet">
      <h3>Neste økt – generert fra svakhetene dine</h3>
      <ol>{b.prioritet.map((p, i) => <li key={i}>{p}</li>)}</ol>
      <p className="liten">Svakeste mål akkurat nå: {svake.map((x) => <KmMerker key={x.km} km={[x.km]} />)}</p>
      <p className="liten">Gå til «Muntlig» → «Svakhetsøkt» for en ferdig sammensatt økt.</p>
    </div>
  );
}
