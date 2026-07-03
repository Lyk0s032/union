import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../store/action/action";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
    MdClose,
    MdCheckCircle,
    MdAccessTime,
    MdVisibility,
    MdPerson,
    MdCalendarToday,
    MdDescription,
    MdChat,
    MdArrowBack,
    MdList
} from "react-icons/md";
import NewProducto from "../new/NewProducto";
import ChatDrawer from "../../../produccion/solicitudes/lastVersion/ChatDrawer";
import axios from "axios";
import {
    getContenedorProgreso,
    getContenedorEstadoLabel,
    getHijoProgreso,
    getHijoEstadoLabel,
    getGrupoLabel,
    getItemLabel,
    isHijoLeido,
    isProductoTipo,
} from "../../../comercial/solicitudes/utils/requerimientoProgress";

dayjs.locale("es");

const estadoIcon = (estadoClass) => {
    if (estadoClass === 'completed') return <MdCheckCircle />;
    if (estadoClass === 'progress' || estadoClass === 'creating') return <MdVisibility />;
    return <MdAccessTime />;
};

export default function SolicitudDetail({ solicitudId, onClose, onOpenChild, onBack, isChild = false }) {
    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const usuario = useSelector(store => store.usuario);
    const { requerimiento, loadingRequerimiento } = noti;
    const { user } = usuario;

    const [create, setCreate] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const markedAsReadRef = useRef(null);

    useEffect(() => {
        markedAsReadRef.current = null;
    }, [solicitudId]);

    useEffect(() => {
        if (solicitudId) {
            dispatch(actions.axiosToGetRequerimiento(true, solicitudId));
        }
    }, [solicitudId, dispatch]);

    const markAsRead = useCallback(async () => {
        if (!solicitudId) return;
        if (Number(requerimiento?.id) !== Number(solicitudId)) return;
        if (requerimiento.esContenedor || isHijoLeido(requerimiento, requerimiento.tipo || 'producto')) return;
        if (markedAsReadRef.current === solicitudId) return;

        const ownerId = requerimiento.userId || requerimiento.user?.id;
        if (!ownerId) return;

        markedAsReadRef.current = solicitudId;

        try {
            await axios.put('/api/kit/requerimiento/put/read', {
                reqId: solicitudId,
                userId: ownerId,
            });
            dispatch(actions.axiosToGetRequerimiento(false, solicitudId));
            dispatch(actions.axiosToGetRequerimientos(false, 'compras'));
            dispatch(actions.axiosToGetRequerimientos(false, 'comercial'));
        } catch (err) {
            console.error(err);
            markedAsReadRef.current = null;
        }
    }, [solicitudId, requerimiento, dispatch]);

    useEffect(() => {
        if (loadingRequerimiento) return;
        if (!requerimiento || requerimiento === 404 || requerimiento === 'notrequest') return;
        markAsRead();
    }, [requerimiento, loadingRequerimiento, markAsRead]);

    const isContenedor = requerimiento?.esContenedor;
    const hijos = requerimiento?.hijos || [];
    const tipoGrupo = requerimiento?.tipo || 'producto';

    const getEstado = () => {
        if (!requerimiento) return { label: '', class: '', icon: null };
        if (isContenedor) {
            const e = getContenedorEstadoLabel(hijos, tipoGrupo);
            return { ...e, icon: estadoIcon(e.class) };
        }
        if (requerimiento.state === 'finish') {
            return { label: 'Completada', class: 'completed', icon: <MdCheckCircle /> };
        }
        const leido = isHijoLeido(requerimiento, tipoGrupo);
        if (leido && requerimiento.state === 'creando') {
            return { label: 'En creación', class: 'creating', icon: <MdVisibility /> };
        }
        if (leido) {
            return { label: 'En progreso', class: 'progress', icon: <MdVisibility /> };
        }
        return { label: 'Pendiente', class: 'pending', icon: <MdAccessTime /> };
    };

    const getPorcentaje = () => {
        if (!requerimiento) return 0;
        if (isContenedor) return getContenedorProgreso(hijos, tipoGrupo);
        return getHijoProgreso(requerimiento, tipoGrupo);
    };

    const formatDate = (dateString) => dayjs(dateString).format('DD [de] MMMM [de] YYYY, HH:mm');

    const closeNewProducto = () => setCreate(null);

    const handleSendMessage = async (data) => {
        try {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('reqId', requerimiento.id);
            formData.append('userId', user.user.id);
            formData.append('para', 'cliente');

            if (data.userToNotify && Array.isArray(data.userToNotify)) {
                formData.append('userToNotify', JSON.stringify(data.userToNotify));
            }

            if (data.attachments?.length > 0) {
                data.attachments.forEach((file) => formData.append('images', file));
            }

            await axios.post('/api/kit/requerimientos/post/add/message', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
                {isChild && onBack ? (
                    <button className="close-button back-button" onClick={onBack}>
                        <MdArrowBack />
                    </button>
                ) : (
                    <button className="close-button" onClick={onClose}>
                        <MdClose />
                    </button>
                )}

                <div className="header-content">
                    <div className={`status-badge-large ${estado.class}`}>
                        {estado.icon}
                        <span>{estado.label}</span>
                    </div>

                    <h2>{requerimiento.nombre}</h2>

                    {requerimiento.padre && (
                        <p className="parent-ref">Grupo: {requerimiento.padre.nombre}</p>
                    )}

                    <div className="header-meta">
                        <div className="meta-chip">
                            <MdPerson />
                            <span>{requerimiento.user?.name} {requerimiento.user?.lastName}</span>
                        </div>
                        <div className="meta-chip">
                            <MdCalendarToday />
                            <span>{formatDate(requerimiento.createdAt)}</span>
                        </div>
                        <div className="meta-chip type">
                            {isContenedor ? getGrupoLabel(tipoGrupo, hijos.length) : getItemLabel(requerimiento.tipo || 'producto')}
                        </div>
                        {isContenedor && (
                            <div className="meta-chip">
                                <MdList />
                                <span>{hijos.length} requerimiento{hijos.length !== 1 ? 's' : ''}</span>
                            </div>
                        )}
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

                {isContenedor && (
                    <div className="detail-section children-section">
                        <div className="section-title">
                            <MdList />
                            <h3>Productos solicitados en este grupo</h3>
                        </div>
                        <div className="section-content children-list">
                            {hijos.length === 0 ? (
                                <p className="empty-children">Comercial aún no ha agregado productos a este grupo.</p>
                            ) : (
                                hijos.map((hijo) => {
                                    const hijoEstado = getHijoEstadoLabel(hijo, tipoGrupo);
                                    const hijoProgreso = getHijoProgreso(hijo, tipoGrupo);
                                    return (
                                        <div
                                            key={hijo.id}
                                            className={`child-req-card ${hijoEstado.class}`}
                                            onClick={() => onOpenChild && onOpenChild(hijo)}
                                        >
                                            <div className="child-req-header">
                                                <h4>{hijo.nombre}</h4>
                                                <span className={`status-badge ${hijoEstado.class}`}>{hijoEstado.label}</span>
                                            </div>
                                            <div className="child-req-progress">
                                                <div className="progress-bar">
                                                    <div
                                                        className={`progress-fill ${hijoEstado.class}`}
                                                        style={{ width: `${hijoProgreso}%` }}
                                                    />
                                                </div>
                                                <span>{hijoProgreso}%</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {requerimiento.state !== 'cancel' && (
                    <div className="detail-section actions-section">
                        <div className="section-title">
                            <h3>Acciones</h3>
                        </div>
                        <div className="section-content actions-grid">
                            <button className="action-button primary" onClick={() => setChatOpen(true)}>
                                <MdChat />
                                <span>Abrir Chat</span>
                                {requerimiento.adjuntRequireds?.length > 0 && (
                                    <span className="badge">{requerimiento.adjuntRequireds.length}</span>
                                )}
                            </button>

                            {!isContenedor && !requerimiento.productoId && requerimiento.state !== 'finish' && (
                                <button
                                    className={`action-button ${create ? 'danger' : 'secondary'}`}
                                    onClick={() => setCreate(create ? null : 'producto')}
                                >
                                    {create ? 'Cancelar creación' : 'Crear Producto'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!isContenedor && create === 'producto' && !requerimiento.productoId && (
                    <div className="detail-section">
                        <NewProducto close={closeNewProducto} requerimiento={requerimiento} />
                    </div>
                )}

                {!isContenedor && requerimiento.productoId && requerimiento.state !== 'finish' && (
                    <div className="detail-section">
                        <NewProducto requerimiento={requerimiento} />
                    </div>
                )}

                {requerimiento.producto && requerimiento.state === 'finish' && (
                    <div className="detail-section kit-created">
                        <div className="kit-created-content">
                            <MdCheckCircle className="success-icon" />
                            <h3>¡Producto completado!</h3>
                            <div className="kit-info">
                                <div className="kit-info-item">
                                    <span className="label">Código</span>
                                    <span className="value">{requerimiento.producto.id}</span>
                                </div>
                                <div className="kit-info-item">
                                    <span className="label">Nombre</span>
                                    <span className="value">{requerimiento.producto.item}</span>
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
