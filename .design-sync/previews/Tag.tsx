import { Tag } from "@cdd/charts";

/** Tags de tipo de modelo con punto de color. */
export const TiposDeModelo = () => (
  <div style={{ display: "flex", gap: 12 }}>
    <Tag dotColor="var(--severe)">Clasificación</Tag>
    <Tag dotColor="var(--amber)">Regresión</Tag>
    <Tag dotColor="var(--slate)">No supervisado</Tag>
  </div>
);
