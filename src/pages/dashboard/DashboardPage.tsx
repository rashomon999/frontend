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
  Chip,
  Stack,
} from "@mui/material";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function DashboardPage() {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const getRoleColor = () => {
    switch (user?.role) {
      case "ADMIN":
        return "error";

      case "TRAINER":
        return "warning";

      default:
        return "success";
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "ADMIN":
        return "Administrador";

      case "TRAINER":
        return "Entrenador";

      default:
        return "Usuario";
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminPanelSettingsIcon />;

      case "TRAINER":
        return <SportsGymnasticsIcon />;

      default:
        return <WorkspacePremiumIcon />;
    }
  };

  const stats = [
    {
      title: "Ejercicios",
      count: "25+",
      icon: <FitnessCenterIcon fontSize="large" />,
      color: "#1976d2",
      link: "/exercises",
    },

    {
      title: "Espacios",
      count: "8",
      icon: <EventIcon fontSize="large" />,
      color: "#2e7d32",
      link: "/spaces",
    },

    ...(user?.role === "USER"
      ? [
          {
            title: "Mi Progreso",
            count: "Ver más",
            icon: (
              <ShowChartIcon fontSize="large" />
            ),
            color: "#ed6c02",
            link: "/progress",
          },
        ]
      : []),

    ...(user?.role === "TRAINER" ||
    user?.role === "ADMIN"
      ? [
          {
            title: "Coaching",
            count: "Activo",
            icon: (
              <SportsGymnasticsIcon fontSize="large" />
            ),
            color: "#9c27b0",
            link: "/coaching",
          },
        ]
      : []),

    ...(user?.role === "ADMIN"
      ? [
          {
            title: "Usuarios",
            count: "Administrar",
            icon: (
              <GroupIcon fontSize="large" />
            ),
            color: "#d32f2f",
            link: "/users",
          },
        ]
      : []),
  ];

  return (
    <>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{ mt: 4, mb: 6 }}
      >
        {/* HEADER */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
              }}
              gutterBottom
            >
              ¡Hola,{" "}
              {
                user?.email?.split(
                  "@"
                )[0]
              }
              !
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
            >
              Bienvenido a la plataforma
              de Actividad Física Icesi
            </Typography>
          </Box>

          <Chip
            icon={getRoleIcon()}
            label={getRoleLabel()}
            color={
              getRoleColor() as
                | "error"
                | "warning"
                | "success"
            }
            sx={{
              fontWeight: "bold",
              px: 1,
              py: 2.5,
              fontSize: "0.95rem",
            }}
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* STATS */}
        <Grid
          container
          spacing={3}
          sx={{ mb: 6 }}
        >
          {stats.map(
            (stat, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card
                  elevation={4}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: 3,
                    transition:
                      "0.3s ease",
                    height: "100%",
                    "&:hover": {
                      transform:
                        "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color:
                        stat.color,
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight:
                        "bold",
                    }}
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
                    sx={{
                      color:
                        stat.color,
                    }}
                  >
                    Explorar
                  </Button>
                </Card>
              </Grid>
            )
          )}
        </Grid>

        {/* MAIN */}
        <Grid container spacing={4}>
          {/* NEWS */}
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                }}
              >
                Centro de Actividad
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    Actualización del
                    sistema
                  </Typography>

                  <Typography variant="body2">
                    Los horarios del
                    gimnasio fueron
                    actualizados para el
                    semestre 2026-1.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    Recomendación
                  </Typography>

                  <Typography variant="body2">
                    Registra tus
                    actividades después
                    de cada sesión para
                    recibir métricas más
                    precisas.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor:
                      "rgba(25,118,210,0.08)",
                    borderLeft:
                      "5px solid #1976d2",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <EmojiEventsIcon color="primary" />

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight:
                          "bold",
                      }}
                    >
                      Tip del día
                    </Typography>
                  </Box>

                  <Typography variant="body2">
                    Mantén una rutina
                    constante y combina
                    ejercicios de fuerza
                    con sesiones
                    cardiovasculares
                    para mejores
                    resultados.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* PROFILE */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card
              elevation={4}
              sx={{
                height: "100%",
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: "white",
              }}
            >
              <CardContent
                sx={{ p: 4 }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight:
                      "bold",
                  }}
                >
                  Tu Perfil
                </Typography>

                <Divider
                  sx={{
                    my: 2,
                    borderColor:
                      "rgba(255,255,255,0.3)",
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{ mb: 1 }}
                >
                  <strong>
                    Rol:
                  </strong>{" "}
                  {
                    user?.role
                  }
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    wordBreak:
                      "break-word",
                  }}
                >
                  <strong>
                    Email:
                  </strong>{" "}
                  {user?.email}
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{
                    mt: 4,
                    py: 1.2,
                    fontWeight:
                      "bold",
                  }}
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