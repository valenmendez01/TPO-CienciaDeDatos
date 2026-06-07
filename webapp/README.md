# Webapp — Siniestros Viales CABA

App interactiva para presentar/defender el TPO: **https://siniestros-viales-caba.pages.dev**

Seis pestañas: Panorama · Explorar · Predecir (predictores en vivo) · Mapa (Leaflet) ·
Reglas (Apriori) · Modelos. Botón **Ajustes** en el rail: tema Papel/Tinta, acento,
densidad y animaciones (persisten en localStorage).

El **deck de defensa** (22 slides, navegación ←/→, notas del orador) se sirve en
**https://siniestros-viales-caba.pages.dev/defensa/** — fuente en `src/defensa/index.html`
(slides como `<section>` dentro de `<deck-stage>`).

Origen: diseño hecho en claude.ai/design e implementado desde el handoff bundle.
El predictor de gravedad corre 100% en el navegador (lifts de Apriori en escala
log-odds ≡ logística); el de cantidad es la regresión lineal anclada en los
promedios reales. No ejecuta los `.pkl` — es explicativo/screening, consistente
con el informe.

## Estructura

- `src/` — fuentes: JSX (React por globals, sin imports), `styles.css`, `index.html`, datos
- `public/` — sitio estático compilado (lo que se deploya)
- `build.sh` — compila JSX→JS con esbuild, copia estáticos y baja vendors pineados

## Build y deploy

```bash
./build.sh
npx wrangler pages deploy public --project-name siniestros-viales-caba --branch main
```

Los datos (`src/data/aggregates.js`, 126 KB) son agregados precomputados de los
37.849 siniestros — la app no carga el dataset crudo.
