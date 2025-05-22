import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";

export default function CotizacionItem({ cotizacionn, openMenuId, toggleMenu }){
    const [params, setParams] = useSearchParams();
    const cotizacion = cotizacionn;

    const dispatch = useDispatch();

    const handleAprobar = async() => {
        
        const sendAprobation = await axios.get(`/api/cotizacion/accept/${cotizacion.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización aprobada', 'positive')) 
            dispatch(actions.axiosToGetCotizaciones(false))
            toggleMenu(cotizacion.id)
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'positive'))
        })
        return sendAprobation;
    } 

    const openCoti = async () => {
        toggleMenu(null)
        dispatch(actions.axiosToGetCotizacion(true, cotizacion.id))
        params.set('watch', 'cotizacion');
        setParams(params);
    }
    return (
        <tr>
            <td onClick={() => openCoti()}>{cotizacion.name}</td>
            <td>{cotizacion.client.nombre}</td>
            <td>{cotizacion.updatedAt.split('T')[0]}</td>
            <td>
                <strong>{<ValorKit cotizacion={cotizacion} />} COP</strong>
            </td>
            <td>{cotizacion.state}</td>
            {/* <td> 
                <button onClick={() => {
                    params.set('w', 'updateMp');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}
            <td>
                <div className="menu-container">
                <button className="btnOptions"
                  onClick={() => toggleMenu(cotizacion.id)}
                  aria-haspopup="true" // Indica que es un botón que abre un menú
                  aria-expanded={openMenuId === cotizacion.id} // Indica si el menú está abierto
                  aria-label="Opciones del elemento"
                >
                  {/* Icono de tres puntos */}
                    <BsThreeDots className="icon" />
                </button>

 
                {openMenuId === cotizacion.id && ( // Renderizado condicional para mostrar/ocultar
                    <div
                    className="
                     menu-dropdown"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`menu-button-${cotizacion.id}`}
                  >
                        <div className="panel">
                            <div className="title">
                                <strong>Cotización</strong>
                            </div>
                            <nav>
                                <ul>
                                    <li onClick={() => handleAprobar()}> 
                                        <div>
                                            <MdOutlineFlag className="icon" />
                                            <span>Aprobar</span>
                                        </div>
                                    </li>
                                    <li> 
                                        <div>
                                            <MdOutlineScreenShare   className="icon" />
                                            <span>Compartir</span>
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
                                    <li onClick={() => {
                                        toggleMenu(cotizacion.id)
                                        dispatch(actions.getCotizacion(cotizacion))
                                        params.set('w', 'newCotizacion')
                                        setParams(params);
                                    }}> 
                                        <div>
                                            <BsPencil className="icon" />
                                            <span>Editar</span>
                                        </div>
                                    </li>
                                    <li onClick={() => openCoti(cotizacion.id)}> 
                                        <div>
                                            <MdOutlineRemoveRedEye  className="icon" />
                                            <span>Ver</span>
                                        </div>
                                    </li>
                                    <li> 
                                        <div>
                                            <MdDeleteOutline className="icon" />
                                            <span>Eliminar</span>
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

function ValorKit(props){
    const coti = props.cotizacion;
    const valor = coti.kits && coti.kits.length ? Number(coti.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.precio : 0), 0)) : null
    const valorSuper = coti.armados && coti.armados.length ? Number(coti.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.precio : 0), 0)) : null
 
    let totalCoti = valorSuper + valor;
    return (
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format((totalCoti))}</span>
    )
}