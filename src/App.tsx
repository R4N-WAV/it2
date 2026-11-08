import { useEffect, useState, type ReactNode } from 'react';
import './App.css';
import { Fremdrift, Ikon, shuffle } from './components';
import { flashcards } from './data/flashcards';
import { examTasks, oralQuestions, oralSims } from './data/exam';
import { quiz } from './data/quiz';
import { kmMatrise, plan, prioritetsrekkefolge, type PlanDay, type Steg } from './data/plan';
import { kompetansemal, topics } from './data/topics';
import { aktivDag, dagFremdrift, dagState, kalenderStatus, maalStatus, nesteSteg, stegFullfort } from './forlop';
import { LaasSkjerm, erUlast, laas } from './Lock';
import { LaerOkt } from './Laer';
import { MatchSpill } from './Match';
import { QuizOkt } from './QuizOkt';
import { BeredskapKort, Diagnose, EksamenOppgave, Lagring, Sensorsporsmal, Simulering, SjekkSteg } from './sider';
import {
  bekreftDag, beredskap, dagerIgjen, datoNokkel, fullforSteg, kortSomForfaller, mestringForTema, nyRunde,
  registrerDagEksamen, registrerDagstest, streak, svakhet, useData,
} from './store';
import { useTema, type Tema } from './theme';
import type { AppData, QuizItem, TopicId } from './types';

/* ---------- Navigasjon ---------- */
type Side = 'idag' | 'plan' | 'ov' | 'eksamen' | 'fremdrift' | 'innstillinger';
const MENY: { side: Side; navn: string; ikon: string; mobil: boolean }[] = [
  { side: 'idag', navn: 'I dag', ikon: 'idag', mobil: true },
  { side: 'plan', navn: 'Plan', ikon: 'plan', mobil: true },
  { side: 'ov', navn: 'Øv', ikon: 'ov', mobil: true },
  { side: 'eksamen', navn: 'Eksamen', ikon: 'eksamen', mobil: true },
  { side: 'fremdrift', navn: 'Fremdrift', ikon: 'fremdrift', mobil: true },
  { side: 'innstillinger', navn: 'Innstillinger', ikon: 'innstillinger', mobil: false },
];

function lesHash(): { side: Side; dag: string | null } {
  const h = location.hash.slice(1);
  const m = /^dag-(\d)$/.exec(h);
  if (m) {
    const p = plan.find((x) => x.dagNr === Number(m[1]));
    if (p) return { side: 'plan', dag: p.dato };
  }
  const s = MENY.find((x) => x.side === h)?.side ?? 'idag';
  return { side: s, dag: null };
}

const STEG_IKON: Record<Steg['type'], string> = {
  diagnose: 'mal', sjekk: 'sjekk', kort: 'kort', repetisjon: 'repeter', oppgaver: 'ov', svakheter: 'mal',
  eksamen: 'eksamen', 'muntlig-spm': 'mikrofon', 'muntlig-sim': 'mikrofon', match: 'match', dagstest: 'stjerne',
};
const STEG_TYPE: Record<Steg['type'], string> = {
  diagnose: 'Diagnose', sjekk: 'Sjekkliste', kort: 'Lær kort', repetisjon: 'Repetisjon', oppgaver: 'Oppgaver', svakheter: 'Svakheter',
  eksamen: 'Eksamensoppgave', 'muntlig-spm': 'Muntlig', 'muntlig-sim': 'Muntlig simulering', match: 'Match', dagstest: 'Dagstest',
};

interface Fokus { tittel: string; innhold: ReactNode }
type Apne = (tittel: string, lag: (lukk: () => void) => ReactNode) => void;

/* ---------- Hjelpere for øktene ---------- */
function forfalteKort(d: AppData) {
  return shuffle(kortSomForfaller(d)).slice(0, 25);
}
function svakhetsOppgaver(d: AppData): QuizItem[] {
  const rang = [...topics].sort((a, b) => svakhet(d, b.id) - svakhet(d, a.id)).slice(0, 3).map((t) => t.id);
  const feil = quiz.filter((q) => d.quiz[q.id] && !d.quiz[q.id].sisteRiktig);
  const ekstra = quiz.filter((q) => rang.includes(q.tema) && !feil.includes(q) && !d.quiz[q.id]?.sisteRiktig);
  return shuffle([...feil, ...ekstra]).slice(0, 10);
}
function oppgaverFor(temaer: TopicId[], unntak: string[] = []) {
  return quiz.filter((q) => temaer.includes(q.tema) && !unntak.includes(q.id)).sort((a, b) => a.niva - b.niva);
}

/** Starter et steg i fokusvisning og markerer det som fullført når det er gjort. */
function startSteg(apne: Apne, d: AppData, dag: PlanDay, steg: Steg) {
  const ferdig = (lukk: () => void) => () => { fullforSteg(dag.dato, steg.id); lukk(); };
  const testIds = dag.steg.find((s) => s.type === 'dagstest')?.ids ?? [];
  apne(steg.tittel, (lukk) => {
    switch (steg.type) {
      case 'diagnose': return <Diagnose onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'sjekk': return <SjekkSteg instruks={steg.instruks ?? []} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'kort': return <LaerOkt kort={flashcards.filter((k) => steg.temaer?.includes(k.tema))} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'repetisjon': {
        const k = forfalteKort(d);
        if (k.length === 0) return <TomtSteg tekst="Ingen kort trenger repetisjon akkurat nå. Bra jobba!" onFerdig={ferdig(lukk)} />;
        return <LaerOkt kort={k} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      }
      case 'oppgaver': return <QuizOkt items={oppgaverFor(steg.temaer ?? [], testIds)} modus="ov" onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'svakheter': {
        const items = svakhetsOppgaver(d);
        if (items.length === 0) return <TomtSteg tekst="Ingen tydelige svakheter registrert. Ta en blandet øvingsøkt i «Øv» i stedet." onFerdig={ferdig(lukk)} />;
        return <QuizOkt items={items} modus="ov" onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      }
      case 'eksamen': {
        const t = examTasks.find((x) => x.id === steg.taskId)!;
        return <EksamenOppgave task={t} onLagret={(s) => { registrerDagEksamen(dag.dato, t.id, s); ferdig(lukk)(); }} onAvslutt={lukk} />;
      }
      case 'muntlig-spm': return <Sensorsporsmal antall={steg.antall ?? 5} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'muntlig-sim': return <Simulering sim={oralSims.find((s) => s.id === steg.simId)!} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'match': return <MatchSpill sett={`dag-${dag.dagNr}`} temaer={steg.temaer} onFerdig={ferdig(lukk)} onAvslutt={lukk} />;
      case 'dagstest': {
        const items = (steg.ids ?? []).map((id) => quiz.find((q) => q.id === id)!).filter(Boolean);
        return <QuizOkt items={items} modus="test" krav={steg.krav}
          onLagre={(s) => registrerDagstest(dag.dato, s)}
          onFerdig={(s) => { registrerDagstest(dag.dato, s); ferdig(lukk)(); }} onAvslutt={lukk} />;
      }
    }
  });
}

function TomtSteg({ tekst, onFerdig }: { tekst: string; onFerdig: () => void }) {
  return (
    <div className="fokus-innhold">
      <div className="flate sentrert"><Ikon navn="sjekk" stor /><p>{tekst}</p><button className="knapp stor" onClick={onFerdig} autoFocus>Marker som gjort</button></div>
    </div>
  );
}

/* ======================= APP ======================= */
export default function App() {
  const [ulast, setUlast] = useState(erUlast);
  if (!ulast) return <LaasSkjerm onUlast={() => setUlast(true)} />;
  return <Hoved />;
}

function Hoved() {
  const d = useData();
  const [tema, settTema, erMork] = useTema();
  const [rute, setRute] = useState(lesHash);
  const [fokus, setFokus] = useState<Fokus | null>(null);

  useEffect(() => {
    const f = () => { setRute(lesHash()); setFokus(null); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  const gaTil = (side: Side, dag?: string) => {
    const h = dag ? `dag-${plan.find((p) => p.dato === dag)!.dagNr}` : side;
    if (location.hash.slice(1) === h) setRute(lesHash()); else location.hash = h;
    setFokus(null);
    window.scrollTo(0, 0);
  };
  const apne: Apne = (tittel, lag) => {
    const lukk = () => { setFokus(null); window.scrollTo(0, 0); };
    setFokus({ tittel, innhold: lag(lukk) });
    window.scrollTo(0, 0);
  };
  const nesteTema: Record<Tema, Tema> = { system: erMork ? 'lys' : 'mork', lys: 'mork', mork: 'lys' };
  const temaKnapp = (
    <button className="ikonknapp" onClick={() => settTema(nesteTema[tema])} aria-label={erMork ? 'Bytt til lys modus' : 'Bytt til mørk modus'} title={erMork ? 'Lys modus' : 'Mørk modus'}>
      <Ikon navn={erMork ? 'sol' : 'maane'} />
    </button>
  );
  const forfalt = kortSomForfaller(d).length;

  if (fokus) {
    return (
      <div className="fokus">
        <header className="fokus-topp">
          <button className="ikonknapp" onClick={() => setFokus(null)} aria-label="Lukk"><Ikon navn="kryss" /></button>
          <span className="fokus-tittel">{fokus.tittel}</span>
          {temaKnapp}
        </header>
        <main className="fokus-main">{fokus.innhold}</main>
      </div>
    );
  }

  return (
    <div className="skall">
      <aside className="sidemeny">
        <div className="merkevare">
          <span className="logo">IT2</span>
          <span className="logo-tekst">Eksamenstrener</span>
        </div>
        <nav aria-label="Hovedmeny">
          {MENY.map((m) => (
            <button key={m.side} className={`menyvalg ${rute.side === m.side ? 'aktiv' : ''}`} onClick={() => gaTil(m.side)} aria-current={rute.side === m.side ? 'page' : undefined}>
              <Ikon navn={m.ikon} /><span>{m.navn}</span>
              {m.side === 'ov' && forfalt > 0 && <span className="teller">{forfalt}</span>}
            </button>
          ))}
        </nav>
        <div className="sidemeny-bunn">
          <div className="nedtelling"><b className="tall">{Math.max(0, dagerIgjen())}</b> dager til REA3049</div>
          <div className="rad">{temaKnapp}<button className="ikonknapp" onClick={laas} aria-label="Lås appen" title="Lås appen"><Ikon navn="laas" /></button></div>
        </div>
      </aside>

      <header className="mobiltopp">
        <span className="logo">IT2</span>
        <span className="mobiltopp-dager"><b className="tall">{Math.max(0, dagerIgjen())}</b> dager igjen</span>
        <span className="mobiltopp-knapper">
          {temaKnapp}
          <button className="ikonknapp" onClick={() => gaTil('innstillinger')} aria-label="Innstillinger"><Ikon navn="innstillinger" /></button>
        </span>
      </header>

      <main className="innhold">
        {rute.side === 'idag' && <IDag d={d} apne={apne} gaTil={gaTil} />}
        {rute.side === 'plan' && (rute.dag
          ? <DagSide d={d} dag={plan.find((p) => p.dato === rute.dag)!} apne={apne} gaTil={gaTil} />
          : <PlanSide d={d} gaTil={gaTil} />)}
        {rute.side === 'ov' && <OvSide d={d} apne={apne} />}
        {rute.side === 'eksamen' && <EksamenSide d={d} apne={apne} />}
        {rute.side === 'fremdrift' && <FremdriftSide d={d} />}
        {rute.side === 'innstillinger' && <Innstillinger tema={tema} settTema={settTema} />}
      </main>

      <nav className="bunnmeny" aria-label="Hovedmeny">
        {MENY.filter((m) => m.mobil).map((m) => (
          <button key={m.side} className={rute.side === m.side ? 'aktiv' : ''} onClick={() => gaTil(m.side)} aria-current={rute.side === m.side ? 'page' : undefined}>
            <span className="bunn-ikon"><Ikon navn={m.ikon} />{m.side === 'ov' && forfalt > 0 && <span className="prikk-varsel" />}</span>
            <span>{m.navn}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ======================= I DAG ======================= */
function IDag({ d, apne, gaTil }: { d: AppData; apne: Apne; gaTil: (s: Side, dag?: string) => void }) {
  const dag = aktivDag(d);
  const g = dagState(d, dag.dato);
  const neste = nesteSteg(d, dag);
  const fr = dagFremdrift(d, dag);
  const kal = kalenderStatus(d);
  const forfalt = kortSomForfaller(d).length;
  const st = streak(d);
  const idag = datoNokkel();

  return (
    <div className="stack">
      <section className="helt" aria-labelledby="neste-tittel">
        <p className="etikett lys">Dag {dag.dagNr} av 9 · {dag.ukedag} {Number(dag.dato.slice(8))}. nov{g.runde > 1 ? ` · runde ${g.runde}` : ''}</p>
        <h1 id="neste-tittel">{dag.tittel}</h1>
        <div className="helt-fremdrift">
          <Fremdrift verdi={fr.totalt ? fr.ferdig / fr.totalt : 0} />
          <span>{fr.ferdig} av {fr.totalt} steg</span>
        </div>
        {neste && !(fr.alleKravFerdig && neste.valgfri) ? (
          <div className="neste">
            <div className="neste-info">
              <span className="neste-ikon"><Ikon navn={STEG_IKON[neste.type]} /></span>
              <div>
                <p className="etikett lys">Neste steg · ca. {neste.minutter} min</p>
                <p className="neste-tittel">{neste.tittel}</p>
              </div>
            </div>
            <button className="knapp stor lys-knapp" onClick={() => startSteg(apne, d, dag, neste)}>
              <Ikon navn="spill" /> Start
            </button>
          </div>
        ) : (
          <div className="neste">
            <div className="neste-info">
              <span className="neste-ikon"><Ikon navn="mal" /></span>
              <div>
                <p className="etikett lys">Alle obligatoriske steg er gjort</p>
                <p className="neste-tittel">Sjekk målene og bekreft dagen</p>
              </div>
            </div>
            <button className="knapp stor lys-knapp" onClick={() => gaTil('plan', dag.dato)}>Åpne dagen</button>
          </div>
        )}
        <button className="lenkeknapp lys" onClick={() => gaTil('plan', dag.dato)}>Se alle stegene og målene for dagen →</button>
      </section>

      {kal.type !== 'i-rute' && <p className={`status-linje ${kal.type === 'bak' ? 'advar' : ''}`}><Ikon navn={kal.type === 'bak' ? 'advarsel' : 'plan'} /> {kal.tekst}</p>}

      <div className="fliser">
        <button className="flis" onClick={() => forfalt > 0 && apne('Repetisjon', (lukk) => <LaerOkt kort={forfalteKort(d)} onFerdig={lukk} onAvslutt={lukk} />)} disabled={forfalt === 0}>
          <Ikon navn="repeter" /><b className="tall">{forfalt}</b><span>kort til repetisjon</span>
        </button>
        <div className="flis"><Ikon navn="flamme" /><b className="tall">{st}</b><span>{st === 1 ? 'dag' : 'dager'} på rad</span></div>
        <div className="flis"><Ikon navn="eksamen" /><b className="tall">{Math.max(0, dagerIgjen())}</b><span>dager til skriftlig</span></div>
      </div>

      <section className="flate" aria-labelledby="uke-tittel">
        <h2 id="uke-tittel" className="seksjon-tittel">Veien til eksamen</h2>
        <ol className="tidslinje">
          {plan.map((p) => {
            const s = dagState(d, p.dato);
            const aktiv = p.dato === dag.dato;
            const status = p.type === 'buffer' ? 'buffer' : s.bekreftet ? 'bekreftet' : aktiv ? 'aktiv' : 'kommer';
            return (
              <li key={p.dato}>
                <button className={`tl-dag ${status} ${p.dato === idag ? 'kalender-idag' : ''}`} onClick={() => gaTil('plan', p.dato)}>
                  <span className="tl-prikk">{s.bekreftet ? <Ikon navn="sjekk" /> : p.type === 'buffer' ? '–' : p.dagNr}</span>
                  <span className="tl-tekst"><b>{p.ukedag.slice(0, 3)} {Number(p.dato.slice(8))}.</b><span>{p.tittel}</span></span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/* ======================= PLAN ======================= */
function PlanSide({ d, gaTil }: { d: AppData; gaTil: (s: Side, dag?: string) => void }) {
  const aktiv = aktivDag(d);
  return (
    <div className="stack">
      <div className="side-topp">
        <h1>Studieplan</h1>
        <p className="dempet">9.–17. november. Hver dag har steg i fast rekkefølge og et mål. Du kan ta en dag så mange ganger du vil, og bekrefter den når du føler at du forstår den.</p>
        <p className="liten"><span className="chip">minimum</span> = dagen er med i minimumsplanen. Steg merket «ekstra» hører til den optimale planen.</p>
      </div>
      {plan.map((p) => {
        const g = dagState(d, p.dato);
        const fr = dagFremdrift(d, p);
        const erAktiv = p.dato === aktiv.dato;
        return (
          <button key={p.dato} className={`dagkort ${erAktiv ? 'aktiv' : ''} ${p.type === 'buffer' ? 'buffer' : ''}`} onClick={() => gaTil('plan', p.dato)}>
            <span className={`dagnr ${g.bekreftet ? 'ok' : ''}`}>{g.bekreftet ? <Ikon navn="sjekk" /> : p.type === 'buffer' ? '–' : p.dagNr}</span>
            <span className="dagkort-tekst">
              <span className="etikett">{p.ukedag} {Number(p.dato.slice(8))}. nov · {p.tid}</span>
              <b>{p.tittel}</b>
              <span className="merker">
                {p.minimum && <span className="chip">minimum</span>}
                {erAktiv && <span className="chip aksent">her er du</span>}
                {g.bekreftet && <span className="chip ok">bekreftet</span>}
                {g.runde > 1 && <span className="chip">runde {g.runde}</span>}
                {p.type !== 'buffer' && <span className="chip">{fr.ferdig}/{fr.totalt} steg</span>}
              </span>
            </span>
            <Ikon navn="pil" />
          </button>
        );
      })}
      <div className="flate">
        <h2 className="seksjon-tittel">Hvis du mister en dag</h2>
        <p>Ta den igjen fredag (buffer). Mister du flere, prioriter i denne rekkefølgen:</p>
        <ol className="liste">{prioritetsrekkefolge.map((p) => <li key={p.tema}><b>{p.tema.replace(/^\d+\.\s*/, '')}</b> – {p.hvorfor}</li>)}</ol>
      </div>
    </div>
  );
}

function DagSide({ d, dag, apne, gaTil }: { d: AppData; dag: PlanDay; apne: Apne; gaTil: (s: Side, dag?: string) => void }) {
  const g = dagState(d, dag.dato);
  const maal = maalStatus(d, dag);
  const neste = nesteSteg(d, dag);
  const fr = dagFremdrift(d, dag);
  const autoOk = maal.filter((m) => m.ok !== null).every((m) => m.ok);
  const [bekreftLikevel, setBekreftLikevel] = useState(false);
  const [nyRundeSporsmal, setNyRundeSporsmal] = useState(false);

  return (
    <div className="stack">
      <button className="lenkeknapp tilbake" onClick={() => gaTil('plan')}><Ikon navn="tilbake" /> Studieplan</button>
      <div className="side-topp">
        <p className="etikett">Dag {dag.dagNr} · {dag.ukedag} {Number(dag.dato.slice(8))}. nov · {dag.tid}{g.runde > 1 ? ` · runde ${g.runde}` : ''}</p>
        <h1>{dag.tittel}</h1>
        <p>{dag.mal}</p>
        {g.bekreftet && <p className="status-linje ok"><Ikon navn="sjekk" /> Du har bekreftet at du forstår denne dagen.</p>}
      </div>

      {dag.maal.length > 0 && (
        <section className="flate" aria-labelledby="maal-tittel">
          <h2 id="maal-tittel" className="seksjon-tittel"><Ikon navn="mal" /> Mål for dagen</h2>
          <ul className="maalliste">
            {maal.map((m) => (
              <li key={m.tekst} className={m.ok === true ? 'ok' : m.ok === false ? 'ikke' : 'selv'}>
                <span className="maal-merke">{m.ok === true ? <Ikon navn="sjekk" /> : m.ok === false ? '' : '?'}</span>
                <span>{m.tekst}{m.ok === null && <span className="liten dempet"> – vurder selv</span>}</span>
              </li>
            ))}
          </ul>
          {g.testBest !== null && <p className="liten">Beste dagstest i denne runden: <b>{Math.round(g.testBest * 100)} %</b></p>}
        </section>
      )}

      <section className="flate" aria-labelledby="steg-tittel">
        <h2 id="steg-tittel" className="seksjon-tittel">Steg ({fr.ferdig} av {fr.totalt} obligatoriske gjort)</h2>
        <ol className="stegliste">
          {dag.steg.map((s, i) => {
            const ok = stegFullfort(d, dag, s);
            const erNeste = neste?.id === s.id;
            return (
              <li key={s.id} className={`steg ${ok ? 'ok' : ''} ${erNeste ? 'neste-steg' : ''} ${s.valgfri ? 'valgfri' : ''}`}>
                <span className="steg-nr">{ok ? <Ikon navn="sjekk" /> : i + 1}</span>
                <span className="steg-tekst">
                  <b>{s.tittel}</b>
                  <span className="liten dempet">{STEG_TYPE[s.type]} · ca. {s.minutter} min{s.valgfri ? ' · ekstra' : ''}</span>
                </span>
                <button className={`knapp ${erNeste ? '' : 'sek'} liten-knapp`} onClick={() => startSteg(apne, d, dag, s)}>{ok ? 'Igjen' : erNeste ? 'Start' : 'Åpne'}</button>
              </li>
            );
          })}
        </ol>
        <p className="liten dempet">Repeter senere: {dag.repeter}</p>
      </section>

      {dag.type !== 'buffer' && (
        <section className="flate bekreft-flate" aria-labelledby="bekreft-tittel">
          <h2 id="bekreft-tittel" className="seksjon-tittel">Forstår du dette?</h2>
          {!g.bekreftet ? (
            <>
              {!fr.alleKravFerdig ? <p className="dempet">Gjør de obligatoriske stegene først. Du kan bekrefte når du føler at du kan stoffet.</p>
                : autoOk ? <p>Målene som kan måles, er nådd. Hvis du også kan det som står «vurder selv», kan du bekrefte dagen.</p>
                : <p className="advar-tekst">Noen mål er ikke nådd ennå. Anbefaling: ta dagen på nytt.</p>}
              <div className="rad">
                {(autoOk && fr.alleKravFerdig) || bekreftLikevel
                  ? <button className="knapp gronn" onClick={() => { bekreftDag(dag.dato, true); gaTil('idag'); }}><Ikon navn="sjekk" /> Jeg forstår dette – gå videre</button>
                  : <button className="knapp sek" onClick={() => setBekreftLikevel(true)}>Jeg vil bekrefte likevel …</button>}
                <button className="knapp sek" onClick={() => setNyRundeSporsmal(true)}><Ikon navn="repeter" /> Ta dagen på nytt</button>
              </div>
            </>
          ) : (
            <div className="rad">
              <button className="knapp sek" onClick={() => setNyRundeSporsmal(true)}><Ikon navn="repeter" /> Ta dagen på nytt</button>
              <button className="knapp sek" onClick={() => bekreftDag(dag.dato, false)}>Angre bekreftelsen</button>
            </div>
          )}
          {nyRundeSporsmal && (
            <div className="bekreft-boks">
              <p>Stegene nullstilles, og du går gjennom dagen på nytt (runde {g.runde + 1}). Det du har lært i kortene, beholdes.</p>
              <div className="rad">
                <button className="knapp" onClick={() => { nyRunde(dag.dato); setNyRundeSporsmal(false); setBekreftLikevel(false); window.scrollTo(0, 0); }}>Start runde {g.runde + 1}</button>
                <button className="knapp sek" onClick={() => setNyRundeSporsmal(false)}>Avbryt</button>
              </div>
            </div>
          )}
          {g.historikk.length > 0 && (
            <p className="liten dempet">Tidligere runder: {g.historikk.map((h) => `runde ${h.runde}${h.test !== null ? ` (${Math.round(h.test * 100)} %)` : ''}`).join(', ')}</p>
          )}
        </section>
      )}
    </div>
  );
}

/* ======================= ØV ======================= */
function OvSide({ d, apne }: { d: AppData; apne: Apne }) {
  const [valgtTema, setValgtTema] = useState<TopicId | null>(null);
  const forfalt = kortSomForfaller(d);
  const svakeste = [...topics].sort((a, b) => svakhet(d, b.id) - svakhet(d, a.id)).slice(0, 3);
  const tema = valgtTema ? topics.find((t) => t.id === valgtTema)! : null;

  return (
    <div className="stack">
      <div className="side-topp">
        <h1>Øv fritt</h1>
        <p className="dempet">Alt her teller med i fremdriften. Dagsplanen under «I dag» viser hva som er viktigst nå.</p>
      </div>
      <div className="modus-rutenett">
        <button className="modus" onClick={() => forfalt.length > 0 && apne('Repetisjon', (l) => <LaerOkt kort={forfalteKort(d)} onFerdig={l} onAvslutt={l} />)} disabled={forfalt.length === 0}>
          <Ikon navn="repeter" /><b>Repetisjon</b><span>{forfalt.length > 0 ? `${forfalt.length} kort venter` : 'Ingen kort venter nå'}</span>
        </button>
        <button className="modus" onClick={() => apne('Svakhetsøkt', (l) => <QuizOkt items={svakhetsOppgaver(d)} modus="ov" onFerdig={l} onAvslutt={l} />)}>
          <Ikon navn="mal" /><b>Svakhetsøkt</b><span>{svakeste.map((t) => t.navn.split(',')[0]).join(' · ')}</span>
        </button>
        <button className="modus" onClick={() => apne('Match', (l) => <MatchSpill sett="alle" onFerdig={l} onAvslutt={l} />)}>
          <Ikon navn="match" /><b>Match</b><span>{d.matchBest.alle ? `Rekord ${(d.matchBest.alle / 1000).toFixed(1)} s` : 'Koble begreper på tid'}</span>
        </button>
        <button className="modus" onClick={() => apne('Blandet øving', (l) => <QuizOkt items={shuffle(quiz).slice(0, 10)} modus="ov" onFerdig={l} onAvslutt={l} />)}>
          <Ikon navn="ov" /><b>Blandet øving</b><span>10 oppgaver fra hele faget</span>
        </button>
        <button className="modus" onClick={() => apne('Diagnostisk test', (l) => <Diagnose onFerdig={l} onAvslutt={l} />)}>
          <Ikon navn="stjerne" /><b>Diagnostisk test</b><span>{d.diagnose ? 'Ta den på nytt' : '15 min – start her'}</span>
        </button>
      </div>

      <section className="flate" aria-labelledby="tema-tittel">
        <h2 id="tema-tittel" className="seksjon-tittel">Velg tema</h2>
        <div className="tema-chips" role="listbox" aria-label="Tema">
          {topics.map((t) => {
            const m = mestringForTema(d, t.id);
            return (
              <button key={t.id} role="option" aria-selected={valgtTema === t.id} className={`tema-chip ${valgtTema === t.id ? 'valgt' : ''}`} onClick={() => setValgtTema(valgtTema === t.id ? null : t.id)}>
                {t.navn}<span className="tema-pst tall">{Math.round(m.score * 100)} %</span>
              </button>
            );
          })}
        </div>
        {tema && (
          <div className="tema-valg">
            <p className="dempet">{tema.kort}</p>
            <div className="rad">
              <button className="knapp" onClick={() => apne(`Lær: ${tema.navn}`, (l) => <LaerOkt kort={flashcards.filter((k) => k.tema === tema.id)} onFerdig={l} onAvslutt={l} />)}>
                <Ikon navn="kort" /> Lær kortene ({flashcards.filter((k) => k.tema === tema.id).length})
              </button>
              <button className="knapp sek" onClick={() => apne(`Oppgaver: ${tema.navn}`, (l) => <QuizOkt items={oppgaverFor([tema.id])} modus="ov" onFerdig={l} onAvslutt={l} />)}>
                <Ikon navn="ov" /> Oppgaver ({quiz.filter((q) => q.tema === tema.id).length})
              </button>
              <button className="knapp sek" onClick={() => apne(`Match: ${tema.navn}`, (l) => <MatchSpill sett={`tema-${tema.id}`} temaer={[tema.id]} onFerdig={l} onAvslutt={l} />)}>
                <Ikon navn="match" /> Match
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ======================= EKSAMEN ======================= */
function EksamenSide({ d, apne }: { d: AppData; apne: Apne }) {
  const [fane, setFane] = useState<'skriftlig' | 'muntlig'>('skriftlig');
  const best = (id: string) => {
    const f = d.eksamen.filter((e) => e.taskId === id);
    return f.length ? Math.max(...f.map((e) => e.egenScore)) : null;
  };
  return (
    <div className="stack">
      <div className="side-topp">
        <h1>Eksamenstrening</h1>
        <div className="segmentert" role="tablist">
          <button role="tab" aria-selected={fane === 'skriftlig'} className={fane === 'skriftlig' ? 'aktiv' : ''} onClick={() => setFane('skriftlig')}>REA3049 skriftlig</button>
          <button role="tab" aria-selected={fane === 'muntlig'} className={fane === 'muntlig' ? 'aktiv' : ''} onClick={() => setFane('muntlig')}>REA3050 muntlig</button>
        </div>
      </div>
      {fane === 'skriftlig' ? (
        <>
          <p className="dempet">Onsdag 18. november kl. 09:00–14:00 (5 timer). Egne øvingsoppgaver laget etter oppgavetypene i settene 2023–2026. Ingen hint underveis – løsningsforslaget kommer når du leverer.</p>
          <div className="oppgaveliste">
            {examTasks.filter((t) => t.eksamen === 'skriftlig').map((t) => {
              const b = best(t.id);
              return (
                <button key={t.id} className="oppgave-rad" onClick={() => apne(t.tittel, (l) => <EksamenOppgave task={t} onLagret={l} onAvslutt={l} />)}>
                  <span className="oppgave-tekst"><b>{t.tittel}</b><span className="liten dempet">{t.kilde}</span></span>
                  <span className="merker">
                    <span className="chip">{t.minutter} min</span>
                    {b !== null && <span className={`chip ${b >= 60 ? 'ok' : 'nei'}`}>beste {b} %</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="dempet">Lokalt gitt eksamen – tidligere oppgaver publiseres ikke. Øv på å forklare høyt, med fagbegreper og eksempler fra egen kode.</p>
          <div className="modus-rutenett">
            <button className="modus" onClick={() => apne('Sensorspørsmål', (l) => <Sensorsporsmal antall={5} onFerdig={l} onAvslutt={l} />)}>
              <Ikon navn="mikrofon" /><b>Sensorspørsmål</b><span>5 spørsmål · {Object.keys(d.muntlig).filter((k) => oralQuestions.some((q) => q.id === k)).length}/{oralQuestions.length} øvd</span>
            </button>
            {oralSims.map((s) => (
              <button key={s.id} className="modus" onClick={() => apne(s.tittel, (l) => <Simulering sim={s} onFerdig={l} onAvslutt={l} />)}>
                <Ikon navn="spill" /><b>Simulering: {s.tittel}</b><span>{d.muntlig[s.id] !== undefined ? 'Gjennomført – ta igjen' : '30 + 45 min'}</span>
              </button>
            ))}
            {examTasks.filter((t) => t.eksamen === 'muntlig').map((t) => (
              <button key={t.id} className="modus" onClick={() => apne(t.tittel, (l) => <EksamenOppgave task={t} onLagret={l} onAvslutt={l} />)}>
                <Ikon navn="eksamen" /><b>{t.tittel}</b><span>Praktisk oppgave · {t.minutter} min</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ======================= FREMDRIFT ======================= */
function FremdriftSide({ d }: { d: AppData }) {
  return (
    <div className="stack">
      <div className="side-topp">
        <h1>Fremdrift</h1>
        <p className="dempet">Beregnet fra det du faktisk har klart – ikke hvor mange kort du har bladd gjennom. Ingen garanti for karakter.</p>
      </div>
      <div className="to">
        <BeredskapKort tittel="REA3049 – skriftlig" verdi={beredskap(d, 'skriftlig')} />
        <BeredskapKort tittel="REA3050 – muntlig-praktisk" verdi={beredskap(d, 'muntlig')} />
      </div>
      <section className="flate" aria-labelledby="mestring-tittel">
        <h2 id="mestring-tittel" className="seksjon-tittel">Mestring per tema</h2>
        <div className="forklaring">
          <span><i className="prikk mestret" />kan uten hjelp</span><span><i className="prikk laerer" />forstår med eksempel</span>
          <span><i className="prikk feil" />mestrer ikke ennå</span><span><i className="prikk ny" />ikke testet</span>
        </div>
        <div className="mestring">
          {topics.map((t) => {
            const m = mestringForTema(d, t.id);
            return (
              <div key={t.id} className="mestring-rad">
                <div className="mestring-navn"><b>{t.navn}</b><span className="liten dempet">{t.km} · {t.prioritet === 1 ? 'må kunne' : t.prioritet === 2 ? 'viktig' : 'nyttig'}</span></div>
                <div className="stablet" aria-label={`${Math.round(m.score * 100)} prosent`}>
                  <span className="g" style={{ flex: m.henter }} /><span className="y" style={{ flex: m.forstar }} /><span className="r" style={{ flex: m.ikke }} /><span className="u" style={{ flex: m.utestet }} />
                </div>
                <span className="tall mestring-pst">{Math.round(m.score * 100)} %</span>
              </div>
            );
          })}
        </div>
      </section>
      <section className="flate" aria-labelledby="km-tittel">
        <h2 id="km-tittel" className="seksjon-tittel">De 11 kompetansemålene</h2>
        <div className="km-liste">
          {kmMatrise.map((m) => (
            <details key={m.km}>
              <summary><b>{m.km}</b> {kompetansemal[m.km]}</summary>
              <p className="liten">Øv: {m.ovelser}</p>
              <p className="liten dempet">Tidligere eksamen: {m.eksamenstyper}</p>
            </details>
          ))}
        </div>
        <p className="liten dempet">Kilde: Udir INF01-03. Eksamensmønstrene bygger på sju skriftlige sett 2023–2026 – de sier noe om historikken, ikke hva som garantert kommer.</p>
      </section>
      <p className="liten dempet">Innhold: {flashcards.length} kort · {quiz.length} oppgaver · {examTasks.length} eksamensoppgaver · {oralSims.length} simuleringer · {oralQuestions.length} sensorspørsmål</p>
    </div>
  );
}

/* ======================= INNSTILLINGER ======================= */
function Innstillinger({ tema, settTema }: { tema: Tema; settTema: (t: Tema) => void }) {
  return (
    <div className="stack">
      <div className="side-topp"><h1>Innstillinger</h1></div>
      <section className="flate" aria-labelledby="utseende-tittel">
        <h2 id="utseende-tittel" className="seksjon-tittel">Utseende</h2>
        <div className="segmentert" role="radiogroup" aria-label="Fargetema">
          {([['lys', 'Lys', 'sol'], ['mork', 'Mørk', 'maane'], ['system', 'Følg enheten', 'auto']] as const).map(([v, n, i]) => (
            <button key={v} role="radio" aria-checked={tema === v} className={tema === v ? 'aktiv' : ''} onClick={() => settTema(v)}><Ikon navn={i} /> {n}</button>
          ))}
        </div>
      </section>
      <Lagring />
      <section className="flate" aria-labelledby="laas-tittel">
        <h2 id="laas-tittel" className="seksjon-tittel">PIN-lås</h2>
        <p>Appen spør om PIN-koden hver gang du åpner den i en ny fane. Låsen holder tilfeldige besøkende ute, men er ikke ekte sikkerhet, siden siden er offentlig på GitHub. Fremdriften din ligger uansett bare i din egen nettleser – andre kan ikke se eller endre den.</p>
        <button className="knapp sek" onClick={laas}><Ikon navn="laas" /> Lås nå</button>
      </section>
    </div>
  );
}
