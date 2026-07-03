# Preparación para la defensa — preguntas probables y respuestas

## Sobre el clasificador

**1. "¿Por qué el árbol abre por `victima = DESCONOCIDO`? ¿No es trampa?"**
Ya no abre por ahí — lo sacamos. Es el punto que nosotros mismos detectamos: la *completitud del registro* es **consecuencia** de la gravedad (causalidad inversa `gravedad → completitud`; los casos graves se documentan completos, la edad falta en el 33% de los LEVE pero en <2% de los GRAVE/MORTAL). Usar `DESCONOCIDO` como predictor es por lo tanto **leakage de proceso**. Lo tratamos en tres capas:
- **Lo excluimos del modelo final**: el encoder descarta las dummies `*_DESCONOCIDO`, así que el árbol interpretable y la importancia del RF ahora abren por factores reales (`edad_media`, `pct_masculino`, `hay_peaton`, `hora`, `victima_PEATON`). Costo de sacarlo: ROC-AUC 0,826 → **0,811** (−0,015), recall SEVERO 0,71 → **0,65**. El modelo no vivía de la muleta.
- **Techo honesto**: re-evaluado solo sobre el 57% de casos con datos completos → ROC-AUC **0,73**. Esa es la estimación más conservadora del poder real, sobre la población donde el dato existe.
- **El baseline con flags (0,826) queda documentado como lo que rechazamos** — haber encontrado nosotros el atajo es la posición más fuerte.

Matiz honesto: sacar las dummies no purga del todo la completitud, porque los numéricos de víctima (`hay_peaton`, `edad_media`...) valen 0/NaN cuando la víctima es desconocida y siguen llevando la señal implícita. Por eso reportamos el 0,73 del subconjunto completo como piso, no el 0,811.

**2. "Con precisión 0,15, ¿sirve el modelo?"**
Es un **screening**: prioriza no perder casos severos (recall 0,67 con el umbral por defecto; 0,85 bajando el umbral a 0,36 para triage) a costa de falsos positivos. Para priorización de inspección o política pública, marcar de más es tolerable; para predicción puntual no sirve, y lo decimos. Además el modelo es explicativo/post-siniestro: su valor es identificar *factores* (peatón, 65+, madrugada, tipo de vía), no predecir antes del hecho.

**3. "¿Por qué k-means dentro de cada fold?"**
Si k-means se ajustara una sola vez con todo el dataset, la feature `zona` usaría información del fold de validación (leakage de validación). El transformer la ajusta solo con el train de cada fold y asigna el fold de validación con `predict`. La mejora es chica pero el protocolo queda limpio.

**4. "¿`n_victimas` no es el target disfrazado?"**
No — lo verificamos: un siniestro de 1 víctima es SEVERO el 5,4%; con 2-3 víctimas sube apenas a ~8-9%. El target es la lesión *más grave*, no el conteo. Lo que sí es target re-expresado (`gravedad_victima`, `numero_victimas_grave/leve/mortal`) está excluido explícitamente.

## Sobre la regresión

**5. "¿Por qué gana la regresión lineal y no Random Forest?"**
El target diario tiene tendencia creciente y los árboles **no extrapolan** fuera del rango visto en train (2021-2023). La lineal sí. Verificable en los R² sobre 2024: Lineal 0,385 > RF 0,313 > Árbol 0,241.

**6. "¿Qué es la feature `tendencia`? ¿No es hacer trampa con el tiempo?"**
Era la crítica justa — por eso la reemplazamos por su **mecanismo**: el tránsito real del mes (peajes). El modelo mejora (R² 0,397) y la "tendencia" queda explicada: es la recuperación del tránsito post-pandemia. +2,87 siniestros/día por cada millón de vehículos mensuales extra.

**6b. "¿R² 0,39 no es bajo?"**
El target es un conteo de eventos raros (~Poisson, media ~29/día en 2024): solo el ruido aleatorio pone un piso de error de √29 ≈ 5,4/día, o sea un **techo de R² ≈ 0,68** (varianza test ~89,8, piso Poisson ~28,9). Capturamos ~57% de lo explicable. Para el caso de uso alcanza: con error medio de ~6-7 se distingue un feriado tranquilo (~17) de un viernes cargado (~35), que es lo que necesita el SAME para dimensionar guardias. Predicción puntual exacta no — y lo decimos.

**6c. "¿El tránsito siempre crece año a año?"**
No. La serie de peajes 2014-2026 muestra que pre-pandemia estaba **planchado** (+1,5% anual 2014-2019, con 2017 y 2018 negativos). Lo que hay en la ventana de estudio es el **rebote post-pandemia, que ya se saturó**: 2024 dio 0,0% contra 2023 (quedando +11% sobre 2019). Por eso el reemplazo tendencia→tránsito es la decisión correcta: la tendencia extrapola para siempre; el tránsito sigue al mecanismo — si se aplana, el modelo se aplana con él. Matiz: los siniestros 2024 subieron +6,5% con tránsito plano → en 2024 subió la tasa por vehículo, no la exposición (coherente con la descomposición 2/3-1/3 de §7c).

**6d. "¿La temperatura aporta algo a la regresión?"**
No — verificado por ablación sobre el protocolo exacto del notebook: sin `tavg`/`tmax` el R² sobre 2024 da **0,392 vs 0,385** del modelo completo (RMSE 7,39 vs 7,43). La estacionalidad ya está capturada por las dummies de `mes`. Además `tavg`~`tmax` correlacionan **0,93** y sus coeficientes salen con signos opuestos (+0,08/−0,11): se cancelan — el síntoma clásico de multicolinealidad, tolerado porque solo importa su efecto conjunto (~nulo) y no son titulares del análisis. Se deja documentada, mismo criterio que el clima mensual en el clasificador.

**6e. "¿No es redundante tener `llovio` y `prcp` a la vez?"**
No: son **el salto y la dosis**. `llovio` captura el cambio de comportamiento por el hecho de llover (−1,7 aunque sea garúa — la mediana del día de lluvia es 3 mm); `prcp` cuánto se profundiza con la intensidad (−0,036/mm). Correlación entre ambas: **0,34** — el escalón no es función lineal de los milímetros (la colinealidad que rompe una regresión es la *lineal*). Juntas reproducen el hallazgo del EDA: −8% con lluvia común, −21% con >20 mm.

**6f. "¿Por qué el test es 2024 entero y no un 80/20 aleatorio?"**
El split debe imitar el uso real: predecir días **futuros**. Con 80/20 aleatorio, para predecir el 15/03/2024 el modelo entrenó con el 14 y el 16 — por la autocorrelación de la serie "ve" el nivel del período que dice predecir y las métricas salen infladas (leakage temporal). Además escondería la incapacidad de extrapolar de los árboles (con días de 2024 en el train parecerían competitivos) y se elegiría el modelo equivocado. El split temporal es exactamente lo que reveló esa diferencia. Para el clasificador, en cambio, el 80/20 aleatorio estratificado es correcto: cada siniestro es un caso independiente, sin flecha temporal en la pregunta.

## Sobre la exposición (sección 7c)

**7. "¿El +35% de siniestros significa que manejar es más peligroso?"**
No: **dos tercios es exposición**. El tránsito creció +22% (peajes, único conteo continuo de la Ciudad) y la tasa por millón de vehículos solo +10% (68 → 75). El tránsito mensual y los siniestros se mueven juntos (r = 0,88). Sin normalizar por exposición la estadística engaña — ese es uno de los aportes del trabajo.

**8. "¿Los peajes de autopistas sirven como proxy del tránsito de toda la ciudad?"**
Es un supuesto declarado: asume co-movimiento entre el tránsito de autopistas y el de superficie. Es el único conteo vehicular *continuo* disponible (los radares AUSA cubren 4 autopistas con huecos y el Anillo Digital murió en 2022). La correlación r = 0,88 con los siniestros —que ocurren 98,6% fuera de autopistas— sugiere que el proxy funciona.

**9. "¿Cuál es la autopista más peligrosa?"**
Depende qué se mida. Por millón de vehículos, el corredor oeste (25 de Mayo + Perito Moreno: 0,55) quintuplica a la Illia (0,10). Pero la Illia tiene la **mayor severidad**. Caveat: el peaje cuenta pasadas por cabina, no vehículos-km; por eso comparamos el corredor combinado y no peajes sueltos.

**9b. "¿Por qué la Illia tiene los siniestros más graves? ¿No son muy pocos casos?"**
Son pocos (17 atribuibles, 5 severos) y lo declaramos: es una señal cualitativa, no una estadística. Pero la señal es consistente en tres frentes: (1) **los 5 severos son todos MORTALES** — ni un "grave"; a alta velocidad el resultado es binario; (2) **dos son contra OBJETO FIJO de noche/madrugada** — el choque clásico de velocidad en flujo libre; (3) la Illia es la **autopista más nocturna** del sistema (41% de sus siniestros vs ~16% en 25 de Mayo/Perito Moreno) — de noche, vacía, la velocidad real es máxima. El contraste con la 25 de Mayo cierra el mecanismo: congestionada, 4× más siniestros por vehículo pero más leves (choques de tráfico a baja velocidad).

**9c. "¿Y si el dataset simplemente pierde siniestros de la Illia?"**
Pierde, sí — y lo validamos: ~la mitad de los siniestros de autopista no nombra cuál (dirección vacía o "AU." genérica), así que los conteos por autopista son un piso. Pero el faltante afecta a todas las autopistas por igual, y el **registro completo de AUSA** (que incluye incidentes sin víctimas) confirma el patrón de forma independiente: Illia 202 incidentes vs 917 de la 25 de Mayo en 2022-2025 — ~4,5× menos. "Pocos choques en la Illia" es real, no un artefacto.

**10. "¿Y las avenidas? ¿Rivadavia es la más peligrosa?"**
En crudo, Rivadavia lidera por cantidad. Normalizado por tránsito (sensores 2024), **sigue primera** (65 siniestros/millón en el punto medido) — su volumen no la explica del todo. En cambio Corrientes, top-5 en crudo, cae al último lugar normalizada (19/M): su ranking era tránsito. Caveat: el sensor mide un punto de la arteria; el índice es comparativo.

## Sobre los datos

**11. "¿Por qué descartaron el clima mensual y el flujo de radares?"**
Resultado negativo cuantificado: el clima mensual es casi constante dentro de cada mes — un solo valor compartido por todos los siniestros del mes, redundante con `mes`/estación; el flujo tiene 36-74% de NaN y el join espacial solo valdría para el 6% de los siniestros. Los reemplazamos por fuentes con la granularidad correcta (clima diario Meteostat, feriados, peajes). Documentar el descarte con números es parte del entregable.

**12. "¿La Comuna 1 es la más peligrosa?"**
Tiene la mayor tasa per cápita (458/100k, Censo 2022), pero la población *residente* no es la exposición real: al Microcentro entran cientos de miles de no-residentes por día. No existe dataset público de tránsito por comuna para normalizar mejor — la tasa por habitante es el estándar epidemiológico cuando no hay medida de exposición, y el caveat está declarado.

**13. "¿Dónde están los tests de hipótesis (χ², p-values)?"**
El entregable usa las herramientas de la materia: diferencias de proporciones, tablas de contingencia y correlación de Pearson. Las afirmaciones clave no dependen de un test puntual sino de **triangulación**: el hallazgo de lluvia se sostiene en tres granularidades y tres fuentes independientes (diaria Meteostat, horaria Open-Meteo, per-incidente AUSA).

**14. "¿Dónde usaron one-hot encoding?"**
En cuatro lugares, cada uno por su motivo: (1) **Clasificador**: `OneHotEncoder(handle_unknown='ignore')` sobre las categóricas (`franja_horaria`, `estacion`, `tipo_de_calle`, `victima`, `acusado`) — RF y la logística no procesan texto, y el `handle_unknown` evita que una categoría nueva en test rompa el pipeline; (2) la **zona k-means** (`Z0`…`Z7`) entra al mismo encoder — es categórica, sin one-hot el modelo le inventaría un orden; (3) **Regresión**: `pd.get_dummies(..., drop_first=True)` para día de semana y mes — el `drop_first` evita multicolinealidad perfecta en el modelo lineal; (4) **Apriori**: el `TransactionEncoder` es literalmente una matriz one-hot de ítems. Y donde deliberadamente **NO**: en el k-means de perfiles usamos flags curados (`hay_moto`, `hay_peaton`, `hay_mayor`) en vez de one-hotear `victima`/`acusado` enteros — 20+ dimensiones binarias concentran las distancias euclídeas (maldición de la dimensionalidad) y los clusters dejan de ser interpretables.

**15. "¿Dónde y cómo usan Apriori?"**
Sección 10e. Cada siniestro se convierte en una "canasta" de ítems: `franja=MADRUGADA`, `calle=AVENIDA`, `vict=PEATON`, `acus=AUTO`, `FINDE`/`SEMANA`, más la etiqueta `LEVE`/`SEVERO`. `TransactionEncoder` lo pasa a matriz one-hot, `apriori` (soporte mínimo 1%) encuentra los itemsets frecuentes y `association_rules` genera reglas filtradas por lift ≥ 1,2 **con consecuente exactamente {SEVERO}** (excluyendo antecedentes que contengan la gravedad, para no generar tautologías). La lectura del lift: cuántas veces multiplica esa combinación la probabilidad base de severo (5,7%). Top reglas: **peatón ×2,1** (y peatón-en-avenida ×2,2), **madrugada ×2,2**, moto ×1,37, finde ×1,26. El valor sobre el clasificador: las reglas son directamente accionables y explicables — "un peatón atropellado en avenida tiene el doble de chances de terminar grave" no necesita modelo para comunicarse.

**16. "¿Esto corre? ¿Lo puedo reproducir?"**
Sí: notebook que corre de punta a punta en local (sin APIs en runtime — todos los datasets externos son archivos estáticos versionados), semillas fijas (`random_state=42`), protocolo de validación único. `python generar_informe.py` regenera el PDF.
