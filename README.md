# Task Tracker

A personal task management web application built as a full-stack portfolio project. Features a Kanban board with drag & drop, task filtering, categories with color labels, and JWT authentication — running locally or deployed to the cloud (Railway + Vercel).

## Tech Stack

| Layer      | Technology                                                          |
| ---------- | ------------------------------------------------------------------- |
| Backend    | Java 21, Spring Boot 3.3, Spring Security + JWT                     |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS                            |
| Database   | PostgreSQL 16                                                        |
| ORM        | Spring Data JPA (Hibernate)                                         |
| API Docs   | Swagger/OpenAPI (springdoc-openapi)                                 |
| Drag & Drop| @dnd-kit/core                                                       |
| Auth       | JWT (jjwt library)                                                  |
| Deploy     | Railway (backend + DB) + Vercel (frontend)                          |

## Architecture

### Local development
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React + Vite│  ▲  │ Spring Boot  │     │   localhost   │
│   :5173      │  │  │    :8080     │     │    :5432     │
└──────────────┘  │  └──────────────┘     └──────────────┘
                  │
          proxy de Vite
         (vite.config.ts)
```

### Production (Railway + Vercel)
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│   Railway    │────▶│  Railway     │
│   Frontend   │     │   Backend    │     │  PostgreSQL  │
│   SPA React  │     │ Spring Boot  │     │  Administrado│
└──────────────┘     └──────────────┘     └──────────────┘
```

## Features

### MVP
- [x] Full CRUD for tasks (create, read, update, delete)
- [x] Filtering by status, priority, and category
- [x] Text search across titles and descriptions
- [x] Kanban board with drag & drop (TODO → IN_PROGRESS → DONE)
- [x] Due date visual alerts (overdue in red, due soon in yellow)
- [x] Categories with custom colors
- [x] JWT authentication (register/login)
- [x] Swagger/OpenAPI documentation at `/swagger-ui.html`

### Optional
- [x] Dark mode toggle
- [ ] Recurring tasks (database model ready)
- [ ] Statistics dashboard with charts
- [ ] Browser notifications

---

## Requisitos previos (Windows)

### 1. Instalar JDK 21

1. Descarga **Eclipse Temurin JDK 21** (MSI installer) desde:  
   https://adoptium.net/temurin/releases/?version=21
2. Ejecuta el instalador, todo por defecto.
3. Verifica en una terminal nueva:
   ```powershell
   java -version
   # → openjdk version "21.0.x"
   ```

### 2. Instalar Node.js 18+

1. Descarga desde: https://nodejs.org/ (versión LTS recomendada, 18 o superior)
2. Ejecuta el instalador, todo por defecto.
3. Verifica:
   ```powershell
   node --version  # → v18.x o superior
   npm --version   # → 10.x o superior
   ```

### 3. Instalar PostgreSQL 16

1. Descarga el instalador oficial desde:  
   https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Selecciona **PostgreSQL 16** para Windows x64.
3. Durante la instalación:
   - **Password**: pon `postgres` (para coincidir con la configuración por defecto). Si pones otra, luego ajústalo en `application-local.yml`.
   - **Port**: 5432 (por defecto)
   - Deja marcado "Stack Builder" al final (no es necesario, puedes omitirlo).
4. Al terminar, PostgreSQL se instala como servicio de Windows y arranca automáticamente.
5. Verifica (busca el servicio o usa PowerShell como admin):
   ```powershell
   psql -U postgres -c "SELECT version();"
   ```
   (Te pedirá la contraseña que pusiste en la instalación)

### 4. Crear la base de datos

Abre PowerShell y ejecuta:

```powershell
psql -U postgres -c "CREATE DATABASE tasktracker;"
```

(O créala desde pgAdmin si prefieres interfaz gráfica — se instala junto con PostgreSQL)

---

## Ejecución local

### Opción A: Un solo clic (recomendado)

Ejecuta el script de arranque desde la raíz del proyecto:

```powershell
.\start.bat
```

Esto abre dos ventanas:
- **Backend** (puerto 8080) — compila y arranca Spring Boot
- **Frontend** (puerto 5173) — arranca Vite dev server

Luego abre `http://localhost:5173`.

### Opción B: Dos terminales manuales

**Terminal 1 — Backend:**
```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install    # solo la primera vez
npm run dev
```

### Opción C: Un solo comando con `concurrently`

Si prefieres no abrir dos ventanas, puedes instalar `concurrently` y usar un solo comando:

1. Crea un archivo `package.json` en la raíz del proyecto:
   ```json
   {
     "name": "task-tracker",
     "private": true,
     "scripts": {
       "dev": "concurrently -n BE,FE -c blue,green \"cd backend && mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local\" \"cd frontend && npm run dev\""
     },
     "devDependencies": {
       "concurrently": "^8.2.0"
     }
   }
   ```
2. Instala y ejecuta:
   ```powershell
   npm install
   npm run dev
   ```

**¿Cuál conviene más?**
- **`start.bat`** es más simple, no requiere instalar nada adicional, y cada servicio corre en su propia ventana con sus logs visibles. Es la opción recomendada para Windows.
- **`concurrently`** unifica los logs en una sola terminal y funciona en cualquier SO, pero requiere un `package.json` raíz. Es mejor si planeas compartir el proyecto con usuarios de Mac/Linux.

### Variables de entorno local

El backend lee la conexión a PostgreSQL de estas variables de entorno:

| Variable      | Default     | Description              |
|---------------|-------------|--------------------------|
| `PGHOST`      | `localhost` | Host de PostgreSQL       |
| `PGPORT`      | `5432`      | Puerto                   |
| `PGDATABASE`  | `tasktracker` | Nombre de base de datos |
| `PGUSER`      | `postgres`  | Usuario                  |
| `PGPASSWORD`  | `postgres`  | Contraseña               |
| `JWT_SECRET`  | *(default)* | Clave secreta JWT        |

Si usas `-Dspring-boot.run.profiles=local`, Spring Boot carga `application-local.yml` donde puedes sobreescribir cualquiera de estas. Ese archivo **no se sube a Git** (está en `.gitignore`).

---

## Uso de la API

Accede a Swagger UI para probar los endpoints desde el navegador:

```
http://localhost:8080/swagger-ui.html
```

### Authentication (`/api/auth`)
| Method | Path       | Description       |
| ------ | ---------- | ----------------- |
| POST   | `/register`| Create new user   |
| POST   | `/login`   | Authenticate user |

### Tasks (`/api/tasks`)
| Method | Path            | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | `/`             | List tasks (with filters)   |
| GET    | `/{id}`         | Get task by ID              |
| POST   | `/`             | Create task                 |
| PUT    | `/{id}`         | Update task                 |
| PATCH  | `/{id}/status`  | Update task status          |
| DELETE | `/{id}`         | Delete task                 |

**Query parameters:** `status`, `priority`, `categoryId`, `search`

### Categories (`/api/categories`)
| Method | Path     | Description           |
| ------ | -------- | --------------------- |
| GET    | `/`      | List categories       |
| POST   | `/`      | Create category       |
| PUT    | `/{id}`  | Update category       |
| DELETE | `/{id}`  | Delete category       |

---

## Despliegue en producción

La aplicación se despliega en dos plataformas:
- **Railway** — aloja el backend (Spring Boot) y la base de datos PostgreSQL
- **Vercel** — aloja el frontend (React SPA)

### Arquitectura de producción

```
https://tufrontend.vercel.app          ← Vercel (frontend)
         │
         │  peticiones a /api/*
         ▼
https://tubackend.railway.app          ← Railway (backend)
         │
         │  conexión JDBC
         ▼
PostgreSQL administrado por Railway    ← Railway (base de datos)
```

### Paso 1: Railway (backend + base de datos)

1. Crea una cuenta en https://railway.app (GitHub login)
2. Crea un **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio de Task Tracker
4. Railway detecta automáticamente el `pom.xml` y configura el build de Maven
5. Ve a la pestaña **Variables** y agrega:
   - `JWT_SECRET` — una clave secreta larga y aleatoria (ej. generada con: `openssl rand -base64 32`)
   - `CORS_ORIGINS` — la URL de tu frontend en Vercel (ej. `https://task-tracker.vercel.app`)
6. Railway provee PostgreSQL automáticamente. Ve a **New** → **Database** → **Add PostgreSQL**. Railway inyecta automáticamente las variables `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` en el backend.
7. Railway despliega automáticamente en cada push a la rama principal.
8. Obtén la URL pública del backend desde el panel de Railway (dominio `*.railway.app` o dominio personalizado).

**Nota sobre la base de datos:** Railway crea una base de datos PostgreSQL administrada con backup automático. Las variables de entorno se inyectan sin necesidad de configurar nada adicional — `application.yml` ya lee `PGHOST`, `PGPORT`, etc.

### Paso 2: Vercel (frontend)

1. Crea una cuenta en https://vercel.com (GitHub login)
2. Haz clic en **Add New** → **Project**
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build` (por defecto)
   - **Output Directory:** `dist` (por defecto)
5. En **Environment Variables**, agrega:
   - `VITE_API_URL` — la URL pública del backend en Railway (ej. `https://tubackend.up.railway.app`)
6. Haz clic en **Deploy**
7. Vercel despliega automáticamente en cada push a la rama principal.
8. Obtén la URL pública (por defecto `tu-proyecto.vercel.app`).

**Importante:** Las variables de entorno se configuran desde el panel de cada plataforma, NO en archivos. No subas a Git archivos `.env` con credenciales reales.

### Paso 3: Actualizar CORS en Railway

Ve a las variables de entorno del backend en Railway y asegúrate de tener:

```
CORS_ORIGINS=https://tu-frontend.vercel.app
```

Esto permite que el frontend de Vercel haga peticiones al backend de Railway.

### Links de la app desplegada

- **Frontend:** https://task-tracker.vercel.app (pendiente de crear)
- **Backend:** https://task-tracker-api.railway.app (pendiente de crear)
- **Swagger:** https://task-tracker-api.railway.app/swagger-ui.html

---

## Technical Decisions

### Why Spring Boot?
Spring Boot provides a robust, production-ready framework with built-in security (Spring Security), ORM (Spring Data JPA), and validation. It's widely used in enterprise Java.

### Why PostgreSQL over H2 for local?
PostgreSQL is the same database used in production (Railway). Using it locally ensures no surprises between environments. H2 was used initially when Docker wasn't available and PostgreSQL couldn't be installed.

### Why Railway + Vercel instead of a single provider?
Railway is excellent for backend services (Spring Boot + PostgreSQL) but Vercel is optimized for static frontend deployments with automatic CDN, preview URLs per branch, and simpler configuration for SPAs.

### Why Maven Wrapper (`mvnw.cmd` / `mvnw`)?
The wrapper downloads the correct Maven version automatically if not installed. This ensures consistent builds across environments (local, Railway CI).

### Why @dnd-kit instead of react-beautiful-dnd?
`react-beautiful-dnd` is no longer maintained. `@dnd-kit` is the modern, maintained alternative with better TypeScript support.

## What I Learned

- **Spring Boot layered architecture**: controllers, services, repositories, DTOs
- **JWT authentication flow**: token generation, validation, and security filters
- **React + DnD Kit**: implementing drag & drop Kanban
- **Spring Data JPA**: derived query methods, `@Query`, entity relationships
- **Bean Validation**: `@Valid`, `@NotBlank`, `@Pattern` for request validation
- **Global exception handling**: `@ControllerAdvice`
- **Environment-specific configuration**: Spring profiles for local vs production
- **CORS configuration**: allowing multiple origins (local + production)
- **Railway deployment**: Spring Boot + PostgreSQL in the cloud
- **Vercel deployment**: React SPA with environment variables

## License

This project is for portfolio purposes.
