import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import RemisionItems from './remisionItems';
import RemisionModal from './remisionModal';

export default function GeneralRemisiones() {
    const dispatch = useDispatch();
    const remisionesState = useSelector(store => store.remisiones || {});
    const { remisiones, loadingRemisiones, remision, loadingRemision } = remisionesState;

    const [busqueda, setBusqueda] = useState('');
    const [remisionSeleccionada, setRemisionSeleccionada] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [cargaInicial, setCargaInicial] = useState(false);

    // Cargar remisiones al montar
    useEffect(() => {
        if (!cargaInicial) {
            dispatch(actions.axiosToGetRemisiones(true, 1));
            setCargaInicial(true);
        }
    }, [cargaInicial, dispatch]);

    // Cargar remisión específica cuando se selecciona
    useEffect(() => {
        if (remisionSeleccionada) {
            console.log('[REMISION_MODAL] Abriendo remisión:', remisionSeleccionada);
            dispatch(actions.axiosToGetRemision(true, remisionSeleccionada));
        }
    }, [remisionSeleccionada, dispatch]);

    const handleCambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        dispatch(actions.axiosToGetRemisiones(false, nuevaPagina));
    };

    const handleDescargarLista = () => {
        if (!remisiones?.remisiones || remisiones.remisiones.length === 0) {
            dispatch(actions.HandleAlerta('No hay remisiones para descargar', 'mistake'));
            return;
        }

        const csv = [
            ['Número', 'Nombre', 'Proyecto', 'Cliente', 'Estado', 'Cantidad', 'Fecha'].join(','),
            ...remisiones.remisiones.map(r => [
                r.numeroRemision,
                r.necesidadProyecto?.kit?.name || r.necesidadProyecto?.producto?.item || 'N/A',
                r.necesidadProyecto?.requisicion?.nombre || 'N/A',
                r.necesidadProyecto?.requisicion?.cotizacion?.client?.name || 'N/A',
                r.estado,
                r.cantidad,
                new Date(r.createdAt).toLocaleDateString('es-ES')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `remisiones_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        dispatch(actions.HandleAlerta('Lista descargada exitosamente', 'positive'));
    };

    const handleAbrirRemision = (numeroRemision) => {
        console.log('[ABRIR_REMISION] Click en remisión:', numeroRemision);
        setRemisionSeleccionada(numeroRemision);
    };

    const handleCerrarModal = () => {
        console.log('[CERRAR_REMISION] Cerrando modal');
        setRemisionSeleccionada(null);
    };

    // Filtrar remisiones por búsqueda
    const remisionesFiltradas = remisiones?.remisiones?.filter(r => {
        if (!busqueda) return true;
        const searchLower = busqueda.toLowerCase();
        return (
            r.numeroRemision?.toLowerCase().includes(searchLower) ||
            r.necesidadProyecto?.kit?.name?.toLowerCase().includes(searchLower) ||
            r.necesidadProyecto?.producto?.item?.toLowerCase().includes(searchLower) ||
            r.necesidadProyecto?.requisicion?.nombre?.toLowerCase().includes(searchLower) ||
            r.necesidadProyecto?.requisicion?.cotizacion?.client?.name?.toLowerCase().includes(searchLower)
        );
    }) || [];

    const totalPaginas = remisiones?.totalPages || 1;

    return (
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ 
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ 
                    fontSize: '28px', 
                    fontWeight: '700',
                    margin: 0,
                    color: '#333'
                }}>
                    Remisiones
                </h1>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Total: {remisiones?.total || 0} remisiones
                </div>
            </div>

            {/* Barra de búsqueda y acciones */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '25px',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Buscar por número, nombre, proyecto o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={handleDescargarLista}
                    disabled={!remisiones?.remisiones || remisiones.remisiones.length === 0}
                    style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#2f8bfd',
                        color: '#fff',
                        cursor: remisiones?.remisiones?.length > 0 ? 'pointer' : 'not-allowed',
                        opacity: remisiones?.remisiones?.length > 0 ? 1 : 0.5,
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                >
                    📥 Descargar lista
                </button>
            </div>

            {/* Tabla de remisiones */}
            {loadingRemisiones && !remisiones ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                        Cargando remisiones...
                    </div>
                    <div className="spinner" style={{ 
                        width: 40, 
                        height: 40, 
                        border: '4px solid #f3f4f6', 
                        borderTopColor: '#2f8bfd', 
                        borderRadius: '50%', 
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
            ) : remisiones === 'notrequest' || remisiones === 404 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    border: '1px solid #ffc107'
                }}>
                    <div style={{ fontSize: '18px', color: '#856404' }}>
                        ⚠️ Error al cargar las remisiones
                    </div>
                    <button 
                        onClick={() => dispatch(actions.axiosToGetRemisiones(true, 1))}
                        style={{
                            marginTop: '15px',
                            padding: '10px 20px',
                            background: '#2f8bfd',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            ) : remisionesFiltradas.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>
                        {busqueda 
                            ? `No se encontraron remisiones con "${busqueda}"`
                            : 'No hay remisiones registradas'
                        }
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ 
                        background: '#fff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ 
                                        padding: '15px',
                                        textAlign: 'left',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        Número
                                    </th>
                                    <th style={{ 
                                        padding: '15px',
                                        textAlign: 'left',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        Nombre
                                    </th>
                                    <th style={{ 
                                        padding: '15px',
                                        textAlign: 'left',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        Proyecto
                                    </th>
                                    <th style={{ 
                                        padding: '15px',
                                        textAlign: 'left',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        Cliente
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {remisionesFiltradas.map((remision, index) => (
                                    <RemisionItems 
                                        key={index}
                                        remision={remision}
                                        onAbrir={handleAbrirRemision}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            gap: '15px',
                            marginTop: '25px'
                        }}>
                            <button
                                onClick={() => handleCambiarPagina(paginaActual - 1)}
                                disabled={paginaActual === 1 || loadingRemisiones}
                                style={{
                                    padding: '10px 20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    background: '#fff',
                                    cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                                    opacity: paginaActual === 1 ? 0.5 : 1
                                }}
                            >
                                ← Anterior
                            </button>

                            <span style={{ fontSize: '14px', color: '#666' }}>
                                Página {paginaActual} de {totalPaginas}
                            </span>

                            <button
                                onClick={() => handleCambiarPagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas || loadingRemisiones}
                                style={{
                                    padding: '10px 20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    background: '#fff',
                                    cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                                    opacity: paginaActual === totalPaginas ? 0.5 : 1
                                }}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal de remisión */}
            {remisionSeleccionada && (
                <>
                    {console.log('[MODAL_RENDER] Estado:', { 
                        remisionSeleccionada, 
                        remision: remision ? 'Existe' : 'Null', 
                        loadingRemision 
                    })}
                    {loadingRemision ? (
                        <div className="modal" style={{ zIndex: 15 }}>
                            <div className="hiddenModal" onClick={handleCerrarModal}></div>
                            <div className="containerModal" style={{ 
                                maxWidth: '500px', 
                                padding: '60px',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '18px', marginBottom: '10px', color: '#666' }}>
                                    Cargando remisión...
                                </div>
                                <div className="spinner" style={{ 
                                    width: 40, 
                                    height: 40, 
                                    border: '4px solid #f3f4f6', 
                                    borderTopColor: '#2f8bfd', 
                                    borderRadius: '50%', 
                                    animation: 'spin 0.8s linear infinite',
                                    margin: '0 auto'
                                }}></div>
                            </div>
                        </div>
                    ) : remision && remision !== 'notrequest' && remision !== 404 ? (
                        <RemisionModal
                            remision={remision}
                            onClose={handleCerrarModal}
                        />
                    ) : (
                        <div className="modal" style={{ zIndex: 15 }}>
                            <div className="hiddenModal" onClick={handleCerrarModal}></div>
                            <div className="containerModal" style={{ 
                                maxWidth: '500px', 
                                padding: '60px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                background: '#fff3cd',
                                border: '1px solid #ffc107'
                            }}>
                                <div style={{ fontSize: '18px', color: '#856404' }}>
                                    ⚠️ Error al cargar la remisión
                                </div>
                                <button 
                                    onClick={handleCerrarModal}
                                    style={{
                                        marginTop: '15px',
                                        padding: '10px 20px',
                                        background: '#2f8bfd',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
