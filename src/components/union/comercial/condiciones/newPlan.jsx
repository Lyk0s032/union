import React, { useState } from 'react';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function NewPlan({condicion}){
    console.log(condicion) 
    const [form, setForm] = useState({
        porcentaje: null,
        description:'',
        momentoPago: '',
        condicionesPagoId: condicion
    });
    const dispatch = useDispatch();
        const [loading, setLoading] = useState(false);    


    const handleNew = async () => {
        if(!form.description || !form.momentoPago || !form.porcentaje) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        setLoading(true);
        const body = form
        const sendPetition = await axios.post('/api/cotizacion/condiciones/post/subNew', body)
        .then(() => {
            dispatch(actions.axiosToGetCondiciones(false))
            dispatch(actions.HandleAlerta('Paso anexado con éxito', 'positive'))
            setForm({
                ...form,
                porcentaje: 0,
                description: '',
                momentoPago: '',

            })

        })
        .catch(() => {
            dispatch(actions.HandleAlerta('No hemos logrado crear esto', 'mistake'))
        })
        .finally(() => setLoading(false))

        return sendPetition;
    }
    return ( 
        <div className="subCondicions">
            <div className="containerSubCondicions">
                <div className="step">
                    <h3>?</h3>
                </div>
                <div className="description">
                    <label htmlFor="">Nombre</label><br />
                    <input type="text"  onChange={(e) => {
                        setForm({
                            ...form,
                            description: e.target.value
                        })
                    }} value={form.description}/><br /><br />
                    <label htmlFor="">Porcentaje</label><br />
                    <input type="text" onChange={(e) => {
                        setForm({
                            ...form,
                            porcentaje: e.target.value
                        })
                    }} value={form.porcentaje} /><br /><br />
                    
                </div>
                <div className="momentoPago">
                    <label htmlFor="">Momento de pagar</label><br />
                    <input type="text" onChange={(e) => {
                        setForm({
                            ...form,
                            momentoPago: e.target.value
                        })
                    }} value={form.momentoPago} />
                </div>
                <div className="momentoPago">
                    <button onClick={() => handleNew()}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}