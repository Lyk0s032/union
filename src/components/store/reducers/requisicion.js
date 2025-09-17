import { useActionState } from "react";
import types from "../types";

const initialState = {
    requisicions:null,
    loadingRequisicions: false,

    requisicion: null,
    loadingRequisicion: null,

    ids: [],
    loadingId: false,
    proyectos: null,
    kits: null,
    productos: null,
    materia: null,

    itemRequisicion: null,
    loadingItemRequisicion: false,
    // Para cotizar
    materiaIds: [],
    fastCotizacion: null,
    loadingFastCotizacion: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_REQUISICIONS: {
            return {
                ...state,
                requisicions: action.payload,
                loadingRequisicions: false
            }
        }
        case types.GETTING_REQUISICIONS: {
            return {
                ...state,
                loadingPrimas: action.payload
            }
        }  

        case types.GET_REQUISICION: {
            return {
                ...state,
                requisicion: action.payload,
                loadingRequisicion: false
            }
        }
        case types.GETTING_REQUISICION: {
            return {
                ...state,
                loadingRequisicion: action.payload
            }
        } 

        case types.GET_IDS: {
            return {
                ...state,
                ids: action.payload,
                loadingId: false,
            }
        }
        case types.LOADING_IDS: {
            return {
                ...state,
                loadingId: action.payload,
            }
        }
        case types.GET_PROYECTOS_REQUISICION: {
            return {
                ...state,
                proyectos: action.payload,
            }
        }
        case types.GET_MATERIA_PRIMA_REQUISICION: {
            return {
                ...state,
                materia: action.payload,
            }
        }


        case types.GET_UNA_MATERIA_PRIMA_REQUISICION: {
            return {
                ...state,
                itemRequisicion: action.payload,
                loadingItemRequisicion: false
            }
        }

        case types.GETTING_UNA_MATERIA_PRIMA_REQUISICION: {
            return {
                ...state,
                loadingItemRequisicion: action.payload,
            }
        }

        // COTIZAR RÁPIDO
        case types.GET_MATERIAS_IDS: {
            return {
                ...state,
                materiaIds: [...state.materiaIds, action.payload],
            }
        }

        case types.GET_COTIZACION_FAST: {
            return {
                ...state,
                fastCotizacion: action.payload,
                loadingFastCotizacion: false
            }
        }

        case types.GETTING_COTIZACION_FAST: {
            return {
                ...state,
                loadingFastCotizacion: action.payload,
            }
        }


        default:
            return {...state}
    }
}