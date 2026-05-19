import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Container,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, TextField, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  RecommendationResponse, RecommendationRequest,
  getRecommendations, createRecommendation, deleteRecommendation,
} from "../../services/recommendationService";
import RecommendationCard from "../../components/RecommendationCard";
import Navbar from "../../components/Navbar";

export default function RecommendationsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RecommendationRequest>({
    description: "", userId: 0, trainerId: user?.id ?? 0,
  });

  const isTrainer = user?.role === "TRAINER";
  const isAdmin = user?.role === "ADMIN";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecommendations();
      // Usuarios solo ven las suyas; entrenadores y admin ven todas
      setRecommendations(
        isTrainer || isAdmin
          ? data
          : data.filter((r) => r.userId === user?.id)
      );
    } catch {
      setError("Error al cargar las recomendaciones.");
    } finally {
      setLoading(false);
    }
  }, [user, isTrainer, isAdmin]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    try {
      await createRecommendation({
        ...formData,
        trainerId: user?.id ?? 0,
      });
      setOpen(false);
      setFormData({ description: "", userId: 0, trainerId: user?.id ?? 0 });
      await load();
    } catch {
      alert("Error al crear la recomendación.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta recomendación?")) return;
    try {
      await deleteRecommendation(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Error al eliminar.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Recomendaciones
            </Typography>

            <Typography variant="body1" color="text.secondary">
            {isTrainer || isAdmin
                ? "Gestiona las recomendaciones para tus usuarios"
                : "Recomendaciones de tu entrenador"}
            </Typography>
          </Box>
          {(isTrainer || isAdmin) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Nueva Recomendación
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : recommendations.length === 0 ? (
          <Alert severity="info">No hay recomendaciones disponibles.</Alert>
        ) : (
          <Grid container spacing={3}>
            {recommendations.map((r) => (
              <Grid key={r.id} size={{ xs: 12, sm: 6 }}>
                <RecommendationCard recommendation={r} />
                {(isTrainer || isAdmin) && (
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                    <Button size="small" color="error" onClick={() => handleDelete(r.id)}>
                      Eliminar
                    </Button>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
<DialogTitle sx={{ fontWeight: "bold" }}>
  Nueva Recomendación
</DialogTitle>          <DialogContent dividers>
            <TextField
              fullWidth margin="dense" label="ID del Usuario"
              type="number"
              value={formData.userId || ""}
              onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
            />
            <TextField
              fullWidth margin="dense" label="Descripción"
              multiline rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              variant="contained" onClick={handleSave}
              disabled={!formData.description || !formData.userId}
            >
              Crear
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}