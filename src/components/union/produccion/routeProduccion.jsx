import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import LeftNav from './leftNav';
import KitsPanel from './kits';
import Lineas from './extension';
import Solicitudes from './solicitudes/solicitudes';

export default function RoutesProduccion(){
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
                            <Route path="/*" element={<KitsPanel />} />
                            <Route path="/lineas/*" element={<Lineas />} />
                            <Route path="/solicitudes/*" element={<Solicitudes />} />

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