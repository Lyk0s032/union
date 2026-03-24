import types from '../types';

const INITIAL_STATE = {
    users: null,        // Array de usuarios o null si aún no se cargó
    loadingUsers: false // true = muestra spinner, false = carga silenciosa
};

export default function usersReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_USERS:
            return {
                ...state,
                users: action.payload,
                loadingUsers: false
            };
        case types.GETTING_USERS:
            return {
                ...state,
                loadingUsers: action.payload
            };
        default:
            return state;
    }
}
