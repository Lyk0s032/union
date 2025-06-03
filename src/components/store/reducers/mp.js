import types from "../types";

const initialState = {
    primas:null,
    loadingPrimas: false,

    prima: null,
    loadingPrima: null,


    productos:null,
    loadingProductos: false,

    producto: null,
    loadingProducto: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_PRIMAS: {
            return {
                ...state,
                primas: action.payload,
                loadingPrimas: false
            }
        }
        case types.GETTING_PRIMAS: {
            return {
                ...state,
                loadingPrimas: action.payload
            }
        }  

        case types.GET_PRIMA: {
            return {
                ...state,
                prima: action.payload,
                loadingPrima: false
            }
        }
        case types.GETTING_PRIMA: {
            return {
                ...state,
                loadingPrima: action.payload
            }
        } 


        // PRODUCTOS
        case types.GET_PRODUCTOS: {
            return {
                ...state,
                productos: action.payload,
                loadingProductos: false
            }
        }
        case types.GETTING_PRODUCTOS: {
            return {
                ...state,
                loadingProductos: action.payload
            }
        }  

        case types.GET_PRODUCTO: {
            return {
                ...state,
                producto: action.payload,
                loadingProducto: false
            }
        }
        case types.GETTING_PRODUCTO: {
            return {
                ...state,
                loadingProducto: action.payload
            }
        } 
        default: 
            return {...state}
    }
}