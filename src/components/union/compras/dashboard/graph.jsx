import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';

const formatMonthAxis = (date) => date.toLocaleString('es-CO', { month: 'short' });
const formatAxis = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
        timeZone: 'UTC', // La clave está aquí
        month: 'short',
        day: 'numeric',
    });
};

const productosDiarios = [
  { fecha: new Date('2025-01-1'), cantidad: 10 },
  { fecha: new Date('2025-01-5'), cantidad: 15 },
  { fecha: new Date('2025-01-10'), cantidad: 5 },
  { fecha: new Date('2025-01-20'), cantidad: 40 },

  { fecha: new Date('2025-01-28'), cantidad: 15 },
  { fecha: new Date('2025-02-10'), cantidad: 20 },
  { fecha: new Date('2025-02-22'), cantidad: 35 },
  { fecha: new Date('2025-03-05'), cantidad: 40 },
  { fecha: new Date('2025-03-18'), cantidad: 55 },
  { fecha: new Date('2025-04-12'), cantidad: 50 },
  { fecha: new Date('2025-04-29'), cantidad: 65 },
  { fecha: new Date('2025-05-20'), cantidad: 70 },
  { fecha: new Date('2025-06-15'), cantidad: 85 },
  { fecha: new Date('2025-06-30'), cantidad: 15 },
  { fecha: new Date('2025-07-10'), cantidad: 80 },
  { fecha: new Date('2025-07-15'), cantidad: 300 },
  { fecha: new Date('2025-07-20'), cantidad: 15 },

];
export default function GraphCompras(){
    return (
        <div className="graphHere">
            <LineChart
                className="grafica"
                  dataset={productosDiarios}
                  xAxis={[
                    {
                      dataKey: 'fecha',
                      scaleType: 'time',
                      valueFormatter: formatAxis,
                      disableLine: true,
                    },
                  ]}
                  yAxis={[
                    {
                      disableLine: true,
                    },
                  ]}
                  series={[
                    {
                      dataKey: 'cantidad',
                      label: 'Productos Creados',
                      showMark: false,
                      area: true,
                      // --- AQUÍ ESTÁ LA NUEVA LÓGICA ---
                    valueFormatter: (value, { dataIndex }) => {
                                    const date = productosDiarios[dataIndex].fecha;
                                    // Usamos getUTCDate() en lugar de getDate() para obtener el día correcto
                                    const dayOfMonth = date.getUTCDate();
                                    return `Día ${dayOfMonth}: ${value}`;
                                },
                    },
                  ]}
                  sx={{
                    '.MuiAreaElement-root': {
                      fill: 'url(#miGradienteAzul)',
                    },
                  }}
                >
                {/* 3. Definimos el degradado aquí DENTRO del componente LineChart */}
                <defs>
                  <linearGradient id="miGradienteAzul" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0288d1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
        </div>
    )
}