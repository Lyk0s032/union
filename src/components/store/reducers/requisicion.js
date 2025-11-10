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
    cotizacionesCompras: null,
    itemRequisicion: null,
    proveedoresArray: null,
    loadingItemRequisicion: false,
    ordenCompra: null,
    loadingOrdenCompra: false,
    // Para cotizar
    materiaIds: [],
    fastCotizacion: null,
    loadingFastCotizacion: false,

    itemsCotizacions: [],

    // Analisis
    compras: null,
    loadingCompras: false
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

        case types.GET_KITS_REQUISICION: {
            return {
                ...state,
                kits: action.payload
            }
        }

        case types.GET_COMPRAS_COTIZACIONES: {
            return {
                ...state,
                cotizacionesCompras: action.payload
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

        case 'GET_LIMPIAR_MATERIAS_IDS': {
            return {
                ...state,
                materiaIds:action.payload,
            }
        } 

        case types.GET_COTIZACION_FAST: {
            return {
                ...state,
                fastCotizacion: action.payload,
                loadingFastCotizacion: false
            }
        }

        case types.GET_ORDEN_COMPRAS: {
            return {
                ...state, 
                ordenCompra: action.payload,
                loadingOrdenCompra: false
            }
        }

        case types.GETTING_ORDENES_COMPRAS: {
            return {
                ...state,
                loadingOrdenCompra: action.payload 
            }
        }

        case types.GETTING_COTIZACION_FAST: {
            return {
                ...state,
                loadingFastCotizacion: action.payload,
            }
        }

        case types.GET_PROVEEDORES_ARRAY: {
            return {
                ...state,
                proveedoresArray: action.payload
            }
        }
        case types.GET_ITEMS_COTIZACION: {
            const { materiumId, productoId, requisicionId, cantidad } = action.payload;

            // --- Identificar la clave principal ---
            // si viene productoId usamos ese, si no usamos materiumId
            const esProducto = !!productoId;
            const clave = esProducto ? "productoId" : "materiumId";
            const id = esProducto ? productoId : materiumId;

            // --- Buscar si ya existe ---
            const existe = state.itemsCotizacions.find(
                it =>
                    Number(it[clave]) === Number(id) &&
                    Number(it.requisicionId) === Number(requisicionId)
            );

            if (existe) {
                if (cantidad === 0) {
                    // eliminar
                    return {
                        ...state,
                        itemsCotizacions: state.itemsCotizacions.filter(
                            it =>
                                !(
                                    Number(it[clave]) === Number(id) &&
                                    Number(it.requisicionId) === Number(requisicionId)
                                )
                        )
                    };
                } else {
                    // actualizar
                    return {
                        ...state,
                        itemsCotizacions: state.itemsCotizacions.map(it =>
                            Number(it[clave]) === Number(id) &&
                            Number(it.requisicionId) === Number(requisicionId)
                                ? { ...it, cantidad }
                                : it
                        )
                    };
                }
            } else {
                if (cantidad > 0) {
                    // agregar
                    return {
                        ...state,
                        itemsCotizacions: [...state.itemsCotizacions, action.payload]
                    };
                }
            }

            return state; // 👈 importante: nunca devuelvas undefined
        }
        case types.CLEAN_ITEMS_COTIZACION:
            return {
                ...state,
                itemsCotizacions: []
            }

        case types.GET_COMPRAS:
            return {
                ...state,
                compras: action.payload,
                loadingCompras: false
            }
        case types.GETTING_COMPRAS: 
            return {
                ...state,
                loadingCompras: action.payload
            }
        default:
            return {...state}
    }
}