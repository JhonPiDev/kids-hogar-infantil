# Kids – Hogar Infantil (contexto)

Plataforma educativa para un hogar infantil de ~50 niños. Debe ser sencilla,
económica, fácil de mantener y segura (menores de edad).

## Arquitectura
- Monolito simple, PWA instalable. Sin microservicios.
- Frontend: Next.js (React) + Tailwind CSS.
- Backend/BD: PostgreSQL con auth y storage (Supabase autoalojado, o Node + PostgreSQL).
- Juegos: componentes HTML5/Canvas propios (colores, números, vocales, formas, rompecabezas, memoria).

## Perfiles
- Niños: sin correo ni contraseña; entran con avatar + PIN de 4 símbolos
  (animales, frutas, figuras). UI muy visual, botones grandes, audio de apoyo.
  Cero publicidad, sin enlaces externos.
- Docente/directora: crear y asignar actividades por grupo, ver progreso,
  publicar comunicados, registrar y administrar niños.
- Padres/acudientes: ver avance de su hijo, comunicados, fotos y evidencias.
  Cada padre ve SOLO a su propio hijo (control de acceso por roles).

## Módulos del MVP
Registro de niños, juegos educativos (lógica, lenguaje, motricidad, arte),
progreso y logros (estrellas e insignias), planeador de actividades,
comunicados y galería, asistencia (opcional).

## Módulo de registro (base de todo)
- Niño: nombres, fecha de nacimiento, documento, grupo (párvulos, caminadores,
  prejardín, jardín), foto opcional, salud (alergias, condiciones, EPS),
  observaciones, estado (activo, retirado, lista de espera).
- Acudiente: nombres, documento, parentesco, teléfono, correo, contacto de
  emergencia, personas autorizadas a recoger; un acudiente puede tener varios hijos.
- Autorizaciones: tratamiento de datos (Ley 1581 de 2012) y uso de fotos,
  con fecha y constancia.
- Avatar + PIN: asignados al registrar; PIN cifrado, único dentro del grupo;
  la directora puede verlo, imprimirlo o regenerarlo.
- Funciones: CRUD de fichas, búsqueda/filtros, cambio de grupo, retiro
  conservando historial, importación masiva desde Excel, registro de docentes.

## Puntos clave
Privacidad por roles, funcionamiento con internet lento (caché PWA),
copias de seguridad automáticas, posible evolución a multi-institución.

## Hoja de ruta
1. Registro de niños/padres/docentes + login avatar y PIN
2. Juegos básicos + estrellas e insignias
3. Panel de seguimiento, planeador, comunicados
4. Portal de padres con galería y asistencia (opcional)

## Estado actual
- Hecho: página de inicio (`app/page.tsx`) con selección de perfil
  (niño, docente, padre). El acceso aún dice "próximamente".
- Hecho: base de tipos TypeScript y mock inicial para niños, acudientes,
  docentes y grupos en `types/` y `data/mock.ts`.
- Hecho: layout del panel docente con barra lateral y vista general en `app/panel/`.
- Hecho: lista de niños con búsqueda, filtros por grupo y estado y estado vacío en `app/panel/ninos/page.tsx`.
- Hecho: formulario de registro de niño en `app/panel/ninos/nuevo/page.tsx` con validaciones y guardado en memoria.
- Hecho: sección de acudientes en el formulario con contacto de emergencia, personas autorizadas y vinculación a uno o varios acudientes en `app/panel/ninos/nuevo/page.tsx`.
- Hecho: autorizaciones de tratamiento de datos y uso de fotos con checkbox, fecha y constancia en `app/panel/ninos/nuevo/page.tsx`; no se permite guardar sin la autorización de datos.
- Hecho: avatar animal, PIN de 4 símbolos único por grupo, tarjeta imprimible y regeneración del PIN en `app/panel/ninos/nuevo/page.tsx`.
- Hecho: login del niño con avatar y PIN en `app/ninos/ingresar/page.tsx`, conectado desde el botón "Soy un niño" del inicio con datos mock.
- Hecho: capa de datos preparada para Supabase/PostgreSQL con esquema SQL en `db/schema.sql`, servicio de acceso en `lib/data.ts` y hash de PIN en `lib/security.ts`.
- Siguiente: Fase 1. próxima tarea: roles y permisos por perfil.