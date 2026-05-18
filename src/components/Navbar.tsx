import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { RootState } from "../store";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CompuNet 2
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/exercises">
              Ejercicios
            </Button>
            <Button color="inherit" component={Link} to="/spaces">
              Espacios
            </Button>
            <Button color="inherit" component={Link} to="/routines">
              Rutinas
            </Button>
            {user.role === "USER" && (
              <Button color="inherit" component={Link} to="/progress">
                Mi Progreso
              </Button>
            )}
            {(user.role === "ADMIN" || user.role === "TRAINER") && (
              <Button color="inherit" component={Link} to="/coaching">
                Coaching
              </Button>
            )}
            {user.role === "ADMIN" && (
              <Button color="inherit" component={Link} to="/users">
                Usuarios
              </Button>
            )}
            <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic' }}>
              {user.email} ({user.role})
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;