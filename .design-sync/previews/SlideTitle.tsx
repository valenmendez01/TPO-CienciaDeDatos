import { SlideTitle } from "@cdd/charts";

/** Título con palabra acentuada en cursiva (color de acento). */
export const ConAcento = () => (
  <SlideTitle>La gravedad no es un lugar: es un <em>perfil</em></SlideTitle>
);

/** Variante reducida (slides con más contenido). */
export const Pequeno = () => (
  <SlideTitle sm>El modelo final detecta <em>73 de cada 100</em> siniestros severos</SlideTitle>
);
