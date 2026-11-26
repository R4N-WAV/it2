export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function Fremdrift({ verdi, label }: { verdi: number; label?: string }) {
  const p = Math.round(Math.max(0, Math.min(1, verdi)) * 100);
  return (
    <div className="fremdrift" title={label} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <div className="fyll" style={{ width: `${p}%` }} />
    </div>
  );
}

const IKONER: Record<string, string> = {
  idag: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  plan: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  ov: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z',
  eksamen: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  innstillinger: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  sol: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  maane: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  laas: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  sjekk: 'M5 12l5 5L20 7',
  spill: 'M8 5v14l11-7z',
  kryss: 'M6 6l12 12M18 6L6 18',
  tilbake: 'M19 12H5M11 18l-6-6 6-6',
  kort: 'M4 7h12v13H4zM8 4h12v13',
  mal: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  repeter: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  mikrofon: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM19 11a7 7 0 0 1-14 0M12 18v3',
  bok: 'M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2zM4 5v17M20 5v17',
  advarsel: 'M12 3l10 18H2zM12 10v5M12 18h.01',
  kode: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16',
};

export function Ikon({ navn, stor }: { navn: string; stor?: boolean }) {
  const fylt = navn === 'spill';
  return (
    <svg className={`ikon ${stor ? 'ikon-stor' : ''}`} viewBox="0 0 24 24" width={stor ? 48 : 20} height={stor ? 48 : 20} aria-hidden="true"
      fill={fylt ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fylt ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d={IKONER[navn] ?? ''} />
    </svg>
  );
}
