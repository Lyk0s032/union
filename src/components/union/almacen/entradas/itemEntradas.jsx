import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemEntradas({ orden }) {
    const [params, setParams] = useSearchParams();
    const [showTooltip, setShowTooltip] = useState(false);
    
    if (!orden) return null;
    
    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'Sin fecha';
        try {
            const d = new Date(fecha);
            return d.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return String(fecha);
        }
    };
    
    const handleClick = () => {
        console.log('[ITEM_ENTRADAS] Abriendo orden:', orden.id);
        setParams({ orden: orden.id });
    };
    
    return (
        <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
            <td>{orden.id || 'N/A'}</td>
            <td>
                <span>{orden.nombre || orden.name || 'Sin nombre'}</span>
            </td>
            <td>
                <span>
                    {typeof orden.proveedor === 'object' 
                        ? (orden.proveedor?.nombre || orden.proveedor?.name || 'Sin proveedor')
                        : (orden.proveedor || orden.supplier || 'Sin proveedor')
                    }
                </span>
            </td>

            <td>
                <span>{formatearFecha(orden.fechaEntrada || orden.createdAt)}</span>
            </td>
            <td className="center" style={{ position: 'relative' }}>
                <div
                    style={{ 
                        position: 'relative',
                        display: 'inline-block'
                    }}
                    onMouseEnter={() => {
                        const requisiciones = orden?.requisiciones || [];
                        if (requisiciones.length > 0) {
                            setShowTooltip(true);
                        }
                    }}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <span
                        style={{ 
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textDecorationStyle: 'dotted'
                        }}
                    >
                        {orden?.requisiciones?.length || orden.totalProyectos || 0}
                    </span>
                    
                    {showTooltip && orden?.requisiciones && orden.requisiciones.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginBottom: '8px',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                minWidth: '200px',
                                maxWidth: '350px',
                                whiteSpace: 'normal',
                                pointerEvents: 'auto'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid #555', paddingBottom: '4px' }}>
                                Proyectos:
                            </div>
                            {orden.requisiciones.map((req, i) => {
                                const proyectoNombre = req.nombre || req.name || `Proyecto ${req.id || req.requisicionId || i + 1}`;
                                const cotizacionId = req.cotizacionId || req.cotizacion?.id;
                                const numeroCotizacion = cotizacionId ? Number(cotizacionId) + 21719 : 'N/A';
                                
                                return (
                                    <div key={req.id || i} style={{ marginBottom: '4px', lineHeight: '1.4' }}>
                                        <span style={{ fontWeight: '600' }}>Cot. {numeroCotizacion}</span>
                                        {' - '}
                                        <span>{proyectoNombre}</span>
                                    </div>
                                );
                            })}
                            {/* Flecha del tooltip */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-6px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid #333'
                                }}
                            />
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}