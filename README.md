# División por rol de usuario

## Persona 1 — Vistas de Usuario (estudiante)

- `LoginPage`
- `DashboardPage`
  - Bienvenida
  - Gráficos de progreso
- `ProgressPage`
  - Registrar progreso
  - Ver historial
- `ProgressForm`
- `ProgressChart`
- `ExercisesPage` ✅ ya tienes base

---

## Persona 2 — Vistas de Entrenador

- `CoachingPage` ✅ ya tienes base
- Ver progreso de estudiantes asignados
- Enviar recomendaciones
- Subir rutinas prediseñadas

---

## Persona 3 — Vistas de Admin + Base técnica

- `UsersPage`
  - Gestionar usuarios
  - Gestionar roles
- `SpacesPage`
  - Espacios y eventos
- `RoutinesPage` ✅ ya tienes base
- `axios.ts`
- `authSlice`
- `store`
- `ProtectedRoute`
- `AppRouter` ✅
- `notificationService.ts`
- `NotificationToast`
- Configuración de:
  - ESLint
  - Husky
  - README

---
# Matriz de funcionalidades por rol

| Entidad | ADMIN | TRAINER | USER | ¿Página existe? |
|---|---|---|---|---|
| Auth | Login | Login | Login | ✅ LoginPage |
| Users | CRUD completo | — | Ver perfil propio | ✅ UsersPage (confirmar si tiene crear/editar/eliminar) |
| Roles | CRUD completo | — | — | ❌ Sin página |
| Permissions | CRUD completo | — | — | ❌ Sin página |
| Spaces | CRUD completo | Ver | Ver | ✅ SpacesPage (confirmar si admin puede crear/editar) |
| Activities | CRUD completo | Ver | Ver + Inscribirse | ✅ ActivitiesPage |
| Schedules | CRUD completo | Ver | Ver | ❌ Sin página (servicio existe) |
| Enrollments | Ver todos | — | Inscribirse / ver los suyos | ❌ Sin página (servicio existe) |
| Exercises | CRUD completo | CRUD completo | Ver | ✅ ExercisesPage (confirmar permisos) |
| Routines | CRUD completo | Crear prediseñadas / ver todas | Crear propias / ver prediseñadas | ✅ RoutinesPage |
| RoutineExercise | CRUD completo | Agregar ejercicios a rutinas | Ver ejercicios de su rutina | ❌ Sin página/modal (servicio existe) |
| Progress | Ver todos | Ver de sus asignados | Crear / ver / gráficos | ✅ ProgressPage |
| Recommendations | Ver todas | Crear / ver las que emite | Ver las que recibe | ✅ RecommendationsPage |
| Coaching | Gestionar asignaciones trainer ↔ user | Ver sus asignados | — | ✅ CoachingPage (confirmar) |
| Notifications | Enviar a todos | Enviar a sus asignados | Recibir en tiempo real | ⚠️ NotificationToast + NotificationBell (sin WebSocket activo) |

---
# Compartido entre los 3

- Commits en GitHub obligatorio
- Sustentación presencial — todos deben entender todo
- Video de demostración

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
