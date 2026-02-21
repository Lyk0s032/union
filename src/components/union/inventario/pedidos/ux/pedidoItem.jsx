import React, { useState, useEffect } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function PedidoItemAlmacen({ item }){

    console.log('[PEDIDO_ITEM] Item recibido:', {
        id: item?.id,
        materiaId: item?.materiaId,
        materiumId: item?.materiumId,
        materium: item?.materium,
        comprasCotizacionId: item?.comprasCotizacionId
    });

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [loadingToAlmacen, setLoadingToAlmacen] = useState(false);
    const [loadingToAlmacenProject, setLoadingToAlmacenProject] = useState(false);
    const [loadingEnviarProduccion, setLoadingEnviarProduccion] = useState(false);

    // ✅ Función para obtener los valores actualizados del item
    const obtenerValoresForm = (itemData) => {
        const materiaId = itemData.materium ? (itemData.materiaId || itemData.materium?.id || itemData.materiumId) : null;
        const productoId = itemData.materium ? null : (itemData.productoId || itemData.producto?.id);
        
        return {
            cantidad: Math.abs(Number(itemData.cantidad)),
            bodegaId: itemData.materium ? 1 : 2,  
            materiaId: materiaId,
            productoId: productoId,
            tipo: 'ENTRADA',
            ubicacionOrigenId: itemData.materium ? 1 : 2,
            ubicacionDestinoId: itemData.materium ? 1 : 2,
            tipoProducto: itemData.materium ? 'Materia Prima' : 'Producto',
            refDoc: `ORDEN-${itemData.comprasCotizacionId}`,
            cotizacionId: null,
            numPiezas: Math.abs(Number(itemData.cantidad)) || 1,
            comprasCotizacionId: itemData.comprasCotizacionId
        };
    };

    const [form, setForm] = useState(() => obtenerValoresForm(item));

    // ✅ Sincronizar form cuando item cambie (evita problemas de sincronización)
    useEffect(() => {
        if (item && item.id) {
            const nuevosValores = obtenerValoresForm(item);
            console.log('[PEDIDO_ITEM] Actualizando form con valores del item:', {
                itemId: item.id,
                materiaId: nuevosValores.materiaId,
                productoId: nuevosValores.productoId,
                comprasCotizacionId: nuevosValores.comprasCotizacionId
            });
            setForm(nuevosValores);
        }
    }, [item?.id, item?.materiaId, item?.materiumId, item?.productoId, item?.comprasCotizacionId, item?.cantidad]);
    const [loading, setLoading] = useState(false);
    // const ingresarAlmacen = async () => {
    //     setLoadingToAlmacen(true)
    //     let body = {
    //         cantidad: item.cantidad,
    //         materiaId: item.materiaId,
    //         productoId: item.productoId,
    //         tipoProducto: item.materiaId ? 'Materia Prima' : 'Producto',
    //         tipo: 'ENTRADA',
    //         ubicacionOrigenId: item.materiaId ? 1 : 2,
    //         ubicacionDestinoId: item.materiaId ? 1 : 2,
    //         refDoc: item.id,
    //         cotizacionId: item.requisicionId

    //     }
    //     const send = await axios.post('api/inventario/post/bodega/addHowMany', body)
    //     .then(async res => {
    //         const sendToChange = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
    //         return sendToChange
    //     }) 
    //     .then((res) => {
    //         dispatch(actions.axiosToGetOrdenAlmacen(false, params.get('pedido')))
    //         return res;
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    //     .finally(() => {
    //         setLoadingToAlmacen(false)
    //     })

    //     return send;
    // }

    const definitivaSend = async () => {
        // Validar que no esté ya procesado
        // if (item.estado !== 'aprobado') {
        //     alert('Este item ya ha sido procesado o no está aprobado');
        //     return;
        // }

        // Validar datos requeridos con mensajes específicos
        if (!item.id) {
            alert('❌ Error de validación: El item no tiene ID. No se puede procesar el ingreso al almacén.');
            return;
        }
        
        if (!item.comprasCotizacionId) {
            alert('❌ Error de validación: El item no tiene comprasCotizacionId (ID de orden de compra). No se puede procesar el ingreso al almacén.');
            return;
        }

        // Validar que tengamos materiaId o productoId
        if (!form.materiaId && !form.productoId) {
            alert(`❌ Error de validación: El item debe tener materiaId o productoId para ingresar al almacén.\n\nItem ID: ${item.id}\nMateriaId: ${form.materiaId || 'No definido'}\nProductoId: ${form.productoId || 'No definido'}`);
            return;
        }

        // Validar que numPiezas sea válido
        if (!form.numPiezas || form.numPiezas <= 0) {
            alert(`❌ Error de validación: La cantidad (numPiezas) debe ser mayor a 0.\n\nCantidad recibida: ${form.numPiezas}\nCantidad del item: ${item.cantidad}`);
            return;
        }

        setLoadingToAlmacen(true);
        
        try {
            // ✅ Usar valores actualizados directamente del item para evitar problemas de sincronización
            const valoresActuales = obtenerValoresForm(item);
            let body = { ...valoresActuales };
            
            console.log('[FRONTEND] Enviando solicitud de ingreso al almacén:', {
                itemId: item.id,
                comprasCotizacionId: item.comprasCotizacionId,
                materiaId: body.materiaId,
                productoId: body.productoId,
                numPiezas: body.numPiezas,
                cantidad: body.cantidad,
                tipo: body.tipo,
                ubicacionDestinoId: body.ubicacionDestinoId,
                '⚠️ VALIDACIÓN': {
                    'item.id': item.id,
                    'item.materiaId': item.materiaId,
                    'item.materiumId': item.materiumId,
                    'body.materiaId': body.materiaId
                }
            });
            
            // 1. Registrar el movimiento en el almacén (con transacción global)
            const movimientoResponse = await axios.post('/api/inventario/post/bodega/moviemitos/add', body);
            
            // Validar que el movimiento se haya registrado correctamente
            if (!movimientoResponse.data) {
                throw new Error('El servidor no retornó datos al registrar el movimiento. La operación puede haber fallado.');
            }
            
            if (movimientoResponse.status !== 201) {
                throw new Error(`El servidor retornó un código de estado inesperado: ${movimientoResponse.status}. Se esperaba 201 (Created).`);
            }

            console.log('[FRONTEND] Movimiento registrado exitosamente:', movimientoResponse.data);

            // 2. Actualizar el estado del item a "Entregado"
            const estadoResponse = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`);
            
            if (!estadoResponse.data) {
                throw new Error('El servidor no retornó datos al actualizar el estado del item. El movimiento se registró pero el estado puede no haberse actualizado.');
            }
            
            if (estadoResponse.status !== 200) {
                throw new Error(`Error al actualizar el estado del item. Código de respuesta: ${estadoResponse.status}. El movimiento se registró pero el estado puede no haberse actualizado.`);
            }

            console.log('[FRONTEND] Estado del item actualizado exitosamente:', estadoResponse.data);

            // 3. Refrescar la lista de órdenes
            dispatch(actions.axiosToGetOrdenAlmacen(false, params.get('pedido')));
            
            alert(`✅ Éxito: Item ingresado al almacén correctamente.\n\nItem ID: ${item.id}\nPiezas creadas: ${form.numPiezas}\nCantidad total: ${form.cantidad}`);
            
        } catch (err) {
            console.error('[FRONTEND] Error al ingresar item al almacén:', {
                error: err,
                response: err.response?.data,
                itemId: item.id,
                comprasCotizacionId: item.comprasCotizacionId
            });
            
            // Extraer mensaje de error más descriptivo
            let errorMsg = 'Error desconocido al ingresar al almacén';
            
            if (err.response?.data?.msg) {
                errorMsg = err.response.data.msg;
            } else if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            // Mostrar mensaje de error mejorado
            alert(`❌ Error al ingresar item al almacén:\n\n${errorMsg}\n\nItem ID: ${item.id}\nOrden de compra: ${item.comprasCotizacionId}\n\nRevise la consola para más detalles.`);
        } finally {
            setLoadingToAlmacen(false);
        }
    }

    const sendToProject = async () => {
        try{
            setLoadingToAlmacenProject(true)
            const sendFirst = await ingresarAlmacen()
            .then(async (res) => {
                let body = {
                    cantidad: item.cantidad,
                    materiaId: item.materiaId,
                    productoId: item.productoId,
                    tipoProducto: item.materiaId ? 'Materia Prima' : 'Producto',
                    tipo: 'TRANSFERENCIA',
                    ubicacionOrigenId: item.materiaId ? 1 : 2,
                    ubicacionDestinoId: item.materiaId ? 4 : 2,
                    refDoc: item.id,
                    cotizacionId: item.requisicionId

                }
                const send = await axios.post('api/inventario/post/bodega/addHowMany', body)
                .then(async res => {
                    const sendToChange = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
                    return sendToChange
                }) 
                return send;
            })


        }catch(err){
            console.log(err);
            return ;
        }
    }

    // Función para enviar a producción usando la nueva ruta versionada
    const enviarAProduccion = async () => {
        try {
            setLoadingEnviarProduccion(true);
            
            // Validar que el item esté aprobado y tenga los datos necesarios
            if (item.estado !== 'Entregado') {
                alert('El item debe estar aprobado para enviar a producción');
                return;
            }

            if (!item.comprasCotizacionId) {
                alert('Error: Falta el ID de orden de compra (comprasCotizacionId)');
                return;
            }

            // Determinar si es materia prima o producto terminado
            const esMateriaPrima = !!item.materium;
            
            // Obtener el cotizacionId del proyecto
            // La requisición tiene un cotizacionId que es el proyecto
            let cotizacionId = null;
            if (item.requisicion?.cotizacionId) {
                cotizacionId = item.requisicion.cotizacionId;
            } else if (item.requisicionId) {
                // Si no tenemos el objeto requisición completo, intentamos obtenerlo
                // Por ahora usamos null, pero podríamos hacer una consulta adicional si es necesario
                console.warn('No se encontró cotizacionId en item.requisicion, usando null');
            }
            
            // ✅ Obtener materiaId/productoId de forma más robusta
            const materiaIdActual = esMateriaPrima 
                ? (item.materiaId || item.materium?.id || item.materiumId) 
                : null;
            const productoIdActual = esMateriaPrima 
                ? null 
                : (item.productoId || item.producto?.id);

            // Preparar el body para la transferencia versionada
            const body = {
                materiaId: materiaIdActual,
                productoId: productoIdActual,
                cantidad: Math.abs(Number(item.cantidad)),
                tipoProducto: esMateriaPrima ? 'Materia Prima' : 'Producto',
                tipo: 'TRANSFERENCIA',
                ubicacionOrigenId: esMateriaPrima ? 1 : 2, // Bodega 1 para MP, 2 para PT
                ubicacionDestinoId: esMateriaPrima ? 4 : 5, // Bodega 4 para MP, 5 para PT
                refDoc: `ORDEN-${item.comprasCotizacionId}-ITEM-${item.id}`,
                comprasCotizacionId: item.comprasCotizacionId, // OBLIGATORIO - Orden de compra
                cotizacionId: cotizacionId // Opcional - Proyecto/Cotización relacionada
            };

            console.log('[FRONTEND] Enviando a producción - Body:', {
                ...body,
                '⚠️ VALIDACIÓN': {
                    'item.id': item.id,
                    'item.materiaId': item.materiaId,
                    'item.materiumId': item.materiumId,
                    'item.materium?.id': item.materium?.id,
                    'body.materiaId': body.materiaId,
                    'esMateriaPrima': esMateriaPrima
                }
            });

            // Llamar a la nueva ruta versionada
            const response = await axios.post('/api/inventario-version/post/bodega/movimientos-version', body);
            
            console.log('Respuesta de transferencia:', response.data);

            if (response.data.success) {
                // Actualizar el estado del item en la orden de compra
                await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
                    .then(() => {
                        // Refrescar la lista de órdenes
                        dispatch(actions.axiosToGetOrdenAlmacen(false, params.get('pedido')));
                        alert('Material enviado a producción exitosamente');
                    })
                    .catch(err => {
                        console.error('Error al actualizar estado:', err);
                        alert('Transferencia exitosa, pero hubo un error al actualizar el estado');
                    });
            } else {
                alert('Error al enviar a producción: ' + (response.data.msg || 'Error desconocido'));
            }

        } catch (err) {
            console.error('Error en enviarAProduccion:', err);
            const errorMsg = err.response?.data?.msg || err.response?.data?.error || err.message || 'Error desconocido';
            alert('Error al enviar a producción: ' + errorMsg);
        } finally {
            setLoadingEnviarProduccion(false);
        }
    }
    return (
        <tr>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materiaId} {item.productoId} </h3>
                    </div> 
                    <div className="name">
                        <h3>{item.materium?.description} {item.producto?.item}</h3>
                        <span>{item.materium?.item} {item.producto?.medida  && (`Medida: ${item.medida} ${item.producto?.unidad}`)}</span><br />
                    </div> 
                </div>
            </td>
            <td>
                <div>
                    <span>{item.cantidad}</span>
                </div>
            </td>
            <td>
                <div className=""> 
                    {/* { 
                        item.estado == 'aprobado' ?
                        <button 
                            onClick={definitivaSend}
                            disabled={loadingToAlmacen}
                        >
                            <span>{loadingToAlmacen ? 'Ingresando...' : 'Ingresar en almacén'}</span>
                        </button>
                        : 
                        <span style={{color: 'green'}}>Entregado</span>
                    } 
                     
                     */}

                        <button 
                            onClick={definitivaSend}
                            disabled={loadingToAlmacen}
                        >
                            <span>{loadingToAlmacen ? 'Ingresando...' : 'Ingresar en almacén'}</span>
                        </button>
                </div>
            </td> 
            {/* <td>
                <div className="">
                    {
                        item.estado == 'aprobado' ?
                        <button onClick={() => {
                            sendToProject()
                        }}>
                            <span>Ingresar al proyecto</span>
                        </button>
                        : 
                        null
                    }

                </div>
            </td> */}
            <td>
                <div className="">
                    { 
                        item.estado == 'Entregado' ?
                        <button 
                            onClick={() => {
                                !loadingEnviarProduccion ? enviarAProduccion() : null;
                            }}
                            disabled={loadingEnviarProduccion}
                        >
                            <span>
                                {loadingEnviarProduccion ? 'Enviando...' : 'Enviar a producción'}
                            </span>
                        </button>
                        :
                        <span style={{color: 'gray'}}>No disponible</span>
                    }
                </div>
                {/* <div>
                    <span>{item.requisicion?.id} - {item.requisicion?.nombre}</span>
                </div> */}
            </td>
            
            
        </tr>
    )
}