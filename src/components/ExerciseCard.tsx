import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { ExerciseResponse } from "../services/exerciseService";

interface ExerciseCardProps {
  exercise: ExerciseResponse;

  onDelete?: (id: number) => Promise<void>;

  onEdit?: (exercise: ExerciseResponse) => void;

  showDelete?: boolean;
}

const ExerciseCard = ({
  exercise,
  onDelete,
  onEdit,
  showDelete,
}: ExerciseCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              maxWidth: "75%",
              fontWeight: "bold",
            }}
          >
            {exercise.name}
          </Typography>

          <Chip
            label={exercise.difficulty}
            size="small"
            color={
              exercise.difficulty === "Alta"
                ? "error"
                : exercise.difficulty === "Media"
                ? "warning"
                : "success"
            }
          />
        </Box>

        {/* Tipo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            mb: 1,
          }}
        >
          <FitnessCenterIcon
            fontSize="small"
            sx={{ mr: 1 }}
          />

          <Typography variant="body2">
            {exercise.type}
          </Typography>
        </Box>

        {/* Duración */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          Duración estimada: {exercise.durationMin} min
        </Typography>

        {/* Descripción */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {exercise.description ||
            "Sin descripción."}
        </Typography>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          px: 2,
          pb: 2,
        }}
      >
        {onEdit && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() =>
              onEdit(exercise)
            }
          >
            Editar
          </Button>
        )}

        {showDelete && onDelete && (
          <IconButton
            color="error"
            size="small"
            onClick={() =>
              onDelete(exercise.id)
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default ExerciseCard;