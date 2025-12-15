import React, { useState } from 'react';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';
import { useDispatch } from 'react-redux';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function ItemRequisicion({ requisicion, requisiciones, clean, add }){
    
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    let creadoFecha = dayjs(requisicion.fecha).format("D [de] MMMM YYYY, h:mm A");
    let fechaNecesaria = dayjs(requisicion.fechaNecesaria).format("D [de] MMMM YYYY, h:mm A");


    const handleClick = (e) => {
        if (e.ctrlKey) {
            const existe = requisiciones.includes(requisicion.id);
            if (existe) {
                // Si ya existe, lo quitamos
                const nuevo = requisiciones.filter(m => m !== requisicion.id);
                clean(nuevo)
            } else {
                // Si no existe, lo agregamos (sin mutar el array original)
                add(requisicion.id);
            }

        } else {
            dispatch(actions.getIDs([requisicion.id]))
            params.set('s', 'materia')
            setParams(params)
        }
    };

    const [time, setTime] = useState(false);
    let fechita = dayjs(requisicion.fecha).format('YYYY-MM-DD');

    const [fechaBase, setFechaBase] = useState(fechita)
    const [addNumber, setAdd] = useState(5);
    const [loading, setLoading] = useState(false);

    const updateTime = async () => {
        try{
            if(!addNumber ||  !fechaBase) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios.', 'mistake'))
            setLoading(true)
            let body = {
                requisicionId: requisicion.id,
                fecha: fechaBase,
                necesaria: Number(addNumber)
            }

            const send = await axios.put('/api/requisicion/put/update/requisicion/times', body)
            .then((res) => {
                dispatch(actions.axiosToGetRequisicions(true))
                dispatch(actions.HandleAlerta('Fecha actualizada con exito.', 'positive'))
            })
            .finally(() => {
                setLoading(false)
            })
        }catch(err){
            setLoading(false)
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado actualizar fechas', 'mistake'))
        }
    }
    return (
        !time ?
            <tr className={requisiciones.find(r => r == requisicion.id) ? 'Active' : null} style={{cursor:'pointer'}} 
            onClick={handleClick} onContextMenu={(e) => {
                e.preventDefault();
                setTime(true)
            }}>
                <td  className="coding">
                    <div className="code">
                        <h3>{requisicion.id}</h3>
                    </div>
                </td>
                <td className="longer" >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{requisicion.cotizacion.client.nombre}</span>
                            <span style={{marginLeft:10}}>{requisicion.cotizacion.id + Number(21719) }</span>
                        </div>
                        <div className="nameData">
                            <h3>{requisicion.nombre}</h3>
                            <span>{requisicion.estado}</span> 
                        </div>
                    </div>
                </td>
                <td className="tdPrice" style={{fontSize:11}}>
                    <span>{creadoFecha}</span>
                </td> 
                <td className="tdPrice" style={{fontSize:11}}>
                    <span>{fechaNecesaria}</span>
                </td>            
    
            </tr>
        :
            <tr className={requisiciones.find(r => r == requisicion.id) ? 'Active' : null} style={{cursor:'pointer'}} 
            onContextMenu={(e) => {
                e.preventDefault()
                setTime(false)
            }}>
                <td  className="coding">
                    <div className="code">
                        <h3>{requisicion.id}</h3>
                    </div>
                </td>
                <td className="longer" >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{requisicion.cotizacion.client.nombre}</span>
                            <span style={{marginLeft:10}}>{requisicion.cotizacion.id + Number(21719) }</span>
                        </div>
                        <div className="nameData">
                            <h3>{requisicion.nombre}</h3>
                            <span>{requisicion.estado}</span> 
                        </div>
                    </div>
                </td>
                <td className="tdPrice" style={{fontSize:11}}>
                    <input type="date" value={fechaBase} onChange={(e) => {
                        setFechaBase(e.target.value)
                    }}/>
                    <span>Fecha recibido</span>
                </td> 
                <td className="tdPrice" style={{fontSize:11}}>
                    <input type="text" onChange={(e) => {
                        setAdd(e.target.value)
                    }} value={addNumber} />
                    <span>Click derecho para cancelar</span>
                </td>     
                <td className="tdPrice" style={{fontSize:11}}>
                    {
                        loading ?
                            <span>Cargando...</span>
                        :
                        <button onClick={() => {
                            if(!loading){
                                return updateTime()
                            } 
                        }}> 
                            <span>Actualizar</span>
                        </button>
                    }
                </td>                
    
            </tr>
    )
}