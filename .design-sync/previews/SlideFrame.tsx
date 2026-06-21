import { SlideFrame, Eyebrow, SlideTitle, BarRow, Note } from "@cdd/charts";

/** Slide completa (papel): eyebrow + título + lista de barras + pie. */
export const SlidePapel = () => (
  <SlideFrame
    tone="paper"
    width={1920}
    height={1080}
    foot={<><span>Siniestros Viales CABA · TPO Ciencia de Datos</span><span>11 / 24</span></>}
  >
    <Eyebrow num="04" section="Aprendizaje no supervisado" />
    <SlideTitle>La gravedad no es un lugar: es un <em>perfil</em></SlideTitle>
    <div className="content" style={{ justifyContent: "center" }}>
      <div className="barlist" style={{ maxWidth: 820 }}>
        <BarRow label="Persona mayor 65+" fill={0.92} value="12,9%" color="var(--severe)" />
        <BarRow label="Peatón adulto" fill={0.73} value="10,3%" color="var(--severe-br)" />
        <BarRow label="Moto laboral" fill={0.5} value="7,0%" color="var(--amber)" />
        <BarRow label="Vehicular leve" fill={0.14} value="2,0%" color="var(--green)" />
      </div>
      <Note>Spread de 10,9 pp entre perfiles, vs 0,9 pp entre zonas: el quién manda sobre el dónde.</Note>
    </div>
  </SlideFrame>
);

/** Slide oscura: cifra dominante + título con acento. */
export const SlideOscura = () => (
  <SlideFrame
    tone="dark"
    width={1920}
    height={1080}
    foot={<><span>Siniestros Viales CABA</span><span>13 / 24</span></>}
  >
    <Eyebrow num="05" section="Clasificación · clases 7–8" />
    <div className="content" style={{ justifyContent: "center" }}>
      <div className="stat-num" style={{ fontSize: 220, color: "var(--severe-br)" }}>94%</div>
      <SlideTitle sm>Acertar el 94% es <em>no predecir nada</em></SlideTitle>
    </div>
  </SlideFrame>
);
