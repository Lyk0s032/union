import React from 'react';
import ProductionDashboard from './production/production';
import { Route, Routes } from 'react-router-dom';
import ComercialDashboard from './production copy/comercial';

export default function Dashboard(){
    return (
        <div className="dashboard">
            <div className="containerDashboard">
                <Routes>
                    <Route path="/*" element={<ComercialDashboard />}/>
                    <Route path="/production/*" element={<ProductionDashboard />} />
                    <Route path="/comercial/*"  element={<ComercialDashboard />}/>
                </Routes>
            </div>
        </div>
    )
}