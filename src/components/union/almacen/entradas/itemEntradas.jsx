import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemEntradas({ orden }) {
    const [params, setParams] = useSearchParams();
    
    if (!orden) return null;
    
    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'Sin fecha';
        try {
            const d = new Date(fecha);
            return d.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return String(fecha);
        }
    };
    
    const handleClick = () => {
        console.log('[ITEM_ENTRADAS] Abriendo orden:', orden.id);
        setParams({ orden: orden.id });
    };
    
    return (
        <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
            <td>{orden.id || 'N/A'}</td>
            <td>
                <span>{orden.nombre || orden.name || 'Sin nombre'}</span>
            </td>
            <td>
                <span>
                    {typeof orden.proveedor === 'object' 
                        ? (orden.proveedor?.nombre || orden.proveedor?.name || 'Sin proveedor')
                        : (orden.proveedor || orden.supplier || 'Sin proveedor')
                    }
                </span>
            </td>

            <td>
                <span>{formatearFecha(orden.fechaEntrada || orden.createdAt)}</span>
            </td>
            <td className="center">
                <span>{orden?.requisiciones?.length || orden.totalProyectos || 0}</span>
            </td>
        </tr>
    )
}