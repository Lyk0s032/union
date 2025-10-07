import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import OrdenesCompras from './ordenes/ordenes';

export default function ComprasDashboard(){
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
                        
                         <div className="dataHeaderPrincipal">
                            <div className="containerDataHeader">
                                <div className="area">
                                    <h2 onClick={() => {
                                    navigate('/admin/comercial')
                                }}>Ordenes de compra </h2> 
                                    <div className="optionsData">
                                        <button>Actualizado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>                   
                </div>
                <Routes>
                    <Route path="/*" element={<OrdenesCompras />} />
                    
                </Routes>
            </div>
            }
        </div>
    )
}