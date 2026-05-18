import { useEffect, useState, useCallback } from "react";
import {
  getExercises,
  deleteExercise,
  ExerciseResponse,
  createExercise,
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
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../../components/Navbar";
import ExerciseCard from "../../components/ExerciseCard";

const EMPTY_FORM = {
  name: "",
  type: "",
  description: "",
  durationMin: 0,
  difficulty: "Media",
  videoUrl: "",
};

function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { user } = useSelector((state: RootState) => state.auth);

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      setExercises(data);
    } catch {
      setError("Error al cargar los ejercicios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este ejercicio?")) {
      try {
        await deleteExercise(id);
        setExercises((prev) => prev.filter((e) => e.id !== id));
      } catch {
        alert("Error al eliminar.");
      }
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    try {
      await createExercise({ ...formData, userId: user.id });
      setOpen(false);
      setFormData(EMPTY_FORM);
      loadExercises();
    } catch {
      alert("Error al crear ejercicio.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">Biblioteca de Ejercicios</Typography>
            <Typography variant="body1" color="text.secondary">
              Encuentra la mejor rutina para tu objetivo
            </Typography>
          </Box>
          {(user?.role === "ADMIN" || user?.role === "TRAINER") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{ height: "fit-content" }}
            >
              Nuevo Ejercicio
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {exercises.map((ex) => (
              <Grid item xs={12} sm={6} md={4} key={ex.id}>
                <ExerciseCard
                  exercise={ex}
                  onDelete={handleDelete}
                  showDelete={user?.role === "ADMIN" || user?.role === "TRAINER"}
                />
              </Grid>
            ))}
            {exercises.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    No hay ejercicios registrados todavía.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>Agregar Nuevo Ejercicio</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Nombre" margin="dense" variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Tipo (ej. Fuerza, Cardio)" margin="dense"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Dificultad" margin="dense" select
                  SelectProps={{ native: true }}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Duración Estimada (min)" margin="dense" type="number"
                  value={formData.durationMin}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMin: parseInt(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Descripción / Instrucciones" margin="dense" multiline rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="URL del Video Demostrativo" margin="dense"
                  placeholder="https://youtube.com/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!formData.name || !formData.type}
            >
              Guardar Ejercicio
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default ExercisesPage;