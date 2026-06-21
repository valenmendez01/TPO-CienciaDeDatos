import { LineChart } from "@cdd/charts";

const mensual = [
  { mes: "2021-01", n: 537 }, { mes: "2021-04", n: 608 }, { mes: "2021-07", n: 701 },
  { mes: "2021-10", n: 810 }, { mes: "2022-01", n: 562 }, { mes: "2022-04", n: 628 },
  { mes: "2022-07", n: 866 }, { mes: "2022-10", n: 829 }, { mes: "2023-01", n: 609 },
  { mes: "2023-04", n: 875 }, { mes: "2023-07", n: 906 }, { mes: "2023-10", n: 867 },
  { mes: "2024-01", n: 711 }, { mes: "2024-04", n: 825 }, { mes: "2024-07", n: 918 },
  { mes: "2024-10", n: 1001 }, { mes: "2024-12", n: 1083 },
];

const fmtMes = (m: number | string) => String(m).slice(0, 4);

/** Serie temporal mensual de siniestros con área de relleno. */
export const SerieMensual = () => (
  <div style={{ width: 640 }}>
    <LineChart data={mensual} xKey="mes" yKey="n" color="var(--slate)" fmtX={fmtMes} />
  </div>
);

/** Misma serie en color de acento, sin relleno, con un marcador de evento. */
export const ConMarcador = () => (
  <div style={{ width: 640 }}>
    <LineChart
      data={mensual}
      xKey="mes"
      yKey="n"
      color="var(--severe)"
      fill={false}
      fmtX={fmtMes}
      markers={[{ at: "2024-01", label: "2024" }]}
    />
  </div>
);
