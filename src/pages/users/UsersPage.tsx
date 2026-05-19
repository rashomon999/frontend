import { useCallback, useEffect, useState } from "react";
import {
  getUsers, updateUser, deleteUser, UserResponse,
} from "../../services/userService";
import {
  getCoachingAssignments, createCoachingAssignment, deleteCoachingAssignment,
  CoachingResponse,
} from "../../services/Coachingservice";
import {
  Container, Typography, Box, CircularProgress, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Tooltip, Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import Navbar from "../../components/Navbar";

type RoleColor = "error" | "warning" | "primary";
const getRoleColor = (role: string): RoleColor => {
  if (role === "ADMIN") return "error";
  if (role === "TRAINER") return "warning";
  return "primary";
};

const ROLES = ["ADMIN", "TRAINER", "USER"];

// Role name → roleId según data.sql
const ROLE_ID: Record<string, number> = {
  ADMIN: 1,
  TRAINER: 2,
  USER: 3,
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [coaching, setCoaching] = useState<CoachingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", institutionalEmail: "", role: "", password: "",
  });

  // Assign trainer dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<UserResponse | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | "">("");

  const trainers = users.filter((u) => u.role === "TRAINER");
 
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [u, c] = await Promise.all([getUsers(), getCoachingAssignments()]);
      setUsers(u);
      setCoaching(c);
    } catch {
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Edit ──────────────────────────────────────────────────────
  const handleOpenEdit = (u: UserResponse) => {
    setEditingUser(u);
    setEditForm({
      firstName: u.firstName,
      lastName: u.lastName,
      institutionalEmail: u.institutionalEmail,
      role: u.role,
      password: "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        institutionalEmail: editForm.institutionalEmail,
        password: editForm.password || "unchanged", 
        roleId: ROLE_ID[editForm.role], 
      });
      setEditOpen(false);
      await load();
    } catch {
      alert("Error al actualizar el usuario.");
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Error al eliminar el usuario.");
    }
  };

  // ── Assign trainer ────────────────────────────────────────────
  const handleOpenAssign = (u: UserResponse) => {
    setAssignTarget(u);
    setSelectedTrainerId("");
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!assignTarget || selectedTrainerId === "") return;
    try {
      await createCoachingAssignment({
        trainerId: Number(selectedTrainerId),
        userId: assignTarget.id,
      });
      setAssignOpen(false);
      await load();
    } catch {
      alert("Error al asignar el entrenador. Es posible que ya esté asignado.");
    }
  };

  const handleUnassign = async (trainerId: number, userId: number) => {
    if (!window.confirm("¿Desasignar este entrenador?")) return;
    try {
      await deleteCoachingAssignment(trainerId, userId);
      await load();
    } catch {
      alert("Error al desasignar.");
    }
  };

  // ── Helpers ───────────────────────────────────────────────────
  const getAssignedTrainer = (userId: number) =>
    coaching.find((c) => c.userId === userId);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>

        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Panel Administrativo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Gestión de usuarios y asignación de entrenadores
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* ── Tabla de usuarios ── */}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, mb: 6 }}>
              <Table>
                <TableHead sx={{ bgcolor: "primary.main" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rol</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Entrenador asignado</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No hay usuarios.</TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => {
                      const assigned = getAssignedTrainer(u.id);
                      return (
                        <TableRow key={u.id} hover>
                          <TableCell>{u.id}</TableCell>
                          <TableCell>{u.firstName} {u.lastName}</TableCell>
                          <TableCell>{u.institutionalEmail}</TableCell>
                          <TableCell>
                            <Chip
                              label={u.role}
                              color={getRoleColor(u.role)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {u.role === "USER" ? (
                              assigned ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip
                                    label={assigned.trainerEmail}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                  <Tooltip title="Desasignar">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleUnassign(assigned.trainerId, u.id)}
                                    >
                                      <LinkOffIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ) : (
                                <Chip label="Sin asignar" size="small" variant="outlined" />
                              )
                            ) : (
                              <Typography variant="body2" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                              {u.role === "USER" && (
                                <Tooltip title="Asignar entrenador">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenAssign(u)}
                                  >
                                    <PersonAddIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Editar usuario">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleOpenEdit(u)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar usuario">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(u.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ── Resumen de asignaciones ── */}
            <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
              Resumen de asignaciones
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "grey.100" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Entrenador</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Usuario asignado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coaching.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No hay asignaciones registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coaching.map((c, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{c.trainerEmail}</TableCell>
                        <TableCell>{c.userEmail}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* ── Dialog editar usuario ── */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Editar Usuario</DialogTitle>
          <DialogContent dividers>
            <TextField fullWidth margin="dense" label="Nombre"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            <TextField fullWidth margin="dense" label="Apellido"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            <TextField fullWidth margin="dense" label="Email"
              value={editForm.institutionalEmail}
              onChange={(e) => setEditForm({ ...editForm, institutionalEmail: e.target.value })} />
            <TextField fullWidth margin="dense" label="Nueva contraseña (opcional)"
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            <TextField fullWidth margin="dense" select label="Rol"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveEdit}
              disabled={!editForm.firstName || !editForm.lastName || !editForm.institutionalEmail}>
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Dialog asignar trainer ── */}
        <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Asignar entrenador a {assignTarget?.firstName} {assignTarget?.lastName}
          </DialogTitle>
          <DialogContent dividers>
            {trainers.length === 0 ? (
              <Alert severity="warning">No hay entrenadores disponibles.</Alert>
            ) : (
              <TextField
                fullWidth select label="Seleccionar entrenador"
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(Number(e.target.value))}
                margin="dense"
              >
                {trainers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} — {t.institutionalEmail}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAssignOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleAssign}
              disabled={selectedTrainerId === "" || trainers.length === 0}>
              Asignar
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </>
  );
}