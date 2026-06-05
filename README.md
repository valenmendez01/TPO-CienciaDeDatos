# TPO Ciencia de Datos — Siniestros Viales CABA

Análisis de siniestros viales en CABA con foco en gravedad del siniestro, frecuencia diaria, factores de riesgo y validación de datasets externos.

## Estructura

- `siniestros_viales_pipeline.ipynb`: notebook principal reproducible.
- `datasets/`: datasets base del portal de datos abiertos de CABA.
- `datasets_externos/`: datasets estáticos complementarios usados por el notebook.
- `generar_informe.py`: script para regenerar el informe PDF a partir de los gráficos en `outputs/`.
- `informe_tpo.pdf`: informe final en PDF.
- `PLAN.md`: plan de trabajo, decisiones de integración y resultados por fase.
- `requirements.txt`: dependencias de Python.
- `NOTAS_QA_ANALISIS.md`: validaciones y advertencias metodológicas.
- `outputs/`: carpeta generada al correr el notebook; no se versiona.

## Entregables

- Notebook: `siniestros_viales_pipeline.ipynb` (80 celdas).
- Informe PDF: `informe_tpo.pdf`, regenerable con `python generar_informe.py` después de ejecutar el notebook.
- Presentación: Google Slides en Drive, carpeta "TPO Ciencia de Datos — Siniestros Viales CABA" (actualizable con `gws` CLI):  
  `https://docs.google.com/presentation/d/1x74N1XuflQ0JhJOylUInuEbnH7jKyY7YTv-ht4Ea2VQ`

## Cómo correrlo

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
