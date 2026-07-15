/**
 * API Mock para simular consultas de cantidades previamente despachadas
 * mientras se implementa el endpoint real en el backend
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simula la consulta de cantidades previamente despachadas para un item específico
 * @param {number} necesidadProyectoId - ID de la necesidad del proyecto
 * @param {number} itemId - ID del item (kit o producto)
 * @param {number} excludeRemisionId - ID de remisión a excluir (la actual)
 */
export const getCantidadesPrevias = async (necesidadProyectoId, itemId, excludeRemisionId) => {
    // Simular delay de red
    await delay(300 + Math.random() * 200);

    // Datos simulados para demo - en producción vendrán del backend
    const mockData = {
        // Ejemplo: necesidadProyectoId_itemId
        [`${necesidadProyectoId}_${itemId}`]: {
            cantidadDespachada: Math.floor(Math.random() * 50), // Cantidad previamente despachada
            remisionesAnteriores: [
                {
                    remisionId: excludeRemisionId - 1,
                    numero: `REM-${excludeRemisionId - 1 + 4890}`,
                    fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    cantidadDespachada: Math.floor(Math.random() * 25)
                },
                {
                    remisionId: excludeRemisionId - 2,
                    numero: `REM-${excludeRemisionId - 2 + 4890}`,
                    fecha: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    cantidadDespachada: Math.floor(Math.random() * 25)
                }
            ]
        }
    };

    const key = `${necesidadProyectoId}_${itemId}`;
    const resultado = mockData[key] || { 
        cantidadDespachada: 0, 
        remisionesAnteriores: [] 
    };

    // Simular algunos casos de error para testing
    if (Math.random() < 0.05) { // 5% de probabilidad de error
        throw new Error('Error simulado de red');
    }

    return {
        data: resultado
    };
};

/**
 * Interceptor para axios que redirige las llamadas a la API mock
 * cuando el endpoint no existe en el backend
 */
export const setupMockInterceptor = (axiosInstance) => {
    // Interceptor para respuestas
    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            // Si el endpoint de cantidades previas no existe (404), usar mock
            if (error.response?.status === 404 && 
                error.config.url?.includes('/api/remisiones/cantidades-previas/')) {
                
                console.warn('[MOCK] Endpoint no encontrado, usando datos simulados:', error.config.url);
                
                // Extraer parámetros de la URL
                const urlParts = error.config.url.split('/');
                const necesidadProyectoId = parseInt(urlParts[urlParts.length - 2]);
                const itemId = parseInt(urlParts[urlParts.length - 1]);
                const excludeRemisionId = parseInt(error.config.params?.excludeRemisionId || 0);
                
                try {
                    return await getCantidadesPrevias(necesidadProyectoId, itemId, excludeRemisionId);
                } catch (mockError) {
                    // Si falla el mock también, devolver respuesta vacía
                    return {
                        data: {
                            cantidadDespachada: 0,
                            remisionesAnteriores: []
                        }
                    };
                }
            }
            
            return Promise.reject(error);
        }
    );
};

export default {
    getCantidadesPrevias,
    setupMockInterceptor
};