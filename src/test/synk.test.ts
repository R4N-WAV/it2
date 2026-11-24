import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppData, Vurdering } from '../rea/typer';

const v = (id: string, tid: number): Vurdering => ({ id, kilde: 'muntlig', ref: id, km: ['KM4'], dim: { korrekt: 3 }, score: 3, hint: false, dekning: null, dato: '2026-11-24', tid });

describe('sammenslå', async () => {
  const { sammenslå, stabil } = await import('../rea/synk');
  const { tomData } = await import('../rea/store');
  const d = (x: Partial<AppData>): AppData => ({ ...tomData(), ...x });

  it('slår sammen arbeid gjort på to enheter uten å miste noe', () => {
    const pc = d({ vurderinger: [v('a', 1), v('b', 3)], lest: { s1: 10 }, aktivitet: ['2026-11-23'] });
    const mobil = d({ vurderinger: [v('b', 3), v('c', 2)], lest: { s2: 20 }, aktivitet: ['2026-11-24'] });
    const m = sammenslå(pc, mobil);
    expect(m.vurderinger.map((x) => x.id)).toEqual(['a', 'c', 'b']);
    expect(m.lest).toEqual({ s1: 10, s2: 20 });
    expect(m.aktivitet).toEqual(['2026-11-23', '2026-11-24']);
    expect(stabil(sammenslå(mobil, pc))).toBe(stabil(m)); // symmetrisk
  });

  it('respekterer «fjernet»-handlinger, men ny avkryssing etterpå vinner', () => {
    const a = d({ lest: {}, slettet: { 'lest:s1': 50 }, plan: { '2026-11-24': [] }, slettet2: undefined } as Partial<AppData>);
    const b = d({ lest: { s1: 40 }, plan: { '2026-11-24': ['d2-1'] }, planTid: { '2026-11-24:d2-1': 30 } });
    const m = sammenslå({ ...a, slettet: { 'lest:s1': 50, 'plan:2026-11-24:d2-1': 45 } }, b);
    expect(m.lest.s1).toBeUndefined();
    expect(m.plan['2026-11-24']).toEqual([]);
    const igjen = sammenslå(m, d({ lest: { s1: 60 }, plan: { '2026-11-24': ['d2-1'] }, planTid: { '2026-11-24:d2-1': 70 } }));
    expect(igjen.lest.s1).toBe(60);
    expect(igjen.plan['2026-11-24']).toEqual(['d2-1']);
  });

  it('nyeste status på feil vinner, og slettede feil kommer ikke tilbake', () => {
    const f = { id: 'f1', tid: 1, km: [], tekst: 'x', auto: false, lost: false };
    const m = sammenslå(d({ feillogg: [{ ...f, lost: true, endret: 5 }] }), d({ feillogg: [f, { ...f, id: 'f2' }] }));
    expect(m.feillogg.find((x) => x.id === 'f1')!.lost).toBe(true);
    const slettet = sammenslå(d({ feillogg: [], slettet: { 'feil:f2': 9 } }), m);
    expect(slettet.feillogg.map((x) => x.id)).toEqual(['f1']);
  });

  it('repetisjon: tilstanden med flest gjennomganger vinner', () => {
    const m = sammenslå(d({ rep: { A1: { boks: 2, forfaller: 100, sett: 1, siste: 2 } } }), d({ rep: { A1: { boks: 4, forfaller: 50, sett: 3, siste: 4 } } }));
    expect(m.rep.A1.sett).toBe(3);
  });

  it('nyeste nullstilling vinner over eldre data fra andre enheter', () => {
    const m = sammenslå(d({ nullstilt: 100 }), d({ vurderinger: [v('gammel', 50)] }));
    expect(m.vurderinger).toEqual([]);
    expect(m.nullstilt).toBe(100);
  });

  it('pågående simulering beholdes, men ikke hvis den er fullført på en annen enhet', () => {
    const aktiv = { id: 'sim-1', caseId: 'C1', tilleggId: 'T9', fase: 'samtale' as const, startform: 'forklaring' as const, forberedelseMin: 30, forberedelseStart: 1, eksaminasjonStart: 2, notater: '', startSvar: '', snakkeSek: 0, sensorIndeks: 0, sensorSvar: [], tilleggSvar: '' };
    expect(sammenslå(d({ aktivSim: aktiv }), d({})).aktivSim?.id).toBe('sim-1');
    const ferdig = { id: 'sim-1', caseId: 'C1', tilleggId: 'T9', start: 1, slutt: 3, forberedelseMin: 30, startform: 'forklaring' as const, hoved: 3, tillegg: 3, sammenhengende: true, snakkeSek: 200, dim: {}, tilleggDim: {}, forbedring: [] };
    expect(sammenslå(d({ aktivSim: aktiv }), d({ sims: [ferdig] })).aktivSim).toBeNull();
  });
});

/* ---------- Ende-til-ende med falskt GitHub-API: to enheter deler én Gist ---------- */

function falskGitHub() {
  const gists = new Map<string, { description: string; files: Record<string, { content: string }> }>();
  let n = 0;
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const svar = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
    if ((init.headers as Record<string, string>).Authorization !== 'Bearer ghp_test') return svar(401, {});
    const sti = url.replace('https://api.github.com', '');
    if (sti === '/user') return svar(200, { login: 'testbruker' });
    if (sti.startsWith('/gists?')) return svar(200, [...gists.entries()].map(([id, g]) => ({ id, ...g })));
    if (sti === '/gists' && init.method === 'POST') { const id = `g${++n}`; const b = JSON.parse(init.body as string); gists.set(id, { description: b.description, files: b.files }); return svar(201, { id, ...gists.get(id) }); }
    const m = /^\/gists\/(\w+)$/.exec(sti);
    if (m && gists.has(m[1])) {
      if (init.method === 'PATCH') { const g = gists.get(m[1])!; Object.assign(g.files, JSON.parse(init.body as string).files); return svar(200, { id: m[1], ...g }); }
      return svar(200, { id: m[1], ...gists.get(m[1]) });
    }
    return svar(404, {});
  });
  return { gists, fetchMock };
}

describe('synkronisering via Gist', () => {
  const minne = new Map<string, string>();
  beforeEach(() => {
    vi.resetModules();
    minne.clear();
    vi.stubGlobal('localStorage', { getItem: (k: string) => minne.get(k) ?? null, setItem: (k: string, v: string) => { minne.set(k, v); }, removeItem: (k: string) => { minne.delete(k); } });
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('feil token gir forståelig melding og ingen tilkobling', async () => {
    const { fetchMock } = falskGitHub();
    vi.stubGlobal('fetch', fetchMock);
    const synk = await import('../rea/synk');
    expect(await synk.kobleTil('ghp_feil')).toMatch(/avviste tokenet/);
    expect(synk.erKoblet()).toBe(false);
  });

  it('PC lager Gisten, mobilen finner den, og arbeid fra begge havner på begge', async () => {
    const { gists, fetchMock } = falskGitHub();
    vi.stubGlobal('fetch', fetchMock);

    // PC
    let store = await import('../rea/store');
    let synk = await import('../rea/synk');
    store.markerLest('k04-4-7-arv');
    expect(await synk.kobleTil('ghp_test')).toBeNull();
    expect(gists.size).toBe(1);
    const pcLagring = new Map(minne);

    // Mobil: ny «enhet» med tom lagring
    minne.clear();
    vi.resetModules();
    store = await import('../rea/store');
    synk = await import('../rea/synk');
    store.markerLest('k05-5-2-uml-og-klassediagram');
    expect(await synk.kobleTil('ghp_test')).toBeNull();
    expect(gists.size).toBe(1); // fant samme Gist
    expect(Object.keys(store.hent().lest).sort()).toEqual(['k04-4-7-arv', 'k05-5-2-uml-og-klassediagram']);

    // Tilbake på PC: neste synk henter mobilens arbeid
    minne.clear();
    pcLagring.forEach((v, k) => minne.set(k, v));
    vi.resetModules();
    store = await import('../rea/store');
    synk = await import('../rea/synk');
    await synk.synkNaa();
    expect(Object.keys(store.hent().lest).sort()).toEqual(['k04-4-7-arv', 'k05-5-2-uml-og-klassediagram']);
    expect(synk.synkStatus().tilstand).toBe('ok');
  });
});
