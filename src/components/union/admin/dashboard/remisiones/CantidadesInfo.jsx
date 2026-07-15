import React from 'react';

/**
 * Componente para mostrar información detallada de cantidades en remisiones parciales
 */
export default function CantidadesInfo({ 
    infoCantidades, 
    esCalculoCompleto = false,
    showDetalle = false 
}) {
    if (!infoCantidades) {
        return <span style={{ color: '#999', fontSize: '12px' }}>Cargando...</span>;
    }

    const {
        cantidadComprometida,
        cantidadPreviamenteDespachada,
        cantidadPendiente,
        cantidadActualDespachada,
        estadoDespacho,
        porcentajeCompletado,
        error
    } = infoCantidades;

    // Colores según el estado
    const getEstadoColor = () => {
        switch (estadoDespacho) {
            case 'completo':
                return '#28a745';
            case 'parcial':
                return '#fd7e14';
            case 'pendiente':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };

    const getEstadoTexto = () => {
        switch (estadoDespacho) {
            case 'completo':
                return 'Completo';
            case 'parcial':
                return 'Parcial';
            case 'pendiente':
                return 'Pendiente';
            default:
                return 'N/A';
        }
    };

    if (showDetalle) {
        return (
            <div style={{
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '6px',
                border: `2px solid ${getEstadoColor()}`,
                fontSize: '12px'
            }}>
                {/* Header con estado */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: getEstadoColor()
                    }}>
                        Estado: {getEstadoTexto()}
                    </div>
                    {esCalculoCompleto && (
                        <div style={{
                            background: getEstadoColor(),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}>
                            {porcentajeCompletado?.toFixed(0) || 0}%
                        </div>
                    )}
                </div>

                {/* Información de cantidades */}
                <div style={{ lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Solicitado:</span>
                        <span style={{ fontWeight: '600' }}>{cantidadComprometida.toFixed(0)}</span>
                    </div>
                    
                    {esCalculoCompleto && cantidadPreviamenteDespachada > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fd7e14' }}>
                            <span>Despachado Anteriormente:</span>
                            <span style={{ fontWeight: '600' }}>{cantidadPreviamenteDespachada.toFixed(0)}</span>
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                        <span>Despachando Ahora:</span>
                        <span style={{ fontWeight: '600' }}>{cantidadActualDespachada.toFixed(0)}</span>
                    </div>
                    
                    {esCalculoCompleto && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            paddingTop: '4px',
                            borderTop: '1px solid #dee2e6',
                            marginTop: '4px',
                            color: cantidadPendiente > 0 ? '#dc3545' : '#28a745'
                        }}>
                            <span>Pendiente por Despachar:</span>
                            <span style={{ fontWeight: '600' }}>
                                {Math.max(0, cantidadPendiente - cantidadActualDespachada).toFixed(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Indicadores de advertencia */}
                {!esCalculoCompleto && (
                    <div style={{
                        marginTop: '8px',
                        padding: '6px',
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#856404'
                    }}>
                        ⚠️ Sin historial de despachos previos
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: '8px',
                        padding: '6px',
                        background: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#721c24'
                    }}>
                        ❌ {error}
                    </div>
                )}
            </div>
        );
    }

    // Vista compacta para la tabla
    return (
        <div style={{ textAlign: 'center' }}>
            {/* Cantidad actual con indicador de estado */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '4px'
            }}>
                <span style={{
                    background: getEstadoColor(),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                }}>
                    {cantidadActualDespachada.toFixed(0)}
                </span>
                
                {esCalculoCompleto && estadoDespacho === 'parcial' && (
                    <span style={{
                        fontSize: '10px',
                        color: '#fd7e14',
                        fontWeight: '600'
                    }}>
                        📦 +{cantidadPreviamenteDespachada.toFixed(0)}
                    </span>
                )}
            </div>

            {/* Información adicional compacta */}
            {esCalculoCompleto && (
                <div style={{ fontSize: '10px', color: '#666' }}>
                    {cantidadPendiente - cantidadActualDespachada > 0 
                        ? `Faltan: ${(cantidadPendiente - cantidadActualDespachada).toFixed(0)}`
                        : 'Completo'
                    }
                </div>
            )}

            {!esCalculoCompleto && (
                <div style={{ fontSize: '9px', color: '#fd7e14' }}>
                    Sin historial
                </div>
            )}
        </div>
    );
}

/**
 * Componente para mostrar resumen general de la remisión
 */
export function ResumenRemisionParcial({ resumen, loading }) {
    if (loading) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: '#666',
                fontSize: '14px'
            }}>
                📊 Calculando historial de despachos...
            </div>
        );
    }

    if (!resumen || resumen.totalItems === 0) {
        return null;
    }

    return (
        <div style={{
            background: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #bbdefb',
            marginBottom: '20px'
        }}>
            <div style={{ 
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#1565c0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                📊 RESUMEN DE DESPACHO PARCIAL
                <span style={{
                    background: '#1976d2',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                }}>
                    {resumen.porcentajeCompletoGeneral?.toFixed(0) || 0}% Completado
                </span>
            </div>
            
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                fontSize: '12px'
            }}>
                <div>
                    <div style={{ color: '#666' }}>Total Comprometido:</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {resumen.totalComprometido?.toFixed(0) || 0}
                    </div>
                </div>
                
                {resumen.totalPreviamenteDespachado > 0 && (
                    <div>
                        <div style={{ color: '#fd7e14' }}>Despachado Anteriormente:</div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#fd7e14' }}>
                            {resumen.totalPreviamenteDespachado?.toFixed(0) || 0}
                        </div>
                    </div>
                )}
                
                <div>
                    <div style={{ color: '#28a745' }}>Despachando Ahora:</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#28a745' }}>
                        {resumen.totalActualDespachado?.toFixed(0) || 0}
                    </div>
                </div>
                
                <div>
                    <div style={{ color: '#dc3545' }}>Pendiente Total:</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#dc3545' }}>
                        {Math.max(0, (resumen.totalComprometido || 0) - (resumen.totalPreviamenteDespachado || 0) - (resumen.totalActualDespachado || 0)).toFixed(0)}
                    </div>
                </div>
            </div>

            {/* Indicadores de progreso por items */}
            {(resumen.itemsCompletos > 0 || resumen.itemsParciales > 0) && (
                <div style={{ 
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #bbdefb',
                    display: 'flex',
                    gap: '15px',
                    fontSize: '11px'
                }}>
                    {resumen.itemsCompletos > 0 && (
                        <div style={{ color: '#28a745' }}>
                            ✅ {resumen.itemsCompletos} items completos
                        </div>
                    )}
                    {resumen.itemsParciales > 0 && (
                        <div style={{ color: '#fd7e14' }}>
                            📦 {resumen.itemsParciales} items parciales
                        </div>
                    )}
                    {resumen.itemsPendientes > 0 && (
                        <div style={{ color: '#6c757d' }}>
                            ⏳ {resumen.itemsPendientes} items pendientes
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}