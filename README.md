<div align="center">
  <h1>📋 Task Tracker</h1>
  <p><strong>Full-stack task management application with Kanban board, JWT authentication, and cloud deployment</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Java-21-%23ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
    <img src="https://img.shields.io/badge/Spring_Boot-3.3-%236DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3.3">
    <img src="https://img.shields.io/badge/React-18-%2361DAFB?logo=react&logoColor=white" alt="React 18">
    <img src="https://img.shields.io/badge/PostgreSQL-16-%234169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
    <img src="https://img.shields.io/badge/Railway-deployed-%230B0D0E?logo=railway" alt="Railway">
    <img src="https://img.shields.io/badge/Vercel-deployed-%23000000?logo=vercel" alt="Vercel">
  </p>
</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Local Setup](#-local-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Technical Decisions](#-technical-decisions)
- [What I Learned](#-what-i-learned)
- [License](#-license)

---

## 📌 Overview

**Task Tracker** is a personal task management web application built as a full-stack portfolio project. It allows users to create, organize, and track tasks through a visual Kanban board with drag & drop, color-coded categories, priority levels, and due date alerts.

The project is designed to run both **locally** (for development) and **in the cloud** (for portfolio demonstration) using Railway for the backend + database and Vercel for the frontend.

**Live demo:** [task-tracker.vercel.app](https://task-tracker.vercel.app) *(pending deployment)*

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Database** | PostgreSQL 16 |
| **Authentication** | JWT (jjwt library) |
| **API Documentation** | Swagger / OpenAPI (springdoc-openapi) |
| **Drag & Drop** | @dnd-kit/core |
| **Deployment** | Railway (backend + DB), Vercel (frontend) |

---

## 🏗 Architecture

### Local Development

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Frontend       │      │   Backend        │      │   PostgreSQL     │
│   React + Vite   │─────▶│   Spring Boot    │─────▶│   localhost:5432 │
│   localhost:5173 │  ▲   │   localhost:8080 │      │   tasktracker    │
└──────────────────┘  │   └──────────────────┘      └──────────────────┘
                      │
              Vite Proxy (vite.config.ts)
           /api → http://localhost:8080
```

### Production (Cloud)

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Vercel         │      │   Railway        │      │   Railway        │
│   Frontend SPA   │─────▶│   Spring Boot    │─────▶│   PostgreSQL     │
│   .vercel.app    │  🌐  │   .railway.app   │      │   Managed        │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                          │
        │  CORS config             │  Env vars injected
        │  CORS_ORIGINS=https://   │  PGHOST, PGPORT, etc.
        │  tu-frontend.vercel.app  │
```

### Backend Structure

```
backend/
├── src/main/java/com/aleprojects/tasktracker/
│   ├── controller/        # REST endpoints (Auth, Task, Category)
│   ├── service/           # Business logic layer
│   ├── repository/        # JPA data access (Spring Data)
│   ├── model/entity/      # JPA entities (Task, Category, User)
│   ├── model/enums/       # TaskStatus, Priority
│   ├── dto/               # Request/Response objects
│   ├── mapper/            # Entity ↔ DTO converters
│   ├── security/          # JWT filters + Spring Security config
│   ├── exception/         # Global exception handling (@ControllerAdvice)
│   └── config/            # CORS, Swagger/OpenAPI
├── system.properties      # Java version for Railway
├── Procfile               # Start command for Railway
├── railway.json           # Railway build configuration
└── pom.xml
```

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/             # Login, Register, Dashboard, Kanban, Categories
│   ├── components/        # Navbar, TaskCard, TaskForm, KanbanColumn
│   ├── services/          # API client (Axios), auth, tasks, categories
│   ├── contexts/          # AuthContext, ThemeContext (dark mode)
│   └── types/             # TypeScript interfaces and enums
├── vercel.json            # SPA routing config for Vercel
├── vite.config.ts         # Vite proxy to backend
└── package.json
```

---

## ✨ Features

### Core
- ✅ Full CRUD for tasks (create, read, update, delete)
- ✅ Kanban board with drag & drop (TODO → IN_PROGRESS → DONE)
- ✅ Filtering by status, priority, and category
- ✅ Full-text search across titles and descriptions
- ✅ Due date visual alerts (overdue in red, due soon in yellow)
- ✅ Categories with custom color picker
- ✅ JWT authentication (register / login)
- ✅ Swagger/OpenAPI documentation

### Plus
- ✅ Dark mode toggle
- ⬜ Recurring tasks (database model ready)
- ⬜ Statistics dashboard with charts
- ⬜ Browser notifications for due tasks

---

## 💻 Local Setup

### Prerequisites

Install these tools **in this order**:

| Tool | Version | Download |
|---|---|---|
| **JDK** | 21 (LTS) | [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21) |
| **PostgreSQL** | 16 or 17 | [EDB PostgreSQL Installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) |
| **Node.js** | 18+ (LTS) | [nodejs.org](https://nodejs.org/) |

### Step 1: Create the database

```powershell
# Conéctate a PostgreSQL y crea la base de datos
psql -U postgres -c "CREATE DATABASE tasktracker;"
```
*(Te pedirá la contraseña que pusiste al instalar PostgreSQL)*

### Step 2: Configure access

Crea `backend/src/main/resources/application-local.yml` con tu contraseña:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tasktracker
    username: postgres
    password: TU_CONTRASEÑA_AQUI
```

> **⚠️ Este archivo está en `.gitignore`** — no se subirá a GitHub.

### Step 3: Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

> `mvnw.cmd` descarga automáticamente Maven 3.9.8 si no lo tienes instalado.

### Step 4: Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

### Step 5: Open the app

Navigate to [http://localhost:5173](http://localhost:5173), register a new account, and start using Task Tracker.

### Quick Start (single command)

Run `start.bat` from the project root — it opens both services in separate windows:

```powershell
.\start.bat
```

### H2 Console (if using embedded database)

If you want to run without PostgreSQL (for quick testing):

```yaml
# In application.yml, change datasource to:
spring:
  datasource:
    url: jdbc:h2:mem:tasktracker
    username: sa
    password:
```

Then access: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 🎮 Usage

### First-time flow

1. Open the app → redirected to **Login**
2. Click **"Create account"** → register with username, email, password
3. Go to **Categories** → create categories with colors (e.g., Work, Personal, Urgent)
4. Go to **Dashboard** or **Kanban** → create tasks
5. Drag tasks between columns on the **Kanban** board

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PGHOST` | `localhost` | PostgreSQL host |
| `PGPORT` | `5432` | PostgreSQL port |
| `PGDATABASE` | `tasktracker` | Database name |
| `PGUSER` | `postgres` | Database user |
| `PGPASSWORD` | `postgres` | Database password |
| `JWT_SECRET` | *(embedded default)* | Secret key for JWT signing |
| `JWT_EXPIRATION_MS` | `86400000` | JWT validity (24h) |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed CORS origins (comma-separated) |

---

## 📖 API Documentation

Interactive API docs are available at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) when the backend is running.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/auth/login` | Authenticate and get JWT token |

**Register:**
```json
{ "username": "demo", "password": "demo123", "email": "demo@test.com" }
```
**Response:**
```json
{ "token": "eyJhbGci...", "userId": "uuid", "username": "demo", "email": "demo@test.com" }
```

### Tasks

All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks (supports filtering) |
| `GET` | `/api/tasks/{id}` | Get task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `PATCH` | `/api/tasks/{id}/status` | Update task status only |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

**Query parameters for `GET /api/tasks`:**
- `status=TODO` | `IN_PROGRESS` | `DONE`
- `priority=LOW` | `MEDIUM` | `HIGH`
- `categoryId=<uuid>`
- `search=<text>` (searches title and description)

**Create task:**
```json
{
  "title": "Learn Spring Boot",
  "description": "Complete the Task Tracker project",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-15",
  "categoryId": null,
  "recurring": false
}
```

**Update status (body is plain text):**
```
IN_PROGRESS
```

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a category |
| `PUT` | `/api/categories/{id}` | Update a category |
| `DELETE` | `/api/categories/{id}` | Delete a category |

**Create category:**
```json
{ "name": "Work", "color": "#6366f1" }
```

---

## 🚀 Deployment

The application is deployed across two platforms:

| Service | Platform | Purpose |
|---|---|---|
| **Backend** | [Railway](https://railway.app) | Spring Boot API + PostgreSQL database |
| **Frontend** | [Vercel](https://vercel.com) | React SPA static hosting |

### Deploy Backend to Railway

#### 1. Create a Railway account
- Go to [railway.app](https://railway.app) and sign up with GitHub
- Install the Railway GitHub app when prompted

#### 2. Create the project
- Click **New Project** → **Deploy from GitHub repo**
- Select your `task-tracker` repository
- Railway detects Maven and builds automatically

#### 3. Add PostgreSQL database
- In the Railway dashboard, click **New** → **Database** → **Add PostgreSQL**
- Railway automatically injects these environment variables into your backend:
  - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

#### 4. Configure environment variables
In the Railway dashboard, go to your backend service → **Variables** tab and add:

| Variable | Value | Why |
|---|---|---|
| `JWT_SECRET` | Generate a long random secret | Signs JWT tokens securely |
| `CORS_ORIGINS` | `https://tu-proyecto.vercel.app` | Allows frontend to call the API |
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL configuration |
| `PGHOST` | *(auto-injected by Railway)* | PostgreSQL host |
| `PGPORT` | *(auto-injected by Railway)* | PostgreSQL port |
| `PGDATABASE` | *(auto-injected by Railway)* | Database name |
| `PGUSER` | *(auto-injected by Railway)* | Database user |
| `PGPASSWORD` | *(auto-injected by Railway)* | Database password |

> **Note:** Railway provides PostgreSQL through a **Plugin**, which auto-injects the `PG*` variables. You may need to check the exact variable names in the Railway dashboard after adding PostgreSQL.

#### 5. Deploy
- Railway deploys automatically on every push to the main branch
- Your backend will be available at `https://<your-project>.railway.app`

### Deploy Frontend to Vercel

#### 1. Create a Vercel account
- Go to [vercel.com](https://vercel.com) and sign up with GitHub

#### 2. Import the repository
- Click **Add New** → **Project**
- Select your `task-tracker` repository
- Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite (auto-detected) |
| **Root Directory** | `frontend/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### 3. Configure environment variables
In Vercel, go to your project → **Settings** → **Environment Variables** and add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<tu-backend>.railway.app` |

> **Important:** This tells the frontend where to find the backend API in production. In local development, it uses the Vite proxy instead.

#### 4. Deploy
- Click **Deploy**
- Vercel builds and deploys automatically on every push to the main branch
- Your frontend will be available at `https://<your-project>.vercel.app`

### After Deployment

1. Update `CORS_ORIGINS` in Railway if needed
2. Register a user through the deployed frontend
3. Verify that all API endpoints work

### Live URLs

| Service | URL |
|---|---|
| **Frontend** | [https://task-tracker.vercel.app](https://task-tracker.vercel.app) |
| **Backend API** | [https://task-tracker-api.railway.app](https://task-tracker-api.railway.app) |
| **Swagger Docs** | [https://task-tracker-api.railway.app/swagger-ui.html](https://task-tracker-api.railway.app/swagger-ui.html) |

> *(URLs are placeholders — update after actual deployment)*

---

## 🧠 Technical Decisions

### Why Spring Boot instead of Express/FastAPI?
Spring Boot provides enterprise-grade infrastructure out of the box: built-in security (Spring Security), ORM (Spring Data JPA), validation (Bean Validation), and API documentation (SpringDoc OpenAPI). It's widely adopted in the Java ecosystem.

### Why PostgreSQL?
PostgreSQL is a production-grade relational database with excellent JSON support, concurrent access handling, and is the default choice for Spring Boot applications. It's also available as a managed service on Railway.

### Why Railway + Vercel instead of a single platform?
Railway excels at deploying backend services with JVM support and managed PostgreSQL, making it ideal for Spring Boot. Vercel provides a superior developer experience for static frontend SPAs with instant preview deployments, automatic CDN, and simpler configuration.

### Why Maven Wrapper?
The `mvnw.cmd` / `mvnw` scripts download the correct Maven version automatically, ensuring consistent builds across environments (local Windows, Railway Linux CI) without requiring manual Maven installation.

### Why multi-stage Docker builds were removed?
Docker was initially planned but could not be installed on the development machine (Windows version limitation). The project runs natively instead. Docker containerization can be added later as an incremental improvement.

### Why @dnd-kit instead of react-beautiful-dnd?
`react-beautiful-dnd` is no longer maintained by Atlassian. `@dnd-kit` is the modern, actively maintained alternative with first-class TypeScript support, better accessibility, and a more flexible API.

---

## 📚 What I Learned

### Backend (Spring Boot)
- **Layered architecture** — separation of concerns between controllers, services, repositories, and entities
- **Spring Data JPA** — derived query methods, `@Query` for custom JPQL, entity relationships (`@ManyToOne`)
- **JWT authentication** — token generation, validation filters, SecurityContext, stateless sessions
- **Global exception handling** — `@ControllerAdvice` for centralized error responses
- **Bean Validation** — `@Valid`, `@NotBlank`, `@Pattern` for request validation
- **CORS configuration** — allowing multiple origins via environment variables
- **Spring Profiles** — switching between local (H2) and production (PostgreSQL) configurations

### Frontend (React + TypeScript)
- **Vite proxy** — proxying API requests in development to avoid CORS issues
- **Drag & drop** — implementing Kanban with `@dnd-kit/core` and `@dnd-kit/sortable`
- **Context API** — managing global authentication state and dark mode
- **Axios interceptors** — automatic JWT injection and 401 redirect handling
- **Tailwind CSS** — responsive design with utility-first CSS and dark mode

### DevOps & Deployment
- **Spring profiles** for environment-specific configuration
- **Railway deployment** — Spring Boot + PostgreSQL in the cloud
- **Vercel deployment** — React SPA with environment variables
- **Environment variables** — secure configuration via platform dashboards (not committed files)

---

## 📄 License

This project is built for portfolio purposes. Feel free to use it as a reference for your own learning.

---

<div align="center">
  <p>
    <a href="#-table-of-contents">Back to top</a>
  </p>
  <p>
    Built with ☕ and Spring Boot · © 2026
  </p>
</div>
