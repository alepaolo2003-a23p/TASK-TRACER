# Prompt para asistente de código (Claude Code / OpenCode / similar)

Copia y pega esto tal cual como instrucción inicial a tu herramienta.

---

## Modo de trabajo: PROFESOR, no autocompletado

Muy importante, esto aplica a TODO lo que generes en este proyecto:

- No quiero "vibe coding". No generes código y ya. Quiero **entender qué estás haciendo y por qué**.
- Antes de crear cada archivo o bloque de código nuevo, explica en 2-4 líneas **qué vas a hacer y por qué se hace así** (qué problema resuelve, qué patrón es, qué alternativas había).
- Dentro del código, **comenta las partes no triviales**: anotaciones de Spring (`@RestController`, `@Autowired`, `@Entity`, etc.), configuraciones de seguridad, hooks de React, y cualquier configuración de Docker. El comentario debe explicar el "por qué", no repetir lo obvio (evita comentarios tipo `// esto es un string`).
- Estoy aprendiendo Docker desde cero. Cuando trabajemos en el `Dockerfile` y `docker-compose.yml`, explícame los conceptos a medida que aparecen: qué es una imagen, un contenedor, una capa (layer), un volumen, una red de Docker, la diferencia entre `COPY` y `RUN`, por qué usamos multi-stage build, etc. No asumas que ya sé nada de esto.
- Ve por fases pequeñas y confirma conmigo antes de saltar a la siguiente (backend → probar endpoints → frontend → conectar → Docker). No generes todo el proyecto de una sola vez.
- Si hay una decisión de arquitectura con más de una opción razonable, muéstrame las opciones y por qué eliges una, no la impongas en silencio.

## Control de versiones y GitHub

Aunque la aplicación es de uso personal y corre en local, el repositorio debe subirse a GitHub como proyecto de portafolio. Por tanto:

- Inicializa el repositorio Git desde el inicio (no al final), con commits pequeños y descriptivos por etapa (ej. `feat: estructura inicial Spring Boot`, `feat: CRUD de Task`, `feat: dockerización backend`, `feat: frontend Kanban`), no un solo commit gigante al final.
- Crea un `.gitignore` correcto para el proyecto completo: carpeta `target/` de Maven, `node_modules/`, archivos `.env`, `.idea/` o `.vscode/`, logs, etc. Explícame por qué cada uno de esos no debe subirse (especialmente el `.env`, por seguridad de credenciales).
- El `README.md` debe estar escrito pensando en que lo va a leer un reclutador o alguien evaluando el portafolio: descripción del proyecto, stack usado, arquitectura (puedes incluir un diagrama simple en texto/ASCII o Mermaid), capturas de pantalla (dejar placeholder si no las tienes aún), instrucciones de instalación con Docker, y una sección de "aprendizajes" o "decisiones técnicas" explicando por qué se eligió Spring Boot + React + PostgreSQL + Docker.
- Estructura el repo en monorepo con carpetas `/backend` y `/frontend` en la raíz, junto al `docker-compose.yml` y el `README.md`.
- Explícame también la diferencia entre subir el código fuente (que sí va a GitHub) y las imágenes Docker generadas (que NO se suben a GitHub, se reconstruyen localmente con `docker-compose build`).

## Contexto del proyecto

Quiero construir **Task Tracker**, una aplicación web personal de gestión de tareas (to-do / recordatorio de tareas), para uso propio y como proyecto de portafolio. Debe correr 100% en local mediante Docker Compose.

## Stack técnico (fijo, no cambiar)

- **Backend:** Java 21 + Spring Boot 3.x
  - Spring Web (REST API)
  - Spring Data JPA (Hibernate)
  - Spring Security + JWT (autenticación simple, un solo usuario o multi-usuario básico)
  - Validation (Bean Validation / Jakarta)
  - Maven como gestor de dependencias
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
  - React Router para navegación
  - Axios para consumo de API
  - Context API o Zustand para estado global (sin Redux, es innecesario aquí)
- **Base de datos:** PostgreSQL 16
- **Contenedores:** Docker + Docker Compose (backend, frontend, db en un solo `docker-compose up`)
- **Documentación de API:** Swagger/OpenAPI (springdoc-openapi)

## Arquitectura backend

Patrón por capas:
```
com.aleprojects.tasktracker
├── controller/     -> Endpoints REST
├── service/        -> Lógica de negocio
├── repository/     -> Interfaces JPA
├── model/entity/   -> Entidades JPA
├── dto/            -> Request/Response DTOs
├── mapper/         -> Conversión Entity <-> DTO
├── security/       -> Configuración JWT y filtros
├── exception/      -> Manejo global de excepciones (@ControllerAdvice)
└── config/         -> CORS, Swagger, etc.
```

## Entidades sugeridas

**Task**
- id (UUID)
- title
- description
- status (TODO, IN_PROGRESS, DONE)
- priority (LOW, MEDIUM, HIGH)
- dueDate
- category (relación con Category)
- createdAt / updatedAt
- recurring (boolean) + recurrenceRule (opcional, para tareas repetitivas)

**Category**
- id
- name
- color (para UI tipo etiqueta)

**User** (si decides multi-usuario, aunque sea solo para ti)
- id
- username
- passwordHash
- email

## Funcionalidades mínimas (MVP)

1. CRUD completo de tareas
2. Filtrado por estado, prioridad y categoría
3. Vista tipo Kanban (columnas: Por hacer / En progreso / Hecho) con drag & drop
4. Fechas límite con alertas visuales (tarea vencida en rojo, próxima a vencer en amarillo)
5. Categorías con colores personalizados
6. Login simple con JWT
7. Búsqueda de tareas por texto

## Funcionalidades opcionales (si hay tiempo, para diferenciarlo)

- Tareas recurrentes (diarias/semanales)
- Estadísticas simples (tareas completadas por semana, gráfico con Recharts)
- Modo oscuro
- Notificaciones locales (browser notifications API) para tareas próximas a vencer

## Requisitos de despliegue local

Decisión evaluada: se descartó Vercel para este proyecto porque Vercel está diseñado para funciones serverless (Node/Python/Go) y no para un backend Spring Boot con JVM y conexión persistente a base de datos. Se usa Docker, que además es una herramienta que quiero aprender a fondo (nunca la he usado).

- Un solo `docker-compose.yml` en la raíz que levante:
  - `db` (postgres:16, con volumen persistente)
  - `backend` (build desde Dockerfile en /backend, puerto 8080)
  - `frontend` (build desde Dockerfile en /frontend, servido con Vite preview o Nginx, puerto 5173 o 80)
- Variables de entorno en `.env` (no hardcodear credenciales)
- Un `README.md` con instrucciones claras: `docker-compose up --build` y listo
- Antes de escribir el Dockerfile de cada servicio, explícame línea por línea qué hace cada instrucción (FROM, WORKDIR, COPY, RUN, EXPOSE, CMD/ENTRYPOINT) y por qué se ordenan así (cache de capas)
- Explícame también qué es exactamente `docker-compose.yml`, cómo se relaciona con los Dockerfiles individuales, y qué hace la sección `networks` y `volumes`

## Lo que necesito que hagas

1. Genera la estructura completa de carpetas para backend y frontend.
2. Crea el backend con Spring Boot siguiendo la arquitectura por capas descrita, con las entidades y CRUD de tareas y categorías, más autenticación JWT.
3. Crea el frontend en React + TypeScript + Tailwind, con vista Kanban y drag & drop (usa `@dnd-kit/core`), consumiendo la API del backend.
4. Configura Docker y Docker Compose para levantar todo con un solo comando.
5. Genera un README.md profesional (para portafolio) explicando el proyecto, stack, arquitectura y cómo levantarlo localmente.
6. Ve paso a paso: primero backend funcional con endpoints probados, luego frontend conectado, luego dockerización.

Empieza por el backend: crea el proyecto Spring Boot con la estructura de carpetas indicada y la entidad Task con su CRUD completo.
