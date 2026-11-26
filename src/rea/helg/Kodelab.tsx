/*
 * KODELAB – praktisk ferdighetstrener for helgesprinten 28.–29. november.
 * Moduser: Lær kode fra null (læringsstigen), Les og forklar kode, Feilsøker, Bygg fra oppgavetekst,
 * Alternative løsninger, Kritiske svakheter og Alle oppgaver. Fasit er skjult til du ber om den.
 */
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Fremdrift } from '../../components';
import { SvarBoks } from '../felles';
import { lagreHelg, nullstillHelgOppgave, tomtForsok, useData } from '../store';
import { Md } from '../Tekst';
import type { AppData } from '../typer';
import {
  ferdighetStatus, helgKlar, kreverKjoring, oppgaveStatus, svakheter, svarRiktig, tellerIkke, utskriftStemmer,
} from './mestring';
import { FERDIGHETER, HELG_OPPGAVER, SVARRAMME, TRINN, helgOppgave, muntligeFor, stige, trinnNavn } from './oppgaver';
import type { HelgForsok, HelgOppgave, HelgStatus } from './typer';
import bootcamp from '../../fagstoff/HELGEBOOTCAMP_28-29_NOV.md?raw';

export type Modus = 'stige' | 'les' | 'feil' | 'bygg' | 'alt' | 'svak' | 'alle';
type Apne = (tittel: string, lag: (lukk: () => void) => React.ReactNode) => void;

const MODUSER: { id: Modus; navn: string; tekst: string }[] = [
  { id: 'stige', navn: 'Lær kode fra null', tekst: 'Mikroleksjon (Se) og straks koding: forutsi → spor → fullfør → rett → endre → skriv selv → forklar → alternativ → overfør.' },
  { id: 'les', navn: 'Les og forklar kode', tekst: 'Spor variabler og kontrollflyt, og forutsi resultatet før du kjører.' },
  { id: 'feil', navn: 'Feilsøker', tekst: 'Kode med en feil: pek ut feilen, si hvilken feiltype det er og rett den.' },
  { id: 'bygg', navn: 'Bygg fra oppgavetekst', tekst: 'Problem → plan/pseudokode → modell → kode → test → forklaring.' },
  { id: 'alt', navn: 'Alternative løsninger', tekst: 'Sammenlign løsninger og begrunn valget: fordel, ulempe, valg.' },
  { id: 'svak', navn: 'Kritiske svakheter', tekst: 'Oppgavetyper du har feilet på – med en ny variant av samme type.' },
  { id: 'alle', navn: 'Alle oppgaver', tekst: 'Hele oppgavebanken for helgen, gruppert etter ferdighet.' },
];

const STATUS: Record<HelgStatus, { tekst: string; klasse: string; symbol: string }> = {
  ikke: { tekst: 'Ikke prøvd', klasse: '', symbol: '○' },
  rod: { tekst: 'Rød', klasse: 'nei', symbol: '●' },
  gul: { tekst: 'Gul', klasse: 'midt', symbol: '●' },
  gronn: { tekst: 'Grønn', klasse: 'ok', symbol: '●' },
};
export function Lys({ s, tekst }: { s: HelgStatus; tekst?: string }) {
  return <span className={`chip ${STATUS[s].klasse}`} title={STATUS[s].tekst}>{STATUS[s].symbol} {tekst ?? STATUS[s].tekst}</span>;
}

const filter: Record<Exclude<Modus, 'stige' | 'svak' | 'alle'>, (o: HelgOppgave) => boolean> = {
  les: (o) => o.trinn === 'forutsi' || o.trinn === 'spor',
  feil: (o) => o.trinn === 'rett' || o.ferdighet === 'feil',
  bygg: (o) => !!o.plan,
  alt: (o) => o.trinn === 'alternativ',
};

/* ======================= Side ======================= */
export function KodelabSide({ d, modus, apne }: { d: AppData; modus?: string; apne: Apne }) {
  const m: Modus = (MODUSER.some((x) => x.id === modus) ? modus : 'stige') as Modus;
  const start = (ids: string[], tittel = 'Kodelab') => apne(tittel, (l) => <HelgOkt ids={ids} onFerdig={l} />);
  const klar = helgKlar(d);
  return (
    <div className="stack">
      <header className="side-topp">
        <p className="etikett">Helgesprint 28.–29. november · praktisk ferdighetstrener</p>
        <h1>Kodelab</h1>
        <p className="dempet">Skriv kode selv, kjør den, lim inn utskriften. Hint i tre nivåer. Fasit er skjult til du ber om den – og da teller oppgaven som rød.</p>
      </header>
      <KjorInfo />
      <button className="lenkeknapp venstre" onClick={() => apne('Helgebootcamp – fagtekst', () => <div className="fokus-innhold bred"><p className="flate fremhevet">Les bare den delen du trenger for neste oppgave. Oppgavene herfra ligger i Kodelab med skjult fasit – løs dem der.</p><Md tekst={bootcamp} /></div>)}>Les helgebootcampen (fagtekst fra helgepraksisfilen) →</button>
      <nav className="tema-chips" aria-label="Moduser">
        {MODUSER.map((x) => <button key={x.id} className={`knapp liten-knapp ${x.id === m ? '' : 'sek'}`} onClick={() => { location.hash = `kodelab/${x.id}`; }}>{x.navn}{x.id === 'svak' && svakheter(d).length ? ` (${svakheter(d).length})` : ''}</button>)}
      </nav>
      <p className="liten">{MODUSER.find((x) => x.id === m)!.tekst}</p>

      {m === 'stige' && FERDIGHETER.filter((f) => f.id !== 'alternativ' && f.id !== 'muntlig').map((f) => {
        const fs = ferdighetStatus(d, f.id);
        const liste = stige(f.id);
        return (
          <section key={f.id} className="flate stack">
            <div className="rad mellom"><h2 className="seksjon-tittel">{f.navn}</h2><Lys s={fs.status} tekst={`${fs.gronne} grønne${fs.status === 'gronn' ? '' : ' (krav 2)'}`} /></div>
            <OppgaveListe d={d} liste={liste} onApne={(id) => start(liste.map((o) => o.id).slice(liste.findIndex((o) => o.id === id)), f.kort)} />
            {fs.neste && <button className="knapp" onClick={() => start(liste.map((o) => o.id).slice(liste.findIndex((o) => o.id === fs.neste!.id)), f.kort)}>Fortsett: {fs.neste.tittel}</button>}
          </section>
        );
      })}

      {(m === 'les' || m === 'feil' || m === 'bygg' || m === 'alt') && (() => {
        const liste = HELG_OPPGAVER.filter(filter[m]);
        const forste = liste.find((o) => oppgaveStatus(o, d.helg?.[o.id]) !== 'gronn') ?? liste[0];
        return (
          <section className="flate stack">
            <button className="knapp stor" onClick={() => start(liste.map((o) => o.id).slice(liste.indexOf(forste)), MODUSER.find((x) => x.id === m)!.navn)}>Start: {forste.tittel}</button>
            <OppgaveListe d={d} liste={liste} visFerdighet onApne={(id) => start([id, ...liste.map((o) => o.id).filter((x) => x !== id)], MODUSER.find((x) => x.id === m)!.navn)} />
          </section>
        );
      })()}

      {m === 'svak' && <Svakheter d={d} start={start} klar={klar} />}

      {m === 'alle' && FERDIGHETER.map((f) => (
        <section key={f.id} className="flate stack">
          <div className="rad mellom"><h2 className="seksjon-tittel">{f.navn}</h2><Lys s={ferdighetStatus(d, f.id).status} /></div>
          <OppgaveListe d={d} liste={stige(f.id)} onApne={(id) => start([id], f.kort)} />
        </section>
      ))}
    </div>
  );
}

export function KjorInfo() {
  return (
    <details className="flate">
      <summary><b>Slik kjører du koden (Java)</b> – appen kan ikke kjøre Java selv</summary>
      <div className="md">
        <p><b>Språk:</b> Ingen eksamensbeskrivelse i prosjektet sier hvilket språk du skal bruke. Helgepraksisfilen bruker <b>Java</b> konsekvent, og du har jobbet litt med Java før – derfor Java her. Det er <b>ikke</b> et eksamenskrav: sjekk Privatistportalen. Lær ett språk – ikke tre. (Kompendiet under «Les» har noen Python-eksempler; hopp over dem i helgen.)</p>
        <ol>
          <li>Sjekk at Java finnes: åpne terminal/ledetekst og skriv <code className="ik">java -version</code> (trenger 11 eller nyere).</li>
          <li>Lagre koden som <code className="ik">Main.java</code> (kopier-knappen i editoren hjelper).</li>
          <li>Kjør: <code className="ik">java Main.java</code> – eller trykk Run i IntelliJ / VS Code / BlueJ.</li>
          <li>Lim inn utskriften i appen. Appen sjekker at de forventede linjene finnes.</li>
          <li>Har programmet flere klasser i samme fil, må <code className="ik">public class Main</code> stå <b>først</b>.</li>
          <li>Blir æ/ø/å til «?» i terminalen: kjør <code className="ik">java -Dstdout.encoding=UTF-8 Main.java</code>.</li>
        </ol>
        <p>Får du ikke kjørt kode i det hele tatt: spor koden på papir og bruk «Jeg kunne ikke kjøre». Da blir oppgaven høyst <b>gul</b> – å spore er ikke det samme som å kjøre et program. Alle løsningsforslagene i appen er kjørt og testet med Java.</p>
      </div>
    </details>
  );
}

function OppgaveListe({ d, liste, onApne, visFerdighet }: { d: AppData; liste: HelgOppgave[]; onApne: (id: string) => void; visFerdighet?: boolean }) {
  return (
    <ol className="bankliste">
      {liste.map((o) => {
        const s = oppgaveStatus(o, d.helg?.[o.id]);
        const se = tellerIkke(o);
        return (
          <li key={o.id}>
            <button className="flate valgknapp" onClick={() => onApne(o.id)}>
              <div className="rad mellom"><b>{o.tittel}</b>{se ? <span className={`chip ${d.helg?.[o.id]?.lost ? 'ok' : ''}`}>{d.helg?.[o.id]?.lost ? 'lest' : 'les'}</span> : <Lys s={s} />}</div>
              <span className="liten dempet">{trinnNavn(o.trinn)} · {o.kilde}{visFerdighet ? ` · ${FERDIGHETER.find((f) => f.id === o.ferdighet)!.kort}` : ''}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Svakheter({ d, start, klar }: { d: AppData; start: (ids: string[], t?: string) => void; klar: ReturnType<typeof helgKlar> }) {
  const sv = svakheter(d);
  const ikkeGronne = FERDIGHETER.map((f) => ferdighetStatus(d, f.id)).filter((f) => f.status !== 'gronn');
  return (
    <section className="stack">
      {klar.kritiskeMangler.length > 0 && (
        <div className="flate beredskap hoy"><h2 className="seksjon-tittel">IKKE KLAR – øv på dette nå</h2>
          <ul className="liste">{klar.kritiskeMangler.map((p) => <li key={p.id}><b>{p.tekst}</b><br /><span className="liten">{p.detalj}</span>{p.ovelse && <> <button className="lenkeknapp" onClick={() => start([p.ovelse!], 'Kritisk svakhet')}>Øv nå →</button></>}</li>)}</ul></div>
      )}
      {sv.length === 0 ? <p className="flate">Ingen røde eller gule oppgaver ennå. Når du feiler eller trenger hint, dukker oppgavetypen opp her med en ny variant.</p> : (
        <div className="flate stack">
          <button className="knapp stor" onClick={() => start(sv.slice(0, 3).flatMap((x) => (x.variant ? [x.variant.id] : [x.oppgave.id])), 'Reparer svakheter')}>Reparer de tre svakeste (nye varianter)</button>
          <ol className="bankliste">{sv.map((x) => (
            <li key={x.oppgave.id} className="flate">
              <div className="rad mellom"><b>{x.oppgave.tittel}</b><Lys s={x.status} /></div>
              <p className="liten dempet">{trinnNavn(x.oppgave.trinn)} · {FERDIGHETER.find((f) => f.id === x.oppgave.ferdighet)!.kort}</p>
              <div className="rad">
                {x.variant && <button className="knapp liten-knapp" onClick={() => start([x.variant!.id], 'Ny variant')}>Ny variant: {x.variant.tittel}</button>}
                <button className="knapp sek liten-knapp" onClick={() => { nullstillHelgOppgave(x.oppgave.id); start([x.oppgave.id], 'Ny runde'); }}>Ta samme oppgave på nytt</button>
              </div>
            </li>
          ))}</ol>
        </div>
      )}
      {ikkeGronne.length > 0 && <div className="flate"><h3>Ferdigheter som ikke er grønne</h3><ul className="liste">{ikkeGronne.map((f) => <li key={f.id}>{FERDIGHETER.find((x) => x.id === f.id)!.navn}: <Lys s={f.status} tekst={`${f.gronne} grønne`} />{f.neste && <> <button className="lenkeknapp" onClick={() => start([f.neste!.id])}>{f.neste.tittel} →</button></>}</li>)}</ul></div>}
    </section>
  );
}

/* ======================= Beredskap (til «I dag») ======================= */
export function HelgBeredskap({ d, apne }: { d: AppData; apne: Apne }) {
  const k = helgKlar(d);
  const start = (id: string) => apne('Kodelab', (l) => <HelgOkt ids={[id]} onFerdig={l} />);
  return (
    <section className={`flate beredskap ${k.klar ? 'klar' : k.kritiskeMangler.length ? 'hoy' : 'middels'}`} aria-labelledby="helg-ber">
      <div className="rad mellom">
        <h2 id="helg-ber" className="seksjon-tittel">{k.kritiskeMangler.length ? 'IKKE KLAR – øv på dette nå' : k.klar ? 'Alle sjekkpunkter grønne' : 'Kode, OOP og testing er grønne – fyll på bredden'}</h2>
        <span className="chip">{k.ok}/{k.punkter.length}</span>
      </div>
      <ul className="vilkar">
        {k.punkter.map((p) => (
          <li key={p.id} className={p.ok ? 'ok' : 'nei'}><span aria-hidden>{p.ok ? '✓' : '✗'}</span>
            <div><b>{p.tekst}</b>{p.kritisk && !p.ok && <> <span className="chip nei">kritisk</span></>}<br /><span className="liten dempet">{p.detalj}</span>
              {!p.ok && p.ovelse && helgOppgave(p.ovelse) && <><br /><button className="lenkeknapp venstre" onClick={() => start(p.ovelse!)}>Øv: {helgOppgave(p.ovelse).tittel} →</button></>}</div></li>
        ))}
      </ul>
      <div className="fliser">{FERDIGHETER.map((f) => { const s = ferdighetStatus(d, f.id); return <span key={f.id} className="flis" title={f.navn}><Lys s={s.status} tekst={f.kort} /><span className="liten">{s.gronne}/2</span></span>; })}</div>
      <p className="liten dempet">Rød = bare gjenkjent/sett fasit. Gul = klarte med hint eller uten å kjøre koden. Grønn = selvstendig, kjørt og riktig. En ferdighet er grønn først etter <b>to</b> grønne varianter. Interne treningskrav – ikke offisielle karaktergrenser, og ingen garanti for bestått.</p>
    </section>
  );
}

/* ======================= Økt: flere oppgaver etter hverandre ======================= */
export function HelgOkt({ ids, onFerdig }: { ids: string[]; onFerdig: () => void }) {
  const liste = useMemo(() => ids.map(helgOppgave).filter(Boolean), [ids]);
  const [i, setI] = useState(0);
  const d = useData();
  if (!liste.length) return <p>Ingen oppgaver.</p>;
  const o = liste[i];
  const ferdige = liste.filter((x) => d.helg?.[x.id]?.lost).length;
  return (
    <div className="fokus-innhold bred">
      <div className="rad mellom liten"><span>Oppgave {i + 1} av {liste.length}</span><span>{ferdige} løst</span></div>
      <Fremdrift verdi={ferdige / liste.length} />
      <Oppgave key={o.id} o={o} />
      <div className="rad mellom">
        <button className="knapp sek" disabled={i === 0} onClick={() => { setI(i - 1); window.scrollTo(0, 0); }}>← Forrige</button>
        {i < liste.length - 1
          ? <button className="knapp" onClick={() => { setI(i + 1); window.scrollTo(0, 0); }}>Neste oppgave →</button>
          : <button className="knapp" onClick={onFerdig}>Ferdig med blokka</button>}
      </div>
    </div>
  );
}

/* ======================= Én oppgave ======================= */
function Editor({ verdi, sett, rader = 14 }: { verdi: string; sett: (s: string) => void; rader?: number }) {
  const tab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const t = e.currentTarget; const a = t.selectionStart; const b = t.selectionEnd;
    sett(verdi.slice(0, a) + '    ' + verdi.slice(b));
    requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = a + 4; });
  };
  return <textarea className="input mono kodefelt" rows={rader} value={verdi} onChange={(e) => sett(e.target.value)} onKeyDown={tab} spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-label="Kodeeditor" />;
}

function Oppgave({ o }: { o: HelgOppgave }) {
  const d = useData();
  const f: HelgForsok = { ...tomtForsok(), ...(d.helg?.[o.id] ?? {}) };
  const status = oppgaveStatus(o, d.helg?.[o.id]);
  const se = o.trinn === 'se';
  const harEditor = !se && (kreverKjoring(o) || !!o.krav || (o.kode !== undefined && !o.svar && o.trinn !== 'forklar'));
  /** Oppgaver uten kode og uten kort svar: muntlige forklaringer, testtabeller, modeller. */
  const muntligOppg = !se && !harEditor && !o.svar;
  const startkode = o.trinn === 'skriv' || o.trinn === 'overfor' ? 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}' : (o.kode ?? '');

  const [kode, setKode] = useState(f.kode || (harEditor ? startkode : ''));
  const [plan, setPlan] = useState(f.plan ?? '');
  const [utskrift, setUtskrift] = useState(f.utskrift ?? '');
  const [svar, setSvar] = useState(f.svar ?? '');
  const [melding, setMelding] = useState<{ ok: boolean; tekst: string } | null>(null);
  const [visFasit, setVisFasit] = useState(false);
  const [mangler, setMangler] = useState<string[] | null>(null);

  // Lagre kode/plan løpende (med litt forsinkelse)
  useEffect(() => {
    const t = setTimeout(() => { if (kode !== (f.kode ?? '') || plan !== (f.plan ?? '')) lagreHelg(o.id, { kode, plan }); }, 800);
    return () => clearTimeout(t);
  }, [kode, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  const planOk = !o.plan || plan.trim().length >= 15;
  const forsokt = kode.trim() !== startkode.trim() || svar.trim().length > 3 || utskrift.trim().length > 0 || f.hint >= 3;

  const sjekkKrav = () => {
    const m = (o.krav ?? []).filter(([re]) => !new RegExp(re).test(kode)).map(([, t]) => t);
    setMangler(m);
    return m;
  };
  const sjekkSvar = () => {
    const ok = svarRiktig(o, svar);
    lagreHelg(o.id, (g) => ({ svar, forsok: g.forsok + 1, lost: g.lost || ok }));
    setMelding(ok ? { ok, tekst: 'Riktig! Forklar nå høyt HVORFOR – se de muntlige spørsmålene under.' } : { ok, tekst: 'Ikke riktig ennå. Spor koden linje for linje på papir, eller ta et hint.' });
  };
  const sjekkUtskrift = () => {
    const m = sjekkKrav();
    const ok = !!o.utskrift && utskriftStemmer(utskrift, o.utskrift);
    lagreHelg(o.id, (g) => ({ kode, plan, utskrift, forsok: g.forsok + 1, lost: g.lost || ok, kjort: g.kjort || ok }));
    if (ok) setMelding({ ok, tekst: m.length ? `Utskriften stemmer! Men sjekk: ${m.join(' ')}` : 'Utskriften stemmer – programmet ditt virker. Nå: forklar det høyt.' });
    else setMelding({ ok, tekst: 'Utskriften stemmer ikke med forventet resultat. Sammenlign linje for linje (store/små bokstaver og mellomrom teller ikke). Rett én ting og kjør igjen.' });
  };
  const ikkeKjort = () => {
    const m = sjekkKrav();
    if (m.length) { setMelding({ ok: false, tekst: `Koden mangler noe: ${m.join(' ')}` }); return; }
    if (kode.trim() === startkode.trim()) { setMelding({ ok: false, tekst: 'Skriv koden først.' }); return; }
    lagreHelg(o.id, (g) => ({ kode, plan, forsok: g.forsok + 1, lost: true }));
    setMelding({ ok: true, tekst: 'Registrert som løst uten kjøring – høyst gul. Kjør den når du kan, så kan den bli grønn.' });
  };
  const sjekkpunkt = (n: number) => lagreHelg(o.id, (g) => ({ sjekket: g.sjekket.includes(n) ? g.sjekket.filter((x) => x !== n) : [...g.sjekket, n] }));
  const alleSjekket = !o.sjekk || o.sjekk.every((_, n) => f.sjekket.includes(n));
  const markerLost = (selv: number) => {
    lagreHelg(o.id, (g) => ({ kode, plan, svar, forsok: g.forsok + 1, lost: true, muntlig: { ...g.muntlig, [-1]: { tekst: svar, selv } } }));
    setMelding({ ok: true, tekst: selv === 0 ? 'Lagret som gul – svarrammen under hjelper deg neste gang.' : 'Lagret. Se modellsvaret og sammenlign.' });
  };
  const hint = () => lagreHelg(o.id, (g) => ({ hint: Math.min(3, g.hint + 1) }));
  const fasit = () => {
    if (!f.lost && !confirm('Viser du fasit nå, teller oppgaven som RØD (ikke mestret). Du må klare en ny variant uten fasit senere. Vis fasit?')) return;
    if (!f.lost) lagreHelg(o.id, { fasitSett: true });
    setVisFasit(true);
  };

  return (
    <article className="stack helg-oppgave">
      <header className="stack">
        <div className="rad mellom"><span className="etikett">{FERDIGHETER.find((x) => x.id === o.ferdighet)!.kort} · {trinnNavn(o.trinn)} · {o.kilde}</span>{se ? null : <Lys s={status} />}</div>
        <h2 className="oppgave-tittel">{o.tittel}</h2>
      </header>
      <div className="flate oppgavetekst"><Md tekst={o.oppgave} /></div>
      {o.kode && (se || !harEditor) && <Md tekst={'```' + (o.kode.includes('class ') || o.kode.includes(';') ? 'java' : 'text') + '\n' + o.kode + '\n```'} />}

      {o.plan && !se && (
        <div className="flate stack">
          <label><b>1. Plan / pseudokode først</b> <span className="liten dempet">– problem, input, behandling, output (og klasser hvis OOP)</span></label>
          <textarea className="input" rows={4} value={plan} onChange={(e) => setPlan(e.target.value)} placeholder={'Problem: …\nInput: …\nBehandling: …\nOutput: …'} />
          {!planOk && <p className="liten advar-tekst">Skriv planen (minst én setning) før du koder.</p>}
        </div>
      )}

      {harEditor && planOk && (
        <div className="flate stack">
          <div className="rad mellom"><b>{o.plan ? '2. ' : ''}Din kode</b>
            <span className="rad"><button className="knapp sek liten-knapp" onClick={() => navigator.clipboard?.writeText(kode)}>Kopier til editoren din</button>
              {o.krav && <button className="knapp sek liten-knapp" onClick={sjekkKrav}>Sjekk strukturen</button>}</span></div>
          <Editor verdi={kode} sett={setKode} rader={Math.min(24, Math.max(8, kode.split('\n').length + 2))} />
          {mangler && (mangler.length ? <ul className="liten advar-tekst">{mangler.map((m) => <li key={m}>{m}</li>)}</ul> : <p className="liten">Strukturen ser riktig ut (sjekker bare at nøkkeldelene finnes – ikke at koden kjører).</p>)}
        </div>
      )}

      {o.svar && (
        <div className="flate stack">
          <label htmlFor={`svar-${o.id}`}><b>{o.svar.sporsmal}</b></label>
          <div className="rad"><input id={`svar-${o.id}`} className="input" value={svar} onChange={(e) => setSvar(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && svar.trim()) sjekkSvar(); }} autoComplete="off" />
            <button className="knapp" disabled={!svar.trim()} onClick={sjekkSvar}>Sjekk svar</button></div>
        </div>
      )}

      {kreverKjoring(o) && planOk && (
        <div className="flate stack">
          <b>{o.plan ? '3. ' : ''}Kjør og lim inn utskriften</b>
          {o.testInput && <p className="liten">Når programmet spør, skriv inn: <code className="ik">{o.testInput.split('\n').join(' ↵ ')}</code></p>}
          <textarea className="input mono" rows={4} value={utskrift} onChange={(e) => setUtskrift(e.target.value)} placeholder="Lim inn det programmet skrev ut" spellCheck={false} />
          <div className="rad">
            <button className="knapp" disabled={!utskrift.trim()} onClick={sjekkUtskrift}>Sjekk utskriften</button>
            <button className="knapp sek liten-knapp" onClick={ikkeKjort}>Jeg kunne ikke kjøre – sporet på papir</button>
          </div>
        </div>
      )}

      {muntligOppg && (
        <div className="flate stack">
          <b>{o.trinn === 'forklar' || o.trinn === 'alternativ' ? 'Svar høyt først – skriv deretter stikkord' : 'Ditt svar (tabell, modell eller tekst – papir er også fint, skriv da et sammendrag her)'}</b>
          <SvarBoks verdi={svar} settVerdi={(s) => setSvar(s)} rader={5} />
        </div>
      )}

      {o.sjekk && !se && (
        <div className="flate stack">
          <b>Egenkontroll {muntligOppg ? '' : '(må krysses av)'}</b>
          {o.sjekk.map((s, n) => <label key={n} className="sjekk"><input type="checkbox" checked={f.sjekket.includes(n)} onChange={() => sjekkpunkt(n)} /> <span>{s}</span></label>)}
          {(muntligOppg || !kreverKjoring(o)) && !o.svar && !f.lost && (
            <div className="stack">
              <span className="liten">Hvordan var svaret ditt mot kriteriene?</span>
              <div className="rad">
                <button className="knapp sek liten-knapp" disabled={!alleSjekket || (muntligOppg ? svar : kode + plan).trim().length < 20} onClick={() => markerLost(0)}>Usikkert / måtte lete</button>
                <button className="knapp liten-knapp" disabled={!alleSjekket || (muntligOppg ? svar : kode + plan).trim().length < 20} onClick={() => markerLost(2)}>Klarte det selvstendig</button>
              </div>
              {(!alleSjekket || (muntligOppg ? svar : kode + plan).trim().length < 20) && <span className="liten dempet">Skriv svaret/løsningen og kryss av alle punktene først.</span>}
            </div>
          )}
        </div>
      )}

      {se && !f.lost && <button className="knapp stor" onClick={() => lagreHelg(o.id, { lost: true })}>Jeg har lest og forstått hver linje – gå videre</button>}

      {melding && <p className={`melding ${melding.ok ? 'ok' : 'feil'}`} role="status">{melding.tekst}</p>}

      {!se && (
        <div className="flate stack">
          <div className="rad">
            <button className="knapp sek" disabled={f.hint >= 3} onClick={hint}>{f.hint >= 3 ? 'Alle hint vist' : `Hint ${f.hint + 1} av 3`}</button>
            <button className="knapp sek" disabled={!forsokt && !f.lost} onClick={fasit} title={forsokt || f.lost ? '' : 'Prøv først (skriv noe eller bruk alle tre hint)'}>Vis fasit</button>
            {(f.lost || f.fasitSett) && <button className="knapp sek liten-knapp" onClick={() => { if (confirm('Starte oppgaven på nytt? Status nullstilles, koden beholdes.')) { nullstillHelgOppgave(o.id); setVisFasit(false); setMelding(null); setUtskrift(''); setSvar(''); } }}>Ny runde</button>}
          </div>
          {!forsokt && !f.lost && <p className="liten dempet">Fasit låses opp når du har prøvd selv (eller brukt alle tre hint).</p>}
          {f.hint > 0 && <ol className="liste">{o.hint.slice(0, f.hint).map((h, n) => <li key={n}><span className="chip">{['Idé', 'Syntaks/struktur', 'Nesten løsning'][n]}</span> {h}</li>)}</ol>}
        </div>
      )}

      {(visFasit || (se && f.lost)) && !se && <div className="flate losning"><h3>Løsningsforslag</h3><Md tekst={o.fasit} />{o.utskrift && <><p className="liten"><b>Forventet utskrift</b> (kjørt og kontrollert med Java):</p><Md tekst={'```text\n' + o.utskrift + '\n```'} /></>}</div>}
      {se && f.lost && <div className="flate"><Md tekst={o.fasit} /></div>}

      {(f.lost || visFasit) && <Muntlig o={o} f={f} />}
    </article>
  );
}

const KRITERIER = ['Er hovedideen riktig?', 'Bruker jeg relevante fagbegreper?', 'Knytter jeg svaret til oppgaven?', 'Har jeg et konkret eksempel?', 'Sier jeg noe om begrensning, alternativ eller test?'];

/** Muntlig etter oppgaven: ett spørsmål om gangen, egenvurdering etter forsøk (masterprompt §7E og §11). */
function Muntlig({ o, f }: { o: HelgOppgave; f: HelgForsok }) {
  const sp = muntligeFor(o);
  const forste = sp.findIndex((_, n) => !f.muntlig[n]);
  const [n, setN] = useState(forste === -1 ? sp.length : forste);
  const [tekst, setTekst] = useState('');
  const [vurder, setVurder] = useState(false);
  if (!sp.length) return null;
  const lagre = (selv: number) => {
    lagreHelg(o.id, (g) => ({ muntlig: { ...g.muntlig, [n]: { tekst, selv } } }));
    setTekst(''); setVurder(false);
    if (selv > 0) setN(n + 1);
  };
  const svarte = sp.filter((_, i) => f.muntlig[i]).length;
  return (
    <section className="flate stack sensor">
      <div className="rad mellom"><h3>Muntlig sensor – forklar høyt</h3><span className="liten">{svarte}/{sp.length} besvart</span></div>
      {n >= sp.length ? (
        <><p>Alle spørsmål besvart. Les svarene dine høyt én gang til – uten å se på koden.</p>
          <button className="lenkeknapp venstre" onClick={() => setN(0)}>Ta spørsmålene igjen</button></>
      ) : (
        <>
          <p className="sensor-spm"><b>{sp[n]}</b></p>
          <SvarBoks verdi={tekst} settVerdi={setTekst} rader={4} plassholder="Si svaret høyt først (snakketimer), skriv deretter det du sa." />
          {!vurder ? <button className="knapp" disabled={tekst.trim().length < 10} onClick={() => setVurder(true)}>Jeg har svart</button> : (
            <div className="stack">
              <p className="liten"><b>Vurder svaret ditt:</b></p>
              <ul className="liste liten">{KRITERIER.map((k) => <li key={k}>{k}</li>)}</ul>
              <div className="rad">
                <button className="knapp sek liten-knapp" onClick={() => lagre(0)}>Rødt – prøv igjen</button>
                <button className="knapp sek liten-knapp" onClick={() => lagre(1)}>Gult – delvis</button>
                <button className="knapp liten-knapp" onClick={() => lagre(2)}>Grønt – godt svar</button>
              </div>
              <details><summary className="liten">Står du fast? Svarramme</summary><ul className="liste liten">{SVARRAMME.map((s) => <li key={s}>{s}</li>)}</ul></details>
            </div>
          )}
          {f.muntlig[n]?.selv === 0 && <p className="liten advar-tekst">Forrige forsøk var rødt. Bruk svarrammen og prøv en gang til – kort og konkret, med ett eksempel.</p>}
          {n < sp.length - 1 && <button className="lenkeknapp venstre liten" onClick={() => { setN(n + 1); setTekst(''); setVurder(false); }}>Hopp over dette spørsmålet</button>}
        </>
      )}
    </section>
  );
}

/** Kort oversikt over læringsstigen (brukes i hjelpetekst). */
export const STIGE_TEKST = TRINN.map((t) => `${t.navn}: ${t.forklaring}`);
