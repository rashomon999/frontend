import { useSelector } from "react-redux";
import { RootState } from "../../store";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
} from "@mui/material";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";

function DashboardPage() {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const stats = [
    {
      title: "Ejercicios",
      count: "25+",
      icon: <FitnessCenterIcon />,
      color: "#1976d2",
      link: "/exercises",
    },
    {
      title: "Espacios",
      count: "8",
      icon: <EventIcon />,
      color: "#2e7d32",
      link: "/spaces",
    },
    {
      title: "Mi Progreso",
      count: "Ver más",
      icon: <ShowChartIcon />,
      color: "#ed6c02",
      link: "/progress",
    },
    {
      title: "Comunidad",
      count: "100+",
      icon: <GroupIcon />,
      color: "#9c27b0",
      link: "/users",
    },
  ];

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold" }}
            gutterBottom
          >
            ¡Hola, {user?.email?.split("@")[0]}!
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
          >
            Bienvenido a la plataforma de Actividad Física Icesi
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Stats */}
        <Grid
          container
          spacing={3}
          sx={{ mb: 6 }}
        >
          {stats.map((stat, index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Card
                elevation={4}
                sx={{
                  textAlign: "center",
                  p: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    color: stat.color,
                    mb: 1,
                  }}
                >
                  {stat.icon}
                </Box>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold" }}
                >
                  {stat.count}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {stat.title}
                </Typography>

                <Button
                  component={Link}
                  to={stat.link}
                  size="small"
                  sx={{ color: stat.color }}
                >
                  Explorar
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content */}
        <Grid container spacing={4}>
          {/* Novedades */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Novedades y Recomendaciones
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 2 }}
              >
                Recuerda que los horarios del gimnasio
                han sido actualizados para el semestre
                2026-1. ¡No olvides registrar tu progreso
                después de cada sesión para obtener
                mejores recomendaciones de tus
                entrenadores!
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  borderLeft:
                    "5px solid #1976d2",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                >
                  Tip del día:
                </Typography>

                <Typography variant="body2">
                  La hidratación es clave. Bebe al menos
                  500ml de agua antes de tu entrenamiento.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Perfil */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Tu Perfil
                </Typography>

                <Typography variant="body1">
                  Rol: {user?.role}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    opacity: 0.8,
                  }}
                >
                  Email: {user?.email}
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default DashboardPage;