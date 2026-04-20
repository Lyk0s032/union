import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';


export default function NewReq({ close, onSolicitudCreated }){
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const sistema = useSelector(store => store.system);
    const { extensiones } = sistema;
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        tipo: 'kit',
        description: '',
        userId: user.user.id,
        extensionId: ''
    }); 

    useEffect(() => {
        if (!extensiones || extensiones.length === 0) {
            dispatch(actions.axiosToGetFiltros(false));
        }
    }, []);

    const newReq = async () => {
        if (!form.nombre || !form.description || !form.extensionId) {
            return dispatch(actions.HandleAlerta('Debes completar todos los campos', 'mistake'));
        }

        setLoading(true);
        const body = {
            nombre: form.nombre,
            description: form.description,
            cotizacionId: null,
            tipo: 'kit',
            userId: user.user.id,
            kitId: true,
            extension: parseInt(form.extensionId)
        };

        try {
            const res = await axios.post('/api/kit/requerimientos/post/add/kit/cotizacion', body);
            dispatch(actions.HandleAlerta('Solicitud creada con éxito', 'positive'));
            dispatch(actions.axiosToGetRequerimientos(false));
            dispatch(actions.axiosToGetRequerimiento(true, res.data.id));
            
            if(onSolicitudCreated) {
                onSolicitudCreated(res.data);
            }
            close();
        } catch (err) {
            console.log('no se pudo')
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado crear la solicitud', 'mistake'));
        } finally {
            setLoading(false);
        }
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
                        <label htmlFor="extensionKit">Extensión</label><br />
                        <select
                            id="extensionKit"
                            value={form.extensionId}
                            onChange={(e) => setForm({ ...form, extensionId: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Selecciona una extensión</option>
                            {extensiones && extensiones.length > 0 && (
                                extensiones.map((ext, i) => (
                                    <option key={i} value={ext.id}>
                                        {ext.name}
                                    </option>
                                ))
                            )}
                        </select>
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