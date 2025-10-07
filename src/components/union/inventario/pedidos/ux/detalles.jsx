import React from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import PedidoItemAlmacen from './pedidoItem';
import DataCotizacion from './dataCotizacion';

export default function DetallesEntrega({ orden }){
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { proyectos } = req;
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Zona de pedido</h1>
                        <span>Centro de ingresos a través de ordenes de compra</span>
                    </div>
                    
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            {
                                <DataCotizacion orden={orden} />
                            }
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    )
}