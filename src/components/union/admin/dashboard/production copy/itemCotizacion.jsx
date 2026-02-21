import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import { BsPencil, BsThreeDots } from "react-icons/bs";

export default function CotizacionItemGeneral({ item, openMenuId, toggleMenu  }){
    const r = item;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
    const [loading, setLoading] = useState(false);
    const [otherLoading, setOtherLoading] = useState(false)
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
    // Aprobar 
    const handleAprobar = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/accept/${r.id}`)
        .then(res => {
            return res
        })
        .then(async (res) => { 
            console.log(res.data)
            // const send = await axios.get(`/api/requisicion/get/post/generateAll/${res.data.id}`)
            const send = await axios.get(`/api/requisicion/get/avance/cotizacion/${res.data.id}`)
            return res; 
        })
        // .then(async (res) => {
        //     const addProduction = await axios.get(`/api/requisicion/add/register/necesidad/${res.data.id}`)
        //     return res;
        // })
        .then((res) => {
            dispatch(actions.HandleAlerta('Cotización aprobada', 'positive')) 
            dispatch(actions.axiosToGetCotizacionesAdmin(false))

            return res;
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false)
        })
        return sendAprobation;
    } 
    // Devolver cotización a comerciales
    const handleComeBackCotizacion = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/comeBack/${r.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización ha regresado a comerciales', 'positive')) 
            dispatch(actions.axiosToGetCotizacionesAdmin(false))

            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false)
        })
        return sendAprobation;
    } 

    const openCoti = async () => {
        dispatch(actions.axiosToGetCotizacion(true, r.id))
        params.set('watch', 'cotizacion');
        setParams(params);
    }

    const openRemision = async () => {
        dispatch(actions.axiosToGetCotizacion(true, r.id))
        params.set('watch', 'remision');
        setParams(params);
    }

    return (
    <tr>
        <td className="coding">
            <div className="code" onClick={() => openCoti()}>
                <h3>{Number(21719) + r.id}</h3>
            </div>
        </td>
        <td className="longer" style={{width:'40%'}} onClick={() => openCoti()}> 
            <div className="titleNameKitAndData">
                <div className="extensionColor"> 
                    <span>{r.createdAt.split('T')[0] }</span>
                </div>
                <div className="nameData">
                    <h3>{r.name}</h3>
                </div>
            </div>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
                <div className="nameData">
                    <h3 style={{fontSize:12}}>{r.client.nombre}</h3>
                </div>
            <span>{r.condicionesPago ? r.condicionesPago.nombre : null}</span>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
            <span>{r.days} Días de entrega</span>
        </td>

        <td className="hiddenBtn"> 
            <div className="menu-container">
                            <button className="btnOptions"
                              onClick={() => toggleMenu(item.id)}
                              aria-haspopup="true" // Indica que es un botón que abre un menú
                              aria-expanded={openMenuId === item.id} // Indica si el menú está abierto
                              aria-label="Opciones del elemento"
                            >
                              {/* Icono de tres puntos */}
                                {openMenuId === item.id ?
                                <span>Abierto</span>
                                :<BsThreeDots className="icon" />}
                            </button>
            
             
                            {openMenuId === item.id && ( // Renderizado condicional para mostrar/ocultar
                                <div
                                className="
                                 menu-dropdown"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby={`menu-button-${item.id}`}
                              >
                                    <div className="panel">
                                        <div className="title">
                                            <strong>Cotización</strong>
                                        </div>
                                        <nav>
                                            <ul>
                                                <li onClick={() => {
                                                    if(!loading){
                                                        handleAprobar()
                                                    }
                                                }}> 
                                                    <div>
                                                        <MdOutlineFlag className="icon" />
                                                        <span>{loading ? 'aprobando...' : 'Aprobar'}</span>
                                                    </div>
                                                </li>
                                                <li onClick={() => {
                                                    if(!otherLoading){
                                                        handleComeBackCotizacion()
                                                    }
                                                }}> 
                                                    <div>
                                                        <MdOutlineScreenShare   className="icon" />
                                                        <span>{otherLoading ? 'Regresando...' : 'Regresar a comerciales'}</span>
                                                    </div>
                                                </li>
                                                
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="panel">
                                        <div className="title">
                                            <strong>Opciones rápidas</strong>
                                        </div>
                                        <nav>
                                            <ul>
                                                <li onClick={() => openCoti(r.id)}> 
                                                    <div>
                                                        <MdOutlineRemoveRedEye  className="icon" />
                                                        <span>Ver</span>
                                                    </div>
                                                </li>
                                                <li onClick={() => openRemision(r.id)}> 
                                                    <div>
                                                        <MdOutlineRemoveRedEye  className="icon" />
                                                        <span>Remisión</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                              </div>
                            )}
                            </div>
        </td>
    </tr>
    )
}