import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../store/action/action';
import { BiSearch } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import SolicitudCard from "./SolicitudCard";
import SolicitudDetail from "./SolicitudDetail";
import "./styles.less";

export default function SolicitudesMain() {
    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const { requerimientos, loadingRequerimientos } = noti;
    
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('todos');

    useEffect(() => {
        dispatch(actions.axiosToGetRequerimientos(true));
    }, []);

    useEffect(() => {
        if (requerimientos && requerimientos.length) {
            let filtered = requerimientos;
            
            // Primero filtrar por estado
            if (filtroEstado !== 'todos') {
                filtered = filtered.filter(solicitud => {
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
                    solicitud.user?.name?.toLowerCase().includes(searchLower) ||
                    solicitud.user?.lastName?.toLowerCase().includes(searchLower) ||
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
        dispatch(actions.axiosToGetRequerimiento(true, solicitud.id));
    };

    const handleCloseDetail = () => {
        setSelectedSolicitud(null);
    };

    const getEstadoCount = (estado) => {
        if (!requerimientos) return 0;
        return requerimientos.filter(s => {
            if (estado === 'finish') return s.state === 'finish';
            if (estado === 'leido') return s.leidoProduccion && s.state !== 'finish';
            if (estado === 'espera') return !s.leidoProduccion && s.state !== 'finish';
            return false;
        }).length;
    };

    return (
        <div className="solicitudes-main-container">
            <div className="solicitudes-header">
                <div className="header-top">
                    <h1>Solicitudes de Producción</h1>
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
                        placeholder="Buscar por nombre, descripción, usuario o ID..."
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
                                    <p>Las solicitudes aparecerán aquí cuando se creen</p>
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

                {selectedSolicitud && (
                    <SolicitudDetail
                        solicitudId={selectedSolicitud.id}
                        onClose={handleCloseDetail}
                    />
                )}
            </div>
        </div>
    );
}
