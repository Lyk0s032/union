import types from '../types';

const INITIAL_STATE = {
    remisiones: null,
    loadingRemisiones: false,
    remision: null,
    loadingRemision: false,
};

export default function remisionesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_REMISIONES:
            return {
                ...state,
                remisiones: action.payload,
                loadingRemisiones: false
            };
        case types.GETTING_REMISIONES:
            return {
                ...state,
                loadingRemisiones: action.payload
            };
        case types.GET_REMISION:
            return {
                ...state,
                remision: action.payload,
                loadingRemision: false
            };
        case types.GETTING_REMISION:
            return {
                ...state,
                loadingRemision: action.payload
            };
        default:
            return state;
    }
}
