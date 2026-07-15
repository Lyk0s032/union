import React, { useState } from 'react';

const ESTADO_CONFIG = {
    pendiente:   { label: 'Pendiente',   bg: '#fff3cd', color: '#856404' },
    parcial:     { label: 'Parcial',     bg: '#fff0e6', color: '#fd7e14' },
    remisionado: { label: 'Remisionado', bg: '#d4edda', color: '#155724' },
};

function getEstadoEfectivo(r) {
    if (r.estado === 'Remisionada') return 'remisionado';
    if (r.estado === 'Cancelada') return 'cancelada';

    const items = r.itemRemisions || [];
    if (items.length === 0) return 'pendiente';

    const totalComprometido = items.reduce((sum, item) =>
        sum + Number(item?.necesidadProyecto?.cantidadComprometida || 0), 0);
    const totalDespachado = items.reduce((sum, item) =>
        sum + Number(item?.cantidad || 0), 0);

    if (totalDespachado === 0) return 'pendiente';
    if (totalComprometido > 0 && totalDespachado >= totalComprometido) return 'remisionado';
    return 'parcial';
}

export default function RemisionItems({ remision, onAbrir }) {
    const [hover, setHover] = useState(false);

    const handleClick = () => {
        onAbrir(remision.id);
    };

    const estado = getEstadoEfectivo(remision);
    const { label, bg, color } = ESTADO_CONFIG[estado];
    
    return (
        <tr 
            onClick={handleClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: hover ? '#f8f9fa' : '#fff',
                transition: 'background 0.2s',
                cursor: 'pointer'
            }}
        >
            <td style={{ 
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2f8bfd'
            }}>
                {Number(remision.id + 4890)}
            </td>
            {/* <td style={{ 
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '14px',
                color: '#333'
            }}>
                {remision.numeroRemision || 
                 remision.necesidadProyecto?.producto?.item || 
                 'N/A'}
                {remision.necesidadProyecto?.kit?.extension?.name && 
                 <span style={{ color: '#666', fontSize: '13px' }}>
                     {` - ${remision.necesidadProyecto.kit.extension.name}`}
                 </span>
                }
            </td> */}
            
            <td style={{ 
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '14px',
                color: '#333'
            }}>
                {remision.requisicion?.cotizacion?.client?.nombre || 'N/A'}
            </td>
            <td style={{ 
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '14px',
                color: '#333'
            }}>
                {remision.requisicion?.nombre || 'N/A'}
            </td>
            <td style={{
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
            }}>
                <span style={{
                    background: bg,
                    color,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                }}>
                    {label}
                </span>
            </td>
        </tr>
    );
}
