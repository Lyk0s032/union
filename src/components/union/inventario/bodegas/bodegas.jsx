import React, { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import ItemsLists from './listaItems';
import Movimientos from './movimientos';
import Graph from './graph';
import ItemAlmacen from '../producto/item';

export default function Bodegas(){
    const navigate = useNavigate();
 
    const almacen = useSelector(store => store.almacen)
    const { cabecerasBodega, loadingCabecerasBodega, productosBodega, loadingProductosBodega } = almacen;

    const admin = useSelector(store => store.admin)
    const { cotizaciones, loadingCotizaciones } = admin;

        
    const [show, setShow] = useState(null);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const packageFunctions = async () => {
        const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'MP' : 'PT'
        let bodega = !params.get('bodega') ? 1 : params.get('bodega')
        if(!params.get('bodega')){
            dispatch(actions.axiosToGetProductosBodegaPlus(true, bodega, 1, 30, tipo))
            // dispatch(actions.axiosToGetProductosBodega(true, bodega))
            dispatch(actions.axiosToGetMovimientosBodega(true, 1))
            dispatch(actions.axiosToGetCabeceras(true, [1,4,2,5]))
        }else{
            dispatch(actions.axiosToGetProductosBodegaPlus(true, params.get('bodega'), 1, 30, tipo))
            // dispatch(actions.axiosToGetProductosBodega(true, params.get('bodega')))
            dispatch(actions.axiosToGetMovimientosBodega(true, params.get('bodega')))
            dispatch(actions.axiosToGetCabeceras(false, [1,4,2,5]))
        }
    }
    useEffect(() => {
            packageFunctions() 
    }, [params.get('bodega')])  
    return ( 
        <div className="panelDashboardType">
            {
            <div className="containerTypeDashboard">
                <div className="topHeaderPanel">
                    <div className="divideHeader"> 
                         <div className="dataHeaderPrincipal">
                            <div className="containerDataHeader">
                                <div className="area">
                                    <h2 >Bodegas </h2> 
                                    <div className="optionsData">
                                        <button>Todas</button>
                                    </div>
                                </div>
                                {
                                    !cabecerasBodega || loadingCabecerasBodega ? 
                                        <h3>Cargando...</h3>
                                    : cabecerasBodega?.length ?
                                        cabecerasBodega.map((c, i) => {
                                            return (
                                              <div className={params.get('bodega') == c.idBodega ? "datosBox Active" : "datosBox"} key={i+1} onClick={() => {
                                                params.set('bodega', c.idBodega)
                                                setParams(params);
                                              }}>
                                                    <span>{c.nombre.split('Bodega')[1]}</span>
                                                    <h1>{c.cantidad}</h1>
                                                </div>  
                                            )
                                        })
                                    : null
                                } 
                            </div>
                        </div>
                    </div>                   
                </div>

                <div className="dataDashboard">
                    <div className="containerDataDashboardNav">
                        <nav>
                            <ul>
                                <li onClick={() => setShow('items')}
                                    className={show == 'items' || !show ? 'Active' : null }>
                                    <div>
                                        <span>Items</span>
                                    </div>
                                </li>
                                <li  onClick={() => setShow('movimientos')}
                                    className={show == 'movimientos' ? 'Active' : null }>
                                    <div>
                                        <span>Movimientos</span>
                                    </div>
                                </li>
                                <li  onClick={() => setShow('graph')}
                                    className={show == 'graph' ? 'Active' : null }>
                                    <div>
                                        <span>Gráfica</span>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="dataRoutesDashboard">
                        {console.log('consolaaa', productosBodega)}
                        {
                            !productosBodega || loadingProductosBodega ?
                                <div className="notFound">
                                    <div className="messageData">
                                        <span>Estamos trayendo tu información</span>
                                        <h3>Cargando...</h3>
                                    </div>
                                </div>
                            :
                            productosBodega == 404 || productosBodega == 'notrequest' ?
                                <div className="notFound">
                                    <div className="messageData">
                                        <span>No hemos logrado encontrar esto</span>
                                        <h3>Intentalo más tarde</h3>
                                    </div>
                                </div> 
                            :
                                <>
                                    {  
                                        !show || show == 'items' ?
                                            <ItemsLists />
                                        : show == 'movimientos' ?
                                            <Movimientos />
                                        : show == 'graph' ?
                                            <Graph />

                                        : null
                                    }
                                </>
                            }

                        {
                            params.get('item')?
                                <ItemAlmacen />
                            : null
                        }
                    </div>
                </div>
                {/* <Routes>
                    <Route path="/*" element={<GeneralProduction />} />
                    <Route path="/home/*" element={<GeneralComercial />} />
                    <Route path="/productos/*" element={<GeneralProductos />} />
                    <Route path="/comprando/*" element={<EnProcesoComercial />} />
                    <Route path="/usuarios/*" element={<GeneralUsuarios />} />
                </Routes> */}
            </div>
            }
        </div>
    )
}