import { useEffect, useState, useCallback } from "react";
import {
  getExercises,
  deleteExercise,
  createExercise,
  updateExercise,
  ExerciseResponse,
} from "../../services/exerciseService";

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
  MenuItem,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "../../components/Navbar";
import ExerciseCard from "../../components/ExerciseCard";

interface ExerciseFormData {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  difficulty: string;
  videoUrl: string;
}

const EMPTY_FORM: ExerciseFormData = {
  name: "",
  type: "",
  description: "",
  durationMin: 0,
  difficulty: "Media",
  videoUrl: "",
};

function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ExerciseFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExercises();
      setExercises(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los ejercicios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setOpen(true);
  };

  const handleOpenEdit = (exercise: ExerciseResponse) => {
    setEditingId(exercise.id);
    setFormData({
      name: exercise.name,
      type: exercise.type,
      description: exercise.description,
      durationMin: exercise.durationMin,
      difficulty: exercise.difficulty,
      videoUrl: exercise.videoUrl,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (editingId !== null) {
        await updateExercise(editingId, { ...formData, userId: user.id });
      } else {
        await createExercise({ ...formData, userId: user.id });
      }
      handleClose();
      await loadExercises();
    } catch (err) {
      console.error(err);
      alert(editingId ? "Error al editar el ejercicio." : "Error al crear el ejercicio.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este ejercicio?")) return;
    try {
      await deleteExercise(id);
      setExercises((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el ejercicio.");
    }
  };

  const handleInputChange = (field: keyof ExerciseFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canManage = user?.role === "ADMIN" || user?.role === "TRAINER";

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
              Biblioteca de Ejercicios
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Encuentra la mejor rutina para tu objetivo
            </Typography>
          </Box>

          {canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Nuevo Ejercicio
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
          <Grid container spacing={3}>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={exercise.id}>
                  <ExerciseCard
                    exercise={exercise}
                    onDelete={handleDelete}
                    onEdit={canManage ? handleOpenEdit : undefined}
                    showDelete={canManage}
                  />
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    No hay ejercicios registrados todavía.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {editingId !== null ? "Editar Ejercicio" : "Agregar Nuevo Ejercicio"}
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Tipo"
                  placeholder="Fuerza, Cardio..."
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Dificultad"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                >
                  <MenuItem value="Baja">Baja</MenuItem>
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Alta">Alta</MenuItem>
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duración Estimada (min)"
                  value={formData.durationMin}
                  onChange={(e) => handleInputChange("durationMin", Number(e.target.value))}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción / Instrucciones"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="URL del Video"
                  placeholder="https://youtube.com/..."
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.type.trim()}
            >
              {editingId !== null ? "Guardar Cambios" : "Guardar Ejercicio"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default ExercisesPage;