import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DetallesItem from './detallesItem';
import MovimientosItem from './movimientosItem';
import TransferirItem from './transferirItem';
import './itemModal.css';

export default function ItemModal({ item, bodegaId, onClose, onOperacionExitosa }) {
    console.log('[ItemModal] mount', { item, bodegaId });
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vistaActual, setVistaActual] = useState('detalles'); // 'detalles', 'transferir'
    const [movimientosPage, setMovimientosPage] = useState(1);
    const movimientosLimit = 20;

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

    // Cargar datos del item desde la API
    useEffect(() => {
        loadItemData();
    }, [item, bodegaId]);

    const loadItemData = async () => {
        try {
            setLoading(true);
            console.log('[ItemModal] loadItemData params will be set for API call', { item, bodegaId });
            
            // Determinar qué parámetro enviar según el tipo
            const params = {
                ubicacionId: bodegaId,
                limit: movimientosLimit
            };

            if (item.productoId) {
                params.productoId = item.productoId;
                if (item.medida) params.medida = item.medida;
            } else if (item.materiumId) {
                params.materiaPrimaId = item.materiumId;
            } else if (item.kitId) {
                params.kitId = item.kitId;
            }

            // Llamada a la API real
            try {
                const response = await axios.get('/api/stock/item', { params });
                if (response && response.data) {
                    setItemData(response.data);
                    setLoading(false);
                    return;
                }
                console.warn('[ItemModal] API /api/stock/item no retornó data, usando fallback mock');
            } catch (err) {
                console.error('[ItemModal] Error llamando a /api/stock/item:', err);
            }

            // Fallback - datos mock si la API falla o retorna vacío
            const mockData = {
                ok: true,
                meta: {
                    id: item.itemId || item.productoId || item.materiumId,
                    item: item.nombre,
                    description: item.nombre,
                    unidad: item.unidad || 'unidad',
                    medida: item.medida || null,
                    maker: 'Maker ejemplo',
                    trademark: 'Trademark ejemplo'
                },
                stocks: [
                    {
                        id: 1,
                        cantidad: item.cantidad || 0,
                        ubicacionId: bodegaId,
                        medida: item.medida,
                        unidad: item.unidad || 'unidad',
                        updatedAt: item.updatedAt || new Date().toISOString()
                    }
                ],
                movimientos: [
                    {
                        id: 1,
                        cantidad: 50,
                        tipoMovimiento: 'ENTRADA',
                        bodegaOrigenId: null,
                        bodegaDestinoId: bodegaId,
                        refDoc: 'OC-123',
                        createdAt: '2026-02-10T10:00:00Z'
                    },
                    {
                        id: 2,
                        cantidad: 20,
                        tipoMovimiento: 'SALIDA',
                        bodegaOrigenId: bodegaId,
                        bodegaDestinoId: 2,
                        refDoc: 'TRANSFER-456',
                        cotizacionId: 1,
                        createdAt: '2026-02-12T14:30:00Z'
                    },
                    {
                        id: 3,
                        cantidad: 30,
                        tipoMovimiento: 'TRANSFERENCIA',
                        bodegaOrigenId: bodegaId,
                        bodegaDestinoId: 3,
                        refDoc: 'Proyecto ABC',
                        cotizacionId: 2,
                        createdAt: '2026-02-14T09:15:00Z'
                    }
                ]
            };
            setItemData(mockData);
            setLoading(false);

        } catch (error) {
            console.error('Error cargando datos del item:', error);
            setLoading(false);
        }
    };

    const cantidadTotal = itemData?.stocks?.reduce((sum, s) => sum + (s.cantidad || 0), 0) || 0;

    const handleTransferirClick = () => {
        setVistaActual('transferir');
    };

    const handleVolverDetalles = () => {
        setVistaActual('detalles');
        // Recargar datos en segundo plano SIN mostrar loading
        loadItemDataSilent();
    };
    
    // Nueva función para recargar datos sin loading visible
    const loadItemDataSilent = async () => {
        try {
            console.log('[ItemModal] Recargando datos en segundo plano (silencioso)...');
            
            const params = {
                ubicacionId: bodegaId,
                limit: movimientosLimit
            };

            if (item.productoId) {
                params.productoId = item.productoId;
                if (item.medida) params.medida = item.medida;
            } else if (item.materiumId) {
                params.materiaPrimaId = item.materiumId;
            } else if (item.kitId) {
                params.kitId = item.kitId;
            }

            const response = await axios.get('/api/stock/item', { params });
            console.log('[ItemModal] Datos actualizados en segundo plano:', response.data);
            setItemData(response.data);
        } catch (error) {
            console.error('[ItemModal] Error recargando datos en segundo plano:', error);
            // No mostrar error al usuario, es una recarga silenciosa
        }
    };
    
    function obtenerMedidaVisible() {
        // Priorizar medida del registro (stocks) si la unidad es 'mt2' (o startsWith 'mt')
        try {
            const stocks = itemData?.stocks || [];
            if (stocks.length > 0) {
                const registro = stocks[0];
                const unidadRegistro = String(registro.unidad || '').toLowerCase().trim();
                if (unidadRegistro === 'mt2' || unidadRegistro.startsWith('mt')) {
                    if (registro.medida) return registro.medida;
                } else {
                    console.log('no es metro cuadrado');
                    console.log('ItemData', itemData)
                    console.log(itemData?.meta?.medida);
                    // No es metro cuadrado: obtener medida desde el objeto meta del JSON
                    return itemData?.meta?.medida || '';
                }
            }
            // fallback: usar medida desde meta
            if (itemData?.meta?.medida) return itemData.meta.medida;
            return '';
        } catch (e) {
            return itemData?.meta?.medida || '';
        }
    }

    return (
        <div className="item-modal-overlay" onClick={onClose}>
            <div className="item-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header con X para cerrar */}
                <div className="item-modal-header">
                    <div className="item-modal-header-content">
                        <div className="item-modal-icon">
                            {item.itemId || item.id}
                        </div>
                        <div className="item-modal-title-group">
                            <h2 className="item-modal-title">{item.nombre}</h2>
                            <span className="item-modal-subtitle">
                                {item.tipo === 'MP' ? 'Materia Prima' : 'Producto Terminado'}
                                {item.medida && ` | ${item.medida} ${item.unidad}`}
                            </span>
                        </div>
                    </div>
                    <button className="item-modal-close" onClick={onClose} title="Cerrar (Esc)">
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="item-modal-loading">
                        <div className="spinner"></div>
                        <p>Cargando información del item...</p>
                    </div>
                ) : vistaActual === 'transferir' ? (
                    <TransferirItem 
                        item={item}
                        itemData={itemData}
                        bodegaId={bodegaId}
                        onVolver={handleVolverDetalles}
                        onOperacionExitosa={onOperacionExitosa}
                    />
                ) : (
                    <div className="item-modal-content">
                        {/* Sección de cantidad total */}
                        <div className="item-modal-stats">
                            <div className="item-stat-card">
                                <h1>{Number(cantidadTotal) === 0 ? '—' : Number(cantidadTotal).toLocaleString('es-ES')}</h1>
                                <span>Cantidad Total</span>
                            </div>
                            <div className="item-stat-card">
                                <h1>
                                    {obtenerMedidaVisible()}
                                    <span className="stat-unit">{itemData?.meta?.unidad || 'unidad'}</span>
                                </h1>
                                <span>Medida</span>
                            </div>
                        </div>

                        {/* Detalles del producto */}
                        <DetallesItem itemData={itemData} />
                        {/* Botón de transferir */}
                        <div className="item-modal-actions" style={{ marginTop: 10 }}>
                            <button className="btn-transferir" onClick={handleTransferirClick}>
                                <span>📦</span>
                                Transferir / Ingresar / Sacar
                            </button>
                        </div>
                        {/* Sección de Proyectos Pendientes (placeholder) */}
                        <div className="item-section">
                            <div className="item-section-header">
                                <h3>Proyectos pendientes</h3>
                                <button className="btn-action-secondary">+ Ver todos</button>
                            </div>
                            <div className="proyectos-placeholder">
                                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                    Proyectos que necesitan este item (próximamente)
                                </p>
                            </div>
                        </div>

                        

                        {/* Movimientos */}
                        <MovimientosItem 
                            movimientos={itemData?.movimientos || []}
                            page={movimientosPage}
                            limit={movimientosLimit}
                            onPageChange={setMovimientosPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
