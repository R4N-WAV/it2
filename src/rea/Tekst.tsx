import { useState, type ReactNode } from 'react';
import { Diagram } from './Diagram';
import { KopierKnapp } from './felles';
import { lagreOppgaveForsok, lagreVurdering, useData } from './store';
import type { KmId } from './typer';
import { lagVurdering } from './vurdering';

/*
 * Markdown-visning for lærebokteksten. Støtter overskrifter, avsnitt, lister, tabeller, kodeblokker med
 * kopiknapp, ```diagram, sitatbokser (> HUSK: …) og appens egne blokker:
 *   :::oppgave Nivå … :::losning … :::   – løsningen låses til du har skrevet et forsøk
 *   :::modell … :::                        – modellsvar vises etter at du har prøvd selv
 *   :::eksempel Tittel … :::               – utvidbart eksempel
 */

const BOKS: Record<string, { klasse: string; navn: string }> = {
  HUSK: { klasse: 'husk', navn: 'Husk' }, FEIL: { klasse: 'feil', navn: 'Vanlig feil' }, EKSAMEN: { klasse: 'eksamen', navn: 'Til eksamen' },
  TIPS: { klasse: 'tips', navn: 'Tips' }, EKSEMPEL: { klasse: 'eksempel', navn: 'Eksempel' },
};
const SPRAK: Record<string, string> = { java: 'Java', python: 'Python', text: 'Pseudokode / tekst', csv: 'CSV', json: 'JSON', xml: 'XML', sql: 'SQL' };

export interface Kontekst { nokkel: string; km: KmId[] }

export function Inline({ tekst }: { tekst: string }) {
  const deler: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|https?:\/\/[^\s)]+)/g;
  let sist = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(tekst))) {
    if (m.index > sist) deler.push(tekst.slice(sist, m.index));
    const t = m[0];
    if (t.startsWith('`')) deler.push(<code key={k++} className="ik">{t.slice(1, -1)}</code>);
    else if (t.startsWith('**')) deler.push(<strong key={k++}><Inline tekst={t.slice(2, -2)} /></strong>);
    else if (t.startsWith('http')) deler.push(<a key={k++} href={t} target="_blank" rel="noreferrer">{t}</a>);
    else deler.push(<em key={k++}>{t.slice(1, -1)}</em>);
    sist = m.index + t.length;
  }
  if (sist < tekst.length) deler.push(tekst.slice(sist));
  return <>{deler}</>;
}

function OppgaveBlokk({ niva, oppgave, losning, kontekst }: { niva: string; oppgave: string; losning: string; kontekst?: Kontekst }) {
  const d = useData();
  const lagret = kontekst ? d.oppgaver[kontekst.nokkel] : undefined;
  const [tekst, setTekst] = useState(lagret?.tekst ?? '');
  const [vist, setVist] = useState(lagret?.vist ?? false);
  const [vurdert, setVurdert] = useState(false);
  const kanVise = tekst.trim().length >= 15;
  const vis = () => { setVist(true); if (kontekst) lagreOppgaveForsok(kontekst.nokkel, tekst, true); };
  const selv = (score: number) => {
    setVurdert(true);
    if (!kontekst) return;
    lagreVurdering(lagVurdering({ kilde: 'oppgave', ref: kontekst.nokkel, km: kontekst.km, dim: { korrekt: score, praktisk: score }, hint: false, dekning: null, svar: tekst }));
  };
  return (
    <section className={`oppgave-blokk niva-${niva.toLowerCase()}`}>
      <span className="chip">{niva}</span>
      <Md tekst={oppgave} />
      <textarea className="input" rows={4} value={tekst} onChange={(e) => setTekst(e.target.value)} onBlur={() => kontekst && tekst && lagreOppgaveForsok(kontekst.nokkel, tekst, vist)}
        placeholder="Ditt forsøk: skriv svaret, koden eller hva du tegnet på papir (minst en setning) før du ser løsningsforslaget." aria-label="Ditt forsøk" />
      {!vist ? (
        <button className="knapp sek liten-knapp" disabled={!kanVise} onClick={vis} title={kanVise ? '' : 'Skriv et eget forsøk først'}>
          {kanVise ? 'Vis løsningsforslag' : 'Skriv et forsøk for å låse opp løsningsforslaget'}
        </button>
      ) : (
        <div className="losning">
          <b className="etikett">Løsningsforslag</b>
          <Md tekst={losning} />
          {kontekst && !vurdert && (
            <div className="rad liten"><span>Sammenlignet med løsningen:</span>
              <button className="knapp liten-knapp gronn" onClick={() => selv(3)}>Jeg fikk det til</button>
              <button className="knapp liten-knapp gul" onClick={() => selv(2)}>Delvis</button>
              <button className="knapp liten-knapp rod" onClick={() => selv(1)}>Ikke ennå</button>
            </div>
          )}
          {vurdert && <p className="liten melding">Registrert. (Oppgaver du løser etter å ha lest teksten teller maks nivå 3.)</p>}
        </div>
      )}
    </section>
  );
}

function ModellBlokk({ tekst }: { tekst: string }) {
  const [vis, setVis] = useState(false);
  return vis ? (
    <aside className="md-boks eksempel"><b className="md-boks-navn">Eksempel på muntlig forklaring (nivå 4)</b><Md tekst={tekst} /></aside>
  ) : (
    <button className="knapp sek" onClick={() => setVis(true)}>Jeg har forklart det høyt selv – vis modellforklaringen</button>
  );
}

function Kodeblokk({ sprak, kode }: { sprak: string; kode: string }) {
  if (sprak === 'diagram') return <Diagram kilde={kode} />;
  return (
    <figure className="kodeblokk">
      <figcaption><span>{SPRAK[sprak] ?? (sprak || 'Kode')}</span><KopierKnapp tekst={kode} /></figcaption>
      <pre className="code"><code>{kode}</code></pre>
    </figure>
  );
}

export function Md({ tekst, kontekst }: { tekst: string; kontekst?: Kontekst }) {
  const linjer = tekst.split('\n');
  const ut: ReactNode[] = [];
  let i = 0;
  let k = 0;
  let oppgNr = 0;
  while (i < linjer.length) {
    const l = linjer[i];
    if (!l.trim() || /^---\s*$/.test(l)) { i++; continue; }

    if (l.startsWith(':::')) {
      const [type, ...arg] = l.slice(3).trim().split(/\s+/);
      const del: string[] = [];
      i++;
      while (i < linjer.length && !/^:::\s*$/.test(linjer[i])) del.push(linjer[i++]);
      i++;
      if (type === 'oppgave') {
        const skille = del.findIndex((x) => x.startsWith(':::losning'));
        const nr = oppgNr++;
        ut.push(<OppgaveBlokk key={k++} niva={arg.join(' ') || 'Oppgave'} oppgave={del.slice(0, skille).join('\n')} losning={del.slice(skille + 1).join('\n')}
          kontekst={kontekst ? { ...kontekst, nokkel: `${kontekst.nokkel}-o${nr}` } : undefined} />);
      } else if (type === 'modell') ut.push(<ModellBlokk key={k++} tekst={del.join('\n')} />);
      else ut.push(<details key={k++} className="utvid"><summary>{arg.join(' ') || 'Vis mer'}</summary><Md tekst={del.join('\n')} /></details>);
      continue;
    }

    if (l.startsWith('```')) {
      const sprak = l.slice(3).trim();
      const kode: string[] = [];
      i++;
      while (i < linjer.length && !linjer[i].startsWith('```')) kode.push(linjer[i++]);
      i++;
      ut.push(<Kodeblokk key={k++} sprak={sprak} kode={kode.join('\n')} />);
      continue;
    }

    const h = /^(#{3,6})\s+(.*)$/.exec(l);
    if (h) {
      const Tag = h[1].length === 3 ? 'h3' : 'h4';
      ut.push(<Tag key={k++} className="md-h"><Inline tekst={h[2]} /></Tag>);
      i++;
      continue;
    }

    if (l.startsWith('>')) {
      const blokk: string[] = [];
      while (i < linjer.length && linjer[i].startsWith('>')) blokk.push(linjer[i++].replace(/^>\s?/, ''));
      const m = /^([A-ZÆØÅ]+):\s*/.exec(blokk[0]);
      const b = m && BOKS[m[1]];
      if (b) blokk[0] = blokk[0].slice(m![0].length);
      ut.push(<aside key={k++} className={`md-boks ${b ? b.klasse : 'husk'}`}>{b && <b className="md-boks-navn">{b.navn}</b>}<Md tekst={blokk.join('\n')} /></aside>);
      continue;
    }

    if (l.startsWith('|')) {
      const rader: string[][] = [];
      let just: string[] = [];
      while (i < linjer.length && linjer[i].startsWith('|')) {
        const r = linjer[i++].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (r.every((c) => /^:?-{2,}:?$/.test(c))) just = r.map((c) => (c.endsWith(':') ? 'right' : 'left'));
        else rader.push(r);
      }
      const [hode, ...kropp] = rader;
      const stil = (j: number) => ({ textAlign: (just[j] ?? 'left') as 'left' | 'right' });
      ut.push(
        <div key={k++} className="md-tabell"><table>
          <thead><tr>{hode.map((c, j) => <th key={j} style={stil(j)}><Inline tekst={c} /></th>)}</tr></thead>
          <tbody>{kropp.map((r, j) => <tr key={j}>{r.map((c, n) => <td key={n} style={stil(n)}><Inline tekst={c} /></td>)}</tr>)}</tbody>
        </table></div>,
      );
      continue;
    }

    if (/^\s*[-*]\s/.test(l) || /^\s*\d+\.\s/.test(l)) {
      const nummerert = /^\s*\d+\.\s/.test(l);
      const startNr = nummerert ? Number(/\d+/.exec(l)![0]) : 1;
      const punkter: string[] = [];
      while (i < linjer.length && (/^\s*[-*]\s/.test(linjer[i]) || /^\s*\d+\.\s/.test(linjer[i]) || /^\s{2,}\S/.test(linjer[i]))) {
        const x = linjer[i++];
        if (/^\s*([-*]|\d+\.)\s/.test(x)) punkter.push(x.replace(/^\s*([-*]|\d+\.)\s/, ''));
        else punkter[punkter.length - 1] += ' ' + x.trim();
      }
      const Liste = nummerert ? 'ol' : 'ul';
      ut.push(
        <Liste key={k++} className="md-liste" start={nummerert ? startNr : undefined}>
          {punkter.map((p, j) => <li key={j}><Inline tekst={p.replace(/^\[ \]\s*/, '☐ ').replace(/^\[x\]\s*/i, '☑ ')} /></li>)}
        </Liste>,
      );
      continue;
    }

    const avsnitt: string[] = [];
    while (i < linjer.length && linjer[i].trim() && !/^(```|#{3,6}\s|>|\||\s*[-*]\s|\s*\d+\.\s|:::|---\s*$)/.test(linjer[i])) avsnitt.push(linjer[i++]);
    if (avsnitt.length === 0) avsnitt.push(linjer[i++]);
    ut.push(<p key={k++}><Inline tekst={avsnitt.join(' ')} /></p>);
  }
  return <div className="md">{ut}</div>;
}

/** Fagbegreper i en seksjon: uthevede ord (brukes i «forklar med egne ord»). */
export function nokkelbegreper(md: string): string[] {
  const ut = new Set<string>();
  for (const m of md.matchAll(/\*\*([^*]{2,40}?)\*\*/g)) {
    const t = m[1].replace(/[:.–-]+$/, '').replace(/`/g, '').trim();
    if (t && !/^(grunnleggende|middels|utfordrende|fordeler|ulemper|steg \d|sensor kan spørre|eksempel|oppgaven|krav|tiltak|konklusjon|situasjon)/i.test(t) && t.split(' ').length <= 4) ut.add(t);
  }
  return [...ut].slice(0, 8);
}
