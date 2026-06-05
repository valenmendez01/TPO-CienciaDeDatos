# Notas de QA del análisis

Esta rama incorpora el pipeline corregido para ejecución local y deja documentadas las validaciones principales antes de entregar el trabajo.

## Validaciones confirmadas contra los datos guardados

- Período final de análisis: 2021-2024.
- Cantidad final de siniestros: 37.849.
- Distribución del target: LEVE 35.681, GRAVE 1.752, MORTAL 416.
- Tasa binaria de siniestros severos: 5,73%.
- Los registros de víctimas matchean el 100% de los `id_siniestro` finales, pero `edad_media` falta en el 31,8% de los siniestros.
- Resultado de lluvia diaria reproducido: días secos 26,57 siniestros/día, días con lluvia 24,45 siniestros/día, lluvia fuerte 20,97 siniestros/día.
- La severidad es similar entre días secos y lluviosos: 5,67% vs 5,87%.
- El gradiente de severidad por tipo de vía se reproduce: CALLE 3,8%, AVENIDA 5,4%, AUTOPISTA 14,1%.
- La validación independiente con AUSA se reproduce: superficie mojada 27,8% con víctimas vs superficie seca 39,1%.

## Guardrails metodológicos

- El clasificador es explicativo/post-siniestro, no un predictor operativo previo al hecho, porque usa variables como tipo de víctima, contraparte y edad, conocidas después del siniestro.
- El CSV de modelado exportado ya excluye columnas que reexpresan directamente el target:
  - `numero_victimas_leve_siniestro`
  - `numero_victimas_grave_siniestro`
  - `numero_victimas_mortal_siniestro`
  - `gravedad_encoded`
- La variable `zona` de k-means ahora se ajusta dentro de cada fold de validación cruzada mediante un transformer de scikit-learn. Así, cada fold aprende las zonas solo con su train y asigna el fold de validación con `predict`.
- Los outputs y modelos generados se ignoran intencionalmente. Para regenerar `outputs/`, correr el notebook completo.
