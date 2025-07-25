import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";

export default function CotizacionItemGeneral(props){
    const r = props.item;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
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
            <span>{r.condicionesPago ? r.condicionesPago.nombre : null}</span>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
            <span>{r.days} Días de entrega</span>
        </td>

        <td>
            <button onClick={() => {
                if(!loading){
                    handleAprobar()
                }
            }}>
                {loading ? 'Aprobando...' : 'Aprobar'}
            </button>
        </td>
    </tr>
    )
}