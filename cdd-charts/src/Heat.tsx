import { useState, Fragment, type ReactNode } from "react";
import { nf } from "./internal";

/** Celda de la matriz: `n` casos totales, `s` casos severos. */
export interface HeatCell {
  n: number;
  s: number;
}

export interface HeatProps {
  /** Matriz de celdas, indexada `[fila][columna]`. */
  matrix: HeatCell[][];
  /** Etiquetas de fila. */
  rows: string[];
  /** Etiquetas de columna. */
  cols: string[];
  /** Métrica a colorear: `rate` (= s/n) o `count` (= n). */
  metric?: "rate" | "count";
  /** Formateador del número dentro de cada celda. */
  fmt?: (v: number) => ReactNode;
}

/**
 * Mapa de calor de una matriz fila×columna, coloreado por tasa (s/n) o por
 * conteo, con escala continua sobre el token `--severe`. Resalta la celda bajo
 * el mouse.
 */
export function Heat({ matrix, rows, cols, metric = "rate", fmt }: HeatProps) {
  const flat = matrix.flat();
  const vals = flat.map((c) => (metric === "rate" ? (c.n ? c.s / c.n : 0) : c.n));
  const max = Math.max(...vals), min = Math.min(...vals);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const color = (vv: number) => {
    const t = (vv - min) / (max - min || 1);
    return `color-mix(in srgb, var(--severe) ${(8 + t * 82).toFixed(0)}%, var(--paper-2))`;
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: `58px repeat(${cols.length},1fr)`, gap: 6 }}>
      <div></div>
      {cols.map((c, j) => (
        <div key={j} style={{ fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--mute)", textAlign: "center", textTransform: "capitalize" }}>{c.toLowerCase()}</div>
      ))}
      {rows.map((r, i) => (
        <Fragment key={i}>
          <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11.5, color: "var(--mute)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>{r}</div>
          {cols.map((_, j) => {
            const cell = matrix[i][j];
            const vv = metric === "rate" ? (cell.n ? cell.s / cell.n : 0) : cell.n;
            const on = hover && hover[0] === i && hover[1] === j;
            const t = (vv - min) / (max - min || 1);
            return (
              <div key={j} className="ch-heat" onMouseEnter={() => setHover([i, j])} onMouseLeave={() => setHover(null)}
                style={{ aspectRatio: "1.7/1", borderRadius: 6, background: color(vv), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ff-mono)", fontSize: 11.5, fontWeight: 600, color: t > 0.55 ? "#fff" : "var(--ink)", cursor: "default", outline: on ? "2px solid var(--ink)" : "none", outlineOffset: -2, animationDelay: `${(i * cols.length + j) * 0.012}s` }}>
                {fmt ? fmt(metric === "rate" ? vv : cell.n) : metric === "rate" ? (vv * 100).toFixed(1) : nf(cell.n)}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
