import types from "../types";

const initialState = {
    requerimientos:null,
    loadingRequerimientos: null,

    requerimiento: null,
    loadingRequerimiento: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_REQUERIMIENTOS: {
            return {
                ...state,
                requerimientos: action.payload,
                loadingRequerimientos: false
            }
        }
        case types.GETTING_REQUERIMIENTOS: {
            return {
                ...state,
                loadingRequerimientos: action.payload
            }
        }  

        case types.GET_REQUERIMIENTO: {
            return {
                ...state,
                requerimiento: action.payload,
                loadingRequerimiento: false
            }
        }
        case types.GETTING_REQUERIMIENTO: {
            return {
                ...state,
                loadingRequerimiento: action.payload
            }
        } 
        default:
            return {...state}
    }
} 