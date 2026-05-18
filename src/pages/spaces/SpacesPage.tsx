import { useEffect, useState, useCallback } from "react";
import { getSpaces, createSpace, SpaceResponse } from "../../services/spaceService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
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
import EventCard from "../../components/EventCard";

const EMPTY_FORM = { name: "", capacity: 0, location: "" };

function SpacesPage() {
  const [spaces, setSpaces] = useState<SpaceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { user } = useSelector((state: RootState) => state.auth);

  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpaces();
      setSpaces(data);
    } catch {
      console.error("Error al cargar espacios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  const handleCreate = async () => {
    try {
      await createSpace(formData);
      setOpen(false);
      setFormData(EMPTY_FORM);
      loadSpaces();
    } catch {
      alert("Error al crear espacio.");
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
            <Typography variant="h4" fontWeight="bold">Eventos y Espacios</Typography>
            <Typography variant="body1" color="text.secondary">
              Descubre qué está pasando hoy en el campus
            </Typography>
          </Box>
          {user?.role === "ADMIN" && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Nuevo Espacio
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {spaces.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <EventCard event={s} />
              </Grid>
            ))}
            {spaces.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    No hay eventos o espacios programados.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: "bold" }}>Agregar Nuevo Espacio</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth label="Nombre del Espacio / Evento" margin="dense"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth label="Ubicación (ej. Gimnasio Edificio L)" margin="dense"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              fullWidth label="Capacidad Máxima" margin="dense" type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate} disabled={!formData.name}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default SpacesPage;