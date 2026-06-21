import { Donut } from "@cdd/charts";

/** Distribución de gravedad (LEVE / GRAVE / MORTAL) con cifra central. */
export const Gravedad = () => (
  <Donut
    segments={[
      { v: 94.3, color: "var(--slate)", label: "LEVE" },
      { v: 4.6, color: "var(--severe-br)", label: "GRAVE" },
      { v: 1.1, color: "var(--severe)", label: "MORTAL" },
    ]}
    size={200}
    thickness={28}
    center={
      <>
        <div style={{ fontFamily: "var(--ff-serif)", fontSize: 34, fontWeight: 600, color: "var(--ink)" }}>5,7%</div>
        <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mute)" }}>severo</div>
      </>
    }
  />
);

/** Anillo más fino, dos segmentos (seco vs lluvia), sin centro. */
export const SecoVsLluvia = () => (
  <Donut
    segments={[
      { v: 92, color: "var(--amber)", label: "Seco" },
      { v: 8, color: "var(--slate)", label: "Lluvia" },
    ]}
    size={160}
    thickness={20}
  />
);
