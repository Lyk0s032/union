import React from 'react';
import HomeClients from './home';
import { Route, Routes } from 'react-router-dom';

export default function RouteClient(){
    return (
        <div className="panelClients">
            {/* <div className="title">
                <h3>Clientes</h3>
            </div> */}
            <Routes>
                <Route path="/*" element={<HomeClients />} />
            </Routes>
        </div>
    )
}