import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function ModalNewProducto(){
    const [params, setParams] = useSearchParams();
    
    
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);

    const { categorias, lineas, loadingFiltros } = sistema;

    const [form, setForm] = useState({
        item: null,
        description: null,
        peso: null,
        criticidad: null,
        procedencia: 'nacional',
        volumen: null,
        lineaId: null,
        categoriumId: null
    })

    const addMateria = async() => {
        if(!form.item || !form.description ) return dispatch(actions.HandleAlerta('No puedes dejar esos campos vacios.', 'mistake'))
        if(!form.lineaId || !form.categoriumId) return dispatch(actions.HandleAlerta('Debes seleccionar una línea o categoría', 'mistake'))
            
        const body = form;
        console.log(body) 

        const sendPeticion = await axios.post('/api/materia/producto/new', body)
        .then((res) => { 
            dispatch(actions.axiosToGetProductos(false))
            dispatch(actions.HandleAlerta('Matería agregada con exito', 'positive'))
            setForm({
                item: '',
                description: '',
                peso: '',
                criticidad: '',
                procedencia: 'nacional',
                volumen: '',
                lineaId: null,
                categoriumId: null
            })
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado agregar esta matería prima, intentalo más tarde', 'mistake'))
            
        })

        return sendPeticion;
    }

    return(
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('w');
                setParams(params);
            }}></div>
            <div className="containerModal">
                <div className="top">
                    <h3>
                        Agregar producto terminado
                    </h3>
                </div>
                <div className="bodyModal">
                    <div className="form">
                        <div className="inputDiv">
                            <label htmlFor="">Nombre del Item</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    item: e.target.value
                                })
                            }} value={form.item} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Descripción</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }} value={form.description}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Volumen</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    volumen: e.target.value
                                })
                            }} value={form.volumen}/>
                        </div> 
                        <div className="inputDiv">
                            <label htmlFor="">Procedencia</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    procedencia: e.target.value
                                })
                            }} value={form.procedencia}>
                                <option value="nacional">NACIONAL</option>
                                <option value="importado">IMPORTADO</option>
                                <option value="kit">KIT</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Criticidad</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    criticidad: e.target.value
                                })
                            }} value={form.criticidad}/>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor=""><strong>Categoría</strong></label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    categoriumId: parseInt(e.target.value)
                                }) 
                            }} value={form.categoriumId}>
                                <option value="">Seleccionar</option>
                                {
                                    !categorias || loadingFiltros ? null
                                    : categorias.map((cat, i) => {
                                        return (
                                            <option key={i+1} value={cat.id}>{cat.name.toUpperCase()}</option>
                                        )
                                    }) 
                                }
                            </select>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor=""><strong>Línea</strong></label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    lineaId: parseInt(e.target.value)
                                })
                            }} value={form.lineaId}>
                                <option value="">Seleccionar</option>
                                {
                                    !lineas || loadingFiltros ? null
                                    : lineas.map((linea, i) => {
                                        return (
                                            <option key={i+1} value={linea.id}>{linea.name.toUpperCase()}</option>
                                        )
                                    }) 
                                }
                            </select>
                        </div>
                        
                        <div className="inputDiv">
                            <button className="create" onClick={() => addMateria()}>
                                <span>Añadir item</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}