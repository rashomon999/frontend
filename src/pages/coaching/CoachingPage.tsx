import { useEffect, useState } from "react";

import {
  getUsers,
  UserResponse,
} from "../../services/userService";

import {
  getProgress,
  ProgressResponse,
} from "../../services/progressService";

import { createRecommendation } from "../../services/recommendationService";

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
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Navbar from "../../components/Navbar";

function CoachingPage() {
  const [students, setStudents] = useState<
    UserResponse[]
  >([]);

  const [progressAll, setProgressAll] =
    useState<ProgressResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<UserResponse | null>(null);

  const [recommendation, setRecommendation] =
    useState("");

  const { user: trainer } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [users, prog] =
          await Promise.all([
            getUsers(),
            getProgress(),
          ]);

        setStudents(
          users.filter(
            (u) => u.role === "USER"
          )
        );

        setProgressAll(prog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRecommend = async () => {
    if (!trainer || !selectedUser) return;

    try {
      await createRecommendation({
        description: recommendation,
        userId: selectedUser.id,
        trainerId: trainer.id,
      });

      setOpen(false);

      setRecommendation("");

      alert(
        "Recomendación enviada con éxito."
      );
    } catch (err) {
      console.error(err);

      alert(
        "Error al enviar recomendación."
      );
    }
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{ mt: 4 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
          }}
        >
          Panel de Coaching
        </Typography>

        {loading ? (
          <CircularProgress
            sx={{
              display: "block",
              mx: "auto",
            }}
          />
        ) : (
          <Grid
            container
            spacing={3}
          >
            {students.map((student) => (
              <Grid
                key={student.id}
                size={{ xs: 12 }}
              >
                <Card elevation={2}>
                  <CardContent>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        mb: 2,
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h6">
                        {student.firstName}{" "}
                        {student.lastName}
                      </Typography>

                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedUser(
                            student
                          );

                          setOpen(true);
                        }}
                      >
                        Dar Recomendación
                      </Button>
                    </Box>

                    {/* Accordion */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon />
                        }
                      >
                        <Typography>
                          Ver Progreso Reciente
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <List>
                          {progressAll
                            .filter(
                              (p) =>
                                p.userId ===
                                student.id
                            )
                            .slice(-5)
                            .map((p) => (
                              <ListItem
                                key={p.id}
                              >
                                <ListItemText
                                  primary={`Fecha: ${new Date(
                                    p.dateLogged
                                  ).toLocaleDateString()}`}
                                  secondary={`Sets: ${p.setNumber} | Reps: ${p.reps} | Peso: ${p.weightKg}kg | Esfuerzo: ${p.effortLevel}/10`}
                                />
                              </ListItem>
                            ))}

                          {progressAll.filter(
                            (p) =>
                              p.userId ===
                              student.id
                          ).length ===
                            0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              No hay registros
                              recientes.
                            </Typography>
                          )}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog */}
        <Dialog
          open={open}
          onClose={() =>
            setOpen(false)
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
            }}
          >
            Recomendación para{" "}
            {selectedUser?.firstName}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Escribe tu recomendación o ajuste"
              margin="dense"
              multiline
              rows={4}
              value={recommendation}
              onChange={(e) =>
                setRecommendation(
                  e.target.value
                )
              }
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleRecommend}
              disabled={!recommendation}
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default CoachingPage;