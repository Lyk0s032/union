import React from 'react';
import { MdCompareArrows, MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useSearchParams } from 'react-router-dom';

// Función para formatear fecha en español con hora
const formatearFechaEspañol = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(fechaObj.getTime())) return 'Fecha inválida';
    
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    return fechaObj.toLocaleDateString('es-ES', opciones);
};

export default function ItemMovimiento({ movimiento }){
    
    const [params, setParams] = useSearchParams();

    // Función para obtener el nombre del proyecto, orden de compra o tipo de ingreso
    const obtenerNombreProyecto = () => {
        // 1. Si es TRANSFERENCIA y tiene proyectos, mostrar el nombre del proyecto
        if (movimiento.tipoMovimiento === 'TRANSFERENCIA' && movimiento.proyectos && movimiento.proyectos.length > 0) {
            if (movimiento.proyectos.length === 1) {
                return movimiento.proyectos[0].nombreProyecto;
            } else {
                // Si hay múltiples proyectos, mostrar el primero con indicador
                return `${movimiento.proyectos[0].nombreProyecto} (+${movimiento.proyectos.length - 1})`;
            }
        }
        
        // 2. Si es una ENTRADA que viene de una orden de compra
        // Verificar por comprasCotizacionId o por referenciaDeDocumento que empiece con "ORDEN-"
        const esPorOrdenCompra = movimiento.comprasCotizacionId || 
            (movimiento.referenciaDeDocumento && movimiento.referenciaDeDocumento.startsWith('ORDEN-'));
        
        if (esPorOrdenCompra) {
            // Obtener el número de orden de compra
            const numeroOC = movimiento.comprasCotizacionId || 
                (movimiento.referenciaDeDocumento?.startsWith('ORDEN-') 
                    ? movimiento.referenciaDeDocumento.replace('ORDEN-', '') 
                    : null);
            return `OC - ${numeroOC || 'N/A'}`;
        }
        
        // 3. Si no es transferencia a proyecto ni orden de compra, es ingreso manual
        return 'Ingreso manual';
    };

    // Función para obtener las iniciales de cada palabra de un nombre
    const obtenerIniciales = (nombre) => {
        if (!nombre) return 'N/A';
        return nombre
            .split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase())
            .join('');
    };

    // Función para obtener el texto de bodega según el tipo de movimiento (solo iniciales)
    const obtenerTextoBodega = () => {
        if (movimiento.tipoMovimiento === 'TRANSFERENCIA') {
            // Para transferencias: mostrar origen → destino (solo iniciales)
            const origen = obtenerIniciales(movimiento.ubicacionOrigenNombre);
            const destino = obtenerIniciales(movimiento.ubicacionDestinoNombre);
            return `${origen} → ${destino}`;
        } else if (movimiento.tipoMovimiento === 'ENTRADA') {
            // Para entradas: mostrar bodega destino (solo iniciales)
            return obtenerIniciales(movimiento.ubicacionDestinoNombre);
        } else if (movimiento.tipoMovimiento === 'SALIDA') {
            // Para salidas: mostrar bodega origen (solo iniciales)
            return obtenerIniciales(movimiento.ubicacionOrigenNombre);
        }
        return 'N/A';
    };

    return (
        <tr>
            <td className="people">
                <div className="divPeople">
                    <div className="letter">
                        <h3>{obtenerNombreProyecto().charAt(0).toUpperCase()}</h3>
                    </div>
                    <div className="dataPerson">
                        <h3>{obtenerNombreProyecto()}</h3>
                        <span>{formatearFechaEspañol(movimiento.createdAt)}</span>
                    </div>
                </div>
            </td>
            <td className='register Small'>
                {
                    params.get('show') == 'Proyecto' ?
                    <div className="divRegistro">
                        <h3>
                            {
                                movimiento.tipoMovimiento == 'TRANSFERENCIA' ? 
                                    movimiento.ubicacionDestinoId == 4 || movimiento.ubicacionDestinoId == 5 ? `${movimiento.cantidad}` : `-${movimiento.cantidad}`
                                : movimiento.tipoMovimiento == 'SALIDA' ?
                                    `-${movimiento.cantidad}` 
                                :movimiento.tipoMovimiento == 'ENTRADA' ?
                                    movimiento.cantidad
                                : null
                            }
                        </h3>
                    </div>

                :
                    <div className="divRegistro">
                        <h3>
                            {
                                movimiento.tipoMovimiento == 'TRANSFERENCIA' ? 
                                    movimiento.ubicacionDestinoId == params.get('who')  ? `${movimiento.cantidad}` : `-${movimiento.cantidad}`
                                : movimiento.tipoMovimiento == 'SALIDA' ?
                                    `-${movimiento.cantidad}` 
                                :movimiento.tipoMovimiento == 'ENTRADA' ?
                                    movimiento.cantidad
                                : null
                            }
                        </h3>
                    </div>
                }
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>{movimiento.tipoMovimiento}</h3>
                </div>
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>{obtenerTextoBodega()}</h3>
                </div>
            </td>
            <td>
                <button className="icono">
                    {
                        movimiento.tipoMovimiento == 'ENTRADA' ?
                            <MdKeyboardDoubleArrowUp className="icon Great" />
                        : movimiento.tipoMovimiento == 'SALIDA' ?
                            <MdKeyboardDoubleArrowDown className="icon Danger" />
                        : movimiento.tipoMovimiento == 'TRANSFERENCIA' ?
                            <MdCompareArrows className="icon "  />
                        : null
                    }
                </button>
            </td>
        </tr>
    )
}