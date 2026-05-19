import {
  Card, CardContent, CardActions, Typography,
  Button, Chip, Box,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { ActivityResponse } from "../services/activityService";

interface Props {
  activity: ActivityResponse;
  canEdit?: boolean;
  canDelete?: boolean;
  canEnroll?: boolean;
  onEdit?: (activity: ActivityResponse) => void;
  onDelete?: (id: number) => void;
  onEnroll?: (id: number) => void;
  onViewSchedules?: (activity: ActivityResponse) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ActivityCard({
  activity, canEdit, canDelete, canEnroll,
  onEdit, onDelete, onEnroll, onViewSchedules,
}: Props) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ flexGrow: 1 }}>
  <Typography
  variant="h6"
  gutterBottom
  sx={{ fontWeight: 700 }}
>
  {activity.name}
</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {activity.description || "Sin descripción"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          <Chip icon={<PlaceIcon />} label={activity.spaceName || `Espacio #${activity.spaceId}`}
            size="small" color="primary" variant="outlined" />
          <Chip icon={<CalendarMonthIcon />} label={`Inicio: ${formatDate(activity.startDate)}`}
            size="small" variant="outlined" />
          <Chip icon={<CalendarMonthIcon />} label={`Fin: ${formatDate(activity.endDate)}`}
            size="small" variant="outlined" />
        </Box>
      </CardContent>

      <CardActions sx={{ flexWrap: "wrap", justifyContent: "flex-end", px: 2, pb: 2, gap: 1 }}>
        {onViewSchedules && (
          <Button size="small" variant="outlined" color="secondary" startIcon={<ScheduleIcon />}
            onClick={() => onViewSchedules(activity)}>
            Horarios
          </Button>
        )}
        {canEnroll && onEnroll && (
          <Button size="small" variant="contained" startIcon={<HowToRegIcon />}
            onClick={() => onEnroll(activity.id)}>
            Inscribirse
          </Button>
        )}
        {canEdit && onEdit && (
          <Button size="small" variant="outlined" startIcon={<EditIcon />}
            onClick={() => onEdit(activity)}>
            Editar
          </Button>
        )}
        {canDelete && onDelete && (
          <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}
            onClick={() => onDelete(activity.id)}>
            Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  );
}