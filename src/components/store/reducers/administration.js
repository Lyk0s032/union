import types from "../types";

const initialState = {
    graphProducto: null,
    loadingGraphProducto: false,

    produccion:null,
    loadingProduccion: false,

    productoFilter: null,
    productoFilterLoading: false,

    // KITS
    graphKits: null,
    loadingGraphKits: false,

    // COTIZACIONES POR APROBAR
    cotizaciones: null,
    loadingCotizaciones: false,

    cotizacionesProduccion: null,
    loadingCotizacionesProduccion: false,

    // COMPRAS
    ordenesCompras: null,
    loadingOrdenesCompras: null,
    
    ordenCompras: null,
    loadingOrdenCompras: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_GRAPH_PRODUCTO: {
            return {
                ...state,
                graphProducto: action.payload,
                loadingGraphProducto: false
            }
        }
        case types.GETTING_GRAPH_PRODUCTO: {
            return {
                ...state,
                loadingGraphProducto: action.payload
            }
        }  

        case types.GET_PRODUCCION: {
            return {
                ...state,
                produccion: action.payload,
                loadingProduccion: false
            }
        }
        case types.GETTING_PRODUCCION: {
            return {
                ...state,
                loadingProduccion: action.payload
            }
        }  

        case types.GET_CLIENT: {
            return {
                ...state,
                client: action.payload,
                loadingClient: false
            }
        }
        case types.GETTING_CLIENT: {
            return {
                ...state,
                loadingClient: action.payload
            }
        } 
        // KITS
        case types.GET_GRAPH_KITS: {
            return {
                ...state,
                graphKits: action.payload,
                loadingGraphKits: false
            }
        }
        case types.GETTING_GRAPH_KITS: {
            return {
                ...state,
                loadingGraphKits: action.payload
            }
        } 
        
        // COTIZACIONES
        case types.GET_COTIZACIONES_ADMIN: {
            return {
                ...state,
                cotizaciones: action.payload,
                loadingCotizaciones: false
            }
        }
        case types.GETTING_COTIZACIONES_ADMIN: {
            return {
                ...state,
                cotizaciones: action.payload
            }
        } 

        // COTIZACIONES
        case types.GET_COTIZACIONES_PRODUCCION: {
            return {
                ...state,
                cotizacionesProduccion: action.payload,
                loadingCotizacionesProduccion: false
            }
        }
        case types.GETTING_COTIZACIONES_PRODUCCION: {
            return {
                ...state,
                cotizacionesProduccion: action.payload
            }
        } 

        case types.GET_ORDENES_COMPRAS: {
            return {
                ...state,
                ordenesCompras: action.payload,
                loadingOrdenesCompras: false
            }
        }

        case types.GETTING_ORDENES_COMPRAS: {
            return {
                ...state,
                loadingOrdenesCompras: action.payload
            }
        }

        case types.GET_ORDEN_COMPRAS: {
            return {
                ...state,
                ordenCompras: action.payload,
                loadingOrdenCompras: false
            }
        }

        case types.GETTING_ORDEN_COMPRAS: {
            return {
                ...state,
                loadingOrdenCompras: action.payload
            }
        }

        default:
            return {...state}
    }
} 