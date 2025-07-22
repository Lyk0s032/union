import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import LeftNav from './leftNav';
import Dashboard from './dashboard/dashboard';

export default function RoutesFinanciero(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="compras ProductionPanelUX">
            <div className="containerCompras OpenUX">
                <div className="divide">
                    <div className="left">
                        <LeftNav />
                    </div>

                    <div className="right ProduccionUX">
                        <Routes>
                            <Route index path="/*" element={<Dashboard />} />
                        </Routes>
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