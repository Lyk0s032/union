import types from "../types";

const initialState = {
    clients:null,
    loadingClients: null,

    client: null,
    loadingClient: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_CLIENTS: {
            return {
                ...state,
                clients: action.payload,
                loadingClients: false
            }
        }
        case types.GETTING_CLIENTS: {
            return {
                ...state,
                loadingClients: action.payload
            }
        }  

        case types.GET_CLIENT: {
            return {
                ...state,
                client: action.payload,
                loadingClient: false
            }
        }
        case types.GETTING_CLIENT: {
            return {
                ...state,
                loadingClient: action.payload
            }
        } 
        default:
            return {...state}
    }
} 