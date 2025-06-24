import axios from "axios";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../../store/action/action';

export default function ItemFiltro(props){
    const [canal, setCanal] = useState(null);
    const filtro = props.filt;
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        code: filtro.code,
        name: filtro.name,
        description: filtro.description,
        type: filtro.type
    })
    const edit = () => {
        setCanal(true)
    }
    // Editar filtro
    const updateFiltro = async() => {
        if(!form.name) return dispatch(actions.HandleAlerta('Debes ingresar un nombre valido.', 'mistake'))
        
        // Avanzamos...
        const body = {
            lineaId: filtro.id,
            name: form.name,
            description: form.description,
            type: form.type
        }
        const url = params.get('add') == 'categoria' ? 'api/categorias/new' : 'api/lineas/new';
        const addExt = await axios.put(url, body)

        .then(res => {
            dispatch(actions.axiosToGetFiltros(false))
            dispatch(actions.HandleAlerta('Filtro actualizado con exito', 'positive'))
            setCanal(null);
            return res;
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado agregar este filtro, intentalo más tarde', 'mistake'))
            return err;
        })
        return addExt;
    }
    return (
        !canal ?
            <tr onDoubleClick={() => edit()} id={filtro.id}>
                <td>{filtro.code}</td>
                <td>{filtro.name}</td>
                <td>{filtro.description}</td>
                <td>
                    {filtro.type}
                </td>
                <td>

                </td>
            </tr>       
            : 
            <tr className="new" id={filtro.id}>
                    <td >
                        {form.code}
                    </td>
                    <td >
                        <input type="text" onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }} value={form.name} />
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
                            <button className="great" onClick={() => updateFiltro()}>
                                <MdCheck />
                            </button>
                            <button className="cancel" onClick={() => setCanal(null)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                    </td>
                </tr>
    )
}