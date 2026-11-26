/** Hjelpere for å lage kjørbare Java-programmer i oppgavedataene. */

const rykk = (tekst: string, n: number) => tekst.split('\n').map((l) => (l.trim() ? ' '.repeat(n) + l : l)).join('\n');

/** Pakker linjer inn i `public class Main { public static void main … }`. */
export function main(kropp: string, foran = '', etter = ''): string {
  const imp = foran ? `${foran.trim()}\n\n` : '';
  const ekstra = etter ? `\n\n${rykk(etter.trim(), 4)}` : '';
  return `${imp}public class Main {\n    public static void main(String[] args) {\n${rykk(kropp.trim(), 8)}\n    }${ekstra}\n}`;
}

/**
 * Program med egne klasser. Main står FØRST: `java Main.java` (enkeltfil-kjøring) bruker den første klassen
 * i fila som startpunkt.
 */
export function medKlasser(klasser: string, kropp: string, foran = ''): string {
  return `${main(kropp, foran)}\n\n${klasser.trim()}`;
}

export const java = (kode: string) => '```java\n' + kode.trim() + '\n```';
