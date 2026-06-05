# Genera informe_tpo.pdf — Informe del TPO Siniestros Viales CABA
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                                Image, Table, TableStyle, KeepTogether)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from PIL import Image as PILImage
import os

OUT = 'outputs'
doc = SimpleDocTemplate('informe_tpo.pdf', pagesize=A4,
                        topMargin=2*cm, bottomMargin=2*cm, leftMargin=2.2*cm, rightMargin=2.2*cm,
                        title='Análisis y Clasificación de Gravedad de Siniestros Viales — CABA',
                        author='TPO Ciencia de Datos — UADE 2026')

ss = getSampleStyleSheet()
H1 = ParagraphStyle('H1x', parent=ss['Heading1'], fontSize=16, spaceBefore=18, spaceAfter=8,
                    textColor=colors.HexColor('#1a3a5c'))
H2 = ParagraphStyle('H2x', parent=ss['Heading2'], fontSize=13, spaceBefore=12, spaceAfter=6,
                    textColor=colors.HexColor('#2c5f8a'))
P  = ParagraphStyle('Px', parent=ss['Normal'], fontSize=10, leading=14, spaceAfter=6)
PC = ParagraphStyle('PCx', parent=P, fontSize=8.5, textColor=colors.HexColor('#555555'),
                    spaceBefore=2, spaceAfter=12)
TIT = ParagraphStyle('TITx', parent=ss['Title'], fontSize=22, leading=28)
SUB = ParagraphStyle('SUBx', parent=ss['Normal'], fontSize=12, alignment=1, textColor=colors.HexColor('#444444'))

def img(path, width=15.5*cm, caption=None):
    el = []
    p = os.path.join(OUT, path)
    w, h = PILImage.open(p).size
    el.append(Image(p, width=width, height=width*h/w))
    if caption:
        cap = ParagraphStyle('cap', parent=PC, alignment=1)
        el.append(Paragraph(caption, cap))
    return [KeepTogether(el)]

def tabla(data, col_widths=None, font=8.5):
    t = Table(data, colWidths=col_widths, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a3a5c')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTSIZE', (0, 0), (-1, -1), font),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f2f6fa')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t

S = []

# ───────────────────────── PORTADA ─────────────────────────
S.append(Spacer(1, 4*cm))
S.append(Paragraph('Análisis y Clasificación de Gravedad de<br/>Siniestros Viales — CABA', TIT))
S.append(Spacer(1, 0.8*cm))
S.append(Paragraph('Pipeline completo: ingesta → limpieza → integración → EDA → modelado', SUB))
S.append(Spacer(1, 2.5*cm))
S.append(Paragraph('<b>Materia:</b> Ciencia de Datos (3.4.217) — UADE', SUB))
S.append(Paragraph('<b>Docente:</b> Santiago Gabriel Martín', SUB))
S.append(Paragraph('<b>1er cuatrimestre 2026</b> · Junio 2026', SUB))
S.append(Spacer(1, 2*cm))
S.append(Paragraph('Datos: 37.849 siniestros viales en CABA (2021-2024), data.buenosaires.gob.ar · '
                   'INDEC Censo 2022 · Meteostat · ArgentinaDatos', SUB))
S.append(PageBreak())

# ───────────────────────── RESUMEN EJECUTIVO ─────────────────────────
S.append(Paragraph('1. Resumen ejecutivo', H1))
S.append(Paragraph(
    'Construimos un pipeline reproducible que clasifica y explica la <b>gravedad</b> de un siniestro vial '
    '(LEVE vs SEVERO = grave + mortal) y la <b>cantidad diaria</b> de siniestros en CABA, sobre '
    '37.849 hechos del período 2021-2024. El proceso evaluó cuantitativamente qué datasets externos '
    'aportan señal, descartó con evidencia los que no (clima mensual, flujo vehicular), y los '
    'reemplazó por fuentes con la granularidad correcta (clima diario, feriados, agregados de víctimas). '
    'El trabajo sigue las etapas del proceso <b>KDD / CRISP-DM</b>: selección y limpieza de datos, '
    'transformación (feature engineering), minería de datos y evaluación de patrones.', P))
S.append(Paragraph('Resultados principales:', P))
S.append(Paragraph(
    '• <b>Modelo final de clasificación:</b> Random Forest + zona geográfica de k-means como variable '
    'sintética — detecta el <b>72% de los siniestros severos</b> (recall CV 0,72; ROC-AUC 0,83), el mejor '
    'F1-Score de la comparación.<br/>'
    '• <b>El "+35% de siniestros 2021-2024" es en dos tercios un efecto del tránsito:</b> los vehículos '
    'crecieron +22% (peajes) y la tasa por millón de vehículos solo +10% (68 → 75). El tránsito mensual y '
    'los siniestros se mueven juntos (r = 0,88) — sin normalizar por exposición, la estadística engaña.<br/>'
    '• <b>La lluvia reduce la frecuencia de siniestros (-8%; -21% con lluvia fuerte) pero NO aumenta '
    'la gravedad</b> del siniestro individual — validado por 3 vías independientes.<br/>'
    '• <b>La severidad no es un lugar, es un perfil:</b> geográficamente es homogénea (4,7-5,6%), '
    'pero entre tipos de siniestro varía 6× (peatón mayor 12,9% vs choque vehicular leve 2,0%).<br/>'
    '• <b>El gradiente de velocidad de la vía ordena la severidad de punta a punta:</b> '
    'zona peatonal 20 km/h 3,4% → calle 3,8% → avenida 5,4% → autopista 14,1%.<br/>'
    '• <b>El feriado es el driver más fuerte de la cantidad diaria</b> (-9,6 siniestros/día), '
    'más que cualquier variable climática.', P))
S.append(Spacer(1, 0.3*cm))

S.append(Paragraph('2. Datos y evaluación de integración', H1))
S.append(Paragraph(
    'Partimos de 6 datasets del portal de datos abiertos de CABA. Antes de integrar, definimos un '
    'criterio: un dataset externo se incorpora solo si (a) comparte clave a granularidad útil, '
    '(b) aporta señal medible contra el target, y (c) cubre el período de estudio. El veredicto:', P))
S.append(tabla([
    ['Dataset', 'Veredicto', 'Evidencia'],
    ['Hechos (37.849, 2021-24)', 'BASE', 'un registro por siniestro, target gravedad'],
    ['Víctimas (43.255)', 'INTEGRAR', 'join 1:1 perfecto por id; hay_peaton es el mejor predictor'],
    ['Lluvia/temp MENSUAL', 'DESCARTAR', 'casi constante por mes; agregarla EMPEORA el CV (-0,009)'],
    ['Flujo AUSA (radares)', 'DESCARTAR', '36% NaN; solo autopistas; sin 2021 ni mar-sep 2022'],
    ['Flujo Anillo Digital', 'DESCARTAR', '74% NaN (termina feb 2022); 6-9 sensores'],
    ['Clima DIARIO (Meteostat)', 'AGREGAR', '1461/1461 días; variación real entre siniestros'],
    ['Feriados (ArgentinaDatos)', 'AGREGAR', 'driver #1 de la cantidad diaria'],
    ['Población (Censo 2022)', 'AGREGAR', 'tasas por habitante por comuna'],
    ['Seguridad Vial AUSA', 'VALIDACIÓN', 'superficie seca/mojada por incidente (no mergeable)'],
    ['Peajes autopistas (IDECBA)', 'AGREGAR', 'único conteo vehicular continuo: normaliza por exposición'],
    ['Sensores de volumen (2024)', 'AGREGAR', '95 puntos en avenidas: normaliza el ranking de arterias'],
], col_widths=[4.6*cm, 2.6*cm, 8.9*cm]))
S.append(Spacer(1, 0.2*cm))
S.append(Paragraph(
    'La decisión metodológica clave fue probar que <b>el clima mensual y el flujo vehicular no aportan</b>: '
    'sus valores son casi constantes dentro de cada mes (redundantes con la estación) y el join espacial '
    'del flujo solo sería válido para el 6% de los siniestros. Documentar este resultado negativo con '
    'números es parte del valor del trabajo.', P))
S.append(PageBreak())

# ───────────────────────── EDA ─────────────────────────
S.append(Paragraph('3. Análisis exploratorio', H1))

S.append(Paragraph('3.1 Panorama general: cuántos, cuándo, quiénes', H2))
S.append(Paragraph(
    '37.849 siniestros en 2021-2024 (25,9 por día), 5,7% severos. La hora pico de siniestros sigue '
    'la hora pico de tránsito; la víctima más frecuente es por lejos la <b>moto</b>, seguida del peatón, '
    'y la contraparte más frecuente es el auto.', P))
S += img('estadisticas_generales.png',
         caption='Panorama: siniestros por año, por hora del día, víctima y contraparte más frecuentes.')
S.append(PageBreak())

S.append(Paragraph('3.2 Evolución temporal y tasas por comuna', H2))
S += img('serie_temporal_siniestros.png',
         caption='Crecimiento sostenido post-pandemia: +35,2% entre 2021 (7.819) y 2024 (10.569).')
S += img('mapa_tasas_comunas.png', width=13.5*cm,
         caption='Tasa anual de siniestros cada 100.000 habitantes (Censo 2022). '
                 'Máximo: Comuna 1 (458,5); mínimo: Comuna 6 (195,4) — 2,3× de diferencia.')
S += img('top_arterias.png', width=13.5*cm,
         caption='Top 10 arterias por cantidad de siniestros. Concentración, no riesgo por vehículo: sin datos '
                 'de flujo no se puede normalizar por exposición.')
S.append(PageBreak())

S.append(Paragraph('3.3 ¿Más siniestros porque hay más tránsito? Sí, en dos tercios', H2))
S.append(Paragraph(
    'Los siniestros crecieron +35% entre 2021 y 2024. ¿Empeoró la seguridad vial o solo volvió el '
    'tránsito post-pandemia? Con el único conteo vehicular continuo de la Ciudad (peajes de autopistas, '
    'IDECBA) como proxy de exposición: el tránsito mensual y los siniestros mensuales se mueven juntos '
    '(<b>r = 0,88</b>), el tránsito creció <b>+22%</b> y la tasa de siniestros por millón de vehículos '
    'solo <b>+10%</b> (68 → 75). Es decir: <b>dos tercios del aumento es exposición</b> (más autos en la '
    'calle), un tercio es deterioro real. Con los peajes, además, la tasa por autopista: el corredor '
    'oeste (25 de Mayo + Perito Moreno, 0,55 siniestros por millón de vehículos) duplica a la Illia '
    '(0,10). Y con los sensores de volumen 2024 (95 puntos), el ranking de arterias normalizado: '
    'parte de las "avenidas peligrosas" simplemente llevan más tránsito.', P))
S += img('transito_vs_siniestros.png',
         caption='Izq: tránsito (peajes) y siniestros mensuales 2021-2024 se mueven juntos. '
                 'Der: cada punto es un mes — la relación es lineal y estable entre años.')
S += img('arterias_normalizadas.png',
         caption='El ranking de arterias cambia al normalizar por tránsito (sensores 2024, punto medido). '
                 'Índice comparativo: el sensor mide un punto, no toda la extensión de la arteria.')
S.append(PageBreak())

S.append(Paragraph('3.4 ¿Los días de lluvia tienen más siniestros? No: tienen menos', H2))
S.append(Paragraph(
    'Los días con lluvia registran <b>-8% de siniestros</b> (24,5 vs 26,6 por día) y el efecto '
    'es dosis-dependiente: con más de 20 mm caen <b>-21%</b>. La composición de víctimas casi no cambia '
    '(es una reducción general de exposición: circula menos gente) y la gravedad del siniestro individual '
    'tampoco (5,7% vs 5,9% SEVERO). El resultado se sostiene en <b>tres granularidades y tres fuentes</b>: '
    'a nivel diario (Meteostat), a nivel <b>horario</b> — ¿llovía en el momento exacto del siniestro? '
    '(Open-Meteo: frecuencia -4,9%, gravedad sin diferencia) — y en los registros per-incidente de AUSA, donde '
    'la superficie MOJADA muestra <b>menos</b> lesividad que la SECA (27,8% vs 39,1% con víctimas).', P))
S += img('lluvia_vs_siniestros.png',
         caption='Izq: siniestros/día por intensidad de lluvia. Der: dispersión precipitación vs cantidad diaria.')

S.append(Paragraph('3.5 Combinaciones de variables', H2))
S += img('combinaciones_cuando.png',
         caption='El CUÁNDO: la madrugada de fin de semana concentra la severidad (12,1% vs 5,5%); '
                 'la noche domina y la lluvia nocturna suma poco (+0,6 pp).')
S += img('combinaciones_quien_via.png',
         caption='El QUIÉN y la VÍA: la lluvia baja la frecuencia en todos los tipos de vía (no castiga más '
                 'a las autopistas); la banda crítica de severidad es 65+ (fragilidad), no los jóvenes.')
S.append(PageBreak())

S.append(Paragraph('3.6 El gradiente velocidad → severidad', H2))
S.append(Paragraph(
    'No existe dataset público de velocidad medida; en CABA el límite legal lo fija el tipo de vía. '
    'Sumando las áreas de prioridad peatonal (20 km/h) el gradiente queda completo y monotónico — '
    'la mejor evidencia disponible del mecanismo velocidad → gravedad:', P))
S += img('gradiente_velocidad_severidad.png', width=12.5*cm,
         caption='Zona 20 km/h: 3,4% · Calle (40): 3,8% · Avenida (60): 5,4% · Autopista (80+): 14,1% SEVERO.')

S.append(Paragraph('3.7 Edad × fin de semana', H2))
S.append(Paragraph(
    'Los jóvenes (18-29) pasan del 28,8% de las víctimas entre semana al <b>33,5% el fin de semana</b>. '
    'En la madrugada de finde la mediana baja a 31 años y el 43,9% de los siniestros tiene '
    'víctimas menores de 30. El perfil de riesgo completo: <b>jóvenes + madrugada + finde = 2× frecuencia '
    'y 2× severidad</b>. Matiz importante: la severidad individual por edad la dominan los mayores de 65 '
    '(12% SEVERO — fragilidad), no los jóvenes (7,2%, promedio). Exposición y vulnerabilidad son '
    'mecanismos distintos.', P))
S += img('edad_x_finde.png',
         caption='Composición etaria semana vs finde, y % de siniestros con víctimas jóvenes por franja horaria.')
S.append(PageBreak())

# ───────────────────────── MODELOS ─────────────────────────
S.append(Paragraph('4. Modelado', H1))

S.append(Paragraph('4.1 Clasificación de gravedad (Árbol de Decisión, Random Forest, Regresión Logística)', H2))
S.append(Paragraph(
    'Problema de <b>aprendizaje supervisado — clasificación</b>. El target original (LEVE 94% / GRAVE 4,6% / '
    'MORTAL 1,1%) es inviable con 3 clases; lo reagrupamos en LEVE vs SEVERO. Con un dataset tan '
    'desbalanceado la <i>accuracy</i> engaña (predecir siempre LEVE "acierta" el 94%), así que evaluamos con '
    'matriz de confusión, precision, recall, F1-Score y ROC-AUC, ponderando las clases con '
    'class_weight=balanced. Comparación bajo el mismo protocolo (validación cruzada estratificada de '
    '5 particiones):', P))
S.append(tabla([
    ['Modelo', 'Accuracy', 'Precision SEV.', 'Recall SEV.', 'F1 SEV.', 'ROC-AUC'],
    ['Árbol de decisión d=4 (interpretable)', '0,486', '0,094', '0,92', '0,171', '0,761'],
    ['Árbol de decisión d=7', '0,602', '0,110', '0,83', '0,194', '0,787'],
    ['Regresión Logística', '0,712', '0,136', '0,75', '0,230', '0,814'],
    ['Random Forest (n=300, d=10)', '0,753', '0,151', '0,72', '0,250', '0,828'],
    ['RF + zona k-means (FINAL)', '0,763', '0,157', '0,72', '0,257', '0,833'],
], col_widths=[6.2*cm, 1.9*cm, 2.5*cm, 2.1*cm, 1.7*cm, 1.8*cm]))
S.append(Spacer(1, 0.2*cm))
S.append(Paragraph(
    'Los árboles usan el <b>índice de Gini</b> como criterio de impureza, con profundidad y hojas mínimas '
    'limitadas como <b>poda preventiva</b> contra el sobreajuste. La mejora final viene de combinar '
    '<b>técnicas</b>: la zona geográfica de k-means se ajusta dentro de cada fold de validación y se usa '
    'como <b>variable sintética</b> del Random Forest. El árbol de profundidad 4 se conserva como modelo '
    'interpretable de screening (recall 0,92: detecta casi todos los severos, a costa de falsos positivos).', P))
S += img('modelo_final_rf.png',
         caption='Modelo final Random Forest + zona: matriz de confusión y curva ROC (test 20%, recall SEVERO 0,73).')
S += img('arbol_decision.png',
         caption='Árbol de Decisión interpretable (criterio Gini, primeros 3 niveles): reglas si-entonces legibles.')
S.append(PageBreak())

S.append(Paragraph('4.2 Regresión: cantidad diaria de siniestros', H2))
S.append(Paragraph(
    'Problema de <b>regresión</b> (target numérico), evaluado con MSE, RMSE, MAE y R². '
    'Validación con split temporal honesto: entrenamiento 2021-2023, test 2024 (un año nunca visto). '
    'Gana la <b>Regresión Lineal Múltiple con dummies</b> (RMSE 7,43 · MAE 5,84 · R² 0,385) sobre el '
    'Árbol de Regresión (R² 0,241) y Random Forest (R² 0,313) — los árboles no extrapolan la tendencia '
    'creciente. Y un paso más de interpretación: reemplazar la feature abstracta `tendencia` por el '
    '<b>tránsito real del mes</b> (peajes) mejora el modelo a <b>R² 0,397</b> — la "tendencia creciente" '
    'queda explicada por su mecanismo, la recuperación del tránsito. Coeficientes interpretables: '
    '<b>feriado -9,6 siniestros/día</b> (el efecto más fuerte), fin de semana -5,3, día de lluvia -1,7 '
    '(-0,036 por mm), tendencia +2,9/año.', P))
S += img('regresion_diaria.png',
         caption='Predicción vs real sobre 2024 (media móvil 7 días): el modelo lineal captura tendencia y estacionalidad semanal.')

S.append(Paragraph('4.3 Aprendizaje no supervisado', H2))
S.append(Paragraph(
    '<b>K-means de perfiles</b> (k=5, elegido con el método del codo): la severidad varía 6× entre tipos de siniestro — '
    'peatón mayor (73 años, 12,9% SEVERO) &gt; peatón adulto (10,3%) &gt; moto laboral (7,0%) &gt; '
    'finde joven (6,3%) &gt; vehicular leve (2,0%). En contraste, el k-means geográfico muestra severidad '
    'casi pareja entre zonas (spread 0,9 pp): <b>el riesgo de gravedad no es un lugar, es un tipo de siniestro</b>.', P))
S += img('perfiles_siniestro.png', width=13.5*cm,
         caption='% SEVERO por perfil de siniestro (k-means k=5) vs promedio global.')
S.append(PageBreak())

S.append(Paragraph(
    '<b>DBSCAN</b> (eps=60 m) encuentra 29 micro-hotspots que concentran el 4,6% de los siniestros — '
    'el "top de esquinas peligrosas": el mayor acumula 153 siniestros en un solo punto (accesos de '
    'Av. Gral. Paz, Comuna 12) y uno combina 76 siniestros con 11,8% de severidad. '
    '<b>PCA</b>: se necesitan 7 de 8 componentes para el 80% de la varianza — las features son casi '
    'ortogonales y no conviene reducir dimensionalidad. <b>Apriori</b>: las reglas hacia SEVERO '
    'cuantifican los factores de riesgo: PEATÓN ×2,1 (×2,2 en avenida), MADRUGADA ×2,2, MOTO ×1,4, '
    'FINDE ×1,3.', P))
S += img('mapa_hotspots.png', width=13.5*cm,
         caption='Micro-hotspots DBSCAN (rojo = severidad sobre el promedio; tamaño = cantidad de siniestros).')

# ───────────────────────── CONCLUSIONES ─────────────────────────
S.append(Paragraph('5. Conclusiones', H1))
S.append(Paragraph(
    '<b>1.</b> La señal de gravedad está en el <i>quién</i> y el <i>cuándo</i> (peatón, moto, mayores de 65, '
    'madrugada de finde, tipo de vía) — no en el contexto ambiental ni en el lugar exacto.<br/>'
    '<b>2.</b> El crecimiento de siniestros es ante todo <i>exposición</i>: dos tercios del +35% lo explica '
    'el tránsito (+22%); la tasa por vehículo subió +10%. La regresión lo confirma: el tránsito mensual '
    'reemplaza y supera a la tendencia abstracta.<br/>'
    '<b>3.</b> La lluvia es un factor de <i>frecuencia</i> (menos exposición → menos siniestros), no de '
    '<i>gravedad</i>. Confirmado por el clasificador, el EDA diario y los registros per-incidente de AUSA.<br/>'
    '<b>4.</b> La velocidad de la vía es el factor estructural de severidad más claro: el gradiente '
    '20→40→60→80+ km/h multiplica por 4 el porcentaje de siniestros severos.<br/>'
    '<b>5.</b> Para política pública: proteger peatones en avenidas, controles en madrugadas de fin de '
    'semana, atención a mayores de 65, e intervenciones puntuales en los hotspots identificados.<br/>'
    '<b>6.</b> Metodológicamente: evaluar la integración <i>antes</i> de integrarla evitó arrastrar ruido; '
    'reagrupar el target fue la mejora más barata; y combinar técnicas (la zona de k-means como variable '
    'sintética del Random Forest) dio el mejor modelo de la comparación.', P))

S.append(Paragraph('Limitaciones', H2))
S.append(Paragraph(
    '• <b>Sesgo de registro (detectado y medido):</b> los siniestros graves se documentan completos, '
    'muchos leves quedan con placeholders — la edad falta en el 33% de los LEVE pero en menos del 2% de '
    'los GRAVE/MORTAL, y "víctima desconocida" es LEVE el 99,8% de las veces. El modelo aprovecha en parte '
    'ese atajo. Chequeo de robustez sobre el 57% de casos con datos completos (tasa SEVERO 9,9%): '
    'ROC-AUC 0,74 (vs 0,83 global), recall 0,52, F1 0,33 — el poder discriminante real, declarado.<br/>'
    '• La precisión sobre SEVERO es baja (~0,16): el modelo detecta el 73% de los severos pero con falsos '
    'positivos — útil como screening, no como predictor puntual. La severidad depende de física del impacto '
    '(velocidad real, ángulo) que ningún dataset público captura.<br/>'
    '• Las features víctima/acusado se conocen <i>después</i> del hecho: el modelo explica factores de '
    'riesgo y screening post-siniestro, no predice antes de que ocurra.<br/>'
    '• No existe dataset público de alcoholemia ni de velocidades medidas, dos variables presumiblemente '
    'relevantes.', P))

S.append(Paragraph('Reproducibilidad', H2))
S.append(Paragraph(
    'Todo el trabajo es reproducible: notebook de 80 celdas que corre de punta a punta, datasets externos '
    'descargados como archivos estáticos (sin llamadas a APIs en tiempo de ejecución), semillas fijas '
    '(random_state=42) y protocolo de validación único. Artefactos: dataset integrado, 25 gráficos, '
    '4 mapas interactivos y 4 modelos serializados. Todas las técnicas aplicadas corresponden al programa '
    'de la materia: EDA (Clase 4), Árboles de Decisión (Clase 7), Random Forest y validación de modelos '
    '(Clase 8), regresión (Clase 9) y aprendizaje no supervisado (Clase 10).', P))

doc.build(S)
print('OK informe_tpo.pdf')
