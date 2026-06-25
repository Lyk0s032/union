import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';
import UpdatePrice from './updatePrice/UpdateKit';
import { useSearchParams } from 'react-router-dom';
import EditItemModal from './editItem';
import kit from '../../../store/reducers/kit';

export default function SelectedKit({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.kitCotizacion.descuento ? kt.kitCotizacion.descuento : 0);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [porcentaje, setPorcentaje] = useState(0);
    const [pri, setPri] = useState(null);
    // Convertir descuento
    const porcentForDescuento = (porcentaje) => {
        let  precio = kt.kitCotizacion.precio;
        const descuentico = Number(porcentaje / 100) * Number(precio)
        return setDescuento(descuentico.toFixed(0))    
    }

    // Dar descuento
    const giveDescuento = async () => {
        if(Number(porcentaje) > 9 && user.user.area == 'asesor') return dispatch(actions.HandleAlerta('Este descuento es muy alto', 'mistake'));
        if(!descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento', 'mistake'))
        if(descuento == kt.kitCotizacion.descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento diferente', 'mistake'))
            // Caso contrario, avanzamos
        let body = {
            kitCotizacionId: kt.kitCotizacion.id,
            descuento
        } 
        const sendPeticion = await axios.put('/api/cotizacion/kit/descuento', body)
        .then((res) => { 
            dispatch(actions.HandleAlerta('Descuento asignado', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            setActive(null)
            return res;
        }).catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hemos podido dar este descuento', 'mistake'));
        })
        return sendPeticion;
    }
    // Eliminar item
    const deleteItem = async (itemId) => {
        const body = {
            kitId: itemId,
            cotizacionId: area.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/item', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
            return res;
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este kit', 'mistake'))
        })
        return sendPetion; 
    }

    // Close pri
    const closePri = () => {
        setPri(null)
    }
    
    const openSimulation = () => {
        params.set('simulation', kt.id)
        setParams(params);
    }

    const doYouWannaDuplicar = () => {
        params.set('newSimulation', kt.id)
        setParams(params);
    }

    return (
        <tr>

            <td  style={kt.state == 'simulacion' ? {color:'red'} : null} >
                <div > 
                    {
                        params.get('newSimulation') == kt.id ? <DoYouWannaDuplicar user={user} cotizacion={cotizacion} kit={kt} />
                    :
                        params.get('simulation') == kt.id && kt.state == 'simulacion' ? <ChangeTheName user={user} cotizacion={cotizacion} kit={kt} /> :
                    <span onDoubleClick={() => {
                        if(kt.state == 'simulacion'){
                            openSimulation()
                        }
                    }} onClick={() => {
                        if(kt.state == 'simulacion') return
                        doYouWannaDuplicar()
                    }}>{kt.name}</span>
                    }

                </div> 
            </td>
            <td>{kt.kitCotizacion.cantidad }</td>
            {
                active ?
                    <td> 
                        <label htmlFor="">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(descuento)} COP</label><br />
                        <input type="text" inputMode="numeric"
                        pattern="[0-9]*" onKeyDown={(e) => {
                            if(e.key === 'Escape') setActive(false)
                            if(e.key === 'Enter')  giveDescuento();
                            }} onChange={(e) => { 
                                const text = e.target.value
                                if (/^\d*\.?\d*$/.test(text)) { // Solo números positivos sin decimales
                                    setPorcentaje(e.target.value)
                                    porcentForDescuento(e.target.value)
                                } 
                                
                            }}  value={porcentaje}/>
                    </td>
                :
                    <td onDoubleClick={() => setActive(true)}>{kt.kitCotizacion.descuento ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.descuento).toFixed(0)) : 0 } COP</td>
            }
            <td onDoubleClick={() => {
                setPri(true)
            }}>
                {  
                    !pri ?
                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.precio).toFixed(0))
                    :
                        <UpdatePrice kit={kt} cotizacion={cotizacion} close={closePri} valor={kt.kitCotizacion.precio} idKit={kt.kitCotizacion.id} tipo={'kit'} />
                } COP</td>
            <td>

            </td>
            <td>
                {/* <strong>{<ValorSelected mt={materia} />}</strong> */}
            </td> 
            <td>
                <button onClick={() => {
                    if(kt.kitCotizacion){
                        deleteItem(kt.id)
                    }
                } }>
                    x
                </button>
            </td>
        </tr>
    )
}

export function DoYouWannaDuplicar({ user, cotizacion, kit }){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('confirm');
    const [name, setName] = useState(kit.name);

    const dispatch = useDispatch();

    const closeParams = () => {
        params.delete('newSimulation')
        setParams(params);
    }
    const addItem = async (nuevo) => {
        const body = {
            cotizacionId: kit.kitCotizacion.areaId,
            areaId: kit.kitCotizacion.areaId,
            kitId: nuevo.nuevoKit.id,
            cantidad: kit.kitCotizacion.cantidad,
            precio: kit.kitCotizacion.precio
        }; 
        await axios.post('/api/cotizacion/add/item', body)
        .then((res) => {
            console.log(res.data)
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id));
            dispatch(actions.HandleAlerta('Simulación anexada con éxito', 'positive'));
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este kit', 'mistake'));
        });
    };

    const createSimulation = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return dispatch(actions.HandleAlerta('Debes ingresar un nombre para la simulación', 'mistake'));
        }
        if (trimmedName === kit.name.trim()) {
            return dispatch(actions.HandleAlerta('Debes cambiar el nombre de la simulación', 'mistake'));
        }

        setLoading(true);

        try {
            const res = await axios.get(`/api/kit/clone/simulation/${kit.id}/${user.user.id}`);
            await axios.put('/api/kit/new', { nombre: trimmedName, kitId: res.data.nuevoKit.id });
            await addItem(res.data);
        } catch (err) {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado crear la simulación', 'mistake'));
        } finally {
            setLoading(false);
            closeParams();
        }
    }

    return (
        <div className="ask" style={{zIndex:5}}>
            {
                loading ?
                <div>
                    <span>Creando simulación...</span>
                </div>
                : step === 'confirm' ?
                <div>
                    <h3>¿Deseas crear una simulación?</h3>
                    <div>
                        <button style={{marginRight:20, padding:5}} onClick={() => setStep('naming')}>Si</button>
                        <button onClick={() => closeParams()}>No</button>
                    </div>
                </div>
                :
                <div>
                    <h3>Nombre de la simulación</h3>
                    <input
                        type="text"
                        value={name}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') closeParams();
                            if (e.key === 'Enter') createSimulation();
                        }}
                        onChange={(e) => setName(e.target.value)}
                        style={{zIndex:5, width:'100%', marginBottom:10}}
                    />
                    <div>
                        <button style={{marginRight:20, padding:5}} onClick={() => createSimulation()}>Confirmar</button>
                        <button onClick={() => closeParams()}>Cancelar</button>
                    </div>
                </div>
            }

        </div>
    )
}

export function ChangeTheName({ user, cotizacion, kit }){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(kit.name)
    const dispatch = useDispatch();

    const closeParams = () => {
        params.delete('simulation')
        setParams(params);
    }
    const addItem = async () => {
        const body = {
            nombre: name,
            kitId: kit.id,
        }; 
        await axios.put('/api/kit/new', body)
        .then((res) => {
            console.log(res.data)
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id));
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id));
            closeParams()
            dispatch(actions.HandleAlerta('Nombre simulación actualizado.', 'positive'));
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este kit', 'mistake'));
        });
    };


    return (
        <div className="ask" style={{zIndex:5, width:'100%'}}>
            {
                loading ? <span>Actualizando nombre...</span> :
                <input type="text" onKeyDown={(e) => {
                    if(e.code == 'Escape'){
                        closeParams()
                    }
                    if(e.code == 'Enter'){
                        addItem()
                    }
                }} onChange={(e) => {
                    setName(e.target.value)
                }}  value={name} style={{zIndex:5, width:'100%'}}/>
            }


        </div>
    )
}