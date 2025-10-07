import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import { BsPencil, BsThreeDots } from "react-icons/bs";

export default function ItemOrdenDeCompras({ item, openMenuId, toggleMenu  }){

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    

    const totalGeneral = item?.comprasCotizacionItems ? item.comprasCotizacionItems
    ?.reduce((acc, item) => acc + Number(item.precioTotal), 0) : 0
    // Aprobar 
    const handleAprobar = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/accept/${r.id}`)
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
    // Devolver cotización a comerciales
    const handleComeBackCotizacion = async() => {
        setLoading(true)
        const sendAprobation = await axios.put(`/api/cotizacion/admin/comeBack/${r.id}`)
        .then(res => {
            dispatch(actions.HandleAlerta('Cotización ha regresado a comerciales', 'positive')) 
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

    const openCoti = async () => {
        params.set('orden', item.id);
        setParams(params);
    }

    const openRemision = async () => {
        dispatch(actions.axiosToGetCotizacion(true, r.id))
        params.set('watch', 'remision');
        setParams(params);
    }

    return (
    <tr>
        <td className="coding">
            <div className="code" onClick={() => openCoti()}>
                <h3>{item.id}</h3>
            </div>
        </td>
        <td className="longer" style={{width:'40%'}} onClick={() => openCoti()}> 
            <div className="titleNameKitAndData">
                <div className="extensionColor"> 
                    <span>{item.createdAt.split('T')[0] }</span>
                </div>
                <div className="nameData">
                    <h3>{item.name}</h3>
                </div>
            </div>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
                <div className="nameData">
                    <h3 style={{fontSize:12}}>Valor</h3>
                </div>
            <span>{totalGeneral}</span>
        </td>
        <td className="middle" style={{width:'20%', fontSize:12, color: "#666"}}>
            <div className="nameData">
                    <h3 style={{fontSize:12}}>Cantidad proyectos</h3>
                </div>
            <span>{item.requisiciones.length}</span>
        </td>

        
    </tr>
    )
}