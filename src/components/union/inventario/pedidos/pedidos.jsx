import React, { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import ListPedidos from './ListPedidos';
import EntregaUX from './ux/entrega';
import ProyectosAlmacen from './proyectos/proyectosAlmacen';
import ProjectsUX from './proyectos/uxProyectos/seeProject';

export default function Pedidos(){
    const navigate = useNavigate();
 
    const almacen = useSelector(store => store.almacen)
    const { cabecerasBodega, loadingCabecerasBodega, ordenes, loadingOrdenes  } = almacen;


    const [show, setShow] = useState(null); 
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    useEffect(() => { 
        dispatch(actions.axiosToGetOrdenesAlmacen(true))
    }, [])

    console.log(ordenes)
    return ( 
        <div className="panelDashboardType">
                <div className="containerTypeDashboard">
                    <div className="topHeaderPanel">
                        <div className="divideHeader"> 
                            <div className="dataHeaderPrincipal">
                                <div className="containerDataHeader">
                                    <div className="area">
                                        <h2 >Zona de pedidos </h2> 
                                    </div>
                                    <div className="datosBox" onClick={() => {
                                        setShow('pedidos')
                                    }}>
                                        <span>Ordenes de compras</span>
                                        <h1>{1}</h1>
                                    </div>

                                    <div className="datosBox" onClick={() => {
                                        setShow('proyectos')
                                    }}>
                                        <span>Proyectos en curso</span>
                                        <h1>{1}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>                   
                    </div>
                    {console.log('ordeeness', ordenes)}

                    <div className="dataDashboard" style={{marginTop:0}}>
                        <div className="dataRoutesDashboard">
                            {
                                !show || show == 'pedidos' ?

                                    loadingOrdenes || !ordenes ?
                                        <div className="notFound">
                                            <h3>Cargando...</h3>
                                        </div>
                                    :
                                    ordenes == 404 || ordenes == 'notrequest' ?
                                        <div className="notFound">
                                            <h3>No hay proyectos por el momento</h3>
                                        </div> 
                                    :
                                    <ListPedidos ordenes={ordenes} />
                                    
                                : show == 'proyectos' ?
                                    <ProyectosAlmacen />
                                : null
                            }
    
                        </div>
                    </div>
                    {
                        params.get('pedido') ?
                            <EntregaUX />
                        : params.get('proyecto') ?
                            <ProjectsUX />
                        : null
                    }
            </div>
        </div>
    )
}