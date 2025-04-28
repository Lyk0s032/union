import types from "../types";

const initialState = {
    login:null,
    user: null,
    loadingUser: false,
    avatars:null,

    asesor: null,
    loadingAsesor: false,

    asesores:null,
    loadingAsesores: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.LOGIN:{
            return {
                ...state,
                login: action.payload
            }
        }
        case types.GET_USER:{
            return {
                ...state,
                user: action.payload,
                loadingUser: false,
            }
        }
        case types.GETTING_USER:{
            return {
                ...state,
                loadingUser: action.payload
            }
        }
        case types.AVATARS:{
            return  {
                ...state,
                avatars: action.payload
            }
        }

        case types.GET_ASESOR: {
            return {
                ...state,
                asesor: action.payload,
                loadingAsesor: false
            }
            
        }
        case types.GETTING_ASESOR: {
            return {
                ...state,
                loadingAsesor: action.payload
            }
        }
        case types.GET_ASESORES: {
            return {
                ...state,
                asesores: action.payload,
                loadingAsesores: false
            }
        }
        case types.GETTING_ASESORES: {
            return {
                ...state,
                loadingAsesores: action.payload
            }
        } 
        default:
            return {...state}
    }
}