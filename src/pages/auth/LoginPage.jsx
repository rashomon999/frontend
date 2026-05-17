import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [institutionalEmail, setInstitutionalEmail] =
    useState("");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(
        institutionalEmail,
        password
      );

      localStorage.setItem(
        "token",
        data.accessToken
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4">
          Login
        </Typography>

        <TextField
          fullWidth
          label="Correo institucional"
          margin="normal"
          value={institutionalEmail}
          onChange={(e) =>
            setInstitutionalEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Contraseña"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
        >
          Ingresar
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;