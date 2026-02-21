import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductoTerminadoStock({ productoId, cantidad = 1, ubicacionId = 5 }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productoId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    `/api/inventario/get/producto-terminado-stock/?productoId=${productoId}&cantidad=${cantidad}&ubicacionId=${ubicacionId}`
                );
                setData(response.data);
            } catch (err) {
                console.error('Error al obtener información de producto terminado:', err);
                setError(err.response?.data?.msg || 'Error al cargar información');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productoId, cantidad, ubicacionId]);

    if (loading) {
        return (
            <div className="productoTerminadoStock">
                <div className="loading">Cargando información de producto terminado...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="productoTerminadoStock">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    if (!data || !data.producto) {
        return (
            <div className="productoTerminadoStock">
                <div className="no-data">No se encontró información para este producto</div>
            </div>
        );
    }

    const producto = data.producto;

    return (
        <div className="productoTerminadoStock">
            <div className="headerProductoTerminado">
                <h4>Producto Terminado - Stock Disponible</h4>
                <div className={`badge ${producto.tieneStockSuficiente ? 'success' : 'warning'}`}>
                    {producto.tieneStockSuficiente ? 'Stock Completo' : 'Falta Stock'}
                </div>
            </div>
            
            <div className="resumenProductoTerminado">
                <span>
                    {producto.tieneStockSuficiente ? 'Stock suficiente' : 'Stock insuficiente'}
                </span>
            </div>

            <div className="infoProductoTerminado">
                <div className={`itemProductoTerminado ${producto.tieneStockSuficiente ? 'disponible' : 'falta'}`}>
                    <div className="infoProducto">
                        <div className="nombreProducto">
                            <strong>{producto.item || `Producto ID: ${producto.productoId}`}</strong>
                            {producto.medida && <span className="medida">{producto.medida}</span>}
                        </div>
                        <div className="detallesProducto">
                            <span className="unidad">{producto.unidad}</span>
                        </div>
                    </div>
                    
                    <div className="cantidadesProducto">
                        <div className="cantidadItem">
                            <span className="label">Necesario:</span>
                            <span className="valor">
                                {Number(producto.cantidadNecesaria || 0).toFixed(2)} <span className="unidad-texto">{producto.unidad || ''}</span>
                            </span>
                        </div>
                        <div className="cantidadItem">
                            <span className="label">Disponible (Bodega 5):</span>
                            <span className={`valor ${producto.tieneStockSuficiente ? 'success' : 'warning'}`}>
                                {Number(producto.stockDisponible || 0).toFixed(2)} <span className="unidad-texto">{producto.unidad || ''}</span>
                            </span>
                        </div>
                        {producto.stockDisponibleBodega2 > 0 && !producto.tieneStockSuficiente && (
                            <div className="cantidadItem info">
                                <span className="label">Disponible (Bodega 2):</span>
                                <span className="valor info-text">
                                    {Number(producto.stockDisponibleBodega2 || 0).toFixed(2)} <span className="unidad-texto">{producto.unidad || ''}</span>
                                    {!producto.tieneStockSuficiente && (
                                        <span className="transferir-texto"> - Transferir a Bodega 5 para usar</span>
                                    )}
                                </span>
                            </div>
                        )}
                        {!producto.tieneStockSuficiente && (
                            <div className="cantidadItem falta">
                                <span className="label">Falta:</span>
                                <span className="valor error">
                                    {Number(producto.cantidadFalta || 0).toFixed(2)} <span className="unidad-texto">{producto.unidad || ''}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="estadoProducto">
                        {producto.tieneStockSuficiente ? (
                            <span className="estado success">✓ Disponible</span>
                        ) : (
                            <span className="estado error">✗ Insuficiente</span>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .productoTerminadoStock {
                    margin-top: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .headerProductoTerminado {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .headerProductoTerminado h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .badge.success {
                    background: #d4edda;
                    color: #155724;
                }

                .badge.warning {
                    background: #fff3cd;
                    color: #856404;
                }

                .resumenProductoTerminado {
                    margin-bottom: 15px;
                    font-size: 14px;
                    color: #666;
                }

                .infoProductoTerminado {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .itemProductoTerminado {
                    background: white;
                    padding: 12px;
                    border-radius: 6px;
                    border-left: 4px solid #ddd;
                }

                .itemProductoTerminado.disponible {
                    border-left-color: #28a745;
                }

                .itemProductoTerminado.falta {
                    border-left-color: #dc3545;
                }

                .infoProducto {
                    margin-bottom: 10px;
                }

                .nombreProducto {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }

                .nombreProducto strong {
                    font-size: 14px;
                }

                .medida {
                    font-size: 12px;
                    color: #666;
                    background: #e9ecef;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .detallesProducto {
                    font-size: 12px;
                    color: #999;
                }

                .cantidadesProducto {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .cantidadItem {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                }

                .cantidadItem.falta {
                    grid-column: 1 / -1;
                    padding-top: 8px;
                    border-top: 1px solid #eee;
                }

                .label {
                    color: #666;
                }

                .valor {
                    font-weight: 600;
                }

                .valor.success {
                    color: #28a745;
                }

                .valor.warning {
                    color: #ffc107;
                }

                .valor.error {
                    color: #dc3545;
                }

                .cantidadItem.info {
                    grid-column: 1 / -1;
                    padding-top: 4px;
                    font-size: 12px;
                }

                .valor.info-text {
                    color: #17a2b8;
                    font-weight: 500;
                }

                .unidad-texto {
                    font-size: 11px;
                    color: #999;
                    font-weight: 400;
                    margin-left: 2px;
                }

                .transferir-texto {
                    font-size: 11px;
                    color: #856404;
                    font-weight: 500;
                    margin-left: 4px;
                }

                .estadoProducto {
                    text-align: right;
                }

                .estado {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .estado.success {
                    background: #d4edda;
                    color: #155724;
                }

                .estado.error {
                    background: #f8d7da;
                    color: #721c24;
                }

                .loading, .error, .no-data {
                    padding: 15px;
                    text-align: center;
                    color: #666;
                }

                .error {
                    color: #dc3545;
                }
            `}</style>
        </div>
    );
}
