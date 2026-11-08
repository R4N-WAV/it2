import { useEffect, useMemo, useRef, useState } from 'react';
import { Code, Fremdrift, Ikon, QuizRunner, Tekst } from './components';
import { oralQuestions } from './data/exam';
import { diagnoseIds, quiz } from './data/quiz';
import { topicNavn } from './data/topics';
import { eksporter, importer, lagreDiagnose, nullstill, registrerEksamen, useData, vurderMuntlig } from './store';
import type { ExamTask, OralSim, Rating } from './types';

/* ======================= DIAGNOSE ======================= */
export function Diagnose({ onFerdig, onAvslutt }: { onFerdig: () => void; onAvslutt: () => void }) {
  const items = useMemo(() => diagnoseIds.map((id) => quiz.find((q) => q.id === id)!), []);
  const [i, setI] = useState(0);
  const res = useRef<Record<string, boolean>>({});
  const [ferdig, setFerdig] = useState(false);
  const [start, setStart] = useState(false);

  if (!start) {
    return (
      <div className="fokus-innhold">
        <div className="flate">
          <h2>Diagnostisk test</h2>
          <p>{items.length} korte oppgaver på tvers av faget: kodeforståelse, OOP, pseudokode, feilsøking, data og personvern. Ca. 15 minutter.</p>
          <p>Ikke slå opp noe. Gjett heller – da får vi et ærlig bilde, og appen vet hva du bør øve mest på.</p>
          <button className="knapp stor" onClick={() => setStart(true)} autoFocus>Start testen</button>
        </div>
        <button className="lenkeknapp" onClick={onAvslutt}>Avslutt</button>
      </div>
    );
  }
  if (ferdig) {
    const r = res.current;
    const riktige = Object.values(r).filter(Boolean).length;
    const perTema: Record<string, [number, number]> = {};
    for (const it of items) {
      const p = perTema[it.tema] ?? [0, 0];
      perTema[it.tema] = [p[0] + (r[it.id] ? 1 : 0), p[1] + 1];
    }
    return (
      <div className="fokus-innhold">
        <div className="flate">
          <div className="resultat-ring">{Math.round((riktige / items.length) * 100)} %</div>
          <h2>{riktige} av {items.length} riktige</h2>
          <table className="tabell"><tbody>
            {Object.entries(perTema).map(([t, [a, b]]) => (
              <tr key={t}><td>{topicNavn(t)}</td><td className="tall">{a}/{b}</td><td><span className={`chip ${a === b ? 'ok' : a === 0 ? 'nei' : 'midt'}`}>{a === b ? 'sitter' : a === 0 ? 'prioriter' : 'delvis'}</span></td></tr>
            ))}
          </tbody></table>
          <p className="dempet">Resultatet er lagret. Svakhetene dine styrer «Svakhetsøkt» og anbefalingene.</p>
          <button className="knapp stor" onClick={onFerdig} autoFocus>Fullfør</button>
        </div>
      </div>
    );
  }
  const it = items[i];
  return (
    <div className="fokus-innhold">
      <div className="laer-fremdrift">
        <div className="segment"><span className="seg-mestret" style={{ flex: i }} /><span className="seg-ny" style={{ flex: items.length - i }} /></div>
        <div className="seg-tekst"><span>Oppgave {i + 1} av {items.length}</span></div>
      </div>
      <QuizRunner key={it.id} item={it} onSvar={(ok) => { res.current[it.id] = ok; }} onNeste={() => {
        if (i + 1 >= items.length) { lagreDiagnose(res.current); setFerdig(true); } else setI(i + 1);
      }} />
    </div>
  );
}

/* ======================= SJEKKLISTE-STEG ======================= */
export function SjekkSteg({ instruks, onFerdig, onAvslutt }: { instruks: string[]; onFerdig: () => void; onAvslutt: () => void }) {
  const [kryss, setKryss] = useState<boolean[]>(instruks.map(() => false));
  const alle = kryss.every(Boolean);
  return (
    <div className="fokus-innhold">
      <div className="flate">
        <p className="etikett">Kryss av etter hvert</p>
        {instruks.map((t, i) => (
          <label key={i} className="sjekk stor-sjekk">
            <input id={`sjekk-${i}`} type="checkbox" checked={kryss[i]} onChange={() => setKryss(kryss.map((v, k) => (k === i ? !v : v)))} /> <span>{t}</span>
          </label>
        ))}
        <button className="knapp stor" disabled={!alle} onClick={onFerdig}>{alle ? 'Fullfør steget' : `${kryss.filter(Boolean).length} av ${instruks.length} gjort`}</button>
      </div>
      <button className="lenkeknapp" onClick={onAvslutt}>Avslutt</button>
    </div>
  );
}

/* ======================= EKSAMENSOPPGAVE ======================= */
export function EksamenOppgave({ task, onLagret, onAvslutt }: { task: ExamTask; onLagret: (score: number) => void; onAvslutt: () => void }) {
  const [min, setMin] = useState(task.minutter);
  const [startet, setStartet] = useState<number | null>(null);
  const [naa, setNaa] = useState(Date.now());
  const [svar, setSvar] = useState('');
  const [levert, setLevert] = useState(false);
  const [kryss, setKryss] = useState<boolean[]>(task.godtSvarInneholder.map(() => false));

  useEffect(() => {
    if (!startet || levert) return;
    const t = setInterval(() => setNaa(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startet, levert]);

  const igjen = startet ? Math.max(0, min * 60 - Math.floor((naa - startet) / 1000)) : min * 60;
  useEffect(() => { if (startet && igjen === 0 && !levert) setLevert(true); }, [igjen, startet, levert]);

  if (!startet) {
    return (
      <div className="fokus-innhold">
        <div className="flate">
          <h2>{task.tittel}</h2>
          <p className="dempet">{task.kilde}</p>
          <p>Ingen hint underveis. Les hele oppgaven, marker verbet (forklar, implementer, drøft …), del den opp, og skriv svaret. Når du leverer, ser du løsningsforslaget og vurderer deg selv.</p>
          <p className="liten">Tips: skriv koden i Java-editoren din og lim den inn her når du er ferdig.</p>
          <label className="felt" htmlFor="eks-min">Tidsbegrensning (minutter)
            <input id="eks-min" className="input smal" type="number" min={1} max={300} value={min} onChange={(e) => setMin(Math.max(1, Number(e.target.value) || 1))} />
          </label>
          <button className="knapp stor" onClick={() => { setStartet(Date.now()); setNaa(Date.now()); }} autoFocus>Start klokka</button>
        </div>
        <button className="lenkeknapp" onClick={onAvslutt}>Avslutt</button>
      </div>
    );
  }
  const mm = String(Math.floor(igjen / 60)).padStart(2, '0');
  const ss = String(igjen % 60).padStart(2, '0');
  const score = Math.round((kryss.filter(Boolean).length / kryss.length) * 100);

  return (
    <div className="fokus-innhold bred">
      <div className="klokke-rad"><span className="liten dempet">{task.tittel}</span><span className={`klokke ${igjen < 120 && !levert ? 'varsel' : ''}`}>{levert ? 'Levert' : `${mm}:${ss}`}</span></div>
      <div className="flate">
        <Tekst>{task.oppgave}</Tekst>
        {task.kode && <Code>{task.kode}</Code>}
        <label className="etikett" htmlFor="eks-svar">Ditt svar</label>
        <textarea id="eks-svar" className="input mono" rows={14} value={svar} disabled={levert} onChange={(e) => setSvar(e.target.value)} placeholder="Start med å liste opp delspørsmålene a), b), c) …" />
        {!levert && <button className="knapp" onClick={() => setLevert(true)}>Lever</button>}
      </div>
      {levert && (
        <>
          <div className="flate">
            <h3>Løsningsforslag</h3>
            <Code>{task.losning}</Code>
          </div>
          <div className="flate">
            <h3>Kryss av det svaret ditt hadde med</h3>
            {task.godtSvarInneholder.map((g, i) => (
              <label key={i} className="sjekk"><input id={`godt-${i}`} type="checkbox" checked={kryss[i]} onChange={() => setKryss(kryss.map((v, k) => (k === i ? !v : v)))} /> <span>{g}</span></label>
            ))}
            <p><b>Egenvurdering: {score} %</b> – {score >= 60 ? 'nivå som peker mot 3 eller bedre.' : 'under målet på 60 %. Gjør oppgaven igjen om en dag eller to.'}</p>
            <button className="knapp stor" onClick={() => { registrerEksamen(task.id, svar, score); onLagret(score); }}>Lagre og fullfør</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ======================= MUNTLIG: SENSORSPØRSMÅL ======================= */
export function Sensorsporsmal({ antall, onFerdig, onAvslutt }: { antall: number; onFerdig: () => void; onAvslutt: () => void }) {
  const d = useData();
  const utvalg = useMemo(
    () => [...oralQuestions].sort((a, b) => (d.muntlig[a.id] ?? -1) - (d.muntlig[b.id] ?? -1)).slice(0, antall),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [i, setI] = useState(0);
  const [svar, setSvar] = useState('');
  const [vist, setVist] = useState(false);
  const q = utvalg[i];

  if (!q) {
    return (
      <div className="fokus-innhold">
        <div className="flate sentrert feiring">
          <Ikon navn="mikrofon" stor />
          <h2>{utvalg.length} spørsmål besvart</h2>
          <p className="dempet">Spørsmål du vurderte som svake, kommer først neste gang.</p>
          <button className="knapp stor" onClick={onFerdig} autoFocus>Fullfør</button>
        </div>
      </div>
    );
  }
  const neste = (r: Rating) => { vurderMuntlig(q.id, r); setI(i + 1); setSvar(''); setVist(false); };

  return (
    <div className="fokus-innhold">
      <p className="liten dempet">Spørsmål {i + 1} av {utvalg.length} · {topicNavn(q.tema)}</p>
      <div className="flate">
        <p className="etikett">Sensor spør</p>
        <h2 className="sitat">«{q.sporsmal}»</h2>
        <p className="liten">Svar HØYT i 1–2 minutter før du ser hva sensor ser etter. Skriv gjerne stikkord.</p>
        <textarea id="muntlig-svar" className="input" rows={4} value={svar} onChange={(e) => setSvar(e.target.value)} placeholder="Stikkord …" disabled={vist} />
        {!vist ? <button className="knapp" onClick={() => setVist(true)}>Vis hva sensor ser etter</button> : (
          <>
            <h4>Eksempel på godt svar</h4>
            <div className="svar">{q.godtSvar}</div>
            <h4>Fagbegreper som bør med</h4>
            <div className="merker">{q.begreper.map((b) => <span key={b} className={`chip ${svar.toLowerCase().includes(b.toLowerCase().split(/[ /(]/)[0]) ? 'ok' : ''}`}>{b}</span>)}</div>
            <p className="liten">Grønne begreper fant vi i stikkordene dine.</p>
            <h4>Dette vil sensor høre</h4>
            <ul>{q.sensorVilHore.map((s) => <li key={s}>{s}</li>)}</ul>
            <div className="to">
              <div className="boks rod-bg"><b>Svakt svar</b><p>{q.svaktVsGodt.svakt}</p></div>
              <div className="boks gronn-bg"><b>Nivå 3–4</b><p>{q.svaktVsGodt.nivaa34}</p></div>
            </div>
            <p className="etikett">Hvordan var svaret ditt?</p>
            <div className="vurdering">
              <button className="knapp rod" onClick={() => neste(0)}>Svakt</button>
              <button className="knapp gul" onClick={() => neste(1)}>Delvis</button>
              <button className="knapp gronn" onClick={() => neste(2)}>Nivå 3–4</button>
            </div>
          </>
        )}
      </div>
      <button className="lenkeknapp" onClick={onAvslutt}>Avslutt</button>
    </div>
  );
}

/* ======================= MUNTLIG: FULL SIMULERING ======================= */
function Nedtelling({ sekunder }: { sekunder: number }) {
  const [start] = useState(Date.now());
  const [naa, setNaa] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNaa(Date.now()), 1000); return () => clearInterval(t); }, []);
  const igjen = Math.max(0, sekunder - Math.floor((naa - start) / 1000));
  return <span className={`klokke ${igjen < 120 ? 'varsel' : ''}`}>{String(Math.floor(igjen / 60)).padStart(2, '0')}:{String(igjen % 60).padStart(2, '0')}</span>;
}

export function Simulering({ sim, onFerdig, onAvslutt }: { sim: OralSim; onFerdig: () => void; onAvslutt: () => void }) {
  const [fase, setFase] = useState<'start' | 'forberedelse' | 'eksaminasjon' | 'tillegg' | 'ferdig'>('start');
  const [forbMin, setForbMin] = useState(30);
  const [notater, setNotater] = useState('');
  const [spm, setSpm] = useState(0);
  const avbryt = <button className="lenkeknapp" onClick={onAvslutt}>Avbryt simuleringen</button>;

  if (fase === 'start') {
    return (
      <div className="fokus-innhold">
        <div className="flate">
          <h2>{sim.tittel}</h2>
          <p>Gangen er som hos Oslo Privatistkontor (H26). Sjekk ditt eget informasjonsskriv i Privatistportalen.</p>
          <ol className="liste">
            <li><b>Forberedelse</b> (minst 30 min): løs oppgaven og skriv notater. Alle hjelpemidler er tillatt.</li>
            <li><b>Eksaminasjon</b> (inntil 45 min): vis det praktiske innslaget og svar høyt på sensors spørsmål.</li>
            <li><b>Tilleggsoppgave</b> fra et annet kompetansemål. Den ser du ikke på forhånd.</li>
          </ol>
          <label className="felt" htmlFor="forb-min">Forberedelsestid (minutter)
            <input id="forb-min" className="input smal" type="number" min={5} max={120} value={forbMin} onChange={(e) => setForbMin(Math.max(1, Number(e.target.value) || 1))} />
          </label>
          <button className="knapp stor" onClick={() => setFase('forberedelse')} autoFocus>Trekk oppgaven og start</button>
        </div>
        {avbryt}
      </div>
    );
  }
  if (fase === 'forberedelse') {
    return (
      <div className="fokus-innhold bred">
        <div className="klokke-rad"><span className="etikett">Forberedelse</span><Nedtelling sekunder={forbMin * 60} /></div>
        <div className="flate">
          <Tekst>{sim.oppgave}</Tekst>
          <p><b>Praktisk innslag:</b> {sim.praktisk}</p>
          <p className="liten">Marker substantiver (klasser) og verb (metoder), tegn klassediagram, programmer ett trinn om gangen og test underveis.</p>
          <textarea id="sim-notater" className="input mono" rows={10} value={notater} onChange={(e) => setNotater(e.target.value)} placeholder="Notater (på eksamen: papir fra forberedelsesrommet) …" />
          <button className="knapp" onClick={() => setFase('eksaminasjon')}>Gå til eksaminasjon</button>
        </div>
        {avbryt}
      </div>
    );
  }
  if (fase === 'eksaminasjon') {
    const ferdigSpm = spm >= sim.oppfolging.length;
    return (
      <div className="fokus-innhold">
        <div className="klokke-rad"><span className="etikett">Eksaminasjon</span><Nedtelling sekunder={45 * 60} /></div>
        <div className="flate">
          <p>Start med 3–5 minutter der du viser løsningen: HVA koden gjør, HVORFOR du valgte strukturen, HVORDAN du testet, og hva du ville forbedret.</p>
          {notater && <><p className="etikett">Notatene dine</p><Code>{notater}</Code></>}
        </div>
        <div className="flate fremhevet">
          {!ferdigSpm ? (
            <>
              <p className="etikett">Sensor spør ({spm + 1}/{sim.oppfolging.length}) – svar høyt</p>
              <h2 className="sitat">«{sim.oppfolging[spm]}»</h2>
              <button className="knapp" onClick={() => setSpm(spm + 1)}>Jeg har svart</button>
            </>
          ) : (
            <>
              <p>Sensor: «Takk. Da har vi en tilleggsoppgave til deg.»</p>
              <button className="knapp" onClick={() => setFase('tillegg')}>Vis tilleggsoppgaven</button>
            </>
          )}
        </div>
        {avbryt}
      </div>
    );
  }
  if (fase === 'tillegg') {
    return (
      <div className="fokus-innhold">
        <div className="flate fremhevet">
          <span className="chip">{sim.tilleggsoppgave.km}</span>
          <h2 className="sitat">«{sim.tilleggsoppgave.sporsmal}»</h2>
          <p className="liten">Ingen forberedelse. Tenk i 30 sekunder, og svar høyt i 3–5 minutter.</p>
          <button className="knapp" onClick={() => setFase('ferdig')}>Ferdig – vis vurdering</button>
        </div>
      </div>
    );
  }
  const vurder = (r: Rating) => { vurderMuntlig(sim.id, r); onFerdig(); };
  return (
    <div className="fokus-innhold">
      <div className="flate">
        <h3>Løsningsskisse</h3>
        <p>{sim.losningsskisse}</p>
        <h4>Tilleggsoppgaven – dette vil sensor høre</h4>
        <ul>{sim.tilleggsoppgave.momenter.map((m) => <li key={m}>{m}</li>)}</ul>
        <h4>Nivå 3–4 i muntlig betyr at du kan</h4>
        <ul>
          <li>vise eller forklare en fungerende (gjerne delvis) løsning</li>
          <li>forklare valgene dine med fagbegreper, og nevne et alternativ</li>
          <li>vise hvordan du testet og rettet feil</li>
          <li>svare på spørsmål om andre kompetansemål med eksempler</li>
        </ul>
        <p className="liten">For 4: sammenligne alternativer, begrunne mer selvstendig og drøfte konsekvenser.</p>
        <p className="etikett">Hvordan gikk det totalt sett?</p>
        <div className="vurdering">
          <button className="knapp rod" onClick={() => vurder(0)}>Svakt</button>
          <button className="knapp gul" onClick={() => vurder(1)}>Delvis</button>
          <button className="knapp gronn" onClick={() => vurder(2)}>Nivå 3–4</button>
        </div>
      </div>
    </div>
  );
}

/* ======================= BEREDSKAP ======================= */
export function BeredskapKort({ tittel, verdi }: { tittel: string; verdi: number }) {
  const p = Math.round(verdi * 100);
  const vurdering =
    p < 25 ? 'Ikke klar ennå. Følg dagsplanen – grunnlag og OOP først.'
    : p < 50 ? 'På vei. Mye er usikkert ennå. Prioriter de røde temaene.'
    : p < 70 ? 'Realistisk nivå for 3 hvis du klarer middels oppgaver selv.'
    : 'Godt grunnlag – realistisk 3–4. Tren på hele eksamensoppgaver på tid.';
  return (
    <div className="flate">
      <p className="etikett">{tittel}</p>
      <div className="stort tall">{p} %</div>
      <Fremdrift verdi={verdi} />
      <p className="liten">{vurdering}</p>
    </div>
  );
}

/* ======================= LAGRING ======================= */
export function Lagring() {
  const [melding, setMelding] = useState('');
  const [visEksport, setVisEksport] = useState(false);
  const [lim, setLim] = useState('');
  const [bekreft, setBekreft] = useState(false);
  const fil = useRef<HTMLInputElement>(null);
  const tekst = visEksport ? eksporter() : '';

  const lastNed = () => {
    const blob = new Blob([eksporter()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const d = new Date();
    a.download = `it2-fremdrift-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMelding('Fila er lastet ned.');
  };

  return (
    <div className="stack">
      <div className="flate">
        <h3>Flytt fremdriften mellom enheter</h3>
        <p>Fremdriften lagres i nettleseren på enheten du bruker. Den følger <b>ikke</b> automatisk med til mobil eller en annen PC. Slik flytter du den:</p>
        <ol className="liste">
          <li>På enheten du har jobbet på: last ned fila eller kopier teksten.</li>
          <li>På den andre enheten: importer fila eller lim inn teksten.</li>
        </ol>
        <div className="rad">
          <button className="knapp" onClick={lastNed}>Last ned fremdrift</button>
          <button className="knapp sek" onClick={() => fil.current?.click()}>Importer fil</button>
          <button className="knapp sek" onClick={() => setVisEksport(!visEksport)}>{visEksport ? 'Skjul tekst' : 'Vis som tekst'}</button>
          <input id="import-fil" ref={fil} type="file" accept="application/json,.json" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const feil = importer(await f.text());
            setMelding(feil ?? 'Fremdriften er importert.');
            e.target.value = '';
          }} />
        </div>
        {visEksport && (
          <>
            <textarea id="eksport" className="input mono" rows={5} readOnly value={tekst} onFocus={(e) => e.target.select()} />
            <button className="knapp sek" onClick={async () => {
              try { await navigator.clipboard.writeText(tekst); setMelding('Kopiert.'); }
              catch { (document.getElementById('eksport') as HTMLTextAreaElement | null)?.select(); setMelding('Teksten er markert – kopier med Ctrl+C / Cmd+C.'); }
            }}>Kopier</button>
          </>
        )}
        <label className="etikett" htmlFor="import-lim">Eller lim inn tekst</label>
        <textarea id="import-lim" className="input mono" rows={3} value={lim} onChange={(e) => setLim(e.target.value)} placeholder="Lim inn eksportert tekst her …" />
        <button className="knapp sek" disabled={!lim.trim()} onClick={() => { const feil = importer(lim); setMelding(feil ?? 'Fremdriften er importert.'); if (!feil) setLim(''); }}>Importer tekst</button>
        {melding && <p className="melding" role="status">{melding}</p>}
      </div>
      <div className="flate">
        <h3>Slett all fremdrift</h3>
        {!bekreft ? (
          <button className="knapp rod" onClick={() => setBekreft(true)}>Slett all fremdrift …</button>
        ) : (
          <>
            <p>Alt du har gjort i appen blir slettet på denne enheten. Dette kan ikke angres.</p>
            <div className="rad">
              <button className="knapp rod" onClick={() => { nullstill(); setBekreft(false); setMelding('All fremdrift er slettet.'); }}>Ja, slett alt</button>
              <button className="knapp sek" onClick={() => setBekreft(false)}>Avbryt</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
