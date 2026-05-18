import { useEffect, useState, useCallback } from "react";
import { getUsers, UserResponse } from "../../services/userService";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import Navbar from "../../components/Navbar";

type RoleColor = "error" | "warning" | "primary";

const getRoleColor = (role: string): RoleColor => {
  if (role === "ADMIN") return "error";
  if (role === "TRAINER") return "warning";
  return "primary";
};

function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Error al cargar los usuarios. Verifique su conexión o permisos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Typography variant="h4">Gestión de Usuarios</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre Completo</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo Institucional</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rol</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay usuarios disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{`${u.firstName} ${u.lastName}`}</TableCell>
                      <TableCell>{u.institutionalEmail}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          color={getRoleColor(u.role)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
}

export default UsersPage;