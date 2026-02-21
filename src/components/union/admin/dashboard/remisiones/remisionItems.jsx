import React, { useState } from 'react';

export default function RemisionItems({ remision, onAbrir }) {
    const [hover, setHover] = useState(false);

    const handleClick = () => {
        console.log('[ITEM_CLICK] Remision clickeada:', remision.id);
        onAbrir(remision.id);
    };
    
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
                {remision.id}
            </td>
            <td style={{ 
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
                fontSize: '14px',
                color: '#333'
            }}>
                {remision.requisicion?.cotizacion?.client?.nombre || 'N/A'}
            </td>
        </tr>
    );
}
