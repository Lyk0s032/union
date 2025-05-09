import types from "../types";

const initialState = {
    requisicions:null,
    loadingRequisicions: false,

    requisicion: null,
    loadingRequisicion: null,
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
        default:
            return {...state}
    }
}