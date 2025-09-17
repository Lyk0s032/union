import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import CotizacionItemGeneral from './itemCotizacion';
import DocumentCotizacion from './cotizacion/cotizacion';
import { useSearchParams } from 'react-router-dom';
import RemisionSection from './remision/remision';

export default function GeneralComercial(){
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams();
    const admin = useSelector(store => store.admin)
    const { cotizaciones, loadingCotizaciones } = admin;


    const inputRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id); // Si ya está abierto, ciérralo; si no, ábrelo

    };



    useEffect(() => {
        const handleClickOutside = (event) => {
        // Si hay un menú abierto y el clic no fue dentro de ningún menú (o su botón)
        // Usamos event.target.closest('.menu-container') para verificar si el clic fue dentro del menú o su botón
        if (openMenuId !== null && !event.target.closest('.menu-container')) {
            setOpenMenuId(null); // Cierra el menú
        }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]); 
    
        useEffect(() => {
            dispatch(actions.axiosToGetCotizacionesAdmin(true))
    }, [])

    return (
            <div className="divideMiddleData">
                    <div className="containerDivide">
                        <div className="rigthOtheInformationLists" style={{width:'100%'}}>
                            <div className="listDataPrincipal">
                                <div className="headerTitle" >
                                    <h3>Proyectos por aprobar</h3>
                                </div>
                                <div className="dataTableTask">
                                    <div className="containerDataTask">
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
                                            <div className="tableData">
                                                <table>
                                                    <tbody>
                                                        {
                                                            cotizaciones?.length ?
                                                                cotizaciones.map((r) => {
                                                                    return (
                                                                        r.state == 'anticipo' ?
                                                                            <CotizacionItemGeneral openMenuId={openMenuId}  toggleMenu={toggleMenu} item={r} />
                                                                        :null 
                                                                    )
                                                                })
                                                            :null
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                    }
                                        
                                    </div>
                                    {
                                        params.get('watch') == 'cotizacion' ?
                                            <DocumentCotizacion />
                                        : params.get('watch') == 'remision' ?
                                            <RemisionSection />
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}