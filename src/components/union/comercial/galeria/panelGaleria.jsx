import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './home';

export default function PanelGaleria(){
    return (
        <div className="panelGaleria">
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
        </div>
    )
}