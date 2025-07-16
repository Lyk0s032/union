import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import LeftNav from './leftNav';
import ComercialPanel from './comercial';
import PanelGaleria from './galeria/panelGaleria';
import RouteClient from './clientes/routeClient';
import CondicionesPanel from './condiciones/condiciones';
import ListaDePreciosPanel from './listaPrecios/listaPrecios';

export default function RoutesComercial(){
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
                            <Route path="/*" element={<ComercialPanel />} />
                            <Route path="/galeria/*" element={<PanelGaleria />} />
                            <Route path="/clients/*" element={<RouteClient />} />
                            <Route path="/condiciones/*" element={<CondicionesPanel />} />
                            <Route path="/precios/*" element={<ListaDePreciosPanel />} />
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