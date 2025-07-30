import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function Condiciones({ cotizacion, close}){
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { condiciones } = sistema
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [form, setForm] = useState({
        time: 1,
        condiciones: null,
        validez: 30
    });
    const [loading, setLoading] = useState(false);

    const giveCondiciones = async () => {

        if(!form.condiciones) return dispatch(actions.HandleAlerta('Debes seleccionar una condición', 'mistake'))
        setLoading(true);
        let body = {
            cotizacionId: cotizacion.id,
            days: form.time,
            condicionId: form.condiciones,
            validez: form.validez,
            userId: user.user.id
        }
        const send =  await axios.put('/api/cotizacion/condiciones/give', body)
        .then(() => {
            dispatch(actions.HandleAlerta("Condiciones asignadas", 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            close()
        })
        .catch(() => {
            dispatch(actions.HandleAlerta('No hemos logrado asignar esto', 'mistake'))
        })
        .finally(() => {
            setLoading(false)
        })
        return send;
    }

    useEffect(() => {
       dispatch(actions.axiosToGetCondiciones(true))

    }, [])
    return (
        <div className="condiciones">
            <div className="containerCondiciones">
                <div className="title">
                    <h1>Condiciones comerciales</h1>
                    <button onClick={() => close()}>
                        X
                    </button>
                </div>
                <div className="bodyCondiciones">
                    <div className="containerBodyCondiciones">
                        <div className="inputDiv">
                            <label htmlFor="">Tiempo de entrega</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    time: e.target.value
                                })
                            }} value={form.time}>
                                <option value="5">5 Días</option>
                                <option value="6">6 Días</option>
                                <option value="7">7 Días</option>
                                <option value="8">8 Días</option>
                                <option value="9">9 Días</option>
                                <option value="10">10 Días</option>
                                <option value="11">11 Días</option>
                                <option value="12">12 Días</option>
                                <option value="13">13 Días</option>
                                <option value="14">14 Días</option>
                                <option value="15">15 Días</option>
                                <option value="16">16 Días</option>
                                <option value="17">17 Días</option>
                                <option value="18">18 Días</option>
                                <option value="19">19 Días</option>
                                <option value="20">20 Días</option>
                                <option value="21">21 Días</option>
                                <option value="22">22 Días</option>
                                <option value="23">23 Días</option>
                                <option value="24">24 Días</option>
                                <option value="25">25 Días</option>
                                <option value="26">26 Días</option>
                                <option value="27">27 Días</option>
                                <option value="28">28 Días</option>
                                <option value="29">29 Días</option>
                                <option value="30">30 Días</option>

                            </select> 
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Condiciones comerciales</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    condiciones: e.target.value
                                })
                            }} value={form.condiciones}>
                                <option value="">Selecciona una condición comercial</option>

                                {
                                    condiciones?.length ?
                                        condiciones.map((c) => {
                                            return (
                                                <option value={c.id}>{c.nombre}</option>
                                            )
                                        })
                                    :null
                                }

                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Validez de la oferta</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    validez: e.target.value
                                })
                            }} value={form.validez}>
                                <option value="30">30 Días</option>
                                <option value="35">35 Días</option>
                                <option value="40">40 Días</option>
                                <option value="45">45 Días</option>
                                <option value="50">50 Días</option>
                                <option value="55">55 Días</option>
                                <option value="60">60 Días</option>
                                <option value="70">70 Días</option>
                                <option value="80">80 Días</option>
                                <option value="90">90 Días</option>
                                


                            </select> 
                        </div>
                        <div className="inputDiv">
                            <button onClick={() => {
                                if(!loading){
                                    giveCondiciones()
                                }
                            }}>
                                <span>{!loading ? 'Asignar': 'Asignando...'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}