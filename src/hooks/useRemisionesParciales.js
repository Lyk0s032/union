import { useState, useEffect } from 'react';
import axios from 'axios';
import { setupMockInterceptor } from '../utils/mockRemisionesAPI';

/**
 * Hook personalizado para manejar remisiones parciales
 * Calcula cantidades previamente despachadas y pendientes por despachar
 */
const useRemisionesParciales = (remision) => {
    const [cantidadesPrevias, setCantidadesPrevias] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Configurar interceptor mock al inicializar el hook
    useEffect(() => {
        setupMockInterceptor(axios);
    }, []);

    useEffect(() => {
        if (!remision?.itemRemisions || remision.itemRemisions.length === 0) {
            return;
        }

        const cargarCantidadesPrevias = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const cantidadesCalculadas = {};
                
                // Para cada item de la remisión actual
                for (const item of remision.itemRemisions) {
                    const necesidadProyectoId = item.necesidadProyectoId;
                    const itemId = item.kitId || item.productoId;
                    
                    if (!necesidadProyectoId || !itemId) {
                        // Si no hay necesidadProyectoId, no hay manera de calcular cantidades previas
                        cantidadesCalculadas[item.id] = {
                            cantidadComprometida: Number(item?.necesidadProyecto?.cantidadComprometida || 0),
                            cantidadPreviamenteDespachada: 0,
                            cantidadPendiente: Number(item?.necesidadProyecto?.cantidadComprometida || 0),
                            cantidadActualDespachada: Number(item?.cantidad || 0),
                            esCalculoCompleto: false
                        };
                        continue;
                    }

                    try {
                        // Consultar todas las remisiones del mismo proyecto que no sean la actual
                        const response = await axios.get(
                            `/api/remisiones/cantidades-previas/${necesidadProyectoId}/${itemId}`,
                            {
                                params: {
                                    excludeRemisionId: remision.id
                                }
                            }
                        );

                        const cantidadComprometida = Number(item?.necesidadProyecto?.cantidadComprometida) || 0;
                        const cantidadPreviamenteDespachada = Number(response.data.cantidadDespachada) || 0;
                        const cantidadActualDespachada = Number(item?.cantidad) || 0;
                        const cantidadPendiente = Math.max(0, cantidadComprometida - cantidadPreviamenteDespachada);

                        cantidadesCalculadas[item.id] = {
                            cantidadComprometida,
                            cantidadPreviamenteDespachada,
                            cantidadPendiente,
                            cantidadActualDespachada,
                            esCalculoCompleto: true,
                            // Información adicional útil
                            porcentajeCompletado: cantidadComprometida > 0 
                                ? ((cantidadPreviamenteDespachada + cantidadActualDespachada) / cantidadComprometida) * 100 
                                : 0,
                            estadoDespacho: cantidadPreviamenteDespachada + cantidadActualDespachada >= cantidadComprometida 
                                ? 'completo' 
                                : cantidadPreviamenteDespachada > 0 
                                    ? 'parcial' 
                                    : 'pendiente'
                        };

                    } catch (itemError) {
                        console.warn(`Error al cargar cantidades previas para item ${item.id}:`, itemError);
                        
                        // Fallback: usar solo los datos locales
                        const cantidadComprometida = Number(item?.necesidadProyecto?.cantidadComprometida || 0);
                        cantidadesCalculadas[item.id] = {
                            cantidadComprometida,
                            cantidadPreviamenteDespachada: 0,
                            cantidadPendiente: cantidadComprometida,
                            cantidadActualDespachada: Number(item?.cantidad || 0),
                            esCalculoCompleto: false,
                            error: 'No se pudo consultar historial de despachos'
                        };
                    }
                }

                setCantidadesPrevias(cantidadesCalculadas);
            } catch (error) {
                console.error('Error general al cargar cantidades previas:', error);
                setError('Error al consultar historial de remisiones');
                
                // Fallback completo: usar solo datos locales
                const fallbackCantidades = {};
                remision.itemRemisions.forEach(item => {
                    const cantidadComprometida = Number(item?.necesidadProyecto?.cantidadComprometida || 0);
                    fallbackCantidades[item.id] = {
                        cantidadComprometida,
                        cantidadPreviamenteDespachada: 0,
                        cantidadPendiente: cantidadComprometida,
                        cantidadActualDespachada: Number(item?.cantidad || 0),
                        esCalculoCompleto: false
                    };
                });
                setCantidadesPrevias(fallbackCantidades);
            } finally {
                setLoading(false);
            }
        };

        cargarCantidadesPrevias();
    }, [remision?.id, remision?.itemRemisions]);

    /**
     * Valida si una cantidad a despachar es válida
     */
    const validarCantidadDespacho = (itemId, nuevaCantidad) => {
        const info = cantidadesPrevias[itemId];
        if (!info) return { valida: false, mensaje: 'Item no encontrado' };

        const nuevaCantidadNum = Number(nuevaCantidad) || 0;
        
        if (nuevaCantidadNum < 0) {
            return { valida: false, mensaje: 'La cantidad no puede ser negativa' };
        }

        if (nuevaCantidadNum > info.cantidadPendiente) {
            return { 
                valida: false, 
                mensaje: `Solo puedes despachar ${info.cantidadPendiente} unidades restantes (ya se despacharon ${info.cantidadPreviamenteDespachada} anteriormente)` 
            };
        }

        return { valida: true, mensaje: '' };
    };

    /**
     * Obtiene información completa de cantidades para un item
     */
    const getInfoCantidades = (itemId) => {
        return cantidadesPrevias[itemId] || {
            cantidadComprometida: 0,
            cantidadPreviamenteDespachada: 0,
            cantidadPendiente: 0,
            cantidadActualDespachada: 0,
            esCalculoCompleto: false
        };
    };

    /**
     * Obtiene resumen general de la remisión
     */
    const getResumenRemision = () => {
        const items = Object.values(cantidadesPrevias);
        
        return {
            totalItems: items.length,
            itemsCompletos: items.filter(item => item.estadoDespacho === 'completo').length,
            itemsParciales: items.filter(item => item.estadoDespacho === 'parcial').length,
            itemsPendientes: items.filter(item => item.estadoDespacho === 'pendiente').length,
            // Number() explícito para evitar concatenación (MySQL DECIMAL retorna strings)
            totalComprometido: items.reduce((sum, item) => Number(sum) + Number(item.cantidadComprometida || 0), 0),
            totalPreviamenteDespachado: items.reduce((sum, item) => Number(sum) + Number(item.cantidadPreviamenteDespachada || 0), 0),
            totalActualDespachado: items.reduce((sum, item) => Number(sum) + Number(item.cantidadActualDespachada || 0), 0),
            porcentajeCompletoGeneral: items.length > 0 
                ? (items.reduce((sum, item) => Number(sum) + Number(item.porcentajeCompletado || 0), 0) / items.length)
                : 0
        };
    };

    return {
        cantidadesPrevias,
        loading,
        error,
        validarCantidadDespacho,
        getInfoCantidades,
        getResumenRemision
    };
};

export default useRemisionesParciales;