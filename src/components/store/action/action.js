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

export function getIDs(data){
    return {
        type: types.GET_IDS,
        payload: data
    }
}



export function getProyectos(data){
    return {
        type: types.GET_PROYECTOS_REQUISICION,
        payload: data
    }
}

export function getMaterias(data){
    return {
        type: types.GET_MATERIA_PRIMA_REQUISICION,
        payload: data
    }
}
export function getKitsRequisicion(data){
    return {
        type: types.GET_KITS_REQUISICION,
        payload: data
    }
}

// Acción para obtener proyectos reales de requisiciones
export function axiosToGetRealProyectosRequisicion(ids){
    return function(dispatch){
        dispatch(gettingRealProyectosRequisicion(true));
        axios.post('/api/requisicion/get/req/multipleReal/', { ids })
        .then((res) => {
            dispatch(getRealProyectosRequisicion(res.data));
            dispatch(gettingRealProyectosRequisicion(false));
            console.log('res.data', res.data);
        })
        .catch((err) => {
            console.error('Error al obtener proyectos de requisiciones:', err);
            dispatch(gettingRealProyectosRequisicion(false));
        });
    }
}

export function getRealProyectosRequisicion(data){
    return {
        type: types.GET_REAL_PROYECTOS_REQUISICION,
        payload: data
    }
}

export function gettingRealProyectosRequisicion(carga){
    return {
        type: types.GETTING_REAL_PROYECTOS_REQUISICION,
        payload: carga
    }
}

// Acción para obtener detalles de materia prima
export function getMateriaPrimaRequisicion(data){
    return {
        type: types.GET_UNA_MATERIA_PRIMA_REQUISICION,
        payload: data
    }
}

export function gettingMateriaPrimaRequisicion(carga){
    return {
        type: types.GETTING_MATERIA_PRIMA_REQUISICION,
        payload: carga
    }
}

export function axiosToGetMateriaPrimaRequisicion(itemId){
    return function(dispatch){
        dispatch(gettingMateriaPrimaRequisicion(true));
        axios.post('/api/requisicion/get/materiales/materia/', { id: itemId })
        .then((res) => {
            dispatch(getMateriaPrimaRequisicion(res.data));
            dispatch(gettingMateriaPrimaRequisicion(false));
        })
        .catch((err) => {
            console.error('Error al obtener materia prima:', err);
            dispatch(gettingMateriaPrimaRequisicion(false));
        });
    }
}

// Acción para obtener detalles de producto terminado
export function getProductoTerminadoRequisicion(data){
    return {
        type: types.GET_PRODUCTO_TERMINADO_REQUISICION,
        payload: data
    }
}

export function gettingProductoTerminadoRequisicion(carga){
    return {
        type: types.GETTING_PRODUCTO_TERMINADO_REQUISICION,
        payload: carga
    }
}

export function axiosToGetProductoTerminadoRequisicion(itemId){
    return function(dispatch){
        dispatch(gettingProductoTerminadoRequisicion(true));
        axios.post('/api/requisicion/get/materiales/producto/', { id: itemId })
        .then((res) => {
            dispatch(getProductoTerminadoRequisicion(res.data));
            dispatch(gettingProductoTerminadoRequisicion(false));
        })
        .catch((err) => {
            console.error('Error al obtener producto terminado:', err);
            dispatch(gettingProductoTerminadoRequisicion(false));
        });
    }
}

export function getCotizacionesCompras(data){
    return {
        type: types.GET_COMPRAS_COTIZACIONES,
        payload: data
    }
}

export function axiosToGetCotizacionesCompras(ids){
    return function(dispatch){
        const body = {
            proyectos: ids
        };
        axios.post('/api/requisicion/post/get/cotizaciones/', body)
        .then((res) => {
            dispatch(getCotizacionesCompras(res.data));
        })
        .catch((err) => {
            console.error('Error al obtener cotizaciones de compras:', err);
            dispatch(getCotizacionesCompras(null));
        });
    }
}

export function getItemRequisicion(data){
    return {
        type: types.GET_UNA_MATERIA_PRIMA_REQUISICION,
        payload: data
    }
}

export function gettingItemRequisicion(data){
    return {
        type: types.GETTING_UNA_MATERIA_PRIMA_REQUISICION,
        payload: data
    }
}

export function getProveedoresArrays(data){
    return {
        type: types.GET_PROVEEDORES_ARRAY,
        payload: data
    }
}

export function getMateriasIds(data){
    return {
        type: types.GET_MATERIAS_IDS,
        payload: data
    }
} 

export function getItemsForCotizacion(data){
    return {
        type: types.GET_ITEMS_COTIZACION,
        payload: data
    }
}
export function cleanItemsForCotizacion(){
    return {
        type: types.CLEAN_ITEMS_COTIZACION,
        payload: null
    }
}
export function limpiarIds(data){
    return {
        type: 'GET_LIMPIAR_MATERIAS_IDS',
        payload: data
    }
}

export function getCotizacionFast(data){
    return {
        type: types.GET_COTIZACION_FAST,
        payload: data
    }
}

export function gettingCotizacionFast(data){
    return {
        type: types.GETTING_COTIZACION_FAST,
        payload: data
    }
}

export function GetConsolidatoProyect(valor){
    return {
        type: types.GET_VALOR_REAL_COTIZACIONES,
        payload: valor
    }
}

export function GetConsolidatoProyectProducto(valor){
    return {
        type: types.GET_VALOR_REAL_PRODUCTO,
        payload: valor
    }
}
export function CleanFaltanteProject(){
    return {
        type: 'CLEAN_FALTANTE',
        payload: 0
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

// ADMINISTRACIÓN - COMPRAS
export function getOrdenesCompras(data){
    return {
        type: types.GET_ORDENES_COMPRAS,
        payload: data
    }
}
export function gettingOrdenesCompras(carga){
    return {
        type: types.GETTING_ORDENES_COMPRAS,
        payload: carga
    }
}

export function axiosToGetOrdenesComprasAdmin(carga){
    return function(dispatch){ 
        dispatch(gettingOrdenesCompras(carga))
        axios.get(`/api/requisicion/get/get/admin/ordenesDeCompra`)
        .then((info) => info.data) 
        .then(inf => {
            return dispatch(getOrdenesCompras(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getOrdenesCompras('notrequest'));
            }else{
                return dispatch(getOrdenesCompras(404))
            }
        });
    }
}

export function getDataOrdenesCompras(data){
    return {
        type: types.GET_COMPRAS,
        payload: data
    }
}
export function gettingDataOrdenesCompras(carga){
    return {
        type: types.GETTING_COMPRAS,
        payload: carga
    }
}


// Para almacen
export function axiosToGetDataOrdenesAlmacen(carga, ruta){
    return function(dispatch){ 
        dispatch(gettingDataOrdenesCompras(carga))
        axios.get(`/api/requisicion/get/filter/compras/getAllOrden${ruta ? ruta : ''}`)
        .then((info) => info.data) 
        .then(inf => {
            console.log(`/api/requisicion/get/filter/compras/getAllOrden${ruta ? ruta : ''}`)
            return dispatch(getDataOrdenesCompras(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getDataOrdenesCompras('notrequest'));
            }else{
                return dispatch(getDataOrdenesCompras(404))
            }
        });
    }
}


export function getOrdenCompras(data){
    return {
        type: types.GET_ORDEN_COMPRAS,
        payload: data
    }
}
export function gettingOrdenCompras(carga){
    return {
        type: types.GETTING_ORDEN_COMPRAS,
        payload: carga
    } 
}

export function axiosToGetOrdenComprasAdmin(carga, ordenId){
    return function(dispatch){ 
        dispatch(gettingOrdenCompras(carga))
        axios.get(`/api/requisicion/get/get/admin/ordenDeCompra/${ordenId}`)
        .then((info) => info.data) 
        .then(inf => {
            console.log(inf)
            return dispatch(getOrdenCompras(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getOrdenCompras('notrequest'));
            }else{
                return dispatch(getOrdenCompras(404))
            }
        });
    }
}

// Para almacen
export function axiosToGetOrdenAlmacen(carga, ordenId){
    return function(dispatch){ 
        dispatch(gettingOrdenCompras(carga))
        axios.get(`/api/inventario/get/ordenesCompra/one/${ordenId}`)
        .then((info) => info.data) 
        .then(inf => {
            console.log(inf)
            return dispatch(getOrdenCompras(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getOrdenCompras('notrequest'));
            }else{
                return dispatch(getOrdenCompras(404))
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



// ---------------------------------
// --------------------------------
// Almacen
// ---------------------------------
// ---------------------------------

export function getCabeceras(data){
    return {
        type: types.GET_CABECERAS,
        payload: data
    }
}
export function gettingCabeceras(carga){
    return {
        type: types.GETTING_CABECERAS,
        payload: carga
    }
}

export function axiosToGetCabeceras(carga, data){
    console.log('llega acá')
    return function(dispatch){ 
        dispatch(gettingCabeceras(carga))
        let body = {
            bodegas: data
        }
        axios.post(`/api/inventario/post/get/bodegasData`, body)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getCabeceras(inf))
            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getCabeceras('notrequest'));
            }else{
                return dispatch(getCabeceras(404))
            }
        });
    }
}


// ITEMS DENTRO DE UNA BODEGA
export function getProductosBodega(data){
    return {
        type: types.GET_PRODUCTOS_BODEGA,
        payload: data
    }
}
export function gettingProductosBodega(carga){
    return {
        type: types.GETTING_PRODUCTOS_BODEGA,
        payload: carga
    }
}

export function axiosToGetProductosBodega(carga, bodegaId){
    return function(dispatch){ 
        dispatch(gettingProductosBodega(carga))
        axios.get(`/api/inventario/get/bodegas/items/${bodegaId}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getProductosBodega(inf))
            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getProductosBodega('notrequest'));
            }else{
                return dispatch(getProductosBodega(404))
            }
        });
    }
}

// FUNCION PARA OBTENER LOS ITEMS POR BODEGA Y PAGINACIÒN
export function axiosToGetProductosBodegaPlus(carga, bodegaId, page = 1, limit = 50, tipo = null) {
  return function(dispatch) {
    dispatch(gettingProductosBodega(carga));

    // construir query params
    const params = new URLSearchParams();
    if (bodegaId !== undefined && bodegaId !== null) params.append('ubicacionId', bodegaId);
    params.append('page', page);
    params.append('limit', limit);
    if (tipo) params.append('tipo', tipo); // opcional: 'MP' o 'PR'

    axios.get(`/api/inventario/get/plus/bodegas?${params.toString()}`)
      .then(res => res.data)
      .then(inf => {
        dispatch(getProductosBodega(inf));
        console.log('productosBodega:', inf);
        return inf;
      })
      .catch((e) => {
        console.log('Error axiosToGetProductosBodega:', e);
        if (e.request) {
          dispatch(getProductosBodega('notrequest'));
        } else {
          dispatch(getProductosBodega(404));
        }
      });
  };
}

// Obtener stock por bodega (usa endpoint /api/stock/bodega/:ubicacionId)
export function axiosToGetStockBodega(carga, ubicacionId, page = 1, limit = 50, tipo = null) {
  return function(dispatch) {
    dispatch(gettingProductosBodega(carga));
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (tipo) params.tipo = tipo;

    axios.get(`/api/stock/bodega/${ubicacionId}`, { params })
      .then(res => res.data)
      .then(inf => {
        // la API retorna { ok: true, page, limit, total, pages, data }
        dispatch(getProductosBodega(inf));
        console.log('stockBodega:', inf);
        return inf;
      })
      .catch(e => {
        console.log('Error axiosToGetStockBodega:', e);
        if (e.request) dispatch(getProductosBodega('notrequest'));
        else dispatch(getProductosBodega(404));
      });
  };
}

export async function getFuncionesBodegas(carga, body){
    return function(dispatch){
        dispatch(axiosToGetCabeceras(carga, body))
    }
}


// MOVIMIENTOS
// ITEMS DENTRO DE UNA BODEGA
export function getMovimientosBodega(data){
    return {
        type: types.GET_MOVIMIENTOS_BODEGA,
        payload: data
    }
}
export function gettingMovimientosBodega(carga){
    return {
        type: types.GETTING_MOVIMIENTOS_BODEGA,
        payload: carga
    }
}

export function axiosToGetMovimientosBodega(carga, bodegaId){
    return function(dispatch){ 
        dispatch(gettingMovimientosBodega(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/bodegas/movimientos/${bodegaId}`)
        .then((info) => info.data) 
        .then(inf => {
             return dispatch(getMovimientosBodega(inf))
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getMovimientosBodega('notrequest'));
            }else{
                return dispatch(getMovimientosBodega(404))
            }
        });
    }
}


// OBTENER UN ITEM

// MOVIMIENTOS
// ITEMS DENTRO DE UNA BODEGA
export function getItem(data){
    return {
        type: types.GET_ITEM,
        payload: data
    }
}
export function gettingItem(carga){
    return {
        type: types.GETTING_ITEM,
        payload: carga
    }
}

export function axiosToGetItemMateriaPrima(carga, materiaId){
    return function(dispatch){  
        dispatch(gettingItem(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/bodega/materia/one/${materiaId}/1`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getItem(inf))

            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getItem('notrequest'));
            }else{
                return dispatch(getItem(404))
            }
        });
    }
}

// FUNCION PARA OBTENER UN ITEM EN ESPECIFICO EN UNA BODEGA
export function axiosToGetItemInventarioPlus(carga, materiaId = null, ubicacionId = 1, productoId = null, pageMov = 1, limitMov = 20) {
  return function(dispatch) {
    dispatch(gettingItem(carga));
    console.log('Entra a la consola - get item inventario');

    // Construir query params de forma segura
    const params = new URLSearchParams();
    if (materiaId) params.append('materiumId', materiaId);
    if (productoId) params.append('productoId', productoId);
    // ubicacionId es obligatorio para esta llamada en tu nuevo endpoint
    params.append('ubicacionId', ubicacionId);
    // Parámetros de paginación para movimientos
    params.append('pageMov', pageMov);
    params.append('limitMov', limitMov);

    const url = `/api/inventario/get/plus/item?${params.toString()}`;

    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        dispatch(getItem(inf));
        console.log('Item inventario recibido:', inf);
        return inf;
      })
      .catch((e) => {
        console.log('Error axiosToGetItemInventarioPlus:', e);
        if (e.request) {
          return dispatch(getItem('notrequest'));
        } else {
          return dispatch(getItem(404));
        }
      });
  };
}

// Para productos en item
export function axiosToGetItemProducto(carga, materiaId, bodegaId){
    return function(dispatch){  
        dispatch(gettingItem(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/bodega/producto/one/${materiaId}/${bodegaId}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getItem(inf))

            return console.log('busqueda por productoo',inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getItem('notrequest'));
            }else{
                return dispatch(getItem(404))
            }
        });
    }
}


export function getItemBodega(data){
    return {
        type: types.GET_ITEM_BODEGA,
        payload: data
    }
}
export function gettingItemBodega(carga){
    return {
        type: types.GETTING_ITEM_BODEGA,
        payload: carga
    }
}

export function axiosToGetItemMateriaPrimaBodega(carga, materiaId, bodega){
    return function(dispatch){  
        dispatch(gettingItemBodega(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/bodega/materia/data/${materiaId}/${bodega}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getItemBodega(inf))
            
            return console.log('busquedaa ',inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getItemBodega('notrequest'));
            }else{
                return dispatch(getItemBodega(404))
            }
        });
    }
}
// OBtener materia prima por proyecto
export function axiosToGetItemMateriaPrimaBodegaProyecto(carga, materiaId, proyecto){
    return function(dispatch){  
        dispatch(gettingItemBodega(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/bodega/materia/data/cotizacion/${materiaId}/${proyecto}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getItemBodega(inf)) 
            
            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getItemBodega('notrequest'));
            }else{
                return dispatch(getItemBodega(404))
            }
        });
    }
}

// Obtener producto por proyecto
export function axiosToGetItemProductoTerminadoBodega(carga, productoId, bodega){
    return function(dispatch){  
        dispatch(gettingItemBodega(carga))
        console.log('Entra a la consola')  
        console.log('consulta esta funcion')
        axios.get(`/api/inventario/get/bodega/producto/data/${productoId}/${bodega}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getItemBodega(inf))
            
            return console.log('busquedaa ',inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getItemBodega('notrequest'));
            }else{
                return dispatch(getItemBodega(404))
            }
        });
    }
}

// OBTENEMOS LAS ORDENES PARA INGRESAR AL ALMACEN
export function getOrdenesAlmacen(data){
    return {
        type: types.GET_ORDENES,
        payload: data
    }
}
export function gettingOrdenesAlmacen(carga){
    return {
        type: types.GETTING_ORDENES,
        payload: carga
    }
}

export function axiosToGetOrdenesAlmacen(carga){
    return function(dispatch){  
        dispatch(gettingOrdenesAlmacen(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/ordenesCompra/all`)
        .then((info) => info.data) 
        .then(inf => {
            console.log('carga de ordenes', inf)
             dispatch(getOrdenesAlmacen(inf))

            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getOrdenesAlmacen('notrequest'));
            }else{
                return dispatch(getOrdenesAlmacen(404))
            }
        });
    }
}

// PROYECTOS ALMACÉN
export function getProjects(data){
    return {
        type: types.GET_PROJECTS,
        payload: data
    }
}
export function gettingProjects(carga){
    return {
        type: types.GETTING_PROJECTS,
        payload: carga
    }
}

export function axiosToGetProjects(carga){
    return function(dispatch){  
        dispatch(gettingProjects(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/almacen/proyectos/todo`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getProjects(inf))

            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getProjects('notrequest'));
            }else{
                return dispatch(getProjects(404))
            }
        });
    }
}

export function getProject(data){
    return {
        type: types.GET_PROJECT,
        payload: data
    }
}
export function gettingProject(carga){
    return {
        type: types.GETTING_PROJECT,
        payload: carga
    }
}

export function axiosToGetProject(carga, cotizacionId){
    return function(dispatch){  
        dispatch(gettingProject(carga))
        console.log('Entra a la consola')  
        axios.get(`/api/inventario/get/almacen/proyecto/one/${cotizacionId}`)
        .then((info) => info.data) 
        .then(inf => {
             dispatch(getProject(inf))

            return console.log(inf)
        })
        .catch((e) => {
            console.log(e)
            if(e.request){
                return dispatch(getProject('notrequest'));
            }else{
                return dispatch(getProject(404))
            }
        });
    }
}

export function getItemToProject(data){
    return {
        type: types.GET_ITEM_TO_PROJECT,
        payload: data
    }
}

export function gettingItemToProject(carga){
    return {
        type: types.GETTING_ITEM_TO_PROJECT,
        payload: carga
    }
}

export function axiosToGetItemProjectPlus(carga, materiaId = null, ubicacionId = 1, productoId = null) {
  return function(dispatch) {
    dispatch(gettingItemToProject(carga));
    console.log('Entra a la consola - get item inventario');

    // Construir query params de forma segura
    const params = new URLSearchParams();
    if (materiaId) params.append('materiumId', materiaId);
    if (productoId) params.append('productoId', productoId);
    // ubicacionId es obligatorio para esta llamada en tu nuevo endpoint
    params.append('ubicacionId', ubicacionId);

    const url = `/api/inventario/get/plus/item?${params.toString()}`;
    console.log(url)
    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        dispatch(getItemToProject(inf));
        console.log('Item inventario recibido:', inf);
        return inf;
      })
      .catch((e) => {
        console.log('Error axiosToGetItemInventarioPlus:', e);
        if (e.request) {
          return dispatch(getItemToProject('notrequest'));
        } else {
          return dispatch(getItemToProject(404));
        }
      });
  };
}





// PRODUCCIÓN
export function getItemProduction(data){
    return {
        type: types.GET_PRODUCTION_ITEM,
        payload: data
    }
}

export function gettingItemProduction(carga){
    return {
        type: types.GETTING_PRODUCTION_ITEM,
        payload: carga
    }
}

export function axiosToGetItemProduction(carga, requisicion) {
  return function(dispatch) {
    dispatch(gettingItemProduction(carga));

    const url = `/api/requisicion/get/produccion/project/${requisicion}`;
    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        dispatch(getItemProduction(inf));
        return inf;
      })
      .catch((e) => {
        console.log('Error axiosToGetItemInventarioPlus:', e);
        if (e.request) {
          return dispatch(getItemProduction('notrequest'));
        } else {
          return dispatch(getItemProduction(404));
        }
      });
  };
}




export function getItemElemento(data){
    return {
        type: types.GET_ITEM_ELEMENTO,
        payload: data
    }
}

export function gettingItemElemento(carga){
    return {
        type: types.GETTING_ITEM_ELEMENTO,
        payload: carga
    }
}

export function axiosToGetItemElemento(carga, requisicionId,  kitId = null, productId = null) {
  return function(dispatch) {
    dispatch(gettingItemElemento(carga));
    console.log('Entra a la consola - get item inventario');

    // Construir query params de forma segura
    const params = new URLSearchParams();
    if (kitId) params.append('kitId', kitId);
    if (productId) params.append('productId', productId);
    // ubicacionId es obligatorio para esta llamada en tu nuevo endpoint
    params.append('requisicionId', requisicionId);

    const url = `/api/requisicion//get/produccion/project/items/watch/?${params.toString()}`;

    console.log(url)
    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        console.log()
        dispatch(getItemElemento(inf));
        console.log('Item produccion recibido:', inf);
        return inf;
      })
      .catch((e) => {
        console.log('Error fallo la consulta:', e);
        if (e.request) {
          return dispatch(getItemElemento('notrequest'));
        } else {
          return dispatch(getItemElemento(404));
        }
      });
  };
}

// ============================================
// REMISIONES ACTIONS
// ============================================

export function getRemisiones(carga) {
  return {
    type: types.GET_REMISIONES,
    payload: carga
  }
}

export function gettingRemisiones(carga) {
  return {
    type: types.GETTING_REMISIONES,
    payload: carga
  }
}

export function axiosToGetRemisiones(carga, page = 1) {
  return function(dispatch) {
    dispatch(gettingRemisiones(carga));

    const url = `/api/remision/get/all?page=${page}`;
    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        dispatch(getRemisiones(inf));
        return inf;
      })
      .catch((e) => {
        console.log('[REMISIONES] Error al cargar:', e);
        if (e.request) {
          return dispatch(getRemisiones('notrequest'));
        } else {
          return dispatch(getRemisiones(404));
        }
      });
  };
}

export function getRemision(carga) {
  return {
    type: types.GET_REMISION,
    payload: carga
  }
}

export function gettingRemision(carga) {
  return {
    type: types.GETTING_REMISION,
    payload: carga
  }
}

export function axiosToGetRemision(carga, numeroRemision) {
  return function(dispatch) {
    dispatch(gettingRemision(carga));

    const url = `/api/remision/get/${numeroRemision}`;
    axios.get(url)
      .then(res => res.data)
      .then(inf => {
        dispatch(getRemision(inf));
        return inf;
      })
      .catch((e) => {
        console.log('[REMISION] Error al cargar:', e);
        if (e.request) {
          return dispatch(getRemision('notrequest'));
        } else {
          return dispatch(getRemision(404));
        }
      });
  };
}