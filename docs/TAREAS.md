# Tareas

Reglas: haz SOLO la primera tarea sin marcar (`[ ]`), no avances a la siguiente.
Al terminar: márcala con `[x]`, agrega una línea en "Estado actual" de
`docs/CONTEXTO.md` y resume en 3 líneas lo que hiciste.
Mientras no se haga la tarea 25, trabaja con datos ficticios (`data/mock.ts`).
El progreso de los niños se guarda en el navegador (localStorage) como solución temporal.

## Fase 1: Registro y login (terminada)
- [x] 1 a 11. Tipos y datos ficticios, panel docente, lista y formulario de niños, acudientes, autorizaciones, avatar y PIN, login del niño, capa de datos preparada para Supabase (`db/schema.sql`, `lib/data.ts`, `lib/security.ts`), roles y permisos, e importación desde Excel.

## Fase 2: Juegos y logros
- [x] 12. `app/ninos/juegos/page.tsx`: pantalla de juegos para el niño con las 4 áreas (lógica, lenguaje, motricidad, arte), botones grandes, mucho color, sin enlaces externos ni publicidad.
- [ ] 13. Juego de colores (componente propio en HTML5/Canvas o React) con retroalimentación visual y de audio.
- [ ] 14. Juego de números (contar y relacionar cantidades).
- [ ] 15. Juego de vocales y letras con audio de apoyo.
- [ ] 16. Juego de formas (arrastrar cada forma a su lugar).
- [ ] 17. Juego de memoria (parejas de cartas).
- [ ] 18. Rompecabezas sencillo de piezas grandes.
- [ ] 19. Estrellas e insignias: el niño gana estrellas al completar juegos; guardar el progreso por niño en localStorage (temporal) y mostrar sus logros.
- [ ] 20. PWA: manifest, íconos y service worker para instalar la app y cachear los juegos con internet lento.

## Fase 3: Seguimiento y comunicados
- [ ] 21. Planeador de actividades: la docente crea actividades y las asigna a un grupo (datos ficticios).
- [ ] 22. Actividades asignadas visibles para el niño al ingresar.
- [ ] 23. Panel de seguimiento: progreso por niño y por grupo (juegos completados, estrellas, insignias).
- [ ] 24. Comunicados: la directora o docente publica avisos para los acudientes.
- [ ] 25. Conectar de verdad con Supabase: leer claves de `.env.local` (nunca en el código), usar `lib/data.ts` contra la base real en vez de `data/mock.ts`, migrar el progreso de localStorage a la base, y aplicar RLS por rol según `db/schema.sql`. Guíame paso a paso en lo que debo hacer yo en el panel de Supabase.

## Fase 4: Portal de padres
- [ ] 26. Login de acudientes con correo; cada padre ve solo la información de su propio hijo.
- [ ] 27. Portal de padres: avance del hijo y comunicados.
- [ ] 28. Galería de fotos y evidencias, mostrando solo fotos de niños con autorización de uso de imagen.
- [ ] 29. Asistencia (opcional): registro diario por grupo y consulta para padres.
- [ ] 30. Copias de seguridad automáticas de la base de datos y las fotos, y guía de despliegue en `docs/`.