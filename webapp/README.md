# Webapp — Siniestros Viales CABA

Una **única presentación interactiva** para defender el TPO:
**https://siniestros-viales-caba.pages.dev** (el root redirige a `/defensa/`).

El deck son slides `<section>` dentro de `<deck-stage>` (navegación ←/→, notas del
orador, export a PDF). Las slides de análisis no son estáticas: **embeben en vivo
los componentes React del trabajo**, que corren en el navegador leyendo de un
único `aggregates.js` (sin APIs, sin backend, sin duplicar gráficos):

- **Predecir gravedad** — modelo de lifts de Apriori en escala log-odds (≡ logística).
- **Predecir cantidad** — regresión lineal de siniestros/día, descompuesta.
- **Explorar EDA** — hora del día + día×franja, con lente Volumen / % Severo.
- **Perfiles** — scatter PCA de los 5 clusters k-means.
- **Reglas** — explorador de Apriori (slider de lift, consecuente Severo/Leve).
- **Mapa** — Leaflet en vivo: comunas (per cápita / % severo / volumen), hotspots
  DBSCAN, mapa de calor.

Origen del sistema visual: diseño en claude.ai/design. El predictor es
explicativo/screening, consistente con el informe (no ejecuta los `.pkl`).

## Estructura

- `src/` — fuentes: JSX (React por globals, sin imports), `index.html` (deck en
  `src/defensa/`), datos
- `src/app/*.jsx` — componentes React reusables (charts + tabs). Cada tab acepta
  `slide` para renderizarse a escala de slide dentro del deck (sin `PageHead`,
  layout de 2 columnas). El CSS embebido vive scopeado bajo `.app-embed` en el
  `<style>` del deck para no colisionar con las clases de las slides.
- `public/` — sitio estático compilado (lo que se deploya). `public/index.html`
  es un redirect a `defensa/`.
- `build.sh` — compila JSX→JS con esbuild, copia estáticos, genera el redirect y
  baja vendors pineados

## Build y deploy

```bash
./build.sh
npx wrangler pages deploy public --project-name siniestros-viales-caba --branch main
```

Los datos (`src/data/aggregates.js`) son agregados precomputados de los 37.849
siniestros — la app no carga el dataset crudo. El deck lee `../data`, `../app`,
`../vendor` (está servido en `/defensa/`).
