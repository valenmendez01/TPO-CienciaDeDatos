import { type ReactNode } from "react";

export interface NoteProps {
  /** Contenido de la nota. */
  children: ReactNode;
}

/**
 * Nota al margen en mono con barra lateral — para matices, caveats y aclaraciones
 * secundarias junto al contenido principal.
 */
export function Note({ children }: NoteProps) {
  return <p className="note">{children}</p>;
}
