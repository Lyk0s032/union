import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LeftNavEntrega from './leftEntrega';
import DetallesEntrega from './detalles';



export default function EntregaUX(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);
    const dispatch = useDispatch();
    const admin = useSelector(store => store.admin);
    const { ordenCompras, loadingOrdenCompras, ordenesCompras } = admin;

    const closeComprar = () => {
        params.delete('pedido')
        setParams(params);
    }


    console.log('aqui', ordenCompras)

    useEffect(() => {
        dispatch(actions.axiosToGetOrdenAlmacen(true, params.get('pedido')))
    }, [params.get('pedido')])
 

    return (
        <div className="modal" style={{zIndex:5}}> 
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> 
                    <div className="leftNavUX">
                        <LeftNavEntrega />
                    </div>
                    
                    <div className="rightUx">
                        <button onClick={() => closeComprar()}>x</button>
                            {
                                !ordenCompras && loadingOrdenCompras ? 
                                    <div className="messageBox">
                                        <h1>Cargando...</h1>
                                    </div>
                                : !ordenCompras ? null
                                : ordenCompras == 'notrequest' || ordenCompras == 404 ?
                                    <div className="messageBox">
                                        <h1>No hemos encontrado esto.</h1>
                                    </div>
                                : 
                                    <>
                                        <DetallesEntrega orden={ordenCompras} />
                                    </>
                                }      
                    </div>

                </div>
            </div>
        </div>
    )
}