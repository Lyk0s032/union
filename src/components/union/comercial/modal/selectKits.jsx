import React, { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemToSelect from './itemToSelect';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import SelectedKits from './selected';
import SearchKitsComercial from './searchKits';
import axios from 'axios';
import SearchSuperKitsComercial from './superKits';
import SearchProductoTerminado from './productoTerminado';
import { BsPencil, BsPlus, BsPlusLg } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import MoveArea from './moveArea';
import AddNotes from './addNotesAndImg';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español
import Condiciones from './condiciones';


export default function SelectKits({ dist }){
    const cotizacions = useSelector(store => store.cotizacions);
    const [params, setParams] = useSearchParams();
    const { cotizacion, loadingCotizacion } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [area, setArea] = useState(null); 
    const [edit, setEdit] = useState(false);
    const [time, setTime] = useState(cotizacion && cotizacion != 404 && cotizacion != 'notrequest' ? cotizacion.time.split('T')[0] : null) 
    const [openServices, setOpenServices] = useState(null);
    // Datos para actualizar cotizacion
    const [editTime, setEditTime] = useState(null);
    const [title, setTitle] = useState(cotizacion && cotizacion != 404 && cotizacion != 'notrequest' ? cotizacion.name : null)
    const [name, setName] = useState(null);
    const [condiciones, setCondiciones] = useState(null)
    const [loading, setLoading] = useState(false);
    // const system = useSelector(store => store.system);

    dayjs.locale('es') 
    dayjs.extend(localeData);

    const dispatch = useDispatch();

    const closeOpen = () => {
        setOpenServices(null);
    }
    const [navCoti, setNav] = useState(null);
    // const handleAprobar = async() => {
    //     const sendAprobation = await axios.get(`/api/cotizacion/accept/${cotizacion.id}`)
    //     .then(res => {
    //         dispatch(actions.HandleAlerta('Cotización aprobada', 'positive'))
    //         dispatch(actions.axiosToGetCotizaciones(false))
    //     })
    //     .catch(err => {
    //         dispatch(actions.HandleAlerta('Ha ocurrido un error', 'positive'))
    //     })
    //     return sendAprobation;
    // }
    // Editar
    const [notes, setNotes] = useState(null);
    // ÁREA A TRABAJAR
    const [number, setNumber] = useState(null);

    // Version
    const [version, setVersion] = useState(null);
    const selectArea = (zona) => {
        setNumber(zona)
    }

    const newArea = async () => {
        if(!name) return dispatch(actions.HandleAlerta('Debes ingresar un nombre al área', 'mistake'))
        // caso contrario... Avanzamos

        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            name
        }
        const send = await axios.post('/api/cotizacion/area/add', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Área agregada con exito.', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            setName('');
            setArea(null)
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado agregar área', 'mistake'))
        })
        return send;
    }

    const changeNote = (nt) => {
        setNotes(nt)
    }
    // Abrir otra versión
    const openVersion = async (versionId) => {
        dispatch(actions.axiosToGetCotizacion(true, versionId))
        setVersion(null)
    }
    // Nueva versión
     const newVersión = async () => {
        // caso contrario... Avanzamos
        setLoading(true)
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
        }
        const send = await axios.post('/api/cotizacion/version/new', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Nueva versión creada con éxito', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado crear una nueva versión', 'mistake'))
        })
        .finally(f => {
            setLoading(false);
            return f;
        })
        return send;
    }
    // Nueva versión
     const beOficialVersion = async () => {
        // caso contrario... Avanzamos
        setLoading(true)
        let body = {
            userId: user.user.id,
            cotizacionId: cotizacion.id,
            versionCotizacionId: cotizacion.versionCotizacion && (cotizacion.versionCotizacion.id)
        }
        const send = await axios.put('/api/cotizacion/version/updateToOficial', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Actualizado con éxito', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esta versión', 'mistake'))
        })
        .finally(f => {
            setLoading(false);
            return f;
        })
        return send;
    }
    // Modificar cotizacion
     const modificarCotizacion = async () => {
        if(!title && edit) return dispatch(actions.HandleAlerta('Debes ingresar un nombre a la cotización', 'mistake'))
        if(!time && editTime) return dispatch(actions.HandleAlerta('Debes ingresar una fecha', 'mistake'))
        // caso contrario... Avanzamos

        let body = {
            time: time != cotizacion.time ? time: cotizacion.time,
            name: title != cotizacion.name ? title : cotizacion.name,
            userId: user.user.id,
            cotizacionId: cotizacion.id,
        }
        console.log(body)
        const send = await axios.put('/api/cotizacion/new', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Cotización actualizada con exito.', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            setEdit(null);
            setEditTime(null);
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esta cotización', 'mistake'))
        })
        return send;
    }
    // Abrir cotización
    const openCoti = async () => {
        params.set('watch', 'cotizacion');
        setParams(params);
    }
    const closeTheCondicions = () => {
        setCondiciones(false)
    }
    return (
        !cotizacion || loadingCotizacion ?
            <div className="loadingLoading">
                <h1>Cargando...</h1>
            </div>
        : cotizacion == 404 || cotizacion == 'notrequest' ?
            <div className="loadingLoading">
                <h1>No hemos logrado cargar esto.</h1>
            </div>
        :
        <div className="page">
            {cotizacion.state == 'version' && (
                <div className="mode">
                    <div className="leftMode">
                        {/* <button>
                            <span>Volver al original</span>
                        </button> */}
                    </div>
                    <div className="txt">
                        <div className="back">
                            
                            <span>Modo versión - Versión: {cotizacion && cotizacion.name ? `"${cotizacion.name}"` : null}</span>
                        </div>
                    </div>
                    <button  onClick={() => {
                            params.delete('w');
                            setParams(params);
                            dispatch(actions.getCotizacion(null))
                    }}>
                        <span>X</span>
                    </button>
                </div>
            )}
            <div className="selectItems">
                {
                    notes ?
                        <AddNotes cancelar={changeNote} cotizacion={cotizacion} /> 
                    :
                        <div className="leftKit">
                            <div className="topData">
                                {
                                    edit ? 
                                        <div className="DataKit">
                                            <div className="editForm">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Editar nombre cotización</label><br />
                                                    <input type="text" placeholder='' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setEdit(false)
                                                        } if(event.key == 'Enter'){
                                                            modificarCotizacion()
                                                        }
                                                    }} onChange={(e) => {
                                                        setTitle(e.target.value)
                                                    }}  value={title} />
                                                </div>
                                            </div><br />
                                        </div>
                                    :
                                    editTime ?
                                        <div className="DataKit">
                                            <div className="editForm">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Modificar fecha</label><br />
                                                    <input type="date" placeholder='' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setEditTime(false)
                                                        } if(event.key == 'Enter'){
                                                            modificarCotizacion()
                                                        }
                                                    }}  onChange={(e) => {
                                                        setTime(e.target.value)
                                                    }} value={time}/>
                                                </div>
                                            </div><br />
                                        </div>
                                    :
                                        <div className="DataKit">
                                            <h3 onDoubleClick={() => setEdit(true)}>
                                                {cotizacion.name} {number} - <strong>{21719 +cotizacion.id}</strong>
                                            </h3> 
                                            <span onDoubleClick={() => setEditTime(true)}>Fecha creada: <strong>{dayjs(cotizacion.time.split('T')[0]).format('dddd, D [de] MMMM [de] YYYY')}</strong></span><br />
                                        </div>  
                                }
                                 
                                    <div className="optionsForCotizacion">
                                        <div className="containerOptions">
                                            <nav>
                                                <ul>
                                                    <li onClick={() => {
                                                        setCondiciones(true)
                                                    }}>
                                                        <div className="" >
                                                            <BsPlusLg  className="icon" />
                                                            <span>Condiciones</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => {
                                                        setOpenServices(!openServices)
                                                    }}>
                                                        <div className="" >
                                                            <BsPlusLg  className="icon" />
                                                            <span>Servicios</span>
                                                        </div>
                                                    </li>
                                                    {
                                                        !area && (
                                                            <li onClick={() => setEdit(!edit)}>
                                                                <div className="">
                                                                    <BsPencil className="icon" />
                                                                    <span>{!edit ? 'Editar' : 'Cancelar edición'}</span>
                                                                </div>
                                                            </li>
                                                        ) 
                                                    }
                                                    {
                                                        !area ?
                                                            !edit && (
                                                                <li onClick={() => {
                                                                    setArea(!area)
                                                                }}>
                                                                    <div className="" >
                                                                        <BsPlusLg  className="icon" />
                                                                        <span>Agregar área</span>
                                                                    </div>
                                                                </li>
                                                            ) 
                                                        : 
                                                            <li onClick={() => {
                                                                setArea(!area)
                                                            }}>
                                                                <div className="" >
                                                                    <BsPlusLg  className="icon" />
                                                                    <span>Cancelar creación</span>
                                                                </div>
                                                            </li>
                                                    }
                                                    <li onClick={() => setNotes(true)}>
                                                        <div>
                                                            <span>Notas</span>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => setVersion(true)}>
                                                        <div>
                                                            <span>Versiones</span>
                                                        </div>
                                                    </li>
                                                    
                                                    {/* <li onClick={() => openCoti()}>
                                                        <div>
                                                            <span>Visualizar</span>
                                                        </div>
                                                    </li> */}
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                            </div>
                            <div className="middleData">
                                <div className="tableItemsMPKits">
                                    {
                                        area && (
                                            <div className="addArea">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Nombre del área</label><br />
                                                    <input type="text" placeholder='Escribe aquí' onKeyDown={(event) => {
                                                        if(event.key === 'Escape'){
                                                            setArea(null)
                                                        } 
                                                        if(event.key == 'Enter'){
                                                            newArea();
                                                        }
                                                    }} onChange={(e) => {
                                                        setName(e.target.value)
                                                    }} value={name} />
                                                </div>
                                            </div>
                                        )
                                    } 
                                    {
                                        cotizacion.areaCotizacions?.length > 0 && (
                                            cotizacion.areaCotizacions.map((ar, i) => {
                                                return (
                                                    <SelectedKits number={number} selectArea={selectArea} area={ar} cotizacion={cotizacion} key={i+1} />
                                                )
                                            }
                                        ))
                                    }
                                </div>
                                { params.get('area') == 'move' && (<MoveArea area={area} />) }
                            </div>
                            <div className="bottomData">
                                {
                                    condiciones ?
                                        <Condiciones cotizacion={cotizacion} close={closeTheCondicions}  />
                                    :null
                                }
                                <div className="priceBox">
                                    {/* <div>
                                        <span>Precio promedio</span><br />
                                        <h3>
                                            {
                                                cotizacion.kits && cotizacion.kits.length ?
                                                    <PriceCotizacion cotizacion={cotizacion.kits} coti={cotizacion.armados} />
                                                : null 
                                            }
                                        </h3>
                                    </div> */}
                                    <div>
                                        {
                                            cotizacion.state == 'version' ?
                                                <button onClick={() => {
                                                    if(!loading){
                                                        beOficialVersion()
                                                    }
                                                }}>
                                                    <span>{!loading ? 'Definir como versión oficial' : 'Definiendo...'}</span>
                                                </button>
                                            : null
                                        }
                                    </div>
                                    { /* {
                                        cotizacion.state == 'desarrollo' ?
                                        <button style={{marginLeft:30, padding:10}} onClick={() => handleAprobar()}>
                                            <span style={{fontSize:14}}>Aprobar cotización</span>
                                        </button>
                                        :null
                                    } */ }
                                </div> 
                            </div> 
                        </div> 
                    }



                <div className="rightSelect">
                    <nav className='navToSelectFilter'>
                        <ul>
                            <li onClick={() => setNav(null)} className={!navCoti ? 'Active' : null}>
                                <div>
                                    <span>Kit's</span>
                                </div>
                            </li>
                            <li onClick={() => setNav('terminado')} className={navCoti == 'terminado' ? 'Active' : null}>
                                <div>
                                    <span>Producto terminado</span>
                                </div>
                            </li>
                            {/* <li onClick={() => setNav('superkits')} className={navCoti == 'superkits' ? 'Active' : null}>
                                <div>
                                    <span>Superkit's</span>
                                </div>
                            </li>  */}
                        </ul> 
                    </nav> 
                    {
                        navCoti == 'terminado' ?
                            <SearchProductoTerminado number={number} />
                        : navCoti == 'superkits' ?
                            <SearchSuperKitsComercial cotizacion={cotizacion} number={number}  />
                        : <SearchKitsComercial  number={number}  /> 
                    }
                </div>
            </div>
            {
                openServices && (<ModalServices closeOpen={closeOpen} number={number} cotizacion={cotizacion} />)
            } 
            {version &&(<div className="modal BIGGEST">
                <div className="hiddenModal" onClick={() => setVersion(null)}></div>
                <div className="containerModal Small" style={{zIndex:8}}>
                    <div className="headerModal" style={{paddingLeft:40}}>
                        <div className="divide">
                            <h3>Versiones {cotizacion.versionCotizacion?.cotizacions?.length && (`(${cotizacion.versionCotizacion?.cotizacions?.length -1})`)}</h3>
                            <div className="boton">
                                <button onClick={() => {
                                    if(!loading){
                                        newVersión()
                                    }
                                }}>
                                    <span style={{color:'white'}}>{!loading ? 'Nueva versión' : 'Creando nueva versión...'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bodyModalTable">
                        <div className="dataScroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Estado</th>
                                        <th>Creado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cotizacion.versionCotizacion?.cotizacions?.length && (
                                            cotizacion.versionCotizacion.cotizacions?.map((v,i) => {
                                                return (
                                                    <tr className={v.state == 'desarrollo' ? `Active` : cotizacion.id == v.id ?  'Currently' : null} key={i+1} onClick={() => openVersion(v.id)}>
                                                        <td>{v.name}</td>
                                                        <td>{v.version == 1 ? 'Original' : v.version}</td> 
                                                        <td>{v.state == 'version' ? 'versionado' : v.state == 'desarrollo' ? 'Desarrollo' : 'Aprobada'}</td>
                                                        <td>{dayjs(v.createdAt.split('T')[0]).format('dddd, D [de] MMMM [de] YYYY')}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                    
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                    
                </div>
            </div>)
            }
        </div>
    )
}

function ModalServices({ number, cotizacion, closeOpen }){
    const [loading, setLoading] = useState(false); 
    const [services, setServices] = useState(null);
    const [loadingServices, setLoadingServices] = useState(false);
    const [nuevo, setNew] = useState(false);

    const [form, setForm] = useState({
        name: null,
        description:null
    });

    const dispatch = useDispatch();

    const searchServices = async () => {
        setLoadingServices(true)
        const send = await axios.get('/api/materia/services/search')
        .then((res) => {
            setServices(res.data)
        }).catch(err => {
            setServices(404)
            return err
        })
        .finally(() => {
            setLoadingServices(false)
        })
        return send;
    }

    const newServicio = async () => {
        if(!form.name || !form.description) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        setLoading(true);
        let body = {
            name: form.name,
            description: form.description
        }
        const sendCreate = await axios.post('/api/materia/service/new', body)
        .then((res) => {
            searchServices();
            dispatch(actions.HandleAlerta('Servicio anexado con éxito', 'positive'));
            setNew(false); 
            return res;
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado anexar este servicio.', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false);
        })
        return sendCreate;
    }

    const addService = async (howMany, valor, serviceId) => {
        if(!howMany || !valor) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        setLoading(true);
        let body = {
            cotizacionId: number ? number : null,
            servicioId: serviceId,
            cantidad: howMany,
            precio: valor
        } 
        const sendCreate = await axios.post('/api/cotizacion/add/service/item', body)
        .then((res) => {
            searchServices();
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id ))
            dispatch(actions.HandleAlerta('Servicio anexado con éxito', 'positive'));
            setNew(false); 
            return res;
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado anexar este servicio.', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false);
        })
        return sendCreate;
    }
    useEffect(() => {
        searchServices()
    }, [])
    return (
            <div className="modal" style={{zIndex:5}}>
                <div className="hiddenModal" onClick={() => closeOpen()}></div>
                    <div className="containerModal Small">
                        <div className="headerModal" style={{paddingLeft:40}}>
                            <div className="divide">
                                <h3>Servicios</h3>
                                <div className="boton">
                                    <button onClick={() => {
                                        setNew(!nuevo)
                                    }}>
                                        <span style={{color: 'white'}}>{!nuevo ? 'Nuevo servicio' : 'Cancelar'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bodyModalTable">
                            <div className="dataScroll" style={{overflowY: auto}}>
                                
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                                <th>Valor</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                nuevo ?
                                                    <tr>
                                                        <td>
                                                            <label htmlFor="">Nombre</label><br />
                                                            <input type="text" onChange={(e) => {
                                                                setForm({
                                                                    ...form,
                                                                    name: e.target.value
                                                                })
                                                            }} value={form.name}/>
                                                        </td>
                                                        <td>
                                                            <label htmlFor="">Descripción</label><br />
                                                            <input type="text" onChange={(e) => {
                                                                setForm({
                                                                    ...form,
                                                                    description: e.target.value
                                                                })
                                                            }} value={form.description}/>
                                                        </td>
                                                        <td onClick={() => {
                                                            if(!loading){
                                                                newServicio()
                                                            }
                                                        }}>
                                                            <button>{!loading ? 'Anexar' : 'Anexando...'}</button>
                                                        </td>
                                                        <td>
                                                            {
                                                                !loading ?
                                                                <button onClick={() => {
                                                                    setNew(false);
                                                                }}>Cancelar</button>
                                                                :null
                                                            }
                                                        </td>
                                                    </tr>
                                                : null
                                            }
                                            {
                                                !services || loadingServices ?
                                                <h1>Cargando...</h1>
                                                :
                                                services == 404 ? <h1>No hay</h1>
                                                :
                                                services?.map((sv, i) => {
                                                    return (
                                                        <tr key={i+1}>
                                                            <td>{sv.name}</td>
                                                            <td>{sv.description}</td>
                                                            <td style={{width:50}}>
                                                                <label htmlFor="">Cantidad</label>
                                                                <input type="text" id={`${sv.id}-cantidad`} />
                                                            </td>
                                                            <td>
                                                                <label htmlFor="">Valor</label>
                                                                <input type="text" id={`${sv.id}-valor`} />
                                                            </td>
                                                            <td>
                                                                <button onClick={() => {
                                                                    let canti = document.getElementById(`${sv.id}-cantidad`).value
                                                                    let val = document.getElementById(`${sv.id}-valor`).value
                                                                    addService(canti, val, sv.id)
                                                                }}>
                                                                    <span>Enviar</span>
                                                                </button> 
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                </div>
            </div>
    )
} 
function PriceCotizacion(props) { 
    const kits = props.cotizacion;
    const superK = props.coti;

    const array =  kits ? kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion.precio), 0) : 0
    const ArrayDos = superK ? superK.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion.precio), 0) : 0

    let suma = Number(array) + Number(ArrayDos)
    // const array = !ktv ? 0 : ktv.kitCotizacion.reduce((acc, p) => Number(acc) + Number(p.precio), 0)
    // console.log(ktv)

    const descuentoArray =  kits ? kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion.descuento), 0) : 0
    const descuentoArrayDos = superK ? superK.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion.descuento), 0) : 0

    const descuentos = Number(descuentoArray) + Number(descuentoArrayDos)
    return (
        <div className="">
            <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(suma - descuentos).toFixed(0))} COP</span>
        </div>
    )
}
