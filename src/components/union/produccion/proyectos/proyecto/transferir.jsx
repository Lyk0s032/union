import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function Transferir({ item, onCantidadChange }){
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();
    const cantidadActual = Number(item.cantidadEntregada || 0);
    const cantidadComprometida = Number(item.cantidadComprometida || 0);
    const estaCompleto = cantidadActual >= cantidadComprometida;

    const dispatch = useDispatch();
    const requisicion = useSelector(store => store.requisicion);
    const { productionItem } = requisicion;
    const [cantidad, setCantidad] = useState(1);
    
    // Notificar al componente padre cuando cambie la cantidad
    useEffect(() => {
        if (onCantidadChange) {
            onCantidadChange(cantidad);
        }
    }, [cantidad, onCantidadChange]);
    
    const handleAdd = async () => {
        // Obtener el cotizacionId del proyecto actual desde Redux (lo necesitamos para la URL y para actualizar el compromiso)
        const cotizacionId = productionItem?.cotizacionId || productionItem?.cotizacion?.id || null;
        
        // Usar ruta diferente para kit vs producto terminado
        // Agregar cotizacionId a la URL por si el backend puede actualizar el compromiso automáticamente
        let url = item.kit 
            ? `/api/inventario/remove/kit/materiaBodega/?requisicionId=${item.requisicionId}&kitId=${item.kitId}&cantidad=${cantidad}${cotizacionId ? `&cotizacionId=${cotizacionId}` : ''}`
            : `/api/inventario/remove/producto/bodega/?requisicionId=${item.requisicionId}&productoId=${item.productoId}&cantidad=${cantidad}${cotizacionId ? `&cotizacionId=${cotizacionId}` : ''}`
        setLoading(true)
        const send = await axios.get(url)
        .then(async (res) => {
            // Verificar la respuesta del endpoint de traspaso
            console.log('📦 Respuesta del endpoint de traspaso:', res.data);
            
            // Actualizar el compromisoCotizacion después del traspaso exitoso
            if (!cotizacionId) {
                console.warn('⚠️ No se encontró cotizacionId para actualizar el compromiso');
            } else {
                // Construir el body para actualizar el compromiso
                const body = {
                    cotizacionId: cotizacionId,
                    requisicionId: item.requisicionId,
                    cantidadEntregada: cantidad, // Cantidad que se está agregando (se suma a la existente)
                };
                
                // Identificar el material según el tipo
                if (item.kit && item.kitId) {
                    body.materiaId = item.kitId;
                } else if (item.productoId) {
                    body.productoId = item.productoId;
                } else if (item.materium && item.materiaId) {
                    body.materiaId = item.materiaId;
                }
                
                console.log('📦 Intentando actualizar compromisoCotizacion con:', body);
                console.log('📋 Item completo:', item);
                console.log('🏗️ Proyecto (productionItem):', productionItem);
                
                // Intentar actualizar el compromiso - usar el endpoint más probable primero
                try {
                    const response = await axios.put('/api/requisicion/put/update/compromisoCotizacion', body);
                    console.log('✅ Compromiso actualizado exitosamente:', response.data);
                } catch (error) {
                    console.error('❌ Error al actualizar compromisoCotizacion:', error);
                    console.error('❌ Status:', error.response?.status);
                    console.error('❌ Error data:', error.response?.data);
                    console.error('❌ URL intentada:', '/api/requisicion/put/update/compromisoCotizacion');
                    console.error('❌ Body enviado:', body);
                    
                    // Si el endpoint no existe (404), el backend necesita implementarlo
                    if (error.response?.status === 404) {
                        console.error('🚨 EL ENDPOINT NO EXISTE. El backend necesita implementar: /api/requisicion/put/update/compromisoCotizacion');
                        console.error('🚨 O modificar el endpoint de traspaso para que actualice automáticamente el compromiso');
                    }
                }
            }
            
            dispatch(actions.axiosToGetItemElemento(false, item.requisicionId, item.kit ? item.kit.id : null, item.kit ? null: item.producto.id))
            dispatch(actions.axiosToGetItemProduction(true, params.get('project')))
            // Resetear cantidad después de transferir exitosamente
            setCantidad(1);
        })
        .catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hay stock suficiente en proceso para esto', 'mistake'))
        })
        .finally(() => {
            setLoading(false)
        })

        return send;
    }
    
    return(
        <div className="containerGive">
            <div className="inputDiv">
                {/* Mostrar estado de completitud - OCULTAR INPUT cuando está completo */}
                {estaCompleto ? (
                    <div className="completo-mensaje">
                        <span className="completo-badge">✓ Completado</span>
                        <span className="completo-texto">Ya tienes la cantidad completa ({cantidadActual} / {cantidadComprometida})</span>
                    </div>
                ) : (
                    <>
                        {/* Mostrar estado de carga - DESHABILITAR INPUT cuando está cargando */}
                        {loading && (
                            <label className="loading-label">
                                <span className="spinner"></span>
                                Transfiriendo...
                            </label>
                        )}
                        
                        <label htmlFor="cantidad-input">
                            {loading ? '' : `Cantidad a transferir: ${cantidad}`}
                        </label>
                        <input 
                            id="cantidad-input"
                            type="Number" 
                            placeholder={loading ? 'Transfiriendo...' : 'Ingresar cantidad aquí'} 
                            onChange={(e) => {
                                if(!loading) {
                                    setCantidad(e.target.value)
                                }
                            }} 
                            onKeyDown={(e) => { 
                                if(e.key == 'Enter' && !loading){
                                    const cantidadIngresada = Number(e.target.value || cantidad);
                                    const nuevaCantidadTotal = cantidadActual + cantidadIngresada;
                                    
                                    if(nuevaCantidadTotal > cantidadComprometida){
                                        dispatch(actions.HandleAlerta('La cantidad total excede lo comprometido', 'mistake'))
                                        return;
                                    }
                                    
                                    if(cantidadIngresada == 0 || !cantidadIngresada){
                                        dispatch(actions.HandleAlerta('La cantidad debe ser mayor a 0', 'mistake'))
                                        return;
                                    }
                                    
                                    handleAdd()
                                }
                            }} 
                            value={cantidad}
                            disabled={loading}
                            className={loading ? 'input-disabled' : ''}
                        />
                    </>
                )}
            </div>
            
            <style>{`
                .completo-mensaje {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 8px;
                    padding: 8px;
                    background: #d4edda;
                    border-radius: 4px;
                    border-left: 3px solid #28a745;
                }
                
                .completo-badge {
                    font-weight: 600;
                    color: #155724;
                    font-size: 14px;
                }
                
                .completo-texto {
                    font-size: 12px;
                    color: #155724;
                }
                
                .loading-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #007bff;
                    font-weight: 500;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .input-disabled {
                    background-color: #e9ecef;
                    cursor: not-allowed;
                    opacity: 0.6;
                }
            `}</style>
        </div>
    )
}