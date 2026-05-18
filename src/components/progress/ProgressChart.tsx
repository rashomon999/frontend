import { useMemo } from "react";
import { ProgressResponse } from "../../services/progressService";
import { Paper, Typography, Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  data: ProgressResponse[];
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  const [tab, setTab] = useState(0);

  // Datos agrupados por semana
  const weeklyData = useMemo(() => {
    const map: Record<string, { reps: number; esfuerzo: number[]; count: number }> = {};
    data.forEach((p) => {
      const date = new Date(p.dateLogged);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      const key = monday.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
      if (!map[key]) map[key] = { reps: 0, esfuerzo: [], count: 0 };
      map[key].reps += p.reps;
      map[key].esfuerzo.push(p.effortLevel);
      map[key].count += 1;
    });
    return Object.entries(map).map(([semana, v]) => ({
      semana,
      reps: v.reps,
      esfuerzoPromedio: parseFloat(
        (v.esfuerzo.reduce((a, b) => a + b, 0) / v.esfuerzo.length).toFixed(1)
      ),
      sesiones: v.count,
    }));
  }, [data]);

  // Datos agrupados por mes
  const monthlyData = useMemo(() => {
    const map: Record<string, { reps: number; esfuerzo: number[]; count: number }> = {};
    data.forEach((p) => {
      const date = new Date(p.dateLogged);
      const key = date.toLocaleDateString("es-CO", { month: "short", year: "numeric" });
      if (!map[key]) map[key] = { reps: 0, esfuerzo: [], count: 0 };
      map[key].reps += p.reps;
      map[key].esfuerzo.push(p.effortLevel);
      map[key].count += 1;
    });
    return Object.entries(map).map(([mes, v]) => ({
      mes,
      reps: v.reps,
      esfuerzoPromedio: parseFloat(
        (v.esfuerzo.reduce((a, b) => a + b, 0) / v.esfuerzo.length).toFixed(1)
      ),
      sesiones: v.count,
    }));
  }, [data]);

  // Datos por ejercicio
  const byExercise = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((p) => {
      const name = p.exerciseName || "Sin nombre";
      map[name] = (map[name] || 0) + p.reps;
    });
    return Object.entries(map)
      .map(([ejercicio, totalReps]) => ({ ejercicio, totalReps }))
      .sort((a, b) => b.totalReps - a.totalReps);
  }, [data]);

  const chartHeight = 280;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold" }}
        >
        Estadísticas de Rendimiento
        </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<ShowChartIcon fontSize="small" />} iconPosition="start" label="Semanal" />
        <Tab icon={<CalendarMonthIcon fontSize="small" />} iconPosition="start" label="Mensual" />
        <Tab icon={<FitnessCenterIcon fontSize="small" />} iconPosition="start" label="Por Ejercicio" />
      </Tabs>

      {/* Tab Semanal */}
      {tab === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Repeticiones y esfuerzo promedio por semana
          </Typography>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reps"
                stroke="#1976d2"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Repeticiones"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="esfuerzoPromedio"
                stroke="#ed6c02"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Esfuerzo (1-10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Tab Mensual */}
      {tab === 1 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sesiones y repeticiones totales por mes
          </Typography>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="reps"
                fill="#1976d2"
                radius={[4, 4, 0, 0]}
                name="Repeticiones"
              />
              <Bar
                yAxisId="right"
                dataKey="sesiones"
                fill="#2e7d32"
                radius={[4, 4, 0, 0]}
                name="Sesiones"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Tab Por Ejercicio */}
      {tab === 2 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total de repeticiones acumuladas por ejercicio
          </Typography>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={byExercise} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="ejercicio" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="totalReps" fill="#9c27b0" radius={[0, 4, 4, 0]} name="Total Reps" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default ProgressChart;