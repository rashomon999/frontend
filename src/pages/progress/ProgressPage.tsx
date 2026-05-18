import { useEffect, useState, useCallback } from "react";
import {
  getProgress,
  createProgress,
  ProgressResponse,
} from "../../services/progressService";
 import { getExercises, ExerciseResponse } from "../../services/exerciseService";
import { getRoutines, RoutineResponse } from "../../services/routineService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Navbar from "../../components/Navbar";
import ProgressChart from "../../components/progress/ProgressChart";
import ProgressForm from "../../components/progress/ProgressForm";

const EMPTY_FORM = {
  reps: 0,
  durationMin: 0,
  effortLevel: 5,
  setNumber: 1,
  weightKg: 0,
  exerciseId: 0,
  routineId: 0,
};

function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressResponse[]>([]);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { user } = useSelector((state: RootState) => state.auth);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [prog, ex, rout] = await Promise.all([
        getProgress(),
        getExercises(),
        getRoutines(),
      ]);

      setProgressData(prog.filter((p) => p.userId === user?.id));
      setExercises(ex);
      setRoutines(rout);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, [loadData]);


  const handleSubmit = async () => {
    if (!user) return;
    try {
      await createProgress({ ...formData, userId: user.id });
      setOpen(false);
      setFormData(EMPTY_FORM);
      await loadData();
    } catch {
      alert("Error al registrar progreso.");
    }
  };

  const totalSesiones = progressData.length;
  const promedioEsfuerzo =
    totalSesiones > 0
      ? (progressData.reduce((acc, p) => acc + p.effortLevel, 0) / totalSesiones).toFixed(1)
      : "—";
  const totalReps = progressData.reduce((acc, p) => acc + p.reps, 0);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold" }}
          >
            Mi Progreso
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Historial de entrenamientos y métricas de rendimiento
          </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => window.print()}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Descargar Reporte
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Registrar Actividad
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Métricas resumen */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: "Sesiones registradas", value: totalSesiones, color: "#1976d2" },
                { label: "Esfuerzo promedio", value: `${promedioEsfuerzo}/10`, color: "#ed6c02" },
                { label: "Total repeticiones", value: totalReps, color: "#2e7d32" },
              ].map((m, i) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
                key={i}
              >
                <Card
                  elevation={3}
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: m.color,
                      fontWeight: "bold",
                    }}
                  >
                    {m.value}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {m.label}
                  </Typography>
                </Card>
              </Grid>
              ))}
            </Grid>

            {progressData.length === 0 ? (
              <Alert severity="info" sx={{ mb: 4 }}>
                No tienes registros de progreso aún. ¡Empieza hoy!
              </Alert>
            ) : (
              <>
                {/* Gráficos con tabs semanal/mensual/por ejercicio */}
                <ProgressChart data={progressData} />

                <Divider sx={{ mb: 3 }} />

                {/* Historial */}
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Historial de actividades
                </Typography>
                <Grid container spacing={2}>
                  {[...progressData]
                    .sort((a, b) => new Date(b.dateLogged).getTime() - new Date(a.dateLogged).getTime())
                    .map((p) => (
                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          md: 4,
                        }}
                        key={p.id}
                      >
                        <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                          <CardContent>
                          <Typography
                            variant="subtitle1"
                            noWrap
                            sx={{ fontWeight: "bold" }}
                          >
                            {p.exerciseName || "Ejercicio"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1, display: "block" }}
                          >
                            {p.routineName || "Sin rutina"} •{" "}
                            {new Date(p.dateLogged).toLocaleDateString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                              <Chip label={`${p.reps} reps`} size="small" color="primary" variant="outlined" />
                              <Chip label={`${p.weightKg} kg`} size="small" variant="outlined" />
                              <Chip
                                label={`Esfuerzo ${p.effortLevel}/10`}
                                size="small"
                                color={p.effortLevel >= 8 ? "error" : p.effortLevel >= 5 ? "warning" : "success"}
                                variant="outlined"
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 1, display: "block" }}
                            >
                              Sets: {p.setNumber} • Duración: {p.durationMin} min
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </>
            )}
          </>
        )}

        <ProgressForm
          open={open}
          onClose={() => { setOpen(false); setFormData(EMPTY_FORM); }}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={setFormData}
          exercises={exercises}
          routines={routines}
        />
      </Container>
    </>
  );
}

export default ProgressPage;