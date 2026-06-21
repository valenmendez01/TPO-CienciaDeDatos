import { useState, type ReactNode } from "react";
import { nf, type ChartRow } from "./internal";

export interface LineChartMarker {
  /** Valor de `xKey` donde cae el marcador vertical. */
  at: number | string;
  /** Etiqueta del marcador. */
  label: string;
}

export interface LineChartProps {
  /** Filas de datos (serie temporal o secuencial). */
  data: ChartRow[];
  /** Clave del eje X dentro de cada fila. */
  xKey: string;
  /** Clave del valor numérico (eje Y). */
  yKey: string;
  /** Alto del SVG en px (el ancho es fluido). */
  height?: number;
  /** Color del trazo y del relleno. Acepta tokens `var(--*)`. */
  color?: string;
  /** Dibuja el área bajo la curva. */
  fill?: boolean;
  /** Formateador de la etiqueta del eje X. */
  fmtX?: (x: number | string) => ReactNode;
  /** Formateador del valor X en el tooltip. */
  fmtTip?: (x: number | string) => ReactNode;
  /** Marcadores verticales (eventos puntuales). */
  markers?: LineChartMarker[];
}

/**
 * Gráfico de línea / área con grilla, tooltip al pasar el mouse y marcadores
 * verticales opcionales. SVG fluido; los colores salen de los tokens de marca.
 */
export function LineChart({
  data,
  xKey,
  yKey,
  height = 260,
  color = "var(--slate)",
  fill = true,
  fmtX,
  fmtTip,
  markers = [],
}: LineChartProps) {
  const W = 900, H = height, padL = 46, padR = 18, padT = 18, padB = 34;
  const ys = data.map((d) => d[yKey] as number);
  const maxY = Math.max(...ys) * 1.12, minY = 0;
  const px = (i: number) => padL + (i / (data.length - 1)) * (W - padL - padR);
  const py = (vv: number) => H - padB - ((vv - minY) / (maxY - minY)) * (H - padT - padB);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d[yKey] as number).toFixed(1)}`).join(" ");
  const area = `${line} L${px(data.length - 1)},${H - padB} L${padL},${H - padB} Z`;
  const yticks = 4;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
      onMouseLeave={() => setHover(null)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const xr = ((e.clientX - r.left) / r.width) * W;
        let best = 0, bd = 1e9;
        data.forEach((_, i) => { const dd = Math.abs(px(i) - xr); if (dd < bd) { bd = dd; best = i; } });
        setHover(best);
      }}
    >
      {Array.from({ length: yticks + 1 }).map((_, i) => {
        const vv = (maxY * i) / yticks, y = py(vv);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} className="grid-line" opacity={i === 0 ? 0 : 0.6} />
            <text x={padL - 9} y={y + 4} textAnchor="end" className="axis-lab">{Math.round(vv)}</text>
          </g>
        );
      })}
      {fill && <path d={area} fill={color} opacity=".10" />}
      <path className="ch-line" d={line} pathLength="1" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1" />
      {markers.map((m, i) => {
        const idx = data.findIndex((d) => d[xKey] === m.at);
        if (idx < 0) return null;
        return (
          <g key={i}>
            <line x1={px(idx)} x2={px(idx)} y1={padT} y2={H - padB} stroke="var(--severe)" strokeWidth="1" strokeDasharray="3 3" opacity=".5" />
            <text x={px(idx) + 6} y={padT + 12} className="axis-lab" fill="var(--severe)">{m.label}</text>
          </g>
        );
      })}
      {data.map((d, i) =>
        (i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) ? (
          <text key={i} x={px(i)} y={H - 12} textAnchor="middle" className="axis-lab">{fmtX ? fmtX(d[xKey]) : d[xKey]}</text>
        ) : null
      )}
      {hover != null && (
        <g>
          <line x1={px(hover)} x2={px(hover)} y1={padT} y2={H - padB} stroke="var(--ink)" strokeWidth="1" opacity=".25" />
          <circle cx={px(hover)} cy={py(data[hover][yKey] as number)} r="4.5" fill={color} stroke="var(--card)" strokeWidth="2" />
          <g transform={`translate(${Math.min(px(hover) + 10, W - 150)},${padT + 6})`}>
            <rect width="142" height="46" rx="7" fill="var(--ink)" opacity=".94" />
            <text x="12" y="19" fill="var(--paper)" style={{ font: "600 12px var(--ff-mono)" }}>{fmtTip ? fmtTip(data[hover][xKey]) : fmtX ? fmtX(data[hover][xKey]) : data[hover][xKey]}</text>
            <text x="12" y="36" fill="var(--paper)" style={{ font: "500 12px var(--ff-sans)", opacity: 0.85 }}>{nf(data[hover][yKey] as number)} siniestros</text>
          </g>
        </g>
      )}
    </svg>
  );
}
