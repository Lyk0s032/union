import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../store/action/action";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { 
    MdClose, 
    MdCheckCircle, 
    MdAccessTime, 
    MdVisibility,
    MdCalendarToday,
    MdDescription,
    MdChat
} from "react-icons/md";
import ChatDrawer from "./ChatDrawer";
import axios from "axios";

dayjs.locale("es");

export default function SolicitudDetail({ solicitudId, onClose }) {
    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const usuario = useSelector(store => store.usuario);
    const { requerimiento, loadingRequerimiento } = noti;
    const { user } = usuario;
    
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        if (solicitudId) {
            dispatch(actions.axiosToGetRequerimiento(true, solicitudId));
        }
    }, [solicitudId]);

    const getEstado = () => {
        if (!requerimiento) return { label: '', class: '', icon: null };
        
        if (requerimiento.state === 'finish') {
            return { 
                label: 'Completada', 
                class: 'completed', 
                icon: <MdCheckCircle /> 
            };
        }
        if (requerimiento.leidoProduccion && requerimiento.state === 'creando') {
            return { 
                label: 'En creación', 
                class: 'creating', 
                icon: <MdVisibility /> 
            };
        }
        if (requerimiento.leidoProduccion) {
            return { 
                label: 'En progreso', 
                class: 'progress', 
                icon: <MdVisibility /> 
            };
        }
        return { 
            label: 'Pendiente', 
            class: 'pending', 
            icon: <MdAccessTime /> 
        };
    };

    const getPorcentaje = () => {
        if (!requerimiento) return 0;
        if (requerimiento.state === 'finish') return 100;
        if (requerimiento.leidoProduccion && requerimiento.state === 'creando') return 70;
        if (requerimiento.leidoProduccion) return 30;
        return 0;
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD [de] MMMM [de] YYYY, HH:mm');
    };

    const handleSendMessage = async (data) => {
        try {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('reqId', requerimiento.id);
            formData.append('userId', user.user.id);
            
            if (data.attachments && data.attachments.length > 0) {
                data.attachments.forEach((file) => {
                    formData.append('images', file);
                });
            }

            await axios.post('/api/kit/requerimientos/post/add/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            dispatch(actions.axiosToGetRequerimiento(false, requerimiento.id));
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('No hemos logrado enviar este mensaje', 'mistake'));
        }
    };

    if (loadingRequerimiento) {
        return (
            <div className="solicitud-detail-panel">
                <div className="detail-loading">
                    <div className="spinner"></div>
                    <p>Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (!requerimiento || requerimiento === 404 || requerimiento === 'notrequest') {
        return (
            <div className="solicitud-detail-panel">
                <div className="detail-error">
                    <h3>Error al cargar</h3>
                    <p>No se pudo cargar la información de esta solicitud</p>
                </div>
            </div>
        );
    }

    const estado = getEstado();
    const porcentaje = getPorcentaje();

    return (
        <div className="solicitud-detail-panel">
            <div className="detail-header">
                <button className="close-button" onClick={onClose}>
                    <MdClose />
                </button>
                
                <div className="header-content">
                    <div className={`status-badge-large ${estado.class}`}>
                        {estado.icon}
                        <span>{estado.label}</span>
                    </div>
                    
                    <h2>{requerimiento.nombre}</h2>
                    
                    <div className="header-meta">
                        <div className="meta-chip">
                            <MdCalendarToday />
                            <span>{formatDate(requerimiento.createdAt)}</span>
                        </div>
                        <div className="meta-chip type">
                            {requerimiento.type === 'producto' ? 'Producto Terminado' : 'Kit'}
                        </div>
                    </div>

                    <div className="progress-section-detail">
                        <div className="progress-info">
                            <span className="progress-label">Progreso general</span>
                            <span className="progress-percentage">{porcentaje}%</span>
                        </div>
                        <div className="progress-bar-large">
                            <div 
                                className={`progress-fill ${estado.class}`}
                                style={{ width: `${porcentaje}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-body">
                <div className="detail-section">
                    <div className="section-title">
                        <MdDescription />
                        <h3>Descripción</h3>
                    </div>
                    <div className="section-content">
                        <p>{requerimiento.description || 'Sin descripción'}</p>
                    </div>
                </div>

                {requerimiento.state !== 'cancel' && (
                    <div className="detail-section actions-section">
                        <div className="section-title">
                            <h3>Acciones</h3>
                        </div>
                        <div className="section-content actions-grid">
                            <button 
                                className="action-button primary"
                                onClick={() => setChatOpen(true)}
                            >
                                <MdChat />
                                <span>Abrir Chat</span>
                                {requerimiento.adjuntRequireds?.length > 0 && (
                                    <span className="badge">{requerimiento.adjuntRequireds.length}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {requerimiento.kit && requerimiento.state === 'finish' && (
                    <div className="detail-section kit-created">
                        <div className="kit-created-content">
                            <MdCheckCircle className="success-icon" />
                            <h3>¡Kit creado exitosamente!</h3>
                            <div className="kit-info">
                                <div className="kit-info-item">
                                    <span className="label">Código</span>
                                    <span className="value">{requerimiento.kit.id}</span>
                                </div>
                                <div className="kit-info-item">
                                    <span className="label">Nombre</span>
                                    <span className="value">{requerimiento.kit.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {requerimiento.state === 'finish' && (
                    <div className="detail-section status-message finish">
                        <p>Esta solicitud ha sido completada</p>
                    </div>
                )}

                {requerimiento.state === 'cancel' && (
                    <div className="detail-section status-message cancel">
                        <p>Esta solicitud fue cancelada</p>
                    </div>
                )}
            </div>

            <ChatDrawer 
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                requerimiento={requerimiento}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
}
