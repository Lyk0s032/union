import React, { useState } from 'react';
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


export default function SelectKits({ dist }){
    const cotizacions = useSelector(store => store.cotizacions);
    const [params, setParams] = useSearchParams();
    const { cotizacion, loadingCotizacion } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [area, setArea] = useState(null); 
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(false);
    // const system = useSelector(store => store.system);

    dayjs.locale('es') 
    dayjs.extend(localeData);

    const dispatch = useDispatch();

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

    return (
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
                            
                            <span>Modo versión - Versión Nro 3</span>
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
                                                    }
                                                }} />
                                            </div>
                                        </div><br />
                                    </div>
                                    :
                                    <div className="DataKit">
                                        <h3 onDoubleClick={() => setEdit(true)}>
                                            {cotizacion.name} {number}
                                        </h3> 
                                        <span>Fecha creada: <strong>{dayjs(cotizacion.createdAt.split('T')[0]).format('dddd, D [de] MMMM [de] YYYY')}</strong></span><br />
                                        <span>Nro: <strong>{21719 +cotizacion.id}</strong></span>
                                    </div>
                                }
                                
                                <div className="optionsForCotizacion">
                                    <div className="containerOptions">
                                        <nav>
                                            <ul>
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
                            <li onClick={() => setNav('superkits')} className={navCoti == 'superkits' ? 'Active' : null}>
                                <div>
                                    <span>Superkit's</span>
                                </div>
                            </li> 
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
            {version &&(<div className="modal">
                <div className="hiddenModal" onClick={() => setVersion(null)}></div>
                <div className="containerModal Small">
                    <div className="headerModal" style={{paddingLeft:40}}>
                        <div className="divide">
                            <h3>Versiones {cotizacion.versionCotizacion?.cotizacions?.length && (`(${cotizacion.versionCotizacion?.cotizacions?.length})`)}</h3>
                            <div className="boton">
                                <button onClick={() => {
                                    if(!loading){
                                        newVersión()
                                    }
                                }}>
                                    <span>{!loading ? 'Nueva versión' : 'Creando nueva versión...'}</span>
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
            </div>)}
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