import React, { useState } from 'react';
import axios from 'axios';

export default function TransferirItem({ item, itemData, bodegaId, onVolver, onOperacionExitosa }) {
    const [tipoOperacion, setTipoOperacion] = useState('transferir'); // 'transferir', 'ingresar', 'sacar'
    const [cantidad, setCantidad] = useState('');
    const [bodegaDestino, setBodegaDestino] = useState('');
    const [proyectoDestino, setProyectoDestino] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);

    const cantidadDisponible = itemData?.stocks?.reduce((sum, s) => sum + (s.cantidad || 0), 0) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!cantidad || Number(cantidad) <= 0) {
            alert('Por favor ingresa una cantidad válida');
            return;
        }

        if (tipoOperacion === 'transferir' && !bodegaDestino) {
            alert('Por favor selecciona una bodega de destino');
            return;
        }

        if (tipoOperacion === 'sacar' && Number(cantidad) > cantidadDisponible) {
            alert(`No puedes sacar más de ${cantidadDisponible} unidades disponibles`);
            return;
        }

        try {
            setLoading(true);
            
            // Preparar payload base
            const basePayload = {
                cantidad: Number(cantidad),
                bodegaId: bodegaId,
                tipoMovimiento: tipoOperacion === 'ingresar' ? 'ENTRADA' : (tipoOperacion === 'sacar' ? 'SALIDA' : 'TRANSFERENCIA'),
                referenciaDeDocumento: observaciones || `${tipoOperacion.toUpperCase()} manual`,
                notas: observaciones || null
            };

            // Agregar identificador del item (productoId o materiaPrimaId)
            if (item.productoId) {
                console.log('[TRANSFERIR] Es producto, productoId:', item.productoId);
                basePayload.productoId = item.productoId;
                // Para productos: siempre incluir medida si existe (especialmente importante para mt2)
                if (item.medida) {
                    console.log('[TRANSFERIR] Agregando medida:', item.medida);
                    basePayload.medida = item.medida;
                }
                if (item.unidad) {
                    console.log('[TRANSFERIR] Agregando unidad:', item.unidad);
                    basePayload.unidad = item.unidad;
                }
            } else if (item.materiumId) {
                console.log('[TRANSFERIR] Es materia prima, materiumId:', item.materiumId);
                basePayload.materiaPrimaId = item.materiumId;
                if (item.unidad) basePayload.unidad = item.unidad;
            } else if (item.kitId) {
                console.log('[TRANSFERIR] Es kit, kitId:', item.kitId);
                basePayload.kitId = item.kitId;
            }
            
            console.log('[TRANSFERIR] Item completo:', item);
            console.log('[TRANSFERIR] Payload preparado:', basePayload);
            let response;
            if (tipoOperacion === 'ingresar') {
                // INGRESO: POST /api/stock/ingreso
                response = await axios.post('/api/stock/ingreso', basePayload);
            } else if (tipoOperacion === 'sacar') {
                // SALIDA: POST /api/stock/salida
                basePayload.bodegaDestinoId = bodegaDestino || null;
                response = await axios.post('/api/stock/salida', basePayload);
            } else if (tipoOperacion === 'transferir') {
                // TRANSFERENCIA: Primero salida, luego ingreso en bodega destino
                // 1. Salida de bodega actual
                const salidaPayload = {
                    ...basePayload,
                    bodegaDestinoId: Number(bodegaDestino)
                };
                await axios.post('/api/stock/salida', salidaPayload);
                
                // 2. Ingreso en bodega destino
                const ingresoPayload = {
                    ...basePayload,
                    bodegaId: Number(bodegaDestino),
                    bodegaOrigenId: bodegaId
                };
                response = await axios.post('/api/stock/ingreso', ingresoPayload);
            }

            console.log('[TRANSFERIR] Operación exitosa:', response?.data);
            // alert(`✅ Operación "${tipoOperacion}" realizada con éxito`);
            
            // Notificar a general.tsx para que recargue la tabla silenciosamente
            if (onOperacionExitosa && typeof onOperacionExitosa === 'function') {
                onOperacionExitosa();
            }
            
            // Volver a vista de detalles (que recargará datos en segundo plano)
            onVolver();
        } catch (error) {
            console.error('[TRANSFERIR] Error en operación:', error);
            const errorMsg = error.response?.data?.msg || error.message || 'Error desconocido';
            alert(`❌ Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transferir-container">
            <div className="transferir-header">
                <button className="btn-volver" onClick={onVolver}>
                    ← Volver a detalles
                </button>
                <h3>Gestionar inventario</h3>
            </div>

            <div className="transferir-info-bar">
                <div className="info-item">
                    <span className="info-label">Disponible:</span>
                    <span className="info-value">{cantidadDisponible} {itemData?.meta?.unidad || 'unidades'}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="transferir-form">
                {/* Selector de tipo de operación */}
                <div className="form-group">
                    <label>Tipo de operación</label>
                    <div className="operation-tabs">
                        <button
                            type="button"
                            className={`operation-tab ${tipoOperacion === 'transferir' ? 'active' : ''}`}
                            onClick={() => setTipoOperacion('transferir')}
                        >
                            📦 Transferir
                        </button>
                        <button
                            type="button"
                            className={`operation-tab ${tipoOperacion === 'ingresar' ? 'active' : ''}`}
                            onClick={() => setTipoOperacion('ingresar')}
                        >
                            ➕ Ingresar
                        </button>
                        <button
                            type="button"
                            className={`operation-tab ${tipoOperacion === 'sacar' ? 'active' : ''}`}
                            onClick={() => setTipoOperacion('sacar')}
                        >
                            ➖ Sacar
                        </button>
                    </div>
                </div>

                {/* Campo de cantidad */}
                <div className="form-group">
                    <label>Cantidad {tipoOperacion === 'sacar' ? `(máx: ${cantidadDisponible})` : ''}</label>
                    <input
                        type="number"
                        className="form-input"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="Ej: 10"
                        min="0"
                        max={tipoOperacion === 'sacar' ? cantidadDisponible : undefined}
                        required
                    />
                </div>

                {/* Bodega destino (solo para transferir) */}
                {tipoOperacion === 'transferir' && (
                    <>
                        <div className="form-group">
                            <label>Bodega de destino</label>
                            <select
                                className="form-select"
                                value={bodegaDestino}
                                onChange={(e) => setBodegaDestino(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una bodega</option>
                                {/* Mostrar todas las bodegas excepto la actual */}
                                {bodegaId !== 1 && <option value="1">Bodega Materia Prima</option>}
                                {bodegaId !== 2 && <option value="2">Bodega En Proceso</option>}
                                {bodegaId !== 3 && <option value="3">Bodega Producción</option>}
                                {bodegaId !== 4 && <option value="4">Bodega Producto Terminado</option>}
                            </select>
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                                Actualmente en: <strong>Bodega {bodegaId === 1 ? 'Materia Prima' : bodegaId === 2 ? 'En Proceso' : bodegaId === 3 ? 'Producción' : 'Producto Terminado'}</strong>
                            </div>
                        </div>
                    </>
                )}

                {/* Observaciones */}
                <div className="form-group">
                    <label>Observaciones (opcional)</label>
                    <textarea
                        className="form-textarea"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Agrega notas o comentarios sobre esta operación"
                        rows="3"
                    />
                </div>

                {/* Botón de envío */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onVolver}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : `Confirmar ${tipoOperacion}`}
                    </button>
                </div>
            </form>
        </div>
    );
}
