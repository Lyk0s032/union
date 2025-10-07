import React, { useEffect } from "react";
import Nav from "./nav";
import { Navigate, Route, Routes } from "react-router-dom";
import RoutesCompras from "./compras/routesCompras";
import RoutesProduccion from "./produccion/routeProduccion";
import RoutesComercial from "./comercial/routeComercial";
import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../store/action/action';
import RoutesFinanciero from "./admin/adminRoutes";
import RoutesInventario from "./inventario/routesInventario";
 
export default function RouterPanel(){
    const system = useSelector(store => store.system);
    const { alerta, typeAlerta } = system;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

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
                        <Route path="/" element={user.user.rango == 'asesor' ? <Navigate to="/comercial" replace /> : <Navigate to="/compras" replace />} />
                        <Route path="/compras/*" element={<RoutesCompras />} />
                        <Route path="/produccion/*" element={<RoutesProduccion />} />
                        <Route path="/comercial/*" element={<RoutesComercial />} />
                        <Route path="/inventario/*" element={<RoutesInventario />} />
                        <Route path="/admin/*" element={<RoutesFinanciero />} />
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