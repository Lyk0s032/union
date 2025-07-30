import React, { useEffect, useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';

const formatMonthAxis = (date) => date.toLocaleString('es-CO', { month: 'short' });
const formatAxis = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
        timeZone: 'UTC', // La clave está aquí
        month: 'short',
        day: 'numeric',
    });
};

export default function GraphSerial({ datos, carga }){
  // 2. Usa useMemo para procesar los datos de forma segura y eficiente

  const dispatch = useDispatch();
  const ahora = dayjs().format('YYYY-MM-DD')
  const atras =  dayjs(ahora).subtract(6, 'month').format('YYYY-MM-DD');

  const refreshGraphDefault = () => {
      dispatch(actions.axiosToGetGraphProducto(true,atras, ahora))
  }
  const datosProcesados = useMemo(() => {
      // Si no hay datos o no es un arreglo, devuelve un arreglo vacío
      if (!Array.isArray(datos)) {
          return [];
      }
      // Transforma cada item, asegurando que 'fecha' sea un objeto Date
      return datos.map(item => ({
          ...item,
          fecha: new Date(item.fecha),
          cantidad: Number(item.cantidad)
      }));
    }, [datos]);
    return (
        <div className="graphGraph">
          {

            !datos && carga ?
              <div className="messageGraph">
                <h1>Cargando...</h1>
              </div>
            : !datos ?
              <div className="messageGraph">
                <h1>Sin resultados</h1>
              </div>
            : datos == 404 || datos == 'notrequest' ?
              <div className="messageGraph">
                <h1>404</h1>
              </div>
            : (
               <LineChart
               onDoubleClick={() => refreshGraphDefault()}
                  dataset={datosProcesados}
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
                                    const date = datosProcesados[dataIndex].fecha;
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
            )
          }
        </div>
    )
}