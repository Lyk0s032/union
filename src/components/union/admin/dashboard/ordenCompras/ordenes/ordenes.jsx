import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import * as actions from '../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ItemOrdenDeCompras from './itemOrdenCompra';
import OrdenCompra from './uxOrden/orden';

export default function OrdenesCompras(){
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams();
    const admin = useSelector(store => store.admin)
    const { ordenesCompras, loadingOrdenesCompras } = admin;


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
        dispatch(actions.axiosToGetOrdenesComprasAdmin(true))
    }, [])

    return (
            <div className="divideMiddleData">
                    <div className="containerDivide">
                        <div className="rigthOtheInformationLists" style={{width:'100%'}}>
                            <div className="listDataPrincipal">
                                <div className="headerTitle" >
                                    <h3>Actuales ({ordenesCompras?.length ? ordenesCompras.length : 0})</h3>
                                </div>
                                <div className="dataTableTask">
                                    <div className="containerDataTask">
                                    {
                                        !ordenesCompras || loadingOrdenesCompras ?
                                            <div className="notFound">
                                                <h3>No hay proyectos por el momento</h3>
                                            </div>
                                        :
                                        ordenesCompras == 404 || ordenesCompras == 'notrequest' ?
                                            <div className="notFound">
                                                <h3>No hay proyectos por el momento</h3>
                                            </div>
                                        :
                                            <div className="tableData">
                                                <table>
                                                    <tbody>
                                                        {
                                                            ordenesCompras?.length ?
                                                                ordenesCompras.map((orden) => {
                                                                    return (
                                                                        <ItemOrdenDeCompras openMenuId={openMenuId}  toggleMenu={toggleMenu} item={orden} />
                                                                    )
                                                                })
                                                            :null
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                    }

                                    {
                                        params.get('orden') ?
                                            <OrdenCompra />
                                        : null
                                    }
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}