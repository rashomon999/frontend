import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { ExerciseResponse } from "../../services/exerciseService";
import { RoutineResponse } from "../../services/routineService";

interface ProgressFormData {
  reps: number;
  durationMin: number;
  effortLevel: number;
  setNumber: number;
  weightKg: number;
  exerciseId: number;
  routineId: number;
}

interface ProgressFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: ProgressFormData;
  onChange: (data: ProgressFormData) => void;
  exercises: ExerciseResponse[];
  routines: RoutineResponse[];
}

const ProgressForm = ({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  exercises,
  routines,
}: ProgressFormProps) => {
  const set = (field: Partial<ProgressFormData>) =>
    onChange({ ...formData, ...field });

  const canSubmit = formData.exerciseId > 0 && formData.routineId > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Registrar Actividad
        </DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          label="Rutina"
          margin="dense"
          value={formData.routineId || ""}
          onChange={(e) => set({ routineId: Number(e.target.value) })}
        >
          {routines.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Ejercicio"
          margin="dense"
          value={formData.exerciseId || ""}
          onChange={(e) => set({ exerciseId: Number(e.target.value) })}
        >
          {exercises.map((ex) => (
            <MenuItem key={ex.id} value={ex.id}>
              {ex.name}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={1} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 6 }}>
            <TextField
                fullWidth
                label="Repeticiones"
                margin="dense"
                type="number"
                slotProps={{
                htmlInput: { min: 0 },
                }}
                value={formData.reps}
                onChange={(e) => set({ reps: Number(e.target.value) })}
            />
            </Grid>

            <Grid size={{ xs: 6 }}>
            <TextField
                fullWidth
                label="Peso (kg)"
                margin="dense"
                type="number"
                slotProps={{
                htmlInput: { min: 0 },
                }}
                value={formData.weightKg}
                onChange={(e) => set({ weightKg: Number(e.target.value) })}
            />
            </Grid>

            <Grid size={{ xs: 6 }}>
            <TextField
                fullWidth
                label="Sets"
                margin="dense"
                type="number"
                slotProps={{
                htmlInput: { min: 1 },
                }}
                value={formData.setNumber}
                onChange={(e) => set({ setNumber: Number(e.target.value) })}
            />
            </Grid>

            <Grid size={{ xs: 6 }}>
            <TextField
                fullWidth
                label="Duración (min)"
                margin="dense"
                type="number"
                slotProps={{
                htmlInput: { min: 0 },
                }}
                value={formData.durationMin}
                onChange={(e) => set({ durationMin: Number(e.target.value) })}
            />
            </Grid>
        </Grid>

        <TextField
        fullWidth
        label="Nivel de Esfuerzo (1-10)"
        margin="dense"
        type="number"
        slotProps={{
            htmlInput: {
            min: 1,
            max: 10,
            },
        }}
        value={formData.effortLevel}
        onChange={(e) => set({ effortLevel: Number(e.target.value) })}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!canSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressForm;