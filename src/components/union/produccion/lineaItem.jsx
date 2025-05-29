import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPromedio } from "./calculo";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import AreYouSecure from "./modal/secure";
import axios from "axios";

export default function LineaItem(props){
    const [params, setParams] = useSearchParams();
    const [change, setChange] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [remove, setRemove] = useState(false);
    const linea = props.linea;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
            
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        final: linea.percentages && linea.percentages.length ? linea.percentages[0].final : 0,
        distribuidor: linea.percentages && linea.percentages.length ? linea.percentages[0].distribuidor : 0
    }) 

    const sendUpdate = async() => {
        if(!form.final || !form.distribuidor) return dispatch(actions.HandleAlerta('No debes dejar campos vacios.'));
        let body = {
            lineaId: linea.id,
            distribuidor: form.distribuidor,
            final: form.final,
            userId: user.user.id 
        }
        const send = await axios.post('/api/lineas/post/percentage', body)
        .then(res => {
            dispatch(actions.HandleAlerta('Porcentajes editados con éxito.', 'positive'));
            dispatch(actions.axiosToGetPorcentajes(false))
            setChange(null)
            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado actualizar este porcentaje.', 'mistake'))
            return err;
        })
        return send
    }
    return (
        !change ? 
        <tr id="1">
            <td onClick={() => {
                params.set('w', 'newKit')
                setParams(params);
            }}>{linea.id}</td>
            <td onClick={() => {
                params.set('w', 'newKit')
                setParams(params);
            }}>{linea.name}</td>
            <td style={{fontSize:11}}>{linea.percentages && linea.percentages.length ?linea.percentages[0].final : null}</td>
            <td style={{fontSize:11}}>{linea.percentages && linea.percentages.length ?linea.percentages[0].distribuidor : null}</td>
            <td className="btnKits">
                <button onClick={() => setChange('edit')}>Editar</button>
            </td>

        </tr>
        :
        <tr id="1">
            <td onClick={() => {
                params.set('w', 'newKit')
                setParams(params);
            }}>{linea.id}</td>
            <td onClick={() => {
                params.set('w', 'newKit')
                setParams(params);
            }}>{linea.name}</td>
            <td style={{fontSize:11}}><input type="text" value={form.final} onChange={(e) => {
                setForm({
                    ...form,
                    final: e.target.value
                })
            }} /></td>
            <td style={{fontSize:11}}><input type="text" value={form.distribuidor} onChange={(e) => {
                setForm({
                    ...form,
                    distribuidor: e.target.value
                })
            }} /></td>
            <td className="btnKits">
                <button onClick={() => sendUpdate()}><span>Confirmar</span></button>
                <button onClick={() => setChange(null)}>Cancelar</button>
            </td>

        </tr>
    )
}