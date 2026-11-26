/*
 * Kjører hvert fasitprogram i helgeoppgavene med ekte Java og sjekker utskriften.
 * Hoppes over hvis `java` ikke finnes på maskinen.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HELG_OPPGAVER } from '../rea/helg/oppgaver';
import { normaliserSvar, utskriftStemmer } from '../rea/helg/mestring';

const harJava = (() => { try { execFileSync('java', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

describe.skipIf(!harJava)('Java-fasitene kjører og gir forventet utskrift', () => {
  const dir = mkdtempSync(join(tmpdir(), 'helg-java-'));
  for (const o of HELG_OPPGAVER.filter((x) => x.fasitKode)) {
    it(`${o.id} – ${o.tittel}`, () => {
      const sub = mkdtempSync(join(dir, 'o-'));
      const fil = join(sub, 'Main.java');
      writeFileSync(fil, o.fasitKode!);
      const r = spawnSync('java', ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', fil], { input: o.testInput ?? '', encoding: 'utf8', timeout: 20000 });
      const feil = r.stderr.split('\n').filter((l) => l.trim() && !l.startsWith('Picked up')).join('\n');
      expect(feil).toBe('');
      expect(r.status).toBe(0);
      if (o.utskrift) expect(utskriftStemmer(r.stdout, o.utskrift), `faktisk:\n${r.stdout}`).toBe(true);
      // Auto-svar på forutsi-oppgaver skal stemme med faktisk utskrift når svaret er hele utskriften
      if (o.svar && o.trinn === 'forutsi' && o.kode === o.fasitKode && o.utskrift && !o.utskrift.includes('\n')) {
        expect(o.svar.godta.map(normaliserSvar)).toContain(normaliserSvar(r.stdout));
      }
    }, 30000);
  }
});
