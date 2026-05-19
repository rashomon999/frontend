import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  logout,
} from "../store/slices/authSlice";

import {
  RootState,
} from "../store";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* LOGO */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          Actividad Física Icesi
        </Typography>

        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {/* COMMON */}
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/exercises"
            >
              Ejercicios
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/spaces"
            >
              Espacios
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/routines"
            >
              Rutinas
            </Button>

            {/* USER */}
            {user.role === "USER" && (
              <Button
                color="inherit"
                component={Link}
                to="/progress"
              >
                Mi Progreso
              </Button>
            )}

            {/* TRAINER / ADMIN */}
            {(user.role === "TRAINER" ||
              user.role === "ADMIN") && (
              <Button
                color="inherit"
                component={Link}
                to="/coaching"
              >
                Coaching
              </Button>
            )}

            {/* ADMIN */}
            {user.role === "ADMIN" && (
              <Button
                color="inherit"
                component={Link}
                to="/users"
              >
                Usuarios
              </Button>
            )}

            {/* NOTIFICATIONS */}
            <NotificationBell />

            {/* USER INFO */}
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                fontStyle: "italic",
              }}
            >
              {user.email} ({user.role})
            </Typography>

            {/* LOGOUT */}
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;