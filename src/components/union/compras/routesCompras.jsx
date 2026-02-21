import React, { useEffect } from 'react';
import LeftNav from './leftNav';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import Providers from './providers';
import MateriaPrima from './materiaPrima';
import ModalAddCat from './modal/categorias';
import ModalAddExtensiones from './modal/extensiones';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import RouteCompras from './compras/routeCompras';
import ProductoTerminado from './productoTerminado/productoTerminado';
import RouteRequisiciones from './requisiciones/routeRequisiciones';
import DashboardCompras from './dashboard/dashboard';
import RequisicionDashboard from './req';

export default function RoutesCompras(){
    const [params, setParams] = useSearchParams();
    const sistema = useSelector(store => store.system);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.axiosToGetFiltros(true))

    }, [])
    return (
        <div className="compras ProductionPanelUX">
            <div className="containerCompras OpenUX">
                <div className="divide">
                    <div className="left">
                        <LeftNav />
                    </div>

                    <div className="right ProduccionUX">
                        <Routes> 
                            <Route index element={<DashboardCompras /> } />
                            <Route path="requisiciones/*" element={<RouteRequisiciones />} />
                            <Route path="req/*" element={<RequisicionDashboard />} />
                            <Route path="pv/*" element={<Providers />} />
                            <Route path="mp/*" element={<MateriaPrima />} />
                            <Route path="pt/*" element={<ProductoTerminado />} />
                        </Routes>
                    </div>
                </div>
                {
                    params.get('add')  == 'categoria' || params.get('add') == 'linea' ?
                        <ModalAddCat />
                    : params.get('add') == 'extension' ?
                        <ModalAddExtensiones />
                    : null
                }
            </div>
        </div>
    )
}