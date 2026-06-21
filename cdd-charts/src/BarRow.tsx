import { type ReactNode } from "react";

export interface BarRowProps {
  /** Etiqueta a la izquierda. */
  label: ReactNode;
  /** Relleno de la barra, 0–1. */
  fill: number;
  /** Valor mostrado a la derecha (string ya formateado). */
  value?: ReactNode;
  /** Color del relleno. Acepta tokens `var(--*)`. */
  color?: string;
  /** Ancho fijo de la columna de etiqueta en px. */
  labelWidth?: number;
}

/**
 * Una fila de barra editorial (etiqueta · pista · valor) — la barra estática que
 * el deck usa para rankings y composiciones. Componé varias dentro de un
 * contenedor `.barlist` (o un flex column) para armar la lista.
 *
 * @example
 * <div className="barlist">
 *   <BarRow label="Persona mayor 65+" fill={0.92} value="12,9%" color="var(--severe)" />
 *   <BarRow label="Peatón adulto" fill={0.73} value="10,3%" color="var(--severe-br)" />
 * </div>
 */
export function BarRow({ label, fill, value, color = "var(--slate)", labelWidth = 200 }: BarRowProps) {
  const w = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <div className="bar">
      <span className="bar-label" style={{ width: labelWidth }}>{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      {value != null && <span className="bar-val">{value}</span>}
    </div>
  );
}
