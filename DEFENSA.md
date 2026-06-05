# Preparación para la defensa — preguntas probables y respuestas

## Sobre el clasificador

**1. "¿Por qué el árbol abre por `victima = DESCONOCIDO`? ¿No es trampa?"**
Es el punto que nosotros mismos detectamos y declaramos: la *completitud del registro* depende de la gravedad (los casos graves se documentan completos; la edad falta en el 33% de los LEVE pero en <2% de los GRAVE/MORTAL). Por eso hicimos el **chequeo de robustez**: re-evaluamos el modelo solo sobre el 57% de casos con datos completos → ROC-AUC 0,74 (vs 0,83 global). Ese es el poder discriminante real, y está en el notebook, el informe y el slide de Limitaciones.

**2. "Con precisión 0,16, ¿sirve el modelo?"**
Es un **screening**: prioriza no perder casos severos (recall 0,73) a costa de falsos positivos. Para priorización de inspección o política pública, marcar de más es tolerable; para predicción puntual no sirve, y lo decimos. Además el modelo es explicativo/post-siniestro: su valor es identificar *factores* (peatón, 65+, madrugada, tipo de vía), no predecir antes del hecho.

**3. "¿Por qué k-means dentro de cada fold?"**
Si k-means se ajustara una sola vez con todo el dataset, la feature `zona` usaría información del fold de validación (leakage de validación). El transformer la ajusta solo con el train de cada fold y asigna el fold de validación con `predict`. La mejora es chica pero el protocolo queda limpio.

**4. "¿`n_victimas` no es el target disfrazado?"**
No — lo verificamos: un siniestro de 1 víctima es SEVERO el 5,4%; con 2-3 víctimas sube apenas a ~8-9%. El target es la lesión *más grave*, no el conteo. Lo que sí es target re-expresado (`gravedad_victima`, `numero_victimas_grave/leve/mortal`) está excluido explícitamente.

## Sobre la regresión

**5. "¿Por qué gana la regresión lineal y no Random Forest?"**
El target diario tiene tendencia creciente y los árboles **no extrapolan** fuera del rango visto en train (2021-2023). La lineal sí. Verificable en los R² sobre 2024: Lineal 0,385 > RF 0,313 > Árbol 0,241.

**6. "¿Qué es la feature `tendencia`? ¿No es hacer trampa con el tiempo?"**
Era la crítica justa — por eso la reemplazamos por su **mecanismo**: el tránsito real del mes (peajes). El modelo mejora (R² 0,397) y la "tendencia" queda explicada: es la recuperación del tránsito post-pandemia. +2,87 siniestros/día por cada millón de vehículos mensuales extra.

## Sobre la exposición (sección 7c)

**7. "¿El +35% de siniestros significa que manejar es más peligroso?"**
No: **dos tercios es exposición**. El tránsito creció +22% (peajes, único conteo continuo de la Ciudad) y la tasa por millón de vehículos solo +10% (68 → 75). El tránsito mensual y los siniestros se mueven juntos (r = 0,88). Sin normalizar por exposición la estadística engaña — ese es uno de los aportes del trabajo.

**8. "¿Los peajes de autopistas sirven como proxy del tránsito de toda la ciudad?"**
Es un supuesto declarado: asume co-movimiento entre el tránsito de autopistas y el de superficie. Es el único conteo vehicular *continuo* disponible (los radares AUSA cubren 4 autopistas con huecos y el Anillo Digital murió en 2022). La correlación r = 0,88 con los siniestros —que ocurren 98,6% fuera de autopistas— sugiere que el proxy funciona.

**9. "¿Cuál es la autopista más peligrosa?"**
Depende qué se mida. Por millón de vehículos, el corredor oeste (25 de Mayo + Perito Moreno: 0,55) quintuplica a la Illia (0,10). Pero la Illia tiene la **mayor severidad** (29% de sus siniestros son severos — velocidad). Caveat: el peaje cuenta pasadas por cabina, no vehículos-km; por eso comparamos el corredor combinado y no peajes sueltos.

**10. "¿Y las avenidas? ¿Rivadavia es la más peligrosa?"**
En crudo, Rivadavia lidera por cantidad. Normalizado por tránsito (sensores 2024), **sigue primera** (65 siniestros/millón en el punto medido) — su volumen no la explica del todo. En cambio Corrientes, top-5 en crudo, cae al último lugar normalizada (19/M): su ranking era tránsito. Caveat: el sensor mide un punto de la arteria; el índice es comparativo.

## Sobre los datos

**11. "¿Por qué descartaron el clima mensual y el flujo de radares?"**
Resultado negativo cuantificado: el clima mensual es casi constante dentro de cada mes (redundante con `mes`/estación) y agregarlo *empeora* el CV (-0,009); el flujo tiene 36-74% de NaN y el join espacial solo valdría para el 6% de los siniestros. Los reemplazamos por fuentes con la granularidad correcta (clima diario Meteostat, feriados, peajes). Documentar el descarte con números es parte del entregable.

**12. "¿La Comuna 1 es la más peligrosa?"**
Tiene la mayor tasa per cápita (458/100k, Censo 2022), pero la población *residente* no es la exposición real: al Microcentro entran cientos de miles de no-residentes por día. No existe dataset público de tránsito por comuna para normalizar mejor — la tasa por habitante es el estándar epidemiológico cuando no hay medida de exposición, y el caveat está declarado.

**13. "¿Dónde están los tests de hipótesis (χ², p-values)?"**
El entregable usa las herramientas de la materia: diferencias de proporciones, tablas de contingencia y correlación de Pearson. Las afirmaciones clave no dependen de un test puntual sino de **triangulación**: el hallazgo de lluvia se sostiene en tres granularidades y tres fuentes independientes (diaria Meteostat, horaria Open-Meteo, per-incidente AUSA).

**14. "¿Esto corre? ¿Lo puedo reproducir?"**
Sí: notebook de 90 celdas que corre de punta a punta en local (sin APIs en runtime — todos los datasets externos son archivos estáticos versionados), semillas fijas (`random_state=42`), protocolo de validación único. `python generar_informe.py` regenera el PDF.
