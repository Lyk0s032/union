import axios from "axios";
import store from "../store";
import types from "../types";



// LOGIN 
export function GET_USER(user){
    return {
        type: types.GET_USER,
        payload: user
    }
}
export function GETTING_USER(carga){
    return {
        type: types.GETTING_USER,
        payload: carga
    }
}  
export function AxiosAuthUser(token, carga){
    return function(dispatch){ 
        dispatch(GETTING_USER(carga));
        axios.get('/api/users/logged', {  
            headers:{
                'authorization': `Bearer ${token}`
            }
        } )
        .then((res) => {
            dispatch(GET_USER(res.data.user))

        })
        .catch(err => {
            dispatch(GET_USER(null))
            window.localStorage.removeItem('loggedPeople'); 
        })
    }
} 



// FILTROS
// ----------------------
export function getFiltros(data){
    return {
        type: types.FILTROS,
        payload: data
    }
}
export function gettingFiltros(carga){
    return {
        type: types.GETTING_FILTROS,
        payload: carga
    }
}

export function axiosToGetFiltros(carga){
    return function(dispatch){ 
        dispatch(gettingFiltros(carga))
        axios.get(`/api/lineas/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getFiltros(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getFiltros('notrequest'));
            }else{
                return dispatch(getFiltros(404))

            }
        });
    }
}



// ALERTA
export function HandleAlerta(data, type){
    return function(dispatch){
        dispatch(TypeAlerta(type))
        dispatch(MessageAlerta(data))
        
    }
    
}
// ALERTA
export function MessageAlerta(data){
    return {
        type: types.ALERTA,
        payload: data,
    }
}
export function TypeAlerta(type){
    return {
        type: types.TYPE_ALERTA,
        payload: type
    }
}


// PROVEEDORES
// ----------------------
export function getProviders(data){
    return {
        type: types.GET_PROVIDERS,
        payload: data
    }
}
export function gettingProviders(carga){
    return {
        type: types.GETTING_PROVIDERS,
        payload: carga
    }
}

export function axiosToGetProviders(carga){
    return function(dispatch){ 
        dispatch(gettingProviders(carga))
        axios.get(`/api/proveedores/get`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getProviders(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getProviders('notrequest'));
            }else{
                return dispatch(getProviders(404))

            }
        });
    }
}

// PROVEEDOR
export function getProvider(data){
    return {
        type: types.GET_PROVIDER,
        payload: data
    }
}
export function gettingProvider(carga){
    return {
        type: types.GETTING_PROVIDER,
        payload: carga
    }
}

export function axiosToGetProvider(carga, ruta){
    return function(dispatch){ 
        dispatch(gettingProvider(carga))
        axios.get(`/api/proveedores/getOne/${ruta}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getProvider(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getProvider('notrequest'));
            }else{
                return dispatch(getProvider(404))

            }
        });
    }
}





// PRIMAS
// ----------------------
export function getPrimas(data){
    return {
        type: types.GET_PRIMAS,
        payload: data
    }
}
export function gettingPrimas(carga){
    return {
        type: types.GETTING_PRIMAS,
        payload: carga
    }
}

export function axiosToGetPrimas(carga){
    return function(dispatch){ 
        dispatch(gettingPrimas(carga))
        axios.get(`/api/materia/search`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getPrimas(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getPrimas(404));
            }else{
                return dispatch(getPrimas(404))

            }
        });
    }
}


export function getPrima(data){
    return {
        type: types.GET_PRIMA,
        payload: data
    }
}
export function gettingPrima(carga){
    return {
        type: types.GETTING_PRIMA,
        payload: carga
    }
}

export function axiosToGetPrima(carga, id){
    return function(dispatch){ 
        dispatch(gettingPrima(carga))
        axios.get(`/api/materia/get/${id}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getPrima(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getPrima('notrequest'));
            }else{
                return dispatch(getPrima(404))

            }
        });
    }
}









// KITS
// ----------------------
export function getKits(data){
    return {
        type: types.GET_KITS,
        payload: data
    }
}
export function gettingKits(carga){
    return {
        type: types.GETTING_KITS,
        payload: carga
    }
}

export function axiosToGetKits(carga){
    return function(dispatch){ 
        dispatch(gettingKits(carga))
        axios.get(`/api/kit/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getKits(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getKits('notrequest'));
            }else{
                return dispatch(getKits(404))

            }
        });
    }
}

export function axiosToGetKitsCompleted(carga){
    return function(dispatch){ 
        dispatch(gettingKits(carga))
        axios.get(`/api/kit/getAllComplete`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getKits(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getKits('notrequest'));
            }else{
                return dispatch(getKits(404))

            }
        });
    }
}


export function getKit(data){
    return {
        type: types.GET_KIT,
        payload: data
    }
}
export function gettingKit(carga){
    return {
        type: types.GETTING_KIT,
        payload: carga
    }
}

export function axiosToGetKit(carga, id){
    return function(dispatch){ 
        dispatch(gettingKit(carga))
        axios.get(`/api/kit/get/${id}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getKit(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getKit('notrequest'));
            }else{
                return dispatch(getKit(404))

            }
        });
    }
}






// COTIZACIONES
// ----------------------
export function getCotizaciones(data){
    return {
        type: types.GET_COTIZACIONES,
        payload: data
    }
}
export function gettingCotizaciones(carga){
    return {
        type: types.GETTING_COTIZACIONES,
        payload: carga
    }
}

export function axiosToGetCotizaciones(carga){
    return function(dispatch){ 
        dispatch(gettingCotizaciones(carga))
        axios.get(`/api/cotizacion/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getCotizaciones(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getCotizaciones('notrequest'));
            }else{
                return dispatch(getCotizaciones(404))

            }
        });
    }
}


export function getCotizacion(data){
    return {
        type: types.GET_COTIZACION,
        payload: data
    }
}
export function gettingCotizacion(carga){
    return {
        type: types.GETTING_COTIZACION,
        payload: carga
    }
}

export function axiosToGetCotizacion(carga, id){
    return function(dispatch){ 
        dispatch(gettingCotizacion(carga))
        axios.get(`/api/cotizacion/get/${id}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getCotizacion(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getCotizacion('notrequest'));
            }else{
                return dispatch(getCotizacion(404))

            }
        });
    }
}



// REQUISICIONES
export function getRequisicions(data){
    return {
        type: types.GET_REQUISICIONS,
        payload: data
    }
}
export function gettingRequisicions(carga){
    return {
        type: types.GETTING_REQUISICIONS,
        payload: carga
    }
}

export function axiosToGetRequisicions(carga){
    return function(dispatch){ 
        dispatch(gettingRequisicions(carga))
        axios.get(`/api/requisicion/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getRequisicions(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getRequisicions('notrequest'));
            }else{
                return dispatch(getRequisicions(404))

            }
        });
    }
}

export function getRequisicion(data){
    return {
        type: types.GET_REQUISICION,
        payload: data
    }
}
export function gettingRequisicion(carga){
    return {
        type: types.GETTING_REQUISICION,
        payload: carga
    }
}

export function axiosToGetRequisicion(carga, reqId){
    return function(dispatch){ 
        dispatch(gettingRequisicion(carga))
        axios.get(`/api/requisicion/get/${reqId}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getRequisicion(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getRequisicion('notrequest'));
            }else{
                return dispatch(getRequisicion(404))

            }
        });
    }
}