import { type ReactNode, type CSSProperties } from "react";

export interface SlideFrameProps {
  /** Contenido de la slide (típicamente Eyebrow + SlideTitle + .content). */
  children: ReactNode;
  /** Fondo de la slide. */
  tone?: "paper" | "paper-2" | "dark";
  /** Pie de slide opcional (ej. atribución + número). */
  foot?: ReactNode;
  /** Dimensiones fijas del lienzo (ej. 1920×1080). Si se omiten, es fluido. */
  width?: number;
  height?: number;
  style?: CSSProperties;
}

/**
 * Lienzo de una slide / poster: aplica fondo (papel / papel-2 / oscuro), el
 * padding editorial y el contexto que pinta las variantes oscuras de los demás
 * componentes (Eyebrow, SlideTitle, Note, BarRow). Envolvé acá tus composiciones.
 *
 * @example
 * <SlideFrame tone="dark" width={1920} height={1080} foot={<><span>CDD</span><span>14 / 24</span></>}>
 *   <Eyebrow num="05" section="Clasificación" />
 *   <SlideTitle sm>Cinco modelos, un <em>ganador</em></SlideTitle>
 *   <div className="content">…</div>
 * </SlideFrame>
 */
export function SlideFrame({ children, tone = "paper", foot, width, height, style }: SlideFrameProps) {
  const cls = "slide" + (tone === "dark" ? " dark" : tone === "paper-2" ? " paper-2" : "");
  return (
    <section className={cls} style={{ width, height, ...style }}>
      {children}
      {foot && <div className="deck-foot">{foot}</div>}
    </section>
  );
}
