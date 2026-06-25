# Cine App — Frontend

SPA (Single Page Application) del sistema de gestión de cartelera y reservas de cine.

## Stack

- **Framework**: React 18
- **Lenguaje**: TypeScript (strict)
- **Enrutamiento**: React Router DOM v6
- **HTTP**: Axios
- **UI**: Bootstrap 5 + Bootstrap Icons
- **Build**: Vite 5

## Prerequisitos

- Node.js >= 18
- Backend corriendo en http://localhost:3000

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build
```

## Páginas disponibles

| Ruta | Página | Acceso |
|------|---------|--------|
| `/` | Cartelera | Público |
| `/movies/:id` | Detalle de película + Reserva | Público |
| `/login` | Iniciar sesión | Público |
| `/register` | Registrarse | Público |
| `/mis-reservas` | Historial de reservas | Autenticado |
| `/admin/peliculas` | CRUD Películas | ADMIN |
| `/admin/salas` | CRUD Salas | ADMIN |
| `/admin/funciones` | CRUD Funciones | ADMIN |

## Estructura

```
src/
├── api/            # Instancia Axios con interceptores JWT y 401 redirect
├── context/        # AuthContext con persistencia en localStorage
├── hooks/          # useApiError para mensajes de error en español
├── layouts/        # MainLayout con Navbar y Footer
├── pages/          # Páginas de la aplicación
├── components/     # Componentes reutilizables
├── routes/         # AppRouter con ProtectedRoute y AdminRoute
├── services/       # Servicios de API por dominio
└── types/          # Interfaces y enums TypeScript
```

## Componentes principales

| Componente | Descripción |
|---|---|
| `Navbar` | Navegación adaptable con dropdown de admin |
| `MovieCard` | Tarjeta de película con poster/placeholder |
| `SeatMap` | Mapa interactivo de asientos (disponible/ocupado/seleccionado) |
| `SearchBar` | Búsqueda por título con debounce |
| `GenreFilter` | Filtro desplegable por género |
| `ConfirmDialog` | Modal de confirmación reutilizable |
| `Pagination` | Paginación de listas |
| `LoadingSpinner` | Indicador de carga centralizado |

## Características

- Diseño oscuro premium inspirado en aplicaciones de cine
- Responsive / Mobile First con Bootstrap 5
- Autenticación con JWT + persistencia en localStorage
- Logout automático cuando el token expira (interceptor 401)
- Mapa de asientos interactivo con indicadores visuales
- Búsqueda con debounce 400ms para no saturar la API
- Formularios admin con validación y mensajes en español
- Transacciones de reserva con detección de asientos ocupados
