import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// --- DEFINICIÓN DE ESTILOS ---
const buttonStyle = {
  padding: '6px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  background: '#f0f0f0',
  transition: 'background 0.3s'
};

const disabledButtonStyle = {
  ...buttonStyle,
  background: '#6c63ff', // Color primario
  color: 'white',
  borderColor: '#6c63ff',
  cursor: 'default'
};

const inputStyle = {
  padding: '5px', 
  borderRadius: '4px', 
  border: '1px solid #ccc'
};
// --- FIN ESTILOS ---


export default function Analisis({ prima }) {
  // ----------------------------------------------
  // 1. HOOKS Y ESTADOS
  // ----------------------------------------------
  const [behavior, setBehavior] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ESTADOS DE FILTRO
  const [groupBy, setGroupBy] = useState('day'); // 'day', 'week', 'month'
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState('');     // YYYY-MM-DD


  // ----------------------------------------------
  // 2. FUNCIONES DE FORMATO Y LÓGICA
  // ----------------------------------------------

  // Funciones de formato de números y moneda
  const formatCurrency = (v) => {
    if (v === null || v === undefined) return '';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
  };
  
  // Función de formato para el eje Y de Cantidad
  const formatNumber = (v) => new Intl.NumberFormat('es-CO').format(v);

  // Función de formato para el Eje X (Fecha)
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    
    // Manejo de fechas completas (ej: 2025-10-21) vs. solo meses (ej: 2025-10)
    let dateStr = tickItem;
    // Si la cadena es 'YYYY-MM', la completamos a 'YYYY-MM-01'
    if (tickItem.length === 7) { 
        dateStr = tickItem + '-01'; 
    }
    
    // El 'T00:00:00Z' es crucial para no desfasar la fecha por zona horaria.
    const date = new Date(dateStr + 'T00:00:00Z'); 
    
    if (isNaN(date.getTime())) return tickItem; 

    // Opciones de formato (se ajustan según el agrupamiento)
    let options = {
        month: 'short', // 'Oct'
        timeZone: 'UTC' 
    };
    
    if (groupBy === 'day' || groupBy === 'week') {
        options.day = 'numeric'; // '21'
    }
    
    // Si es por mes o semana, añadimos el año para contexto
    if (groupBy === 'month' || groupBy === 'week') {
         options.year = 'numeric';
    }

    // Usa el idioma de tu preferencia ('es' para español)
    return date.toLocaleDateString('es', options);
  };


  // 👉 Función para traer datos del backend
  const fetchBehavior = async (materiaId, group, start, end) => {
    try {
      setLoading(true);
      setError(null); 

      const params = new URLSearchParams();
      params.append('groupBy', group); 

      if (start) {
        params.append('startDate', start);
      }
      if (end) {
        params.append('endDate', end);
      }
      
      const { data } = await axios.get(
        `/api/materia/get/graph/data/${materiaId}?${params.toString()}`
      ); 

      if (!data || !data.data) {
        throw new Error('Respuesta inesperada del servidor');
      }

      const { labels = [], datasets } = data.data;
      const chartData = labels.map((label, index) => ({
        periodo: label,
        cantidadTotal: datasets?.totals?.cantidad?.[index] || 0,
        valorTotal: datasets?.totals?.valor?.[index] || 0,
      }));
      
      setBehavior(chartData);
      
    } catch (err) {
      console.error('Error al obtener comportamiento:', err);
      // Si es 404 (Sin datos), NO establecemos error, solo el array vacío
      if (err.response?.status === 404) {
        setBehavior([]); 
      } else {
        // Para errores reales de conexión/servidor
        setError(err.response?.data?.msg || err.message || 'Error desconocido');
        setBehavior([]); 
      }
    } finally {
      setLoading(false);
    }
  };


  // ----------------------------------------------
  // 3. EFECTOS (Controlan la recarga de datos)
  // ----------------------------------------------

  // Se dispara si cambia prima, groupBy, startDate o endDate
  useEffect(() => {
    if (!prima?.id) return;
    fetchBehavior(prima.id, groupBy, startDate, endDate); 
  }, [prima?.id, groupBy, startDate, endDate]);


  // ----------------------------------------------
  // 4. FUNCIÓN DE RENDERIZADO DE FILTROS
  // ----------------------------------------------

  const renderFilters = () => (
    <div className="filtros-grafica" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
      
      {/* Filtros GroupBy (Día, Semana, Mes) */}
      <button 
        style={groupBy === 'day' ? disabledButtonStyle : buttonStyle}
        onClick={() => setGroupBy('day')} 
        disabled={loading || groupBy === 'day'}
      >
        Por Día
      </button>
      <button 
        style={groupBy === 'week' ? disabledButtonStyle : buttonStyle}
        onClick={() => setGroupBy('week')} 
        disabled={loading || groupBy === 'week'}
      >
        Por Semana
      </button>
      <button 
        style={groupBy === 'month' ? disabledButtonStyle : buttonStyle}
        onClick={() => setGroupBy('month')} 
        disabled={loading || groupBy === 'month'}
      >
        Por Mes
      </button>

      <span style={{borderLeft: '2px solid #eee', height: '30px'}}></span>

      {/* Filtros de Fecha */}
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <label htmlFor="startDate" style={{fontSize: '0.9em'}}>Desde:</label>
        <input 
          type="date" 
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
          style={inputStyle}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <label htmlFor="endDate" style={{fontSize: '0.9em'}}>Hasta:</label>
        <input 
          type="date" 
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
          style={inputStyle}
        />
      </div>
      
      <button 
        style={{...buttonStyle, background: '#fbebeb', borderColor: '#f9c5c5'}}
        onClick={() => { setStartDate(''); setEndDate(''); }} 
        disabled={loading || (!startDate && !endDate)}
      >
        Limpiar Fechas
      </button>
    </div>
  );


  // ----------------------------------------------
  // 5. VISTAS CONDICIONALES (RETURN TEMPRANO)
  // ----------------------------------------------
  if (loading && !behavior) { 
    return (
      <div className="analisis">
        <div className="containerAnalisis">
          {renderFilters()}
          <p>Cargando comportamiento de la materia prima...</p>
        </div><br /><br />
      </div>
    );
  }
  
  // Mensaje de Error (SOLO para errores reales de conexión/servidor)
  if (error) { 
    return (
      <div className="analisis">
        <div className="containerAnalisis">
          {renderFilters()} 
          <p style={{ color: 'red', marginTop: '20px' }}>
            Error de conexión/servidor: {error}
          </p>
        </div>
        <br />
      </div>
    );
  }

  // ----------------------------------------------
  // 6. RENDERIZADO FINAL
  // ----------------------------------------------
    // Variable auxiliar para el renderizado condicional de la serie Valor
    const hasMultipleData = behavior && behavior.length > 1;

  return (
    <div className="analisis">
      <div className="containerAnalisis">
        <h2>Comportamiento de compras</h2><br /><br />

        {/* Mostramos los filtros */}
        {renderFilters()}

        {/* Mostramos la gráfica solo si hay datos (behavior.length > 0) */}
        {behavior && behavior.length > 0 && (
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart
              data={behavior}
              margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            >
              {/* Definición de gradiente para el Area */}
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c49f" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00c49f" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="periodo" padding={{ left: 10, right: 10 }} tickFormatter={formatXAxis}/>
              
              {/* Ejes Y */}
              <YAxis yAxisId="left" orientation="left" tickFormatter={formatNumber} allowDecimals={false} width={80} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} width={110} />

              {/* Tooltip */}
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'Valor comprado') return [formatCurrency(value), name];
                  return [formatNumber(value), name];
                }}
                contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}
              />

              <Legend verticalAlign="top" height={36} />

              {/* 1. Bar para Cantidad (Siempre Barra) */}
              <Bar
                yAxisId="left"
                dataKey="cantidadTotal"
                name="Cantidad comprada"
                barSize={40}
                radius={[6, 6, 0, 0]}
                fill="#6c63ff"
              />

              {/* 2. RENDERING CONDICIONAL para Valor comprado */}
              {hasMultipleData ? (
                /* CASO A: Múltiples datos -> Usar Area (Línea con relleno) */
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="valorTotal"
                  name="Valor comprado"
                  stroke="#00c49f"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValor)"
                  dot={{ strokeWidth: 2, r: 4, fill: '#ffffff', stroke: '#00c49f' }}
                  activeDot={{ r: 6 }}
                  connectNulls={true}
                />
              ) : (
                /* CASO B: Un solo dato -> Usar Barra (para eliminar el punto flotante) */
                 <Bar
                  yAxisId="right"
                  dataKey="valorTotal"
                  name="Valor comprado"
                  barSize={40}
                  radius={[6, 6, 0, 0]}
                  fill="#00c49f" // Color turquesa
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}