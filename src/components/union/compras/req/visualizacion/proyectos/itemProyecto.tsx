import React from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(localizedFormat);
dayjs.locale('es');

interface ItemProyectoProps {
    proyecto: {
        id: number;
        nombre: string;
        cotizacionId: number;
        fecha: string;
        estado: string;
        cliente: string;
    };
    isSelected: boolean;
    onSelect: () => void;
}

export default function ItemProyecto({ proyecto, isSelected, onSelect }: ItemProyectoProps) {
    const fechaFormateada = dayjs(proyecto.fecha).format('D [de] MMMM YYYY, h:mm A');
    const numeroCotizacion = 21719 + proyecto.cotizacionId;

    const handleClick = () => {
        console.log('🖱️ Click en proyecto:', proyecto.id, 'Nombre:', proyecto.nombre);
        console.log('🖱️ Estado actual isSelected:', isSelected);
        onSelect();
    };

    return (
        <div 
            className={`itemProyecto ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
        >
            <div className="numeroProyecto">
                <h3>{proyecto.id}</h3>
            </div>
            <div className="infoProyecto">
                <h3 className="nombreProyecto">{proyecto.nombre}</h3>
                <span className="cotizacion">Cotizacion: {numeroCotizacion}</span>
                <span className="fecha">{fechaFormateada}</span>
                <span className={`estado estado-${proyecto.estado.replace(' ', '-')}`}>
                    {proyecto.estado}
                </span>
            </div>
        </div>
    ) 
}