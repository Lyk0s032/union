import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';
import { isServicioLibreItem } from '../../../compras/utils/comprasCotizacionItemUtils';

export default function ItemOrdenMP({ item, ordenId, comprasCotizacionId }) {
    const dispatch = useDispatch();
    const [loadingIngreso, setLoadingIngreso] = useState(false);
    const [loadingProduccion, setLoadingProduccion] = useState(false);

    if (isServicioLibreItem(item)) return null;

    // Detectar si es consumible por categoriumId = 15
    const esConsumible = item?.materium?.categoriumId === 15;
    const bodegaDestino = esConsumible ? 3 : 1;
    const nombreItem = esConsumible
        ? (item?.materium?.item || item?.materium?.description)
        : (item?.materium?.description || item?.materium?.item);

    const handleIngresarAlmacen = async () => {
        if (loadingIngreso) return;

        setLoadingIngreso(true);

        try {
            const payload = {
                cantidad: parseFloat(item.cantidad),
                materiumId: item.materiumId,
                medida: item.materium?.medida || '',
                unidad: item.materium?.unidad || '',
                bodegaId: bodegaDestino,
                tipoMovimiento: 'ENTRADA',
                referenciaDeDocumento: `OC-${ordenId}`,
                notas: esConsumible ? 'Ingreso consumible desde orden de compra' : 'Ingreso desde orden de compra',
                bodegaOrigenId: null,
                comprasCotizacionId: comprasCotizacionId,
                comprasCotizacionItemId: item.id
            };

            const response = await axios.post('/api/stock/ingreso', payload);

            console.log('response', response.data);
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


    console.log('item de orden de compra', item);
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
                {nombreItem} <br />
                <span style={esConsumible ? { color: '#7c3aed', fontWeight: 600 } : {}}>
                    {esConsumible ? 'Consumible' : 'Material'}
                </span>
            </td>
            <td className="productQuantity">{item?.cantidad}</td>
            <td className="productMeasure">{item?.materium?.medida} {item?.materium?.unidad}</td>
            <td className="productActions">
                {
                    item?.estado == 'entregado' || item?.estado == 'Produccion' ? (
                        <span style={{ color: '#2ecc71' }}>
                            {esConsumible ? `Ingresado → Bodega Consumibles` : 'Ingresado'}
                        </span>
                    ) : (
                        <button 
                            onClick={handleIngresarAlmacen}
                            disabled={loadingIngreso}
                            style={{ 
                                opacity: loadingIngreso ? 0.6 : 1,
                                cursor: loadingIngreso ? 'not-allowed' : 'pointer',
                                ...(esConsumible ? { borderColor: '#7c3aed', color: '#7c3aed' } : {})
                            }}
                        >
                            <span>{loadingIngreso ? 'Ingresando...' : esConsumible ? 'Ingresar a consumibles' : 'Ingresar al almacén'}</span>
                        </button>
                    )
                }
            </td>
            <td className="productActions">
                {/* Consumibles no van a producción */}
                {esConsumible ? (
                    <span style={{ color: '#aaa', fontSize: 12 }}>—</span>
                ) : item?.materium?.unidad == 'mt2' || item.materium?.unidad == 'mt' ? 
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
                )}
            </td>
        </tr>
    )
}