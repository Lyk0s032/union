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
    totalFaltante: 0,
    totalFaltanteProducto: 0,

    itemsCotizacions: [],

    // Analisis
    compras: null,
    loadingCompras: false,


    // Produccion
    productionItems: null,
    loadingProductionItems: false,
    productionItem: null,
    loadingProductionItem: false,

    itemElemento: null,
    loadingItemElemento: false,

    // Datos de visualización de requisiciones
    realProyectosRequisicion: null,
    loadingRealProyectosRequisicion: false,
    requisicionesSeleccionadas: [], // IDs de requisiciones seleccionadas
    
    // Detalles de materia prima y producto terminado
    materiaPrimaRequisicion: null,
    loadingMateriaPrimaRequisicion: false,
    productoTerminadoRequisicion: null,
    loadingProductoTerminadoRequisicion: false

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

        case types.GET_VALOR_REAL_COTIZACIONES: {
            return {
                ...state,
                totalFaltante: state.totalFaltante + action.payload
            }
        }

        case types.GET_VALOR_REAL_PRODUCTO: {
            return {
                ...state,
                totalFaltanteProducto: state.totalFaltanteProducto + action.payload
            }
        }
        case 'CLEAN_FALTANTE': {
            return {
                ...state,
                totalFaltante: 0,
                totalFaltanteProducto: 0
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


        // PRODUCTION
        case types.GET_PRODUCTION_ITEMS: 
            return {
                ...state, 
                productionItems: action.payload,
                loadingProductionItems: false
            }
        case types.GETTING_PRODUCTION_ITEMS: 
            return {
                ...state, 
                loadingProductionItems: action.payload
            }


        case types.GET_PRODUCTION_ITEM: 
            return {
                ...state, 
                productionItem: action.payload,
                loadingProductionItem: false
            }
        case types.GETTING_PRODUCTION_ITEM: 
            return {
                ...state, 
                loadingProductionItems: action.payload
            }

        case types.GET_ITEM_ELEMENTO: 
            return {
                ...state, 
                itemElemento: action.payload,
                loadingItemElemento: false
            }
        case types.GETTING_ITEM_ELEMENTO: 
            return {
                ...state,
                loadingItemElemento: action.payload
            }

        case types.GET_REAL_PROYECTOS_REQUISICION:
            return {
                ...state,
                realProyectosRequisicion: action.payload,
                loadingRealProyectosRequisicion: false
            }

        case types.GETTING_REAL_PROYECTOS_REQUISICION:
            return {
                ...state,
                loadingRealProyectosRequisicion: action.payload
            }

        case types.GET_UNA_MATERIA_PRIMA_REQUISICION:
            return {
                ...state,
                materiaPrimaRequisicion: action.payload,
                loadingMateriaPrimaRequisicion: false
            }

        case types.GETTING_MATERIA_PRIMA_REQUISICION:
            return {
                ...state,
                loadingMateriaPrimaRequisicion: action.payload
            }

        case types.GET_PRODUCTO_TERMINADO_REQUISICION:
            return {
                ...state,
                productoTerminadoRequisicion: action.payload,
                loadingProductoTerminadoRequisicion: false
            }

        case types.GETTING_PRODUCTO_TERMINADO_REQUISICION:
            return {
                ...state,
                loadingProductoTerminadoRequisicion: action.payload
            }

        case 'TOGGLE_REQUISICION_SELECTION':
            const reqId = action.payload;
            const isSelected = state.requisicionesSeleccionadas.includes(reqId);
            return {
                ...state,
                requisicionesSeleccionadas: isSelected
                    ? state.requisicionesSeleccionadas.filter(id => id !== reqId)
                    : [...state.requisicionesSeleccionadas, reqId]
            }

        case 'CLEAR_REQUISICIONES_SELECTION':
            return {
                ...state,
                requisicionesSeleccionadas: []
            }

        case 'SET_REQUISICIONES_SELECCIONADAS':
            return {
                ...state,
                requisicionesSeleccionadas: action.payload
            }

        case 'SELECT_RANGE_REQUISICIONES':
            // Seleccionar un rango de requisiciones (para Shift+Click)
            const idsRango = action.payload;
            const nuevasSeleccionadas = [...new Set([...state.requisicionesSeleccionadas, ...idsRango])];
            return {
                ...state,
                requisicionesSeleccionadas: nuevasSeleccionadas
            }

        default:
            return {...state}
    }
}