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
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StarIcon from "@mui/icons-material/Star";

interface RoutineCardProps {
  routine: {
    id: number;
    name: string;
    description: string;
    userId: number;
    isPredefined?: boolean;
  };

  onDelete?: (id: number) => void;

  canDelete?: boolean;

  onAdopt?: (id: number) => void;

  showAdopt?: boolean;
}

const RoutineCard = ({
  routine,
  onDelete,
  canDelete,
  onAdopt,
  showAdopt,
}: RoutineCardProps) => {
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
            {routine.name}
          </Typography>

          {routine.isPredefined && (
            <Chip
              icon={<StarIcon />}
              label="Prediseñada"
              size="small"
              color="warning"
            />
          )}
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
            Rutina de entrenamiento
          </Typography>
        </Box>

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
          {routine.description ||
            "Sin descripción."}
        </Typography>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pb: 2,
        }}
      >
        {showAdopt && onAdopt && (
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              onAdopt(routine.id)
            }
          >
            Adoptar Rutina
          </Button>
        )}

        {canDelete && onDelete && (
          <IconButton
            color="error"
            size="small"
            onClick={() =>
              onDelete(routine.id)
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default RoutineCard;