# Task Tracker

A personal task management web application built as a full-stack portfolio project. Features a Kanban board with drag & drop, task filtering, categories with color labels, JWT authentication, and full Docker containerization.

## Tech Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Backend    | Java 21, Spring Boot 3.3, Spring Security + JWT      |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS             |
| Database   | PostgreSQL 16                                        |
| ORM        | Spring Data JPA (Hibernate)                          |
| API Docs   | Swagger/OpenAPI (springdoc-openapi)                  |
| Drag & Drop| @dnd-kit/core                                        |
| Auth       | JWT (jjwt library)                                   |
| Containers | Docker, Docker Compose                                |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React + Vite│     │ Spring Boot  │     │   Database   │
│   :5173/80   │     │    :8080     │     │    :5432     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       └────── Docker Compose ──────┘
```

The application follows a **monorepo** structure with two main directories:

- **`/backend`** — Spring Boot application following a layered architecture:
  - `controller/` — REST endpoints
  - `service/` — Business logic
  - `repository/` — JPA data access
  - `model/entity/` — JPA entities
  - `dto/` — Request/Response objects
  - `security/` — JWT authentication filters and config
  - `exception/` — Global exception handling
  - `config/` — CORS, Swagger/OpenAPI configuration

- **`/frontend`** — React + TypeScript application with:
  - Kanban board with drag & drop (`@dnd-kit/core`)
  - Dashboard with filters and search
  - Category management with color picker
  - Dark mode support
  - Responsive design with Tailwind CSS

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

## Screenshots

*(Add screenshots here — placeholder for when you have the app running)*

| Dashboard | Kanban Board | Categories |
|-----------|-------------|------------|
| ![Dashboard](screenshots/dashboard.png) | ![Kanban](screenshots/kanban.png) | ![Categories](screenshots/categories.png) |
| Login | Dark Mode | |
| ![Login](screenshots/login.png) | ![Dark Mode](screenshots/darkmode.png) | |

## Quick Start with Docker

**Prerequisites:** Docker and Docker Compose installed on your machine.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/task-tracker.git
cd task-tracker

# 2. Start all services (builds images, creates containers)
docker-compose up --build

# Wait for services to be ready, then open:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### What happens when you run `docker-compose up --build`

1. Docker builds the **backend** image using the multi-stage `Dockerfile` in `/backend`
2. Docker builds the **frontend** image using the multi-stage `Dockerfile` in `/frontend`
3. Docker pulls the **PostgreSQL 16** image from Docker Hub
4. Docker Compose creates a network so all three containers can communicate
5. PostgreSQL initializes with credentials from `.env`
6. Backend waits for PostgreSQL to be healthy, then starts
7. Frontend (served via Nginx) becomes available on port 5173

### Running without Docker (development)

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

*Requires a local PostgreSQL instance running on port 5432.*

## Environment Variables

All configuration is done through `.env` at the project root:

| Variable            | Default    | Description                        |
| ------------------- | ---------- | ---------------------------------- |
| `DB_HOST`           | `db`       | PostgreSQL host (service name in Docker) |
| `DB_PORT`           | `5432`     | PostgreSQL port                    |
| `DB_NAME`           | `tasktracker` | Database name                   |
| `DB_USERNAME`       | `postgres` | Database user                     |
| `DB_PASSWORD`       | `postgres` | Database password                 |
| `JWT_SECRET`        | *(long)*   | Secret key for JWT signing         |
| `JWT_EXPIRATION_MS` | `86400000` | JWT token validity (24h)          |

## API Endpoints

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

**Query parameters for GET `/api/tasks`:**
- `status` — `TODO`, `IN_PROGRESS`, `DONE`
- `priority` — `LOW`, `MEDIUM`, `HIGH`
- `categoryId` — UUID of category
- `search` — Full-text search in title/description

### Categories (`/api/categories`)
| Method | Path     | Description           |
| ------ | -------- | --------------------- |
| GET    | `/`      | List categories       |
| POST   | `/`      | Create category       |
| PUT    | `/{id}`  | Update category       |
| DELETE | `/{id}`  | Delete category       |

## Technical Decisions

### Why Spring Boot instead of Express/FastAPI?
Spring Boot provides a robust, production-ready framework with built-in security (Spring Security), ORM (Spring Data JPA), and validation. It's widely used in enterprise Java, making it a strong portfolio choice.

### Why PostgreSQL instead of SQLite?
PostgreSQL is a full-featured relational database that handles concurrent access properly, has excellent JSON support, and is the standard choice for production Spring Boot applications.

### Why multi-stage Docker builds?
The backend Dockerfile uses two stages: one with Maven+JDK to compile, and a second with only JRE to run. This reduces the final image from ~400MB to ~180MB by excluding build tools.

### Why Nginx for the frontend instead of Vite dev server?
In production, Nginx is more efficient at serving static files, handles compression, and can act as a reverse proxy to the backend — eliminating CORS issues entirely.

### Why not Vercel?
Vercel is designed for serverless functions (Node.js, Python, Go) and cannot run a JVM-based Spring Boot application with a persistent database connection.

## What I Learned

- **Docker fundamentals**: images vs containers, layers, multi-stage builds, volumes for persistence, health checks, and Docker Compose networking
- **Spring Boot layered architecture**: controllers, services, repositories, DTOs, and why separation of concerns matters
- **JWT authentication flow**: how tokens are generated, validated, and passed via Authorization headers
- **React + DnD Kit**: implementing drag & drop with `@dnd-kit/core` and `@dnd-kit/sortable` for Kanban columns
- **CORS and reverse proxies**: why configuring CORS in Spring Boot (dev) vs Nginx reverse proxy (production) are two valid approaches

## License

This project is for portfolio purposes.
