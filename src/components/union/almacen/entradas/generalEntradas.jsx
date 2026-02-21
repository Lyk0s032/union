import React, { useEffect, useMemo, useState } from 'react';
import OrdenModal from './orden/ordenModal';
import { useSearchParams } from 'react-router-dom';
import ItemEntradas from './itemEntradas';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';

export default function GeneralEntradas() {
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
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
    
    // Recargar sin loading cuando firstLoadDone cambia (para recargas posteriores)
    const recargarOrdenes = () => {
        dispatch(actions.axiosToGetOrdenesAlmacen(false));
    };
    
    // Filtrar órdenes según búsqueda
    const ordenesFiltradas = useMemo(() => {
        if (!ordenes || ordenes === 'notrequest' || ordenes === 404) {
            return [];
        }
        
        const ordenesArray = Array.isArray(ordenes) ? ordenes : [];
        
        if (!searchQuery.trim()) return ordenesArray;
        
        const query = searchQuery.toLowerCase().trim();
        return ordenesArray.filter(orden => 
            String(orden.id || '').toLowerCase().includes(query) ||
            String(orden.nombre || orden.name || '').toLowerCase().includes(query) ||
            String(orden.proveedor || orden.supplier || '').toLowerCase().includes(query)
        );
    }, [ordenes, searchQuery]);
    
    
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
                        <div className="buttonsOptions">
                            <button className="download">
                                <span>Descargar lista</span>
                            </button>
                            <button onClick={recargarOrdenes} style={{ marginLeft: 8, padding: '8px 16px', cursor: 'pointer' }}>
                                <span>🔄 Recargar</span>
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