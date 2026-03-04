import React from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(localizedFormat);
dayjs.locale('es');

export default function ItemProyecto({ proyecto }) {
    const [params, setParams] = useSearchParams();

    if (!proyecto) return null;

    console.log('proyecto', proyecto)
    const numeroCotizacion = Number(21719) + Number(proyecto.id);

    // La fecha viene en el campo "time" (fallback a fechaAprobada si no existe)
    const fechaFuente = proyecto.time || proyecto.fechaAprobada;
    const fechaAprobada = fechaFuente
        ? dayjs(fechaFuente).format('D [de] MMMM [del] YYYY')
        : 'Sin fecha';

    const handleClick = () => {
        // Dejamos preparado el query param para futuras vistas de detalle de proyecto en almacén
        params.set('proyecto', proyecto.id);
        setParams(params);
    };

    return (
        <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
            <td className="coding">
                <div className="code">
                    <h3>{numeroCotizacion}</h3>
                </div>
            </td>
            <td className="longer Almacen">
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <span>
                            <strong>{proyecto.client?.nombre || proyecto.client?.name || 'Sin cliente'}</strong>
                        </span>
                    </div>
                </div>
            </td>
            <td className="middle Almacen">
                <div className="nameData">
                    <h3>{proyecto.name || proyecto.nombre || 'Sin nombre de proyecto'}</h3>
                </div>
            </td>
            <td className="Almacen" style={{ fontSize: 12, textAlign: 'left' }}>
                <span>{fechaAprobada}</span>
            </td>
        </tr>
    );
}
