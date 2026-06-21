import { type ReactNode } from "react";

export interface TagProps {
  /** Texto del tag (se muestra en mono mayúsculas). */
  children: ReactNode;
  /** Color del punto indicador. Si se omite, no se dibuja el punto. */
  dotColor?: string;
}

/**
 * Etiqueta / chip con borde fino y punto de color opcional — para clasificar o
 * marcar categorías (ej. tipo de modelo, sección).
 */
export function Tag({ children, dotColor }: TagProps) {
  return (
    <span className="tag">
      {dotColor && <span className="dot" style={{ background: dotColor }} />}
      {children}
    </span>
  );
}
