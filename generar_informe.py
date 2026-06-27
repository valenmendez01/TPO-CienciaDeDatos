# Genera informe_tpo.pdf — Informe del TPO Siniestros Viales CABA
# Estética: sistema "Señalización vial · Ruta verde" del deck de defensa
# (tokens y tipografía Overpass idénticos a webapp/src/defensa).
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                                Image, Table, TableStyle, KeepTogether)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from PIL import Image as PILImage
import os

# ── Tipografía del deck: Overpass (sans) + Overpass Mono ──────────────────
_F = 'fonts'
pdfmetrics.registerFont(TTFont('Overpass',          os.path.join(_F, 'Overpass-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Overpass-Bold',     os.path.join(_F, 'Overpass-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Overpass-Black',    os.path.join(_F, 'Overpass-Black.ttf')))
pdfmetrics.registerFont(TTFont('Overpass-Italic',   os.path.join(_F, 'Overpass-Italic-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Overpass-BoldItalic', os.path.join(_F, 'Overpass-Italic-Bold.ttf')))
pdfmetrics.registerFont(TTFont('OverpassMono',      os.path.join(_F, 'OverpassMono-Regular.ttf')))
pdfmetrics.registerFont(TTFont('OverpassMono-Bold', os.path.join(_F, 'OverpassMono-Bold.ttf')))
registerFontFamily('Overpass', normal='Overpass', bold='Overpass-Bold',
                   italic='Overpass-Italic', boldItalic='Overpass-BoldItalic')

# ── Tokens de color del deck (:root señalización vial) ────────────────────
INK     = colors.HexColor('#15171B')
BODY    = colors.HexColor('#3A362E')
SEVERE  = colors.HexColor('#C8301B')
PANEL   = colors.HexColor('#0E6B3A')   # verde ruta (identidad)
ACCENT  = colors.HexColor('#FFC400')   # amarillo señal
AMBER   = colors.HexColor('#E0901F')
MUTE    = colors.HexColor('#6B6456')
MUTE2   = colors.HexColor('#8A8475')
HAIR    = colors.HexColor('#DED8C8')
PAPER   = colors.HexColor('#EFEDE6')
PAPER2  = colors.HexColor('#E7E3D7')

OUT = 'outputs'
doc = SimpleDocTemplate('informe_tpo.pdf', pagesize=A4,
                        topMargin=2*cm, bottomMargin=2*cm, leftMargin=2.2*cm, rightMargin=2.2*cm,
                        title='Análisis y Clasificación de Gravedad de Siniestros Viales — CABA',
                        author='TPO Ciencia de Datos — UADE 2026')

ss = getSampleStyleSheet()
H1 = ParagraphStyle('H1x', parent=ss['Heading1'], fontName='Overpass-Black', fontSize=16,
                    spaceBefore=20, spaceAfter=9, textColor=INK, leading=19)
H2 = ParagraphStyle('H2x', parent=ss['Heading2'], fontName='Overpass-Bold', fontSize=12.5,
                    spaceBefore=13, spaceAfter=6, textColor=SEVERE, leading=15)
P  = ParagraphStyle('Px', parent=ss['Normal'], fontName='Overpass', fontSize=10, leading=14.5,
                    spaceAfter=6, textColor=BODY)
PC = ParagraphStyle('PCx', parent=P, fontName='OverpassMono', fontSize=8.3, textColor=MUTE,
                    spaceBefore=3, spaceAfter=12, leading=11.5)   # captions en mono (como el deck)
TIT = ParagraphStyle('TITx', parent=ss['Title'], fontName='Overpass-Black', fontSize=23, leading=27,
                     textColor=INK)
SUB = ParagraphStyle('SUBx', parent=ss['Normal'], fontName='Overpass', fontSize=12, alignment=1,
                     textColor=MUTE)

def img(path, width=15.5*cm, caption=None):
    el = []
    p = os.path.join(OUT, path)
    if not os.path.exists(p):
        # capturas estáticas de mapas folium (HTML interactivo) que el notebook no exporta a PNG
        p = os.path.join('informe_assets', path)
    w, h = PILImage.open(p).size
    el.append(Image(p, width=width, height=width*h/w))
    if caption:
        cap = ParagraphStyle('cap', parent=PC, alignment=1)
        el.append(Paragraph(caption, cap))
    return [KeepTogether(el)]

def tabla(data, col_widths=None, font=8.5):
    t = Table(data, colWidths=col_widths, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PANEL),            # verde ruta (identidad del deck)
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTSIZE', (0, 0), (-1, -1), font),
        ('FONTNAME', (0, 0), (-1, 0), 'Overpass-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Overpass'),
        ('TEXTCOLOR', (0, 1), (-1, -1), INK),
        ('LINEBELOW', (0, 0), (-1, 0), 2.2, ACCENT),       # filo amarillo señal bajo el header
        ('GRID', (0, 0), (-1, -1), 0.4, HAIR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, PAPER2]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t

S = []

# ───────────────────────── PORTADA ─────────────────────────
# Cartel "Ruta verde": eyebrow mono + panel verde con el título en blanco + filo amarillo.
EYE = ParagraphStyle('EYE', parent=ss['Normal'], fontName='OverpassMono', fontSize=11,
                     alignment=1, textColor=MUTE2, leading=14)
PANELTIT = ParagraphStyle('PANELTIT', parent=ss['Title'], fontName='Overpass-Black', fontSize=27,
                          leading=31, alignment=1, textColor=colors.white)
PANELSUB = ParagraphStyle('PANELSUB', parent=ss['Normal'], fontName='OverpassMono', fontSize=11.5,
                          alignment=1, textColor=colors.HexColor('#BDE7CE'), leading=15)

def cartel(title_html, sub_html):
    inner = [[Paragraph(title_html, PANELTIT)], [Paragraph(sub_html, PANELSUB)]]
    t = Table(inner, colWidths=[16.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PANEL),
        ('LINEBELOW', (0, -1), (-1, -1), 6, ACCENT),     # filo amarillo señal
        ('TOPPADDING', (0, 0), (-1, 0), 34), ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 1), (-1, 1), 0), ('BOTTOMPADDING', (0, 1), (-1, 1), 34),
        ('LEFTPADDING', (0, 0), (-1, -1), 30), ('RIGHTPADDING', (0, 0), (-1, -1), 30),
    ]))
    return t

S.append(Spacer(1, 3.4*cm))
S.append(Paragraph('CIENCIA DE DATOS · UADE · TPO 2026', EYE))
S.append(Spacer(1, 0.55*cm))
S.append(cartel('Siniestros Viales — CABA',
                'ANÁLISIS Y CLASIFICACIÓN DE GRAVEDAD'))
S.append(Spacer(1, 0.9*cm))
S.append(Paragraph('Pipeline completo: ingesta → limpieza → integración → EDA → modelado', SUB))
S.append(Spacer(1, 2.6*cm))
S.append(Paragraph('<b>Materia:</b> Ciencia de Datos (3.4.217) — UADE', SUB))
S.append(Paragraph('<b>Docente:</b> Santiago Gabriel Martín', SUB))
S.append(Paragraph('<b>1er cuatrimestre 2026</b> · Junio 2026', SUB))
S.append(Spacer(1, 1.8*cm))
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
    '• <b>Modelo final de clasificación:</b> Random Forest (excluyendo los flags de registro <i>*_DESCONOCIDO</i>, '
    'que son leakage de proceso) — detecta el <b>67% de los siniestros severos</b> en el test holdout (recall 0,67; ROC-AUC 0,81), el mejor '
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
    ['Víctimas (42.650)', 'INTEGRAR', 'join 1:1 perfecto por id; hay_peaton es el mejor predictor'],
    ['Lluvia/temp MENSUAL', 'DESCARTAR', 'casi constante por mes: un solo valor para todos los siniestros del mes'],
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
    'oeste (25 de Mayo + Perito Moreno, 0,55 siniestros por millón de vehículos) quintuplica a la Illia '
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
    'Los jóvenes (18-29) pasan del 28,8% de las víctimas entre semana al <b>33,4% el fin de semana</b>. '
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
    'class_weight=balanced. Protocolo: el test holdout (20%, estratificado) se separa primero y queda '
    'intacto; la comparación de modelos corre por validación cruzada estratificada de 5 particiones '
    'solo sobre el train:', P))
S.append(tabla([
    ['Modelo', 'Accuracy', 'Precision SEV.', 'Recall SEV.', 'F1 SEV.', 'ROC-AUC'],
    ['Árbol de decisión d=4 (interpretable)', '0,626', '0,111', '0,79', '0,194', '0,756'],
    ['Árbol de decisión d=7', '0,690', '0,125', '0,73', '0,214', '0,768'],
    ['Regresión Logística', '0,715', '0,137', '0,75', '0,231', '0,815'],
    ['Random Forest (n=300, d=10) (FINAL)', '0,778', '0,157', '0,65', '0,253', '0,811'],
    ['RF + zona k-means (ablación)', '0,794', '0,166', '0,64', '0,264', '0,816'],
], col_widths=[6.2*cm, 1.9*cm, 2.5*cm, 2.1*cm, 1.7*cm, 1.8*cm]))
S.append(Spacer(1, 0.2*cm))
S.append(Paragraph(
    'Los árboles usan el <b>índice de Gini</b> como criterio de impureza, con profundidad y hojas mínimas '
    'limitadas como <b>poda preventiva</b> contra el sobreajuste. Probamos sumar la zona geográfica de '
    'k-means como <b>variable sintética</b> (se ajusta dentro de cada fold de validación para no filtrar '
    'información), pero aporta apenas +0,005 de ROC-AUC — dentro del ruido —, así que el modelo final es el '
    'Random Forest sin ella. El árbol de profundidad 4 se conserva como modelo '
    'interpretable de screening (recall 0,79: detecta la mayoría de los severos, a costa de falsos positivos).', P))
S += img('modelo_final_rf.png',
         caption='Modelo final Random Forest (sin flags de registro): matriz de confusión y curva ROC (test 20%, recall SEVERO 0,67).')
S += img('feature_importance_final.png', width=12.5*cm,
         caption='Importancia de variables del modelo final: dominan la edad media, el % masculino y los agregados de víctimas (peatón, moto). Excluimos las categorías DESCONOCIDO (sesgo de registro — causalidad inversa gravedad→completitud), declarado en Limitaciones.')
S.append(Paragraph(
    '<b>Calibración del umbral (caso de uso: triage de gravedad).</b> El recall reportado (0,67) '
    'es el del umbral por defecto (0,50); el umbral es una <b>decisión</b>, no una propiedad del modelo. '
    'Para priorizar la respuesta al registrar un siniestro, perder un caso severo cuesta más que una falsa '
    'alarma, así que conviene <b>bajar el umbral</b>: a 0,36 el recall sube a <b>0,85</b> (marca como severo '
    'el 42% de los casos, vs 26% por defecto), a costa de precisión. No se cambia de modelo —el Random Forest '
    'discrimina mejor que el árbol en todo punto de operación (a igual precisión 0,11, el RF da recall 0,85 '
    'vs 0,79 del árbol)— se elige su punto sobre la curva precisión-recall.', P))
S += img('umbral_triage.png', width=11.5*cm,
         caption='Curva precisión-recall del modelo final: el umbral por defecto (0,50) y el umbral de triage (0,36) son dos puntos de operación del mismo modelo, según el costo de perder un severo.')
S += img('arbol_decision.png',
         caption='Árbol de Decisión interpretable (criterio Gini, primeros 3 niveles): reglas si-entonces legibles.')
S.append(PageBreak())

S.append(Paragraph('4.2 Regresión: cantidad diaria de siniestros', H2))
S.append(Paragraph(
    'Problema de <b>regresión</b>: predecir cuántos siniestros habrá en un día dado de CABA. Los inputs: '
    'calendario (día de semana, mes, feriado, finde — conocido de antemano), clima (pronóstico de lluvia '
    'y temperatura) y tránsito del mes (contemporáneo: el total mensual se conoce al cerrar el mes; en un '
    'uso operativo se usaría el mes anterior o una proyección — acá su rol es explicativo). '
    'Uso práctico: dimensionar recursos (guardias del SAME, operativos de tránsito): "feriado con '
    'lluvia → ~15 siniestros esperados, no los ~26 de un día típico". Evaluado con MSE, RMSE, MAE y R². '
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
    'los GRAVE/MORTAL, y "víctima desconocida" es LEVE el 99,8% de las veces — marcar que falta un dato es '
    'consecuencia de la gravedad (causalidad inversa). Por eso <b>excluimos los flags <i>*_DESCONOCIDO</i> del '
    'modelo final</b>: sacarlos cuesta solo −0,015 de ROC-AUC, prueba de que el modelo no vivía del atajo. '
    'Y como piso honesto, el chequeo de robustez sobre el 57% de casos con datos completos (tasa SEVERO 9,9%) da '
    'ROC-AUC 0,73 (vs 0,81 global), recall 0,51, F1 0,32 — el poder discriminante real, declarado.<br/>'
    '• La precisión sobre SEVERO es baja (~0,16): el modelo detecta el 67% de los severos pero con falsos '
    'positivos — útil como screening, no como predictor puntual. La severidad depende de física del impacto '
    '(velocidad real, ángulo) que ningún dataset público captura.<br/>'
    '• Las features víctima/acusado se conocen <i>después</i> del hecho: el modelo explica factores de '
    'riesgo y screening post-siniestro, no predice antes de que ocurra.<br/>'
    '• No existe dataset público de alcoholemia ni de velocidades medidas, dos variables presumiblemente '
    'relevantes.', P))

S.append(Paragraph('Reproducibilidad', H2))
S.append(Paragraph(
    'Todo el trabajo es reproducible: un notebook que corre de punta a punta, datasets externos '
    'descargados como archivos estáticos (sin llamadas a APIs en tiempo de ejecución), semillas fijas '
    '(random_state=42) y protocolo de validación único. Artefactos: dataset integrado, 25 gráficos, '
    '4 mapas interactivos y 4 modelos serializados. Todas las técnicas aplicadas corresponden al programa '
    'de la materia: EDA (Clase 4), Árboles de Decisión (Clase 7), Random Forest y validación de modelos '
    '(Clase 8), regresión (Clase 9) y aprendizaje no supervisado (Clase 10).', P))

doc.build(S)
print('OK informe_tpo.pdf')
