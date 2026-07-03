import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../store/action/action';
import { BiSearch } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import SolicitudCard from "./SolicitudCard";
import SolicitudDetail from "./SolicitudDetail";
import NewReq from "../new/newReq";
import "./styles.less";
import { isHijoLeido } from "../utils/requerimientoProgress";

export default function SolicitudesMain() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const { requerimientos, loadingRequerimientos } = noti;
    
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [addReq, setAddReq] = useState(false);

    // Cargar lista de requerimientos
    useEffect(() => {
        dispatch(actions.axiosToGetRequerimientos(true, 'comercial'));
    }, [dispatch]);

    // Detectar parámetro id desde notificación y abrir automáticamente
    useEffect(() => {
        const openReqParam = searchParams.get('id') || searchParams.get('openReq');
        
        if (!openReqParam || !requerimientos?.length) return;

        const findInList = (id) => {
            const direct = requerimientos.find(r => String(r.id) === String(id));
            if (direct) return { solicitud: direct, child: null };

            for (const grupo of requerimientos) {
                const hijo = grupo.hijos?.find(h => String(h.id) === String(id));
                if (hijo) return { solicitud: grupo, child: hijo };
            }
            return null;
        };

        const found = findInList(openReqParam);

        if (found) {
            setSelectedSolicitud(found.solicitud);
            if (found.child) {
                setSelectedChild(found.child);
                dispatch(actions.axiosToGetRequerimiento(true, found.child.id));
            } else {
                setSelectedChild(null);
                dispatch(actions.axiosToGetRequerimiento(true, found.solicitud.id));
            }
        }

        const newParams = new URLSearchParams(searchParams);
        newParams.delete('id');
        newParams.delete('openReq');
        setSearchParams(newParams, { replace: true });
    }, [searchParams, requerimientos, dispatch, setSearchParams]);

    useEffect(() => {
        if (!requerimientos?.length) return;
        if (selectedSolicitud) {
            const fresh = requerimientos.find(r => r.id === selectedSolicitud.id);
            if (fresh) {
                setSelectedSolicitud(fresh);
                if (selectedChild) {
                    const freshHijo = fresh.hijos?.find(h => h.id === selectedChild.id);
                    if (freshHijo) setSelectedChild(freshHijo);
                }
            }
        }
    }, [requerimientos]);

    useEffect(() => {
        if (requerimientos && requerimientos.length) {
            let filtered = requerimientos;
            
            // Primero filtrar por estado
            if (filtroEstado !== 'todos') {
                filtered = filtered.filter(solicitud => {
                    if (solicitud.esContenedor) {
                        const hijos = solicitud.hijos || [];
                        const tipo = solicitud.tipo || 'kit';
                        if (filtroEstado === 'pendientes') {
                            return hijos.length === 0 || hijos.some(h => !isHijoLeido(h, tipo) && h.state !== 'finish');
                        }
                        if (filtroEstado === 'progreso') {
                            return hijos.some(h => (isHijoLeido(h, tipo) || h.state === 'creando') && h.state !== 'finish');
                        }
                        if (filtroEstado === 'completadas') {
                            return hijos.length > 0 && hijos.every(h => h.state === 'finish');
                        }
                        return true;
                    }
                    if (filtroEstado === 'pendientes') {
                        return !solicitud.leidoProduccion && solicitud.state !== 'finish';
                    } else if (filtroEstado === 'progreso') {
                        return solicitud.leidoProduccion && solicitud.state !== 'finish';
                    } else if (filtroEstado === 'completadas') {
                        return solicitud.state === 'finish';
                    }
                    return true;
                });
            }
            
            // Luego filtrar por búsqueda
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filtered = filtered.filter(solicitud => (
                    solicitud.nombre?.toLowerCase().includes(searchLower) ||
                    solicitud.description?.toLowerCase().includes(searchLower) ||
                    solicitud.id?.toString().includes(searchLower)
                ));
            }
            
            setFilteredSolicitudes(filtered);
        } else {
            setFilteredSolicitudes([]);
        }
    }, [requerimientos, searchTerm, filtroEstado]);

    const handleSelectSolicitud = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setSelectedChild(null);
        dispatch(actions.axiosToGetRequerimiento(true, solicitud.id));
        setAddReq(false);
    };

    const handleCloseDetail = () => {
        setSelectedSolicitud(null);
        setSelectedChild(null);
    };

    const handleOpenChild = (child) => {
        setSelectedChild(child);
        dispatch(actions.axiosToGetRequerimiento(true, child.id));
    };

    const handleBackFromChild = () => {
        setSelectedChild(null);
        if (selectedSolicitud) {
            dispatch(actions.axiosToGetRequerimiento(true, selectedSolicitud.id));
        }
    };

    const handleNewRequest = () => {
        setAddReq(true);
        setSelectedSolicitud(null);
    };

    const handleCloseNewReq = () => {
        setAddReq(false);
    };

    const handleSolicitudCreated = (solicitud) => {
        setSelectedSolicitud(solicitud);
    };

    const getEstadoCount = (estado) => {
        if (!requerimientos) return 0;
        return requerimientos.filter(s => {
            if (s.esContenedor) {
                const hijos = s.hijos || [];
                const tipo = s.tipo || 'kit';
                if (estado === 'finish') return hijos.length > 0 && hijos.every(h => h.state === 'finish');
                if (estado === 'leido') return hijos.some(h => (isHijoLeido(h, tipo) || h.state === 'creando') && h.state !== 'finish');
                if (estado === 'espera') return hijos.length === 0 || hijos.some(h => !isHijoLeido(h, tipo) && h.state !== 'finish');
                return false;
            }
            const leido = s.tipo === 'producto' ? s.leidoCompras : s.leidoProduccion;
            if (estado === 'finish') return s.state === 'finish';
            if (estado === 'leido') return leido && s.state !== 'finish';
            if (estado === 'espera') return !leido && s.state !== 'finish';
            return false;
        }).length;
    };

    return (
        <div className="solicitudes-main-container comercial">
            <div className="solicitudes-header">
                <div className="header-top">
                    <div className="header-title-section">
                        <h1>Mis Solicitudes</h1>
                        <button className="btn-new-request" onClick={handleNewRequest}>
                            <AiOutlinePlus />
                            <span>Nueva Solicitud</span>
                        </button>
                    </div>
                    <div className="stats-chips">
                        <button 
                            className={`stat-chip all ${filtroEstado === 'todos' ? 'active' : ''}`}
                            onClick={() => setFiltroEstado('todos')}
                        >
                            <span className="label">Todos</span>
                            <span className="value">{requerimientos?.length || 0}</span>
                        </button>
                        <button 
                            className={`stat-chip pending ${filtroEstado === 'pendientes' ? 'active' : ''}`}
                            onClick={() => setFiltroEstado('pendientes')}
                        >
                            <span className="label">Pendientes</span>
                            <span className="value">{getEstadoCount('espera')}</span>
                        </button>
                        <button 
                            className={`stat-chip progress ${filtroEstado === 'progreso' ? 'active' : ''}`}
                            onClick={() => setFiltroEstado('progreso')}
                        >
                            <span className="label">En progreso</span>
                            <span className="value">{getEstadoCount('leido')}</span>
                        </button>
                        <button 
                            className={`stat-chip completed ${filtroEstado === 'completadas' ? 'active' : ''}`}
                            onClick={() => setFiltroEstado('completadas')}
                        >
                            <span className="label">Completadas</span>
                            <span className="value">{getEstadoCount('finish')}</span>
                        </button>
                    </div>
                </div>

                <div className="search-bar">
                    <BiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, descripción o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            className="clear-search"
                            onClick={() => setSearchTerm("")}
                        >
                            <MdClose />
                        </button>
                    )}
                </div>
            </div>

            <div className="solicitudes-content">
                <div className="solicitudes-list">
                    {loadingRequerimientos ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando solicitudes...</p>
                        </div>
                    ) : filteredSolicitudes.length === 0 ? (
                        <div className="empty-state">
                            {searchTerm ? (
                                <>
                                    <BiSearch className="empty-icon" />
                                    <h3>No se encontraron resultados</h3>
                                    <p>Intenta con otros términos de búsqueda</p>
                                </>
                            ) : (
                                <>
                                    <h3>No hay solicitudes disponibles</h3>
                                    <p>Crea tu primera solicitud haciendo clic en el botón "Nueva Solicitud"</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="cards-grid">
                            {filteredSolicitudes.map((solicitud) => (
                                <SolicitudCard
                                    key={solicitud.id}
                                    solicitud={solicitud}
                                    isSelected={selectedSolicitud?.id === solicitud.id}
                                    onClick={() => handleSelectSolicitud(solicitud)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {selectedChild ? (
                    <SolicitudDetail
                        solicitudId={selectedChild.id}
                        onClose={handleCloseDetail}
                        onBack={handleBackFromChild}
                        isChild
                    />
                ) : selectedSolicitud && (
                    <SolicitudDetail
                        solicitudId={selectedSolicitud.id}
                        onClose={handleCloseDetail}
                        onOpenChild={handleOpenChild}
                    />
                )}

                {addReq && (
                    <div className="solicitud-detail-panel">
                        <div className="detail-header new-request-header">
                            <button className="close-button" onClick={handleCloseNewReq}>
                                <MdClose />
                            </button>
                            <div className="header-content">
                                <h2>Nueva Solicitud</h2>
                            </div>
                        </div>
                        <div className="detail-body">
                            <NewReq close={handleCloseNewReq} onSolicitudCreated={handleSolicitudCreated} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
