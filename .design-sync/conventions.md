# @cdd/charts — primitivas de gráficos "Papel / Tinta"

Sistema de data-viz editorial "Papel / Tinta" para slides, posters e informes,
sobre fondo papel cálido, con acentos severe (rojo) / slate (azul-gris) / amber /
green. Trece componentes en dos grupos:

- **Gráficos**: `CountUp` (cifra animada), `LineChart` (línea/área), `Columns`
  (columnas, con línea de tasa opcional), `Bars` (ranking horizontal data-driven),
  `Heat` (mapa de calor), `Donut` (anillo).
- **Editorial (slides)**: `SlideFrame` (lienzo de slide papel/oscuro), `Eyebrow`
  (cintillo de sección), `SlideTitle` (título serif con acento `<em>`), `Stat`
  (cifra grande + etiqueta), `BarRow` (fila de barra editorial), `Tag` (chip con
  punto), `Note` (nota al margen).

Helpers exportados: `COL`, `nf`, `pct`. Para una slide completa, componé dentro de
`SlideFrame` (da el fondo, el padding y el contexto que pinta las variantes oscuras).

## Setup — obligatorio

Los componentes NO traen colores ni fuentes propios: se estilan vía CSS custom
properties que define **`styles.css`**. **Siempre importá `styles.css`**; sin él los
gráficos salen con fuente del browser y colores rotos (los `var(--*)` no resuelven).
No hay provider ni context de React que envolver — alcanza con la hoja de estilos.

```jsx
import { LineChart, Bars, CountUp } from "@cdd/charts";
import "@cdd/charts/styles.css";
```

## Idioma de estilo — tokens, no clases

No hay clases utilitarias. Se estila de dos maneras, ambas con los mismos tokens:
1. **Prop `color`** de cada gráfico → pasale un token: `color="var(--severe)"`.
2. **Tu propio layout** (títulos, grilla, tarjetas) → estilizalo con los mismos
   `var(--*)` y las familias `--ff-*`. Nunca metas hex sueltos ni una fuente ajena.

Vocabulario real (definido en `styles.css`):

| Grupo | Tokens |
|---|---|
| Acentos | `--severe` `--severe-br` · `--slate` `--slate-br` · `--amber` · `--green` |
| Superficie | `--paper` `--paper-2` `--paper-3` · `--card` `--card-line` · `--hair` `--hair-2` |
| Tinta | `--ink` `--ink-2` · `--mute` `--mute-2` |
| Fuentes | `--ff-serif` (Newsreader, cifras/títulos) · `--ff-sans` (Archivo, cuerpo) · `--ff-mono` (IBM Plex Mono, ejes/labels) |

Convención: severe = severidad/riesgo; slate = volumen/neutro; cifras grandes en
`--ff-serif`; ejes y etiquetas en `--ff-mono`.

## Forma de los datos

- `LineChart` / `Columns` / `Bars`: prop `data` = array de filas; indicás las claves
  con `xKey`/`yKey` (line, columns) o `yKey`/`labelKey` (bars). `Columns`/`Bars`
  aceptan `rateKey` para superponer una tasa en `--severe`.
- `Heat`: `matrix` = `HeatCell[][]` (cada celda `{n, s}`), más `rows`/`cols`; `metric`
  `"rate"` (=s/n) o `"count"`.
- `Donut`: `segments` = `{v, color}[]`, `center` para el contenido del medio.

La verdad fina está en cada `<Name>.d.ts` (contrato de props) y `<Name>.prompt.md`,
y los tokens/fuentes en `styles.css`. Leé esos antes de estilar.

## Ejemplo idiomático

```jsx
import { CountUp, Bars, nf, pct } from "@cdd/charts";
import "@cdd/charts/styles.css";

function PanelArterias({ arterias }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--card-line)",
                  borderRadius: 13, padding: "22px 24px", fontFamily: "var(--ff-sans)" }}>
      <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".1em",
                    textTransform: "uppercase", color: "var(--mute)" }}>Top arterias</div>
      <div style={{ fontFamily: "var(--ff-serif)", fontSize: 44, color: "var(--severe)" }}>
        <CountUp value={1607} fmt={nf} />
      </div>
      <Bars data={arterias} yKey="n" labelKey="k" rateKey="rate" color="var(--severe)" />
    </div>
  );
}
```

Y una slide completa con las primitivas editoriales (componé siempre dentro de
`SlideFrame`; el énfasis del título va con `<em>`):

```jsx
import { SlideFrame, Eyebrow, SlideTitle, BarRow } from "@cdd/charts";
import "@cdd/charts/styles.css";

<SlideFrame tone="paper" width={1920} height={1080}
            foot={<><span>Siniestros Viales CABA</span><span>11 / 24</span></>}>
  <Eyebrow num="04" section="Aprendizaje no supervisado" />
  <SlideTitle>La gravedad no es un lugar: es un <em>perfil</em></SlideTitle>
  <div className="content">
    <div className="barlist">
      <BarRow label="Persona mayor 65+" fill={0.92} value="12,9%" color="var(--severe)" />
      <BarRow label="Vehicular leve" fill={0.14} value="2,0%" color="var(--green)" />
    </div>
  </div>
</SlideFrame>
```
