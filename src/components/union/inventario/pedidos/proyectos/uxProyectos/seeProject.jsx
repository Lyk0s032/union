import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LeftNavProject from './leftNav';
import DetallesProject from './detalles';



export default function ProjectsUX(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);

    const closeComprar = () => {
        params.delete('proyecto')
        setParams(params);
    }


    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen)
    const { proyecto, loadingProyecto } = almacen;

    useEffect(() => {
        dispatch(actions.axiosToGetProject(true, params.get('proyecto')));
    }, []) 
    console.log(proyecto)

    return (
        <div className="modal" style={{zIndex:5}}> 
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> 
                    <div className="leftNavUX">
                        <LeftNavProject />
                    </div>
                    
                    <div className="rightUx">
                        <button onClick={() => closeComprar()}>x</button>
                                {
                                    !proyecto || loadingProyecto ? <h1>Cargando...</h1>
                                    : proyecto == 'notrequest' || proyecto == 404 ?
                                        <h1>Not found</h1>
                                    :
                                    <>
                                        <DetallesProject proyecto={proyecto} />
                                    </>
                                }      
                    </div>

                </div>
            </div>
        </div>
    )
}