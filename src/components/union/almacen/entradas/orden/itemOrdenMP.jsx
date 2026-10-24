import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';
import { isServicioLibreItem } from '../../../compras/utils/comprasCotizacionItemUtils';

/** Medida de una pieza en mt2 o mt (alineado con inventario físico). */
function medidaMateriaEnUnidad(materium) {
    if (!materium) return 1;
    const unidad = String(materium.unidad || '').toLowerCase();
    const medidaStr = String(materium.medida ?? '1').trim();

    if (unidad === 'mt2') {
        const parts = medidaStr.split(/[x×*]/i).map((s) => parseFloat(String(s).trim().replace(',', '.')));
        if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
            let a = parts[0];
            let b = parts[1];
            if (Math.abs(a) >= 50) a /= 100;
            if (Math.abs(b) >= 50) b /= 100;
            return Number((a * b).toFixed(6));
        }
        const n = parseFloat(medidaStr.replace(',', '.'));
        return Number.isNaN(n) || n <= 0 ? 1 : n;
    }

    if (unidad === 'mt') {
        const n = parseFloat(medidaStr.replace(',', '.'));
        return Number.isNaN(n) || n <= 0 ? 1 : n;
    }

    return 1;
}

function esMpMt2OMt(item) {
    const u = String(item?.materium?.unidad || '').toLowerCase();
    return u === 'mt2' || u === 'mt';
}

export default function ItemOrdenMP({ item, ordenId, comprasCotizacionId }) {
    const dispatch = useDispatch();
    const [loadingIngreso, setLoadingIngreso] = useState(false);
    const [loadingProduccion, setLoadingProduccion] = useState(false);

    if (isServicioLibreItem(item)) return null;

    const esConsumible = item?.materium?.categoriumId === 15;
    const bodegaDestino = esConsumible ? 3 : 1;
    const usaInventarioPiezas = !esConsumible && esMpMt2OMt(item);
    const nombreItem = esConsumible
        ? (item?.materium?.item || item?.materium?.description)
        : (item?.materium?.description || item?.materium?.item);

    const numPiezas = Math.max(0, Math.floor(Math.abs(Number(item.cantidad) || 0)));
    const cantidadEnUnidad = numPiezas * medidaMateriaEnUnidad(item.materium);

    const marcarItemEntregadoEnOrden = async () => {
        await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`);
    };

    const handleIngresarAlmacen = async () => {
        if (loadingIngreso) return;

        setLoadingIngreso(true);

        try {
            if (usaInventarioPiezas) {
                if (numPiezas <= 0) {
                    dispatch(actions.HandleAlerta('La cantidad de piezas debe ser mayor a 0', 'mistake'));
                    return;
                }

                const body = {
                    cantidad: cantidadEnUnidad,
                    bodegaId: 1,
                    materiaId: item.materiumId,
                    productoId: null,
                    tipo: 'ENTRADA',
                    ubicacionOrigenId: 1,
                    ubicacionDestinoId: 1,
                    tipoProducto: 'Materia Prima',
                    refDoc: `OC-${ordenId}`,
                    numPiezas,
                    comprasCotizacionId,
                };

                const movimientoResponse = await axios.post('/api/inventario/post/bodega/moviemitos/add', body);
                if (movimientoResponse.status !== 201 && movimientoResponse.status !== 200) {
                    throw new Error('No se pudo registrar el ingreso en inventario físico');
                }

                await marcarItemEntregadoEnOrden();
            } else {
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
                    comprasCotizacionId,
                    comprasCotizacionItemId: item.id,
                };

                await axios.post('/api/stock/ingreso', payload);
            }

            dispatch(actions.axiosToGetOrdenAlmacen(false, ordenId));
            dispatch(actions.HandleAlerta('Ingreso exitoso', 'positive'));
        } catch (error) {
            console.error('[INGRESO_MP] Error al ingresar:', error);
            const msg =
                error.response?.data?.msg ||
                error.response?.data?.error ||
                error.message ||
                'Error al ingresar el material al almacén';
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setLoadingIngreso(false);
        }
    };

    const handleEnviarProduccion = async () => {
        if (loadingProduccion) return;

        setLoadingProduccion(true);

        try {
            if (usaInventarioPiezas) {
                if (cantidadEnUnidad <= 0) {
                    dispatch(actions.HandleAlerta('No hay cantidad válida para transferir', 'mistake'));
                    return;
                }

                const body = {
                    materiaId: item.materiumId,
                    productoId: null,
                    cantidad: cantidadEnUnidad,
                    tipoProducto: 'Materia Prima',
                    tipo: 'TRANSFERENCIA',
                    ubicacionOrigenId: 1,
                    ubicacionDestinoId: 4,
                    refDoc: `ORDEN-${comprasCotizacionId}-ITEM-${item.id}`,
                    comprasCotizacionId,
                    comprasCotizacionItemId: item.id,
                    cotizacionId: item.requisicion?.cotizacionId || null,
                };

                const response = await axios.post('/api/inventario-version/post/bodega/movimientos-version', body);
                if (!response.data?.success) {
                    throw new Error(response.data?.msg || 'Error al enviar a producción');
                }
            } else {
                await axios.post('/api/stock/transferir-item', {
                    comprasCotizacionItemId: item.id,
                });
            }

            dispatch(actions.axiosToGetOrdenAlmacen(false, ordenId));
            dispatch(actions.HandleAlerta('Enviado a producción exitosamente', 'positive'));
        } catch (error) {
            console.error('[ENVIAR_PRODUCCION_MP] Error:', error);
            const msg =
                error.response?.data?.msg ||
                error.response?.data?.error ||
                error.message ||
                'Error al enviar a producción';
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setLoadingProduccion(false);
        }
    };

    const ingresado =
        item?.estado === 'entregado' ||
        item?.estado === 'Entregado' ||
        item?.estado === 'Produccion';

    const puedeEnviarProduccion =
        !esConsumible &&
        (item?.estado === 'entregado' || item?.estado === 'Entregado');

    return (
        <tr>
            <td className="productCode">{item?.materiumId}</td>
            <td className="productName">
                {nombreItem} <br />
                <span style={esConsumible ? { color: '#7c3aed', fontWeight: 600 } : {}}>
                    {esConsumible ? 'Consumible' : 'Material'}
                    {usaInventarioPiezas ? ` · ${numPiezas} pza(s)` : ''}
                </span>
            </td>
            <td className="productQuantity">{item?.cantidad}</td>
            <td className="productMeasure">
                {item?.materium?.medida} {item?.materium?.unidad}
                {usaInventarioPiezas && cantidadEnUnidad > 0 ? (
                    <>
                        <br />
                        <span style={{ fontSize: 11, color: '#666' }}>
                            ≈ {cantidadEnUnidad.toFixed(2)} {item?.materium?.unidad}
                        </span>
                    </>
                ) : null}
            </td>
            <td className="productActions">
                {ingresado ? (
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
                            ...(esConsumible ? { borderColor: '#7c3aed', color: '#7c3aed' } : {}),
                        }}
                    >
                        <span>
                            {loadingIngreso ? 'Ingresando...' : esConsumible ? 'Ingresar a consumibles' : 'Ingresar al almacén'}
                        </span>
                    </button>
                )}
            </td>
            <td className="productActions">
                {esConsumible ? (
                    <span style={{ color: '#aaa', fontSize: 12 }}>—</span>
                ) : puedeEnviarProduccion ? (
                    <button
                        onClick={handleEnviarProduccion}
                        disabled={loadingProduccion}
                        style={{
                            opacity: loadingProduccion ? 0.6 : 1,
                            cursor: loadingProduccion ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <span>{loadingProduccion ? 'Enviando...' : 'Enviar a producción'}</span>
                    </button>
                ) : item?.estado === 'Produccion' ? (
                    <span style={{ color: '#2ecc71' }}>Entregado</span>
                ) : (
                    <span></span>
                )}
            </td>
        </tr>
    );
}
