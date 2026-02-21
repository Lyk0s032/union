import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MateriaPrimaStock({ kitId, cantidad = 1, ubicacionId = 4 }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!kitId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    `/api/inventario/get/kit/materia-prima-stock/?kitId=${kitId}&cantidad=${cantidad}&ubicacionId=${ubicacionId}`
                );
                setData(response.data);
            } catch (err) {
                console.error('Error al obtener información de materia prima:', err);
                setError(err.response?.data?.msg || 'Error al cargar información');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [kitId, cantidad, ubicacionId]);

    if (loading) {
        return (
            <div className="materiaPrimaStock">
                <div className="loading">Cargando información de materia prima...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="materiaPrimaStock">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    if (!data || !data.materiaPrima || data.materiaPrima.length === 0) {
        return (
            <div className="materiaPrimaStock">
                <div className="no-data">No se encontró materia prima para este kit</div>
            </div>
        );
    }

    return (
        <div className="materiaPrimaStock">
            <div className="headerMateriaPrima">
                <h4>Materia Prima Necesaria</h4>
                <div className={`badge ${data.resumen.tieneTodoElStock ? 'success' : 'warning'}`}>
                    {data.resumen.tieneTodoElStock ? 'Stock Completo' : 'Falta Material'}
                </div>
            </div>
            
            <div className="resumenMateriaPrima">
                <span>
                    {data.resumen.materiasConStockSuficiente} / {data.resumen.totalMaterias} materiales disponibles
                </span>
            </div>

            <div className="listaMateriaPrima">
                {data.materiaPrima.map((materia, index) => (
                    <div 
                        key={materia.materiaId || index} 
                        className={`itemMateriaPrima ${materia.tieneStockSuficiente ? 'disponible' : 'falta'}`}
                    >
                        <div className="infoMateria">
                            <div className="nombreMateria">
                                <strong>{materia.item || `Materia ID: ${materia.materiaId}`}</strong>
                                {materia.medida && <span className="medida">{materia.medida}</span>}
                            </div>
                            <div className="detallesMateria">
                                <span className="unidad">{materia.unidad}</span>
                            </div>
                        </div>
                        
                        <div className="cantidadesMateria">
                            <div className="cantidadItem">
                                <span className="label">Por 1 kit:</span>
                                <span className="valor">
                                    {Number(materia.cantidadPorKit || 0).toFixed(2)} <span className="unidad-texto">{materia.unidad || ''}</span>
                                </span>
                            </div>
                            <div className="cantidadItem">
                                <span className="label">Necesario ({cantidad} kits):</span>
                                <span className="valor">
                                    {Number(materia.cantidadNecesaria || 0).toFixed(2)} <span className="unidad-texto">{materia.unidad || ''}</span>
                                </span>
                            </div>
                            <div className="cantidadItem">
                                <span className="label">Disponible (Bodega 4):</span>
                                <span className={`valor ${materia.tieneStockSuficiente ? 'success' : 'warning'}`}>
                                    {Number(materia.stockDisponible || 0).toFixed(2)} <span className="unidad-texto">{materia.unidad || ''}</span>
                                </span>
                            </div>
                            {materia.stockDisponibleBodega1 > 0 && (
                                <div className="cantidadItem info">
                                    <span className="label">Disponible (Bodega 1):</span>
                                    <span className="valor info-text">
                                        {Number(materia.stockDisponibleBodega1 || 0).toFixed(2)} <span className="unidad-texto">{materia.unidad || ''}</span>
                                        {!materia.tieneStockSuficiente && (
                                            <span className="transferir-texto"> - Transferir a Bodega 4 para usar</span>
                                        )}
                                    </span>
                                </div>
                            )}
                            {!materia.tieneStockSuficiente && (
                                <div className="cantidadItem falta">
                                    <span className="label">Falta:</span>
                                    <span className="valor error">
                                        {Number(materia.cantidadFalta || 0).toFixed(2)} <span className="unidad-texto">{materia.unidad || ''}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="estadoMateria">
                            {materia.tieneStockSuficiente ? (
                                <span className="estado success">✓ Disponible</span>
                            ) : (
                                <span className="estado error">✗ Insuficiente</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .materiaPrimaStock {
                    margin-top: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .headerMateriaPrima {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .headerMateriaPrima h4 {
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

                .resumenMateriaPrima {
                    margin-bottom: 15px;
                    font-size: 14px;
                    color: #666;
                }

                .listaMateriaPrima {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .itemMateriaPrima {
                    background: white;
                    padding: 12px;
                    border-radius: 6px;
                    border-left: 4px solid #ddd;
                }

                .itemMateriaPrima.disponible {
                    border-left-color: #28a745;
                }

                .itemMateriaPrima.falta {
                    border-left-color: #dc3545;
                }

                .infoMateria {
                    margin-bottom: 10px;
                }

                .nombreMateria {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }

                .nombreMateria strong {
                    font-size: 14px;
                }

                .medida {
                    font-size: 12px;
                    color: #666;
                    background: #e9ecef;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .detallesMateria {
                    font-size: 12px;
                    color: #999;
                }

                .cantidadesMateria {
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

                .estadoMateria {
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
