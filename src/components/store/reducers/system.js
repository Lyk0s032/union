import types from "../types";

const initialState = {
    // Ruta de navegaciones
    nav: null,
    step: null, // RUTA EN NUEVO
    cliente: null,

    system: null,
    loadingSystem: false,

    alerta: null,
    typeAlerta: null,

    categorias: null,
    lineas: null,
    extensiones: null,

    loadingFiltros: null

}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.FILTROS: {
            return {
                ...state,
                categorias: action.payload.categorias,
                lineas: action.payload.lineas,
                extensiones: action.payload.extensiones,
                loadingFiltros: false
            }
        }
        case types.GETTING_FILTROS: {
            return {
                ...state,
                loadingFiltros: action.payload
            }
        }
        // NAVEGACION PANEL IZQUIERDO
        case types.NAVIGATION:{
            return {
                ...state,
                nav: action.payload
            }
        }
        // NAVEGACION PANEL IZQUIERDO
        case types.NEW:{
            return {
                ...state,
                step: action.payload
            }
        }
        case types.CLIENTE:{
            return {
                ...state,
                cliente: action.payload
            }
        }
        // ALERTA
        case types.ALERTA: {
            return {
                ...state,
                alerta: action.payload
            }
        }
        case types.TYPE_ALERTA: {
            return {
                ...state,
                typeAlerta: action.payload
            }
        }

        case types.LOADING_SYSTEM: {
            return {
                ...state,
                loadingSystem: action.payload
            }
        }
        case types.GET_SYSTEM:{
            return {
                ...state,
                system: action.payload,
                loadingSystem:false
            }
        }
        default:
            return {...state}
    }
}