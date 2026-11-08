import { useEffect, useState } from 'react';

export type Tema = 'system' | 'lys' | 'mork';
const NOKKEL = 'it2-tema';

export function lesTema(): Tema {
  try {
    const t = localStorage.getItem(NOKKEL);
    return t === 'lys' || t === 'mork' ? t : 'system';
  } catch {
    return 'system';
  }
}

export function brukTema(t: Tema) {
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t === 'mork' ? 'dark' : 'light');
}

export function useTema(): [Tema, (t: Tema) => void, boolean] {
  const [tema, setTema] = useState<Tema>(lesTema);
  const [systemMork, setSystemMork] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const m = matchMedia('(prefers-color-scheme: dark)');
    const f = () => setSystemMork(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const sett = (t: Tema) => {
    setTema(t);
    brukTema(t);
    try { localStorage.setItem(NOKKEL, t); } catch { /* ignorer */ }
  };
  const erMork = tema === 'mork' || (tema === 'system' && systemMork);
  return [tema, sett, erMork];
}
