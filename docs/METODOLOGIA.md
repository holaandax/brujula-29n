# Metodología

## Escala común
Respuestas y posiciones viven en [-1, 1]:
`Muy en desacuerdo -1 · En desacuerdo -0,5 · Neutral 0 · De acuerdo 0,5 · Muy de acuerdo 1`.
Preguntas de elección: A = -1, B = +1, "ninguna / no lo tengo claro" = 0. "Prefiero no responder" excluye la pregunta.

## Similitud por pregunta
`s = 1 − |u − p| / 2`. Lineal: cada paso de la escala de 5 resta 25 puntos. Se eligió la distancia absoluta (L1) en lugar de la euclídea porque es más fácil de explicar y no penaliza de forma desproporcionada los desacuerdos grandes en una sola pregunta.

## Afinidad total
`A = Σ wᵢ·sᵢ / Σ wᵢ`, con `wᵢ = pesoPregunta × pesoÁrea × confianzaFuente`, sumando solo preguntas respondidas por el usuario **y** con posición del partido.
- `null` = no disponible: la pregunta no entra para ese partido (no es 0).
- Cobertura = usadas / respondidas. < 75 %: aviso. < 50 %: fuera del ranking.
- Empate técnico: diferencia ≤ 1,5 puntos con el primero.
- Afinidad baja: primero < 60 % → lenguaje prudente.
- Orden determinista: afinidad, cobertura, nombre.

## Pesos
Todos 1. Confianza por fuente: programa 1; web/documento oficial 0,9; propuesta o intervención oficial 0,7; secundaria 0,5. Cualquier cambio de peso debe justificarse aquí con fecha.

## Áreas
Misma fórmula con las preguntas del área. El líder de área se calcula solo entre candidaturas del ranking.

## Respuestas influyentes
Para cada pregunta: `impacto = w·(s_primero − media(s_resto)) / Σw × 100`, en puntos de afinidad. Se muestran las de mayor |impacto|. Positivo: acerca al primero frente al resto.

## "¿Por qué?"
Preguntas con `s ≥ 0,75` para el primero, ordenadas por `w·s`. Máximo 5.

## Mapa ideológico
`x` = media de `signo·valor` en preguntas con `axis.econ`; `y` igual con `axis.social`. El signo se fija en `questions.ts` antes de conocer posiciones. Territorio, UE, nuclear y defensa no tienen eje asignado. Es una simplificación y así se explica en la UI.

## Revisión de sesgo de las preguntas
Para cada enunciado se comprobó: lenguaje que favorezca una posición, términos cargados, superioridad moral implícita, presuposición de bondad/maldad y asimetría. Cambios aplicados durante la revisión:
- "ocupación", "derecho a protesta" y formulaciones similares se descartaron por carga emocional o por presuponer el resultado.
- En déficit, emisiones, gasto y UE se explicita el coste ("aunque obligue a recortar gastos", "aunque suponga costes…", "aunque los Estados cedan…").
- Vivienda y territorio se plantean como elección A/B para que ambas opciones aparezcan con la misma estructura y longitud.
- "Sin papeles" se usa por ser la expresión más comprensible; si se prefiere, "en situación administrativa irregular" es la alternativa técnica.
