import { BarRow } from "@cdd/charts";

/** Lista de barras editoriales — % severo por perfil de siniestro. */
export const PerfilesDeRiesgo = () => (
  <div className="barlist" style={{ width: 600 }}>
    <BarRow label="Persona mayor 65+" fill={0.92} value="12,9%" color="var(--severe)" />
    <BarRow label="Peatón adulto" fill={0.73} value="10,3%" color="var(--severe-br)" />
    <BarRow label="Moto laboral" fill={0.5} value="7,0%" color="var(--amber)" />
    <BarRow label="Finde joven" fill={0.45} value="6,3%" color="var(--slate)" />
    <BarRow label="Vehicular leve" fill={0.14} value="2,0%" color="var(--green)" />
  </div>
);
