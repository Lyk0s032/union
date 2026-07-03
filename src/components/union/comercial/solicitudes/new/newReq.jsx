import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';

export default function NewReq({ close, onSolicitudCreated }) {
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        description: '',
        tipo: 'kit',
        userId: user.user.id,
    });

    const newReq = async () => {
        if (!form.nombre || !form.description) {
            return dispatch(actions.HandleAlerta('Debes completar todos los campos', 'mistake'));
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/kit/requerimientos/post/add/parent', {
                nombre: form.nombre,
                description: form.description,
                userId: user.user.id,
                tipo: form.tipo,
            });

            dispatch(actions.HandleAlerta('Solicitud creada con éxito', 'positive'));
            dispatch(actions.axiosToGetRequerimientos(false, 'comercial'));
            dispatch(actions.axiosToGetRequerimiento(true, res.data.id));

            if (onSolicitudCreated) {
                onSolicitudCreated(res.data);
            }
            close();
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('No hemos logrado crear la solicitud', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    const esKit = form.tipo === 'kit';

    return (
        <div className="newReqForm">
            <div className="containerNewReq">
                <div className="title">
                    <h3>Nueva solicitud</h3>
                    <p className="subtitle-hint">
                        Crea un grupo y luego agrega cada {esKit ? 'kit' : 'producto'} como requerimiento hijo.
                    </p>
                </div>
                <div className="dataForm">
                    <div className="inputDiv">
                        <label>¿Qué necesitas solicitar?</label><br />
                        <button
                            type="button"
                            className={form.tipo === 'kit' ? 'Active' : ''}
                            onClick={() => setForm({ ...form, tipo: 'kit' })}
                        >
                            <span>Kit</span>
                        </button>
                        <button
                            type="button"
                            className={form.tipo === 'producto' ? 'Active' : ''}
                            onClick={() => setForm({ ...form, tipo: 'producto' })}
                        >
                            <span>Producto terminado</span>
                        </button>
                    </div>
                    <div className="inputDiv">
                        <label>Nombre del grupo de solicitud</label><br />
                        <input
                            type="text"
                            placeholder={esKit ? 'Ej. Kits proyecto Torre Norte' : 'Ej. Productos proyecto Torre Norte'}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            value={form.nombre}
                        />
                    </div>
                    <div className="inputDiv">
                        <label>Descripción general</label><br />
                        <textarea
                            placeholder="Contexto general de la solicitud..."
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            value={form.description}
                        />
                        <br /><br />
                        <button onClick={() => { if (!loading) newReq(); }}>
                            <span>{loading ? 'Creando solicitud...' : 'Crear solicitud'}</span>
                        </button>
                        <button onClick={() => { close(); }}>
                            <span>Cancelar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
