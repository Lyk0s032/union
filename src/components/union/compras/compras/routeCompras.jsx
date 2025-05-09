import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GeneralCompras from './general';

export default function RouteCompras(props){
    return (
        <div className="compras">
            <Routes>
                <Route path="/" element={<GeneralCompras /> } />
            </Routes>
        </div>
    )
}