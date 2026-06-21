import { type ReactNode } from "react";
import { nf, pct, type ChartRow } from "./internal";
import { CountUp } from "./CountUp";

export interface BarsProps {
  /** Filas de datos. */
  data: ChartRow[];
  /** Clave del valor de cada barra. */
  yKey?: string;
  /** Clave de la etiqueta de cada fila. */
  labelKey?: string;
  /** Si se pasa, muestra el % de severidad dentro de la barra. */
  rateKey?: string;
  /** Color de las barras. Acepta tokens `var(--*)`. */
  color?: string;
  /** Formateador del valor numérico (a la derecha, con CountUp). */
  fmtVal?: (v: number) => ReactNode;
  /** Máximo para normalizar el ancho (por defecto, el máximo de los datos). */
  maxN?: number;
  /** Alto de cada barra en px. */
  barH?: number;
  /** Separación vertical entre barras en px. */
  gap?: number;
  /** Muestra la etiqueta de tasa cuando hay `rateKey`. */
  showRate?: boolean;
}

/**
 * Barras horizontales ordenadas (ranking) con valor animado a la derecha y, si
 * se pasa `rateKey`, una etiqueta de % severo dentro de la barra.
 */
export function Bars({
  data,
  yKey = "n",
  labelKey = "k",
  rateKey,
  color = "var(--slate)",
  fmtVal = nf,
  maxN,
  barH = 30,
  gap = 12,
  showRate = true,
}: BarsProps) {
  const max = maxN || Math.max(...data.map((d) => d[yKey] as number));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {data.map((d, i) => {
        const w = ((d[yKey] as number) / max) * 100;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "118px 1fr auto", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, textAlign: "right", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d[labelKey]}</div>
            <div style={{ height: barH, background: "var(--paper-3)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <div className="ch-growx" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w + "%", background: color, borderRadius: 4, animationDelay: `${i * 0.04}s` }} />
              {rateKey && showRate && (
                <div style={{ position: "absolute", right: 9, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: "var(--ff-mono)", fontSize: 11, fontWeight: 600, color: "var(--severe)" }}>{pct(d[rateKey] as number, 1)} sev.</div>
              )}
            </div>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 13, fontWeight: 600, minWidth: 54, textAlign: "right" }}>
              <CountUp value={d[yKey] as number} fmt={fmtVal} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
