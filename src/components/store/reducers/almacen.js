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
    loadingItemBodega: false
  
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