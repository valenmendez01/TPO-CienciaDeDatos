export interface EyebrowProps {
  /** Número o código de sección (ej. "05"), en color de acento. */
  num?: string;
  /** Etiqueta de la sección (ej. "Clasificación · clases 7–8"). */
  section: string;
  /** Dibuja la línea horizontal que llena el resto del ancho. */
  line?: boolean;
}

/**
 * Cintillo superior de una slide: número de acento + etiqueta de sección en
 * mono mayúsculas, con una línea fina opcional. Va arriba del título.
 */
export function Eyebrow({ num, section, line = true }: EyebrowProps) {
  return (
    <div className="eyebrow">
      {num && <span className="ey-num">{num}</span>}
      <span className="ey-sec">{section}</span>
      {line && <span className="ey-line" />}
    </div>
  );
}
