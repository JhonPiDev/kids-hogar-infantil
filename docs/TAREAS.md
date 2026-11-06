# Tareas – Fase 1

Reglas: haz SOLO la primera tarea sin marcar (`[ ]`), no avances a la siguiente.
Al terminar: márcala con `[x]`, agrega una línea en "Estado actual" de
`docs/CONTEXTO.md` y resume en 3 líneas lo que hiciste.

- [x] 1. Base: tipos TypeScript en `types/` (Niño, Acudiente, Docente, Grupo según
      la sección de registro de CONTEXTO.md) y `data/mock.ts` con 6 niños y
      3 acudientes ficticios. No tocar páginas existentes.
- [x] 2. Layout del panel docente/directora en `app/panel/` con barra lateral
      (Niños, Docentes, Grupos), mismo estilo visual del inicio, adaptable a celular.
- [x] 3. `app/panel/ninos/page.tsx`: lista de niños (datos mock), búsqueda por
      nombre, filtros por grupo y estado, estado vacío.
- [x] 4. `app/panel/ninos/nuevo/page.tsx`: formulario de niño (datos básicos,
      grupo, salud, observaciones, estado) con validaciones; guarda en memoria.
- [x] 5. Sección de acudientes en el formulario: datos, contacto de emergencia,
      personas autorizadas, vincular uno o varios acudientes a un niño.
- [x] 6. Autorizaciones: tratamiento de datos (Ley 1581 de 2012) y uso de fotos,
      con checkbox, fecha y constancia. No guardar sin la de datos.
- [x] 7. Avatar (animal) y PIN de 4 símbolos, único dentro del grupo; tarjeta
      imprimible y botón de regenerar PIN.
- [x] 8. `app/ninos/ingresar/page.tsx`: login del niño con avatar + PIN usando
      botones grandes; conectar el botón "Soy un niño" del inicio (con mock).
- [ ] 9. Base de datos real: [Supabase / Node + PostgreSQL]; esquema de tablas,
      reemplazar mock por consultas reales, cifrar PIN.
- [ ] 10. Roles y permisos (directora, docente, padre); cada padre ve solo a su hijo.
- [ ] 11. Importación masiva desde Excel con vista previa y reporte de errores por fila.