import { useEffect, useState, useCallback } from "react";

import {
  getSpaces,
  createSpace,
  SpaceResponse,
} from "../../services/spaceService";

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
} from "@mui/material";

import Grid from "@mui/material/Grid";

import AddIcon from "@mui/icons-material/Add";

import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";

interface SpaceFormData {
  name: string;
  capacity: number;
  location: string;
}

const EMPTY_FORM: SpaceFormData = {
  name: "",
  capacity: 0,
  location: "",
};

function SpacesPage() {
  const [spaces, setSpaces] = useState<SpaceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  const [formData, setFormData] =
    useState<SpaceFormData>(EMPTY_FORM);

  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getSpaces();
      setSpaces(data);
    } catch (error) {
      console.error(
        "Error al cargar espacios:",
        error
      );
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

      await loadSpaces();
    } catch (error) {
      console.error(error);
      alert("Error al crear espacio.");
    }
  };

  const handleInputChange = (
    field: keyof SpaceFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold" }}
            >
              Eventos y Espacios
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Descubre qué está pasando hoy en el
              campus
            </Typography>
          </Box>

          {user?.role === "ADMIN" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Nuevo Espacio
            </Button>
          )}
        </Box>

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
          <Grid container spacing={4}>
            {spaces.length > 0 ? (
              spaces.map((space) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={space.id}
                >
                  <EventCard event={space} />
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 10,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                  >
                    No hay eventos o espacios
                    programados.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{ fontWeight: "bold" }}
          >
            Agregar Nuevo Espacio
          </DialogTitle>

          <DialogContent dividers>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                label="Nombre del Espacio / Evento"
                value={formData.name}
                onChange={(e) =>
                  handleInputChange(
                    "name",
                    e.target.value
                  )
                }
              />

              <TextField
                fullWidth
                label="Ubicación"
                placeholder="Gimnasio Edificio L"
                value={formData.location}
                onChange={(e) =>
                  handleInputChange(
                    "location",
                    e.target.value
                  )
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Capacidad Máxima"
                value={formData.capacity}
                onChange={(e) =>
                  handleInputChange(
                    "capacity",
                    Number(e.target.value)
                  )
                }
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!formData.name.trim()}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default SpacesPage;