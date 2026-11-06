# Kids – Hogar Infantil

Plataforma educativa digital para un hogar infantil de unos 50 niños. Permite que los niños aprendan jugando, que la directora y las docentes gestionen actividades y seguimiento, y que los padres se mantengan informados. Está pensada para ser sencilla, económica, fácil de mantener y segura, por tratarse de menores de edad.

> Proyecto en desarrollo. Actualmente existe la página de inicio con la selección de perfil; el resto avanza por fases (ver [Hoja de ruta](#hoja-de-ruta)).

## Perfiles de usuario

| Perfil | Qué puede hacer |
| --- | --- |
| Niños | Ingresan con un avatar y un PIN de 4 símbolos (sin correo ni contraseña). Interfaz muy visual, sin publicidad ni enlaces externos. |
| Docente / directora | Crear y asignar actividades, ver el progreso, publicar comunicados y administrar el registro de niños. |
| Padres / acudientes | Ver el avance de su hijo, recibir comunicados y consultar fotos y evidencias. |

## Módulos del MVP

- Registro y gestión de niños, acudientes y docentes
- Juegos educativos: lógica, lenguaje, motricidad y arte
- Progreso y logros (estrellas e insignias)
- Planeador de actividades y tareas
- Comunicados y galería para padres
- Asistencia (opcional)

## Tecnologías

- **Frontend:** Next.js (React), TypeScript y Tailwind CSS, entregado como PWA
- **Backend y base de datos:** PostgreSQL con autenticación y almacenamiento (Supabase o Node.js + PostgreSQL, por definir)
- **Juegos:** componentes HTML5/Canvas propios

## Requisitos

- [Node.js](https://nodejs.org/) (versión LTS)
- npm
- Git

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/JhonPiDev/kids-hogar-infantil.git
cd kids-hogar-infantil

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Otros comandos

```bash
npm run lint    # revisar el código
npm run build   # compilar para producción
npm run start   # ejecutar la versión compilada
```

## Estructura del proyecto

```
kids-hogar-infantil/
├── .github/agents/   # agente de VS Code para el desarrollo
├── app/              # páginas y componentes (Next.js App Router)
├── docs/
│   ├── CONTEXTO.md   # contexto y alcance del proyecto
│   └── TAREAS.md     # tareas de la Fase 1
├── public/           # archivos estáticos
└── package.json
```

## Hoja de ruta

| Fase | Contenido |
| --- | --- |
| 1 | Registro de niños, padres y docentes; login con avatar y PIN |
| 2 | Juegos educativos básicos y sistema de estrellas e insignias |
| 3 | Panel de seguimiento, planeador de actividades y comunicados |
| 4 | Portal de padres con galería y, opcionalmente, asistencia |

El detalle de la Fase 1 está en [`docs/TAREAS.md`](docs/TAREAS.md).

## Privacidad y datos de menores

- Se exige autorización de los padres para el tratamiento de datos personales (Ley 1581 de 2012) y para el uso de fotografías.
- El acceso se controla por roles: cada padre solo ve la información de su propio hijo.
- Los PIN se almacenan cifrados.
- No se deben subir al repositorio datos reales de niños, familias ni personal. Para pruebas se usan datos ficticios.
- Los archivos `.env` y las claves nunca se suben a Git.

## Equipo

Proyecto desarrollado por estudiantes de la Fundación Escuela Tecnológica de Neiva (FET).

## Licencia

Por definir.