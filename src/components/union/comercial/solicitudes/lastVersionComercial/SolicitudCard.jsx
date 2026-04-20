import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { MdCheckCircle, MdAccessTime, MdVisibility } from "react-icons/md";

dayjs.extend(relativeTime);
dayjs.locale("es");

export default function SolicitudCard({ solicitud, isSelected, onClick }) {
    const getEstado = () => {
        if (solicitud.state === 'finish') return { label: 'Completada', class: 'completed' };
        if (solicitud.leidoProduccion && solicitud.state === 'creando') return { label: 'En creación', class: 'creating' };
        if (solicitud.leidoProduccion) return { label: 'En progreso', class: 'progress' };
        return { label: 'Pendiente', class: 'pending' };
    };

    const getPorcentaje = () => {
        if (solicitud.state === 'finish') return 100;
        if (solicitud.leidoProduccion && solicitud.state === 'creando') return 70;
        if (solicitud.leidoProduccion) return 30;
        return 0;
    };

    const getEstadoIcon = () => {
        const estado = getEstado();
        if (estado.class === 'completed') return <MdCheckCircle />;
        if (estado.class === 'progress' || estado.class === 'creating') return <MdVisibility />;
        return <MdAccessTime />;
    };

    const formatDate = (dateString) => {
        const date = dayjs(dateString);
        const today = dayjs();
        const diffDays = today.diff(date, 'day');
        
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return date.fromNow();
        return date.format('DD/MM/YYYY');
    };

    const estado = getEstado();
    const porcentaje = getPorcentaje();

    return (
        <div 
            className={`solicitud-card ${isSelected ? 'selected' : ''} ${estado.class}`}
            onClick={onClick}
        >
            <div className="card-header">
                <div className="card-title-section">
                    <span className="card-type">
                        {solicitud.type === 'producto' ? 'Producto Terminado' : 'Kit'}
                    </span>
                    <h3 className="card-title">{solicitud.nombre}</h3>
                </div>
                
                <div className={`status-badge ${estado.class}`}>
                    {getEstadoIcon()}
                    <span>{estado.label}</span>
                </div>
            </div>

            <div className="card-body">
                {solicitud.description && (
                    <p className="card-description">
                        {solicitud.description.length > 80 
                            ? `${solicitud.description.substring(0, 80)}...` 
                            : solicitud.description}
                    </p>
                )}

                <div className="card-meta">
                    <div className="meta-item">
                        <span className="meta-label">Fecha:</span>
                        <span className="meta-value">{formatDate(solicitud.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <div className="progress-section">
                    <div className="progress-info">
                        <span className="progress-label">Progreso</span>
                        <span className="progress-percentage">{porcentaje}%</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className={`progress-fill ${estado.class}`}
                            style={{ width: `${porcentaje}%` }}
                        />
                    </div>
                </div>
            </div>

            {isSelected && <div className="selection-indicator" />}
        </div>
    );
}
