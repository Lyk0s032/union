import React, { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import ItemsLists from './itemsList';
import Movimientos from './movimientos';
import GraphBodega from './graph';

export default function DashboardAlmacen(){
    const navigate = useNavigate();

    const admin = useSelector(store => store.admin)
    const { cotizaciones, loadingCotizaciones } = admin;
    const [show, setShow] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
            dispatch(actions.axiosToGetCotizacionesAdmin(true))
    }, [])
    return (
        <div className="panelDashboardType">
            {
                !cotizaciones || loadingCotizaciones ?
                    <div className="notFound">
                        <h3>No hay proyectos por el momento</h3>
                    </div>
                :
                cotizaciones == 404 || cotizaciones == 'notrequest' ?
                    <div className="notFound">
                        <h3>No hay proyectos por el momento</h3>
                    </div> 
                :
                <div className="containerTypeDashboard">
                <div className="topHeaderPanel">
                    <div className="divideHeader"> 
                         <div className="dataHeaderPrincipal">
                            <div className="topFilter">
                                <div className="itemFiltersBox">
                                    <label htmlFor="">Tipo</label><br />
                                    <select name="" id="">
                                        <option value="">Materia prima</option>
                                        <option value="">Productos</option>
                                    </select>
                                </div>
                                <div className="itemFiltersBox">
                                    <label htmlFor="">Buscar</label><br />
                                    <div className="inputDiv">
                                        <input type="text" placeholder='Buscar item' />
                                    </div>
                                </div>
                            </div>
                            <div className="containerDataHeader">
                                <div className="area">
                                    <h2 >Almacén </h2> 
                                    <div className="optionsData">
                                        <button>Filtrar</button>
                                    </div>
                                </div>
                                <div className="datosBox" >
                                    <span>Stock físico</span>
                                    <h1>10</h1>
                                </div>
                                <div className="datosBox">
                                    <span>Comprometido</span> 
                                    <h1>4</h1>
                                </div> 
                                <div className="datosBox">
                                    <span>Disponible</span>
                                    <h1>6</h1>
                                </div>
                                <div className="datosBox">
                                    <span>En transito</span>
                                    <h1>4</h1>
                                </div>
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
                        {
                            !show || show == 'items' ?
                                <ItemsLists />
                            : show == 'movimientos' ?
                                <Movimientos />
                            : show == 'graph' ?
                                <GraphBodega />

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