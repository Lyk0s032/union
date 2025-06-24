import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { MdCheck } from "react-icons/md";

import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function ModalAddExtensiones(){
    const [params, setParams] = useSearchParams();
    const [add, setAdd] = useState(null);
    const [canal, setCanal] = useState(null);

    // Datos para crear nueva extensión
    const [form, setForm] = useState({
        codigo:null,
        nombre: null,
        description: null
    });


    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);

    const { extensiones, loadingFiltros } = sistema;


    const [filter, setFilter] = useState(extensiones);
    const [word, setWord] = useState(null);
    

    const addExtension = async() => {
        if(!form.codigo || !form.nombre) return dispatch(actions.HandleAlerta('Debes llenar los datos', 'mistake'))
        
        // Avanzamos...
        const body = {
            code: form.codigo,
            name: form.nombre,
            description: form.description
        }
        const addExt = await axios.post('/api/extension/new', body)
        .then(res => {
            dispatch(actions.axiosToGetFiltros(false))
            dispatch(actions.HandleAlerta('Extensión agregar con exito', 'positive'))
            setAdd(null);
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado agregar extensión, intentalo más tarde', 'mistake'))
        })
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
                        <h3>Extensiones</h3>
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
                            <input type="text" placeholder="Buscar extensiones aquí"  onChange={(e) => {
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        add ?
                                            <tr className="new ExtensionFila">
                                                <td >
                                                    <div className="divideCode">
                                                        <div className="color" style={{
                                                            backgroundColor: form.codigo ? form.codigo: '#ccc'
                                                        }}></div>
                                                        <div className="name">
                                                            <input type="text" onChange={(e) => {
                                                                setForm({
                                                                    ...form,
                                                                    codigo: e.target.value
                                                                })
                                                            }} value={form.codigo}/>
                                                        </div>
                                                    </div>
                                                    
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
                                                <td className="closeItem">
                                                    <div className="flex">
                                                        <button className="great" onClick={() => addExtension()}>
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
                                        !extensiones || loadingFiltros ? 
                                            null
                                        :
                                        extensiones && extensiones.length ? 
                                            word ?
                                                filter && filter.length ?
                                                    filter.filter(m => 
                                                        m.name.toLowerCase().includes(word.toLowerCase()) || m.code.toLowerCase().includes(word.toLowerCase())
                                                    ).map((pv, i) => {
                                                        return (
                                                            <tr className="ExtensionFila" id={`elemento-${pv.id}`} key={i+1}>
                                                                <td>
                                                                    <div className="divideCode">
                                                                        <div className="color" style={{backgroundColor: pv.code}}></div>
                                                                        <div className="name">
                                                                            <span>{pv.code}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>{pv.name}</td>
                                                                <td>{pv.description}</td>
                                                            </tr> 
                                                        )
                                                    })
                                                : <h1>No hay resultados de busqueda</h1>
                                            :
                                            extensiones.map((ext, i) => {
                                                return (
                                                    <tr className="ExtensionFila" key={i+1}>
                                                        <td>
                                                            <div className="divideCode">
                                                                <div className="color" style={{backgroundColor: ext.code}}></div>
                                                                <div className="name">
                                                                    <span>{ext.code}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{ext.name}</td>
                                                        <td>{ext.description}</td>
                                                    </tr>  
                                                )
                                            })
                                        :
                                            <h1>No hay resultados</h1>
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