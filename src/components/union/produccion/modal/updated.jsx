import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';

export default function UpdateKit(props){
    const kit = props.kit;

    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const system = useSelector(store => store.system);
    const { lineas, categorias, extensiones } = system;
    const [form, setForm] = useState({
        kitId: kit.id,
        nombre: kit.name,
        description: kit.description,
        categoriumId: kit.categoriumId,
        extensionId: kit.extensionId,
        lineaId: kit.lineaId,
      });

    const handleUpdateKit = async () => {
        try {
          setLoading(true); // Inicia loading
            
          const response = await axios.put('/api/kit/new', form)
          .then(res => {
            dispatch(actions.axiosToGetKits(false))
            dispatch(actions.axiosToGetKit(false, kit.id))
            params.delete('update');
            setParams(params);
            dispatch(actions.HandleAlerta('Actualizado con exito', 'positive'))
            return res
          })
       
          console.log('Kit actualizado:', response.data);
          // Puedes cerrar el formulario o recargar datos aquí si es necesario
        } catch (error) {
          console.error('Error al actualizar el kit:', error);
        } finally {
          setLoading(false); // Termina loading
        }
    };

    return (
        <div className="updateKit">
            <div className="containerUpdate">
                <form>
                {/* Nombre */}
                <div className="inputDiv">
                    <label htmlFor="nombre">Nombre del Kit</label><br />
                    <input
                    type="text"
                    id="nombre"
                    placeholder="Escribe aquí"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                </div>

                {/* Descripción */}
                <div className="inputDiv">
                    <label htmlFor="description">Descripción {form.description ? `(${form.description.length})` : null}</label><br />
                    <input
                    type="text"
                    id="description"
                    placeholder="Escribe aquí"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div className="divideInput">
                    {/* Categoría */}
                    <div className="inputDiv">
                        <label htmlFor="categoriumId">Categoría</label><br />
                        <select
                        id="categoriumId"
                        value={form.categoriumId}
                        onChange={(e) => setForm({ ...form, categoriumId: Number(e.target.value) })}
                        >
                            {
                                categorias.map((ex, i) => {
                                    return (
                                        ex.type == 'comercial' ?
                                            <option value={ex.id} key={i+1}>{ex.name}</option>
                                        : null
                                    )
                                })
                            }
                        </select>
                    </div>
                    {/* Línea */}
                    <div className="inputDiv">
                        <label htmlFor="lineaId">Línea</label><br />
                        <select
                        id="lineaId"
                        value={form.lineaId}
                        onChange={(e) => setForm({ ...form, lineaId: Number(e.target.value) })}
                        >
                            {
                                lineas.map((ex, i) => {
                                    return (
                                        ex.type == 'comercial' ?
                                            <option value={ex.id} key={i+1}>{ex.name}</option>
                                        : null
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>

                {/* Extensión */}
                    <div className="inputDiv">
                        <label htmlFor="extensionId">Extensión</label><br />
                        <select
                        id="extensionId"
                        value={form.extensionId}
                        onChange={(e) => setForm({ ...form, extensionId: Number(e.target.value) })}
                        >
                            {
                                extensiones.map((ex, i) => {
                                    return (
                                        <option value={ex.id} key={i+1}>{ex.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>    
                    <div className="buttons">
                        <button onClick={(e) => {
                            if(!loading){
                                e.preventDefault()
                                params.delete('update');
                                setParams(params);
                            }
                        }}>
                            <span>Cancelar</span>
                        </button>

                        <button className='confirm' onClick={(e) => {
                            e.preventDefault()
                            if(!loading){
                                handleUpdateKit()
                            }
                        }}>
                            <span>{loading ? 'Actualizando' : 'Actualizar'}</span>
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}