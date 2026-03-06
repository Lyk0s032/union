import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import '../../bodegas/item/itemModal.css';

/**
 * Fila de la tabla (tr/td) que muestra la información del TR (item de necesidad del proyecto).
 * Se usa dentro del tbody de la tabla en proyecto.jsx
 */
export default function ItemNecesidadProyecto({ itemNecesidad, cotizacionId, requisicionId, onUpdate }) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [valorEditado, setValorEditado] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [loadingItemData, setLoadingItemData] = useState(false);

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
                        <h3 
                            style={{ 
                                fontSize: '12px',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textDecorationStyle: 'dotted',
                                color: '#2f8bfd'
                            }}
                            onClick={() => setShowTransferModal(true)}
                            title="Click para transferir materia prima / producto desde bodega"
                        >
                            {nombreItem}
                        </h3>
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
            {showTransferModal && (
                <TransferirItemModal
                    itemNecesidad={itemNecesidad}
                    cotizacionId={cotizacionId}
                    requisicionId={requisicionId}
                    onClose={() => setShowTransferModal(false)}
                    onUpdate={onUpdate}
                />
            )}
        </tr>
    );
}

/**
 * Modal para transferir materia prima desde bodega MP al proyecto
 */
function TransferirItemModal({ itemNecesidad, cotizacionId, requisicionId, onClose, onUpdate }) {
    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [loadingItemData, setLoadingItemData] = useState(true);

    // Determinar identificadores del item
    const materiaId = itemNecesidad.materiumId || itemNecesidad.materiaId || itemNecesidad.materium?.id;
    const productoId = itemNecesidad.productoId || itemNecesidad.producto?.id;
    const kitId = itemNecesidad.kitId || itemNecesidad.kit?.id;
    const medida = itemNecesidad.medida;
    const unidad =
        itemNecesidad.materium?.unidad ||
        itemNecesidad.producto?.unidad ||
        itemNecesidad.unidad ||
        'unidad';

    // Cargar datos del item desde la bodega de MP (bodegaId = 1)
    useEffect(() => {
        const loadItemData = async () => {
            try {
                setLoadingItemData(true);
                const params = {
                    ubicacionId: 1, // Bodega Materia Prima
                    limit: 20,
                };

                if (productoId) {
                    params.productoId = productoId;
                    if (medida) params.medida = medida;
                } else if (materiaId) {
                    params.materiaPrimaId = materiaId;
                } else if (kitId) {
                    params.kitId = kitId;
                }

                const response = await axios.get('/api/stock/item', { params });
                if (response && response.data) {
                    setItemData(response.data);
                }
            } catch (error) {
                console.error('Error cargando datos del item:', error);
            } finally {
                setLoadingItemData(false);
            }
        };

        // Siempre que se monta el modal o cambian los IDs, cargamos la info
        loadItemData();
    }, [materiaId, productoId, kitId, medida]);

    const cantidadDisponible =
        itemData?.stocks?.reduce((sum, s) => sum + (s.cantidad || 0), 0) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cantidad || Number(cantidad) <= 0) {
            dispatch(actions.HandleAlerta('Por favor ingresa una cantidad válida', 'mistake'));
            return;
        }

        if (Number(cantidad) > cantidadDisponible) {
            dispatch(
                actions.HandleAlerta(
                    `No puedes transferir más de ${cantidadDisponible} unidades disponibles`,
                    'mistake'
                )
            );
            return;
        }

        try {
            setLoading(true);

            const reqId = requisicionId || itemNecesidad.requisicionId;
            const cantidadAEnviar = Number(cantidad);

            // Preparar params según el tipo de item
            const params = {
                requisicionId: reqId,
                cantidad: cantidadAEnviar,
            };

            // Si es materia prima
            if (materiaId) {
                params.materiaId = materiaId;
                await axios.get('/api/inventario/transfer/materia/proyecto/', { params });
            }
            // Si es producto terminado
            else if (productoId) {
                params.productoId = productoId;
                // Medida es OBLIGATORIA para productos terminados
                if (medida) {
                    params.medida = medida;
                } else {
                    dispatch(
                        actions.HandleAlerta(
                            'Error: El producto terminado requiere medida',
                            'mistake'
                        )
                    );
                    setLoading(false);
                    return;
                }
                await axios.get('/api/inventario/transfer/materia/proyecto/', { params });
            }
            // Si es kit (usar materiaId si existe)
            else if (kitId) {
                // Para kits, usar materiaId si está disponible
                if (materiaId) {
                    params.materiaId = materiaId;
                    await axios.get('/api/inventario/transfer/materia/proyecto/', { params });
                } else {
                    dispatch(
                        actions.HandleAlerta(
                            'Error: No se pudo identificar el tipo de item',
                            'mistake'
                        )
                    );
                    setLoading(false);
                    return;
                }
            } else {
                dispatch(
                    actions.HandleAlerta('Error: No se pudo identificar el tipo de item', 'mistake')
                );
                setLoading(false);
                return;
            }

            dispatch(actions.HandleAlerta('Transferencia realizada con éxito', 'positive'));

            // Recargar datos del proyecto silenciosamente (sin que el usuario lo perciba)
            if (onUpdate) {
                onUpdate();
            }

            onClose();
        } catch (error) {
            console.error('Error en transferencia:', error);
            const errorMsg = error.response?.data?.msg || error.message || 'Error desconocido';
            dispatch(actions.HandleAlerta(`Error: ${errorMsg}`, 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="item-modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div
                className="item-modal-container"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '600px' }}
            >
                <div className="item-modal-header">
                    <div className="item-modal-header-content">
                        <h2 className="item-modal-title">Transferir al Proyecto</h2>
                        <span className="item-modal-subtitle">
                            {itemNecesidad.materium?.description ||
                                itemNecesidad.producto?.item ||
                                'Item'}
                        </span>
                    </div>
                    <button className="item-modal-close" onClick={onClose} title="Cerrar (Esc)">
                        ✕
                    </button>
                </div>

                <div className="item-modal-content">
                    {loadingItemData ? (
                        <div className="item-modal-loading">
                            <div className="spinner"></div>
                            <p>Cargando información del item...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="transferir-form">
                            <div className="transferir-info-bar" style={{ marginBottom: '20px' }}>
                                <div className="info-item">
                                    <span className="info-label">Disponible en Bodega MP:</span>
                                    <span className="info-value">
                                        {cantidadDisponible.toLocaleString('es-ES')} {unidad}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Cantidad a transferir (máx: {cantidadDisponible})</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    placeholder="Ej: 10"
                                    min="0"
                                    max={cantidadDisponible}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Observaciones (opcional)</label>
                                <textarea
                                    className="form-textarea"
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    placeholder="Agrega notas sobre esta transferencia"
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading || cantidadDisponible === 0}
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Transferencia'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}