import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ItemOrdenMP({ item, ordenId, comprasCotizacionId }) {
    const dispatch = useDispatch();
    const [loadingIngreso, setLoadingIngreso] = useState(false);
    const [loadingProduccion, setLoadingProduccion] = useState(false);

    const handleIngresarAlmacen = async () => {
        if (loadingIngreso) return;

        setLoadingIngreso(true);

        try {
            const payload = {
                cantidad: parseFloat(item.cantidad),
                materiumId: item.materiumId,
                medida: item.materium?.medida || '',
                unidad: item.materium?.unidad || '',
                bodegaId: 1, // Materia Prima = bodega 1
                tipoMovimiento: 'ENTRADA',
                referenciaDeDocumento: `OC-${ordenId}`,
                notas: 'Ingreso desde orden de compra',
                bodegaOrigenId: null,
                comprasCotizacionId: comprasCotizacionId,
                comprasCotizacionItemId: item.id
            };

            const response = await axios.post('/api/stock/ingreso', payload);


            // Recargar la orden de compra silenciosamente (false = sin loading)
            dispatch(actions.axiosToGetOrdenAlmacen(false, ordenId));
            dispatch(actions.HandleAlerta('Ingreso exitoso', 'positive'));

        } catch (error) {
            console.error('[INGRESO_MP] Error al ingresar:', error);
            dispatch(actions.HandleAlerta('Error al ingresar el material al almacén', 'mistake'));
        } finally {
            setLoadingIngreso(false);
        }
    };

    const handleEnviarProduccion = async () => {
        if (loadingProduccion) return;

        setLoadingProduccion(true);

        try {
            const payload = {
                comprasCotizacionItemId: item.id
            };

            const response = await axios.post('/api/stock/transferir-item', payload);

            // Recargar la orden de compra silenciosamente (false = sin loading)
            dispatch(actions.axiosToGetOrdenAlmacen(false, ordenId));
            dispatch(actions.HandleAlerta('Enviado a producción exitosamente', 'positive'));

        } catch (error) {
            console.error('[ENVIAR_PRODUCCION_MP] Error:', error);
            dispatch(actions.HandleAlerta('Error al enviar a producción', 'mistake'));
        } finally {
            setLoadingProduccion(false);
        }
    };

    return (
        <tr>
            <td className="productCode">{item?.materiumId}</td>
            <td className="productName">
                {item?.materium?.description} <br />
                <span>Material</span>

                </td>
            <td className="productQuantity">{item?.cantidad}</td>
            <td className="productMeasure">{item?.materium?.medida} {item?.materium?.unidad}</td>
            <td className="productActions">
                {
                    item?.estado == 'entregado' || item?.estado == 'Produccion' ? (
                        <span style={{ color: '#2ecc71' }}>Ingresado</span>
                    ) : (
                        <button 
                            onClick={handleIngresarAlmacen}
                            disabled={loadingIngreso}
                            style={{ 
                                opacity: loadingIngreso ? 0.6 : 1,
                                cursor: loadingIngreso ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span>{loadingIngreso ? 'Ingresando...' : 'Ingresar al almacén'}</span>
                        </button>
                    )
                }
            </td>
            <td className="productActions">
                {
                    item?.materium?.unidad == 'mt2' || item.materium?.unidad == 'mt' ? 
                    ( <span>—</span> ) : (
                        item?.estado == 'entregado' || item?.estado == 'Entregado' ? (
                            <button
                                onClick={handleEnviarProduccion}
                                disabled={loadingProduccion}
                                style={{ 
                                    opacity: loadingProduccion ? 0.6 : 1,
                                    cursor: loadingProduccion ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <span>{loadingProduccion ? 'Enviando...' : 'Enviar a producción'}</span>
                            </button>
                        ) : item?.estado == 'Produccion' ? (
                            <span style={{ color: '#2ecc71' }}>Entregado</span>
                        ) : (
                            <span></span>
                        )
                    )
                }
            </td>
        </tr>
    )
}