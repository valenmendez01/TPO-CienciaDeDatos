"""
Sistema visual único del TPO — fuente de verdad de color y tipografía.

Replica en matplotlib/seaborn los mismos tokens que usan el deck de defensa
(webapp/src/defensa) y la webapp interactiva, para que las tres superficies
(notebook/informe PDF, deck, webapp) hablen el mismo idioma visual.

Uso en el notebook:
    from estilo_visual import aplicar_estilo, PALETA, CMAP_SEC, limpiar_label
    aplicar_estilo()
"""
import os
from matplotlib import font_manager as fm
from matplotlib.colors import LinearSegmentedColormap, ListedColormap
import matplotlib.pyplot as plt

# --- Tokens de marca (idénticos a styles.css / defensa) -------------------
BRAND = {
    "paper":    "#F4F0E8",
    "paper_2":  "#EDE7DA",
    "ink":      "#1C1813",
    "severe":   "#C0391F",
    "severe_br":"#E05334",
    "slate":    "#3E5A66",
    "amber":    "#C28A2C",
    "green":    "#4E7A52",
    "mute":     "#6E6456",
    "hair":     "#D7CFBF",
}

# Paleta categórica: orden de prioridad narrativa del deck
PALETA = [BRAND["severe"], BRAND["slate"], BRAND["amber"], BRAND["green"], BRAND["mute"]]

# Colormap secuencial = gradiente de los mapas del deck (claro -> severo)
CMAP_SEC = LinearSegmentedColormap.from_list(
    "brand_seq", ["#F7F3C8", "#F4C04E", "#E0681F", "#9E1B1B"]
)
# Variante divergente (slate -> papel -> severe) para correlaciones, etc.
CMAP_DIV = LinearSegmentedColormap.from_list(
    "brand_div", [BRAND["slate"], "#8FA6AE", BRAND["paper"], BRAND["severe_br"], BRAND["severe"]]
)
# Colormap categórico (clusters, grupos) — hasta 6 categorías con tokens de marca
CMAP_CAT = ListedColormap(
    [BRAND["severe"], BRAND["slate"], BRAND["amber"], BRAND["green"], BRAND["mute"], BRAND["severe_br"]],
    name="brand_cat",
)

_DIR = os.path.dirname(os.path.abspath(__file__))
_FONTS = os.path.join(_DIR, "fonts")


def _registrar_fuentes():
    """Carga los TTF de fonts/ en matplotlib. Devuelve los nombres disponibles."""
    if not os.path.isdir(_FONTS):
        return set()
    for f in os.listdir(_FONTS):
        if f.lower().endswith((".ttf", ".otf")):
            try:
                fm.fontManager.addfont(os.path.join(_FONTS, f))
            except Exception:
                pass
    return {f.name for f in fm.fontManager.ttflist}


def aplicar_estilo():
    """Aplica el estilo de marca a matplotlib/seaborn (idempotente)."""
    disponibles = _registrar_fuentes()
    sans  = "Archivo"        if "Archivo" in disponibles        else "DejaVu Sans"
    serif = "Newsreader"     if "Newsreader" in disponibles     else "DejaVu Serif"
    mono  = "IBM Plex Mono"  if "IBM Plex Mono" in disponibles  else "DejaVu Sans Mono"

    try:
        import seaborn as sns
        sns.set_theme(style="white", palette=PALETA)
    except Exception:
        pass

    plt.rcParams.update({
        # Tipografía
        "font.family":        sans,
        "font.size":          12,
        "axes.titlesize":     16,
        "axes.titleweight":   "medium",
        "axes.labelsize":     12.5,
        "xtick.labelsize":    11,
        "ytick.labelsize":    11,
        "legend.fontsize":    11.5,
        # Color de fondo (papel)
        "figure.facecolor":   BRAND["paper"],
        "axes.facecolor":     BRAND["paper"],
        "savefig.facecolor":  BRAND["paper"],
        # Tinta
        "text.color":         BRAND["ink"],
        "axes.labelcolor":    BRAND["ink"],
        "axes.titlecolor":    BRAND["ink"],
        "xtick.color":        BRAND["mute"],
        "ytick.color":        BRAND["mute"],
        "axes.edgecolor":     BRAND["hair"],
        # Spines: solo izquierda/abajo, finas
        "axes.spines.top":    False,
        "axes.spines.right":  False,
        "axes.linewidth":     1.0,
        # Grid hairline (ambos ejes, como el whitegrid original pero on-brand)
        "axes.grid":          True,
        "axes.grid.axis":     "both",
        "grid.color":         BRAND["hair"],
        "grid.linewidth":     0.8,
        "grid.alpha":         0.9,
        "axes.axisbelow":     True,   # grid detrás de barras/imshow (no cruza celdas)
        # Ciclo de color de marca
        "axes.prop_cycle":    plt.cycler(color=PALETA),
        # Líneas y export
        "lines.linewidth":    2.2,
        "lines.solid_capstyle":"round",
        "figure.figsize":     (12, 5),
        "figure.dpi":         110,
        "savefig.dpi":        150,
        "savefig.bbox":       "tight",
        "legend.frameon":     False,
        "axes.titlepad":      14,
    })
    # Ticks/labels de ejes en mono cuando se quiera (lo aplica quien grafica)
    return {"sans": sans, "serif": serif, "mono": mono}


def limpiar_label(s):
    """franja_horaria -> 'Franja horaria'; respeta siglas y acrónimos."""
    if not isinstance(s, str):
        return s
    txt = s.replace("_", " ").strip()
    return txt[:1].upper() + txt[1:] if txt else txt
