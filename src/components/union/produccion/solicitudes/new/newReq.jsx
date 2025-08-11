import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';


export default function NewReq({ close }){
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        tipo: 'kit',
        description: '',
        userId: user.user.id,
    });  

    const newReq = async () => {
        if(!form.nombre || !form.description) return dispatch(actions.HandleAlerta('Debes ingresar un nombre y/o descripción', 'mistake'))
        // Caso contrario, avanzo
        setLoading(true)
        let body = form;
        const sendPetion = await axios.post('/api/kit/requerimientos/post/add', body)
        .then(res => {
            dispatch(actions.HandleAlerta('Perfecto', 'positive'));
            dispatch(actions.axiosToGetRequerimientos(false))
            close()
            dispatch(actions.axiosToGetRequerimiento(true, res.data.id));
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado crear esto', 'mistake'));
        })
        .finally(() => {
            setLoading(false)
        })
        return sendPetion
    }

    return (
        <div className="newReqForm">
            <div className="containerNewReq">
                <div className="title">
                    <h3>¡Enviemos la solicitud del Kit!</h3>
                </div>
                <div className="dataForm">
                    <div className="inputDiv">
                        <label htmlFor="">Nombre de la solicitud</label><br />
                        <input type="text" placeholder='Ej. Solicito kit pedestal 2x1 'onChange={(e) => {
                            setForm({
                                ...form,
                                nombre: e.target.value
                            })
                        }}  value={form.nombre} />
                    </div>
                    <div className="inputDiv">
                        <label htmlFor="">¿Tipo de producto?</label><br />
                        <button className={form.tipo == 'kit' ? 'Active' : null} onClick={() => {
                            setForm({
                                ...form,
                                tipo: 'kit'
                            })
                        }}>
                            <span>Kit</span>
                        </button>
                    </div>
                    <div className="inputDiv">
                        <label htmlFor="">Descripción</label><br />
                        <textarea name="" id="" placeholder='Escribe aquí...' onChange={(e) => {
                            setForm({
                                ...form,
                                description: e.target.value
                            })
                        }}  value={form.description}></textarea>
                        <br /><br />
                        <button onClick={() => {
                            if(!loading) newReq();
                        }}>
                            <span>{loading ? 'Creando Solicitud...' : 'Solicitar'}</span>
                        </button>
                        <button onClick={() => { close () }}>
                            <span>Cancelar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}