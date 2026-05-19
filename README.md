# Matriz de Trazabilidad — Frontend React SPA
**Taller 5 · Computación en Internet II**  
**Entrega:** miércoles, 3 de junio de 2026  
**Proyecto:** Aplicación de actividad física — Universidad Icesi  
**Stack:** Vite + React + TypeScript · Axios · Redux Toolkit · React Router DOM · WebSockets

---

## Estructura de carpetas propuesta

```
src/
├── App.tsx
├── main.tsx
├── api/
│   └── axios.ts                        # Instancia Axios + interceptor JWT
├── assets/
│   └── images/
│       └── exercises/
├── components/
│   ├── ActivityCard.tsx
│   ├── CoachingCard.tsx                # NUEVO
│   ├── EnrollmentCard.tsx              # NUEVO
│   ├── EventCard.tsx
│   ├── ExerciseCard.tsx
│   ├── Navbar.tsx
│   ├── NotificationBell.tsx
│   ├── NotificationToast.tsx
│   ├── RecommendationCard.tsx
│   ├── RoutineCard.tsx
│   ├── ScheduleCard.tsx                # NUEVO
│   ├── SpaceCard.tsx                   # NUEVO
│   ├── auth/
│   │   └── ProtectedRoute.tsx          # Con soporte de roles
│   └── progress/
│       ├── ProgressChart.tsx
│       └── ProgressForm.tsx
├── hooks/
│   ├── useAuth.ts                      # NUEVO
│   ├── useNotifications.ts
│   ├── useRoutines.ts                  # NUEVO
│   └── useExercises.ts                 # NUEVO
├── pages/
│   ├── activities/
│   │   └── ActivitiesPage.tsx
│   ├── admin/
│   │   └── AdminPage.tsx               # NUEVO
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── coaching/
│   │   └── CoachingPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── enrollments/
│   │   └── EnrollmentsPage.tsx         # NUEVO
│   ├── exercises/
│   │   └── ExercisesPage.tsx
│   ├── progress/
│   │   └── ProgressPage.tsx
│   ├── recommendations/
│   │   └── RecommendationsPage.tsx
│   ├── routines/
│   │   └── RoutinesPage.tsx
│   ├── schedules/
│   │   └── SchedulesPage.tsx           # NUEVO
│   ├── spaces/
│   │   └── SpacesPage.tsx
│   └── users/
│       └── UsersPage.tsx
├── routes/
│   └── AppRouter.tsx
├── services/
│   ├── activityService.ts
│   ├── authService.ts
│   ├── coachingService.ts
│   ├── enrollmentService.ts
│   ├── exerciseService.ts
│   ├── notificationService.ts
│   ├── progressService.ts
│   ├── recommendationService.ts
│   ├── routineExerciseService.ts
│   ├── routineService.ts
│   ├── scheduleService.ts
│   ├── spaceService.ts
│   ├── userService.ts
│   └── websocketService.ts
├── store/
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       └── notificationSlice.ts
└── utils/
    └── jwt.ts
```

---

## División del trabajo

| Integrante | Área principal | Peso aprox. |
|---|---|---|
| **Integrante 1** | Infraestructura, calidad de código, autenticación y rutas | ~35% |
| **Integrante 2** | Páginas y componentes de usuario y entrenador | ~35% |
| **Integrante 3** | Servicios API, diseño global, extras (Redux + WebSockets) | ~30% |

---

## Integrante 1 — Infraestructura, autenticación y calidad de código

### 1.1 Configuración base del proyecto

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I1-01 | Inicializar proyecto con `npm create vite@latest -- --template react-ts` | `package.json`, `vite.config.ts`, `tsconfig.json` |
| I1-02 | Instalar dependencias principales: `react-router-dom`, `axios`, `@reduxjs/toolkit`, `redux-persist` | `package.json` |
| I1-03 | Instalar librería de estilos (TailwindCSS recomendado) y configurar | `tailwind.config.js`, `index.css` |
| I1-04 | Configurar `tsconfig.json` en modo estricto (`"strict": true`) | `tsconfig.json` |

### 1.2 Calidad de código — ESLint y Husky (Requerimiento 2 del taller — 10%)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I1-05 | Instalar ESLint y plugins: `eslint`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks` | `package.json` |
| I1-06 | Crear `eslint.config.js` con reglas: `no-unused-vars`, `no-console`, `@typescript-eslint/no-explicit-any`, `react-hooks/rules-of-hooks` | `eslint.config.js` |
| I1-07 | Agregar script `"lint": "eslint src --ext .ts,.tsx"` en package.json | `package.json` |
| I1-08 | Instalar Husky y lint-staged: `npm install --save-dev husky lint-staged` e inicializar con `npx husky init` | `.husky/`, `package.json` |
| I1-09 | Crear `.husky/pre-commit` que ejecute `lint-staged` sobre archivos `*.{ts,tsx}` | `.husky/pre-commit` |
| I1-10 | Crear `.husky/pre-push` que ejecute `npm run build` para verificar que el proyecto compila antes de cada push | `.husky/pre-push` |
| I1-11 | Configurar `lint-staged` en `package.json` apuntando a `eslint --fix` en archivos `.ts` y `.tsx` | `package.json` |

### 1.3 Axios e interceptor JWT (Requerimiento 3 del taller — parte)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I1-12 | Crear instancia Axios con `baseURL: "http://localhost:8081/compunet2-2026"` | `api/axios.ts` |
| I1-13 | Agregar interceptor de request que lea el token desde Redux persist y lo inyecte en `Authorization: Bearer <token>` | `api/axios.ts` |
| I1-14 | Agregar interceptor de response que en 401 limpie el storage y redirija a `/login` | `api/axios.ts` |

### 1.4 Autenticación y rutas protegidas (Requerimiento 1 y 3 del taller)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I1-15 | Implementar `authService.ts`: función `login(email, password)` que llama a `POST /rest/auth/login` y retorna el token | `services/authService.ts` |
| I1-16 | Implementar `LoginPage.tsx` con formulario de email y contraseña, manejo de error y dispatch a Redux | `pages/auth/LoginPage.tsx` |
| I1-17 | Crear `authSlice.ts` con estado `{ token, user, role }`, actions `setCredentials` y `logout` | `store/slices/authSlice.ts` |
| I1-18 | Configurar `store/index.ts` con Redux Toolkit + `redux-persist` (persistir slice de auth en localStorage) | `store/index.ts` |
| I1-19 | Crear `utils/jwt.ts` con función `decodeToken(token)` que extrae `role`, `sub` y `exp` | `utils/jwt.ts` |
| I1-20 | Crear hook `useAuth.ts` que retorna `{ token, role, user, isAuthenticated }` desde el store | `hooks/useAuth.ts` |
| I1-21 | Implementar `ProtectedRoute.tsx` con prop `allowedRoles: string[]`; redirige a `/login` si no autenticado y a `/unauthorized` si el rol no coincide | `components/auth/ProtectedRoute.tsx` |
| I1-22 | Implementar `AppRouter.tsx` con todas las rutas de la app, protegidas según rol: `ROLE_USER`, `ROLE_TRAINER`, `ROLE_ADMIN` | `routes/AppRouter.tsx` |

**Tabla de roles por ruta:**

| Ruta | Roles permitidos |
|---|---|
| `/login` | Público |
| `/dashboard` | USER, TRAINER, ADMIN |
| `/exercises` | USER, TRAINER, ADMIN |
| `/routines` | USER, TRAINER, ADMIN |
| `/progress` | USER, TRAINER |
| `/coaching` | TRAINER, ADMIN |
| `/recommendations` | USER, TRAINER |
| `/activities` | USER, TRAINER, ADMIN |
| `/spaces` | USER, TRAINER, ADMIN |
| `/schedules` | USER, TRAINER, ADMIN |
| `/enrollments` | USER |
| `/users` | ADMIN |
| `/admin` | ADMIN |

---

## Integrante 2 — Páginas y componentes

### 2.1 Componentes reutilizables (Requerimiento 1.1 del taller — 50%)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I2-01 | Implementar `Navbar.tsx` con links de navegación según rol, botón logout y `NotificationBell` integrada | `components/Navbar.tsx` |
| I2-02 | Implementar `ExerciseCard.tsx` con props: `name`, `type`, `duration`, `difficulty`, `description` | `components/ExerciseCard.tsx` |
| I2-03 | Implementar `RoutineCard.tsx` con props: `name`, `description`, `exerciseCount`, botón ver detalle | `components/RoutineCard.tsx` |
| I2-04 | Implementar `ActivityCard.tsx` con props: `title`, `date`, `location`, `type` | `components/ActivityCard.tsx` |
| I2-05 | Implementar `EventCard.tsx` con props: `title`, `schedule`, `space`, `availableSpots` | `components/EventCard.tsx` |
| I2-06 | Implementar `SpaceCard.tsx` con props: `name`, `capacity`, `schedule`, `type` | `components/SpaceCard.tsx` |
| I2-07 | Implementar `CoachingCard.tsx` con props: `trainerEmail`, `userEmail`, botones de eliminar asignación | `components/CoachingCard.tsx` |
| I2-08 | Implementar `RecommendationCard.tsx` con props: `content`, `trainerEmail`, `date` | `components/RecommendationCard.tsx` |
| I2-09 | Implementar `ScheduleCard.tsx` con props: `activityName`, `startTime`, `endTime`, `spaceName` | `components/ScheduleCard.tsx` |
| I2-10 | Implementar `ProgressForm.tsx` con campos: repeticiones, tiempo, nivel de esfuerzo, fecha; submit a `progressService` | `components/progress/ProgressForm.tsx` |
| I2-11 | Implementar `ProgressChart.tsx` con recharts (`LineChart`) mostrando progreso semanal/mensual del usuario | `components/progress/ProgressChart.tsx` |

### 2.2 Páginas de usuario (Requerimiento 1.2 del taller)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I2-12 | Implementar `DashboardPage.tsx`: resumen de rutinas activas, último progreso, próximos eventos, accesos rápidos | `pages/dashboard/DashboardPage.tsx` |
| I2-13 | Implementar `ExercisesPage.tsx`: listar ejercicios con `ExerciseCard`, filtro por tipo (cardio/fuerza/movilidad), formulario de creación (solo TRAINER/ADMIN) | `pages/exercises/ExercisesPage.tsx` |
| I2-14 | Implementar `RoutinesPage.tsx`: listar rutinas del usuario, ver detalle con ejercicios, adoptar rutina prediseñada | `pages/routines/RoutinesPage.tsx` |
| I2-15 | Implementar `ProgressPage.tsx`: formulario de registro (`ProgressForm`) + gráfica de historial (`ProgressChart`) + listado de entradas pasadas | `pages/progress/ProgressPage.tsx` |
| I2-16 | Implementar `ActivitiesPage.tsx`: listar actividades disponibles con `ActivityCard`, botón inscribirse (llama a enrollmentService) | `pages/activities/ActivitiesPage.tsx` |
| I2-17 | Implementar `SpacesPage.tsx`: listar espacios con `SpaceCard` y sus horarios asociados | `pages/spaces/SpacesPage.tsx` |
| I2-18 | Implementar `SchedulesPage.tsx`: tabla o calendario de horarios usando `ScheduleCard` | `pages/schedules/SchedulesPage.tsx` |
| I2-19 | Implementar `EnrollmentsPage.tsx`: inscripciones activas del usuario, opción de cancelar | `pages/enrollments/EnrollmentsPage.tsx` |
| I2-20 | Implementar `RecommendationsPage.tsx`: usuario ve recomendaciones recibidas; entrenador puede crear nuevas con formulario | `pages/recommendations/RecommendationsPage.tsx` |
| I2-21 | Implementar `CoachingPage.tsx`: listar asignaciones entrenador–usuario con `CoachingCard`, crear y eliminar asignaciones (solo TRAINER/ADMIN) | `pages/coaching/CoachingPage.tsx` |
| I2-22 | Implementar `UsersPage.tsx`: tabla de usuarios con roles, editar y eliminar (solo ADMIN) | `pages/users/UsersPage.tsx` |
| I2-23 | Implementar `AdminPage.tsx`: panel con accesos directos a gestión de usuarios, ejercicios, entrenadores y espacios (solo ADMIN) | `pages/admin/AdminPage.tsx` |

---

## Integrante 3 — Servicios API, diseño global y extras

### 3.1 Servicios REST — consumo del API (Requerimiento 3 del taller — 30%)

Todos los servicios siguen la misma estructura base y se conectan al backend Spring Boot en `/rest/{entidad}`.

| ID | Tarea | Endpoint backend | Archivo |
|---|---|---|---|
| I3-01 | `userService.ts`: getAll, getById, create, update, deleteById | `GET/POST /rest/users`, `GET/PUT/DELETE /rest/users/{id}` | `services/userService.ts` |
| I3-02 | `exerciseService.ts`: getAll, getById, create, update, deleteById | `GET/POST /rest/exercises`, `GET/PUT/DELETE /rest/exercises/{id}` | `services/exerciseService.ts` |
| I3-03 | `routineService.ts`: getAll, getById, create, update, deleteById | `GET/POST /rest/routines`, `GET/PUT/DELETE /rest/routines/{id}` | `services/routineService.ts` |
| I3-04 | `routineExerciseService.ts`: getByRoutine, addExercise, removeExercise | `GET /rest/routine-exercises/routine/{id}`, `POST/DELETE /rest/routine-exercises/{routineId}/{exerciseId}` | `services/routineExerciseService.ts` |
| I3-05 | `progressService.ts`: getByUser, create, update, deleteById | `GET /rest/progress/user/{id}`, `POST /rest/progress`, `PUT/DELETE /rest/progress/{id}` | `services/progressService.ts` |
| I3-06 | `activityService.ts`: getAll, getById, create, update, deleteById | `GET/POST /rest/activities`, `GET/PUT/DELETE /rest/activities/{id}` | `services/activityService.ts` |
| I3-07 | `enrollmentService.ts`: getByUser, enroll, cancelEnrollment | `GET /rest/enrollments/user/{id}`, `POST /rest/enrollments`, `DELETE /rest/enrollments/{id}` | `services/enrollmentService.ts` |
| I3-08 | `spaceService.ts`: getAll, getById, create, update, deleteById | `GET/POST /rest/spaces`, `GET/PUT/DELETE /rest/spaces/{id}` | `services/spaceService.ts` |
| I3-09 | `scheduleService.ts`: getAll, getBySpace, create, update, deleteById | `GET/POST /rest/schedules`, `GET /rest/schedules/space/{id}`, `PUT/DELETE /rest/schedules/{id}` | `services/scheduleService.ts` |
| I3-10 | `coachingService.ts`: getAll, getByUser, getByTrainer, create, delete | `GET /rest/coachings`, `GET /rest/coachings/user/{id}`, `GET /rest/coachings/trainer/{id}`, `POST /rest/coachings`, `DELETE /rest/coachings/{trainerId}/{userId}` | `services/coachingService.ts` |
| I3-11 | `recommendationService.ts`: getByUser, getByTrainer, create, deleteById | `GET /rest/recommendations/user/{id}`, `GET /rest/recommendations/trainer/{id}`, `POST /rest/recommendations`, `DELETE /rest/recommendations/{id}` | `services/recommendationService.ts` |
| I3-12 | `notificationService.ts`: getByUser, markAsRead | `GET /rest/notifications/user/{id}`, `PUT /rest/notifications/{id}/read` | `services/notificationService.ts` |

### 3.2 Diseño global de la aplicación (Requerimiento 4 del taller — 10%)

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I3-13 | Definir paleta de colores y variables CSS globales coherentes con temática fitness/universitaria | `index.css` |
| I3-14 | Diseñar layout principal: sidebar o navbar superior, área de contenido, footer | `App.tsx`, `Navbar.tsx` |
| I3-15 | Aplicar estilos responsivos en todas las páginas (mobile y desktop) | Todos los `.tsx` de páginas |
| I3-16 | Usar imágenes de `assets/images/exercises/` en `ExercisesPage` y `DashboardPage` | `ExercisesPage.tsx`, `DashboardPage.tsx` |

### 3.3 Redux y persistencia — Extra +5%

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I3-17 | Configurar `store/index.ts` con `configureStore` + `persistStore` + `persistReducer` | `store/index.ts` |
| I3-18 | Envolver la app con `PersistGate` en `main.tsx` | `main.tsx` |
| I3-19 | Crear `notificationSlice.ts` con estado `{ notifications: [], unreadCount: 0 }` y actions `addNotification`, `markAsRead`, `clearAll` | `store/slices/notificationSlice.ts` |

### 3.4 WebSockets — Extra +15%

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I3-20 | Instalar librería STOMP: `npm install @stomp/stompjs sockjs-client` | `package.json` |
| I3-21 | Implementar `websocketService.ts`: conectar al endpoint `ws://localhost:8081/compunet2-2026/ws`, suscribirse a `/topic/notifications` | `services/websocketService.ts` |
| I3-22 | Implementar hook `useNotifications.ts` que inicia la conexión WS al montar y despacha al `notificationSlice` cada mensaje recibido | `hooks/useNotifications.ts` |
| I3-23 | Implementar `NotificationBell.tsx`: ícono con badge del contador de no leídas, dropdown con lista de notificaciones | `components/NotificationBell.tsx` |
| I3-24 | Implementar `NotificationToast.tsx`: componente que aparece por 4 segundos al recibir notificación nueva en tiempo real | `components/NotificationToast.tsx` |

### 3.5 Despliegue — Factor multiplicativo

| ID | Tarea | Archivos involucrados |
|---|---|---|
| I3-25 | Ejecutar `npm run build` y verificar que el directorio `dist/` se genera sin errores | `dist/` |
| I3-26 | Copiar contenido de `dist/` al directorio `webapps/` del Tomcat del servidor | Servidor |
| I3-27 | Coordinar con backend para que CORS acepte el dominio de producción | `CorsConfig.java` (backend) |

---

## Resumen de requerimientos del taller vs tareas

| Requerimiento | Valor | Responsable | IDs de tareas |
|---|---|---|---|
| 1.1 Componentes reutilizables | 50% | Integrante 2 | I2-01 a I2-11 |
| 1.2 Páginas de la aplicación | 50% | Integrante 2 | I2-12 a I2-23 |
| 1.3 Hooks de React | 50% | Integrantes 1 y 2 | I1-20, I2-10, I2-11 |
| 1.4 Librería de estilos | 50% | Integrante 3 | I3-13 a I3-16 |
| 1.5 react-router-dom | 50% | Integrante 1 | I1-21, I1-22 |
| 2.1 ESLint con reglas | 10% | Integrante 1 | I1-05 a I1-07 |
| 2.2 Husky pre-commit | 10% | Integrante 1 | I1-08, I1-09, I1-11 |
| 2.3 Husky pre-push | 10% | Integrante 1 | I1-10 |
| 3.1 Axios para llamado al API | 30% | Integrante 3 | I3-01 a I3-12 |
| 3.2 Gestión del token JWT | 30% | Integrante 1 | I1-12 a I1-14, I1-17 a I1-19 |
| 3.3 Restricción por rol (wrapper) | 30% | Integrante 1 | I1-21, I1-22 |
| 4. Diseño de la aplicación | 10% | Integrante 3 | I3-13 a I3-16 |
| Extra: Redux + persistencia | +5% | Integrante 3 | I3-17 a I3-19 |
| Extra: Migración Vite-TS | +10% | Integrante 1 | I1-01, I1-04, I1-06 |
| Extra: WebSockets | +15% | Integrante 3 | I3-20 a I3-24 |
| Despliegue (multiplicativo) | × | Integrante 3 | I3-25 a I3-27 |