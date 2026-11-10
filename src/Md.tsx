import type { ReactNode } from 'react';

/*
 * Liten Markdown-visning for leksjonene. Støtter:
 * ### overskrift, avsnitt, - punktliste, 1. nummerert liste, | tabeller |,
 * ```java / ```pseudo kodeblokker, > HUSK: / > FEIL: / > EKSAMEN: / > TIPS: bokser,
 * og inline **fet**, *kursiv* og `kode`.
 */

const BOKS: Record<string, { klasse: string; navn: string }> = {
  HUSK: { klasse: 'husk', navn: 'Husk' },
  FEIL: { klasse: 'feil', navn: 'Vanlig feil' },
  EKSAMEN: { klasse: 'eksamen', navn: 'Til eksamen' },
  TIPS: { klasse: 'tips', navn: 'Tips' },
  EKSEMPEL: { klasse: 'eksempel', navn: 'Eksempel' },
};

const SPRAK: Record<string, string> = { java: 'Java', pseudo: 'Pseudokode', csv: 'CSV-fil', json: 'JSON-fil', sql: 'SQL', tekst: 'Utskrift', python: 'Python', js: 'JavaScript' };

export function Inline({ tekst }: { tekst: string }) {
  const deler: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let sist = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(tekst))) {
    if (m.index > sist) deler.push(tekst.slice(sist, m.index));
    const t = m[0];
    if (t.startsWith('`')) deler.push(<code key={k++} className="ik">{t.slice(1, -1)}</code>);
    else if (t.startsWith('**')) deler.push(<strong key={k++}><Inline tekst={t.slice(2, -2)} /></strong>);
    else deler.push(<em key={k++}>{t.slice(1, -1)}</em>);
    sist = m.index + t.length;
  }
  if (sist < tekst.length) deler.push(tekst.slice(sist));
  return <>{deler}</>;
}

export function Md({ tekst }: { tekst: string }) {
  const linjer = tekst.split('\n');
  const ut: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < linjer.length) {
    const l = linjer[i];
    if (!l.trim()) { i++; continue; }

    if (l.startsWith('```')) {
      const sprak = l.slice(3).trim();
      const kode: string[] = [];
      i++;
      while (i < linjer.length && !linjer[i].startsWith('```')) kode.push(linjer[i++]);
      i++;
      ut.push(
        <figure key={k++} className={`kodeblokk ${sprak === 'tekst' ? 'utskrift' : ''}`}>
          {SPRAK[sprak] && <figcaption>{SPRAK[sprak]}</figcaption>}
          <pre className="code"><code>{kode.join('\n')}</code></pre>
        </figure>,
      );
      continue;
    }

    if (/^#{3,4}\s/.test(l)) {
      ut.push(<h3 key={k++} className="md-h"><Inline tekst={l.replace(/^#+\s/, '')} /></h3>);
      i++;
      continue;
    }

    if (l.startsWith('>')) {
      const blokk: string[] = [];
      while (i < linjer.length && linjer[i].startsWith('>')) blokk.push(linjer[i++].replace(/^>\s?/, ''));
      const m = /^([A-ZÆØÅ]+):\s*/.exec(blokk[0]);
      const b = m && BOKS[m[1]];
      if (b) blokk[0] = blokk[0].slice(m![0].length);
      ut.push(
        <aside key={k++} className={`md-boks ${b ? b.klasse : 'husk'}`}>
          {b && <b className="md-boks-navn">{b.navn}</b>}
          <Md tekst={blokk.join('\n')} />
        </aside>,
      );
      continue;
    }

    if (l.startsWith('|')) {
      const rader: string[][] = [];
      while (i < linjer.length && linjer[i].startsWith('|')) {
        const r = linjer[i++].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!r.every((c) => /^:?-{2,}:?$/.test(c))) rader.push(r);
      }
      const [hode, ...kropp] = rader;
      ut.push(
        <div key={k++} className="md-tabell">
          <table>
            <thead><tr>{hode.map((c, j) => <th key={j}><Inline tekst={c} /></th>)}</tr></thead>
            <tbody>{kropp.map((r, j) => <tr key={j}>{r.map((c, n) => <td key={n}><Inline tekst={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*[-*]\s/.test(l) || /^\s*\d+\.\s/.test(l)) {
      const nummerert = /^\s*\d+\.\s/.test(l);
      const punkter: string[] = [];
      while (i < linjer.length && (/^\s*[-*]\s/.test(linjer[i]) || /^\s*\d+\.\s/.test(linjer[i]) || /^\s{2,}\S/.test(linjer[i]))) {
        const x = linjer[i++];
        if (/^\s*([-*]|\d+\.)\s/.test(x)) punkter.push(x.replace(/^\s*([-*]|\d+\.)\s/, ''));
        else punkter[punkter.length - 1] += ' ' + x.trim();
      }
      const Liste = nummerert ? 'ol' : 'ul';
      ut.push(<Liste key={k++} className="md-liste">{punkter.map((p, j) => <li key={j}><Inline tekst={p} /></li>)}</Liste>);
      continue;
    }

    const avsnitt: string[] = [];
    while (i < linjer.length && linjer[i].trim() && !/^(```|#{3,4}\s|>|\||\s*[-*]\s|\s*\d+\.\s)/.test(linjer[i])) avsnitt.push(linjer[i++]);
    if (avsnitt.length === 0) avsnitt.push(linjer[i++]);
    ut.push(<p key={k++}><Inline tekst={avsnitt.join(' ')} /></p>);
  }
  return <div className="md">{ut}</div>;
}
