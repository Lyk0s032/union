import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GeneralAlmacen from './bodegas/general';
import LeftNavAlmacen from './leftNav';
import GeneralEntradas from './entradas/generalEntradas';

export default function RouterAlmacen() {
    return (
                <div className="compras ProductionPanelUX">
            <div className="containerCompras OpenUX">
                <div className="divide">
                    <div className="left">
                        <LeftNavAlmacen />
                    </div>
 
                    <div className="right ProduccionUX">
                        <div className="dashboard">
                            <div className="containerDashboard">
                                <Routes>
                                    <Route path="/" element={<GeneralAlmacen />} />
                                    <Route path="/entradas" element={<GeneralEntradas />} />
                                </Routes>
                            </div>
                        </div>
                        
                    </div> 
                </div>
            </div>
        </div>

    )
}