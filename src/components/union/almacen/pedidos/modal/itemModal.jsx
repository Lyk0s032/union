import React, { useState } from 'react';
import axios from 'axios';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';

/**
 * Fila de la tabla (tr/td) que muestra la información del TR (item de necesidad del proyecto).
 * Se usa dentro del tbody de la tabla en proyecto.jsx
 */
export default function ItemNecesidadProyecto({ itemNecesidad, cotizacionId, requisicionId, onUpdate }) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [valorEditado, setValorEditado] = useState('');
    const [loading, setLoading] = useState(false);

    if (!itemNecesidad) return null;

    // Determinar nombre del item
    const nombreItem =
        itemNecesidad.materium?.description ||
        itemNecesidad.materium?.item ||
        itemNecesidad.kit?.name ||
        itemNecesidad.producto?.item ||
        itemNecesidad.nombre ||
        itemNecesidad.descripcion ||
        'Item';

    // Determinar ID del item
    const idItem =
        itemNecesidad.materium?.id ||
        itemNecesidad.materiaId ||
        itemNecesidad.materiaPrimaId ||
        itemNecesidad.kit?.id ||
        itemNecesidad.kitId ||
        itemNecesidad.producto?.id ||
        itemNecesidad.productoId ||
        itemNecesidad.id ||
        '—';

    // Determinar tipo
    const tipo = itemNecesidad.materium
        ? 'Materia Prima'
        : itemNecesidad.kit
            ? 'Kit'
            : itemNecesidad.producto
                ? 'Producto Terminado'
                : 'Item';

    // Unidad
    const unidad =
        itemNecesidad.materium?.unidad ||
        itemNecesidad.kit?.unidad ||
        itemNecesidad.producto?.unidad ||
        itemNecesidad.unidad ||
        'unidad';

    // Cantidades
    const comprometida = Number(itemNecesidad.cantidadComprometida || 0);
    const entregada = Number(itemNecesidad.cantidadEntregada || 0);
    
    // Calcular porcentaje
    const porcentaje = comprometida > 0 
        ? Number((entregada / comprometida) * 100).toFixed(0) 
        : 0;

    const handleClickEntregado = () => {
        setIsEditing(true);
        setValorEditado(String(entregada));
    };

    const handleBlur = async () => {
        if (loading) return;
        
        const nuevoValor = Number(valorEditado);
        if (isNaN(nuevoValor) || nuevoValor < 0) {
            setIsEditing(false);
            setValorEditado('');
            return;
        }

        // Si el valor no cambió, solo cerrar edición
        if (nuevoValor === entregada) {
            setIsEditing(false);
            setValorEditado('');
            return;
        }

        setLoading(true);
        try {
            // Construir el body para actualizar
            const body = {
                cotizacionId: cotizacionId || itemNecesidad.cotizacionId,
                requisicionId: requisicionId || itemNecesidad.requisicionId,
                cantidadEntregada: nuevoValor, // Nuevo valor total (no incremento)
            };

            // Identificar el material según el tipo
            if (itemNecesidad.kitId || itemNecesidad.kit?.id) {
                body.kitId = itemNecesidad.kitId || itemNecesidad.kit?.id;
            } else if (itemNecesidad.productoId || itemNecesidad.producto?.id) {
                body.productoId = itemNecesidad.productoId || itemNecesidad.producto?.id;
            } else if (itemNecesidad.materiumId || itemNecesidad.materiaId || itemNecesidad.materium?.id) {
                body.materiaId = itemNecesidad.materiumId || itemNecesidad.materiaId || itemNecesidad.materium?.id;
            }

            // Incluir medida si existe
            if (itemNecesidad.medida) {
                body.medida = itemNecesidad.medida;
            }

            console.log('📦 Actualizando cantidadEntregada con:', body);

            const response = await axios.put('/api/requisicion/put/update/compromisoCotizacion', body);
            console.log('✅ Cantidad actualizada exitosamente:', response.data);

            dispatch(actions.HandleAlerta('Cantidad entregada actualizada correctamente', 'positive'));

            // Recargar el proyecto si hay callback
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('❌ Error al actualizar cantidadEntregada:', error);
            dispatch(actions.HandleAlerta('Error al actualizar la cantidad entregada', 'mistake'));
        } finally {
            setLoading(false);
            setIsEditing(false);
            setValorEditado('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setValorEditado('');
        }
    };

    return (
        <tr>
            <td className="longer">
                <div className="nameLonger">
                    <div className="letter">
                        <h3 style={{ fontSize: '12px' }}>{idItem}</h3>
                    </div>
                    <div className="name">
                        <h3 style={{ fontSize: '12px' }}>{nombreItem}</h3>
                        <span style={{ fontSize: '12px' }}>{tipo}</span>
                        {itemNecesidad.medida && (
                            <>
                                {' '}
                                - <span>{itemNecesidad.medida} {unidad}</span>
                            </>
                        )}
                    </div>
                </div>
            </td>
            <td
                onClick={handleClickEntregado}
                style={{
                    cursor: loading ? 'not-allowed' : 'pointer',
                    position: 'relative'
                }}
            >
                {isEditing ? (
                    <input
                        type="number"
                        value={valorEditado}
                        onChange={(e) => setValorEditado(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '4px 8px',
                            border: '1px solid #2f8bfd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                        }}
                        min="0"
                        step="0.01"
                    />
                ) : (
                    <span style={{
                        textDecoration: 'underline',
                        color: '#2f8bfd',
                        fontWeight: '500'
                    }}>
                        {loading ? 'Actualizando...' : entregada.toLocaleString('es-ES')}
                    </span>
                )}
            </td>
            <td>
                <span>{comprometida.toLocaleString('es-ES')}</span>
            </td>
            <td>
                <span>{porcentaje}%</span>
            </td>
        </tr>
    );
}

