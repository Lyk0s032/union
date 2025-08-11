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


// PORCENTAJES
// ----------------------
export function getPorcentajes(data){
    return {
        type: types.GET_PORCENTAJES,
        payload: data
    }
}
export function gettingPorcentajes(carga){
    return {
        type: types.GETTING_PORCENTAJES,
        payload: carga
    }
}

export function axiosToGetPorcentajes(carga){
    return function(dispatch){ 
        dispatch(gettingPorcentajes(carga))
        axios.get(`/api/lineas/get/porcentajes`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getPorcentajes(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getPorcentajes('notrequest'));
            }else{
                return dispatch(getPorcentajes(404))

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


// PRODUCTOS
// ----------------------
export function getProductos(data){
    return {
        type: types.GET_PRODUCTOS,
        payload: data
    }
}
export function gettingProductos(carga){
    return {
        type: types.GETTING_PRODUCTOS,
        payload: carga
    }
}
 
export function axiosToGetProductos(carga){
    return function(dispatch){ 
        dispatch(gettingProductos(carga))
        axios.get(`/api/materia/producto/search`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getProductos(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getProductos(404));
            }else{
                return dispatch(getProductos(404))

            }
        });
    }
}


export function getProducto(data){
    return {
        type: types.GET_PRODUCTO,
        payload: data
    }
}
export function gettingProducto(carga){
    return {
        type: types.GETTING_PRODUCTO,
        payload: carga
    }
}

export function axiosToGetProducto(carga, id){
    return function(dispatch){ 
        dispatch(gettingProducto(carga))
        axios.get(`/api/materia/producto/get/${id}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getProducto(inf))
        }) 
        .catch((e) => { 
            console.log(e)
            if(e.request){
                return dispatch(getProducto('notrequest'));
            }else{
                return dispatch(getProducto(404))

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


// SUPERKITS
// ----------------------
export function getSuperKits(data){
    return {
        type: types.GET_SUPERKITS,
        payload: data
    }
}
export function gettingSuperKits(carga){
    return {
        type: types.GETTING_SUPERKITS,
        payload: carga
    } 
}

export function axiosToGetSuperKits(carga){
    return function(dispatch){ 
        dispatch(gettingSuperKits(carga))
        axios.get(`/api/superkit/getAll`)
        .then((info) => info.data) 
        .then(inf => { 
            return dispatch(getSuperKits(inf))
        }) 
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getSuperKits('notrequest'));
            }else{
                return dispatch(getSuperKits(404))
            }
        });
    }
}


export function getSuperKit(data){
    return {
        type: types.GET_SUPERKIT,
        payload: data
    }
}
export function gettingSuperKit(carga){
    return { 
        type: types.GETTING_SUPERKIT,
        payload: carga
    } 
}

export function axiosToGetSuperKit(carga, spkit){
    return function(dispatch){ 
        dispatch(gettingSuperKit(carga))
        axios.get(`/api/superkit/get/${spkit}`)
        .then((info) => info.data) 
        .then(inf => { 
            return dispatch(getSuperKit(inf))
        }) 
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getSuperKit('notrequest'));
            }else{
                return dispatch(getSuperKit(404))
            }
        });
    }
}




// CONDICIONES
// ------------------------------
export function getCondiciones(data){
    return {
        type: types.GET_CONDICIONES,
        payload: data
    }
}
export function gettingCondiciones(carga){
    return {
        type: types.GETTING_CONDICIONES,
        payload: carga
    }
}

export function axiosToGetCondiciones(carga){
    return function(dispatch){ 
        dispatch(gettingCondiciones(carga))
        axios.get(`/api/cotizacion/condiciones/get/all`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getCondiciones(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getCondiciones('notrequest'));
            }else{
                return dispatch(getCondiciones(404))

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

export function axiosToGetCotizaciones(carga, userId){
    return function(dispatch){ 
        dispatch(gettingCotizaciones(carga))
        axios.get(`/api/cotizacion/getAll/${userId}`)
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





// PROVEEDORES
// ----------------------
export function getClients(data){
    return {
        type: types.GET_CLIENTS,
        payload: data
    }
}
export function gettingClients(carga){
    return {
        type: types.GETTING_CLIENTS,
        payload: carga
    }
}

export function axiosToGetClients(carga){
    return function(dispatch){  
        dispatch(gettingClients(carga))
        axios.get(`/api/client/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getClients(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getClients('notrequest'));
            }else{
                return dispatch(getClients(404))

            }
        });
    }
}

// PROVEEDOR
export function getClient(data){
    return {
        type: types.GET_CLIENT,
        payload: data
    }
}
export function gettingClient(carga){
    return {
        type: types.GETTING_CLIENT,
        payload: carga
    }
}

export function axiosToGetClient(carga, ruta){
    return function(dispatch){ 
        dispatch(gettingClient(carga))
        axios.get(`/api/proveedores/getOne/${ruta}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getClient(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getClient('notrequest'));
            }else{
                return dispatch(getClient(404))

            }
        });
    }
}

// ADMINISTRACIÓN
// CONDICIONES
// ------------------------------
export function getGraphProducto(data){
    return {
        type: types.GET_GRAPH_PRODUCTO,
        payload: data
    }
}
export function gettingGraphProducto(carga){
    return {
        type: types.GETTING_GRAPH_PRODUCTO,
        payload: carga
    }
}

export function axiosToGetGraphProducto(carga, ahora, atras, categoriaId, lineaId){
    return function(dispatch){ 
        dispatch(gettingGraphProducto(carga))
         const queryParams = {
            categoriaId: categoriaId || undefined,
            lineaId: lineaId || undefined,  
        }; 
        axios.get(`/api/materia/producto/get/graph/groups/${ahora}/${atras}`, {params: queryParams})
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getGraphProducto(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getGraphProducto('notrequest'));
            }else{
                return dispatch(getGraphProducto(404))
            }
        });
    }
}

// OK
export function getProduccionKits(data){
    return {
        type: types.GET_PRODUCCION,
        payload: data
    }
}
export function gettingProduccionKits(carga){
    return {
        type: types.GETTING_PRODUCCION,
        payload: carga
    }
}

export function axiosToGetProduccionKits(carga){
    return function(dispatch){ 
        dispatch(gettingProduccionKits(carga))
        axios.get(`/api/kit/get/administration/kits`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getProduccionKits(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getProduccionKits('notrequest'));
            }else{
                return dispatch(getProduccionKits(404))
            }
        });
    }
}


export function getGraphKits(data){
    return {
        type: types.GET_GRAPH_KITS,
        payload: data
    }
}
export function gettingGraphKits(carga){
    return {
        type: types.GETTING_GRAPH_KITS,
        payload: carga
    }
}

export function axiosToGetGraphKits(carga, ahora, atras, categoriaId, lineaId, extensionId){
    return function(dispatch){ 
        dispatch(gettingGraphKits(carga))
         const queryParams = {
            categoriaId: categoriaId || undefined,
            lineaId: lineaId || undefined, 
            extensionId: extensionId || undefined 
        }; 
        axios.get(`/api/kit/get/graph/groups/${ahora}/${atras}`, {params: queryParams})
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getGraphKits(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getGraphKits('notrequest'));
            }else{
                return dispatch(getGraphKits(404))
            }
        });
    }
}



export function getCotizacionesAdmin(data){
    return {
        type: types.GET_COTIZACIONES_ADMIN,
        payload: data
    }
}
export function gettingCotizacionesAdmin(carga){
    return {
        type: types.GETTING_COTIZACIONES_ADMIN,
        payload: carga
    }
}

export function axiosToGetCotizacionesAdmin(carga){
    return function(dispatch){ 
        dispatch(gettingCotizacionesAdmin(carga))
        axios.get(`/api/cotizacion/admin/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getCotizacionesAdmin(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getCotizacionesAdmin('notrequest'));
            }else{
                return dispatch(getCotizacionesAdmin(404))
            }
        });
    }
}


export function getCotizacionesProduccion(data){
    return {
        type: types.GET_COTIZACIONES_PRODUCCION,
        payload: data
    }
}
export function gettingCotizacionesProduccion(carga){
    return {
        type: types.GETTING_COTIZACIONES_PRODUCCION,
        payload: carga
    }
}

export function axiosToGetCotizacionesProduccion(carga){
    return function(dispatch){ 
        dispatch(gettingCotizacionesAdmin(carga))
        axios.get(`/api/cotizacion/admin/produccion/getAll`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(gettingCotizacionesProduccion(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getCotizacionesProduccion('notrequest'));
            }else{
                return dispatch(getCotizacionesProduccion(404))
            }
        });
    }
}


// Peticiones
export function getRequerimientos(data){
    return {
        type: types.GET_REQUERIMIENTOS,
        payload: data
    }
}
export function gettingRequerimiento(carga){
    return {
        type: types.GETTING_REQUERIMIENTOS,
        payload: carga
    }
}

export function axiosToGetRequerimientos(carga){
    return function(dispatch){ 
        dispatch(gettingRequerimiento(carga))
        axios.get(`/api/kit/requerimientos/get/all`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getRequerimientos(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getRequerimientos('notrequest'));
            }else{
                return dispatch(getRequerimientos(404))
            }
        });
    }
}

export function getRequerimiento(data){
    return {
        type: types.GET_REQUERIMIENTO,
        payload: data
    }
}
export function gettingRequerimient(carga){
    return {
        type: types.GETTING_REQUERIMIENTO,
        payload: carga
    }
}

export function axiosToGetRequerimiento(carga, reqId){
    return function(dispatch){ 
        dispatch(gettingRequerimient(carga))
        axios.get(`/api/kit/requerimiento/get/one/${reqId}`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getRequerimiento(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getRequerimiento('notrequest'));
            }else{
                return dispatch(getRequerimiento(404))
            }
        });
    }
}