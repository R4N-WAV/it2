import { useId } from 'react';

/*
 * Liten diagramnotasjon for UML-klassediagram, flytskjema og systemskisser (ren SVG, virker offline).
 *
 *   klasse Navn kol rad | -attr: type; -attr2 | +metode(); +metode2()
 *   boks|oval|rombe|para id kol rad Tekst med mellomrom
 *   pil|strek|assoc|arv|komp|aggr fra til [mult-fra] [mult-til] [: etikett]
 *
 * arv: åpen trekant mot «til» (superklassen). komp/aggr: fylt/åpen rombe ved «fra» (helheten).
 */

type Form = 'klasse' | 'boks' | 'oval' | 'rombe' | 'para';
interface Node { id: string; form: Form; kol: number; rad: number; tekst: string[]; attr: string[]; met: string[]; b: number; h: number; x: number; y: number }
interface Kant { type: string; fra: string; til: string; m1?: string; m2?: string; etikett?: string }

const KOL = 230;
const GAP_Y = 76;
const LH = 18;
const PAD = 16;

function bryt(tekst: string, maks: number) {
  const ord = tekst.split(' ');
  const linjer: string[] = [];
  let l = '';
  for (const o of ord) {
    if ((l + ' ' + o).trim().length > maks && l) { linjer.push(l); l = o; } else l = (l + ' ' + o).trim();
  }
  if (l) linjer.push(l);
  return linjer;
}

export function parseDiagram(kilde: string): { noder: Node[]; kanter: Kant[] } {
  const noder: Node[] = [];
  const kanter: Kant[] = [];
  for (const rå of kilde.split('\n')) {
    const l = rå.trim();
    if (!l) continue;
    const [hode, ...rest] = l.split(/\s+/);
    if (hode === 'klasse') {
      const [del1, attr = '', met = ''] = l.slice(7).split('|');
      const [id, kol, rad] = del1.trim().split(/\s+/);
      const liste = (s: string) => s.split(';').map((x) => x.trim()).filter(Boolean);
      noder.push({ id, form: 'klasse', kol: Number(kol), rad: Number(rad), tekst: [id], attr: liste(attr), met: liste(met), b: 0, h: 0, x: 0, y: 0 });
    } else if (['boks', 'oval', 'rombe', 'para'].includes(hode)) {
      const [id, kol, rad, ...t] = rest;
      noder.push({ id, form: hode as Form, kol: Number(kol), rad: Number(rad), tekst: bryt(t.join(' '), hode === 'rombe' ? 16 : 24), attr: [], met: [], b: 0, h: 0, x: 0, y: 0 });
    } else if (['pil', 'strek', 'assoc', 'arv', 'komp', 'aggr'].includes(hode)) {
      const [venstre, etikett] = l.split(' : ');
      const deler = venstre.trim().split(/\s+/).slice(1);
      kanter.push({ type: hode, fra: deler[0], til: deler[1], m1: deler[2], m2: deler[3], etikett: etikett?.trim() });
    }
  }
  // størrelser
  for (const n of noder) {
    if (n.form === 'klasse') {
      const lengst = Math.max(n.id.length + 4, ...n.attr.map((a) => a.length), ...n.met.map((m) => m.length));
      n.b = Math.min(KOL - 20, Math.max(140, lengst * 7.2 + 20));
      n.h = 28 + Math.max(1, n.attr.length) * LH + 8 + Math.max(1, n.met.length) * LH + 8;
    } else if (n.form === 'rombe') {
      n.b = 180; n.h = Math.max(70, n.tekst.length * LH + 40);
    } else {
      n.b = n.form === 'oval' ? 150 : 190; n.h = n.tekst.length * LH + 22;
    }
  }
  // plassering i rutenett
  const rader = [...new Set(noder.map((n) => n.rad))].sort((a, b) => a - b);
  let y = PAD;
  for (const r of rader) {
    const iRad = noder.filter((n) => n.rad === r);
    const h = Math.max(...iRad.map((n) => n.h));
    for (const n of iRad) { n.x = PAD + n.kol * KOL + (KOL - 20 - n.b) / 2; n.y = y + (h - n.h) / 2; }
    y += h + GAP_Y;
  }
  return { noder, kanter };
}

function kantpunkt(n: Node, tx: number, ty: number) {
  const cx = n.x + n.b / 2;
  const cy = n.y + n.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  if (n.form === 'rombe') {
    const t = 1 / (Math.abs(dx) / (n.b / 2) + Math.abs(dy) / (n.h / 2));
    return { x: cx + dx * t, y: cy + dy * t };
  }
  const t = Math.min((n.b / 2) / Math.abs(dx || 1e-9), (n.h / 2) / Math.abs(dy || 1e-9));
  return { x: cx + dx * t, y: cy + dy * t };
}

export function Diagram({ kilde }: { kilde: string }) {
  const uid = useId().replace(/:/g, '');
  const { noder, kanter } = parseDiagram(kilde);
  if (!noder.length) return null;
  const bredde = Math.max(...noder.map((n) => n.x + n.b)) + PAD;
  const hoyde = Math.max(...noder.map((n) => n.y + n.h)) + PAD;
  const finn = (id: string) => noder.find((n) => n.id === id);
  const tittel = noder.map((n) => n.tekst.join(' ')).join(', ');

  return (
    <figure className="diagram">
      <svg viewBox={`0 0 ${bredde} ${hoyde}`} role="img" aria-label={`Diagram: ${tittel}`} style={{ maxWidth: bredde }}>
        <defs>
          <marker id={`pil-${uid}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="d-fyll-tekst" /></marker>
          <marker id={`arv-${uid}`} viewBox="0 0 12 12" refX="12" refY="6" markerWidth="13" markerHeight="13" orient="auto-start-reverse"><path d="M0,0 L12,6 L0,12 z" className="d-hul" /></marker>
          <marker id={`komp-${uid}`} viewBox="0 0 16 10" refX="16" refY="5" markerWidth="16" markerHeight="10" orient="auto-start-reverse"><path d="M0,5 L8,0 L16,5 L8,10 z" className="d-fyll-tekst" /></marker>
          <marker id={`aggr-${uid}`} viewBox="0 0 16 10" refX="16" refY="5" markerWidth="16" markerHeight="10" orient="auto-start-reverse"><path d="M0,5 L8,0 L16,5 L8,10 z" className="d-hul" /></marker>
        </defs>
        {kanter.map((k, i) => {
          const a = finn(k.fra);
          const b = finn(k.til);
          if (!a || !b) return null;
          const p1 = kantpunkt(a, b.x + b.b / 2, b.y + b.h / 2);
          const p2 = kantpunkt(b, a.x + a.b / 2, a.y + a.h / 2);
          const start = k.type === 'komp' ? `url(#komp-${uid})` : k.type === 'aggr' ? `url(#aggr-${uid})` : undefined;
          const slutt = k.type === 'pil' ? `url(#pil-${uid})` : k.type === 'arv' ? `url(#arv-${uid})` : undefined;
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const ux = (p2.x - p1.x) / (Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1);
          const uy = (p2.y - p1.y) / (Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1);
          return (
            <g key={i}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={`d-linje ${k.type === 'strek' ? 'stiplet' : ''}`} markerStart={start} markerEnd={slutt} />
              {k.m1 && <text x={p1.x + ux * 22 - uy * 10} y={p1.y + uy * 22 + ux * 10 + 4} className="d-mult" textAnchor="middle">{k.m1}</text>}
              {k.m2 && <text x={p2.x - ux * 22 - uy * 10} y={p2.y - uy * 22 + ux * 10 + 4} className="d-mult" textAnchor="middle">{k.m2}</text>}
              {k.etikett && <text x={mx - uy * 12} y={my + ux * 12 + 4} className="d-etikett" textAnchor="middle">{k.etikett}</text>}
            </g>
          );
        })}
        {noder.map((n) => {
          const cx = n.x + n.b / 2;
          if (n.form === 'klasse') {
            const yA = n.y + 28;
            const yM = yA + Math.max(1, n.attr.length) * LH + 8;
            return (
              <g key={n.id}>
                <rect x={n.x} y={n.y} width={n.b} height={n.h} rx="4" className="d-boks" />
                <text x={cx} y={n.y + 19} textAnchor="middle" className="d-navn">{n.id}</text>
                <line x1={n.x} y1={yA} x2={n.x + n.b} y2={yA} className="d-linje" />
                {n.attr.map((a, i) => <text key={i} x={n.x + 8} y={yA + 16 + i * LH} className="d-tekst">{a}</text>)}
                <line x1={n.x} y1={yM} x2={n.x + n.b} y2={yM} className="d-linje" />
                {n.met.map((m, i) => <text key={i} x={n.x + 8} y={yM + 16 + i * LH} className="d-tekst">{m}</text>)}
              </g>
            );
          }
          const tekster = n.tekst.map((t, i) => (
            <text key={i} x={cx} y={n.y + n.h / 2 - ((n.tekst.length - 1) * LH) / 2 + i * LH + 5} textAnchor="middle" className="d-tekst">{t}</text>
          ));
          let form;
          if (n.form === 'oval') form = <ellipse cx={cx} cy={n.y + n.h / 2} rx={n.b / 2} ry={n.h / 2} className="d-boks" />;
          else if (n.form === 'rombe') form = <polygon points={`${cx},${n.y} ${n.x + n.b},${n.y + n.h / 2} ${cx},${n.y + n.h} ${n.x},${n.y + n.h / 2}`} className="d-boks" />;
          else if (n.form === 'para') form = <polygon points={`${n.x + 14},${n.y} ${n.x + n.b},${n.y} ${n.x + n.b - 14},${n.y + n.h} ${n.x},${n.y + n.h}`} className="d-boks" />;
          else form = <rect x={n.x} y={n.y} width={n.b} height={n.h} rx="8" className="d-boks" />;
          return <g key={n.id}>{form}{tekster}</g>;
        })}
      </svg>
    </figure>
  );
}
