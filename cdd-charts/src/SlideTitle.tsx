import { type ReactNode } from "react";

export interface SlideTitleProps {
  /** Texto del título. Envolvé una palabra en `<em>` para acentuarla en `--severe`. */
  children: ReactNode;
  /** Tamaño reducido (para slides con más contenido). */
  sm?: boolean;
}

/**
 * Título de slide en serif (Newsreader). El énfasis va con `<em>` dentro de
 * `children`, que se pinta en cursiva con el color de acento.
 *
 * @example <SlideTitle sm>La gravedad no es un lugar: es un <em>perfil</em></SlideTitle>
 */
export function SlideTitle({ children, sm }: SlideTitleProps) {
  return <h2 className={sm ? "title sm" : "title"}>{children}</h2>;
}
