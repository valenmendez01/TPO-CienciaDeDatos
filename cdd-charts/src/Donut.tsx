import { type ReactNode } from "react";

/** Un segmento del donut: valor `v` y color del arco. */
export interface DonutSegment {
  v: number;
  color: string;
  /** Etiqueta opcional (no se dibuja en el anillo; útil para leyendas externas). */
  label?: string;
}

export interface DonutProps {
  /** Segmentos del anillo (se normalizan al total). */
  segments: DonutSegment[];
  /** Diámetro en px. */
  size?: number;
  /** Grosor del anillo en px. */
  thickness?: number;
  /** Contenido centrado dentro del anillo (cifra, etiqueta…). */
  center?: ReactNode;
}

/**
 * Gráfico de anillo (donut) con segmentos proporcionales y contenido central
 * opcional. La pista de fondo usa `--paper-3`; cada segmento trae su propio color.
 */
export function Donut({ segments, size = 180, thickness = 26, center }: DonutProps) {
  const r = (size - thickness) / 2, C = 2 * Math.PI * r, cx = size / 2;
  let acc = 0;
  const total = segments.reduce((a, s) => a + s.v, 0);
  return (
    <div className="ch-pop" style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--paper-3)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.v / total, dash = frac * C, off = acc * C;
          acc += frac;
          return <circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${dash} ${C}`} strokeDashoffset={-off} />;
        })}
      </svg>
      {center && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{center}</div>
      )}
    </div>
  );
}
