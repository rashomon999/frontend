import {
  Card, CardContent, Typography, Chip, Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { RecommendationResponse } from "../services/recommendationService";

interface Props {
  recommendation: RecommendationResponse;
}

export default function RecommendationCard({ recommendation }: Props) {
  const date = new Date(recommendation.dateCreated).toLocaleDateString("es-CO", {
    dateStyle: "long",
  });

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {recommendation.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<PersonIcon />}
            label={`Entrenador: ${recommendation.trainerEmail}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={date}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}