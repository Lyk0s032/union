import React from 'react';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';
import { useDispatch } from 'react-redux';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español

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
    return (
        <tr className={requisiciones.find(r => r == requisicion.id) ? 'Active' : null} style={{cursor:'pointer'}} 
        onClick={handleClick}>
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
    )
}