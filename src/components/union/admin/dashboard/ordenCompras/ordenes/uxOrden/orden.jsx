import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LeftNavOrdenCompra from './leftNavOrden';
import ProyectosOrdenCompras from './proyectos';
import DetallesOrdenCompras from './detalles';



export default function OrdenCompra(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);
    const dispatch = useDispatch();
    const admin = useSelector(store => store.admin);
    const { ordenCompras, loadingOrdenCompras, ordenesCompras } = admin;

    const closeComprar = () => {
        params.delete('orden')
        setParams(params);
    }


    console.log(ordenCompras)

    useEffect(() => {
        dispatch(actions.axiosToGetOrdenComprasAdmin(true, params.get('orden')))
    }, [params.get('orden')])
 

    return (
        <div className="modal" style={{zIndex:5}}> 
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> 
                    <div className="leftNavUX">
                        <LeftNavOrdenCompra />
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
                                    {
                                        !params.get('s') || params.get('s') == 'detalles' ?
                                            <DetallesOrdenCompras orden={ordenCompras} />
                                        :params.get('s') == 'proyectos' ?
                                            <ProyectosOrdenCompras /> 
                                        : params.get('s') == 'borradores' ?
                                            <h1>Cotizaciones relacionadas</h1>
                                        : null
                                    }
                                    </>
                                }      
                            </div>
                </div>
            </div>
        </div>
    )
}