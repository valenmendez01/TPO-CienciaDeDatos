import { useState, useEffect, type CSSProperties, type ReactNode } from "react";

export interface CountUpProps {
  /** Valor final al que anima la cuenta. */
  value: number;
  /** Duración de la animación en ms. */
  dur?: number;
  /** Formateador del número mostrado. Por defecto redondea al entero. */
  fmt?: (v: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Número que cuenta desde 0 hasta `value` con easing cúbico.
 * El render base es el valor final; la animación arranca solo cuando la página
 * pinta (vía requestAnimationFrame), así un iframe en pausa nunca muestra 0.
 */
export function CountUp({ value, dur = 900, fmt = (v) => Math.round(v), className, style }: CountUpProps) {
  const [v, setV] = useState(value);
  useEffect(() => {
    let raf: number, raf2: number;
    raf = requestAnimationFrame(() => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setV(value * e);
        if (p < 1) raf2 = requestAnimationFrame(tick);
        else setV(value);
      };
      raf2 = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
    };
  }, [value, dur]);
  return (
    <span className={className} style={style}>
      {fmt(v)}
    </span>
  );
}
