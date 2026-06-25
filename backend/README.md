# Cine App — Backend

API REST del sistema de gestión de cartelera y reservas de cine.

## Stack

- **Framework**: NestJS 10
- **Lenguaje**: TypeScript (strict)
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger
- **Upload**: Multer

## Prerequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
copy .env.example .env
```

## Configuración

Editar el archivo `.env` con los valores correspondientes:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=cine_db

JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRATION=7d

APP_PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Base de datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE cine_db;
```

Las tablas se crean automáticamente mediante TypeORM `synchronize: true`.

## Ejecución

```bash
# Desarrollo (hot reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Documentación API

Swagger disponible en: `http://localhost:3000/api/docs`

## Estructura de módulos

```
src/
├── auth/           # Registro, login, JWT, estrategias
├── users/          # Entidad usuario, perfil
├── movies/         # CRUD películas, upload poster
├── rooms/          # CRUD salas
├── showtimes/      # CRUD funciones, validación solapamiento
├── reservations/   # Reservas transaccionales, mapa de asientos
└── common/         # Guards, decoradores, filtros globales
```

## Endpoints principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |
| GET | /users/profile | Perfil propio | JWT |
| GET | /movies | Cartelera (filtros title/genre) | No |
| GET | /movies/:id | Detalle película + funciones | No |
| POST | /movies | Crear película | ADMIN |
| PUT | /movies/:id | Actualizar película | ADMIN |
| DELETE | /movies/:id | Eliminar película | ADMIN |
| PATCH | /movies/:id/poster | Subir poster | ADMIN |
| GET | /rooms | Listar salas | No |
| POST | /rooms | Crear sala | ADMIN |
| PUT | /rooms/:id | Actualizar sala | ADMIN |
| DELETE | /rooms/:id | Eliminar sala | ADMIN |
| GET | /showtimes | Listar funciones | No |
| POST | /showtimes | Crear función | ADMIN |
| PUT | /showtimes/:id | Actualizar función | ADMIN |
| DELETE | /showtimes/:id | Eliminar función | ADMIN |
| POST | /reservations | Crear reserva | JWT |
| GET | /reservations/my | Mis reservas | JWT |
| GET | /reservations/showtime/:id/seats | Asientos ocupados | No |
| PATCH | /reservations/:id/cancel | Cancelar reserva | JWT |

## Roles

- **ADMIN**: Gestión completa de películas, salas y funciones
- **CLIENT**: Reservar entradas y ver sus reservas

## Archivos estáticos

Los posters se almacenan en `uploads/posters/` y se sirven en `/uploads/posters/filename.jpg`.
