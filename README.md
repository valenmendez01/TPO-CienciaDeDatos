# TPO Ciencia de Datos — Siniestros Viales CABA

Análisis de siniestros viales en CABA con foco en gravedad del siniestro, frecuencia diaria, factores de riesgo y validación de datasets externos.

## Qué predice el trabajo

1. **Clasificación** (Clases 7-8): dado un siniestro ocurrido, ¿es LEVE o SEVERO (grave + mortal)? Modelo final: Random Forest + zona k-means — explicativo/screening post-siniestro.
2. **Regresión** (Clase 9): ¿cuántos siniestros va a haber por día en CABA? Regresión Lineal Múltiple, validada sobre 2024 (año nunca visto).
3. **Descriptivo** (Clase 10, no supervisado): zonas y perfiles de riesgo (k-means), esquinas peligrosas (DBSCAN), reglas de asociación (Apriori).

## Qué datasets se usan

| Dataset | Destino |
|---|---|
| Hechos (37.849, 2021-2024) | ✅ BASE — target `gravedad` |
| Víctimas | ✅ FEATURES — agregados por siniestro, la mejor señal del clasificador |
| Feriados (ArgentinaDatos) | ✅ FEATURES — driver #1 de la cantidad diaria |
| Clima diario (Meteostat) | ✅ FEATURES (regresión) + EDA |
| Censo 2022 + GeoJSON comunas | ✅ EDA — tasas per cápita y mapas |
| Clima horario (Open-Meteo) | ✅ VALIDACIÓN — ¿llovía en el momento exacto? |
| AUSA Seguridad Vial | ✅ VALIDACIÓN — superficie seca/mojada por incidente |
| Áreas de prioridad peatonal | ✅ EDA — gradiente velocidad → severidad |
| Peajes de autopistas (IDECBA) | ✅ NORMALIZACIÓN + FEATURE — descompone el +35% en exposición vs riesgo; reemplaza a `tendencia` en la regresión |
| Sensores de volumen (BA Data 2024) | ✅ NORMALIZACIÓN — arterias por millón de vehículos |
| Lluvia/temperatura mensual | ❌ DESCARTADO — redundante con `mes`/estación |
| Flujo AUSA y Anillo Digital | ❌ DESCARTADO — 36-74% NaN, cobertura insuficiente |

De los 6 datasets de la consigna, 4 no aportaban señal: se demostró con ablación por CV y se reemplazaron por fuentes con la granularidad correcta. El detalle está en la celda 1 del notebook.

## Estructura

- `siniestros_viales_pipeline.ipynb`: notebook principal reproducible.
- `datasets/`: datasets base del portal de datos abiertos de CABA.
- `datasets_externos/`: datasets estáticos complementarios usados por el notebook.
- `generar_informe.py`: script para regenerar el informe PDF a partir de los gráficos en `outputs/`.
- `informe_tpo.pdf`: informe final en PDF.
- `informe_assets/`: capturas estáticas de los mapas interactivos (folium genera HTML, no PNG) que usa el informe.
- `requirements.txt`: dependencias de Python.
- `NOTAS_QA_ANALISIS.md`: validaciones y advertencias metodológicas.
- `DEFENSA.md`: preguntas probables de la defensa con sus respuestas.
- `webapp/`: app web interactiva + deck de defensa (ver sección siguiente).
- `outputs/`: carpeta generada al correr el notebook; no se versiona.

## Entregables

- Notebook: `siniestros_viales_pipeline.ipynb`, corre end-to-end sin APIs externas.
- Informe PDF: `informe_tpo.pdf`, regenerable con `python generar_informe.py` después de ejecutar el notebook.
- Presentación: deck de defensa HTML en `webapp/` — https://siniestros-viales-caba.pages.dev/defensa/ (ver sección siguiente).

## Web interactiva y deck de defensa

- **App interactiva**: https://siniestros-viales-caba.pages.dev — 6 pestañas (Panorama · Explorar · Predecir · Mapa · Reglas · Modelos) con los datos reales preprocesados y dos predictores corriendo en vivo en el navegador. Botón "Ajustes" en el rail: tema Papel/Tinta, acento, densidad y animaciones.
- **Deck de defensa (HTML)**: https://siniestros-viales-caba.pages.dev/defensa/ — 24 slides navegables con ←/→, rail de miniaturas y notas del orador.

### Cómo editar

Todo vive en `webapp/`:

- `webapp/src/app/*.jsx` — las pestañas de la app (React sin imports, un archivo por pestaña) · `webapp/src/styles.css` — el sistema visual · `webapp/src/data/aggregates.js` — los agregados precomputados que alimentan todos los gráficos.
- `webapp/src/defensa/index.html` — el deck (slides como `<section>` dentro de `<deck-stage>`, notas del orador en `<script type="text/x-speaker-notes">`).

Para publicar cambios:

```bash
cd webapp
./build.sh    # compila JSX → public/ (necesita node; baja vendors la primera vez)
npx wrangler pages deploy public --project-name siniestros-viales-caba --branch main
```

El detalle de la estructura está en `webapp/README.md`.

## Cómo correrlo

### En Google Colab (sin instalar nada)

Abrir directamente:
https://colab.research.google.com/github/valenmendez01/TPO-CienciaDeDatos/blob/main/siniestros_viales_pipeline.ipynb

La primera celda de código clona el repo (datasets incluidos, ~12 MB) y todas las dependencias ya vienen preinstaladas en Colab. Ejecutar todo: `Entorno de ejecución → Ejecutar todas` (~15-20 min en CPU de Colab).

### Local

Usando el entorno compartido de la materia, desde esta carpeta:

```bash
source ../.venv/bin/activate
jupyter lab siniestros_viales_pipeline.ipynb
```

Si ese entorno no estuviera disponible, crear uno nuevo e instalar `requirements.txt`.

El notebook lee datos locales desde `datasets/` y `datasets_externos/`; no requiere llamadas a APIs durante la ejecución.

Para regenerar el informe:

```bash
python generar_informe.py
```

## Nota metodológica

El modelo de clasificación de gravedad es explicativo/post-siniestro, porque usa variables conocidas después del hecho. Para evitar leakage en artefactos reutilizables, el CSV exportado en `outputs/dataset_final_limpio.csv` excluye columnas que reexpresan directamente el target.
