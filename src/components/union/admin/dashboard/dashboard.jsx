import React from 'react';
import ProductionDashboard from './production/production';
import { Route, Routes } from 'react-router-dom';
import ComercialDashboard from './production copy/comercial';
import ComprasDashboard from './ordenCompras/dashboardCompras';

export default function Dashboard(){
    return (
        <div className="dashboard">
            <div className="containerDashboard">
                <Routes>
                    <Route path="/*" element={<ComercialDashboard />}/>
                    <Route path="/production/*" element={<ProductionDashboard />} />
                    <Route path="/comercial/*"  element={<ComercialDashboard />}/>
                    <Route path="/ordenCompras/*"  element={<ComprasDashboard />}/>

                </Routes>
            </div>
        </div>
    )
}