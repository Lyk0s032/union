import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate } from 'react-router-dom';
import GeneralProduction from './generalComercial';
import GeneralKits from './kits';
import GeneralProductos from './producto/producto';
import GeneralUsuarios from './user/user';
import GeneralComercial from './generalComercial';
import EnProcesoComercial from './proceso/proceso';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ComercialDashboard(){
    const navigate = useNavigate();

    const admin = useSelector(store => store.admin)
    const { cotizaciones, loadingCotizaciones } = admin;
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
                        <div className="bottonChange"> {console.log(cotizaciones)}
                            <button>
                                <MdOutlineArrowBackIos className='icon' />
                            </button> 
                        </div> 
                         <div className="dataHeaderPrincipal">
                            <div className="containerDataHeader">
                                <div className="area">
                                    <h2 onClick={() => {
                                    navigate('/admin/comercial')
                                }}>Comercial </h2> 
                                    <div className="optionsData">
                                        <button>Otro panel</button>
                                    </div>
                                </div>
                                <div className="datosBox" >
                                    <span>Total cotizaciones</span>
                                    <h1>En desarrollo</h1>
                                </div>
                                <div className="datosBox" onClick={() => {
                                    navigate('/admin/comprando')
                                }}>
                                    <span>En proceso</span> 
                                    <h1>Disponible</h1>
                                </div> 
                                <div className="datosBox">
                                    <span>Clientes</span>
                                    <h1>En desarrollo</h1>
                                </div>
                                <div className="datosBox">
                                    <span>Usuarios</span>
                                    <h1>En desarrollo</h1>
                                </div>
                            </div>
                        </div>
                        <div className="bottonChange">
                            <button>
                                <MdOutlineArrowForwardIos className='icon' />
                            </button>
                        </div>
                    </div>                   
                </div>
                <Routes>
                    <Route path="/*" element={<GeneralProduction />} />
                    <Route path="/home/*" element={<GeneralComercial />} />
                    <Route path="/productos/*" element={<GeneralProductos />} />
                    <Route path="/comprando/*" element={<EnProcesoComercial />} />
                    <Route path="/usuarios/*" element={<GeneralUsuarios />} />
                </Routes>
            </div>
            }
        </div>
    )
}