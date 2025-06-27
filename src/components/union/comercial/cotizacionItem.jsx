import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español

export default function CotizacionItem({ cotizacionn, openMenuId, toggleMenu }){
    const [params, setParams] = useSearchParams();
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const cotizacion = cotizacionn;

        dayjs.locale('es') 
        dayjs.extend(localeData);

    const dispatch = useDispatch();
    // Aprobar 
    const handleAprobar = async() => {
        
        const sendAprobation = await axios.get(`/api/cotizacion/accept/${cotizacion.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización aprobada', 'positive')) 
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            toggleMenu(cotizacion.id)
            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'positive'))
            return err;
        })
        return sendAprobation;
    } 
    // Abrir cotización
    const openCoti = async () => {
        toggleMenu(null)
        dispatch(actions.axiosToGetCotizacion(true, cotizacion.id))
        params.set('watch', 'cotizacion');
        setParams(params);
    }
    // Eliminar cotizacion
    const handleRemove = async() => {
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id
        }
        const sendRemove = await axios.delete(`/api/cotizacion/remove/cotizacion`, { data: body})
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización removida', 'positive')) 
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            toggleMenu(cotizacion.id)
            return res;
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado remover esta cotización', 'positive'))
            return err
        })
        return sendRemove;
    } 
    return (
        <tr>
            <td onClick={() => openCoti()}>{cotizacion.name}</td>
            <td>{cotizacion.client.nombre}</td>
            <td>{Number(21719) + cotizacion.id}</td>
            
            <td>{dayjs(cotizacion.createdAt.split('T')[0]).format('DD [de] MMMM [de] YYYY')}</td>
            {/* <td>
                <strong>{<ValorKit cotizacion={cotizacion} />} COP</strong>
            </td> */}
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
                                    {
                                        cotizacion.state != 'aprobada' && (
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
                                        </li> ) 
                                    }
                                    <li onClick={() => openCoti(cotizacion.id)}> 
                                        <div>
                                            <MdOutlineRemoveRedEye  className="icon" />
                                            <span>Ver</span>
                                        </div>
                                    </li>
                                    <li onClick={() => handleRemove()}> 
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
    
    // Descuento
    const descuentoValor = coti.kits && coti.kits.length ? Number(coti.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.descuento : 0), 0)) : null
    const descuentoValorSuper = coti.armados && coti.armados.length ? Number(coti.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.descuento : 0), 0)) : null
 
    let totalCoti = valorSuper + valor;
    let descuento = Number(descuentoValor) + Number(descuentoValorSuper)
    return (
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalCoti - descuento).toFixed(0))}</span>
    )
}