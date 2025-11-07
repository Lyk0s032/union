/* GraphComprasStyled.jsx */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

/* ----------------- PALETA Y UTILIDADES ----------------- */
const COUNT_TOTAL_COLOR = '#03a9f4';
const VALUE_COLOR = '#5e35b1';
const STAGE_COLORS = { preorden: '#FF9800', compras: '#2196F3', finalizadas: '#455a64' };
const AREA_GRADIENT_ID = 'ordersAreaGradient';

const formatMonth = (m) => String(m ?? '').toUpperCase().replace('.', '');
const formatCount = (v) => (Number(v) || 0).toLocaleString('es-CO');
const formatValue = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(v) || 0);

/* ----------------- TOOLTIP PERSONALIZADO (MUESTRA VALOR POR ETAPA) ----------------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const countTotalData = payload.find(p => p.dataKey === 'total_cantidad');
  const valueTotalData = payload.find(p => p.dataKey === 'total_valor');

  // payload[0].payload es el objeto original de esa x (mes)
  const original = payload[0]?.payload || {};

  const etapas = [
    { key: 'preorden', label: 'Preorden', color: STAGE_COLORS.preorden, valor: original.total_preorden_valor },
    { key: 'compras', label: 'En Compras', color: STAGE_COLORS.compras, valor: original.total_compras_valor },
    { key: 'finalizadas', label: 'Finalizadas', color: STAGE_COLORS.finalizadas, valor: original.total_finalizadas_valor },
  ];

  return (
    <div className="max-w-xs">
      {/* glass tooltip */}
      <div className="p-3 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg shadow-xl text-sm text-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-gray-600">MES</div>
          <div className="text-sm font-bold">{formatMonth(label)}</div>
        </div>

        {valueTotalData && (
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-semibold text-gray-500">Valor total</div>
            <div className="text-sm font-bold" style={{ color: VALUE_COLOR }}>{formatValue(valueTotalData.value)}</div>
          </div>
        )}

        {countTotalData && (
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <div className="text-xs font-semibold text-gray-500">Total órdenes</div>
            <div className="text-sm font-semibold" style={{ color: COUNT_TOTAL_COLOR }}>{formatCount(countTotalData.value)} und</div>
          </div>
        )}

        <div className="space-y-1">
          {etapas.map((e) => (
            <div key={e.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                <span className="text-xs text-gray-600">{e.label}</span>
              </div>
              <div className="text-sm font-medium" style={{ color: e.color }}>{formatValue(e.valor)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ----------------- COMPONENTE PRINCIPAL (ESTILADO + ANIMACIONES SUAVES) ----------------- */
export default function GraphComprasStyled({ chartData }) {
  // datos y agregación compatibles con tu estructura original
  const rawData = chartData?.resumen?.porEtapa || [];

  const aggregatedData = rawData.reduce((acc, item) => {
    const mesKey = item.mes ?? 'SIN-MES';
    if (!acc[mesKey]) {
      acc[mesKey] = {
        mes: mesKey,
        total_cantidad: 0,
        total_valor: 0,
        total_preorden: 0, total_compras: 0, total_finalizadas: 0,
        total_preorden_valor: 0, total_compras_valor: 0, total_finalizadas_valor: 0
      };
    }
    acc[mesKey].total_cantidad += Number(item.cantidad) || 0;
    acc[mesKey].total_valor += Number(item.total) || 0;

    const etapa = String(item.etapa || '').toLowerCase();
    if (etapa === 'preorden') {
      acc[mesKey].total_preorden += Number(item.cantidad) || 0;
      acc[mesKey].total_preorden_valor += Number(item.total) || 0;
    } else if (etapa === 'compras') {
      acc[mesKey].total_compras += Number(item.cantidad) || 0;
      acc[mesKey].total_compras_valor += Number(item.total) || 0;
    } else if (etapa === 'finalizadas') {
      acc[mesKey].total_finalizadas += Number(item.cantidad) || 0;
      acc[mesKey].total_finalizadas_valor += Number(item.total) || 0;
    }
    return acc;
  }, {});

  const chartDataArray = Object.values(aggregatedData);
  if (!chartDataArray.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-md">
        <p className="text-gray-500">No hay datos de órdenes para el filtro aplicado.</p>
      </div>
    );
  }

  const lineConfigs = [
    { key: 'total_cantidad', name: 'Cantidad Total', color: COUNT_TOTAL_COLOR, yAxisId: 'countAxis', isArea: true },
    { key: 'total_valor', name: 'Valor Total (COP)', color: VALUE_COLOR, yAxisId: 'valueAxis' },
    { key: 'total_preorden', name: 'Preorden', color: STAGE_COLORS.preorden, yAxisId: 'countAxis' },
    { key: 'total_compras', name: 'En Compras', color: STAGE_COLORS.compras, yAxisId: 'countAxis' },
    { key: 'total_finalizadas', name: 'Finalizadas', color: STAGE_COLORS.finalizadas, yAxisId: 'countAxis' },
  ];

  const [lineVisibility, setLineVisibility] = useState(lineConfigs.reduce((a, c) => ({ ...a, [c.key]: true }), {}));
  const handleLegendClick = ({ dataKey }) => setLineVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));

  /* motion variants */
  const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-white rounded-2xl shadow-[0_10px_30px_rgba(16,24,40,0.06)] transition-all"
      style={{ border: '1px solid rgba(16,24,40,0.04)' }}
    >
      {/* Inline CSS defensiva y estilo minimalista */}
      <style>{`
        /* fuerza para evitar puntos de Recharts */
        .graph-no-dots .recharts-surface circle,
        .graph-no-dots .recharts-active-dot,
        .graph-no-dots .recharts-surface ellipse,
        .graph-no-dots .recharts-surface rect {
          display: none !important;
          visibility: hidden !important;
        }
        /* pulido visual: tooltip z-index y sombra */
        .recharts-tooltip-wrapper { z-index: 1200; }
      `}</style>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 leading-tight">Tendencia Mensual</h3>
        </div>

        {/* small legend summary */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-600">· · ·</div>
        </div>
      </div>

      <div className="graph-no-dots">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartDataArray} margin={{ top: 8, right: 18, left: 8, bottom: 6 }}>
            <defs>
              <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COUNT_TOTAL_COLOR} stopOpacity={0.16} />
                <stop offset="95%" stopColor={COUNT_TOTAL_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="rgba(16,24,40,0.04)" />
            <XAxis dataKey="mes" tickFormatter={formatMonth} axisLine={false} tickLine={false} padding={{ left: 8, right: 8 }} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis yAxisId="countAxis" orientation="left" axisLine={false} tickLine={false} tickFormatter={formatCount} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis yAxisId="valueAxis" orientation="right" axisLine={false} tickLine={false} tickFormatter={formatValue} tick={{ fill: '#6b7280', fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.08)', strokeWidth: 1 }} />

            {/* Custom legend: keep default but clickable via onClick handler */}
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value, entry) => <span className="text-xs" style={{ color: entry.color }}>{value}</span>}
              onClick={handleLegendClick}
            />

            {lineConfigs.map((cfg) => (
              lineVisibility[cfg.key] && (
                <Line
                  key={cfg.key}
                  yAxisId={cfg.yAxisId}
                  type="monotone"
                  dataKey={cfg.key}
                  stroke={cfg.color}
                  strokeWidth={cfg.key === 'total_cantidad' ? 3.2 : (cfg.key === 'total_valor' ? 2.6 : 1.6)}
                  dot={false}
                  activeDot={null} /* defensiva */
                  isAnimationActive={false} /* evitar artefactos; la animación de contenedor es suficiente */
                  connectNulls
                  fill={cfg.key === 'total_cantidad' ? `url(#${AREA_GRADIENT_ID})` : 'none'}
                  opacity={0.98}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
      </div>
    </motion.div>
  );
}
