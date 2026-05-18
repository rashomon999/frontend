import { useEffect, useState } from "react";
import {
  getRoutines,
  deleteRoutine,
  createRoutine,
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPredefined: false,
  });

  const { user } = useSelector((state: RootState) => state.auth);

    const loadRoutines = async () => {
    try {
      setLoading(true);

      const data = await getRoutines();

      setRoutines(data);
    } catch (err) {
      console.error(err);

      setError("Error al cargar las rutinas.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await loadRoutines();
    };

    fetchData();
  }, []);

 
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta rutina?")) {
      try {
        await deleteRoutine(id);

        setRoutines(routines.filter((r) => r.id !== id));
      } catch (err) {
        console.error(err);

        alert("No se pudo eliminar la rutina.");
      }
    }
  };

  const handleCreate = async () => {
    if (!user) return;

    try {
      await createRoutine({
        ...formData,
        userId: user.id,
      });

      setOpen(false);

      setFormData({
        name: "",
        description: "",
        isPredefined: false,
      });

      loadRoutines();
    } catch (err) {
      console.error(err);

      alert("Error al crear rutina.");
    }
  };

  const predefined = routines.filter((r) => r.isPredefined);

  const myRoutines = routines.filter(
    (r) => !r.isPredefined && r.userId === user?.id
  );

  const canCreate =
    user?.role === "ADMIN" ||
    user?.role === "TRAINER" ||
    user?.role === "USER";

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
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold" }}
            >
              Rutinas de Entrenamiento
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Explora rutinas prediseñadas o gestiona las tuyas
            </Typography>
          </Box>

          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Crear Rutina
            </Button>
          )}
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 10,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Rutinas Prediseñadas */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Rutinas Prediseñadas
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Creadas por entrenadores certificados — disponibles para todos
            </Typography>

            {predefined.length === 0 ? (
              <Alert severity="info" sx={{ mb: 4 }}>
                No hay rutinas prediseñadas disponibles aún.
              </Alert>
            ) : (
              <Grid
                container
                spacing={3}
                sx={{ mb: 5 }}
              >
                {predefined.map((r) => (
                  <Grid
                    key={r.id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                  >
                    <RoutineCard
                      routine={r}
                      canDelete={user?.role === "ADMIN"}
                      onDelete={handleDelete}
                      showAdopt={user?.role === "USER"}
                      onAdopt={(id) =>
                        console.log("adoptar", id)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Mis Rutinas */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Mis Rutinas
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Rutinas personales creadas por ti
            </Typography>

            {myRoutines.length === 0 ? (
              <Alert severity="info">
                No tienes rutinas personales. ¡Crea una!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {myRoutines.map((r) => (
                  <Grid
                    key={r.id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                  >
                    <RoutineCard
                      routine={r}
                      canDelete={true}
                      onDelete={handleDelete}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Dialog Crear Rutina */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{ fontWeight: "bold" }}
          >
            Nueva Rutina
          </DialogTitle>

          <DialogContent dividers>
            <TextField
              fullWidth
              label="Nombre de la Rutina"
              margin="dense"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              label="Descripción"
              margin="dense"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            {(user?.role === "ADMIN" ||
              user?.role === "TRAINER") && (
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Switch
                    checked={formData.isPredefined}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPredefined: e.target.checked,
                      })
                    }
                  />
                }
                label="Marcar como rutina prediseñada"
              />
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!formData.name}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default RoutinesPage;