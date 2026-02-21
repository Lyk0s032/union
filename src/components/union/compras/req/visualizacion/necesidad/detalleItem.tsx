import React, { useEffect } from 'react';
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
                console.log('res', res.data);
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
        id: pr.id,
        nombre: pr.proveedor.nombre || pr.name,
        inicial: (pr.proveedor.nombre || pr.name || '?').charAt(0).toUpperCase(),
        precio: pr.precio || pr.price || pr.valor || 0
    })) || [] : data?.productPrices?.map((pr: any) => ({
        id: pr.id,
        nombre: pr.proveedor.nombre || pr.name,
        inicial: (pr.proveedor.nombre || pr.name || '?').charAt(0).toUpperCase(),
        precio: pr.proveedor.precio || pr.price || pr.valor || 0
    })) || [];

    const proyectos: ProyectoItem[] = data?.itemRequisicions?.map((proj: any) => ({
        id: proj.requisicion.cotizacionId,
        nombre: proj.requisicion.nombre || proj.name,
        estado: proj.estado || proj.state || 'Pendiente',
        actual: proj.cantidadEntrega || proj.entregado || 0,
        total: proj.cantidad || proj.totalCantidad || 0,
        faltante: (proj.total || proj.totalCantidad || 0) - (proj.actual || proj.entregado || 0)
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
                            {proyectos.length > 0 ? proyectos.map((proyecto) => (
                            <div key={proyecto.id} className="proyectoItem">
                                <div className="proyectoNumero">{proyecto.id}</div>
                                <div className="proyectoInfo">
                                    <div className="proyectoNombreEstado">
                                        <span className="proyectoNombre">{proyecto.nombre}</span>
                                        <span className="proyectoEstado">{proyecto.estado}</span>
                                    </div>
                                    <div className="proyectoCantidades">
                                        <span className="proyectoActual">
                                            Actualmente {proyecto.actual} / {proyecto.total}
                                        </span>
                                        <span className="proyectoFaltante">
                                            Faltante {proyecto.faltante}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            )) : (
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
