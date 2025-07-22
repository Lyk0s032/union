import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";


export default function NewCondicionesItem(){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        type: 'contado',
        plazo: 5
    });
    
    const addCondition = async () => {
        // Validamos
        if(!form.name || !form.type) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        setLoading(true)
        let body = {
            nombre: form.name,
            type: form.type,
            plazo: form.plazo
        }
        const send = await axios.post('/api/cotizacion/condiciones/post/new', body)
        .then(() => {
            dispatch(actions.axiosToGetCondiciones(false))
            dispatch(actions.HandleAlerta('Condición anexada con éxito', 'positive'))
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrador anexar esta condición', 'mistake'))
        })
        .finally(() => {
            setLoading(false);
        })
        return send;

    }

    return (
        <div className="long New" >
            <tr > 
                <td className="codingg">
                    <div className="code">
                        <h3>?</h3>
                    </div>
                </td>
                <td className="largo" >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <select name="" id="" className="type" onChange={(e) => {
                                setForm({
                                    ...form,
                                    type: e.target.value
                                })
                            }} value={form.type}>
                                <option value="contado">Contado</option>
                                <option value="credito">Credito</option>
                            </select>
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <input type="text" placeholder="Nombre de la condición" onChange={(e) => {
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }} value={form.name}/><br />
                            <span>En creación...</span>
                        </div>
                    </div>
                </td>
                <td className="days"> 
                    <select name="" id="" className="timeSelect" onChange={(e) => {
                            setForm({
                                ...form,
                                plazo: e.target.value
                            })
                        }} value={form.plazo}>
                        <option value="5">5 días</option>
                    </select>
                </td> 
 
                <td className="btns"> 
                    <div className="menu-container" >
                        <div className="" style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'start'}}>
                            <button className="btnOptions" onClick={() => {
                                addCondition();
                            }}>
                            {/* Icono de tres puntos */}
                                <span>Crear</span>
                            </button>
                            <button className="btnOptions">
                            {/* Icono de tres puntos */}
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </div>
                </td>


                
            </tr>
        </div>
    )
}

