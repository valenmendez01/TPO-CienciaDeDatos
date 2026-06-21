# NOTES — sync de @cdd/charts a claude.ai/design

## Contexto
- El "design system" (`cdd-charts/`) es una **librería construida a propósito** para este
  sync, extraída del repo de la webapp — NO es un paquete preexistente. Fuente:
  - Gráficos ← `webapp/src/app/charts.jsx` (CountUp, LineChart, Columns, Bars, Heat, Donut).
  - Editorial ← CSS+markup del deck `webapp/src/defensa/index.html` (Eyebrow, SlideTitle,
    Stat, BarRow, Tag, Note, SlideFrame).
- Build de la librería: `npm --prefix cdd-charts run build` (tsup → `dist/index.mjs` + `dist/index.d.ts`).
  Está en `cfg.buildCmd`. Re-correrlo antes del converter si cambia el source.
- Converter: `--node-modules ./cdd-charts/node_modules --entry ./cdd-charts/dist/index.mjs`.

## Gotchas
- **Render check sin playwright**: no se instaló playwright/chromium (~200MB). Los previews
  se verificaron con **agent-browser** (el chromium que ya está en el entorno), sirviendo
  `ds-bundle` con `node .ds-sync/storybook/http-serve.mjs` y abriendo `.review.html`. `validate`
  se corrió con `--no-render-check`. En re-sync: instalar playwright, o re-verificar por navegador.
- **Fuentes [FONT_REMOTE]**: Archivo / Newsreader / IBM Plex Mono cargan por `@import` de Google
  Fonts dentro de `styles.css` (no se shipean `@font-face`). Aceptable. Si se quiere self-host,
  los TTF están en `tpo/fonts/` → cablear con `cfg.extraFonts`.
- **Escala de slide**: las primitivas editoriales usan tokens de tamaño grande (`--t-title:60px`,
  `--t-stat:120px`, etc.) pensados para lienzo 1920×1080. `SlideFrame` tiene override
  `{cardMode:single, viewport:"1920x1080"}` para que la card renderice a tamaño slide.

## Known render warns
- `[RENDER_SKIPPED]` es esperado mientras se use `--no-render-check` (ver gotcha de playwright).
- `[FONT_REMOTE]` "IBM Plex Mono" — esperado (fuentes por @import remoto).

## Re-sync risks
- Los datos de los previews (`.design-sync/previews/*.tsx`) son **números reales del TPO inlineados**,
  algunos aproximados (ej. siniestros por año). Son ilustrativos, no la fuente autoritativa —
  si cambian los datos del informe, los previews no se actualizan solos.
- La librería es una **extracción manual** de `charts.jsx` + el CSS del deck. Si esos cambian
  upstream (nuevos gráficos, cambios de tokens), hay que re-portarlos a `cdd-charts/src/` a mano;
  no hay sincronización automática webapp → librería.
- `cdd-charts/node_modules` y `cdd-charts/dist/` están gitignored: en un clone fresco hay que
  `npm --prefix cdd-charts install` y `npm --prefix cdd-charts run build` antes del converter.
