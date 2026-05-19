import { useEffect, useState, useCallback } from "react";
import {
  getRoutines,
  deleteRoutine,
  createRoutine,
  updateRoutine,
  RoutineResponse,
} from "../../services/routineService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import Navbar from "../../components/Navbar";
import RoutineCard from "../../components/RoutineCard";

function RoutinesPage() {
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPredefined: false,
  });

  const { user } = useSelector((state: RootState) => state.auth);

  const loadRoutines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoutines();
      setRoutines(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las rutinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", isPredefined: false });
    setOpen(true);
  };

  const handleOpenEdit = (routine: RoutineResponse) => {
    setEditingId(routine.id);
    setFormData({
      name: routine.name,
      description: routine.description,
      isPredefined: routine.isPredefined,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ name: "", description: "", isPredefined: false });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (editingId !== null) {
        await updateRoutine(editingId, { ...formData, userId: user.id });
      } else {
        await createRoutine({ ...formData, userId: user.id });
      }
      handleClose();
      await loadRoutines();
    } catch (err) {
      console.error(err);
      alert(editingId ? "Error al editar la rutina." : "Error al crear rutina.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar esta rutina?")) return;
    try {
      await deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la rutina.");
    }
  };

  const predefined = routines.filter((r) => r.isPredefined);
  const myRoutines = routines.filter((r) => !r.isPredefined && r.userId === user?.id);
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINER" || user?.role === "USER";

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Rutinas de Entrenamiento
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explora rutinas prediseñadas o gestiona las tuyas
            </Typography>
          </Box>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Crear Rutina
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Rutinas Prediseñadas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Creadas por entrenadores certificados — disponibles para todos
            </Typography>
            {predefined.length === 0 ? (
              <Alert severity="info" sx={{ mb: 4 }}>
                No hay rutinas prediseñadas disponibles aún.
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ mb: 5 }}>
                {predefined.map((r) => (
                  <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <RoutineCard
                      routine={r}
                      canDelete={user?.role === "ADMIN"}
                      onDelete={handleDelete}
                      onEdit={
                        user?.role === "ADMIN" || user?.role === "TRAINER"
                          ? handleOpenEdit
                          : undefined
                      }
                      showAdopt={user?.role === "USER"}
                      onAdopt={(id) => console.log("adoptar", id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Mis Rutinas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Rutinas personales creadas por ti
            </Typography>
            {myRoutines.length === 0 ? (
              <Alert severity="info">
                No tienes rutinas personales. ¡Crea una!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {myRoutines.map((r) => (
                  <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <RoutineCard
                      routine={r}
                      canDelete={true}
                      onDelete={handleDelete}
                      onEdit={handleOpenEdit}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {editingId !== null ? "Editar Rutina" : "Nueva Rutina"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Nombre de la Rutina"
              margin="dense"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Descripción"
              margin="dense"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {(user?.role === "ADMIN" || user?.role === "TRAINER") && (
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Switch
                    checked={formData.isPredefined}
                    onChange={(e) =>
                      setFormData({ ...formData, isPredefined: e.target.checked })
                    }
                  />
                }
                label="Marcar como rutina prediseñada"
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.name}
            >
              {editingId !== null ? "Guardar Cambios" : "Guardar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default RoutinesPage;