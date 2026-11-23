import { caser, tilleggsoppgaver } from './data/caser';
import { diagnose, droftinger } from './data/drofting';
import { ekstra, fordypning } from './data/muntlig2';
import { sensorbank } from './data/muntlig1';
import { feilsok, praktiske } from './data/praktisk';
import { kontrollsporsmal } from './pensum';
import type { KmId } from './typer';

export { caser, tilleggsoppgaver, diagnose, droftinger, praktiske, feilsok, kontrollsporsmal };

export const muntlige = [...sensorbank, ...fordypning, ...ekstra];
export const allePraktiske = [...praktiske, ...feilsok];

export const muntligMedId = (id: string) => muntlige.find((m) => m.id === id);
export const praktiskMedId = (id: string) => allePraktiske.find((p) => p.id === id);
export const caseMedId = (id: string) => caser.find((c) => c.id === id);
export const tilleggMedId = (id: string) => tilleggsoppgaver.find((t) => t.id === id);
export const droftingMedId = (id: string) => droftinger.find((d) => d.id === id);

/** Tilleggsoppgaver som prøver andre kompetansemål enn casen (ingen overlapp). */
export function tilleggForCase(caseId: string) {
  const c = caseMedId(caseId);
  if (!c) return [];
  return tilleggsoppgaver.filter((t) => !t.km.some((k) => c.km.includes(k)));
}

export function dekningPerKm(km: KmId) {
  return {
    muntlig: muntlige.filter((m) => m.km.includes(km)).length,
    praktisk: allePraktiske.filter((p) => p.km.includes(km)).length + caser.filter((c) => c.km.includes(km)).length,
    drofting: droftinger.filter((d) => d.km.includes(km)).length,
    tillegg: tilleggsoppgaver.filter((t) => t.km.includes(km)).length,
  };
}
