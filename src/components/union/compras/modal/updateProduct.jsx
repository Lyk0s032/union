import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../../store/action/action';

export default function ModaUpdateProducto(props){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const prima = props.prima;
    const sistema = useSelector(store => store.system);

    const { categorias, lineas, loadingFiltros } = sistema;

    const [form, setForm] = useState({
        itemId: prima.id,
        item: prima.item,
        description: prima.description,
        medida: prima.medida,
        unidad: prima.unidad,
        peso: prima.peso, 
        criticidad: prima.criticidad,
        procedencia: prima.procedencia,
        volumen: prima.volumen,
        lineaId: prima.lineaId,
        categoriumId: prima.categoriumId
    })

    const updateMateria = async() => {
        if(!form.item || !form.description) return dispatch(actions.HandleAlerta('No puedes dejar esos campos vacios.', 'mistake'))
        if(!form.lineaId || !form.categoriumId) return dispatch(actions.HandleAlerta('Debes seleccionar una línea o categoría', 'mistake'))
            
        const body = form;
        console.log(body) 
    
        const sendPeticion = await axios.put('/api/materia/producto/new', body)
        .then((res) => {
            dispatch(actions.axiosToGetProducto(false, prima.id))
            dispatch(actions.HandleAlerta('Producto agregado con exito', 'positive'))
            setForm({
                item: '',
                description: '',
                peso: '',
                criticidad: '',
                procedencia: '',
                volumen: '',
                lineaId: null,
                categoriumId: null 
            });
            params.delete('u');
            setParams(params);

        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado agregar este producto, intentalo más tarde', 'mistake'))
            
        })

        return sendPeticion;
    }
    return(
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('u');
                setParams(params);
            }}></div> 
            <div className="containerModal">
                <div className="top">
                    <h3>
                        Actualizar Item - <strong>{prima.item}</strong>
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
                                    volumen: e.target.olumvolumenalue
                                })
                            }} value={form.volumen}/>
                        </div> 
                        <div className="inputDiv">
                            <label htmlFor="">Procedencia</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    procedencia: e.target.value
                                })
                            }} value={form.procedencia}/>
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
                                            <option key={i+1} value={cat.id}>{cat.name}</option>
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
                                            <option key={i+1} value={linea.id}>{linea.name}</option>
                                        )
                                    }) 
                                }
                            </select>
                        </div>
                        
                        <div className="inputDiv">
                            <button className="create" onClick={() => updateMateria()}>
                                <span>Actualizar producto</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}