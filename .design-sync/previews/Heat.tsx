import { Heat, type HeatCell } from "@cdd/charts";

const rows = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const cols = ["Madrugada", "Mañana", "Tarde", "Noche"];

// Conteos reales (día × franja); s ≈ n × tasa de la franja.
const counts = [
  [391, 1535, 2269, 1330],
  [294, 1573, 2547, 1508],
  [329, 1487, 2553, 1566],
  [412, 1503, 2496, 1647],
  [447, 1514, 2727, 1727],
  [609, 919, 1643, 1347],
  [614, 725, 989, 1075],
];
const franjaRate = [0.082, 0.054, 0.049, 0.061];
const matrix: HeatCell[][] = counts.map((row) =>
  row.map((n, j) => ({ n, s: Math.round(n * franjaRate[j]) }))
);

/** Tasa de severidad por día × franja (escala continua sobre --severe). */
export const TasaSeveroPorDiaFranja = () => (
  <div style={{ width: 520 }}>
    <Heat matrix={matrix} rows={rows} cols={cols} metric="rate" />
  </div>
);

/** Mismo cruce, coloreado por volumen de siniestros (conteo). */
export const ConteoPorDiaFranja = () => (
  <div style={{ width: 520 }}>
    <Heat matrix={matrix} rows={rows} cols={cols} metric="count" />
  </div>
);
