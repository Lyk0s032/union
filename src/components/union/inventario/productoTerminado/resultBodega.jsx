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

    const close = () => {
        setTransferir(false);
    }
    let posible = params.get('who') ? params.get('who') : 1;

    useEffect(() => {
        if(params.get('show') == 'Bodega' || !params.get('show')){
            dispatch(actions.axiosToGetItemMateriaPrimaBodega(true, params.get('item'), posible))
        }else if(params.get('show' == 'Proyecto')){
            dispatch(actions.axiosToGetItemMateriaPrimaBodegaProyecto(true, params.get('item'), params.get('who')))

        }
    }, [params.get('who'), params.get('show')])
    console.log('bodega',itemBodega)
    return (
        !itemBodega || loadingItemBodega ?
        <div className="messageBox">
            <h1>Cargando...</h1>
        </div>
        :
        itemBodega == 'notrequest' || itemBodega == 404 ?
        <div className="messageBox">
            <h3>Not found</h3>
        </div>
        :
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
                        <h3>{itemBodega.ubicacion.nombre}</h3>
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
                        <h1>{itemBodega.cantidad}</h1>
                        <span>Cantidad</span>
                    </div>
                    <div className="howManyItem">
                        <h1>{itemBodega.cantidadComprometida}</h1>
                        <span>Cantidad comprometida</span>
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
                                            itemBodega.ubicacion ?
                                            itemBodega.ubicacion?.origen.concat(itemBodega.ubicacion?.destino).map((r,i) => {
                                                    return (
                                                        <ItemMovimiento movimiento={r} key={i+1} />
                                                    )
                                                })
                                            :null
                                        }

                                    </tbody>
                                </table>
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