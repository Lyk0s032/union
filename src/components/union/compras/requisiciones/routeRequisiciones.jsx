import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import Requisiciones from './requisicion';
import Comprar from './comprar/routeComprar';
import BtnFactura from './comprar/btnFactura';
import { useSelector } from 'react-redux';

export default function RouteRequisiciones(){
    const [params, setParams] = useSearchParams();

    const req = useSelector(store => store.requisicion);

    const { ids } = req;
    return (
        <div className="">
            <Routes>
                <Route path="/*" element={<Requisiciones />} />
            </Routes>
            {
                ids?.length ? 
                    <Comprar />
                : null
            }

        </div>
    )
}