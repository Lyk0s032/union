import React, { useEffect, useMemo, useState } from 'react';
import OrdenModal from './orden/ordenModal';
import { useSearchParams } from 'react-router-dom';
import ItemEntradas from './itemEntradas';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';

export default function GeneralEntradas() {
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [proyectosSeleccionados, setProyectosSeleccionados] = useState([]);
    const [mostrarFiltroProyectos, setMostrarFiltroProyectos] = useState(false);
    const dispatch = useDispatch();
    
    // Obtener datos del reducer
    const almacen = useSelector(store => store.almacen);
    const { ordenes, loadingOrdenes } = almacen;
    
    // Estado para rastrear si ya se cargó la primera vez
    const [firstLoadDone, setFirstLoadDone] = useState(false);
    
    // Cargar órdenes al montar el componente
    useEffect(() => {
        // Primera carga con loading (true)
        dispatch(actions.axiosToGetOrdenesAlmacen(true));
        setFirstLoadDone(true);
    }, [dispatch]);
    
    // Cerrar el dropdown de proyectos al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mostrarFiltroProyectos && !event.target.closest('[data-proyectos-filter]')) {
                setMostrarFiltroProyectos(false);
            }
        };
        
        if (mostrarFiltroProyectos) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [mostrarFiltroProyectos]);
    
    // Recargar sin loading cuando firstLoadDone cambia (para recargas posteriores)
    const recargarOrdenes = () => {
        dispatch(actions.axiosToGetOrdenesAlmacen(false));
    };
    
    // Obtener todos los proyectos únicos de todas las órdenes
    const todosLosProyectos = useMemo(() => {
        if (!ordenes || ordenes === 'notrequest' || ordenes === 404) {
            return [];
        }
        
        const ordenesArray = Array.isArray(ordenes) ? ordenes : [];
        const proyectosMap = new Map();
        
        ordenesArray.forEach(orden => {
            const requisiciones = orden?.requisiciones || [];
            requisiciones.forEach(req => {
                const proyectoId = req.id || req.requisicionId;
                if (proyectoId && !proyectosMap.has(proyectoId)) {
                    const proyectoNombre = req.nombre || req.name || `Proyecto ${proyectoId}`;
                    const cotizacionId = req.cotizacionId || req.cotizacion?.id;
                    const numeroCotizacion = cotizacionId ? Number(cotizacionId) + 21719 : null;
                    
                    proyectosMap.set(proyectoId, {
                        id: proyectoId,
                        nombre: proyectoNombre,
                        numeroCotizacion: numeroCotizacion
                    });
                }
            });
        });
        
        return Array.from(proyectosMap.values()).sort((a, b) => {
            // Ordenar por número de cotización si existe, sino por nombre
            if (a.numeroCotizacion && b.numeroCotizacion) {
                return b.numeroCotizacion - a.numeroCotizacion;
            }
            return a.nombre.localeCompare(b.nombre);
        });
    }, [ordenes]);
    
    // Filtrar órdenes según búsqueda y proyectos seleccionados
    const ordenesFiltradas = useMemo(() => {
        if (!ordenes || ordenes === 'notrequest' || ordenes === 404) {
            return [];
        }
        
        const ordenesArray = Array.isArray(ordenes) ? ordenes : [];
        
        // Filtro por búsqueda de texto
        let filtradas = ordenesArray;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtradas = filtradas.filter(orden => 
                String(orden.id || '').toLowerCase().includes(query) ||
                String(orden.nombre || orden.name || '').toLowerCase().includes(query) ||
                String(orden.proveedor || orden.supplier || '').toLowerCase().includes(query)
            );
        }
        
        // Filtro por proyectos seleccionados
        if (proyectosSeleccionados.length > 0) {
            filtradas = filtradas.filter(orden => {
                const requisiciones = orden?.requisiciones || [];
                return requisiciones.some(req => {
                    const proyectoId = req.id || req.requisicionId;
                    return proyectosSeleccionados.includes(proyectoId);
                });
            });
        }
        
        return filtradas;
    }, [ordenes, searchQuery, proyectosSeleccionados]);
    
    // Manejar selección de proyectos
    const toggleProyecto = (proyectoId) => {
        setProyectosSeleccionados(prev => {
            if (prev.includes(proyectoId)) {
                return prev.filter(id => id !== proyectoId);
            } else {
                return [...prev, proyectoId];
            }
        });
    };
    
    const limpiarFiltroProyectos = () => {
        setProyectosSeleccionados([]);
    };
    
    
    return (
        <div className="general-entradas">
            <div className="containerEntradas">
                <div className="topHeader">
                    <div className="divideTop">
                        <div className="title">
                            <h3>Entradas de almacén</h3>
                        </div>
                        <div className="buttons">

                        </div>
                    </div>
                </div>
                <div className="headerEntradas">
                    <div className="divideHeader">
                        <div className="inputSearch">
                            <input 
                                type="text" 
                                placeholder="Buscar entrada" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="buttonsOptions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {/* Botón de filtro por proyectos */}
                            <div style={{ position: 'relative' }} data-proyectos-filter>
                                <button 
                                    onClick={() => setMostrarFiltroProyectos(!mostrarFiltroProyectos)}
                                    style={{ 
                                        padding: '8px 16px', 
                                        cursor: 'pointer',
                                        width: '180px',
                                        backgroundColor: proyectosSeleccionados.length > 0 ? '#007bff' : '#ccc',
                                        color: proyectosSeleccionados.length > 0 ? '#fff' : '#333',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span>📋 Filtrar por proyectos</span>
                                    {proyectosSeleccionados.length > 0 && (
                                        <span style={{ 
                                            backgroundColor: '#fff',
                                            color: '#007bff',
                                            borderRadius: '10px',
                                            padding: '2px 6px',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}>
                                            {proyectosSeleccionados.length}
                                        </span>
                                    )}
                                </button>
                                
                                {/* Dropdown de proyectos */}
                                {mostrarFiltroProyectos && (
                                    <div
                                        data-proyectos-filter
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            zIndex: 1000,
                                            minWidth: '300px',
                                            maxHeight: '400px',
                                            overflowY: 'auto',
                                            padding: '12px'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: '1px solid #eee'
                                        }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                                                Filtrar por proyectos
                                            </h4>
                                            {proyectosSeleccionados.length > 0 && (
                                                <button
                                                    onClick={limpiarFiltroProyectos}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        backgroundColor: '#f0f0f0',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Limpiar
                                                </button>
                                            )}
                                        </div>
                                        
                                        {todosLosProyectos.length === 0 ? (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                                No hay proyectos disponibles
                                            </div>
                                        ) : (
                                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                {todosLosProyectos.map(proyecto => {
                                                    const estaSeleccionado = proyectosSeleccionados.includes(proyecto.id);
                                                    return (
                                                        <label
                                                            key={proyecto.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '8px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px',
                                                                backgroundColor: estaSeleccionado ? '#e7f3ff' : 'transparent',
                                                                marginBottom: '4px',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!estaSeleccionado) {
                                                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (!estaSeleccionado) {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={estaSeleccionado}
                                                                onChange={() => toggleProyecto(proyecto.id)}
                                                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: estaSeleccionado ? '600' : '400', fontSize: '13px' }}>
                                                                    {proyecto.nombre}
                                                                </div>
                                                                {proyecto.numeroCotizacion && (
                                                                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                        Cot. {proyecto.numeroCotizacion}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <button className="download">
                                <span>Descargar lista</span>
                            </button>

                        </div>
                    </div>
                </div>

                <div className="containerData">
                    <div className="containerTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nro. </th>
                                    <th>Nombre</th>
                                    <th>Proveedor</th>
                                    <th>Fecha entrada</th>
                                    <th>Proyectos</th>

                                </tr>
                            </thead>
                            <tbody>
                                {loadingOrdenes && !firstLoadDone ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                            <span>Cargando órdenes...</span>
                                        </td>
                                    </tr>
                                ) : ordenesFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                            <span>No hay órdenes de compra registradas</span>
                                        </td>
                                    </tr>
                                ) : (
                                    ordenesFiltradas.map((orden, index) => (
                                        <ItemEntradas key={orden.id || index} orden={orden} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                params.get('orden') ?
                    <OrdenModal />
                : null
            }
        </div>
    )
}