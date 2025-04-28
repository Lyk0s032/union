import types from "../types";

const initialState = {
    cotizaciones:null,
    loadingCotizaciones: null,

    cotizacion: null,
    loadingCotizacion: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_COTIZACIONES: {
            return {
                ...state,
                cotizaciones: action.payload,
                loadingCotizaciones: false
            }
        }
        case types.GETTING_COTIZACIONES: {
            return {
                ...state,
                loadingCotizaciones: action.payload
            }
        }  

        case types.GET_COTIZACION: {
            return {
                ...state,
                cotizacion: action.payload,
                loadingCotizacion: false
            }
        }
        case types.GETTING_COTIZACION: {
            return {
                ...state,
                loadingCotizacion: action.payload
            }
        } 
        default:
            return {...state}
    }
}