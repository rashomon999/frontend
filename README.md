# Division:

# División equilibrada — 3 personas

## Persona 1 (tú) — Base + Autenticación + WebSockets

- `axios.ts`
- `authSlice`
- `store`
- `ProtectedRoute`
- `AppRouter` ✅
- `notificationService.ts`
- Conectar WebSockets en `App.tsx`
- `NotificationToast`
- `LoginPage`
- `CoachingPage` ✅ ya tienes base

---

## Persona 2 — Páginas de usuario

- `DashboardPage`
  - Bienvenida
  - Gráficos de progreso con Recharts
- `ProgressPage`
  - Registrar progreso
  - Ver historial
- `ProgressForm`
- `ProgressChart`
- `ExercisesPage` ✅ ya tienes base, ajustes finales

---

## Persona 3 — Páginas de admin/entrenador + calidad

- `UsersPage`
  - Listar usuarios
  - Gestionar roles
  - Asignar entrenadores
- `SpacesPage`
  - Crear espacios
  - Listar eventos
- `RoutinesPage` ✅ ya tienes base, ajustes finales
- Configuración de:
  - ESLint
  - Husky
  - README

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
