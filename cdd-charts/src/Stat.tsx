import { type ReactNode } from "react";

export interface StatProps {
  /** Cifra principal (string ya formateado o un `<CountUp/>`). */
  value: ReactNode;
  /** Etiqueta en mono mayúsculas debajo de la cifra. */
  label: string;
  /** Color de la cifra. Acepta tokens `var(--*)`. */
  color?: string;
  /** Tamaño de la cifra en px. */
  size?: number;
}

/**
 * Bloque de estadística: cifra grande en serif + etiqueta en mono. La unidad de
 * comunicación numérica del deck.
 */
export function Stat({ value, label, color = "var(--ink)", size = 96 }: StatProps) {
  return (
    <div>
      <div className="stat-num" style={{ fontSize: size, color }}>{value}</div>
      <div className="stat-lab" style={{ marginTop: 8 }}>{label}</div>
    </div>
  );
}
