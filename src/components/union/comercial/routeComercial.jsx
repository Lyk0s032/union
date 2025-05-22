import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import LeftNav from './leftNav';
import ComercialPanel from './comercial';
import PanelGaleria from './galeria/panelGaleria';

export default function RoutesComercial(){
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
                            <Route path="/*" element={<ComercialPanel />} />
                            <Route path="/galeria/*" element={<PanelGaleria />} />
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