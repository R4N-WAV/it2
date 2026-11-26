import { useEffect, useState, type ReactNode } from 'react';
import './App.css';
import './rea/rea.css';
import { Ikon } from './components';
import { LaasSkjerm, erUlast, laas } from './Lock';
import { kapittel, kapitlerForKm } from './rea/pensum';
import { SimulatorSide } from './rea/Simulator';
import {
  BankSide, Dashboard, FeilloggSide, InfoSide, Innstillinger, LesBibliotek, Leser, MerSide, MuntligSide, PlanSide, VerkstedSide,
  dagerTilEksamen, type Apne, type Side,
} from './rea/sider';
import { useData } from './rea/store';
import { SynkMerke } from './rea/SynkOppsett';
import { forfalteRep } from './rea/vurdering';
import { useTema, type Tema } from './theme';
import { KodelabSide } from './rea/helg/Kodelab';

const MENY: { side: Side; navn: string; ikon: string; mobil: boolean }[] = [
  { side: 'idag', navn: 'I dag', ikon: 'idag', mobil: true },
  { side: 'plan', navn: 'Helgeplan', ikon: 'plan', mobil: true },
  { side: 'kodelab', navn: 'Kodelab', ikon: 'kode', mobil: true },
  { side: 'muntlig', navn: 'Muntlig sensor', ikon: 'mikrofon', mobil: true },
  { side: 'les', navn: 'Les (oppslag)', ikon: 'bok', mobil: true },
  { side: 'verksted', navn: 'Verksted', ikon: 'ov', mobil: false },
  { side: 'sim', navn: 'Simulator', ikon: 'eksamen', mobil: true },
  { side: 'bank', navn: 'Oppgavebank', ikon: 'kort', mobil: false },
  { side: 'feil', navn: 'Feillogg', ikon: 'advarsel', mobil: false },
  { side: 'info', navn: 'Eksamen og begreper', ikon: 'mal', mobil: false },
  { side: 'innstillinger', navn: 'Innstillinger', ikon: 'innstillinger', mobil: false },
];
const SIDER = new Set<string>([...MENY.map((m) => m.side), 'mer']);

function lesHash(): { side: Side; param?: string; anker?: string } {
  const [s, param, anker] = location.hash.slice(1).split('/');
  return { side: (SIDER.has(s) ? s : 'idag') as Side, param, anker };
}

interface Fokus { tittel: string; innhold: ReactNode }

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
  useEffect(() => {
    if (rute.anker) setTimeout(() => document.getElementById(rute.anker!)?.scrollIntoView(), 50);
  }, [rute]);

  const gaTil = (side: Side, param?: string) => {
    const h = param ? `${side}/${param}` : side;
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
  const forfalt = forfalteRep(d).length;
  const igjen = Math.max(0, dagerTilEksamen());

  if (fokus) {
    return (
      <div className="fokus">
        <header className="fokus-topp">
          <button className="ikonknapp" onClick={() => { if (confirm('Avslutte økta? Det du har lagret, beholdes.')) setFokus(null); }} aria-label="Lukk"><Ikon navn="kryss" /></button>
          <span className="fokus-tittel">{fokus.tittel}</span>
          {temaKnapp}
        </header>
        <main className="fokus-main">{fokus.innhold}</main>
      </div>
    );
  }

  const k = rute.side === 'les' && rute.param ? kapittel(rute.param) : undefined;
  const side = (
    <>
      {rute.side === 'idag' && <Dashboard d={d} apne={apne} gaTil={gaTil} />}
      {rute.side === 'kodelab' && <KodelabSide d={d} modus={rute.param} apne={apne} />}
      {rute.side === 'plan' && <PlanSide d={d} dato={rute.param} apne={apne} gaTil={gaTil} />}
      {rute.side === 'les' && (k ? <Leser key={k.id} k={k} d={d} apne={apne} gaTil={gaTil} /> : <LesBibliotek d={d} gaTil={gaTil} />)}
      {rute.side === 'muntlig' && <MuntligSide d={d} apne={apne} gaTil={gaTil} />}
      {rute.side === 'verksted' && <VerkstedSide d={d} km={rute.param} apne={apne} />}
      {rute.side === 'sim' && <SimulatorSide onApneKapittel={(km) => gaTil('les', kapitlerForKm(km as never)[0]?.id)} />}
      {rute.side === 'bank' && <BankSide d={d} apne={apne} />}
      {rute.side === 'feil' && <FeilloggSide d={d} apne={apne} gaTil={gaTil} />}
      {rute.side === 'info' && <InfoSide gaTil={gaTil} />}
      {rute.side === 'mer' && <MerSide gaTil={gaTil} />}
      {rute.side === 'innstillinger' && <Innstillinger onLaas={laas} temaKnapper={
        <div className="rad">{(['system', 'lys', 'mork'] as Tema[]).map((t) => <button key={t} className={`knapp ${tema === t ? '' : 'sek'}`} onClick={() => settTema(t)}>{{ system: 'Følg systemet', lys: 'Lys', mork: 'Mørk' }[t]}</button>)}</div>
      } />}
    </>
  );

  return (
    <div className="skall">
      <aside className="sidemeny">
        <div className="merkevare"><span className="logo">IT2</span><span className="logo-tekst">REA3050-trener</span></div>
        <nav aria-label="Hovedmeny">
          {MENY.map((m) => (
            <button key={m.side} className={`menyvalg ${rute.side === m.side ? 'aktiv' : ''}`} onClick={() => gaTil(m.side)} aria-current={rute.side === m.side ? 'page' : undefined}>
              <Ikon navn={m.ikon} /><span>{m.navn}</span>
              {m.side === 'muntlig' && forfalt > 0 && <span className="teller">{forfalt}</span>}
              {m.side === 'sim' && d.aktivSim && <span className="teller">pågår</span>}
            </button>
          ))}
        </nav>
        <div className="sidemeny-bunn">
          <SynkMerke onKlikk={() => gaTil('innstillinger', 'synk')} />
          <div className="nedtelling"><b className="tall">{igjen}</b> dager til REA3050<br /><span className="liten">mandag 30. november</span></div>
          <div className="rad">{temaKnapp}<button className="ikonknapp" onClick={laas} aria-label="Lås appen" title="Lås appen"><Ikon navn="laas" /></button></div>
        </div>
      </aside>

      <header className="mobiltopp">
        <span className="logo">IT2</span>
        <span className="mobiltopp-dager"><b className="tall">{igjen}</b> dager · <SynkMerke onKlikk={() => gaTil('innstillinger', 'synk')} /></span>
        <span className="mobiltopp-knapper">{temaKnapp}
          <button className="ikonknapp" onClick={() => gaTil('mer')} aria-label="Mer: verksted, oppgavebank, feillogg, eksamensinfo, innstillinger"><Ikon navn="innstillinger" /></button></span>
      </header>

      <main className={`innhold ${k ? 'bred' : ''}`}>{side}</main>

      <nav className="bunnmeny" aria-label="Hovedmeny">
        {MENY.filter((m) => m.mobil).map((m) => (
          <button key={m.side} className={rute.side === m.side ? 'aktiv' : ''} onClick={() => gaTil(m.side)} aria-current={rute.side === m.side ? 'page' : undefined}>
            <span className="bunn-ikon"><Ikon navn={m.ikon} />{((m.side === 'muntlig' && forfalt > 0) || (m.side === 'sim' && d.aktivSim)) && <span className="prikk-varsel" />}</span>
            <span>{m.navn}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
