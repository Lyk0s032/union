import types from "../types";

const initialState = {
    providers:null,
    loadingProviders: null,

    provider: null,
    loadingProvider: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_PROVIDERS: {
            return {
                ...state,
                providers: action.payload,
                loadingProviders: false
            }
        }
        case types.GETTING_PROVIDERS: {
            return {
                ...state,
                loadingProviders: action.payload
            }
        }  

        case types.GET_PROVIDER: {
            return {
                ...state,
                provider: action.payload,
                loadingProvider: false
            }
        }
        case types.GETTING_PROVIDER: {
            return {
                ...state,
                loadingProvider: action.payload
            }
        } 
        default:
            return {...state}
    }
}