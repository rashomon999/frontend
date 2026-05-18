import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  CardActions, 
  Button, 
  Chip, 
  Box,
  IconButton
} from "@mui/material";

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircle';
import TimerIcon from '@mui/icons-material/Timer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';

interface ExerciseCardProps {
  exercise: {
    id: number;
    name: string;
    type: string;
    description: string;
    durationMin: number;
    difficulty: string;
    videoUrl: string;
  };
  onDelete?: (id: number) => void;
  showDelete?: boolean;
}

const ExerciseCard = ({ exercise, onDelete, showDelete }: ExerciseCardProps) => {
  // Generar una imagen aleatoria basada en el tipo para el demo
  const imageUrl = `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400&h=225&sig=${exercise.id}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={exercise.name}
      />
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <Chip 
          label={exercise.difficulty} 
          size="small" 
          color={exercise.difficulty === 'Alta' ? 'error' : exercise.difficulty === 'Media' ? 'warning' : 'success'}
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {exercise.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={exercise.type} size="small" variant="outlined" icon={<FitnessCenterIcon fontSize="small" />} />
          <Chip label={`${exercise.durationMin} min`} size="small" variant="outlined" icon={<TimerIcon fontSize="small" />} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '3em'
        }}>
          {exercise.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button 
          size="small" 
          startIcon={<PlayCircleOutlineIcon />} 
          href={exercise.videoUrl} 
          target="_blank"
          disabled={!exercise.videoUrl}
        >
          Ver Video
        </Button>
        {showDelete && onDelete && (
          <IconButton color="error" size="small" onClick={() => onDelete(exercise.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ExerciseCard;