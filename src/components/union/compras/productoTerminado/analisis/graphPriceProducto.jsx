import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart, 
  Line,
  Area, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// --- FORMATO ---
// Función de formato de moneda (para Tooltip)
const formatCurrency = (v) => {
  if (v === null || v === undefined || isNaN(v)) return '';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
};

// Formato de fecha para eje X
const formatXAxis = (tickItem) => {
  if (!tickItem) return '';
  const date = new Date(tickItem);
  if (isNaN(date.getTime())) return tickItem;
  const options = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  return date.toLocaleDateString('es', options);
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------
export default function GraphProviderPricesProducto() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerInfo, setProviderInfo] = useState({ nombre: 'Cargando Proveedor', nit: '' });
  const [params, setParams] = useSearchParams();

  const materiaId = params.get('producto');
  const proveedorId = params.get('graph');

  // ------------------------------------------------------------------
  // FETCH HISTORIAL DE PRECIOS
  // ------------------------------------------------------------------
  const fetchPriceHistory = async (materiaId, proveedorId) => {
    if (!materiaId || !proveedorId) { 
      setData([]); 
      setProviderInfo({ nombre: 'Proveedor no seleccionado', nit: '' });
      return; 
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data: historyData } = await axios.get(
        `/api/materia/get/productoPrice/all/${materiaId}/${proveedorId}`
      );

      if (!historyData || historyData.length === 0) {
        throw { response: { status: 404 } };
      }

      // Convertimos 'valor' a número
      const formattedData = historyData.map(item => {
        let priceStr = String(item.valor); 
        let cleanPriceString = priceStr.replace(/[^\d]/g, '');
        let numericPrice = parseInt(cleanPriceString, 10); 
        if (isNaN(numericPrice)) numericPrice = 0;
        return { ...item, precio: numericPrice };
      });

      setData(formattedData);
      setProviderInfo({ nombre: `Proveedor ID: ${proveedorId}`, nit: 'Información no disponible' });

    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Error desconocido al obtener historial.';
      setError(errorMsg);
      setData([]);
      setProviderInfo({ nombre: 'Error de Carga', nit: '' });
    } finally {
      setLoading(false);
    }
  };

  // Efecto para actualizar cada vez que cambian los parámetros
  useEffect(() => {
    fetchPriceHistory(materiaId, proveedorId);
  }, [materiaId, proveedorId]);

  // ------------------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // ------------------------------------------------------------------
  const renderContent = () => {
    if (loading || data === null) return <h1 style={{ textAlign: 'center', padding: '50px 0' }}>Cargando...</h1>;
    if (error) return <h2 style={{ color: 'red', textAlign: 'center', padding: '50px 0' }}>Error: {error}</h2>;
    if (data.length === 0) return <h2 style={{ textAlign: 'center', padding: '50px 0' }}>No se encontró historial de precios para esta selección.</h2>;

    return (
      <div className="analisis-precio">
        <h3>Fluctuación Histórica de Precios</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
          >
            {/* Gradiente para sombra */}
            <defs>
              <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.8} /> 
                <stop offset="95%" stopColor="#6c63ff" stopOpacity={0.6} /> 
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis dataKey="createdAt" tickFormatter={formatXAxis} />
            <YAxis tick={false}
            width={20}
            domain={[
                (dataMin) => dataMin * 0.95,
                (dataMax) => dataMax * 1.05
            ]}   />

            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Precio']}
              labelFormatter={(label) => `Fecha: ${formatXAxis(label)}`} 
              contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }}
            />

            {/* Área debajo de la línea */}
            <Area
              type="monotone"
              dataKey="precio" 
              strokeWidth={0}
              fill="url(#colorPrecio)"
            />

            {/* Línea encima */}
            <Line
              type="monotone"
              dataKey="precio"
              stroke="#6c63ff"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ffffff', stroke: '#6c63ff', strokeWidth: 2 }}
              name="Precio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ------------------------------------------------------------------
  // RENDER FINAL
  // ------------------------------------------------------------------
  return (
    <div className="graphProviderPricesNube">
      <div className="containerGraphPrices">
        <div className="headerModal">
          <div className="divideThat">
            <h3>{data ? data[0].proveedor.nombre : null}</h3>
            <span>NIT: {data ? data[0].proveedor.nit : null}</span>
          </div>
          <div className="close">
            <button onClick={() => {
              params.delete('graph');
              params.delete('producto')
              setParams(params);
            }}>
              <MdOutlineClose className="icon" />
            </button>
          </div>
        </div>
        <div className="containerBodyGraph">
          <div className="containerBodyGraphCont">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
