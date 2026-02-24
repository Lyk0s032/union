import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemNecesidad as ItemNecesidadType } from '../types';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

interface Proveedor {
    id: number;
    nombre: string;
    inicial: string;
    precio: number;
}

interface ProyectoItem {
    id: number;
    nombre: string;
    estado: string;
    actual: number;
    total: number;
    faltante: number;
    comprasCotizacionItemId: number; // ID del item de comprasCotizacionItem
}

interface DetalleItemProps {
    item: ItemNecesidadType | null;
    onClose: () => void;
    onProveedorClick?: (proveedor: Proveedor) => void;
}

export default function DetalleItem({ item, onClose, onProveedorClick }: DetalleItemProps) {
    const dispatch = useDispatch();
    const req = useSelector((state: any) => state.requisicion);
    // Obtener ids de las requisiciones seleccionadas (como en itemMp.jsx)
    const ids = req.requisicionesSeleccionadas || req.ids || [];
    const itemRequisicion = req.itemRequisicion;
    const loadingItemRequisicion = req.loadingItemRequisicion;

    // Estados para edición de cantidad
    const [editandoProyectoId, setEditandoProyectoId] = useState<number | null>(null);
    const [cantidadEditada, setCantidadEditada] = useState<string>('');
    const [guardando, setGuardando] = useState(false);

    // Función para recargar los datos silenciosamente
    const recargarDatos = () => {
        if (!item?.id || !item?.tipo) return;
        
        dispatch(actions.gettingItemRequisicion(false)); // false para carga silenciosa
        
        const body = {
            mpId: item.id,
            ids: ids
        };
        
        const endpoint = item.tipo === 'materia-prima' 
            ? '/api/requisicion/get/materiales/materia/'
            : '/api/requisicion/get/materiales/producto/';
        
        axios.post(endpoint, body)
            .then((res) => {
                dispatch(actions.getItemRequisicion(res.data));
            })
            .catch((err) => {
                console.log(err);
                dispatch(actions.getItemRequisicion(404));
            });
    };
    console.log('itemRequisicion', itemRequisicion);
    console.log('itemssssssssss', item);
    // Función para enviar la cantidad actualizada
    const sendHowMany = async (how: string, comprasCotizacionItemId: number, proyecto) => {
        if (!how || isNaN(Number(how))) {
            setEditandoProyectoId(null);
            setCantidadEditada('');
            return;
        }

        setGuardando(true);
        try {
            const body = {
                cantidadEntrega: Number(how),
                comprasItemCotizacion: comprasCotizacionItemId,
                requisicionId: proyecto.requisicionId,
                materiaId: item.tipo === 'materia-prima' ? item.id : null,
                productoId: item.tipo === 'producto-terminado' ? item.id : null,
            };
            console.log('body', body)
            console.log('item en body', item)
            await axios.put(`/api/requisicion/put/updateCantidad/comprasCotizacionItem`, body);
            
            // Recargar datos silenciosamente
            recargarDatos();
            
            // Recargar requisiciones silenciosamente
            if (ids && ids.length > 0) {
                (dispatch as any)(actions.axiosToGetRealProyectosRequisicion(ids, false));
            }
            
            setEditandoProyectoId(null);
            setCantidadEditada('');
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            (dispatch as any)(actions.HandleAlerta('No hemos logrado actualizar la cantidad', 'mistake'));
        } finally {
            setGuardando(false);
        }
    };

    // Llamar a la API cuando se abre el panel (usando la función existente como en itemMp.jsx)
    useEffect(() => {
        console.log('arrancaa detalle item');
        if (!item?.id || !item?.tipo) return;
    
        dispatch(actions.cleanItemsForCotizacion());
    
        // Usar la misma lógica que itemMp.jsx (líneas 38-53)
        dispatch(actions.gettingItemRequisicion(true));
        
        const body = {
            mpId: item.id,
            ids: ids
        };
        
        const endpoint = item.tipo === 'materia-prima' 
            ? '/api/requisicion/get/materiales/materia/'
            : '/api/requisicion/get/materiales/producto/';
        
        axios.post(endpoint, body)
            .then((res) => {
                dispatch(actions.getItemRequisicion(res.data));
            })
            .catch((err) => {
                console.log(err);
                dispatch(actions.getItemRequisicion(404));
            });
    }, [item?.id, item?.tipo, ids, dispatch]);
    
    
    if (!item) return null;

    // Obtener datos de itemRequisicion (donde se guardan los datos de la API)
    const data = itemRequisicion && itemRequisicion !== 404 ? itemRequisicion : null;
    const loading = loadingItemRequisicion;

    // Mapear datos de la API a la estructura esperada
    // La estructura puede variar según la respuesta real de la API
    const proveedores: Proveedor[] = item.tipo === 'materia-prima' ? data?.prices?.map((pr: any) => ({
        id: pr.proveedor?.id || pr.pvId || pr.proveedorId || pr.id, // ID del proveedor, no del precio
        nombre: pr.proveedor?.nombre || pr.name,
        inicial: (pr.proveedor?.nombre || pr.name || '?').charAt(0).toUpperCase(),
        precio: pr.precio || pr.price || pr.valor || 0
    })) || [] : data?.productPrices?.map((pr: any) => ({
        id: pr.proveedor?.id || pr.pvId || pr.proveedorId || pr.id, // ID del proveedor, no del precio
        nombre: pr.proveedor?.nombre || pr.name,
        inicial: (pr.proveedor?.nombre || pr.name || '?').charAt(0).toUpperCase(),
        precio: pr.precio || pr.price || pr.valor || 0
    })) || [];

    const proyectos: ProyectoItem[] = data?.itemRequisicions?.map((proj: any) => ({
        id: proj.requisicion.cotizacionId,
        requisicionId: proj.requisicion.id,
        nombre: proj.requisicion.nombre || proj.name,
        estado: proj.estado || proj.state || 'Pendiente',
        actual: proj.cantidadEntrega || proj.entregado || 0,
        total: proj.cantidad || proj.totalCantidad || 0,
        faltante: (proj.cantidad || proj.totalCantidad || 0) - (proj.cantidadEntrega || proj.entregado || 0),
        comprasCotizacionItemId: proj.id || proj.comprasCotizacionItemId || proj.comprasItemCotizacionId || 0
    })) || [];

    return (
        <div className={`detalleItemPanel ${item ? 'abierto' : ''}`}>
            <div className="detalleItemContent">
                {/* Header con título y botón cerrar */}
                <div className="detalleItemHeader">
                    <h2>{item.nombre}</h2>
                    <button className="btnCerrar" onClick={onClose} aria-label="Cerrar">
                        <span>×</span>
                    </button>
                </div>

                {/* Sección de Cantidades - Proveedores */}
                <div className="seccionCantidades">
                    <h3>Proveedores</h3>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
                    ) : (
                        <div className="proveedoresList">
                            {proveedores.length > 0 ? proveedores.map((proveedor) => (
                            <div 
                                key={proveedor.id} 
                                className="proveedorItem"
                                onClick={() => onProveedorClick?.(proveedor)}
                                style={{ cursor: onProveedorClick ? 'pointer' : 'default' }}
                            >
                                <div className="proveedorInicial">{proveedor.inicial}</div>
                                <div className="proveedorInfo">
                                    <span className="proveedorNombre">{proveedor.nombre}</span>
                                    <span className="proveedorPrecio">
                                        $ {new Intl.NumberFormat('es-CO').format(proveedor.precio)}
                                    </span>
                                </div>
                            </div>
                            )) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No hay proveedores disponibles
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sección de Proyectos */}
                <div className="seccionProyectos">
                    <h3>Proyectos que requieren este producto</h3>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
                    ) : (
                        
                        <div className="proyectosList">
                            {console.log('proyectos', proyectos)}
                            {proyectos.length > 0 ? proyectos.map((proyecto) => {
                                const estaEditando = editandoProyectoId === proyecto.id;
                                const valorMostrado = item.tipo == 'materia-prima' && item.unidad == 'mt2' 
                                    ? (proyecto.actual * (item.medida || 1) > proyecto.total ? proyecto.total : proyecto.actual * (item.medida || 1))
                                    : proyecto.actual;
                                
                                return (
                                    <div key={proyecto.id} className="proyectoItem">
                                        <div className="proyectoNumero">{proyecto.id}</div>
                                        <div className="proyectoInfo">
                                            <div className="proyectoNombreEstado">
                                                <span className="proyectoNombre">{proyecto.nombre}</span>
                                                <span className="proyectoEstado">{proyecto.estado}</span>
                                            </div>
                                            <div className="proyectoCantidades">
                                                {!estaEditando ? (
                                                    <span 
                                                        className="proyectoActual"
                                                        onClick={() => {
                                                            setEditandoProyectoId(proyecto.id);
                                                            setCantidadEditada(String(proyecto.actual));
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Click para editar"
                                                    >
                                                        Actualmente {valorMostrado} / {proyecto.total}
                                                    </span>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <span>Actualmente</span>
                                                        <input
                                                            type="number"
                                                            value={cantidadEditada}
                                                            onChange={(e) => setCantidadEditada(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    sendHowMany(cantidadEditada, proyecto.comprasCotizacionItemId, proyecto);
                                                                } else if (e.key === 'Escape') {
                                                                    setEditandoProyectoId(null);
                                                                    setCantidadEditada('');
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                if (!guardando) {
                                                                    setEditandoProyectoId(null);
                                                                    setCantidadEditada('');
                                                                }
                                                            }}
                                                            autoFocus
                                                            disabled={guardando}
                                                            style={{
                                                                width: '80px',
                                                                padding: '4px 8px',
                                                                border: '1px solid #007bff',
                                                                borderRadius: '4px',
                                                                fontSize: '14px'
                                                            }}
                                                        />
                                                        <span>/ {proyecto.total}</span>
                                                        {guardando && <span style={{ fontSize: '12px', color: '#666' }}>Guardando...</span>}
                                                    </div>
                                                )}
                                                <span className="proyectoFaltante">
                                                    Faltante {proyecto.faltante}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No hay proyectos que requieran este producto
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
