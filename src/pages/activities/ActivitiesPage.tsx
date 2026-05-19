import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Container,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, IconButton, List, ListItem, ListItemText,
  TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  ActivityResponse, ActivityRequest,
  getActivities, createActivity, updateActivity, deleteActivity,
} from "../../services/activityService";
import { createEnrollment } from "../../services/enrollmentService";
import {
  ScheduleResponse, ScheduleRequest,
  getSchedules, createSchedule, deleteSchedule,
} from "../../services/Scheduleservice";
import ActivityCard from "../../components/ActivityCard";
import Navbar from "../../components/Navbar";

const emptyActivityForm: ActivityRequest = {
  name: "", description: "", startDate: "", endDate: "", spaceId: 0,
};

const emptyScheduleForm: ScheduleRequest = {
  day: "", startDate: "", endDate: "", activityId: 0,
};

export default function ActivitiesPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Activities state
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Activity dialog
  const [activityOpen, setActivityOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ActivityRequest>(emptyActivityForm);

  // Schedules dialog
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleRequest>(emptyScheduleForm);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  // ── Load activities ──────────────────────────────────────────
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

  // ── Load schedules for a given activity ──────────────────────
  const loadSchedules = useCallback(async (activityId: number) => {
    try {
      setSchedulesLoading(true);
      const all = await getSchedules();
      setSchedules(all.filter((s) => s.activityId === activityId));
    } catch {
      setSchedules([]);
    } finally {
      setSchedulesLoading(false);
    }
  }, []);

  // ── Activity handlers ─────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyActivityForm);
    setActivityOpen(true);
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
    setActivityOpen(true);
  };

  const handleSaveActivity = async () => {
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
      setActivityOpen(false);
      await load();
    } catch {
      alert("Error al guardar la actividad.");
    }
  };

  const handleDeleteActivity = async (id: number) => {
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

  // ── Schedule handlers ─────────────────────────────────────────
  const handleViewSchedules = (activity: ActivityResponse) => {
    setSelectedActivity(activity);
    setScheduleForm({ ...emptyScheduleForm, activityId: activity.id });
    setScheduleFormOpen(false);
    setScheduleOpen(true);
    loadSchedules(activity.id);
  };

  const handleSaveSchedule = async () => {
    if (!selectedActivity) return;
    try {
      await createSchedule({
        ...scheduleForm,
        activityId: selectedActivity.id,
        startDate: new Date(scheduleForm.startDate).toISOString(),
        endDate: new Date(scheduleForm.endDate).toISOString(),
      });
      setScheduleFormOpen(false);
      setScheduleForm({ ...emptyScheduleForm, activityId: selectedActivity.id });
      await loadSchedules(selectedActivity.id);
    } catch {
      alert("Error al guardar el horario.");
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm("¿Eliminar este horario?")) return;
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error al eliminar el horario.");
    }
  };

  // ── Field helper ──────────────────────────────────────────────
  const field = (
    label: string,
    key: keyof ActivityRequest,
    type = "text"
  ) => (
    <TextField
      fullWidth margin="dense" label={label} type={type}
      slotProps={{ inputLabel: type === "datetime-local" ? { shrink: true } : undefined }}
      value={formData[key]}
      onChange={(e) =>
        setFormData({ ...formData, [key]: key === "spaceId" ? Number(e.target.value) : e.target.value })
      }
    />
  );

  const scheduleField = (
    label: string,
    key: keyof ScheduleRequest,
    type = "text"
  ) => (
    <TextField
      fullWidth margin="dense" label={label} type={type}
      slotProps={{ inputLabel: type === "datetime-local" ? { shrink: true } : undefined }}
      value={scheduleForm[key]}
      onChange={(e) => setScheduleForm({ ...scheduleForm, [key]: e.target.value })}
    />
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
<Typography variant="h4" sx={{ fontWeight: 700 }}>
  Actividades
</Typography>            <Typography variant="body1" color="text.secondary">
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

        {/* Activities grid */}
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
                  onDelete={handleDeleteActivity}
                  onEnroll={handleEnroll}
                  onViewSchedules={handleViewSchedules}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Activity Dialog ─────────────────────────────────── */}
        <Dialog open={activityOpen} onClose={() => setActivityOpen(false)} maxWidth="sm" fullWidth>
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
            <Button onClick={() => setActivityOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveActivity}
              disabled={!formData.name || !formData.spaceId}>
              {editingId !== null ? "Guardar Cambios" : "Crear"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── Schedules Dialog ────────────────────────────────── */}
        <Dialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Horarios — {selectedActivity?.name}
          </DialogTitle>

          <DialogContent dividers>
            {schedulesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : schedules.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No hay horarios registrados para esta actividad.
              </Alert>
            ) : (
              <List disablePadding>
                {schedules.map((s, idx) => (
                  <Box key={s.id}>
                    <ListItem
                      secondaryAction={
                        isAdmin ? (
                          <Tooltip title="Eliminar horario">
                            <IconButton edge="end" color="error"
                              onClick={() => handleDeleteSchedule(s.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : undefined
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                            <Chip label={s.day} size="small" color="primary" />
                            <Typography variant="body2">
                              {new Date(s.startDate).toLocaleTimeString("es-CO", { timeStyle: "short" })}
                              {" — "}
                              {new Date(s.endDate).toLocaleTimeString("es-CO", { timeStyle: "short" })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < schedules.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}

            {/* Inline form to add schedule (ADMIN only) */}
            {isAdmin && (
              <>
                <Divider sx={{ my: 2 }} />
                {scheduleFormOpen ? (
                  <Box>
<Typography
  variant="subtitle2"
  sx={{ fontWeight: 700, mb: 1 }}
>                      Nuevo horario
                    </Typography>
                    {scheduleField("Día (ej: Lunes)", "day")}
                    {scheduleField("Hora de inicio", "startDate", "datetime-local")}
                    {scheduleField("Hora de fin", "endDate", "datetime-local")}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                      <Button size="small" onClick={() => setScheduleFormOpen(false)}>
                        Cancelar
                      </Button>
                      <Button size="small" variant="contained" onClick={handleSaveSchedule}
                        disabled={!scheduleForm.day || !scheduleForm.startDate || !scheduleForm.endDate}>
                        Agregar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button startIcon={<AddIcon />} size="small" onClick={() => setScheduleFormOpen(true)}>
                    Agregar horario
                  </Button>
                )}
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setScheduleOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

      </Container>
    </>
  );
}