import { useState } from 'react';
import { GIST_BESKRIVELSE, kobleFra, kobleTil, synkNaa, useSynk, type SynkStatus } from './synk';

const TOKEN_LENKE = 'https://github.com/settings/tokens/new?description=IT2%20REA3050-trener%20(synk)&scopes=gist';

export function synkTekst(s: SynkStatus) {
  if (s.tilstand === 'av') return 'Kun på denne enheten';
  if (s.tilstand === 'synker') return 'Synkroniserer …';
  if (s.tilstand === 'offline') return 'Offline – synker senere';
  if (s.tilstand === 'feil') return 'Synkfeil – se Innstillinger';
  return s.sist ? `Synket ${new Date(s.sist).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}` : 'Synk på';
}

/** Liten statusknapp for menyen. */
export function SynkMerke({ onKlikk }: { onKlikk: () => void }) {
  const s = useSynk();
  const klasse = s.tilstand === 'ok' ? 'ok' : s.tilstand === 'synker' ? '' : s.tilstand === 'offline' ? 'midt' : 'nei';
  return <button className={`chip synk-merke ${klasse}`} onClick={onKlikk} title="Synkronisering mellom enheter">☁ {synkTekst(s)}</button>;
}

/** Påminnelse på forsiden når synk ikke er satt opp. */
export function SynkPaminnelse({ onOppsett }: { onOppsett: () => void }) {
  const s = useSynk();
  if (s.tilstand !== 'av' && s.tilstand !== 'feil') return null;
  return (
    <div className="flate synk-paminnelse">
      <b>{s.tilstand === 'feil' ? 'Synkroniseringen virker ikke akkurat nå' : 'Fremdriften ligger bare på denne enheten'}</b>
      <p className="liten">{s.tilstand === 'feil' ? s.melding : 'Sett opp synkronisering (ca. 2 minutter, én gang per enhet), så følger svar, vurderinger, simuleringer og plan med mellom PC og mobil.'}</p>
      <button className="knapp liten-knapp" onClick={onOppsett}>{s.tilstand === 'feil' ? 'Åpne innstillinger' : 'Sett opp synkronisering'}</button>
    </div>
  );
}

export function SynkOppsett() {
  const s = useSynk();
  const [token, setToken] = useState('');
  const [melding, setMelding] = useState<string | null>(null);
  const [jobber, setJobber] = useState(false);

  if (s.tilstand !== 'av') {
    return (
      <section className="flate" id="synk">
        <h2>Synkronisering mellom enheter</h2>
        <p>Status: <b>{synkTekst(s)}</b>{s.bruker && <> · GitHub-bruker <b>{s.bruker}</b></>}</p>
        {s.melding && s.tilstand !== 'ok' && <p className="advar-tekst">{s.melding}</p>}
        <p className="liten">Fremdriften lagres i en privat Gist («{GIST_BESKRIVELSE}») på GitHub-kontoen din og synkes automatisk: ved oppstart, når du kommer tilbake til appen, noen sekunder etter hver endring og hvert 2. minutt. Øver du offline, slås endringene sammen neste gang du er på nett – ingenting overskrives.</p>
        <div className="rad">
          <button className="knapp" disabled={s.tilstand === 'synker'} onClick={() => void synkNaa()}>Synk nå</button>
          <button className="knapp sek" onClick={() => { if (confirm('Koble denne enheten fra synkroniseringen? Fremdriften blir liggende både her og på GitHub.')) kobleFra(); }}>Koble fra denne enheten</button>
        </div>
      </section>
    );
  }

  return (
    <section className="flate" id="synk">
      <h2>Synkronisering mellom enheter</h2>
      <p className="liten">Appen har ingen server, så fremdriften lagres i en privat Gist på din egen GitHub-konto. Gjør dette én gang på <b>hver</b> enhet (PC og mobil) – bruk gjerne samme token:</p>
      <ol className="liste">
        <li><a href={TOKEN_LENKE} target="_blank" rel="noreferrer">Åpne GitHub og lag et token</a> (logg inn som deg). Navn og tilgangen <b>gist</b> er fylt ut – la alt annet være avkrysset bort. Velg utløp f.eks. «60 days».</li>
        <li>Trykk «Generate token» nederst og kopier tokenet (starter med <code>ghp_</code>).</li>
        <li>Lim det inn her og trykk «Koble til». Første enhet lager Gisten; neste enhet finner den automatisk.</li>
      </ol>
      <form className="rad" onSubmit={async (e) => {
        e.preventDefault();
        setJobber(true); setMelding(null);
        const feil = await kobleTil(token);
        setJobber(false);
        if (feil) setMelding(feil); else setToken('');
      }}>
        <input className="input mono" type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_…" aria-label="GitHub-token" style={{ flex: 1, minWidth: 200 }} />
        <button className="knapp" disabled={!token.trim() || jobber}>{jobber ? 'Kobler til …' : 'Koble til'}</button>
      </form>
      {melding && <p className="advar-tekst">{melding}</p>}
      <p className="liten dempet">Tokenet lagres bare i denne nettleseren og gir kun tilgang til gists – ikke til repoene dine. En «secret» Gist vises ikke offentlig, men kan leses av den som har lenken; den inneholder svarene dine i appen, ingen passord.</p>
    </section>
  );
}
