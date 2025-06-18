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
 
export default function SelectKits({ dist }){
    const cotizacions = useSelector(store => store.cotizacions);
    const [params, setParams] = useSearchParams();

    const { cotizacion, loadingCotizacion } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [area, setArea] = useState(null); 
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(null);
    // const system = useSelector(store => store.system);
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
    return (
        <div className="page">
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
                                        <span>Fecha creada: <strong>{cotizacion.createdAt.split('T')[0]}</strong></span><br />
                                        <span>Nro: <strong>{cotizacion.id}</strong></span>
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
                                    <div>
                                        <span>Precio promedio</span><br />
                                        <h3>
                                            {
                                                cotizacion.kits && cotizacion.kits.length ?
                                                    <PriceCotizacion cotizacion={cotizacion.kits} coti={cotizacion.armados} />
                                                : null 
                                            }
                                        </h3>
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