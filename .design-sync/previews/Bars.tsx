import { Bars } from "@cdd/charts";

const arterias = [
  { k: "Gral. Paz Av.", n: 1607, rate: 0.061 },
  { k: "Rivadavia Av.", n: 831, rate: 0.065 },
  { k: "Del Libertador Av.", n: 760, rate: 0.048 },
  { k: "Juan B. Justo Av.", n: 685, rate: 0.052 },
  { k: "Corrientes Av.", n: 627, rate: 0.019 },
];

const victima = [
  { k: "Moto", n: 13946 },
  { k: "Peatón", n: 5210 },
  { k: "Bicicleta", n: 3980 },
  { k: "Auto", n: 3640 },
];

/** Ranking de arterias con valor animado y % severo dentro de la barra. */
export const TopArteriasConTasa = () => (
  <div style={{ width: 480 }}>
    <Bars data={arterias} yKey="n" labelKey="k" rateKey="rate" color="var(--severe)" />
  </div>
);

/** Ranking simple sin tasa, en color neutro. */
export const PorModoVictima = () => (
  <div style={{ width: 480 }}>
    <Bars data={victima} yKey="n" labelKey="k" color="var(--slate)" />
  </div>
);
