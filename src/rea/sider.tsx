import { useMemo, useState, type ReactNode } from 'react';
import { Fremdrift, Ikon, shuffle } from '../components';
import {
  allePraktiske, caseMedId, caser, droftinger, feilsok, kontrollsporsmal, muntligMedId, muntlige, praktiske, tilleggsoppgaver,
} from './bank';
import { ALLE_KM, KOMPETANSEMAL, kmNavn } from './data/km';
import { EKSAMENSDAG, EKSAMENSDATO, STUDIEDAGER, type Blokk, type Studiedag } from './data/plan';
import { fmtTid, iDag, KmMerker, NivaMerke, StatusChip, SvarBoks } from './felles';
import {
  CaseOving, DiagnoseOkt, fraDrofting, fraMuntlig, fraTillegg, Kapittelkontroll, MuntligOkt, PraktiskOkt, RepetisjonOkt, type SpmItem,
} from './okter';
import { begrepsliste, delSeksjoner, kapitler, kapittel, kapitlerForKm, type Kapittel, type Seksjon } from './pensum';
import {
  eksporter, importer, leggTilFeil, lagreForklart, markerLest, nullstill, settBlokk, settFeilLost, settKortversjon, slettFeil,
} from './store';
import { Inline, Md, nokkelbegreper } from './Tekst';
import { SynkOppsett, SynkPaminnelse } from './SynkOppsett';
import type { AppData, KmId } from './typer';
import { HelgBeredskap, HelgOkt } from './helg/Kodelab';
import { beredskap, datoNokkel, forfalteRep, gjentakendeFeil, mestring } from './vurdering';

export type Side = 'idag' | 'kodelab' | 'plan' | 'les' | 'verksted' | 'muntlig' | 'sim' | 'bank' | 'feil' | 'info' | 'innstillinger' | 'mer';
export type Apne = (tittel: string, lag: (lukk: () => void) => ReactNode) => void;
export type GaTil = (side: Side, param?: string) => void;


/* ---------- Hjelpere ---------- */
const DAG_MS = 86_400_000;
export function dagerTilEksamen(naa = iDag()) {
  const a = new Date(naa.getFullYear(), naa.getMonth(), naa.getDate()).getTime();
  const b = new Date(`${EKSAMENSDATO}T00:00:00`).getTime();
  return Math.round((b - a) / DAG_MS);
}
export function dagensStudiedag(naa = iDag()): Studiedag | 'eksamen' | null {
  const n = datoNokkel(naa);
  if (n === EKSAMENSDATO) return 'eksamen';
  if (n < STUDIEDAGER[0].dato) return STUDIEDAGER[0];
  if (n > EKSAMENSDATO) return null;
  return STUDIEDAGER.find((d) => d.dato === n) ?? STUDIEDAGER[STUDIEDAGER.length - 1];
}
const fmtDato = (dato: string) => new Date(`${dato}T12:00:00`).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });

function svakesteKm(d: AppData, antall = 2): KmId[] {
  const rang = { ingen: 0, rod: 1, gul: 2, gronn: 3, blaa: 4 };
  return ALLE_KM.map((k) => mestring(d, k)).sort((a, b) => rang[a.status] - rang[b.status] || (a.siste ?? 0) - (b.siste ?? 0)).slice(0, antall).map((m) => m.km);
}

function muntligForKm(d: AppData, km: KmId[], n: number): SpmItem[] {
  const kand = muntlige.filter((m) => m.km.some((k) => km.includes(k)));
  const score = (id: string) => d.rep[id]?.siste ?? -1;
  return shuffle(kand).sort((a, b) => score(a.id) - score(b.id)).slice(0, n).map(fraMuntlig);
}

/** Starter en planblokk i fokusvisning. */
export function startBlokk(blokk: Blokk, dag: Studiedag, d: AppData, apne: Apne, gaTil: GaTil) {
  const ferdig = (lukk: () => void) => () => { settBlokk(dag.dato, blokk.id, true); lukk(); };
  switch (blokk.type) {
    case 'kodelab': return apne(blokk.tittel, (l) => <HelgOkt ids={blokk.helg ?? []} onFerdig={ferdig(l)} />);
    case 'diagnose': return apne('Diagnostisk kartlegging', (l) => <DiagnoseOkt onFerdig={ferdig(l)} />);
    case 'les': return gaTil('les', blokk.kapitler![0]);
    case 'muntlig':
    case 'drofting': {
      const items = blokk.muntlig?.length ? blokk.muntlig.map(muntligMedId).filter(Boolean).map((m) => fraMuntlig(m!)) : muntligForKm(d, blokk.km ?? ALLE_KM, 12);
      return apne(blokk.tittel, (l) => <MuntligOkt items={items} onFerdig={ferdig(l)} />);
    }
    case 'praktisk': return apne(blokk.tittel, (l) => <PraktiskOkt ids={blokk.praktisk ?? []} onFerdig={() => {
      if (blokk.muntlig?.length) { settBlokk(dag.dato, blokk.id, true); l(); apne('Forklar høyt', (l2) => <MuntligOkt items={blokk.muntlig!.map(muntligMedId).filter(Boolean).map((m) => fraMuntlig(m!))} onFerdig={l2} />); }
      else ferdig(l)();
    }} />);
    case 'case': return apne(blokk.tittel, (l) => <VelgCase ids={blokk.caser ?? []} ekstraPraktisk={blokk.praktisk} ekstraMuntlig={blokk.muntlig} onFerdig={ferdig(l)} apne={apne} />);
    case 'sim': return gaTil('sim');
    case 'repetisjon': return apne(blokk.tittel, (l) => <RepetisjonOkt d={d} ekstra={blokk.muntlig} onFerdig={ferdig(l)} />);
    case 'svakheter': return gaTil('kodelab', 'svak');
    case 'feillogg': settBlokk(dag.dato, blokk.id, true); return gaTil('feil');
    case 'beredskap': return apne(blokk.tittel, (l) => <BeredskapsSjekk onFerdig={ferdig(l)} />);
    default: return undefined;
  }
}

function VelgCase({ ids, ekstraPraktisk, ekstraMuntlig, onFerdig, apne }: { ids: string[]; ekstraPraktisk?: string[]; ekstraMuntlig?: string[]; onFerdig: () => void; apne: Apne }) {
  const [valgt, setValgt] = useState<string | null>(ids.length === 1 ? ids[0] : null);
  if (valgt) return <CaseOving caseId={valgt} onFerdig={onFerdig} />;
  return (
    <div className="stack">
      <h2>Velg case</h2>
      {ids.map((id) => { const c = caseMedId(id)!; return (
        <button key={id} className="flate valgknapp" onClick={() => setValgt(id)}><b>CASE {c.nr}: {c.tittel}</b><KmMerker km={c.km} /></button>
      ); })}
      {(ekstraPraktisk?.length || ekstraMuntlig?.length) ? (
        <div className="flate"><p className="liten">Ekstra til denne blokken:</p><div className="rad">
          {ekstraPraktisk?.length ? <button className="knapp sek" onClick={() => apne('Praktiske oppgaver', (l) => <PraktiskOkt ids={ekstraPraktisk} onFerdig={l} />)}>Praktiske mikrooppgaver ({ekstraPraktisk.length})</button> : null}
          {ekstraMuntlig?.length ? <button className="knapp sek" onClick={() => apne('Muntlige spørsmål', (l) => <MuntligOkt items={ekstraMuntlig.map(muntligMedId).filter(Boolean).map((m) => fraMuntlig(m!))} onFerdig={l} />)}>Muntlige spørsmål ({ekstraMuntlig.length})</button> : null}
        </div></div>
      ) : null}
    </div>
  );
}

/* ======================= I DAG / ER JEG KLAR? ======================= */
export function Dashboard({ d, apne, gaTil }: { d: AppData; apne: Apne; gaTil: GaTil }) {
  const dag = dagensStudiedag();
  const b = beredskap(d);
  const igjen = dagerTilEksamen();
  const forfalt = forfalteRep(d).length;
  const gjentak = gjentakendeFeil(d);
  const sisteSim = d.sims[d.sims.length - 1];

  return (
    <div className="stack">
      <SynkPaminnelse onOppsett={() => gaTil('innstillinger', 'synk')} />
      {dag === 'eksamen' ? <EksamensdagKort /> : dag ? <DagensHelt dag={dag} d={d} apne={apne} gaTil={gaTil} igjen={igjen} /> : (
        <section className="helt"><h1>Eksamensdagen er passert</h1><p>Appen kan fortsatt brukes til repetisjon.</p></section>
      )}

      <HelgBeredskap d={d} apne={apne} />

      <details className="flate">
        <summary><b>Bredde per kompetansemål (sekundært)</b> – den gamle nivå 3–4-kontrollen</summary>
      <section className={`beredskap ${b.klar ? 'klar' : b.risiko === 'høy' ? 'hoy' : 'middels'}`} aria-labelledby="ber-tittel">
        <div className="rad mellom">
          <h2 id="ber-tittel" className="seksjon-tittel"><Ikon navn={b.klar ? 'sjekk' : 'advarsel'} /> {b.klar ? 'Treningsklar – med sikkerhetsmargin' : 'Ikke eksamensklar ennå'}</h2>
          <span className={`chip ${b.klar ? 'ok' : b.risiko === 'høy' ? 'nei' : 'midt'}`}>Risiko: {b.risiko}</span>
        </div>
        <ul className="vilkar">
          {b.vilkar.map((v) => <li key={v.id} className={v.ok ? 'ok' : 'nei'}><span aria-hidden>{v.ok ? '✓' : '✗'}</span><div><b>{v.tekst}</b><br /><span className="liten dempet">{v.detalj}</span></div></li>)}
        </ul>
        {b.prioritet.length > 0 && <><h3>Prioriter nå</h3><ol className="liste">{b.prioritet.map((p, i) => <li key={i}>{p}</li>)}</ol></>}
        <p className="liten dempet">Ingen app kan garantere en karakter. «Klar» betyr at du har dokumentert nivå 3–4 på tvers av mål og i to simuleringer – ikke at eksamen er sikret.</p>
      </section>

      </details>

      <div className="fliser">
        <button className="flis" disabled={!forfalt} onClick={() => apne('Repetisjon', (l) => <RepetisjonOkt d={d} onFerdig={l} />)}><Ikon navn="repeter" /><b className="tall">{forfalt}</b><span>repetisjoner forfaller</span></button>
        <button className="flis" onClick={() => gaTil('feil')}><Ikon navn="advarsel" /><b className="tall">{d.feillogg.filter((f) => !f.lost).length}</b><span>åpne feil/svakheter</span></button>
        <button className="flis" onClick={() => gaTil('sim')}><Ikon navn="eksamen" /><b className="tall">{d.sims.length}</b><span>simuleringer (mål: 2)</span></button>
      </div>

      <section className="flate" aria-labelledby="km-tittel">
        <h2 id="km-tittel" className="seksjon-tittel">Kompetansemålene – dokumentert mestring</h2>
        <p className="liten dempet">Mestring bygger bare på vurderte svar (0–4). «Lest» vises separat og teller ikke som mestring.</p>
        <table className="tabell km-tabell">
          <thead><tr><th>Mål</th><th>Status</th><th className="tall">Siste</th><th className="tall">Gj.kall.</th><th className="tall">Lest</th></tr></thead>
          <tbody>{b.mestring.map((m) => (
            <tr key={m.km}>
              <td><button className="lenkeknapp venstre" onClick={() => gaTil('les', kapitlerForKm(m.km)[0]?.id)}>{m.km} {kmNavn(m.km)}</button></td>
              <td><StatusChip status={m.status} /></td>
              <td className="tall">{m.siste !== null ? m.siste.toFixed(1) : '–'}</td>
              <td className="tall" title="Dager med aktiv gjenkalling (mål: 2)">{m.gjenkallingsdager}/2</td>
              <td className="tall dempet">{Math.round(m.lest * 100)} %</td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      {(gjentak.km.length > 0 || gjentak.dim.length > 0) && (
        <section className="flate">
          <h2 className="seksjon-tittel">Gjentakende feil</h2>
          {gjentak.km.length > 0 && <p>Flere åpne svakheter i: {gjentak.km.map(([k, n]) => <span key={k} className="chip nei">{kmNavn(k)} ({n})</span>)}</p>}
          {gjentak.dim.length > 0 && <p>Dimensjoner du ofte får 0–1 på: {gjentak.dim.map((x) => <span key={x.id} className="chip midt">{x.navn} ({x.n})</span>)}</p>}
          <button className="knapp sek" onClick={() => apne('Svakhetsøkt', (l) => <SvakhetsOkt d={d} onFerdig={l} apne={apne} gaTil={gaTil} />)}>Øv målrettet på svakhetene</button>
        </section>
      )}

      {sisteSim && (
        <section className="flate">
          <h2 className="seksjon-tittel">Siste muntlige simulering</h2>
          <p>CASE {caseMedId(sisteSim.caseId)?.nr} {caseMedId(sisteSim.caseId)?.tittel}: hovedcase <b>{sisteSim.hoved.toFixed(1)}</b>, tilleggsoppgave <b>{sisteSim.tillegg.toFixed(1)}</b>, snakketid {fmtTid(sisteSim.snakkeSek)}.</p>
          {sisteSim.forbedring[0] && <p className="liten">Viktigste forbedring: {sisteSim.forbedring[0]}</p>}
        </section>
      )}
    </div>
  );
}

function DagensHelt({ dag, d, apne, gaTil, igjen }: { dag: Studiedag; d: AppData; apne: Apne; gaTil: GaTil; igjen: number }) {
  const kort = !!d.kortversjon[dag.dato];
  const blokker = dag.blokker.filter((b) => b.type !== 'pause' && (!kort || b.kort > 0));
  const ferdige = d.plan[dag.dato] ?? [];
  const neste = blokker.find((b) => !ferdige.includes(b.id));
  const iDagDato = datoNokkel(iDag());
  return (
    <section className="helt" aria-labelledby="dag-tittel">
      <p className="etikett lys">Helgesprint dag {dag.nr} av 2 · {fmtDato(dag.dato)} · {igjen} {igjen === 1 ? 'dag' : 'dager'} til REA3050 (man. 30.11){dag.dato !== iDagDato && ' · planlagt dag'}</p>
      <h1 id="dag-tittel">{dag.tittel}</h1>
      <p className="helt-tekst">{dag.hovedmal}</p>
      <div className="helt-fremdrift"><Fremdrift verdi={blokker.length ? blokker.filter((b) => ferdige.includes(b.id)).length / blokker.length : 0} /><span>{blokker.filter((b) => ferdige.includes(b.id)).length} av {blokker.length} blokker{kort && ' · 4-timers redningsplan'}</span></div>
      {neste ? (
        <div className="neste">
          <div className="neste-info"><span className="neste-ikon"><Ikon navn="spill" /></span>
            <div><p className="etikett lys">Neste · {kort ? `${neste.kort} min` : `${neste.start}–${neste.slutt}`}</p><p className="neste-tittel">{neste.tittel}</p></div></div>
          <button className="knapp stor lys-knapp" onClick={() => startBlokk(neste, dag, d, apne, gaTil)}>Start</button>
        </div>
      ) : <div className="neste"><p className="neste-tittel">Alle blokker er gjort i dag. Sjekk dagens krav og beredskapen under.</p></div>}
      <button className="lenkeknapp lys" onClick={() => gaTil('plan', dag.dato)}>Se hele dagsplanen og dagens krav →</button>
    </section>
  );
}

function EksamensdagKort() {
  return (
    <section className="helt">
      <p className="etikett lys">Mandag 30. november · REA3050 muntlig-praktisk</p>
      <h1>Eksamensdag</h1>
      <p className="helt-tekst">Ikke lær nytt fagstoff i dag. Les huskelister bare hvis det gir ro. Sjekk informasjonsskrivet i Privatistportalen – det har forrang foran appen.</p>
      <ul className="liste">{EKSAMENSDAG.sjekkliste.map((s, i) => <li key={i}>{s}</li>)}</ul>
    </section>
  );
}

/* ======================= PLAN ======================= */
export function PlanSide({ d, dato, apne, gaTil }: { d: AppData; dato?: string; apne: Apne; gaTil: GaTil }) {
  const dag = STUDIEDAGER.find((x) => x.dato === dato) ?? (dato === EKSAMENSDATO ? null : (dagensStudiedag() === 'eksamen' ? null : (dagensStudiedag() as Studiedag | null) ?? STUDIEDAGER[0]));
  const original = delSeksjoner('DEL VI');
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Lørdag 28. og søndag 29. november 2026 · eksamen mandag 30.</p><h1>Helgeplan</h1>
        <p className="dempet">Den gamle planen 23.–27. november er fjernet. Klokkeslett er forslag – kryss av det du gjør. Planen er ingen garanti; rekker du bare deler, prioriter å skrive og forklare enkel kode.</p></header>
      <ol className="dagvelger">
        {STUDIEDAGER.map((x) => {
          const ferdig = (d.plan[x.dato] ?? []).length;
          const totalt = x.blokker.filter((b) => b.type !== 'pause').length;
          return <li key={x.dato}><button className={`dagknapp ${dag?.dato === x.dato ? 'aktiv' : ''}`} onClick={() => gaTil('plan', x.dato)}>
            <b>{x.ukedag.slice(0, 3)} {Number(x.dato.slice(8))}.</b><span>{x.tittel}</span><span className="liten dempet">{ferdig}/{totalt}</span></button></li>;
        })}
        <li><button className={`dagknapp ${!dag ? 'aktiv' : ''}`} onClick={() => gaTil('plan', EKSAMENSDATO)}><b>Man 30.</b><span>Eksamensdag</span></button></li>
      </ol>
      {!dag ? <EksamensdagKort /> : <DagVisning dag={dag} d={d} apne={apne} gaTil={gaTil} />}
      <details className="flate"><summary><b>Fagstoffpakkens merknad om tidsplanen (ordrett)</b></summary>
        {original.map((s) => <div key={s.tittel}><h3>{s.tittel}</h3><Md tekst={s.tekst} /></div>)}</details>
    </div>
  );
}

function DagVisning({ dag, d, apne, gaTil }: { dag: Studiedag; d: AppData; apne: Apne; gaTil: GaTil }) {
  const kort = !!d.kortversjon[dag.dato];
  const ferdige = d.plan[dag.dato] ?? [];
  const vis = dag.blokker.filter((b) => !kort || b.kort > 0);
  return (
    <section className="stack">
      <div className="flate">
        <p className="etikett">Dag {dag.nr} · {fmtDato(dag.dato)}</p>
        <h2>{dag.tittel}</h2>
        <p><b>Hovedmål:</b> {dag.hovedmal}</p>
        {dag.km.length > 0 && <KmMerker km={dag.km} />}
        <label className="sjekk"><input type="checkbox" checked={kort} onChange={() => settKortversjon(dag.dato, !kort)} />
          <span><b>4-timers redningsplan</b> hvis du ikke har en hel dag. Blokkene som står igjen kan <b>ikke</b> hoppes over.</span></label>
      </div>
      <ol className="blokkliste">
        {vis.map((b) => b.type === 'pause' ? (
          <li key={b.id} className="blokk pause"><span className="tid">{b.start}–{b.slutt}</span><span>{b.tittel}</span></li>
        ) : (
          <li key={b.id} className={`blokk ${ferdige.includes(b.id) ? 'ferdig' : ''}`}>
            <span className="tid">{kort ? `${b.kort} min` : `${b.start}–${b.slutt}`}</span>
            <div className="blokk-innhold">
              <b>{b.tittel}</b> {kort && <span className="chip nei">kan ikke hoppes over</span>} {!kort && b.kort > 0 && <span className="chip">kjerne</span>}
              <p className="liten">{b.beskrivelse}</p>
              <div className="rad">
                <button className="knapp liten-knapp" onClick={() => startBlokk(b, dag, d, apne, gaTil)}>{ferdige.includes(b.id) ? 'Gjør igjen' : 'Start'}</button>
                {b.kapitler && b.kapitler.length > 1 && b.kapitler.slice(1).map((k) => <button key={k} className="knapp sek liten-knapp" onClick={() => gaTil('les', k)}>Les {kapittel(k)?.tittel}</button>)}
                <label className="sjekk liten"><input type="checkbox" checked={ferdige.includes(b.id)} onChange={() => settBlokk(dag.dato, b.id, !ferdige.includes(b.id))} /> Gjort</label>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flate fremhevet"><b>Dagens krav:</b> {dag.krav}<p className="liten dempet">Kravet er nådd når du kan gjøre dette uten å se i teksten – sjekk status per mål på «I dag».</p></div>
    </section>
  );
}

/* ======================= LES ======================= */
const LES_GRUPPER = ['Eksamen, samfunn og etikk', 'Programmering og design', 'OOP og modellering', 'Testing og gjenbruk', 'Data, formater, nettverk og sikkerhet', 'Brukervennlighet, systemutvikling og muntlig formidling'];
export function LesBibliotek({ d, gaTil }: { d: AppData; gaTil: GaTil }) {
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Lærebok · hele fagstoffpakken, offline</p><h1>Lær / Les</h1>
        <p className="dempet">Hvert kapittel har læringsmål, full fagtekst, fordypning, eksempler, gjennomarbeidet eksempel, praktisk demonstrasjon, muntlig modellforklaring, sensoroppfølging, oppgaver på tre nivåer med løsningsforslag, vanlige feil og huskeliste. Etter lesing: kapittelkontroll.</p></header>
      <p className="flate fremhevet">I helgen er dette <b>oppslagsverk</b>, ikke pensum som skal leses lineært. Les bare det du trenger for neste oppgave i Kodelab. Kompendiet har noen eksempler i Python – helgetreningen bruker Java.</p>
      {[1, 2, 3, 4, 5, 6].map((dag) => (
        <section key={dag} className="stack">
          <h2 className="seksjon-tittel">{LES_GRUPPER[dag - 1]}</h2>
          {kapitler.filter((k) => k.dag === dag).map((k) => <KapittelKort key={k.id} k={k} d={d} gaTil={gaTil} />)}
        </section>
      ))}
    </div>
  );
}

function KapittelKort({ k, d, gaTil }: { k: Kapittel; d: AppData; gaTil: GaTil }) {
  const lest = k.seksjoner.filter((s) => d.lest[s.id]).length;
  const kontroller = d.vurderinger.filter((v) => v.kilde === 'kapittel' && v.ref === k.id).length;
  return (
    <button className="flate valgknapp" onClick={() => gaTil('les', k.id)}>
      <div className="rad mellom"><b>{k.nr ? `Kapittel ${k.nr}: ` : ''}{k.tittel}</b><span className="liten dempet">{k.ord} ord · ca. {Math.round(k.ord / 170)} min</span></div>
      <div className="rad">{k.km.length > 0 && <KmMerker km={k.km} />}</div>
      <div className="rad liten"><Fremdrift verdi={lest / k.seksjoner.length} /><span>{lest}/{k.seksjoner.length} delkapitler lest</span>
        <span className={`chip ${kontroller ? 'ok' : ''}`}>{kontroller ? `Kapittelkontroll ×${kontroller}` : 'Ingen kapittelkontroll ennå'}</span></div>
    </button>
  );
}

const TYPE_NAVN: Record<Seksjon['type'], string> = { fagstoff: 'Fagstoff', fordypning: 'Fordypning', ekstra: 'Ekstra kodeoppgave', tillegg: 'Opplæring' };

export function Leser({ k, d, apne, gaTil }: { k: Kapittel; d: AppData; apne: Apne; gaTil: GaTil }) {
  const lest = k.seksjoner.filter((s) => d.lest[s.id]).length;
  const idx = kapitler.findIndex((x) => x.id === k.id);
  const neste = kapitler[idx + 1];
  const kapSpm = muntlige.filter((m) => m.kap === k.nr);
  return (
    <div className="leser">
      <nav className="toc" aria-label="Innhold i kapittelet">
        <button className="lenkeknapp tilbake" onClick={() => gaTil('les')}><Ikon navn="tilbake" /> Alle kapitler</button>
        <p className="etikett">Innhold · {lest}/{k.seksjoner.length} lest</p>
        <Fremdrift verdi={lest / k.seksjoner.length} />
        <ol>{k.seksjoner.map((s) => (
          <li key={s.id} className={d.lest[s.id] ? 'lest' : ''}><a href={`#les/${k.id}/${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{d.lest[s.id] ? '✓ ' : ''}{s.tittel.replace(/`/g, '')}</a></li>
        ))}</ol>
        <button className="knapp liten-knapp" onClick={() => apne(`Kapittelkontroll: ${k.tittel}`, (l) => <Kapittelkontroll kap={k} onFerdig={l} />)}>Kapittelkontroll</button>
      </nav>
      <article className="leser-tekst">
        <header className="side-topp">
          <p className="etikett">{k.nr ? `Kapittel ${k.nr}` : 'Start her'} · {k.ord} ord · ca. {Math.round(k.ord / 170)} min lesing</p>
          <h1>{k.tittel}</h1>
          {k.km.length > 0 && <KmMerker km={k.km} />}
        </header>
        {k.seksjoner.map((s) => <SeksjonVisning key={s.id} s={s} k={k} d={d} />)}
        <section className="flate fremhevet">
          <h2>Lesing er ikke mestring</h2>
          <p>Lukk teksten og vis at du kan det: forklar hovedideen uten å se, svar på oppfølgingsspørsmål, og løs minst én praktisk oppgave.</p>
          <div className="rad">
            <button className="knapp stor" onClick={() => apne(`Kapittelkontroll: ${k.tittel}`, (l) => <Kapittelkontroll kap={k} onFerdig={l} />)}>Start kapittelkontroll</button>
            {kapSpm.length > 0 && <button className="knapp sek" onClick={() => apne('Muntlige spørsmål', (l) => <MuntligOkt items={kapSpm.map(fraMuntlig)} onFerdig={l} />)}>Alle muntlige spørsmål for kapittelet ({kapSpm.length})</button>}
            {k.km.length > 0 && <button className="knapp sek" onClick={() => gaTil('verksted', k.km[0])}>Praktiske oppgaver for {kmNavn(k.km[0])}</button>}
          </div>
        </section>
        {neste && <button className="flate valgknapp" onClick={() => gaTil('les', neste.id)}><span className="etikett">Neste kapittel</span><b>{neste.tittel}</b></button>}
      </article>
    </div>
  );
}

function SeksjonVisning({ s, k, d }: { s: Seksjon; k: Kapittel; d: AppData }) {
  const [forklar, setForklar] = useState(false);
  const [tekst, setTekst] = useState(d.forklart[s.id]?.tekst ?? '');
  const [sjekket, setSjekket] = useState(false);
  const begreper = useMemo(() => nokkelbegreper(s.md), [s.md]);
  const kanForklares = s.type !== 'tillegg' || s.tittel === 'Gjennomarbeidet eksempel';
  const treff = begreper.filter((b) => tekst.toLowerCase().includes(b.toLowerCase()));
  const andel = begreper.length ? treff.length / begreper.length : 1;
  return (
    <section id={s.id} className={`seksjon seksjon-${s.type}`}>
      <div className="rad mellom seksjon-hode">
        <h2><Inline tekst={s.tittel} /></h2>
        <span className={`chip ${s.type === 'tillegg' ? 'aksent' : ''}`}>{TYPE_NAVN[s.type]}</span>
      </div>
      <div className={forklar && !sjekket ? 'skjult-tekst' : ''} aria-hidden={forklar && !sjekket}>
        <Md tekst={s.md} kontekst={{ nokkel: s.id, km: k.km }} />
      </div>
      <div className="seksjon-fot">
        {kanForklares && !forklar && <button className="knapp sek liten-knapp" onClick={() => { setForklar(true); setSjekket(false); }}>Skjul teksten og forklar med egne ord</button>}
        {forklar && (
          <div className="flate forklar">
            <b>Forklar «{s.tittel}» uten å se i teksten</b>
            <SvarBoks verdi={tekst} settVerdi={setTekst} rader={4} autoFocus />
            {!sjekket ? (
              <button className="knapp liten-knapp" disabled={!tekst.trim()} onClick={() => { setSjekket(true); lagreForklart(s.id, tekst, andel); if (!d.lest[s.id]) markerLest(s.id); }}>Sjekk og vis teksten igjen</button>
            ) : (
              <>
                {begreper.length > 0 && <p className="liten">Nøkkelbegreper i delkapitlet: {begreper.map((b) => <span key={b} className={`chip ${treff.includes(b) ? 'ok' : 'nei'}`}>{treff.includes(b) ? '✓' : '–'} {b}</span>)}</p>}
                <p className="liten dempet">Sammenlign med teksten over. Manglet noe viktig? Les det igjen og prøv på nytt.</p>
                <button className="lenkeknapp" onClick={() => { setForklar(false); setSjekket(false); }}>Lukk</button>
              </>
            )}
          </div>
        )}
        <label className="sjekk liten"><input type="checkbox" checked={!!d.lest[s.id]} onChange={() => markerLest(s.id, !d.lest[s.id])} /> Lest</label>
      </div>
    </section>
  );
}

/* ======================= PRAKTISK VERKSTED ======================= */
export function VerkstedSide({ d, km, apne }: { d: AppData; km?: string; apne: Apne }) {
  const [filter, setFilter] = useState<string>(km && ALLE_KM.includes(km as KmId) ? km : 'alle');
  const [type, setType] = useState<'praktisk' | 'feilsok' | 'caser'>('praktisk');
  const liste = (type === 'feilsok' ? feilsok : praktiske).filter((p) => filter === 'alle' || p.km.includes(filter as KmId));
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Gjør det – ikke bare les om det</p><h1>Praktisk verksted</h1>
        <p className="dempet">Du får oppgaven først. Løsningsforslaget låses opp først når du har levert et eget forsøk.</p></header>
      <div className="segmentert" role="tablist">
        <button className={type === 'praktisk' ? 'aktiv' : ''} onClick={() => setType('praktisk')}>Mikrooppgaver ({praktiske.length})</button>
        <button className={type === 'feilsok' ? 'aktiv' : ''} onClick={() => setType('feilsok')}>Feilsøking og kodeforståelse ({feilsok.length})</button>
        <button className={type === 'caser' ? 'aktiv' : ''} onClick={() => setType('caser')}>Hele caser ({caser.length})</button>
      </div>
      {type !== 'caser' && (
        <label className="rad">Filtrer på mål:
          <select className="input smal-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="alle">Alle mål</option>{KOMPETANSEMAL.map((k) => <option key={k.id} value={k.id}>{k.id} {k.kort}</option>)}
          </select></label>
      )}
      {type === 'caser' ? caser.map((c) => (
        <button key={c.id} className="flate valgknapp" onClick={() => apne(`CASE ${c.nr}`, (l) => <CaseOving caseId={c.id} onFerdig={l} />)}>
          <b>CASE {c.nr}: {c.tittel}</b><KmMerker km={c.km} />
          <span className="liten dempet">{d.vurderinger.filter((v) => v.ref === c.id).length ? `Gjort ${d.vurderinger.filter((v) => v.ref === c.id).length} gang(er)` : 'Ikke gjort'}</span>
        </button>
      )) : (
        <>
          <button className="knapp sek" onClick={() => apne('Tilfeldige oppgaver', (l) => <PraktiskOkt ids={shuffle(liste.filter((p) => !d.rep[p.id])).slice(0, 5).map((p) => p.id)} onFerdig={l} />)}>Start 5 tilfeldige som du ikke har gjort</button>
          {liste.map((p) => (
            <button key={p.id} className="flate valgknapp" onClick={() => apne(p.tittel, (l) => <PraktiskOkt ids={[p.id]} onFerdig={l} />)}>
              <div className="rad mellom"><b>{p.id} · {p.tittel}</b>{d.rep[p.id] ? <span className={`chip ${d.rep[p.id].siste >= 3 ? 'ok' : 'midt'}`}>{d.rep[p.id].siste.toFixed(1)}</span> : <span className="chip">ny</span>}</div>
              <div className="rad"><KmMerker km={p.km} /><NivaMerke niva={p.niva} /><span className="merke">{p.kategori}</span></div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

/* ======================= MUNTLIG ======================= */
export function MuntligSide({ d, apne, gaTil }: { d: AppData; apne: Apne; gaTil: GaTil }) {
  const [km, setKm] = useState<KmId>('KM1');
  const [type, setType] = useState<string>('alle');
  const dag = dagensStudiedag();
  const dagKm = dag && dag !== 'eksamen' ? dag.km : [];
  const anbefalt = () => {
    const due = forfalteRep(d).map(muntligMedId).filter(Boolean).map((m) => fraMuntlig(m!));
    const svake = muntligForKm(d, svakesteKm(d), 4);
    const idag = dagKm.length ? muntligForKm(d, dagKm, 4) : [];
    const sett = new Map<string, SpmItem>();
    for (const x of [...due, ...idag, ...svake]) sett.set(x.id, x);
    return [...sett.values()].slice(0, 10);
  };
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Kjernefunksjon · fagsamtale med sensor</p><h1>Muntlig trening</h1>
        <p className="dempet">Ett spørsmål om gangen. Si svaret høyt (bruk snakketimeren), skriv det du sa, og få begrepssjekk, hint og nytt forsøk ved svakt svar. Eksempelsvaret vises først etter at du har prøvd. Deretter følger sensor opp.</p></header>
      <div className="modus-rutenett">
        <button className="flate valgknapp fremhevet" onClick={() => apne('Anbefalt økt', (l) => <MuntligOkt items={anbefalt()} onFerdig={l} />)}>
          <b>Anbefalt økt (10 spørsmål)</b><span className="liten">Forfalt repetisjon + dagens mål + dine svakeste mål.</span></button>
        <button className="flate valgknapp" onClick={() => apne('Svakhetsøkt', (l) => <SvakhetsOkt d={d} onFerdig={l} apne={apne} gaTil={gaTil} />)}>
          <b>Svakhetsøkt</b><span className="liten">Målrettet trening på det som er svakest akkurat nå.</span></button>
        <button className="flate valgknapp" onClick={() => apne('Ukjent tilleggsoppgave', (l) => <MuntligOkt items={shuffle(tilleggsoppgaver).slice(0, 1).map(fraTillegg)} onFerdig={l} />)}>
          <b>Ukjent tilleggsoppgave</b><span className="liten">Tilfeldig, uten forberedelse – som på eksamen.</span></button>
        <button className="flate valgknapp" onClick={() => apne('Drøfting', (l) => <MuntligOkt items={shuffle(droftinger).slice(0, 2).map(fraDrofting)} onFerdig={l} />)}>
          <b>Drøfting: teknologi og samfunn</b><span className="liten">To av {droftinger.length} drøftingsoppgaver med S-I-K-A-T.</span></button>
        <button className="flate valgknapp" onClick={() => apne('Rask repetisjon', (l) => <RepetisjonOkt d={d} onFerdig={l} />)}>
          <b>Rask repetisjon</b><span className="liten">Kontrollspørsmål ({kontrollsporsmal.length}) og forfalte spørsmål.</span></button>
      </div>
      <div className="flate">
        <h2>Velg mål og type</h2>
        <div className="rad">
          <select className="input smal-select" value={km} onChange={(e) => setKm(e.target.value as KmId)}>{KOMPETANSEMAL.map((k) => <option key={k.id} value={k.id}>{k.id} {k.kort}</option>)}</select>
          <select className="input smal-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="alle">Alle typer</option><option value="definisjon">Korte definisjoner</option><option value="forklaring">Forklaringer</option><option value="drofting">Lengre drøftinger</option><option value="demonstrasjon">Demonstrasjonsforklaringer</option>
          </select>
          <button className="knapp" onClick={() => {
            const items = shuffle(muntlige.filter((m) => m.km.includes(km) && (type === 'alle' || m.type === type))).slice(0, 6).map(fraMuntlig);
            apne(`Muntlig: ${kmNavn(km)}`, (l) => <MuntligOkt items={items} onFerdig={l} />);
          }}>Start 6 spørsmål</button>
        </div>
        <p className="liten dempet">{muntlige.filter((m) => m.km.includes(km) && (type === 'alle' || m.type === type)).length} spørsmål tilgjengelig.</p>
      </div>
    </div>
  );
}

export function SvakhetsOkt({ d, onFerdig, gaTil }: { d: AppData; onFerdig: () => void; apne: Apne; gaTil: GaTil }) {
  const km = svakesteKm(d, 2);
  const items = useMemo(() => muntligForKm(d, km, 4), []); // eslint-disable-line react-hooks/exhaustive-deps
  const praktisk = useMemo(() => shuffle(allePraktiske.filter((p) => p.km.some((k) => km.includes(k)))).slice(0, 2).map((p) => p.id), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [steg, setSteg] = useState<'plan' | 'muntlig' | 'praktisk' | 'ferdig'>('plan');
  if (steg === 'muntlig') return <MuntligOkt items={items} onFerdig={() => setSteg('praktisk')} />;
  if (steg === 'praktisk') return <PraktiskOkt ids={praktisk} onFerdig={() => setSteg('ferdig')} />;
  if (steg === 'ferdig') return <div className="flate sentrert"><Ikon navn="sjekk" stor /><h2>Svakhetsøkta er ferdig</h2><button className="knapp stor" onClick={onFerdig}>Ferdig</button></div>;
  return (
    <div className="stack">
      <div className="flate fremhevet"><h2>Svakeste områder akkurat nå</h2>{km.map((k) => { const m = mestring(d, k); return <p key={k}><b>{k} {kmNavn(k)}</b> <StatusChip status={m.status} /> {m.siste !== null && `siste ${m.siste.toFixed(1)}`}</p>; })}</div>
      <div className="flate"><h3>1. Les bare det relevante</h3>
        {km.flatMap((k) => kapitlerForKm(k)).map((kap) => <button key={kap.id} className="knapp sek liten-knapp" onClick={() => { onFerdig(); gaTil('les', kap.id); }}>{kap.tittel}</button>)}
        <p className="liten dempet">Les huskelisten og delkapitlene du var usikker på – ikke hele kapittelet på nytt.</p></div>
      <div className="flate"><h3>2. Fire muntlige spørsmål → 3. to praktiske oppgaver</h3>
        <button className="knapp stor" onClick={() => setSteg('muntlig')}>Start øvingen</button></div>
    </div>
  );
}

function BeredskapsSjekk({ onFerdig }: { onFerdig: () => void }) {
  const [i, setI] = useState(0);
  const [svar, setSvar] = useState('');
  const oppgaver = [
    ...KOMPETANSEMAL.map((k) => `Forklar kompetansemål ${k.nr} (${k.kort}) med én setning og ett eksempel.`),
    'Forklar klasse, objekt, arv og komposisjon med ett sammenhengende eksempel.',
    'Lag en enkel testplan (minst fire tester) for en funksjon du velger selv.',
    'Drøft et personverndilemma kort: formål, interessenter, for/mot, tiltak, konklusjon.',
    'Forklar CSV og JSON og tre grunnleggende sikkerhetstiltak.',
  ];
  if (i >= oppgaver.length) return <div className="flate sentrert"><Ikon navn="sjekk" stor /><h2>Siste kontroll gjort</h2><p>Gå til «I dag» og se beredskapsstatusen. Det du ikke fikk til, skriver du i feilloggen.</p><button className="knapp stor" onClick={onFerdig}>Ferdig</button></div>;
  return (
    <div className="stack">
      <p className="etikett">Siste beredskapskontroll · {i + 1} av {oppgaver.length} · uten å se i teksten</p>
      <div className="sensor"><p className="sensor-spm">{oppgaver[i]}</p></div>
      <SvarBoks key={i} verdi={svar} settVerdi={setSvar} rader={5} autoFocus />
      <div className="rad">
        <button className="knapp" disabled={!svar.trim()} onClick={() => { setSvar(''); setI(i + 1); }}>Klarte det</button>
        <button className="knapp sek" onClick={() => { leggTilFeil(`Beredskapskontroll: klarte ikke «${oppgaver[i]}»`, i < 11 ? [KOMPETANSEMAL[i].id] : []); setSvar(''); setI(i + 1); }}>Klarte det ikke – legg i feilloggen</button>
      </div>
    </div>
  );
}

/* ======================= OPPGAVEBANK ======================= */
export function BankSide({ d, apne }: { d: AppData; apne: Apne }) {
  const [fane, setFane] = useState<'muntlig' | 'praktisk' | 'feilsok' | 'caser' | 'tillegg' | 'drofting'>('muntlig');
  const [km, setKm] = useState('alle');
  const f = <T extends { km: KmId[] }>(l: T[]) => l.filter((x) => km === 'alle' || x.km.includes(km as KmId));
  const score = (id: string) => d.rep[id] ? <span className={`chip ${d.rep[id].siste >= 3 ? 'ok' : d.rep[id].siste >= 2 ? 'midt' : 'nei'}`}>{d.rep[id].siste.toFixed(1)}</span> : <span className="chip">ny</span>;
  const faner: [typeof fane, string, number][] = [['muntlig', 'Muntlige spørsmål', muntlige.length], ['praktisk', 'Praktiske', praktiske.length], ['feilsok', 'Feilsøking', feilsok.length], ['caser', 'Eksamenscaser', caser.length], ['tillegg', 'Tilleggsoppgaver', tilleggsoppgaver.length], ['drofting', 'Drøfting', droftinger.length]];
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Alt øvingsmateriale</p><h1>Oppgavebank</h1>
        <p className="dempet">Alle elementer har kompetansemål, vanskelighetsgrad, vurderingsmomenter, oppfølgingsspørsmål og eksempelsvar/løsning – som vises etter at du har prøvd.</p></header>
      <div className="segmentert">{faner.map(([id, navn, n]) => <button key={id} className={fane === id ? 'aktiv' : ''} onClick={() => setFane(id)}>{navn} ({n})</button>)}</div>
      <select className="input smal-select" value={km} onChange={(e) => setKm(e.target.value)}><option value="alle">Alle mål</option>{KOMPETANSEMAL.map((k) => <option key={k.id} value={k.id}>{k.id} {k.kort}</option>)}</select>
      <ul className="bankliste">
        {fane === 'muntlig' && f(muntlige).map((m) => <li key={m.id}><button className="valgrad" onClick={() => apne(m.id, (l) => <MuntligOkt items={[fraMuntlig(m)]} onFerdig={l} />)}><span className="mono">{m.id}</span><span>{m.sporsmal}</span><KmMerker km={m.km} />{score(m.id)}</button></li>)}
        {fane === 'praktisk' && f(praktiske).map((p) => <li key={p.id}><button className="valgrad" onClick={() => apne(p.tittel, (l) => <PraktiskOkt ids={[p.id]} onFerdig={l} />)}><span className="mono">{p.id}</span><span>{p.tittel}</span><KmMerker km={p.km} />{score(p.id)}</button></li>)}
        {fane === 'feilsok' && f(feilsok).map((p) => <li key={p.id}><button className="valgrad" onClick={() => apne(p.tittel, (l) => <PraktiskOkt ids={[p.id]} onFerdig={l} />)}><span className="mono">{p.id}</span><span>{p.tittel}</span><KmMerker km={p.km} />{score(p.id)}</button></li>)}
        {fane === 'caser' && f(caser).map((c) => <li key={c.id}><button className="valgrad" onClick={() => apne(`CASE ${c.nr}`, (l) => <CaseOving caseId={c.id} onFerdig={l} />)}><span className="mono">{c.id}</span><span>{c.tittel}</span><KmMerker km={c.km} /></button></li>)}
        {fane === 'tillegg' && f(tilleggsoppgaver).map((t) => <li key={t.id}><button className="valgrad" onClick={() => apne('Tilleggsoppgave', (l) => <MuntligOkt items={[fraTillegg(t)]} onFerdig={l} />)}><span className="mono">{t.id}</span><span>{t.sporsmal}</span><KmMerker km={t.km} />{score(t.id)}</button></li>)}
        {fane === 'drofting' && f(droftinger).map((x) => <li key={x.id}><button className="valgrad" onClick={() => apne('Drøfting', (l) => <MuntligOkt items={[fraDrofting(x)]} onFerdig={l} />)}><span className="mono">{x.id}</span><span>{x.sporsmal}</span><KmMerker km={x.km} />{score(x.id)}</button></li>)}
      </ul>
    </div>
  );
}

/* ======================= FEILLOGG ======================= */
export function FeilloggSide({ d, apne, gaTil }: { d: AppData; apne: Apne; gaTil: GaTil }) {
  const [tekst, setTekst] = useState('');
  const [km, setKm] = useState<string>('');
  const [visLost, setVisLost] = useState(false);
  const apneFeil = d.feillogg.filter((f) => !f.lost).sort((a, b) => b.tid - a.tid);
  const loste = d.feillogg.filter((f) => f.lost);
  const gjentak = gjentakendeFeil(d);
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">Feil og svakheter</p><h1>Feillogg</h1>
        <p className="dempet">Appen legger automatisk inn svar under nivå 2 og dimensjoner du fikk 0–1 på. Legg selv til det du merket at du ikke kunne. Marker som løst først når du har klart det uten fasit.</p></header>
      <form className="flate" onSubmit={(e) => { e.preventDefault(); if (tekst.trim()) { leggTilFeil(tekst.trim(), km ? [km as KmId] : []); setTekst(''); } }}>
        <b>Ny svakhet</b>
        <textarea className="input" rows={2} value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="F.eks. «Blander aggregasjon og komposisjon» eller «Klarte ikke å forklare 401 vs 403»" />
        <div className="rad"><select className="input smal-select" value={km} onChange={(e) => setKm(e.target.value)}><option value="">Velg mål (valgfritt)</option>{KOMPETANSEMAL.map((k) => <option key={k.id} value={k.id}>{k.id} {k.kort}</option>)}</select>
          <button className="knapp" disabled={!tekst.trim()}>Legg til</button></div>
      </form>
      {gjentak.km.length > 0 && <div className="flate"><b>Gjentakende:</b> {gjentak.km.map(([k, n]) => <span key={k} className="chip nei">{kmNavn(k)} ({n})</span>)}
        <button className="knapp sek liten-knapp" onClick={() => apne('Svakhetsøkt', (l) => <SvakhetsOkt d={d} onFerdig={l} apne={apne} gaTil={gaTil} />)}>Øv på svakhetene</button></div>}
      <ul className="feilliste">
        {apneFeil.map((f) => (
          <li key={f.id} className="flate">
            <div className="rad mellom"><span className="liten dempet">{new Date(f.tid).toLocaleString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {f.auto ? 'automatisk' : 'egen'}</span>{f.km.length > 0 && <KmMerker km={f.km} />}</div>
            <p>{f.tekst}</p>
            <div className="rad"><button className="knapp liten-knapp gronn" onClick={() => settFeilLost(f.id, true)}>Løst – klarte det uten fasit</button>
              {f.km[0] && <button className="knapp sek liten-knapp" onClick={() => apne(`Øv: ${kmNavn(f.km[0])}`, (l) => <MuntligOkt items={muntligForKm(d, [f.km[0]], 3)} onFerdig={l} />)}>Øv nå</button>}
              <button className="lenkeknapp" onClick={() => slettFeil(f.id)}>Slett</button></div>
          </li>
        ))}
        {apneFeil.length === 0 && <li className="flate">Ingen åpne feil registrert. Det betyr ikke nødvendigvis at alt sitter – sjekk beredskapen på «I dag».</li>}
      </ul>
      {loste.length > 0 && <><button className="lenkeknapp" onClick={() => setVisLost(!visLost)}>{visLost ? 'Skjul' : 'Vis'} løste ({loste.length})</button>
        {visLost && <ul className="feilliste">{loste.map((f) => <li key={f.id} className="flate dempet"><p>✓ {f.tekst}</p><button className="lenkeknapp" onClick={() => settFeilLost(f.id, false)}>Åpne igjen</button></li>)}</ul>}</>}
    </div>
  );
}

/* ======================= EKSAMENSINFO OG BEGREPER ======================= */
export function InfoSide({ gaTil }: { gaTil: GaTil }) {
  const kilder = delSeksjoner('DEL VIII');
  const finnDef = (b: string) => kontrollsporsmal.find((k) => k.sporsmal.toLowerCase().includes(` ${b.toLowerCase()}?`) || k.sporsmal.toLowerCase().includes(`en ${b.toLowerCase()}`) || k.sporsmal.toLowerCase().includes(`et ${b.toLowerCase()}`));
  return (
    <div className="stack">
      <header className="side-topp"><p className="etikett">REA3050 · Oslo høsten 2026</p><h1>Eksamensrammer og begreper</h1></header>
      <section className="flate">
        <h2>Oslo-modellen (standard i appen)</h2>
        <ul className="liste">
          <li>Du trekker ett av flere oppgavesett.</li>
          <li>Minimum 30 minutter forberedelse etter trekk. Alle hjelpemidler kan brukes i forberedelsen, også egen PC – men du har selv ansvar for maskin, programvare og strøm. Ikke regn med internett.</li>
          <li>Notater skrives på papir som finnes i forberedelsesrommet. Notater laget hjemme kan ikke tas med inn i eksaminasjonen. Notatene er støtte og vurderes ikke – å lese direkte fra dem kan virke negativt.</li>
          <li>Oppgaven er åpen og knyttet til sentrale temaer/kompetansemål. Det praktiske innslaget fremgår av oppgaven (demonstrasjon, forsøk eller forklare/tegne på papir).</li>
          <li>Sensorene kan stille oppklarende, utdypende og utvidende spørsmål, og du får en ukjent tilleggsoppgave som prøver andre kompetansemål.</li>
          <li>Inntil 45 minutter. Fagsamtale – det avtales om du starter med å fortelle om temaet eller om samtalen starter direkte.</li>
          <li>Ingen PowerPoint. Du trenger ikke eget utstyr i eksamensrommet med mindre eksamensbeskrivelsen sier det.</li>
          <li>Møt presist med gyldig legitimasjon. Det kan ta opptil ca. 4,5 timer fra oppmøte til alle er ferdige.</li>
        </ul>
        <aside className="md-boks husk"><b className="md-boks-navn">Forrang</b><p>Informasjonsskrivet ditt og eksamensbeskrivelsen i Privatistportalen har alltid forrang foran appens standardoppsett.</p></aside>
      </section>
      <section className="flate">
        <h2>Annen lokal organisering (ikke Oslo)</h2>
        <p>Østfold fylkeskommune beskriver REA3050 med 48 timers forberedelse og inntil 45 minutter med presentasjon (inntil 15 min) og dialog. Dette er et <b>alternativt eksempel</b> på lokal organisering og brukes ikke som din ordning.</p>
      </section>
      <section className="flate">
        <h2>Om oppgavene og vurderingen i appen</h2>
        <p>Oslo publiserer ikke tidligere muntlige og muntlig-praktiske oppgaver. Alle caser og tilleggsoppgaver i appen er <b>originale treningsoppgaver</b>, ikke ekte tidligere eksamensoppgaver.</p>
        <p>Rubrikken (0–4 på sju dimensjoner) er et internt treningsverktøy for å sikte mot omtrent karakter 4 med sikkerhetsmargin. Den er ikke Udirs sensorveiledning og ikke en omregning til karakter. Ingen app kan garantere et resultat.</p>
        <button className="knapp sek" onClick={() => gaTil('les', 'k00')}>Les «Eksamen, læreplan og strategi» (30- og 45-minuttersoppskriften)</button>
      </section>
      <section className="flate">
        <h2>Begreper du bør kunne forklare med egne ord</h2>
        <ul className="begrepsliste">{begrepsliste.map((b) => { const def = finnDef(b); return <li key={b}><b>{b}</b>{def && <span className="dempet"> – {def.svar}</span>}</li>; })}</ul>
      </section>
      <details className="flate"><summary><b>Kilder og faglig avgrensning (fra fagstoffpakken)</b></summary>{kilder.map((s) => <div key={s.tittel}><h3>{s.tittel}</h3><Md tekst={s.tekst} /></div>)}</details>
    </div>
  );
}

/* ======================= MER / INNSTILLINGER ======================= */
export function MerSide({ gaTil }: { gaTil: GaTil }) {
  const valg: [Side, string, string][] = [['verksted', 'Verksted', 'Eldre praktiske mikrooppgaver og caser'], ['bank', 'Oppgavebank', 'Alle spørsmål, oppgaver og caser'], ['feil', 'Feillogg', 'Feil og svakheter'], ['info', 'Eksamensrammer og begreper', 'Oslo-modellen, kilder, begrepsliste'], ['innstillinger', 'Innstillinger', 'Tema, eksport/import, nullstill']];
  return <div className="stack"><h1>Mer</h1>{valg.map(([s, n, b]) => <button key={s} className="flate valgknapp" onClick={() => gaTil(s)}><b>{n}</b><span className="liten dempet">{b}</span></button>)}</div>;
}

export function Innstillinger({ temaKnapper, onLaas }: { temaKnapper: ReactNode; onLaas: () => void }) {
  const [melding, setMelding] = useState<string | null>(null);
  const last = () => {
    const blob = new Blob([eksporter()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `it2-rea3050-fremdrift-${datoNokkel()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="stack">
      <h1>Innstillinger</h1>
      <section className="flate"><h2>Utseende</h2>{temaKnapper}</section>
      <SynkOppsett />
      <section className="flate">
        <h2>Sikkerhetskopi</h2>
        <p className="liten">Fremdriften lagres i nettleseren og – hvis synkronisering er satt opp – i Gisten din. Du kan også ta en manuell kopi som fil.</p>
        <div className="rad">
          <button className="knapp" onClick={last}>Last ned fremdrift (JSON)</button>
          <label className="knapp sek">Importer fra fil<input type="file" accept="application/json,.json" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const feil = importer(await f.text());
            setMelding(feil ?? 'Fremdriften er importert.');
          }} /></label>
          <button className="knapp rod" onClick={() => { if (confirm('Slette all fremdrift? Er synkronisering på, nullstilles den på ALLE enhetene dine. Dette kan ikke angres.')) { nullstill(); setMelding('Fremdriften er nullstilt.'); } }}>Nullstill</button>
        </div>
        {melding && <p className="melding">{melding}</p>}
      </section>
      <section className="flate"><h2>Offline</h2><p className="liten">Etter første oppstart lagres appen i nettleseren, slik at alle leksjoner, oppgaver og fasiter virker uten nett. Diktering (talegjenkjenning) kan kreve nett.</p></section>
      <section className="flate"><h2>Lås</h2><button className="knapp sek" onClick={onLaas}>Lås appen</button></section>
    </div>
  );
}
