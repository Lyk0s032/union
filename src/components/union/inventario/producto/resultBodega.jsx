import React, { useEffect, useState } from 'react';
import ItemMovimiento from './itemMovimiento';
import Transferir from './transferir';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function ResultBodegaProducto({ item }){

    const [params, setParams] = useSearchParams();
    const [info, setInfo] = useState()
    const [transferir, setTransferir] = useState(false);
    const [movimientos, setMovimientos] = useState([]);
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);
    const { itemBodega, loadingItemBodega } = almacen;
    const [registros, setRegistros] = useState(null);
    const [pageMov, setPageMov] = useState(1);
    const limitMov = 20;

    const resumenBodega = item.resumenBodega;
    const close = () => {
        setTransferir(false);
    }
    let posible = params.get('who') ? params.get('who') : 1;

    // Función para recargar movimientos con paginación
    const recargarMovimientos = (nuevaPagina) => {
        const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'MP' : 'PT';
        let rutaMP = tipo == 'MP' ? params.get('item') : null;
        let rutaPT = tipo == 'PT' ? params.get('item') : null;
        dispatch(actions.axiosToGetItemInventarioPlus(false, rutaMP, params.get('bodega'), rutaPT, nuevaPagina, limitMov));
        setPageMov(nuevaPagina);
    };

    // Obtener información de paginación
    const paginacion = item?.paginacionMovimientos || { page: 1, limit: limitMov, total: 0, totalPages: 0 };

    const getDataBodegasAxios = async () => {
        if(!params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4){
            if(params.get('show') == 'Bodega' || !params.get('show')){
                dispatch(actions.axiosToGetItemMateriaPrimaBodega(true, params.get('item'), posible))
            }else if(params.get('show' == 'Proyecto')){
                dispatch(actions.axiosToGetItemMateriaPrimaBodegaProyecto(true, params.get('item'), params.get('who')))
            }
        }else{
            if(params.get('show') == 'Bodega' || !params.get('show')){
                dispatch(actions.axiosToGetItemProductoTerminadoBodega(true, params.get('item'), params.get('who')))
            }
        }
    }
    // useEffect(() => {
    //     getDataBodegasAxios()
    // }, [params.get('who'), params.get('show')])

    {console.log('desde bodega item ', item)}
    {console.log('movimientos disponibles:', {
        movimientosGenerales: item?.movimientos?.length || 0,
        itemsFisicos: item?.registrosBodega?.length || 0,
        movimientosItemsFisicos: item?.registrosBodega?.reduce((sum, r) => sum + (r.movimientos?.length || 0), 0) || 0
    })}
    return (
        // !itemBodega || loadingItemBodega ?
        // <div className="messageBox">
        //     <div className="notFound">
        //         <div className="boxData">
        //             <span>Estamos consultando tu bodega</span>
        //             <h3>Cargando...</h3>
        //         </div>
        //     </div>
        // </div>
        // :
        // itemBodega == 'notrequest' || itemBodega == 404 ?
        // <div className="messageBox">
        //     <div className="notFound">
        //         <div className="boxData">
        //             <span>No hemos encontrado movimientos en esta bodega</span>
        //             <h3>...</h3>
        //         </div>
        //     </div>
        // </div>
        // :

        <div className="resultBodegaHere">
            {
            transferir ? 
                <Transferir item={item} close={close} /> 
            :
            <div className="containerHere">
                <div className="hereTitle">
                    <div className="" onDoubleClick={() => {
                        setInfo(!info)
                    }}>
                        <h3>Traer nombre de la bodega </h3>
                        <span className="tipo">{!info ? 'Movimientos' : 'Gráficas'}</span>
                    </div>
                    <button onClick={() => {
                        setTransferir(true)
                    }}>
                        <span>Transferir</span>
                    </button>
                </div>
                <div className="howMany">
                    <div className="howManyItem">
                        <h1> {resumenBodega.completeCount}</h1>
                        <span>Cantidad</span>
                    </div>
                    <div className="howManyItem">
                        <h1>{resumenBodega.totalMeters} <span style={{fontSize:18}}>{item.item.unidad}</span></h1>
                        <span>Cantidad en unidades</span>
                    </div>
                </div>
                <div className="resultadosHere">
                    {
                        !info ?

                        <div className="movimientos">
                            <div className="RegisterTitle">
                                <div className="titleThat">
                                    <span>Movimientos</span>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Cantidad</th>
                                            <th>Movimiento</th>
                                            <th>Bodega</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            // Filtrar y mostrar solo movimientos con cantidad (ya filtrados en backend, pero doble verificación)
                                            (() => {
                                                const movimientosConCantidad = [];
                                                
                                                // 1. Agregar movimientos generales del item (ya filtrados en backend)
                                                if (item?.movimientos && item.movimientos.length > 0) {
                                                    item.movimientos.forEach((movimiento, i) => {
                                                        const cantidad = movimiento.cantidad;
                                                        // Solo agregar si tiene cantidad válida (doble verificación)
                                                        if (cantidad != null && cantidad > 0) {
                                                            movimientosConCantidad.push({
                                                                ...movimiento,
                                                                cantidad: cantidad,
                                                                tipoMovimiento: movimiento.tipoMovimiento || movimiento.tipo,
                                                                createdAt: movimiento.createdAt,
                                                                origen: 'general',
                                                                key: `mov-general-${i+1}`
                                                            });
                                                        }
                                                    });
                                                }
                                                
                                                // 2. Renderizar movimientos (ya vienen ordenados del backend)
                                                if (movimientosConCantidad.length > 0) {
                                                    return movimientosConCantidad.map((movimiento) => (
                                                        <ItemMovimiento movimiento={movimiento} key={movimiento.key} />
                                                    ));
                                                } else {
                                                    return (
                                                        <tr>
                                                            <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                                                                <span>No hay movimientos registrados para este item en esta bodega</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            })()
                                        }
                                    </tbody>
                                </table>
                                {/* Controles de paginación */}
                                {paginacion.totalPages > 1 && (
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderTop: '1px solid #e0e0e0'}}>
                                        <div style={{fontSize: '14px', color: '#666'}}>
                                            Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} - {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de {paginacion.total} movimientos
                                        </div>
                                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                            <button 
                                                onClick={() => recargarMovimientos(paginacion.page - 1)}
                                                disabled={paginacion.page <= 1}
                                                style={{
                                                    padding: '8px 15px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: paginacion.page <= 1 ? '#f5f5f5' : 'white',
                                                    cursor: paginacion.page <= 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Anterior
                                            </button>
                                            <span style={{fontSize: '14px'}}>
                                                Página {paginacion.page} de {paginacion.totalPages}
                                            </span>
                                            <button 
                                                onClick={() => recargarMovimientos(paginacion.page + 1)}
                                                disabled={paginacion.page >= paginacion.totalPages}
                                                style={{
                                                    padding: '8px 15px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: paginacion.page >= paginacion.totalPages ? '#f5f5f5' : 'white',
                                                    cursor: paginacion.page >= paginacion.totalPages ? 'not-allowed' : 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        :
                        <div className="grafica">
                            <h3>Grafica</h3>
                        </div> 
                    }
                </div>
                
            </div>
            }
        </div>
    )
}