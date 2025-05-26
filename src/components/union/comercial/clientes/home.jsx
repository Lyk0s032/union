import React from 'react';
import NavigationClientes from './navigation';
import { Route, Routes } from 'react-router-dom';
import AllClients from './clients/allClients';

export default function HomeClients(){
    return ( 
        <div className="homeClients">
            <div className="containerHomeClients">
                <NavigationClientes />
                <div className="routeData">
                    <Routes>
                        <Route index element={<AllClients />} />
                    </Routes>
                </div>
            </div>
        </div> 
    )
} 