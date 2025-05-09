import React, { useEffect } from 'react';
import LeftNav from './leftNav';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import Providers from './providers';
import MateriaPrima from './materiaPrima';
import ModalAddCat from './modal/categorias';
import ModalAddExtensiones from './modal/extensiones';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import RouteCompras from './compras/routeCompras';

export default function RoutesCompras(){
    const [params, setParams] = useSearchParams();
    const sistema = useSelector(store => store.system);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.axiosToGetFiltros(true))

    }, [])
    return (
        <div className="compras">
            <div className="containerCompras">
                <div className="divide">
                    <div className="left">
                        <LeftNav />
                    </div>

                    <div className="right">
                        <Routes> 
                            <Route index element={<RouteCompras /> } />
                            <Route path="pv/*" element={<Providers />} />
                            <Route  path="mp/*" element={<MateriaPrima />} />
                        </Routes>
                    </div>
                </div>
                {
                    params.get('add')  == 'categoria' || params.get('add') == 'linea' ?
                        <ModalAddCat />
                    : params.get('add') == 'extension' ?
                        <ModalAddExtensiones />
                    : null
                }
            </div>
        </div>
    )
}