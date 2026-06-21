import { Columns } from "@cdd/charts";

const porAnio = [
  { k: "2021", n: 7905 },
  { k: "2022", n: 9498 },
  { k: "2023", n: 9942 },
  { k: "2024", n: 10504 },
];

const porFranja = [
  { k: "Madrugada", n: 2700, rate: 0.082 },
  { k: "Mañana", n: 9256, rate: 0.054 },
  { k: "Tarde", n: 13444, rate: 0.049 },
  { k: "Noche", n: 9200, rate: 0.061 },
];

/** Columnas simples — siniestros por año. */
export const PorAnio = () => (
  <div style={{ width: 560 }}>
    <Columns data={porAnio} yKey="n" color="var(--slate)" />
  </div>
);

/** Columnas con línea de tasa secundaria (% severo) sobre eje derecho. */
export const ConTasaSevero = () => (
  <div style={{ width: 560 }}>
    <Columns data={porFranja} yKey="n" rateKey="rate" color="var(--slate)" />
  </div>
);
