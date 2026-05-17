import { getUserFromToken } from "../../utils/jwt";

function DashboardPage() {
  const user = getUserFromToken();

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Bienvenido {user?.email}</h2>

      <h3>Rol: {user?.role}</h3>

      {user?.role === "ADMIN" && (
        <div>
          <h2>Panel Administrativo</h2>
        </div>
      )}

      {user?.role === "USER" && (
        <div>
          <h2>Panel de Usuario</h2>
        </div>
      )}

      {user?.role === "TRAINER" && (
        <div>
          <h2>Panel de Entrenador</h2>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;