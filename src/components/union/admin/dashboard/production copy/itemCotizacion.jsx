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
    const [showSimulacionModal, setShowSimulacionModal] = useState(false);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
    // Verificar si hay kits con simulación
    const verificarSimulacion = async() => {
        try {
            const response = await axios.get(`/api/cotizacion/get/${r.id}`);
            const cotizacion = response.data;
            
            // Verificar si hay kits con estado 'simulacion' en las áreas
            if (cotizacion.areaCotizacions && cotizacion.areaCotizacions.length > 0) {
                for (const area of cotizacion.areaCotizacions) {
                    if (area.kits && area.kits.length > 0) {
                        const tieneSimulacion = area.kits.some(kit => kit.state === 'simulacion');
                        if (tieneSimulacion) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error al verificar simulación:', error);
            return false;
        }
    };

    // Enviar notificación al usuario id = 3
    const enviarNotificacionSimulacion = async() => {
        try {
            await axios.post('/api/notifications', {
                userId: 3,
                title: 'Cotización aprobada contiene simulación',
                body: `${r.id + 21719} - ${r.name}, revisar los items con simulación`,
                category: 'cotizacion',
                targetId: r.id,
                actionUrl: `?simulationsCotizacion=${r.id}`
            });
            console.log('Notificación enviada al usuario id = 3');
        } catch (error) {
            console.error('Error al enviar notificación:', error);
        }
    };

    // Aprobar 
    const handleAprobar = async() => {
        setLoading(true);
        
        // Primero verificar si hay simulaciones
        const haySimulacion = await verificarSimulacion();
        
        if (haySimulacion) {
            setLoading(false);
            setShowSimulacionModal(true);
            // Enviar notificación al usuario id = 3
            await enviarNotificacionSimulacion();
            return;
        }

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
        setOtherLoading(true)
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
            setOtherLoading(false)
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
    <>
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
                              aria-haspopup="true"
                              aria-expanded={openMenuId === item.id}
                              aria-label="Opciones del elemento"
                            >
                                {openMenuId === item.id ?
                                <span>Abierto</span>
                                :<BsThreeDots className="icon" />}
                            </button>
            
             
                            {openMenuId === item.id && (
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

    {/* Modal de advertencia de simulación */}
    {showSimulacionModal && (
        <div className="modal" style={{ zIndex: 20 }}>
            <div className="hiddenModal" onClick={() => setShowSimulacionModal(false)} />
            <div
                className="containerModal"
                style={{
                    maxWidth: '440px',
                    width: '100%',
                    padding: '0',
                    borderRadius: '14px',
                    background: '#fff',
                    overflow: 'hidden',
                }}
            >
                <div style={{ height: '5px', background: '#f59e0b' }} />

                <div style={{ padding: '32px 28px 28px' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '20px',
                        }}
                    >
                        ⚠️
                    </div>

                    <h2
                        style={{
                            margin: '0 0 8px',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                        }}
                    >
                        No se puede aprobar esta cotización
                    </h2>

                    <p
                        style={{
                            margin: '0',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#6b7280',
                        }}
                    >
                        Esta cotización contiene uno o más KITs que son simulaciones. 
                        Por favor, convierte las simulaciones en KITs definitivos antes de aprobar.
                    </p>
                </div>

                <div
                    style={{
                        padding: '16px 28px',
                        background: '#f9fafb',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <button
                        onClick={() => setShowSimulacionModal(false)}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#f59e0b',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#d97706'}
                        onMouseLeave={(e) => e.target.style.background = '#f59e0b'}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
    )
}