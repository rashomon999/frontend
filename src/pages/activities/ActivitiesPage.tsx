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
  ActivityResponse, ActivityRequest,
  getActivities, createActivity, updateActivity, deleteActivity,
} from "../../services/activityService";
import {
  createEnrollment,
} from "../../services/enrollmentService";
import ActivityCard from "../../components/ActivityCard";
import Navbar from "../../components/Navbar";

const emptyForm: ActivityRequest = {
  name: "", description: "", startDate: "", endDate: "", spaceId: 0,
};

export default function ActivitiesPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ActivityRequest>(emptyForm);

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setActivities(await getActivities());
    } catch {
      setError("Error al cargar las actividades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (activity: ActivityResponse) => {
    setEditingId(activity.id);
    setFormData({
      name: activity.name,
      description: activity.description,
      startDate: activity.startDate.slice(0, 16),
      endDate: activity.endDate.slice(0, 16),
      spaceId: activity.spaceId,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: ActivityRequest = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      if (editingId !== null) {
        await updateActivity(editingId, payload);
      } else {
        await createActivity(payload);
      }
      setOpen(false);
      await load();
    } catch {
      alert("Error al guardar la actividad.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta actividad?")) return;
    try {
      await deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error al eliminar la actividad.");
    }
  };

  const handleEnroll = async (activityId: number) => {
    if (!user) return;
    try {
      await createEnrollment({ userId: user.id, activityId });
      alert("¡Inscripción exitosa!");
    } catch {
      alert("Error al inscribirse. Es posible que ya estés inscrito.");
    }
  };

  const field = (label: string, key: keyof ActivityRequest, type = "text") => (
<TextField
  fullWidth
  margin="dense"
  label={label}
  type={type}
  slotProps={{
    inputLabel:
      type === "datetime-local"
        ? { shrink: true }
        : undefined,
  }}
  value={formData[key]}
  onChange={(e) =>
    setFormData({
      ...formData,
      [key]:
        key === "spaceId"
          ? Number(e.target.value)
          : e.target.value,
    })
  }
/>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Actividades
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Eventos, clases y espacios disponibles en la universidad
            </Typography>
          </Box>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
              Nueva Actividad
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : activities.length === 0 ? (
          <Alert severity="info">No hay actividades registradas.</Alert>
        ) : (
          <Grid container spacing={3}>
            {activities.map((a) => (
              <Grid key={a.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ActivityCard
                  activity={a}
                  canEdit={isAdmin}
                  canDelete={isAdmin}
                  canEnroll={isUser}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onEnroll={handleEnroll}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
<DialogTitle sx={{ fontWeight: 700 }}>
  {editingId !== null ? "Editar Actividad" : "Nueva Actividad"}
</DialogTitle>
          <DialogContent dividers>
            {field("Nombre", "name")}
            {field("Descripción", "description")}
            {field("Fecha de inicio", "startDate", "datetime-local")}
            {field("Fecha de fin", "endDate", "datetime-local")}
            {field("ID del Espacio", "spaceId", "number")}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={!formData.name || !formData.spaceId}>
              {editingId !== null ? "Guardar Cambios" : "Crear"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}