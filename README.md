# Cine App — Sistema de Gestión de Cartelera y Reservas

Sistema web completo para gestión de cartelera y reserva de asientos de cine.

## Estructura del proyecto

```
cine-app/
├── backend/     # NestJS API REST
└── frontend/    # React SPA
```

## Inicio rápido

### 1. Base de datos

```sql
CREATE DATABASE cine_db;
```

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
# Editar .env con las credenciales de PostgreSQL
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Accesos

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs

## Credenciales de administrador

Registrar un usuario y actualizar manualmente su rol a ADMIN en PostgreSQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@cine.com';
```

O registrarse directamente con la API indicando role: 'ADMIN' en el body del registro.
