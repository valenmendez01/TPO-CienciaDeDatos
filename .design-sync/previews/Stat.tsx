import { Stat } from "@cdd/charts";

/** Una estadística destacada. */
export const Recall = () => (
  <Stat value="0,73" label="Recall severo · holdout" color="var(--green)" size={96} />
);

/** Fila de dos estadísticas (patrón del deck). */
export const Fila = () => (
  <div style={{ display: "flex", gap: 46 }}>
    <Stat value="0,73" label="Recall severo" color="var(--green)" size={80} />
    <Stat value="0,83" label="ROC-AUC" color="var(--ink)" size={80} />
  </div>
);
