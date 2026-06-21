import { useState, type ReactNode } from "react";
import { nf, type ChartRow } from "./internal";

export interface ColumnsProps {
  /** Filas de datos. La etiqueta del eje X se lee de la clave `k`. */
  data: ChartRow[];
  /** Clave del valor de cada columna. */
  yKey?: string;
  /** Alto del SVG en px. */
  height?: number;
  /** Color de las columnas. Acepta tokens `var(--*)`. */
  color?: string;
  /** Si se pasa, dibuja una línea secundaria de "tasa" (eje derecho, en severe). */
  rateKey?: string;
  /** Formateador de la etiqueta del eje X (recibe `row.k`). */
  fmtX?: (x: number | string) => ReactNode;
  /** Formateador del valor mostrado al hacer hover. */
  fmtVal?: (v: number) => ReactNode;
  /** Proporción de espacio entre columnas (0–1). */
  gap?: number;
}

/**
 * Gráfico de columnas verticales con grilla y, opcionalmente, una línea de tasa
 * superpuesta sobre un eje secundario (patrón conteo + % severo).
 */
export function Columns({
  data,
  yKey = "n",
  height = 260,
  color = "var(--slate)",
  rateKey,
  fmtX,
  fmtVal = nf,
  gap = 0.28,
}: ColumnsProps) {
  const W = 900, H = height, padL = 46, padR = rateKey ? 46 : 18, padT = 20, padB = 34;
  const maxY = Math.max(...data.map((d) => d[yKey] as number)) * 1.14;
  const maxR = rateKey ? Math.max(...data.map((d) => d[rateKey] as number)) * 1.25 : 1;
  const bw = (W - padL - padR) / data.length, barW = bw * (1 - gap);
  const py = (vv: number) => H - padB - (vv / maxY) * (H - padT - padB);
  const pr = (vv: number) => H - padB - (vv / maxR) * (H - padT - padB);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const vv = (maxY * i) / 4, y = py(vv);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} className="grid-line" opacity={i === 0 ? 0 : 0.55} />
            <text x={padL - 9} y={y + 4} textAnchor="end" className="axis-lab">{Math.round(vv)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padL + i * bw + (bw - barW) / 2, h = (H - padB) - py(d[yKey] as number), y = py(d[yKey] as number);
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect className="ch-col" x={x} y={y} width={barW} height={Math.max(0, h)} rx="2.5" fill={color}
              opacity={hover == null || hover === i ? 1 : 0.45} style={{ animationDelay: `${i * 0.025}s` }} />
            {hover === i && <text x={x + barW / 2} y={y - 7} textAnchor="middle" className="val-lab">{fmtVal(d[yKey] as number)}</text>}
          </g>
        );
      })}
      {rateKey && (
        <g>
          {Array.from({ length: 5 }).map((_, i) => {
            const vv = (maxR * i) / 4;
            return <text key={i} x={W - padR + 9} y={pr(vv) + 4} textAnchor="start" className="axis-lab" fill="var(--severe)">{(vv * 100).toFixed(0)}%</text>;
          })}
          <path className="ch-line" pathLength="1" strokeDasharray="1"
            d={data.map((d, i) => `${i === 0 ? "M" : "L"}${padL + i * bw + bw / 2},${pr(d[rateKey] as number)}`).join(" ")}
            fill="none" stroke="var(--severe)" strokeWidth="2" />
          {data.map((d, i) => (
            <circle key={i} className="ch-dot" cx={padL + i * bw + bw / 2} cy={pr(d[rateKey] as number)} r="3" fill="var(--severe)" style={{ animationDelay: `${0.5 + i * 0.02}s` }} />
          ))}
        </g>
      )}
      {data.map((d, i) =>
        (data.length <= 14 || i % Math.ceil(data.length / 12) === 0) ? (
          <text key={i} x={padL + i * bw + bw / 2} y={H - 12} textAnchor="middle" className="axis-lab">{fmtX ? fmtX(d.k) : d.k}</text>
        ) : null
      )}
    </svg>
  );
}
