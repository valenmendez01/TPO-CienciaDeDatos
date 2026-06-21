import { CountUp, nf, pct } from "@cdd/charts";

/** Total de siniestros del estudio, con separador de miles es-AR. */
export const TotalSiniestros = () => (
  <div style={{ fontFamily: "var(--ff-serif)", fontSize: 64, fontWeight: 600, color: "var(--ink)" }}>
    <CountUp value={37849} fmt={nf} />
  </div>
);

/** Porcentaje de siniestros severos (coma decimal, en color de acento). */
export const TasaSevero = () => (
  <div style={{ fontFamily: "var(--ff-serif)", fontSize: 64, fontWeight: 600, color: "var(--severe)" }}>
    <CountUp value={0.057} fmt={(v) => pct(v, 1)} />
  </div>
);

/** Cifra grande con etiqueta — patrón "stat" del tablero. */
export const StatConEtiqueta = () => (
  <div>
    <div style={{ fontFamily: "var(--ff-serif)", fontSize: 56, fontWeight: 600, color: "var(--slate)" }}>
      <CountUp value={25.9} fmt={(v) => v.toFixed(1).replace(".", ",")} />
    </div>
    <div style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mute)", marginTop: 8 }}>
      Siniestros por día
    </div>
  </div>
);
