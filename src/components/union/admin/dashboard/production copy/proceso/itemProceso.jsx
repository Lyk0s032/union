import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";

export default function CotizacionItemProceso(props){
    const r = props.item;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
    // Aprobar 
    const handleAprobar = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/gotoproduction/${r.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización aprobada', 'positive')) 
            dispatch(actions.axiosToGetCotizacionesAdmin(false))

            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false)
        })
        return sendAprobation;
    } 
    // Cancelar
    const handleCancelar = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/put/comeback/desarrollo/${r.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Proyecto cancelado', 'positive')) 
            dispatch(actions.axiosToGetCotizacionesAdmin(false))

            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado cancelar este proyecto', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false)
        })
        return sendAprobation;
    } 

    const openCoti = async () => {
        dispatch(actions.axiosToGetCotizacion(true, r.id))
        params.set('watch', 'cotizacion');
        setParams(params);
    }
    return (
    <tr>
        <td className="coding">
            <div className="code" onClick={() => openCoti()}>
                <h3>{Number(21719) + r.id}</h3>
            </div>
        </td>
        <td className="longer" style={{width:'40%'}} onClick={() => openCoti()}> 
            <div className="titleNameKitAndData">
                <div className="extensionColor"> 
                    <span>{r.createdAt.split('T')[0] }</span>
                </div>
                <div className="nameData">
                    <h3>{r.name}</h3>
                </div>
            </div>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
                <div className="nameData">
                    <h3 style={{fontSize:12}}>{r.client.nombre}</h3>
                </div>
            <span>{r.condicionesPago ? r.condicionesPago.nombre : null}</span>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
            <span>{r.days} Días de entrega</span>
        </td>
        <td >
            <button onClick={() => handleCancelar()} style={{marginRight:5}}>
             <span>Cancelar</span>
           </button>
           <button onClick={() => handleAprobar()}>
             <span>A producción</span>
           </button>
        </td>
    </tr>
    )
}