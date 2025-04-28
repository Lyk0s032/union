import types from "../types";

const initialState = {
    kits:null,
    loadingKits: null,

    kit: null,
    loadingKit: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_KITS: {
            return {
                ...state,
                kits: action.payload,
                loadingKits: false
            }
        }
        case types.GETTING_KITS: {
            return {
                ...state,
                loadingKits: action.payload
            }
        }  

        case types.GET_KIT: {
            return {
                ...state,
                kit: action.payload,
                loadingKit: false
            }
        }
        case types.GETTING_KIT: {
            return {
                ...state,
                loadingKit: action.payload
            }
        } 
        default:
            return {...state}
    }
}