/** Paleta de marca como CSS custom properties (para pasar a la prop `color`). */
export const COL = {
  severe: "var(--severe)",
  slate: "var(--slate)",
  amber: "var(--amber)",
  green: "var(--green)",
  ink: "var(--ink)",
  mute: "var(--mute)",
} as const;

/** Formato de número en es-AR (separador de miles con punto). */
export const nf = (n: number): string => n.toLocaleString("es-AR");

/** Formato de porcentaje en es-AR (coma decimal). `pct(0.057)` → "5,7%". */
export const pct = (x: number, d = 1): string =>
  (x * 100).toFixed(d).replace(".", ",") + "%";

/** Una fila de datos de un gráfico: claves arbitrarias → valor numérico o etiqueta. */
export type ChartRow = Record<string, number | string>;
