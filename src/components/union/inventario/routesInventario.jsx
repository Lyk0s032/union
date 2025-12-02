import React from 'react';
import LeftNav from './leftNavAlmacen';
import DashboardAlmacen from './dashboard/dashboard';
import { Route, Routes } from 'react-router-dom';
import Bodegas from './bodegas/bodegas';
import Pedidos from './pedidos/pedidos';

export default function RoutesInventario(){
    return (
        <div className="compras ProductionPanelUX">
            <div className="containerCompras OpenUX">
                <div className="divide">
                    <div className="left">
                        <LeftNav />
                    </div>

                    <div className="right ProduccionUX">
                        <div className="dashboard">
                            <div className="containerDashboard">
                                <Routes>
                                    {/* <Route path="/*" element={<DashboardAlmacen />} /> */}
                                    <Route path="/*" element={<Bodegas />} />
                                    <Route path="/pedidos/*" element={<Pedidos />} />
                                </Routes>
                            </div>
                        </div>
                        
                    </div> 
                </div>
                {/* {
                    params.get('add')  == 'categoria' || params.get('add') == 'linea' ?
                        <ModalAddCat />
                    : params.get('add') == 'extension' ?
                        <ModalAddExtensiones />
                    : null
                } */}
            </div>
        </div>
    )
}