import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface EventCardProps {
  event: {
    id: number;
    name: string;
    capacity: number;
    location: string;
  };
}

const EventCard = ({
  event,
}: EventCardProps) => {
  // Imagen placeholder
  const imageUrl = `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=200&sig=${event.id}`;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={event.name}
      />

      <CardContent>
        {/* Título */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {event.name}
        </Typography>

        {/* Info */}
        <Stack
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <LocationOnIcon
              fontSize="small"
              sx={{
                mr: 1,
                color: "primary.main",
              }}
            />

            <Typography variant="body2">
              {event.location}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <PeopleIcon
              fontSize="small"
              sx={{
                mr: 1,
                color: "primary.main",
              }}
            />

            <Typography variant="body2">
              Capacidad: {event.capacity} pers.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <AccessTimeIcon
              fontSize="small"
              sx={{
                mr: 1,
                color: "primary.main",
              }}
            />

            <Typography variant="body2">
              Hoy: 8:00 AM - 8:00 PM
            </Typography>
          </Box>
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label="Abierto"
            color="success"
            size="small"
            variant="filled"
          />

          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 2,
            }}
          >
            Reservar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;