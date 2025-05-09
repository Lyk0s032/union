import React, { useEffect } from "react";
import Nav from "./nav";
import { Navigate, Route, Routes } from "react-router-dom";
import RoutesCompras from "./compras/routesCompras";
import RoutesProduccion from "./produccion/routeProduccion";
import RoutesComercial from "./comercial/routeComercial";
import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../store/action/action';

export default function RouterPanel(){
    const system = useSelector(store => store.system);
    const { alerta, typeAlerta } = system;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.axiosToGetFiltros(true))
    
    }, [])

    return (
        <div className="routerPanel">
            <div className="containerRouter">
                <Nav />
  
                <div className="optionsByPanel">
                    <Routes>
                        <Route path="/" element={<Navigate to="/compras" replace />} />
                        <Route path="/compras/*" element={<RoutesCompras />} />
                        <Route path="/produccion/*" element={<RoutesProduccion />} />
                        <Route path="/comercial/*" element={<RoutesComercial />} />
                    </Routes>
                </div>
                {
                    alerta ? 
                        <Message />
                    : null
                }
            </div>
        </div>
    )
}