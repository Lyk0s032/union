import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ItemFiltro from "./itemFiltro";
import * as actions from '../../../store/action/action';
import axios from "axios";

export default function ModalAddCat(){
    const [params, setParams] = useSearchParams();

    const [add, setAdd] = useState(null);
    const [canal, setCanal] = useState(null);

    // Datos para crear nueva Linea o categoría
    const [form, setForm] = useState({
        codigo:null,
        nombre: null,
        description: null,
        type: 'MP'
    });


    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);

    const { categorias, lineas, loadingFiltros } = sistema;


    const [filter, setFilter] = useState(params.get('add') == 'categoria' ? categorias : params.get('add') == 'linea' ? lineas : null);
    const [word, setWord] = useState(null);
    

    const addFiltro = async() => {
        if(!form.codigo || !form.nombre) return dispatch(actions.HandleAlerta('Debes ingresar código y nombre', 'mistake'))
        
        // Avanzamos...
        const body = {
            code: form.codigo,
            name: form.nombre,
            description: form.description,
            type: form.type
        }
        const url = params.get('add') == 'categoria' ? 'api/categorias/new' : 'api/lineas/new';
        const addExt = await axios.post(url, body)

        .then(res => {
            dispatch(actions.axiosToGetFiltros(false))
            dispatch(actions.HandleAlerta('Filtro agregado con exito', 'positive'))
            setAdd(null);
            setForm({
                codigo:'',
                nombre: '',
                description: '',
                type: 'MP'
            })
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado agregar este filtro, intentalo más tarde', 'mistake'))
        })
        return addExt;
    }
    
    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('add');
                setParams(params);
            }}></div>
            <div className="containerModal">
                <div className="top">
                    <div className="divideTop">
                        <h3>{params.get('add') == 'categoria' ? 'Categorías' : 'Linea'}</h3>
                        {
                            canal ? null
                            :
                            <button onClick={() => setAdd(true)}>
                                Agregar
                            </button>
                        }
                    </div>
                </div>
                <div className="bodyModal">
                    <div className="containerBody">
                        <div className="searchCat">
                            <input type="text" placeholder="Buscar aquí"  onChange={(e) => {
                                setWord(e.target.value)
                            }} value={word}/>
                        </div>
                        <div className="results">
                        <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        add ?
                                            <tr className="new">
                                                <td >
                                                    <input type="text" onChange={(e) => {
                                                        setForm({
                                                            ...form,
                                                            codigo: e.target.value
                                                        })
                                                    }} value={form.codigo}/>
                                                </td>
                                                <td >
                                                    <input type="text" onChange={(e) => {
                                                        setForm({
                                                            ...form,
                                                            nombre: e.target.value
                                                        })
                                                    }} value={form.nombre}/>
                                                </td>                                        
                                                <td>
                                                    <input type="text" onChange={(e) => {
                                                        setForm({
                                                            ...form,
                                                            description: e.target.value
                                                        })
                                                    }} value={form.description}/>
                                                </td>
                                                <td>
                                                    <select name="" id="" onChange={(e) => {
                                                        setForm({
                                                            ...form,
                                                            type: e.target.value
                                                        })
                                                    }} value={form.type}>
                                                        <option value="MP">Materia prima</option>
                                                        <option value="comercial">Comercializar</option>
                                                    </select>
                                                </td>
                                                <td className="closeItem">
                                                    <div className="flex">
                                                        <button className="great" onClick={() => {
                                                            addFiltro()
                                                        }}>
                                                            <MdCheck />
                                                        </button>
                                                        <button className="cancel" onClick={() => setAdd(null)}>
                                                            <AiOutlineClose />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        :null
                                    }
                                    {
                                        params.get('add') == 'categoria' ?
                                            !categorias || loadingFiltros ?
                                                <h1>Cargnado</h1>
                                            :
                                            word ?
                                                filter && filter.length ?
                                                    filter.filter(m => 
                                                        m.name.toLowerCase().includes(word.toLowerCase()) || m.code.toLowerCase().includes(word.toLowerCase())
                                                    ).map((pv, i) => {
                                                        return (
                                                            <ItemFiltro filt={pv} key={i+1} />
                                                        )
                                                    })
                                                : <h1>No hay resultados de busqueda</h1>
                                            : categorias && categorias.length ?
                                                categorias.map((categoria, i) => {
                                                    return (
                                                        <ItemFiltro filt={categoria} key={i+1} />
                                                    )
                                                }) 
                                            : <h1>No hay</h1>
                                        : 
                                            !lineas  || loadingFiltros ?
                                                <h1>Cargnado</h1>
                                            :
                                            word ?
                                                filter && filter.length ?
                                                    filter.filter(m => 
                                                        m.name.toLowerCase().includes(word.toLowerCase()) || m.code.toLowerCase().includes(word.toLowerCase())
                                                    ).map((pv, i) => {
                                                        return (
                                                            <ItemFiltro filt={pv} key={i+1} />
                                                        )
                                                    })
                                                : <h1>No hay resultados de busqueda</h1>
                                            : lineas && lineas.length ?
                                                lineas.map((linea, i) => {
                                                    return (
                                                        <ItemFiltro filt={linea} key={i+1} />
                                                    )
                                                }) 
                                            : <h1>No hay</h1>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}