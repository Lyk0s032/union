import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import ItemProgress from "./itemProgress";
import { MdFormatColorText, MdOutlineFilePresent, MdOutlineImage, MdOutlineTextFields } from "react-icons/md";
import Solicitud from "./new/solicitud";
import NewReq from "./new/newReq";
export default function Solicitudes(){

    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const { requerimientos , loadingRequerimientos } = noti;
    const [data, setData] = useState('image')
    const [addReq, setAdd] = useState(null);    
    const [open, setOpen] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const changeOpen = (reqId) => {
        setOpen(reqId)
    }
    const close = () => {
        setAdd(null);
    }
    
    const filtrarRequerimientos = () => {
        if (!requerimientos || !requerimientos.length) return [];
        
        if (filtroEstado === 'todos') {
            return requerimientos;
        }
        
        return requerimientos.filter(r => {
            if (filtroEstado === 'pendientes') {
                return !r.leidoProduccion && r.state !== 'finish';
            } else if (filtroEstado === 'progreso') {
                return r.leidoProduccion && r.state !== 'finish';
            } else if (filtroEstado === 'completadas') {
                return r.state === 'finish';
            }
            return true;
        });
    }

    useEffect(() => {
        dispatch(actions.axiosToGetRequerimientos(true))
    }, [])
    return ( 
        <div className="provider"> 
            <div className="containerProviders Dashboard-grid"> 
                <div className="notificationsPanel">
                    <div className="divideNotifications">
                        <div className="leftNoti">
                            <div className="title">
                                <h3>Solicitudes</h3>
                            </div>
                            <div className="filtrosEstado">
                                <button 
                                    className={filtroEstado === 'todos' ? 'active' : ''}
                                    onClick={() => setFiltroEstado('todos')}
                                >
                                    Todos
                                </button>
                                <button 
                                    className={filtroEstado === 'pendientes' ? 'active' : ''}
                                    onClick={() => setFiltroEstado('pendientes')}
                                >
                                    Pendientes
                                </button>
                                <button 
                                    className={filtroEstado === 'progreso' ? 'active' : ''}
                                    onClick={() => setFiltroEstado('progreso')}
                                >
                                    En Progreso
                                </button>
                                <button 
                                    className={filtroEstado === 'completadas' ? 'active' : ''}
                                    onClick={() => setFiltroEstado('completadas')}
                                >
                                    Completadas
                                </button>
                            </div>
                            <div className="resultsNotificationsKits">
                                <div className="containerResultsNoti">
                                    <table>
                                        <tbody>
                                            {
                                                filtrarRequerimientos().map((r, i) => {
                                                    return (
                                                        <ItemProgress open={open} changeOpen={changeOpen} r={r} key={i+1} />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="rightNoti">
                            {
                                addReq ?
                                    <NewReq close={close} />
                                : open ?
                                    <Solicitud open={open} />
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}