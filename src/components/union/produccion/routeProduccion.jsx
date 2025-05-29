import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import LeftNav from './leftNav';
import KitsPanel from './kits';
import Lineas from './extension';

export default function RoutesProduccion(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="compras">
            <div className="containerCompras">
                <div className="divide">
                    <div className="left">
                        <LeftNav />
                    </div>

                    <div className="right">
                        <Routes>
                            <Route path="/*" element={<KitsPanel />} />
                            <Route path="/lineas/*" element={<Lineas />} />

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