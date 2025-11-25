import types from "../types";

const initialState = {
    cabecerasBodega: null,
    loadingCabecerasBodega: false,

    productosBodega:null,
    loadingProductosBodega: false,

    movimientosBodega: null,
    loadingMovimientosBodega: false,

    productoFilter: null,
    productoFilterLoading: false,


    item: null,
    loadingItem: false,

    itemBodega: null,
    loadingItemBodega: false,
    
    ordenes: null, 
    loadingOrdenes: false,

    proyectos:null,
    loadingProyectos: false,

    proyecto:null,
    loadingProyecto: false,
  
    itemToProject: null,
    loadingItemToProject: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_CABECERAS: {
            return {
                ...state,
                cabecerasBodega: action.payload,
                loadingCabecerasBodega: false
            }
        }
        case types.GETTING_CABECERAS: {
            return {
                ...state,
                loadingCabecerasBodega: action.payload
            }
        }  

        case types.GET_PRODUCTOS_BODEGA: {
            return {
                ...state,
                productosBodega: action.payload,
                loadingProductosBodega: false
            }
        }
        case types.GETTING_PRODUCTOS_BODEGA: {
            return {
                ...state,
                loadingProductosBodega: action.payload
            }
        }  

        case types.GET_MOVIMIENTOS_BODEGA: {
            return {
                ...state,
                movimientosBodega: action.payload,
                loadingMovimientosBodega: false
            }
        }
        case types.GETTING_MOVIMIENTOS_BODEGA: {
            return {
                ...state,
                loadingMovimientosBodega: action.payload
            }
        } 

        case types.GET_ITEM: {
            return {
                ...state,
                item: action.payload,
                loadingItem: false
            }
        }
        case types.GETTING_ITEM: {
            return {
                ...state,
                loadingItem: action.payload
            }
        } 
        case types.GET_ORDENES: {
            return {
                ...state,
                ordenes: action.payload,
                loadingOrdenes: false
            }
        }
        case types.GETTING_ORDENES: {
            return {
                ...state,
                loadingOrdenes: action.payload
            }
        } 

        case types.GET_PROJECTS: {
            return {
                ...state,
                proyectos: action.payload,
                loadingProyectos: false
            }
        }
        case types.GETTING_PROJECTS: {
            return {
                ...state,
                loadingProyectos: action.payload
            }
        } 

        case types.GET_PROJECT: {
            return {
                ...state,
                proyecto: action.payload,
                loadingProyecto: false
            }
        }
        case types.GETTING_PROJECT: {
            return {
                ...state,
                loadingProyecto: action.payload
            }
        } 

        case types.GET_ITEM_TO_PROJECT: {
            return {
                ...state,
                itemToProject: action.payload,
                loadingItemToProject: false
            }
        }
        case types.GETTING_ITEM_TO_PROJECT: {
            return {
                ...state,
                loadingItemToProject: action.payload
            }
        }

        case types.GET_ITEM_BODEGA: {
            return {
                ...state,
                itemBodega:action.payload,
                loadingItemBodega: false
            }
        }

        case types.GETTING_ITEM_BODEGA: {
            return {
                ...state,
                loadingItemBodega: action.payload
            }
        }


        default:
            return {...state}
    }
} 