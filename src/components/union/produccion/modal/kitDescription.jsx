import React, { useState } from 'react';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function KitDescription(){
    const kits = useSelector(store => store.kits);

    const { kit, loadingKit } = kits;
    const system = useSelector(store => store.system);
    const { lineas, categorias, extensiones } = system;
    const dispatch = useDispatch(); 

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
        

    const [form, setForm] = useState({
        code: kit ? kit.code : null,
        nombre: kit ? kit.nombre : null,
        description: kit ? kit.description : null,
        extension: kit ? kit.extensionId  : null,
        linea: kit ? kit.lineaId : null,
        categoria: kit ?  kit.categorium  : null,
        userId: user.user.id
    });


    const createKit = async () => { 
        if(!form.nombre) return dispatch(actions.HandleAlerta('Debes llenar nombre del kit', 'mistake'))
        if(!form.extension || !form.linea || !form.categoria) return dispatch(actions.HandleAlerta('Debes asignar un filtro', 'mistake'))
     
        const body = form
        const sendPeticion = await axios.post('/api/kit/new', body)
        .then((res) => {
            console.log(res)
            dispatch(actions.axiosToGetKits(false));
            return dispatch(actions.axiosToGetKit(false,res.data.id)) 
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado crear esto, intentalo más tarde', 'mistake'))
        })
        return sendPeticion;
    }
    return (
        <div className="kitDescription">
            <div className="containerKitDescription">
                <div className="form">
                    <div className="containerForm">
                        <div className="inputDiv">
                            <h3>Nombre del kit</h3>
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    nombre: e.target.value
                                })
                            }} value={form.nombre}/>
                        </div>
                        <div className="inputDiv">
                            <h3>Descripción {form.description ? `(${form.description.length})` : null}</h3>
                            <textarea name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }} value={form.description}></textarea>
                        </div>
                        <div className="inputDiv">
                            <h3>Categoría</h3>
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    categoria: e.target.value
                                })
                            }} value={form.categoria}>
                                <option value="">Seleccionar</option>
                                {
                                    categorias.map((ex, i) => {
                                        return (
                                            <option value={ex.id} key={i+1}>{ex.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="inputDiv">
                            <h3>Linea</h3>
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    linea: e.target.value
                                })
                            }} value={form.linea}>
                                <option value="">Seleccionar</option>
                                {
                                    lineas.map((ex, i) => {
                                        return (
                                            <option value={ex.id} key={i+1}>{ex.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="inputDiv">
                            <h3>Extensión</h3>
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    extension: e.target.value
                                })
                            }} value={form.extension}>
                                <option value="">Seleccionar</option>
                                {
                                    extensiones.map((ex, i) => {
                                        return (
                                            <option value={ex.id} key={i+1}>{ex.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    
                    </div>
                </div>
                <div className="bottom">
                    <button onClick={() => createKit()}>
                        <span>Siguiente</span>
                    </button>
                </div>
            </div>
        </div>
    )
}