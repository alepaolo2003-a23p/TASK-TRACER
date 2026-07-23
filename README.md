<div align="center">
  <h1>⚡ Stride</h1>
  <p><strong>Aplicación full-stack de gestión de tareas con tablero Kanban, autenticación JWT y despliegue en la nube</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Java-21-%23ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
    <img src="https://img.shields.io/badge/Spring_Boot-3.3-%236DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3.3">
    <img src="https://img.shields.io/badge/React-18-%2361DAFB?logo=react&logoColor=white" alt="React 18">
    <img src="https://img.shields.io/badge/PostgreSQL-16-%234169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
    <img src="https://img.shields.io/badge/Railway-deploy-%230B0D0E?logo=railway" alt="Railway">
    <img src="https://img.shields.io/badge/Vercel-deploy-%23000000?logo=vercel" alt="Vercel">
  </p>
</div>

---

## 📑 Tabla de contenido

- [Visión general](#-visión-general)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Funcionalidades](#-funcionalidades)
- [Configuración local](#-configuración-local)
- [Uso](#-uso)
- [Documentación de la API](#-documentación-de-la-api)
- [Despliegue](#-despliegue)
- [Decisiones técnicas](#-decisiones-técnicas)
- [Mejoras y cambios implementados](#-mejoras-y-cambios-implementados)
- [Incidentes resueltos y buenas prácticas](#-incidentes-resueltos-y-buenas-prácticas)
- [Licencia](#-licencia)

---

## 📌 Visión general

**Stride** es una aplicación web personal de gestión de tareas, construida como proyecto full-stack de portafolio. Permite crear, organizar y dar seguimiento a tareas mediante un tablero Kanban visual con arrastrar y soltar, categorías con código de colores, niveles de prioridad y alertas de fecha límite.

El proyecto está diseñado para ejecutarse tanto **localmente** (desarrollo) como **en la nube** (demostración) usando Railway para el backend + base de datos y Vercel para el frontend.

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Base de datos** | PostgreSQL 16 |
| **Autenticación** | JWT (librería jjwt) |
| **Documentación API** | Swagger / OpenAPI (springdoc-openapi) |
| **Arrastrar y soltar** | @dnd-kit/core |
| **Despliegue** | Railway (backend + DB), Vercel (frontend) |

---

## 🏗 Arquitectura

### Desarrollo local

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Frontend       │      │   Backend        │      │   PostgreSQL     │
│   React + Vite   │─────▶│   Spring Boot    │─────▶│   localhost:5432 │
│   localhost:5173 │  ▲   │   localhost:8080 │      │   stride         │
└──────────────────┘  │   └──────────────────┘      └──────────────────┘
                      │
              Vite Proxy (vite.config.ts)
           /api → http://localhost:8080
```

### Producción (nube)

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Vercel         │      │   Railway        │      │   Railway        │
│   Frontend SPA   │─────▶│   Spring Boot    │─────▶│   PostgreSQL     │
│   .vercel.app    │  🌐  │   .railway.app   │      │   Gestionado     │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                          │
        │  Config CORS             │  Variables de entorno
        │  CORS_ORIGINS=https://   │  PGHOST, PGPORT, etc.
        │  tu-frontend.vercel.app  │
```

### Estructura del backend

```
backend/
├── src/main/java/com/aleprojects/tasktracker/
│   ├── controller/        # Endpoints REST (Auth, Task, Category)
│   ├── service/           # Capa de lógica de negocio
│   ├── repository/        # Acceso a datos JPA (Spring Data)
│   ├── model/entity/      # Entidades JPA (Task, Category, User)
│   ├── model/enums/       # TaskStatus, Priority
│   ├── dto/               # Objetos de solicitud/respuesta
│   ├── mapper/            # Convertidores entidad ↔ DTO
│   ├── security/          # Filtros JWT + configuración Spring Security
│   ├── exception/         # Manejo global de excepciones (@ControllerAdvice)
│   └── config/            # CORS, Swagger/OpenAPI
├── system.properties      # Versión de Java para Railway
├── nixpacks.toml          # Configuración de build para Railway
├── railway.json           # Configuración de despliegue Railway
└── pom.xml
```

### Estructura del frontend

```
frontend/
├── src/
│   ├── pages/             # Login, Register, Dashboard, Kanban, Categories
│   ├── components/        # Navbar, TaskCard, TaskForm, KanbanColumn
│   ├── services/          # Cliente API (Axios), auth, tasks, categories
│   ├── contexts/          # AuthContext, ThemeContext (modo oscuro)
│   └── types/             # Interfaces y enums de TypeScript
├── vercel.json            # Configuración SPA para Vercel
├── vite.config.ts         # Proxy de Vite hacia el backend
└── package.json
```

---

## ✨ Funcionalidades

### Principales
- ✅ CRUD completo de tareas (crear, leer, actualizar, eliminar)
- ✅ Tablero Kanban con arrastrar y soltar (TODO → IN_PROGRESS → DONE)
- ✅ Filtros por estado, prioridad y categoría
- ✅ Búsqueda de texto completo en títulos y descripciones
- ✅ Alertas visuales de fecha límite (vencida en rojo, por vencer en amarillo)
- ✅ Categorías con selector de color personalizado
- ✅ Autenticación JWT (registro / inicio de sesión)
- ✅ Documentación Swagger/OpenAPI
- ✅ Modo oscuro
- ✅ Interfaz completamente en español
- ✅ Diseño responsive con soporte táctil para dispositivos móviles

### Extras
- ⬜ Tareas recurrentes (modelo de base de datos listo)
- ⬜ Panel de estadísticas con gráficos
- ⬜ Notificaciones del navegador para tareas próximas a vencer

---

## 💻 Configuración local

### Requisitos previos

Instala estas herramientas **en este orden**:

| Herramienta | Versión | Descarga |
|---|---|---|
| **JDK** | 21 (LTS) | [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21) |
| **PostgreSQL** | 16 o 17 | [EDB PostgreSQL Installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) |
| **Node.js** | 18+ (LTS) | [nodejs.org](https://nodejs.org/) |

### Paso 1: Crear la base de datos

```powershell
psql -U postgres -c "CREATE DATABASE stride;"
```
*(Te pedirá la contraseña que pusiste al instalar PostgreSQL)*

### Paso 2: Configurar el acceso

Crea `backend/src/main/resources/application-local.yml` con tu contraseña:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/stride
    username: postgres
    password: TU_CONTRASEÑA_AQUI
```

> **⚠️ Este archivo está en `.gitignore`** — no se subirá a GitHub.

### Paso 3: Iniciar el backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

> `mvnw.cmd` descarga automáticamente Maven 3.9.8 si no lo tienes instalado.

### Paso 4: Iniciar el frontend

```powershell
cd frontend
npm install
npm run dev
```

### Paso 5: Abrir la aplicación

Navega a [http://localhost:5173](http://localhost:5173), regístrate y empieza a usar Stride.

### Inicio rápido (un solo comando)

Ejecuta `start.bat` desde la raíz del proyecto — abre ambos servicios en ventanas separadas:

```powershell
.\start.bat
```

### Consola H2 (si usas base de datos embebida)

Si quieres ejecutar sin PostgreSQL (para pruebas rápidas):

```yaml
# En application.yml, cambia datasource a:
spring:
  datasource:
    url: jdbc:h2:mem:stride
    username: sa
    password:
```

Luego accede a: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 🎮 Uso

### Flujo para primer uso

1. Abre la aplicación → redirigido a **Iniciar sesión**
2. Haz clic en **"Crear cuenta"** → regístrate con usuario, correo y contraseña
3. Ve a **Categorías** → crea categorías con colores (ej. Trabajo, Personal, Urgente)
4. Ve a **Tablero** o **Kanban** → crea tareas
5. Arrastra tareas entre columnas en el tablero **Kanban**
6. Usa los filtros para encontrar tareas rápidamente

### Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PGHOST` | `localhost` | Host de PostgreSQL |
| `PGPORT` | `5432` | Puerto de PostgreSQL |
| `PGDATABASE` | `stride` | Nombre de la base de datos |
| `PGUSER` | `postgres` | Usuario de la base de datos |
| `PGPASSWORD` | `postgres` | Contraseña de la base de datos |
| `JWT_SECRET` | *(incluido en código)* | Clave secreta para firmar JWT |
| `JWT_EXPIRATION_MS` | `86400000` | Vigencia del JWT (24h) |
| `CORS_ORIGINS` | `http://localhost:5173` | Orígenes CORS permitidos (separados por coma) |

---

## 📖 Documentación de la API

La documentación interactiva de la API está disponible en [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) cuando el backend está en ejecución.

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Crear un nuevo usuario |
| `POST` | `/api/auth/login` | Autenticarse y obtener token JWT |

**Registro:**
```json
{ "username": "demo", "password": "demo123", "email": "demo@test.com" }
```
**Respuesta:**
```json
{ "token": "eyJhbGci...", "userId": "uuid", "username": "demo", "email": "demo@test.com" }
```

### Tareas

Todos los endpoints de tareas requieren el encabezado `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/tasks` | Listar todas las tareas (con filtros) |
| `GET` | `/api/tasks/{id}` | Obtener tarea por ID |
| `POST` | `/api/tasks` | Crear una nueva tarea |
| `PUT` | `/api/tasks/{id}` | Actualizar una tarea |
| `PATCH` | `/api/tasks/{id}/status` | Actualizar solo el estado |
| `DELETE` | `/api/tasks/{id}` | Eliminar una tarea |

**Parámetros de consulta para `GET /api/tasks`:**
- `status=TODO` | `IN_PROGRESS` | `DONE`
- `priority=LOW` | `MEDIUM` | `HIGH`
- `categoryId=<uuid>`
- `search=<texto>` (busca en título y descripción)

**Crear tarea:**
```json
{
  "title": "Aprender Spring Boot",
  "description": "Completar el proyecto Stride",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-08-15",
  "categoryId": null,
  "recurring": false
}
```

**Actualizar estado (body como objeto JSON):**
```json
{ "status": "IN_PROGRESS" }
```

### Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/categories` | Listar todas las categorías |
| `POST` | `/api/categories` | Crear una categoría |
| `PUT` | `/api/categories/{id}` | Actualizar una categoría |
| `DELETE` | `/api/categories/{id}` | Eliminar una categoría |

**Crear categoría:**
```json
{ "name": "Trabajo", "color": "#6366f1" }
```

---

## 🚀 Despliegue

La aplicación está desplegada en dos plataformas:

| Servicio | Plataforma | Propósito |
|---|---|---|
| **Backend** | [Railway](https://railway.app) | API Spring Boot + base de datos PostgreSQL |
| **Frontend** | [Vercel](https://vercel.com) | Hospedaje estático de la SPA React |

### Desplegar Backend en Railway

#### 1. Crear cuenta en Railway
- Ve a [railway.app](https://railway.app) y regístrate con GitHub
- Instala la aplicación de Railway cuando se te solicite

#### 2. Crear el proyecto
- Haz clic en **New Project** → **Deploy from GitHub repo**
- Selecciona tu repositorio
- Railway detecta Maven y construye automáticamente

#### 3. Agregar base de datos PostgreSQL
- En el dashboard de Railway, haz clic en **New** → **Database** → **Add PostgreSQL**
- Railway inyecta automáticamente estas variables de entorno:
  - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

#### 4. Configurar variables de entorno
En el dashboard de Railway, ve a tu servicio backend → pestaña **Variables** y agrega:

| Variable | Valor | Por qué |
|---|---|---|
| `JWT_SECRET` | Genera una clave larga y aleatoria | Firma los tokens JWT de forma segura |
| `CORS_ORIGINS` | `https://tu-proyecto.vercel.app` | Permite al frontend llamar a la API |
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activa la configuración de PostgreSQL |
| `PGHOST` | *(inyectado por Railway)* | Host de PostgreSQL |
| `PGPORT` | *(inyectado por Railway)* | Puerto de PostgreSQL |
| `PGDATABASE` | *(inyectado por Railway)* | Nombre de la base de datos |
| `PGUSER` | *(inyectado por Railway)* | Usuario de la base de datos |
| `PGPASSWORD` | *(inyectado por Railway)* | Contraseña de la base de datos |

> **Nota:** Railway provee PostgreSQL mediante un **Plugin** que inyecta automáticamente las variables `PG*`. Verifica los nombres exactos en el dashboard después de agregar PostgreSQL.

#### 5. Desplegar
- Railway despliega automáticamente en cada push a la rama principal
- Tu backend estará disponible en `https://<tu-proyecto>.railway.app`

### Desplegar Frontend en Vercel

#### 1. Crear cuenta en Vercel
- Ve a [vercel.com](https://vercel.com) y regístrate con GitHub

#### 2. Importar el repositorio
- Haz clic en **Add New** → **Project**
- Selecciona tu repositorio
- Configura el proyecto:

| Configuración | Valor |
|---|---|
| **Framework Preset** | Vite (detección automática) |
| **Root Directory** | `frontend/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### 3. Configurar variables de entorno
En Vercel, ve a tu proyecto → **Settings** → **Environment Variables** y agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://<tu-backend>.railway.app` |

> **Importante:** Esto le indica al frontend dónde encontrar la API en producción. En desarrollo local usa el proxy de Vite.

#### 4. Desplegar
- Haz clic en **Deploy**
- Vercel construye y despliega automáticamente en cada push a la rama principal
- Tu frontend estará disponible en `https://<tu-proyecto>.vercel.app`

### Después del despliegue

1. Actualiza `CORS_ORIGINS` en Railway si es necesario
2. Regístrate a través del frontend desplegado
3. Verifica que todos los endpoints de la API funcionen

---

## 🧠 Decisiones técnicas

### ¿Por qué Spring Boot en lugar de Express/FastAPI?
Spring Boot proporciona infraestructura de nivel empresarial lista para usar: seguridad integrada (Spring Security), ORM (Spring Data JPA), validación (Bean Validation) y documentación de API (SpringDoc OpenAPI). Es ampliamente adoptado en el ecosistema Java.

### ¿Por qué PostgreSQL?
PostgreSQL es una base de datos relacional de nivel productivo con excelente soporte JSON, manejo de acceso concurrente y es la opción predeterminada para aplicaciones Spring Boot. También está disponible como servicio gestionado en Railway.

### ¿Por qué Railway + Vercel en lugar de una sola plataforma?
Railway es excelente para desplegar servicios backend con soporte JVM y PostgreSQL gestionado, ideal para Spring Boot. Vercel ofrece una experiencia de desarrollo superior para SPAs frontend estáticas con despliegues de vista previa instantáneos, CDN automática y configuración más simple.

### ¿Por qué Maven Wrapper?
Los scripts `mvnw.cmd` / `mvnw` descargan la versión correcta de Maven automáticamente, asegurando builds consistentes en todos los entornos (Windows local, Railway Linux CI) sin requerir instalación manual de Maven.

### ¿Por qué se eliminaron los builds multi-etapa con Docker?
Docker estaba planeado inicialmente pero no pudo instalarse en la máquina de desarrollo (limitación de versión de Windows). El proyecto se ejecuta de forma nativa. La contenedorización con Docker puede agregarse después como mejora incremental.

### ¿Por qué @dnd-kit en lugar de react-beautiful-dnd?
`react-beautiful-dnd` ya no recibe mantenimiento de Atlassian. `@dnd-kit` es la alternativa moderna y activamente mantenida, con soporte de primera clase para TypeScript, mejor accesibilidad y una API más flexible.

---

## 📋 Mejoras y cambios implementados

### Rebranding a Stride
- Cambio de nombre de "Task Tracker" a **Stride** con nueva identidad visual
- Paleta de colores oscura y moderna: fondo `#0F0F14`, superficies `#1A1A22`, primario `#7C5CFC`, secundario `#3DD9C4`, alerta `#FF6B6B`
- Tipografía Inter de Google Fonts para una apariencia limpia y profesional

### Diseño responsive y soporte táctil
- Tablero Kanban adaptable a dispositivos móviles con columnas apiladas verticalmente (una debajo de otra) en lugar de scroll horizontal
- Cada columna del Kanban se puede colapsar/expandir con un chevron, permitiendo enfocarse en columnas específicas sin scrollear
- Resumen compacto de conteo de tareas en la parte superior del Kanban en móvil ("3 en Por hacer · 5 en En progreso · 2 en Completado")
- Límite de 8 tarjetas visibles por columna con botón "Ver más" para expandir si hay muchas tareas, evitando que una columna domine toda la pantalla
- Transiciones suaves CSS al expandir/colapsar columnas
- Soporte de arrastrar y soltar táctil mediante PointerSensor + TouchSensor de @dnd-kit
- Navbar responsive con menú hamburguesa en pantallas pequeñas
- Formularios y tarjetas optimizados para interacción táctil (altura mínima de 44px en botones)

### Traducción completa a español
- Interfaz de usuario del frontend completamente traducida (formularios, botones, columnas Kanban, estados, prioridades, mensajes de error, tooltips, placeholders)
- Mensajes de error del backend traducidos (AuthService, GlobalExceptionHandler, ResourceNotFoundException)
- Mensajes de las capas de servicio ("Tarea" en lugar de "Task", "Categoría" en lugar de "Category")
- README.md traducido y documentado en español
- Etiquetas de prioridad: ALTA, MEDIA, BAJA
- Etiquetas de estado: Por hacer, En progreso, Completado

---

## 🔧 Incidentes resueltos y buenas prácticas

### Arranque en producción
- El comando de arranque en producción debe usar siempre el JAR empaquetado (`java -jar target/*.jar`), nunca `mvnw spring-boot:run` — este último arrastra spring-boot-devtools y provoca reinicios del contexto de Spring que pueden dejar el esquema de base de datos en un estado inconsistente.
- Verificar que `spring-boot-devtools` tenga scope `runtime` y `optional: true` en el pom.xml, y confirmar que no esté presente en el JAR final de producción.

### Configuración de base de datos
- Las variables de entorno de Spring Boot (ej. `SPRING_DATASOURCE_URL`) tienen prioridad sobre lo definido en `application.yml` — evitar duplicar/mezclar ambas fuentes de configuración para no generar confusión.
- Recomendable usar `hibernate.hbm2ddl.halt_on_error: true` para que errores de DDL fallen de forma visible en el arranque, en vez de quedar como warnings silenciosos.
- Usar `ddl-auto: update` en producción (no `create-drop`) para evitar la pérdida de datos en reinicios.

### Frontend y variables de entorno
- Las variables `VITE_*` del frontend se inyectan en tiempo de build, no en runtime — cualquier cambio requiere un redeploy completo, no solo reiniciar el servicio.
- Toda variable de entorno que sea una URL completa debe incluir el protocolo (`https://`) explícitamente, para evitar que se interprete como ruta relativa.

### CORS y seguridad
- Configurar CORS correctamente requiere tanto permitir orígenes en la configuración como habilitar `.cors()` en Spring Security — falta cualquiera de los dos produce error 403.
- El endpoint `/error` de Spring Boot debe estar explícitamente permitido en Spring Security para poder ver los mensajes de error reales; de lo contrario Spring Security lo intercepta y devuelve un 403 genérico.

### API y comunicación
- El endpoint `PATCH /api/tasks/{id}/status` debe recibir un objeto JSON `{ "status": "..." }`, no un string plano — el frontend y el backend deben acordar el formato del body.
- Cualquier endpoint protegido por JWT debe probarse en Swagger usando el botón "Authorize" con el token completo, o se obtendrá 403 aunque el token sea válido.
- Los nombres de los campos en los JSON de respuesta son un contrato de API — mantenerlos en inglés aunque la interfaz de usuario esté en español.

---

## 📄 Licencia

Este proyecto está construido con fines de portafolio. Siéntete libre de usarlo como referencia para tu propio aprendizaje.

---

<div align="center">
  <p>
    <a href="#-tabla-de-contenido">Volver al inicio</a>
  </p>
  <p>
    Construido con ☕ y Spring Boot · © 2026
  </p>
</div>
